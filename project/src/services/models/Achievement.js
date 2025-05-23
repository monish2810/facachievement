import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  academicYear: String,
  certificateYear: Number,
  title: String,
  description: String,
  teacher: String, // should be teacherId like "T001"
  certificatePdf: { type: String, required: true }, // Now: Google Drive link (required)
  status: { type: String, enum: ['Under Review', 'Approved', 'Rejected'], default: 'Under Review' },
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: String,
});

export default mongoose.model('Achievement', AchievementSchema);