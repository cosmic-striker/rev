import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema({
  filename: { type: String, required: true, trim: true, unique: true },
  originalName: { type: String, required: true, trim: true },
  mimeType: { type: String, required: true, trim: true },
  size: { type: Number, required: true },
  width: { type: Number, default: null },
  height: { type: Number, default: null },
  url: { type: String, required: true, trim: true },
  mediaType: { type: String, enum: ['image', 'video', 'vector', 'other'], default: 'image' },
  uploadedBy: { type: String, default: 'Curator Admin' },
  altText: { type: String, default: '', trim: true },
  caption: { type: String, default: '', trim: true },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

mediaAssetSchema.index({ createdAt: -1 });
mediaAssetSchema.index({ mimeType: 1 });
mediaAssetSchema.index({ mediaType: 1 });
mediaAssetSchema.index({ url: 1 });

export default mongoose.models.MediaAsset || mongoose.model('MediaAsset', mediaAssetSchema);
