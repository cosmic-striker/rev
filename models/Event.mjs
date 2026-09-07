import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true, enum: ['workshops', 'exhibitions', 'shoots'] },
  eventDate: { type: Date, required: true },
  dateDisplay: { type: String, required: true },
  time: { type: String, default: '18:00' },
  endTime: { type: String, default: '' },
  location: { type: String, required: true },
  badge: { type: String, default: 'SEATS OPEN' },
  shortDescription: { type: String, default: '' },
  description: { type: String, required: true },
  coverImage: { type: String, default: '' },
  gallery: { type: [galleryItemSchema], default: [] },
  totalCapacity: { type: Number, default: 30 },
  seatsRemaining: { type: Number, default: 30 },
  isFlagship: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  status: { type: String, default: 'active', enum: ['active', 'draft', 'archived', 'sold_out', 'past'] }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);

