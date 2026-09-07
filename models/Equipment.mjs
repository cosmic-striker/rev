import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true, enum: ['checked_out', 'in_vault', 'darkroom', 'scheduled'] },
  statusLabel: { type: String, required: true },
  assignedTo: { type: String, default: '' },
  dueDate: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Equipment || mongoose.model('Equipment', equipmentSchema);
