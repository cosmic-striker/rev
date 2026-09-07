import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: '', trim: true },
  contactNumber: { type: String, default: '', trim: true },
  subject: { type: String, default: 'General Inquiry', trim: true },
  message: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'read', 'resolved', 'spam'] 
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  notes: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' }
}, { timestamps: true });

// Compound and search indexes for high performance querying
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ isRead: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ name: 'text', email: 'text', subject: 'text', message: 'text' });

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
