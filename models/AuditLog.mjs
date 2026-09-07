import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    default: null 
  },
  username: { 
    type: String, 
    default: 'anonymous' 
  },
  action: { 
    type: String, 
    required: true, 
    trim: true 
  },
  targetType: { 
    type: String, 
    trim: true, 
    default: 'system' 
  },
  targetId: { 
    type: String, 
    default: null 
  },
  details: { 
    type: String, 
    default: '' 
  },
  ip: { 
    type: String, 
    default: '' 
  },
  userAgent: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['success', 'warning', 'failure'], 
    default: 'success' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ username: 1 });
auditLogSchema.index({ targetType: 1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
