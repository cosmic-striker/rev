import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  discipline: { 
    type: String, 
    enum: ['direction', 'cinematography', 'sound', 'photo', 'design', 'production', 'general'],
    default: 'general', 
    trim: true 
  },
  disciplineCode: { type: String, default: 'LEAD • 01', trim: true },
  handle: { type: String, default: '', trim: true },
  portraitUrl: { type: String, required: true, trim: true },
  image: { type: String, trim: true }, // Alias for portraitUrl
  bio: { type: String, default: '', trim: true },
  academicYear: { type: String, default: '2025–2026', trim: true },
  isHeadOfDiscipline: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Compound and single field indexes for fast search and display ordering
teamMemberSchema.index({ order: 1 });
teamMemberSchema.index({ discipline: 1, status: 1 });
teamMemberSchema.index({ isArchived: 1 });
teamMemberSchema.index({ name: 'text', role: 'text', bio: 'text' });

export default mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);
