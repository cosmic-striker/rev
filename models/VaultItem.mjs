import mongoose from 'mongoose';

const vaultItemSchema = new mongoose.Schema({
  vaultId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  year: { type: String, required: true },
  category: { type: String, required: true },
  rollStock: { type: String, required: true },
  accessLevel: { type: String, default: 'Academic Commons' },
  assetUrl: { type: String, default: '' },
  fileSize: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.VaultItem || mongoose.model('VaultItem', vaultItemSchema);
