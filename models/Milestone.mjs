import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  year: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, default: 'Milestone', trim: true },
  image: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

milestoneSchema.index({ order: 1, year: 1 });
milestoneSchema.index({ status: 1 });
milestoneSchema.index({ createdAt: -1 });

export default mongoose.models.Milestone || mongoose.model('Milestone', milestoneSchema);
