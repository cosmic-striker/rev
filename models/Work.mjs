import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  workCode: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  discipline: { type: String, required: true, enum: ['narrative', 'photo', 'sound'] },
  disciplineLabel: { type: String, required: true },
  format: { type: String, required: true },
  camera: { type: String, required: true },
  synopsis: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  crew: { type: String, required: true },
  laurels: [{ type: String }],
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  aspectRatio: { type: String, default: '16:9' },
  gridSpan: { type: String, default: 'col-span-8' },
  isFeatured: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

workSchema.index({ order: 1 });
workSchema.index({ discipline: 1, status: 1 });
workSchema.index({ isArchived: 1 });

export default mongoose.models.Work || mongoose.model('Work', workSchema);
