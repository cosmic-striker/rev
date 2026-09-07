import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  applicantName: { type: String, required: true },
  discipline: { type: String, required: true },
  portfolioUrl: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'under_review', 'accepted', 'waitlisted', 'rejected'] },
  curatorNotes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
