import mongoose from 'mongoose';

const reelFrameSchema = new mongoose.Schema({
  rollCode: { type: String, required: true },
  location: { type: String, required: true },
  title: { type: String, required: true },
  timecode: { type: String, required: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.ReelFrame || mongoose.model('ReelFrame', reelFrameSchema);
