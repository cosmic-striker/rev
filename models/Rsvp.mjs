import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema({
  passId: { type: String, required: true, unique: true, index: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  eventTitle: { type: String, required: true },
  attendeeName: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, default: '' },
  gateStatus: { type: String, default: 'ALL-ACCESS PASS' },
  isCheckedIn: { type: Boolean, default: false },
  checkInTime: { type: Date },
  status: { type: String, default: 'confirmed', enum: ['confirmed', 'checked_in', 'cancelled'], index: true }
}, { timestamps: true });

rsvpSchema.index({ createdAt: -1 });

export default mongoose.models.Rsvp || mongoose.model('Rsvp', rsvpSchema);
