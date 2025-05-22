import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: String,
  designation: String,
  role: { type: String, enum: ['teacher', 'hod', 'admin', 'student'], required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
