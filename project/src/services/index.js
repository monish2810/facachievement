import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import fs from "fs";
import mongoose from 'mongoose';
import path from "path";
import Achievement from './models/Achievement.js';
import User from './models/User.js';

// Ensure files directory exists
const filesDir = path.join(process.cwd(), "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

const app = express();

app.use(cors());
app.use(express.json());

// Remove file upload and static file serving for achievements
// ...existing code...

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const conn = mongoose.connection;

// Only register routes after connection is open
conn.once('open', () => {
  // Upload achievement with Google Drive link
  app.post(
    '/api/achievements',
    async (req, res) => {
      try {
        const { academicYear, certificateYear, title, description, teacherId, certificatePdf } = req.body;
        if (!certificatePdf || typeof certificatePdf !== "string") {
          return res.status(400).json({ error: "Certificate PDF Google Drive link is required" });
        }
        let achievementData = {
          academicYear,
          certificateYear,
          title,
          description,
          teacher: teacherId,
          certificatePdf, // Google Drive link
          status: 'Under Review',
          submittedAt: new Date(),
        };

        const achievement = new Achievement(achievementData);
        await achievement.save();

        res.json({ status: "ok", achievement });
      } catch (err) {
        console.error("Error uploading achievement:", err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  // --- User Endpoints ---

  // Get all users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({}, '-password'); // Exclude password
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get current user profile (dummy: expects token with teacherId)
  app.get('/api/users/me', async (req, res) => {
    try {
      // For demo: get teacherId from query or header
      const teacherId = req.headers['x-teacher-id'] || req.query.teacherId;
      if (!teacherId) return res.status(400).json({ error: 'teacherId required' });
      const user = await User.findOne({ teacherId }, '-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update current user profile
  app.put('/api/users/me', async (req, res) => {
    try {
      const teacherId = req.headers['x-teacher-id'] || req.body.teacherId;
      if (!teacherId) return res.status(400).json({ error: 'teacherId required' });
      const user = await User.findOneAndUpdate({ teacherId }, req.body, { new: true, fields: '-password' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create user
  app.post('/api/users', async (req, res) => {
    try {
      // Always set role to "teacher" if not provided
      const userData = { ...req.body, role: req.body.role || "teacher" };
      const user = new User(userData);
      await user.save();
      const userObj = user.toObject();
      delete userObj.password;
      res.json(userObj);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update user role
  app.put('/api/users/:id/role', async (req, res) => {
    try {
      const { role } = req.body;
      let user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // If promoting to admin, demote all HODs to teacher
      if (role === "admin") {
        await User.updateMany({ role: "hod" }, { $set: { role: "teacher" } });
      }

      user.role = role;
      await user.save();
      const userObj = user.toObject();
      delete userObj.password;
      res.json(userObj);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Change password for current user
  app.put('/api/users/me/password', async (req, res) => {
    try {
      const teacherId = req.headers['x-teacher-id'] || req.body.teacherId;
      const { oldPassword, newPassword } = req.body;
      if (!teacherId || !oldPassword || !newPassword)
        return res.status(400).json({ error: 'teacherId, oldPassword, and newPassword required' });
      const user = await User.findOne({ teacherId });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (user.password !== oldPassword)
        return res.status(401).json({ error: 'Old password incorrect' });
      user.password = newPassword;
      await user.save();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Achievement Endpoints ---

  // Get all achievements
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await Achievement.find();
      res.json(achievements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get achievements for current user (expects teacherId)
  app.get('/api/achievements/me', async (req, res) => {
    try {
      const teacherId = req.headers['x-teacher-id'] || req.query.teacherId;
      if (!teacherId) return res.status(400).json({ error: 'teacherId required' });
      const achievements = await Achievement.find({ teacher: teacherId });
      res.json(achievements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get achievements for a specific teacher
  app.get('/api/achievements/teacher/:teacherId', async (req, res) => {
    try {
      const achievements = await Achievement.find({ teacher: req.params.teacherId });
      res.json(achievements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get pending achievements
  app.get('/api/achievements/pending', async (req, res) => {
    try {
      const achievements = await Achievement.find({ status: 'Under Review' });
      res.json(achievements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Review achievement (approve/reject)
  app.put('/api/achievements/:id/review', async (req, res) => {
    try {
      const { status, reviewedBy } = req.body;
      const achievement = await Achievement.findByIdAndUpdate(
        req.params.id,
        { status, reviewedBy, reviewedAt: new Date() },
        { new: true }
      );
      if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
      res.json(achievement);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { teacherId, password } = req.body;
      if (!teacherId || !password) {
        return res.status(400).json({ error: 'teacherId and password required' });
      }
      // Find user by teacherId
      const user = await User.findOne({ teacherId });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Compare password (plain text for demo; use hashing in production)
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Prepare user object without password
      const userObj = user.toObject();
      delete userObj.password;
      // Return user and a dummy token
      res.json({ user: userObj, token: "dummy-token" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});