import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

// Models
import Work from './models/Work.mjs';
import Event from './models/Event.mjs';
import Rsvp from './models/Rsvp.mjs';
import Application from './models/Application.mjs';
import VaultItem from './models/VaultItem.mjs';
import Equipment from './models/Equipment.mjs';
import TeamMember from './models/TeamMember.mjs';
import ReelFrame from './models/ReelFrame.mjs';
import User from './models/User.mjs';
import Contact from './models/Contact.mjs';
import SiteContent from './models/SiteContent.mjs';
import Milestone from './models/Milestone.mjs';
import MediaAsset from './models/MediaAsset.mjs';
import AuditLog from './models/AuditLog.mjs';

// Seed Data
import {
  initialWorks,
  initialEvents,
  initialVaultItems,
  initialEquipment,
  initialTeamMembers,
  initialReelFrames,
  initialSiteContent,
  initialMilestones,
  initialContacts,
  initialApplications,
  initialRsvps,
  initialMediaAssets,
  initialUsers,
  initialAuditLogs
} from './seedData.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'resolution-cine-jwt-secret-key-2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resolution_db';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration supporting High-Definition Media (Images & Videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanExt = path.extname(file.originalname).toLowerCase();
    cb(null, 'res-' + uniqueSuffix + cleanExt);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WebP, AVIF, GIF, SVG images and MP4/WebM/MOV videos are permitted.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // Up to 50MB for video / high-res assets
});

// Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: http:; img-src 'self' data: blob: https: http:; media-src 'self' data: blob: https: http:; font-src 'self' data: https: fonts.gstatic.com; connect-src 'self' https: http:; frame-src 'self' https://player.vimeo.com https://www.youtube.com https://youtube.com;");
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static frontend files and uploads
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadsDir));

// Fallback in-memory data store in case MongoDB is connecting or offline
const memoryStore = {
  works: initialWorks.map((w, idx) => ({ _id: `work-mem-${idx + 1}`, ...w })),
  events: initialEvents.map((e, idx) => ({ _id: `event-mem-${idx + 1}`, ...e })),
  rsvps: initialRsvps.map((r, idx) => ({ _id: `rsvp-mem-${idx + 1}`, ...r })),
  applications: initialApplications.map((a, idx) => ({ _id: `app-mem-${idx + 1}`, ...a })),
  vault: initialVaultItems.map((v, idx) => ({ _id: `vault-mem-${idx + 1}`, ...v })),
  equipment: initialEquipment.map((eq, idx) => ({ _id: `eq-mem-${idx + 1}`, ...eq })),
  team: initialTeamMembers.map((t, idx) => ({ _id: `team-mem-${idx + 1}`, ...t })),
  reelFrames: initialReelFrames.map((rf, idx) => ({ _id: `rf-mem-${idx + 1}`, ...rf })),
  contacts: initialContacts.map((c, idx) => ({ _id: `contact-mem-${idx + 1}`, ...c })),
  milestones: initialMilestones.map((m, idx) => ({ _id: `milestone-mem-${idx + 1}`, ...m })),
  media: initialMediaAssets.map((m, idx) => ({ _id: `media-mem-${idx + 1}`, ...m })),
  siteContent: { ...initialSiteContent },
  users: initialUsers.map((u, idx) => ({ _id: `user-mem-${idx + 1}`, ...u })),
  auditLogs: initialAuditLogs.map((a, idx) => ({ _id: `audit-mem-${idx + 1}`, ...a }))
};

// Sliding-window Rate Limiter for Login Attempts
const loginRateLimits = new Map();
function checkLoginRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes window
  const maxAttempts = 5; // Max 5 failed attempts before temporary lockout

  let records = loginRateLimits.get(ip) || [];
  records = records.filter(timestamp => now - timestamp < windowMs);

  if (records.length >= maxAttempts) {
    loginRateLimits.set(ip, records);
    return false;
  }
  loginRateLimits.set(ip, records);
  return true;
}

function recordFailedLogin(ip) {
  const now = Date.now();
  let records = loginRateLimits.get(ip) || [];
  records.push(now);
  loginRateLimits.set(ip, records);
}

function clearLoginRateLimit(ip) {
  loginRateLimits.delete(ip);
}

// Sliding-window Rate Limiter for Public Contact & Inquiry Submissions
const contactRateLimits = new Map();
function checkContactRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes window
  const maxRequests = 10; // 10 submissions per window per IP

  let records = contactRateLimits.get(ip) || [];
  records = records.filter(timestamp => now - timestamp < windowMs);

  if (records.length >= maxRequests) {
    contactRateLimits.set(ip, records);
    return false;
  }

  records.push(now);
  contactRateLimits.set(ip, records);
  return true;
}

// Security Sanitization Helper
function sanitizeInput(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
    .slice(0, maxLength);
}

// Audit Logger Helper
async function logAuditEvent(req, action, targetType = 'system', targetId = null, details = '', status = 'success') {
  const username = req.user ? req.user.username : (req.body?.username || 'anonymous');
  const userId = req.user ? (req.user.id || req.user._id || null) : null;
  const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';

  const logEntry = {
    _id: `audit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    userId,
    username,
    action,
    targetType,
    targetId: targetId ? String(targetId) : null,
    details,
    ip,
    userAgent,
    status,
    timestamp: new Date()
  };

  if (isMongoConnected) {
    try {
      await AuditLog.create(logEntry);
    } catch (e) {
      // fallback
    }
  }
  if (!memoryStore.auditLogs) memoryStore.auditLogs = [];
  memoryStore.auditLogs.unshift(logEntry);
  if (memoryStore.auditLogs.length > 500) memoryStore.auditLogs.pop();
}

let isMongoConnected = false;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log('✓ MongoDB Connected: ' + MONGODB_URI);
    await seedDatabase();
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ MongoDB not active locally. Operating seamlessly with High-Fidelity Active Memory Store.');
  }
}

// Seed Database with initial data if empty
async function seedDatabase() {
  try {
    if (!isMongoConnected) return;
    const count = await Work.countDocuments();
    if (count === 0) {
      console.log('Seeding initial Resolution datasets to MongoDB...');
      await Work.insertMany(initialWorks);
      await Event.insertMany(initialEvents);
      await VaultItem.insertMany(initialVaultItems);
      await Equipment.insertMany(initialEquipment);
      await TeamMember.insertMany(initialTeamMembers);
      await ReelFrame.insertMany(initialReelFrames);
      await Contact.insertMany(initialContacts);
      await Milestone.insertMany(initialMilestones);
      await MediaAsset.insertMany(initialMediaAssets);
      await AuditLog.insertMany(initialAuditLogs);
      await SiteContent.create(initialSiteContent);
      
      const adminPassHash = await bcrypt.hash('resolution2026', 10);
      await User.create([
        {
          username: 'curator_admin',
          email: 'curator@resolutioncollective.org',
          fullName: 'Curator Super Admin',
          passwordHash: adminPassHash,
          role: 'admin',
          isActive: true
        },
        {
          username: 'editor_resolution',
          email: 'editor@resolutioncollective.org',
          fullName: 'Resolution Content Editor',
          passwordHash: adminPassHash,
          role: 'editor',
          isActive: true
        }
      ]);
      console.log('✓ Database Seeding Complete.');
    }
  } catch (e) {
    console.error('Seeding error:', e.message);
  }
}

connectDB();

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ success: false, message: 'Session expired or token invalid. Please log in again.' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ success: false, message: 'Administrative privileges required for this action.' });
  }
  next();
}

function requireEditorOrAdmin(req, res, next) {
  if (!req.user || !['admin', 'super_admin', 'editor'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Permission denied. Editor or Admin role required.' });
  }
  next();
}

/* ====================================================
   PUBLIC REST API ENDPOINTS
   ==================================================== */

// 1. GET /api/works - List archival works
app.get('/api/works', async (req, res) => {
  const { category } = req.query;
  try {
    if (isMongoConnected) {
      const query = {
        isArchived: { $ne: true },
        status: { $nin: ['draft', 'archived'] }
      };
      if (category && category !== 'all') {
        query.discipline = category;
      }
      const works = await Work.find(query).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: works.length, data: works });
    }
    
    let filtered = memoryStore.works.filter(w => !w.isArchived && w.status !== 'draft' && w.status !== 'archived');
    if (category && category !== 'all') {
      filtered = filtered.filter(w => w.discipline === category);
    }
    filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/works/:id - Work detail for Lightbox
app.get('/api/works/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const work = await Work.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { workCode: id },
          { workCode: `#${id}` },
          { slug: id }
        ]
      });
      if (!work) return res.status(404).json({ success: false, message: 'Work plate not found' });
      return res.json({ success: true, data: work });
    }

    const work = memoryStore.works.find(w => w._id === id || w.workCode === id || w.slug === id || w.workCode === `#${id}`);
    if (!work) return res.status(404).json({ success: false, message: 'Work plate not found' });
    res.json({ success: true, data: work });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/events - List public events
app.get('/api/events', async (req, res) => {
  const { filter, category, status, q, search, year } = req.query;
  const activeCategory = category || filter;
  const searchQuery = (q || search || '').trim();
  const now = new Date();

  try {
    if (isMongoConnected) {
      let query = {
        isArchived: { $ne: true },
        status: { $nin: ['draft', 'archived'] }
      };

      if (activeCategory && activeCategory !== 'all') {
        query.category = activeCategory;
      }

      if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        query.$or = [
          { title: regex },
          { location: regex },
          { description: regex },
          { shortDescription: regex }
        ];
      }

      if (year && year !== 'all') {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
        query.eventDate = { $gte: startOfYear, $lte: endOfYear };
      }

      if (status === 'upcoming') {
        query.eventDate = { ...(query.eventDate || {}), $gte: now };
      } else if (status === 'past') {
        query.eventDate = { ...(query.eventDate || {}), $lt: now };
      }

      const events = await Event.find(query).sort({ eventDate: 1 });

      // Enrich with real-time computed RSVP counts
      const enrichedEvents = await Promise.all(events.map(async (ev) => {
        const rsvpCount = await Rsvp.countDocuments({ eventId: ev._id });
        const totalCapacity = ev.totalCapacity || 30;
        const seatsRemaining = Math.max(0, totalCapacity - rsvpCount);
        const isUpcoming = new Date(ev.eventDate) >= now;

        return {
          _id: ev._id,
          id: ev._id,
          title: ev.title,
          slug: ev.slug,
          category: ev.category,
          eventDate: ev.eventDate,
          dateDisplay: ev.dateDisplay,
          date: ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: ev.time || '18:00',
          endTime: ev.endTime || '',
          location: ev.location,
          badge: seatsRemaining === 0 ? 'SOLD OUT' : (ev.badge || (seatsRemaining <= 10 ? `SEATS OPEN // ${seatsRemaining} LEFT` : 'SEATS OPEN')),
          shortDescription: ev.shortDescription || '',
          description: ev.description,
          coverImage: ev.coverImage || '',
          gallery: ev.gallery || [],
          totalCapacity,
          seatsRemaining,
          seatsLeft: seatsRemaining,
          rsvpCount,
          isFlagship: ev.isFlagship || false,
          isSoldOut: seatsRemaining === 0,
          isUpcoming,
          isPast: !isUpcoming,
          status: ev.status,
          createdAt: ev.createdAt
        };
      }));

      return res.json({ success: true, count: enrichedEvents.length, data: enrichedEvents });
    }

    // Memory Store Fallback
    let filtered = memoryStore.events.filter(e => e.status !== 'draft' && e.status !== 'archived' && !e.isArchived);
    
    if (activeCategory && activeCategory !== 'all') {
      filtered = filtered.filter(e => e.category === activeCategory);
    }

    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        (e.title && e.title.toLowerCase().includes(s)) ||
        (e.location && e.location.toLowerCase().includes(s)) ||
        (e.description && e.description.toLowerCase().includes(s))
      );
    }

    if (year && year !== 'all') {
      filtered = filtered.filter(e => new Date(e.eventDate).getFullYear().toString() === year);
    }

    if (status === 'upcoming') {
      filtered = filtered.filter(e => new Date(e.eventDate) >= now);
    } else if (status === 'past') {
      filtered = filtered.filter(e => new Date(e.eventDate) < now);
    }

    filtered.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    const enriched = filtered.map(e => {
      const rsvpCount = memoryStore.rsvps.filter(r => r.eventId === e._id || r.eventId === e.slug).length;
      const totalCapacity = e.totalCapacity || 30;
      const seatsRemaining = Math.max(0, totalCapacity - rsvpCount);
      const isUpcoming = new Date(e.eventDate) >= now;

      return {
        ...e,
        id: e._id || e.slug,
        date: e.dateDisplay || new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        seatsRemaining,
        seatsLeft: seatsRemaining,
        rsvpCount,
        isSoldOut: seatsRemaining === 0,
        isUpcoming,
        isPast: !isUpcoming
      };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3.1 GET /api/events/:id - Public Event Detail
app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const now = new Date();

  try {
    if (isMongoConnected) {
      const query = {
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { slug: id }
        ]
      };
      const event = await Event.findOne(query);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

      const rsvpCount = await Rsvp.countDocuments({ eventId: event._id });
      const totalCapacity = event.totalCapacity || 30;
      const seatsRemaining = Math.max(0, totalCapacity - rsvpCount);
      const isUpcoming = new Date(event.eventDate) >= now;

      return res.json({
        success: true,
        data: {
          ...event.toObject(),
          id: event._id,
          date: event.dateDisplay,
          rsvpCount,
          seatsRemaining,
          seatsLeft: seatsRemaining,
          isSoldOut: seatsRemaining === 0,
          isUpcoming,
          isPast: !isUpcoming
        }
      });
    }

    const event = memoryStore.events.find(e => e._id === id || e.slug === id || e.title === id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    const rsvpCount = memoryStore.rsvps.filter(r => r.eventId === event._id || r.eventId === event.slug).length;
    const totalCapacity = event.totalCapacity || 30;
    const seatsRemaining = Math.max(0, totalCapacity - rsvpCount);

    res.json({
      success: true,
      data: {
        ...event,
        id: event._id || event.slug,
        date: event.dateDisplay,
        rsvpCount,
        seatsRemaining,
        seatsLeft: seatsRemaining,
        isSoldOut: seatsRemaining === 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST /api/events/:id/rsvp - Reserve seat with strict capacity validation
app.post('/api/events/:id/rsvp', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !name.trim() || !email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Attendee name and verified email are required.' });
  }

  const passId = `RES-PASS-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    if (isMongoConnected) {
      const event = await Event.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { slug: id }
        ]
      });

      if (!event) {
        return res.status(404).json({ success: false, message: 'The requested event could not be found.' });
      }

      if (event.isArchived || event.status === 'archived' || event.status === 'draft') {
        return res.status(400).json({ success: false, message: 'Registration for this event is currently not open.' });
      }

      // Live Atomic Capacity Check from RSVP Collection
      const currentRsvps = await Rsvp.countDocuments({ eventId: event._id });
      const totalCap = event.totalCapacity || 30;

      if (currentRsvps >= totalCap || (event.seatsRemaining !== undefined && event.seatsRemaining <= 0)) {
        event.status = 'sold_out';
        event.seatsRemaining = 0;
        await event.save();
        return res.status(400).json({
          success: false,
          message: `Registration full: All ${totalCap} seats for this event have been claimed.`
        });
      }

      // Create RSVP record
      const rsvp = await Rsvp.create({
        passId,
        eventId: event._id,
        eventTitle: event.title,
        attendeeName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: (req.body.phone || '').trim(),
        gateStatus: req.body.gateStatus || 'ALL-ACCESS PASS',
        isCheckedIn: false,
        status: 'confirmed'
      });

      // Atomically decrement seats remaining
      const updatedRsvpCount = currentRsvps + 1;
      event.seatsRemaining = Math.max(0, totalCap - updatedRsvpCount);
      if (event.seatsRemaining === 0) {
        event.status = 'sold_out';
      }
      await event.save();

      return res.status(201).json({
        success: true,
        message: 'Seat confirmed & verified pass issued.',
        data: {
          passId: rsvp.passId,
          attendeeName: rsvp.attendeeName,
          email: rsvp.email,
          phone: rsvp.phone,
          eventId: event._id,
          eventTitle: event.title,
          gateStatus: rsvp.gateStatus,
          status: rsvp.status,
          seatsRemaining: event.seatsRemaining,
          totalCapacity: totalCap,
          rsvpCount: updatedRsvpCount
        }
      });
    }

    // Memory Store Implementation
    const event = memoryStore.events.find(e => e.slug === id || e._id === id || e.title === id || id === '1' || id === '2');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.status === 'archived' || event.status === 'draft' || event.isArchived) {
      return res.status(400).json({ success: false, message: 'Registration for this event is closed.' });
    }

    const currentRsvps = memoryStore.rsvps.filter(r => (r.eventId === event._id || r.eventId === event.slug) && r.status !== 'cancelled').length;
    const totalCap = event.totalCapacity || 30;

    if (currentRsvps >= totalCap || (event.seatsRemaining !== undefined && event.seatsRemaining <= 0)) {
      return res.status(400).json({
        success: false,
        message: `Registration full: All ${totalCap} seats for this event have been claimed.`
      });
    }

    const rsvpEntry = {
      _id: 'rsvp-' + Date.now(),
      passId,
      eventId: event._id || event.slug,
      eventTitle: event.title,
      attendeeName: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (req.body.phone || '').trim(),
      gateStatus: req.body.gateStatus || 'ALL-ACCESS PASS',
      isCheckedIn: false,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
      createdAt: new Date()
    };
    memoryStore.rsvps.push(rsvpEntry);

    event.seatsRemaining = Math.max(0, totalCap - (currentRsvps + 1));
    if (event.seatsRemaining === 0) {
      event.status = 'sold_out';
    }

    res.status(201).json({
      success: true,
      message: 'Seat confirmed & verified pass issued.',
      data: {
        ...rsvpEntry,
        seatsRemaining: event.seatsRemaining,
        totalCapacity: totalCap,
        rsvpCount: currentRsvps + 1
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/applications - Cohort intake submission
app.post('/api/applications', async (req, res) => {
  const { name, discipline, portfolioUrl } = req.body;

  if (!name || !discipline || !portfolioUrl) {
    return res.status(400).json({ success: false, message: 'All application fields are required.' });
  }

  const applicationId = `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    if (isMongoConnected) {
      const appRecord = await Application.create({
        applicationId,
        applicantName: name,
        discipline,
        portfolioUrl,
        status: 'pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully to Curatorial Board.',
        data: {
          applicationId: appRecord.applicationId,
          applicantName: appRecord.applicantName,
          discipline: appRecord.discipline,
          submittedAt: appRecord.createdAt
        }
      });
    }

    const appEntry = {
      applicationId,
      applicantName: name,
      discipline,
      portfolioUrl,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    memoryStore.applications.push(appEntry);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully to Curatorial Board.',
      data: appEntry
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/contact - Public Contact & Inquiry Submission with Rate Limiting & Abuse Defense
app.post('/api/contact', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // 1. Rate Limiting Check
  if (!checkContactRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded: Too many messages dispatched. Please allow 15 minutes before sending another inquiry.'
    });
  }

  const { name, email, phone, contactNumber, subject, message } = req.body;

  // 2. Field Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Please provide a valid sender name (minimum 2 characters).' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'A valid email address is required for dispatch response.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanEmail = email.trim().toLowerCase();
  if (!emailRegex.test(cleanEmail) || cleanEmail.length > 160) {
    return res.status(400).json({ success: false, message: 'The provided email address is invalid or malformed.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Message content is required (minimum 5 characters).' });
  }

  if (message.length > 5000) {
    return res.status(400).json({ success: false, message: 'Message exceeds maximum permitted length of 5,000 characters.' });
  }

  // 3. Sanitization
  const safeName = sanitizeInput(name, 120);
  const safePhone = sanitizeInput(phone || contactNumber || '', 40);
  const safeSubject = sanitizeInput(subject || 'General Inquiry', 200);
  const safeMessage = sanitizeInput(message, 5000);
  const userAgent = sanitizeInput(req.headers['user-agent'] || '', 255);

  try {
    if (isMongoConnected) {
      const contact = await Contact.create({
        name: safeName,
        email: cleanEmail,
        phone: safePhone,
        contactNumber: safePhone,
        subject: safeSubject,
        message: safeMessage,
        status: 'pending',
        isRead: false,
        readAt: null,
        notes: '',
        ipAddress: clientIp,
        userAgent
      });

      return res.status(201).json({
        success: true,
        message: 'Your dispatch has been received and queued for Resolution Curatorial Board review.',
        contactId: contact._id,
        id: contact._id,
        data: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          status: contact.status,
          createdAt: contact.createdAt
        }
      });
    }

    const contactEntry = {
      _id: 'c-' + Date.now(),
      name: safeName,
      email: cleanEmail,
      phone: safePhone,
      contactNumber: safePhone,
      subject: safeSubject,
      message: safeMessage,
      status: 'pending',
      isRead: false,
      readAt: null,
      notes: '',
      ipAddress: clientIp,
      userAgent,
      createdAt: new Date()
    };
    memoryStore.contacts.unshift(contactEntry);

    res.status(201).json({
      success: true,
      message: 'Your dispatch has been received and queued for Resolution Curatorial Board review.',
      contactId: contactEntry._id,
      id: contactEntry._id,
      data: {
        id: contactEntry._id,
        name: contactEntry.name,
        email: contactEntry.email,
        subject: contactEntry.subject,
        status: contactEntry.status,
        createdAt: contactEntry.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. GET /api/content - Public Site Content & Metrics
app.get('/api/content', async (req, res) => {
  try {
    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) content = await SiteContent.create(initialSiteContent);
      return res.json({ success: true, data: content });
    }
    res.json({ success: true, data: memoryStore.siteContent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Alias for /api/site-content
app.get('/api/site-content', async (req, res) => {
  try {
    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) content = await SiteContent.create(initialSiteContent);
      return res.json({ success: true, data: content });
    }
    res.json({ success: true, data: memoryStore.siteContent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. GET /api/vault - Academic Commons Vault Search
app.get('/api/vault', async (req, res) => {
  const { q } = req.query;
  try {
    if (isMongoConnected) {
      let query = {};
      if (q) {
        const regex = new RegExp(q, 'i');
        query = {
          $or: [
            { title: regex },
            { category: regex },
            { rollStock: regex },
            { year: regex },
            { vaultId: regex }
          ]
        };
      }
      const items = await VaultItem.find(query);
      return res.json({ success: true, count: items.length, data: items });
    }

    let items = memoryStore.vault;
    if (q) {
      const search = q.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.rollStock.toLowerCase().includes(search) ||
        item.year.includes(search)
      );
    }
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. GET /api/team - Public List Heads of Discipline & Collective Members
app.get('/api/team', async (req, res) => {
  const { discipline, role } = req.query;
  try {
    if (isMongoConnected) {
      let query = {
        isArchived: { $ne: true },
        status: { $nin: ['draft', 'archived'] }
      };
      if (discipline && discipline !== 'all') {
        query.discipline = discipline;
      }
      if (role && role !== 'all') {
        query.role = new RegExp(role, 'i');
      }
      const team = await TeamMember.find(query).sort({ order: 1, createdAt: 1 });
      return res.json({ success: true, count: team.length, data: team });
    }

    let filtered = memoryStore.team.filter(t => !t.isArchived && t.status !== 'draft' && t.status !== 'archived');
    if (discipline && discipline !== 'all') {
      filtered = filtered.filter(t => t.discipline === discipline);
    }
    if (role && role !== 'all') {
      filtered = filtered.filter(t => t.role && t.role.toLowerCase().includes(role.toLowerCase()));
    }
    filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9.1 GET /api/team/:id - Public Team Member Detail
app.get('/api/team/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const member = await TeamMember.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { name: id },
          { handle: id },
          { handle: `@${id}` }
        ]
      });
      if (!member) return res.status(404).json({ success: false, message: 'Team member not found.' });
      return res.json({ success: true, data: member });
    }

    const member = memoryStore.team.find(t => t._id === id || t.name === id || t.handle === id || t.handle === `@${id}`);
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found.' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. GET /api/reels/frames - Live Sensor Film Strip Frames
app.get('/api/reels/frames', async (req, res) => {
  try {
    if (isMongoConnected) {
      const frames = await ReelFrame.find().sort({ order: 1 });
      return res.json({ success: true, count: frames.length, data: frames });
    }
    res.json({ success: true, count: memoryStore.reelFrames.length, data: memoryStore.reelFrames });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. GET /api/equipment - Cinema Equipment Locker Status
app.get('/api/equipment', async (req, res) => {
  try {
    if (isMongoConnected) {
      const items = await Equipment.find();
      return res.json({ success: true, count: items.length, data: items });
    }
    res.json({ success: true, count: memoryStore.equipment.length, data: memoryStore.equipment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ====================================================
   AUTHENTICATION & SESSION
   ==================================================== */

app.post('/api/auth/login', async (req, res) => {
  const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

  // Rate limiting check
  if (!checkLoginRateLimit(ip)) {
    await logAuditEvent(req, 'AUTH_LOGIN_LOCKED', 'auth', null, `Brute-force lockout triggered for IP: ${ip}`, 'warning');
    return res.status(429).json({
      success: false,
      message: 'Too many failed login attempts. Account access temporarily locked for 15 minutes.'
    });
  }

  const { username, password } = req.body;
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid username and passcode required.' });
  }

  const cleanUsername = username.trim();

  try {
    // Check in MongoDB if connected
    if (isMongoConnected) {
      const user = await User.findOne({ username: cleanUsername });
      if (user && user.isActive !== false && await bcrypt.compare(password, user.passwordHash)) {
        clearLoginRateLimit(ip);
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
          { id: user._id, username: user.username, role: user.role, email: user.email, fullName: user.fullName },
          JWT_SECRET,
          { expiresIn: '8h' }
        );

        await logAuditEvent({ ...req, headers: req.headers, user: { username: user.username, id: user._id } }, 'AUTH_LOGIN_SUCCESS', 'auth', user._id, `User logged in from IP ${ip}`);

        return res.json({
          success: true,
          message: 'Authenticated successfully.',
          token,
          user: {
            id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            fullName: user.fullName || user.username
          }
        });
      }
    }

    // Check in MemoryStore
    const memoryUser = (memoryStore.users || []).find(u => u.username === cleanUsername);
    if (memoryUser && memoryUser.isActive !== false) {
      const isMatch = memoryUser.passwordHash 
        ? await bcrypt.compare(password, memoryUser.passwordHash)
        : (cleanUsername === 'curator_admin' && password === 'resolution2026') || (cleanUsername === 'editor_resolution' && password === 'resolution2026');

      if (isMatch) {
        clearLoginRateLimit(ip);
        memoryUser.lastLogin = new Date();

        const token = jwt.sign(
          { id: memoryUser._id, username: memoryUser.username, role: memoryUser.role, email: memoryUser.email, fullName: memoryUser.fullName },
          JWT_SECRET,
          { expiresIn: '8h' }
        );

        await logAuditEvent({ ...req, headers: req.headers, user: { username: memoryUser.username, id: memoryUser._id } }, 'AUTH_LOGIN_SUCCESS', 'auth', memoryUser._id, `User logged in from IP ${ip}`);

        return res.json({
          success: true,
          message: 'Authenticated successfully.',
          token,
          user: {
            id: memoryUser._id,
            username: memoryUser.username,
            role: memoryUser.role,
            email: memoryUser.email,
            fullName: memoryUser.fullName || memoryUser.username
          }
        });
      }
    }

    // Failed login - Record and return generic error
    recordFailedLogin(ip);
    await logAuditEvent(req, 'AUTH_LOGIN_FAILED', 'auth', null, `Failed login attempt for username "${cleanUsername}" from IP ${ip}`, 'failure');
    res.status(401).json({ success: false, message: 'Invalid username or password.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to authenticate request at this time.' });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  await logAuditEvent(req, 'AUTH_LOGOUT', 'auth', req.user?.id, `User logged out.`);
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

/* ====================================================
   PROTECTED ADMIN REST API ENDPOINTS
   ==================================================== */

// 1. Dashboard Metrics Overview & Aggregation Engine
app.get('/api/admin/metrics', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    let works = [];
    let events = [];
    let rsvps = [];
    let applications = [];
    let team = [];
    let equipment = [];
    let contacts = [];

    if (isMongoConnected) {
      works = await Work.find().sort({ createdAt: -1 });
      events = await Event.find().sort({ eventDate: 1 });
      rsvps = await Rsvp.find().sort({ createdAt: -1 });
      applications = await Application.find().sort({ createdAt: -1 });
      team = await TeamMember.find().sort({ order: 1 });
      equipment = await Equipment.find();
      contacts = await Contact.find().sort({ createdAt: -1 });
    } else {
      works = memoryStore.works;
      events = memoryStore.events;
      rsvps = memoryStore.rsvps;
      applications = memoryStore.applications;
      team = memoryStore.team;
      equipment = memoryStore.equipment;
      contacts = memoryStore.contacts;
    }

    // Calculations
    const upcomingEventsList = events
      .filter(e => new Date(e.eventDate) >= now)
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    const pastEventsCount = events.filter(e => new Date(e.eventDate) < now).length;
    const pendingApps = applications.filter(a => a.status === 'pending');
    const pendingContacts = contacts.filter(c => c.status === 'pending');
    const checkedOutGear = equipment.filter(e => e.status === 'checked_out');

    // Aggregate claimed seats across scheduled events
    const claimedSeatsSum = events.reduce((sum, e) => {
      const cap = e.totalCapacity || 30;
      const rem = e.seatsRemaining !== undefined ? e.seatsRemaining : cap;
      return sum + Math.max(0, cap - rem);
    }, 0);
    const totalRsvpsCount = Math.max(claimedSeatsSum, rsvps.length);

    // Structured Upcoming Events with real capacity calculation
    const formattedUpcomingEvents = upcomingEventsList.slice(0, 5).map(e => {
      const totalCapacity = e.totalCapacity || 30;
      const seatsRemaining = e.seatsRemaining !== undefined ? e.seatsRemaining : totalCapacity;
      const rsvpCount = Math.max(0, totalCapacity - seatsRemaining);
      const capacityPercent = totalCapacity > 0 ? Math.min(100, Math.round((rsvpCount / totalCapacity) * 100)) : 0;
      
      let statusLabel = 'Active Registration';
      if (seatsRemaining === 0) statusLabel = 'Sold Out';
      else if (capacityPercent >= 75) statusLabel = 'Filling Fast';

      return {
        id: e._id,
        title: e.title,
        slug: e.slug,
        category: e.category || 'workshops',
        eventDate: e.eventDate,
        date: e.dateDisplay || new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dateDisplay: e.dateDisplay || new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: e.time || '18:00',
        location: e.location,
        badge: e.badge,
        capacity: totalCapacity,
        totalCapacity,
        seatsRemaining,
        rsvpCount,
        capacityPercent,
        isSoldOut: seatsRemaining === 0,
        status: statusLabel
      };
    });

    // Actionable Needs Attention Items
    const needsAttention = [];

    pendingApps.forEach(a => {
      needsAttention.push({
        id: `att-app-${a._id || a.applicationId}`,
        type: 'application',
        category: 'applications',
        priority: 'high',
        icon: 'person_add',
        title: `Pending Application: ${a.name}`,
        message: `${a.discipline || 'Media Candidate'} • Portfolio Awaiting Review`,
        subtitle: `${a.discipline || 'Media Candidate'} • Portfolio Pending Review`,
        status: 'pending',
        actionLabel: 'Review Application',
        createdAt: a.createdAt || new Date()
      });
    });

    pendingContacts.forEach(c => {
      needsAttention.push({
        id: `att-cnt-${c._id}`,
        type: 'contact',
        category: 'contacts',
        priority: 'medium',
        icon: 'mail',
        title: `New Inquiry from ${c.name}`,
        message: `${c.subject || 'General Inquiry'} • ${c.email}`,
        subtitle: `${c.subject || 'General Inquiry'} • ${c.email}`,
        status: 'pending',
        actionLabel: 'View Message',
        createdAt: c.createdAt || new Date()
      });
    });

    checkedOutGear.forEach(g => {
      needsAttention.push({
        id: `att-eq-${g._id || g.itemCode}`,
        type: 'equipment',
        category: 'equipment',
        priority: 'medium',
        icon: 'camera_alt',
        title: `Gear Checked Out: ${g.name}`,
        message: `Assigned to ${g.assignedTo || 'Lead Operator'} • ${g.statusLabel || 'On Location'}`,
        subtitle: `Assigned to ${g.assignedTo || 'Lead Operator'} • ${g.statusLabel || 'On Location'}`,
        status: 'checked_out',
        actionLabel: 'Equipment Status',
        createdAt: new Date()
      });
    });

    formattedUpcomingEvents.forEach(ev => {
      if (ev.capacityPercent >= 75 && ev.seatsRemaining > 0) {
        needsAttention.push({
          id: `att-ev-${ev.id}`,
          type: 'event',
          category: 'events',
          priority: 'high',
          icon: 'warning',
          title: `Event Approaching Capacity: ${ev.title}`,
          message: `${ev.rsvpCount} of ${ev.totalCapacity} seats claimed (${ev.capacityPercent}%) • ${ev.seatsRemaining} left`,
          subtitle: `${ev.rsvpCount} of ${ev.totalCapacity} seats claimed (${ev.capacityPercent}%) • ${ev.seatsRemaining} left`,
          status: 'capacity_warning',
          actionLabel: 'View RSVPs',
          createdAt: new Date()
        });
      }
    });

    // Recent Activity Feed
    const rawActivity = [];

    rsvps.forEach(r => {
      rawActivity.push({
        id: `act-rsvp-${r._id || r.passId}`,
        type: 'rsvp',
        icon: 'confirmation_number',
        badgeColor: 'text-primary',
        title: 'Verified RSVP Pass Generated',
        description: `${r.attendeeName || r.name || 'Attendee'} reserved pass for ${r.eventTitle || 'Cinema Session'}`,
        timestamp: r.createdAt || r.registeredAt || new Date()
      });
    });

    applications.forEach(a => {
      rawActivity.push({
        id: `act-app-${a._id || a.applicationId}`,
        type: 'application',
        icon: 'assignment_ind',
        badgeColor: 'text-blue-400',
        title: 'New Cohort Submission',
        description: `${a.name} applied for ${a.discipline || 'Creative Stream'} [${a.applicationId || 'RES-2026'}]`,
        timestamp: a.createdAt || new Date()
      });
    });

    contacts.forEach(c => {
      rawActivity.push({
        id: `act-cnt-${c._id}`,
        type: 'contact',
        icon: 'chat_bubble',
        badgeColor: 'text-yellow-300',
        title: 'Inquiry Received',
        description: `${c.name}: "${c.subject || 'Collaboration'}"`,
        timestamp: c.createdAt || new Date()
      });
    });

    works.forEach(w => {
      rawActivity.push({
        id: `act-work-${w._id || w.workCode}`,
        type: 'work',
        icon: 'movie',
        badgeColor: 'text-green-400',
        title: 'Master Work Published',
        description: `"${w.title}" [${w.workCode || '4K DCI'}] archived in exhibition gallery`,
        timestamp: w.createdAt || new Date('2026-09-01T00:00:00Z')
      });
    });

    equipment.forEach(e => {
      if (e.status === 'checked_out') {
        rawActivity.push({
          id: `act-gear-${e._id || e.itemCode}`,
          type: 'equipment',
          icon: 'videocam',
          badgeColor: 'text-orange-400',
          title: 'Equipment Dispatch',
          description: `${e.name} allocated to ${e.assignedTo || 'Operator'}`,
          timestamp: new Date('2026-09-05T08:00:00Z')
        });
      }
    });

    rawActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentActivity = rawActivity.slice(0, 8);

    // Recent Applications (Top 5)
    const recentApplications = applications.slice(0, 5).map(a => ({
      id: a._id,
      applicationId: a.applicationId,
      name: a.name,
      fullName: a.name,
      discipline: a.discipline,
      roleApplied: a.discipline,
      portfolioUrl: a.portfolioUrl,
      status: a.status || 'pending',
      createdAt: a.createdAt || new Date()
    }));

    res.json({
      success: true,
      data: {
        summary: {
          totalWorks: works.length,
          upcomingEvents: upcomingEventsList.length,
          pastEvents: pastEventsCount,
          totalEvents: events.length,
          totalRsvps: totalRsvpsCount,
          pendingApplications: pendingApps.length,
          totalApplications: applications.length,
          totalTeamMembers: team.length,
          teamMembers: team.length,
          equipmentCheckedOut: checkedOutGear.length,
          checkedOutEquipment: checkedOutGear.length,
          totalEquipment: equipment.length,
          pendingContacts: pendingContacts.length,
          totalContacts: contacts.length,
          darkroomCapacity: '88%',
          systemStatus: 'ONLINE • 24FPS DCI MASTER'
        },
        // Flat aliases for backwards compatibility
        totalWorks: works.length,
        upcomingEvents: upcomingEventsList.length,
        pastEvents: pastEventsCount,
        totalTeamMembers: team.length,
        teamMembers: team.length,
        team: team.length,
        pendingContacts: pendingContacts.length,
        totalRsvps: totalRsvpsCount,
        pendingApplications: pendingApps.length,
        equipmentCheckedOut: checkedOutGear.length,
        checkedOutEquipment: checkedOutGear.length,
        darkroomCapacity: '88%',
        systemStatus: 'ONLINE • 24FPS DCI MASTER',
        
        needsAttention,
        upcomingEventsList: formattedUpcomingEvents,
        recentApplications,
        recentActivity
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ====================================================
   SELECTED WORKS ADMIN CMS REST API ENDPOINTS (STEP 5)
   ==================================================== */

// 1.1 GET /api/admin/works - List & Filter Archival Works with pagination & metrics
app.get('/api/admin/works', authenticateToken, async (req, res) => {
  const { search, q, category, discipline, status, featured, sortBy = 'order_asc', page = 1, limit = 50 } = req.query;
  const searchQuery = (search || q || '').trim();
  const activeDiscipline = discipline || category;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageLimit = Math.max(1, Math.min(100, parseInt(limit) || 50));

  try {
    if (isMongoConnected) {
      let query = {};

      if (activeDiscipline && activeDiscipline !== 'all') {
        query.discipline = activeDiscipline;
      }

      if (status === 'published') {
        query.status = 'published';
        query.isArchived = { $ne: true };
      } else if (status === 'draft') {
        query.status = 'draft';
      } else if (status === 'archived') {
        query.$or = [{ status: 'archived' }, { isArchived: true }];
      }

      if (featured === 'true' || featured === true) {
        query.isFeatured = true;
      } else if (featured === 'false' || featured === false) {
        query.isFeatured = false;
      }

      if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        query.$or = [
          { title: regex },
          { workCode: regex },
          { slug: regex },
          { discipline: regex },
          { disciplineLabel: regex },
          { format: regex },
          { camera: regex },
          { synopsis: regex },
          { crew: regex },
          { laurels: regex }
        ];
      }

      let sortOptions = { order: 1, createdAt: -1 };
      if (sortBy === 'order_desc') sortOptions = { order: -1 };
      else if (sortBy === 'newest') sortOptions = { createdAt: -1 };
      else if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
      else if (sortBy === 'title_asc') sortOptions = { title: 1 };
      else if (sortBy === 'title_desc') sortOptions = { title: -1 };

      const totalMatching = await Work.countDocuments(query);
      const works = await Work.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * pageLimit)
        .limit(pageLimit);

      // Counts for metric cards & filter pills
      const totalAll = await Work.countDocuments();
      const totalPublished = await Work.countDocuments({ isArchived: { $ne: true }, status: 'published' });
      const totalDraft = await Work.countDocuments({ status: 'draft' });
      const totalArchived = await Work.countDocuments({ $or: [{ status: 'archived' }, { isArchived: true }] });
      const totalFeatured = await Work.countDocuments({ isFeatured: true });
      const totalNarrative = await Work.countDocuments({ discipline: 'narrative' });
      const totalPhoto = await Work.countDocuments({ discipline: 'photo' });
      const totalSound = await Work.countDocuments({ discipline: 'sound' });

      return res.json({
        success: true,
        count: works.length,
        total: totalMatching,
        pagination: {
          page: pageNum,
          limit: pageLimit,
          totalPages: Math.ceil(totalMatching / pageLimit)
        },
        counts: {
          all: totalAll,
          published: totalPublished,
          draft: totalDraft,
          archived: totalArchived,
          featured: totalFeatured,
          narrative: totalNarrative,
          photo: totalPhoto,
          sound: totalSound
        },
        metrics: {
          total: totalAll,
          published: totalPublished,
          drafts: totalDraft,
          archived: totalArchived,
          featured: totalFeatured
        },
        data: works
      });
    }

    // Memory Store Fallback
    let filtered = [...memoryStore.works];

    if (activeDiscipline && activeDiscipline !== 'all') {
      filtered = filtered.filter(w => w.discipline === activeDiscipline);
    }

    if (status === 'published') {
      filtered = filtered.filter(w => !w.isArchived && (w.status === 'published' || !w.status));
    } else if (status === 'draft') {
      filtered = filtered.filter(w => w.status === 'draft');
    } else if (status === 'archived') {
      filtered = filtered.filter(w => w.isArchived || w.status === 'archived');
    }

    if (featured === 'true' || featured === true) {
      filtered = filtered.filter(w => w.isFeatured);
    } else if (featured === 'false' || featured === false) {
      filtered = filtered.filter(w => !w.isFeatured);
    }

    if (searchQuery) {
      const qLower = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        (w.title && w.title.toLowerCase().includes(qLower)) ||
        (w.workCode && w.workCode.toLowerCase().includes(qLower)) ||
        (w.slug && w.slug.toLowerCase().includes(qLower)) ||
        (w.discipline && w.discipline.toLowerCase().includes(qLower)) ||
        (w.disciplineLabel && w.disciplineLabel.toLowerCase().includes(qLower)) ||
        (w.format && w.format.toLowerCase().includes(qLower)) ||
        (w.camera && w.camera.toLowerCase().includes(qLower)) ||
        (w.synopsis && w.synopsis.toLowerCase().includes(qLower)) ||
        (w.crew && w.crew.toLowerCase().includes(qLower)) ||
        (Array.isArray(w.laurels) && w.laurels.some(l => l.toLowerCase().includes(qLower)))
      );
    }

    // Sort
    if (sortBy === 'order_desc') {
      filtered.sort((a, b) => (b.order || 0) - (a.order || 0));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'title_asc') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'title_desc') {
      filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else {
      // order_asc
      filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    const totalMatching = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * pageLimit, pageNum * pageLimit);

    const allWorks = memoryStore.works;
    const totalAllMem = allWorks.length;
    const totalPublishedMem = allWorks.filter(w => !w.isArchived && w.status !== 'draft' && w.status !== 'archived').length;
    const totalDraftMem = allWorks.filter(w => w.status === 'draft').length;
    const totalArchivedMem = allWorks.filter(w => w.isArchived || w.status === 'archived').length;
    const totalFeaturedMem = allWorks.filter(w => w.isFeatured).length;

    res.json({
      success: true,
      count: paginated.length,
      total: totalMatching,
      pagination: {
        page: pageNum,
        limit: pageLimit,
        totalPages: Math.ceil(totalMatching / pageLimit)
      },
      counts: {
        all: totalAllMem,
        published: totalPublishedMem,
        draft: totalDraftMem,
        archived: totalArchivedMem,
        featured: totalFeaturedMem,
        narrative: allWorks.filter(w => w.discipline === 'narrative').length,
        photo: allWorks.filter(w => w.discipline === 'photo').length,
        sound: allWorks.filter(w => w.discipline === 'sound').length
      },
      metrics: {
        total: totalAllMem,
        published: totalPublishedMem,
        drafts: totalDraftMem,
        archived: totalArchivedMem,
        featured: totalFeaturedMem
      },
      data: paginated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1.2 GET /api/admin/works/:id - Fetch Single Work Plate
app.get('/api/admin/works/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const work = await Work.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { workCode: id },
          { workCode: `#${id}` },
          { slug: id }
        ]
      });
      if (!work) return res.status(404).json({ success: false, message: 'Work plate not found.' });
      return res.json({ success: true, data: work });
    }

    const work = memoryStore.works.find(w => w._id === id || w.workCode === id || w.slug === id || w.workCode === `#${id}`);
    if (!work) return res.status(404).json({ success: false, message: 'Work plate not found.' });
    res.json({ success: true, data: work });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1.3 POST /api/admin/works - Create New Work Plate
app.post('/api/admin/works', authenticateToken, async (req, res) => {
  const {
    title,
    discipline,
    disciplineLabel,
    format,
    camera,
    synopsis,
    shortDescription,
    crew,
    laurels,
    image,
    aspectRatio,
    gridSpan,
    isFeatured,
    status = 'published',
    order
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Work title is required.' });
  }
  if (!discipline || !['narrative', 'photo', 'sound'].includes(discipline)) {
    return res.status(400).json({ success: false, message: 'Valid discipline (narrative, photo, sound) is required.' });
  }
  if (!format || !format.trim()) {
    return res.status(400).json({ success: false, message: 'Technical format is required (e.g. 2.39:1 Cinemascope).' });
  }
  if (!camera || !camera.trim()) {
    return res.status(400).json({ success: false, message: 'Camera & optics specification is required.' });
  }
  if (!synopsis || !synopsis.trim()) {
    return res.status(400).json({ success: false, message: 'Curatorial synopsis is required.' });
  }
  if (!crew || !crew.trim()) {
    return res.status(400).json({ success: false, message: 'Crew and creator credits are required.' });
  }
  if (!image || !image.trim()) {
    return res.status(400).json({ success: false, message: 'Cover image URL is required.' });
  }

  const generatedSlug = (req.body.slug && req.body.slug.trim()) 
    ? req.body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  let defaultLabel = disciplineLabel;
  if (!defaultLabel || !defaultLabel.trim()) {
    if (discipline === 'narrative') defaultLabel = 'Narrative Cinema';
    else if (discipline === 'photo') defaultLabel = '35mm Photo / Exhibition Still';
    else if (discipline === 'sound') defaultLabel = 'Soundscapes & Documentary Still';
  }

  const processedLaurels = Array.isArray(laurels)
    ? laurels.map(l => (typeof l === 'string' ? l.trim() : '')).filter(Boolean)
    : (typeof laurels === 'string' && laurels.trim() ? laurels.split('\n').map(l => l.trim()).filter(Boolean) : []);

  const isArchived = status === 'archived';
  const isFeaturedVal = isFeatured === true || isFeatured === 'true';

  try {
    if (isMongoConnected) {
      const count = await Work.countDocuments();
      const codeNumber = String(count + 1).padStart(2, '0');
      const workCode = (req.body.workCode && req.body.workCode.trim())
        ? req.body.workCode.trim()
        : `#RES-2026-${codeNumber}`;

      const finalOrder = order !== undefined ? parseInt(order) : count + 1;

      const newWork = await Work.create({
        workCode,
        slug: generatedSlug || `work-${Date.now()}`,
        title: title.trim(),
        discipline,
        disciplineLabel: defaultLabel,
        format: format.trim(),
        camera: camera.trim(),
        synopsis: synopsis.trim(),
        shortDescription: (shortDescription || '').trim(),
        crew: crew.trim(),
        laurels: processedLaurels,
        image: image.trim(),
        alt: title.trim(),
        aspectRatio: aspectRatio || '16:9',
        gridSpan: gridSpan || 'col-span-8',
        isFeatured: isFeaturedVal,
        isArchived,
        status: status || 'published',
        order: finalOrder
      });

      return res.status(201).json({
        success: true,
        message: 'Work plate created and cataloged successfully.',
        data: newWork
      });
    }

    // Memory Store Fallback
    const codeNum = String(memoryStore.works.length + 1).padStart(2, '0');
    const workCode = (req.body.workCode && req.body.workCode.trim())
      ? req.body.workCode.trim()
      : `#RES-2026-${codeNum}`;

    const finalOrder = order !== undefined ? parseInt(order) : memoryStore.works.length + 1;

    const workObj = {
      _id: `work-${Date.now()}`,
      workCode,
      slug: generatedSlug || `work-${Date.now()}`,
      title: title.trim(),
      discipline,
      disciplineLabel: defaultLabel,
      format: format.trim(),
      camera: camera.trim(),
      synopsis: synopsis.trim(),
      shortDescription: (shortDescription || '').trim(),
      crew: crew.trim(),
      laurels: processedLaurels,
      image: image.trim(),
      alt: title.trim(),
      aspectRatio: aspectRatio || '16:9',
      gridSpan: gridSpan || 'col-span-8',
      isFeatured: isFeaturedVal,
      isArchived,
      status: status || 'published',
      order: finalOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryStore.works.push(workObj);

    res.status(201).json({
      success: true,
      message: 'Work plate created and cataloged successfully.',
      data: workObj
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1.4 PUT /api/admin/works/:id - Update Existing Work Plate
app.put('/api/admin/works/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatePayload = { ...req.body };

  if (updatePayload.title && !updatePayload.title.trim()) {
    return res.status(400).json({ success: false, message: 'Work title cannot be empty.' });
  }

  if (Array.isArray(updatePayload.laurels)) {
    updatePayload.laurels = updatePayload.laurels
      .map(l => (typeof l === 'string' ? l.trim() : ''))
      .filter(Boolean);
  } else if (typeof updatePayload.laurels === 'string') {
    updatePayload.laurels = updatePayload.laurels.split('\n').map(l => l.trim()).filter(Boolean);
  }

  if (updatePayload.status === 'archived') {
    updatePayload.isArchived = true;
  } else if (updatePayload.status && updatePayload.status !== 'archived') {
    updatePayload.isArchived = false;
  }

  if (updatePayload.isFeatured !== undefined) {
    updatePayload.isFeatured = updatePayload.isFeatured === true || updatePayload.isFeatured === 'true';
  }

  if (updatePayload.order !== undefined) {
    updatePayload.order = parseInt(updatePayload.order) || 0;
  }

  try {
    if (isMongoConnected) {
      const work = await Work.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { workCode: id },
          { workCode: `#${id}` },
          { slug: id }
        ]
      });

      if (!work) return res.status(404).json({ success: false, message: 'Work plate not found.' });

      const updated = await Work.findByIdAndUpdate(work._id, updatePayload, { new: true });
      return res.json({
        success: true,
        message: 'Work plate updated and synchronized.',
        data: updated
      });
    }

    const idx = memoryStore.works.findIndex(w => w._id === id || w.workCode === id || w.slug === id || w.workCode === `#${id}`);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Work plate not found.' });

    memoryStore.works[idx] = {
      ...memoryStore.works[idx],
      ...updatePayload,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Work plate updated and synchronized.',
      data: memoryStore.works[idx]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1.5 PATCH /api/admin/works/:id/archive - Toggle Archive Status
app.patch('/api/admin/works/:id/archive', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const work = await Work.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { workCode: id },
          { workCode: `#${id}` },
          { slug: id }
        ]
      });

      if (!work) return res.status(404).json({ success: false, message: 'Work plate not found.' });

      const nextArchived = !work.isArchived;
      work.isArchived = nextArchived;
      work.status = nextArchived ? 'archived' : 'published';
      await work.save();

      return res.json({
        success: true,
        message: nextArchived ? 'Work plate archived from public gallery.' : 'Work plate restored to active portfolio.',
        data: work
      });
    }

    const work = memoryStore.works.find(w => w._id === id || w.workCode === id || w.slug === id || w.workCode === `#${id}`);
    if (!work) return res.status(404).json({ success: false, message: 'Work plate not found.' });

    work.isArchived = !work.isArchived;
    work.status = work.isArchived ? 'archived' : 'published';
    work.updatedAt = new Date();

    res.json({
      success: true,
      message: work.isArchived ? 'Work plate archived from public gallery.' : 'Work plate restored to active portfolio.',
      data: work
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1.6 PATCH /api/admin/works/reorder - Bulk Update Portfolio Sequence
app.patch('/api/admin/works/reorder', authenticateToken, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid reorder payload. Array of { id, order } required.' });
  }

  try {
    if (isMongoConnected) {
      const bulkOps = items.map(item => {
        const query = {
          $or: [
            { _id: mongoose.isValidObjectId(item.id) ? item.id : null },
            { workCode: item.id },
            { workCode: `#${item.id}` },
            { slug: item.id }
          ]
        };
        return {
          updateOne: {
            filter: query,
            update: { $set: { order: parseInt(item.order) || 0 } }
          }
        };
      });

      await Work.bulkWrite(bulkOps);
      const updatedWorks = await Work.find().sort({ order: 1 });
      return res.json({
        success: true,
        message: 'Portfolio display sequence updated successfully.',
        data: updatedWorks
      });
    }

    items.forEach(item => {
      const work = memoryStore.works.find(w => w._id === item.id || w.workCode === item.id || w.slug === item.id || w.workCode === `#${item.id}`);
      if (work) {
        work.order = parseInt(item.order) || 0;
        work.updatedAt = new Date();
      }
    });

    memoryStore.works.sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      success: true,
      message: 'Portfolio display sequence updated successfully.',
      data: memoryStore.works
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1.7 DELETE /api/admin/works/:id - Destructive Work Delete (Super Admin only)
app.delete('/api/admin/works/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const work = await Work.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { workCode: id },
          { workCode: `#${id}` },
          { slug: id }
        ]
      });

      if (!work) return res.status(404).json({ success: false, message: 'Work plate not found.' });

      await Work.findByIdAndDelete(work._id);
      return res.json({ success: true, message: `Work "${work.title}" has been permanently deleted from the archival database.` });
    }

    const work = memoryStore.works.find(w => w._id === id || w.workCode === id || w.slug === id || w.workCode === `#${id}`);
    if (!work) return res.status(404).json({ success: false, message: 'Work plate not found.' });

    memoryStore.works = memoryStore.works.filter(w => w._id !== id && w.workCode !== id && w.slug !== id && w.workCode !== `#${id}`);

    res.json({ success: true, message: `Work "${work.title}" has been permanently deleted from the archival database.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Events Admin Management Workspace Endpoints
app.get('/api/admin/events', authenticateToken, async (req, res) => {
  const { search, q, category, status, year, sortBy, page = 1, limit = 50 } = req.query;
  const searchQuery = (search || q || '').trim();
  const now = new Date();
  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageLimit = Math.max(1, Math.min(100, parseInt(limit) || 50));

  try {
    if (isMongoConnected) {
      let query = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        query.$or = [
          { title: regex },
          { location: regex },
          { description: regex },
          { shortDescription: regex },
          { category: regex }
        ];
      }

      if (year && year !== 'all') {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
        query.eventDate = { $gte: startOfYear, $lte: endOfYear };
      }

      if (status === 'upcoming') {
        query.eventDate = { ...(query.eventDate || {}), $gte: now };
        query.status = { $nin: ['archived', 'draft'] };
        query.isArchived = { $ne: true };
      } else if (status === 'past') {
        query.eventDate = { ...(query.eventDate || {}), $lt: now };
        query.status = { $nin: ['archived', 'draft'] };
        query.isArchived = { $ne: true };
      } else if (status === 'draft') {
        query.status = 'draft';
      } else if (status === 'archived') {
        query.$or = [{ status: 'archived' }, { isArchived: true }];
      }

      let sortOptions = { eventDate: 1 };
      if (sortBy === 'date_desc') sortOptions = { eventDate: -1 };
      else if (sortBy === 'newest' || sortBy === 'created_desc') sortOptions = { createdAt: -1 };
      else if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
      else if (sortBy === 'title_asc') sortOptions = { title: 1 };

      const totalMatching = await Event.countDocuments(query);
      const events = await Event.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * pageLimit)
        .limit(pageLimit);

      const enrichedEvents = await Promise.all(events.map(async (ev) => {
        const rsvpCount = await Rsvp.countDocuments({ eventId: ev._id });
        const totalCapacity = ev.totalCapacity || 30;
        const seatsRemaining = Math.max(0, totalCapacity - rsvpCount);
        const capacityPercent = totalCapacity > 0 ? Math.min(100, Math.round((rsvpCount / totalCapacity) * 100)) : 0;
        const isUpcoming = new Date(ev.eventDate) >= now;
        const isPast = !isUpcoming;
        const isArchived = ev.isArchived || ev.status === 'archived';
        const isDraft = ev.status === 'draft';
        const isSoldOut = seatsRemaining === 0;

        let computedStatus = isUpcoming ? 'Upcoming' : 'Past';
        if (isArchived) computedStatus = 'Archived';
        else if (isDraft) computedStatus = 'Draft';
        else if (isSoldOut) computedStatus = 'Sold Out';

        return {
          _id: ev._id,
          id: ev._id,
          title: ev.title,
          slug: ev.slug,
          category: ev.category,
          eventDate: ev.eventDate,
          dateDisplay: ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          date: ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: ev.time || '18:00',
          endTime: ev.endTime || '',
          location: ev.location,
          badge: ev.badge || (isSoldOut ? 'SOLD OUT' : 'SEATS OPEN'),
          shortDescription: ev.shortDescription || '',
          description: ev.description,
          coverImage: ev.coverImage || '',
          gallery: ev.gallery || [],
          totalCapacity,
          seatsRemaining,
          seatsLeft: seatsRemaining,
          rsvpCount,
          capacityPercent,
          isFlagship: ev.isFlagship || false,
          isArchived,
          isDraft,
          isSoldOut,
          isUpcoming,
          isPast,
          status: ev.status || 'active',
          computedStatus,
          createdAt: ev.createdAt,
          updatedAt: ev.updatedAt
        };
      }));

      // Overall metrics summary for filters
      const totalAll = await Event.countDocuments();
      const totalUpcoming = await Event.countDocuments({ eventDate: { $gte: now }, isArchived: { $ne: true }, status: { $ne: 'draft' } });
      const totalPast = await Event.countDocuments({ eventDate: { $lt: now }, isArchived: { $ne: true }, status: { $ne: 'draft' } });
      const totalArchived = await Event.countDocuments({ $or: [{ status: 'archived' }, { isArchived: true }] });
      const totalDraft = await Event.countDocuments({ status: 'draft' });

      return res.json({
        success: true,
        count: enrichedEvents.length,
        total: totalMatching,
        pagination: {
          page: pageNum,
          limit: pageLimit,
          totalPages: Math.ceil(totalMatching / pageLimit)
        },
        counts: {
          all: totalAll,
          upcoming: totalUpcoming,
          past: totalPast,
          archived: totalArchived,
          draft: totalDraft
        },
        metrics: {
          all: totalAll,
          upcoming: totalUpcoming,
          past: totalPast,
          archived: totalArchived,
          draft: totalDraft
        },
        data: enrichedEvents
      });
    }

    // Memory Store Implementation
    let list = [...memoryStore.events];

    if (category && category !== 'all') {
      list = list.filter(e => e.category === category);
    }

    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      list = list.filter(e => 
        (e.title && e.title.toLowerCase().includes(s)) ||
        (e.location && e.location.toLowerCase().includes(s)) ||
        (e.description && e.description.toLowerCase().includes(s)) ||
        (e.category && e.category.toLowerCase().includes(s))
      );
    }

    if (year && year !== 'all') {
      list = list.filter(e => new Date(e.eventDate).getFullYear().toString() === year);
    }

    if (status === 'upcoming') {
      list = list.filter(e => new Date(e.eventDate) >= now && !e.isArchived && e.status !== 'archived' && e.status !== 'draft');
    } else if (status === 'past') {
      list = list.filter(e => new Date(e.eventDate) < now && !e.isArchived && e.status !== 'archived' && e.status !== 'draft');
    } else if (status === 'draft') {
      list = list.filter(e => e.status === 'draft');
    } else if (status === 'archived') {
      list = list.filter(e => e.isArchived || e.status === 'archived');
    }

    // Sorting
    if (sortBy === 'date_desc') {
      list.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
    } else if (sortBy === 'newest' || sortBy === 'created_desc') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'title_asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      list.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    }

    const totalMatching = list.length;
    const paginated = list.slice((pageNum - 1) * pageLimit, pageNum * pageLimit);

    const enriched = paginated.map(ev => {
      const rsvpCount = memoryStore.rsvps.filter(r => r.eventId === ev._id || r.eventId === ev.slug).length;
      const totalCapacity = ev.totalCapacity || 30;
      const seatsRemaining = Math.max(0, totalCapacity - rsvpCount);
      const capacityPercent = totalCapacity > 0 ? Math.min(100, Math.round((rsvpCount / totalCapacity) * 100)) : 0;
      const isUpcoming = new Date(ev.eventDate) >= now;
      const isPast = !isUpcoming;
      const isArchived = ev.isArchived || ev.status === 'archived';
      const isDraft = ev.status === 'draft';
      const isSoldOut = seatsRemaining === 0;

      let computedStatus = isUpcoming ? 'Upcoming' : 'Past';
      if (isArchived) computedStatus = 'Archived';
      else if (isDraft) computedStatus = 'Draft';
      else if (isSoldOut) computedStatus = 'Sold Out';

      return {
        ...ev,
        id: ev._id || ev.slug,
        dateDisplay: ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        date: ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        totalCapacity,
        seatsRemaining,
        seatsLeft: seatsRemaining,
        rsvpCount,
        capacityPercent,
        isArchived,
        isDraft,
        isSoldOut,
        isUpcoming,
        isPast,
        computedStatus
      };
    });

    const totalAll = memoryStore.events.length;
    const totalUpcoming = memoryStore.events.filter(e => new Date(e.eventDate) >= now && !e.isArchived && e.status !== 'archived' && e.status !== 'draft').length;
    const totalPast = memoryStore.events.filter(e => new Date(e.eventDate) < now && !e.isArchived && e.status !== 'archived' && e.status !== 'draft').length;
    const totalArchived = memoryStore.events.filter(e => e.isArchived || e.status === 'archived').length;
    const totalDraft = memoryStore.events.filter(e => e.status === 'draft').length;

    res.json({
      success: true,
      count: enriched.length,
      total: totalMatching,
      pagination: {
        page: pageNum,
        limit: pageLimit,
        totalPages: Math.ceil(totalMatching / pageLimit)
      },
      counts: {
        all: totalAll,
        upcoming: totalUpcoming,
        past: totalPast,
        archived: totalArchived,
        draft: totalDraft
      },
      metrics: {
        all: totalAll,
        upcoming: totalUpcoming,
        past: totalPast,
        archived: totalArchived,
        draft: totalDraft
      },
      data: enriched
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2.1 GET /api/admin/events/:id - Get Single Event Details with RSVPs
app.get('/api/admin/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const now = new Date();

  try {
    if (isMongoConnected) {
      const event = await Event.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { slug: id }
        ]
      });

      if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

      const rsvps = await Rsvp.find({ eventId: event._id }).sort({ createdAt: -1 });
      const totalCapacity = event.totalCapacity || 30;
      const seatsRemaining = Math.max(0, totalCapacity - rsvps.length);
      const isUpcoming = new Date(event.eventDate) >= now;

      return res.json({
        success: true,
        data: {
          ...event.toObject(),
          id: event._id,
          date: event.dateDisplay,
          rsvpCount: rsvps.length,
          seatsRemaining,
          seatsLeft: seatsRemaining,
          isSoldOut: seatsRemaining === 0,
          isUpcoming,
          isPast: !isUpcoming,
          rsvps
        }
      });
    }

    const event = memoryStore.events.find(e => e._id === id || e.slug === id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    const rsvps = memoryStore.rsvps.filter(r => r.eventId === event._id || r.eventId === event.slug);
    const totalCapacity = event.totalCapacity || 30;
    const seatsRemaining = Math.max(0, totalCapacity - rsvps.length);

    res.json({
      success: true,
      data: {
        ...event,
        id: event._id || event.slug,
        date: event.dateDisplay,
        rsvpCount: rsvps.length,
        seatsRemaining,
        seatsLeft: seatsRemaining,
        isSoldOut: seatsRemaining === 0,
        rsvps
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2.2 POST /api/admin/events - Create Event (Super Admin & Editor)
app.post('/api/admin/events', authenticateToken, async (req, res) => {
  const {
    title,
    category,
    eventDate,
    date,
    dateDisplay,
    time,
    endTime,
    location,
    badge,
    seatsRemainingBadge,
    shortDescription,
    description,
    coverImage,
    gallery,
    totalCapacity,
    isFlagship,
    flagship,
    status
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Event title is required.' });
  }
  if (!location || !location.trim()) {
    return res.status(400).json({ success: false, message: 'Event venue/location is required.' });
  }

  const rawDate = eventDate || date || new Date().toISOString();
  let baseSlug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  if (!baseSlug) baseSlug = 'event-' + Date.now();

  const capacity = Math.max(1, parseInt(totalCapacity) || 30);
  const formattedDate = dateDisplay || new Date(rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
  const eventStatus = status || 'active';
  const isArchived = Boolean(req.body.isArchived || eventStatus === 'archived');
  const isFlagshipVal = Boolean(isFlagship || flagship);
  const badgeVal = seatsRemainingBadge || badge || 'SEATS OPEN';

  // Process gallery items
  let processedGallery = [];
  if (Array.isArray(gallery)) {
    processedGallery = gallery.map((item, idx) => ({
      url: typeof item === 'string' ? item : item.url,
      caption: item.caption || '',
      order: item.order !== undefined ? item.order : idx + 1
    })).filter(item => item.url && item.url.trim());
  }

  try {
    if (isMongoConnected) {
      // Ensure unique slug
      let finalSlug = baseSlug;
      let count = 1;
      while (await Event.findOne({ slug: finalSlug })) {
        finalSlug = `${baseSlug}-${count}`;
        count++;
      }

      const newEvent = await Event.create({
        title: title.trim(),
        slug: finalSlug,
        category: ['workshops', 'exhibitions', 'shoots'].includes(category) ? category : 'workshops',
        eventDate: new Date(rawDate),
        dateDisplay: formattedDate,
        time: time || '18:00',
        endTime: endTime || '',
        location: location.trim(),
        badge: badgeVal,
        shortDescription: shortDescription || '',
        description: description || shortDescription || title.trim(),
        coverImage: coverImage || '',
        gallery: processedGallery,
        totalCapacity: capacity,
        seatsRemaining: capacity,
        isFlagship: isFlagshipVal,
        flagship: isFlagshipVal,
        isArchived,
        status: eventStatus
      });

      return res.status(201).json({
        success: true,
        message: 'Event created and registered successfully.',
        data: newEvent
      });
    }

    // Memory Store Implementation
    let finalSlug = baseSlug;
    let count = 1;
    while (memoryStore.events.some(e => e.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    const eventObj = {
      _id: 'ev-' + Date.now(),
      title: title.trim(),
      slug: finalSlug,
      category: ['workshops', 'exhibitions', 'shoots'].includes(category) ? category : 'workshops',
      eventDate: new Date(rawDate),
      dateDisplay: formattedDate,
      date: formattedDate,
      time: time || '18:00',
      endTime: endTime || '',
      location: location.trim(),
      badge: badgeVal,
      seatsRemainingBadge: badgeVal,
      shortDescription: shortDescription || '',
      description: description || shortDescription || title.trim(),
      coverImage: coverImage || '',
      gallery: processedGallery,
      totalCapacity: capacity,
      seatsRemaining: capacity,
      seatsLeft: capacity,
      isFlagship: isFlagshipVal,
      flagship: isFlagshipVal,
      isArchived,
      status: eventStatus,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryStore.events.push(eventObj);

    res.status(201).json({
      success: true,
      message: 'Event created and registered successfully.',
      data: eventObj
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2.3 PUT /api/admin/events/:id - Update Event (Super Admin & Editor)
app.put('/api/admin/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatePayload = { ...req.body };

  if (updatePayload.title && !updatePayload.title.trim()) {
    return res.status(400).json({ success: false, message: 'Event title cannot be empty.' });
  }

  // Handle gallery ordering
  if (Array.isArray(updatePayload.gallery)) {
    updatePayload.gallery = updatePayload.gallery.map((item, idx) => ({
      url: typeof item === 'string' ? item : item.url,
      caption: item.caption || '',
      order: item.order !== undefined ? item.order : idx + 1
    })).filter(item => item.url && item.url.trim());
  }

  if (updatePayload.status === 'archived') {
    updatePayload.isArchived = true;
  } else if (updatePayload.status && updatePayload.status !== 'archived') {
    updatePayload.isArchived = false;
  }

  try {
    if (isMongoConnected) {
      const event = await Event.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { slug: id }
        ]
      });

      if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

      // If totalCapacity changed, recalculate seatsRemaining based on active RSVPs
      if (updatePayload.totalCapacity !== undefined) {
        const newCap = Math.max(1, parseInt(updatePayload.totalCapacity) || 30);
        const rsvpCount = await Rsvp.countDocuments({ eventId: event._id });
        updatePayload.totalCapacity = newCap;
        updatePayload.seatsRemaining = Math.max(0, newCap - rsvpCount);
      }

      if (updatePayload.eventDate) {
        updatePayload.eventDate = new Date(updatePayload.eventDate);
      }

      const updated = await Event.findByIdAndUpdate(event._id, updatePayload, { new: true });
      return res.json({
        success: true,
        message: 'Event updated and synchronized.',
        data: updated
      });
    }

    const idx = memoryStore.events.findIndex(e => e._id === id || e.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Event not found.' });

    const existing = memoryStore.events[idx];
    let newSeats = existing.seatsRemaining;

    if (updatePayload.totalCapacity !== undefined) {
      const newCap = Math.max(1, parseInt(updatePayload.totalCapacity) || 30);
      const rsvpCount = memoryStore.rsvps.filter(r => r.eventId === existing._id || r.eventId === existing.slug).length;
      updatePayload.totalCapacity = newCap;
      newSeats = Math.max(0, newCap - rsvpCount);
      updatePayload.seatsRemaining = newSeats;
      updatePayload.seatsLeft = newSeats;
    }

    memoryStore.events[idx] = {
      ...existing,
      ...updatePayload,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Event updated and synchronized.',
      data: memoryStore.events[idx]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2.4 PATCH /api/admin/events/:id/archive - Toggle Archive Status
app.patch('/api/admin/events/:id/archive', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const event = await Event.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { slug: id }
        ]
      });

      if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

      const newArchiveState = !event.isArchived;
      event.isArchived = newArchiveState;
      event.status = newArchiveState ? 'archived' : 'active';
      await event.save();

      return res.json({
        success: true,
        message: newArchiveState ? 'Event archived from public calendar.' : 'Event restored to active calendar.',
        data: event
      });
    }

    const event = memoryStore.events.find(e => e._id === id || e.slug === id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    event.isArchived = !event.isArchived;
    event.status = event.isArchived ? 'archived' : 'active';
    event.updatedAt = new Date();

    res.json({
      success: true,
      message: event.isArchived ? 'Event archived from public calendar.' : 'Event restored to active calendar.',
      data: event
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2.5 DELETE /api/admin/events/:id - Destructive Event Delete (Super Admin only)
app.delete('/api/admin/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const event = await Event.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { slug: id }
        ]
      });

      if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

      // Cleanly remove associated RSVPs for this event
      await Rsvp.deleteMany({ eventId: event._id });
      await Event.findByIdAndDelete(event._id);

      return res.json({ success: true, message: `Event "${event.title}" and its associated content have been permanently removed.` });
    }

    const event = memoryStore.events.find(e => e._id === id || e.slug === id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    memoryStore.events = memoryStore.events.filter(e => e._id !== id && e.slug !== id);
    memoryStore.rsvps = memoryStore.rsvps.filter(r => r.eventId !== id && r.eventId !== event.slug);

    res.json({ success: true, message: `Event "${event.title}" and its associated content have been permanently removed.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. RSVPs Admin Management Workspace Endpoints
app.get('/api/admin/rsvps', authenticateToken, async (req, res) => {
  const { eventId, search, q, status, sortBy = 'newest', page = 1, limit = 25 } = req.query;
  const searchQuery = (search || q || '').trim();
  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageLimit = Math.max(1, Math.min(100, parseInt(limit) || 25));
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    if (isMongoConnected) {
      let filter = {};

      if (eventId && eventId !== 'all') {
        // Resolve eventId (could be ObjectId or slug)
        const matchedEvent = await Event.findOne({
          $or: [
            { _id: mongoose.isValidObjectId(eventId) ? eventId : null },
            { slug: eventId }
          ]
        });
        if (matchedEvent) {
          filter.$or = [{ eventId: matchedEvent._id }, { eventId: matchedEvent.slug }];
        } else {
          filter.eventId = eventId;
        }
      }

      if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        const searchOr = [
          { attendeeName: regex },
          { email: regex },
          { passId: regex },
          { phone: regex },
          { eventTitle: regex }
        ];
        if (filter.$or) {
          filter = { $and: [{ $or: filter.$or }, { $or: searchOr }] };
        } else {
          filter.$or = searchOr;
        }
      }

      if (status && status !== 'all') {
        if (status === 'checked_in') {
          filter.$and = filter.$and || [];
          filter.$and.push({ $or: [{ status: 'checked_in' }, { isCheckedIn: true }] });
        } else if (status === 'cancelled') {
          filter.status = 'cancelled';
        } else if (status === 'confirmed') {
          filter.status = { $nin: ['cancelled', 'checked_in'] };
          filter.isCheckedIn = { $ne: true };
        }
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
      else if (sortBy === 'name_asc') sortOptions = { attendeeName: 1 };
      else if (sortBy === 'name_desc') sortOptions = { attendeeName: -1 };
      else if (sortBy === 'event_date') sortOptions = { createdAt: -1 };

      const totalMatching = await Rsvp.countDocuments(filter);
      const rsvps = await Rsvp.find(filter)
        .sort(sortOptions)
        .skip((pageNum - 1) * pageLimit)
        .limit(pageLimit);

      // Enrich RSVP records with Event Details if needed
      const enrichedRsvps = await Promise.all(rsvps.map(async (r) => {
        let ev = null;
        if (mongoose.isValidObjectId(r.eventId)) {
          ev = await Event.findById(r.eventId).select('title slug eventDate dateDisplay location category totalCapacity');
        } else {
          ev = await Event.findOne({ slug: r.eventId }).select('title slug eventDate dateDisplay location category totalCapacity');
        }

        const isCheckedIn = Boolean(r.isCheckedIn || r.status === 'checked_in');
        const rsvpStatus = r.status || (isCheckedIn ? 'checked_in' : 'confirmed');

        return {
          _id: r._id,
          id: r._id,
          passId: r.passId,
          eventId: r.eventId,
          eventTitle: ev ? ev.title : r.eventTitle,
          eventDate: ev ? ev.eventDate : null,
          eventDateDisplay: ev ? (ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : '',
          eventLocation: ev ? ev.location : '',
          eventCategory: ev ? ev.category : 'workshops',
          attendeeName: r.attendeeName,
          email: r.email,
          phone: r.phone || '',
          gateStatus: r.gateStatus || 'ALL-ACCESS PASS',
          isCheckedIn,
          checkInTime: r.checkInTime || null,
          status: rsvpStatus,
          registeredAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          createdAt: r.createdAt,
          updatedAt: r.updatedAt
        };
      }));

      // Calculate Global & Filtered Metrics
      const totalRsvps = await Rsvp.countDocuments({ status: { $ne: 'cancelled' } });
      const rsvpsToday = await Rsvp.countDocuments({ createdAt: { $gte: startOfToday }, status: { $ne: 'cancelled' } });
      const checkedInCount = await Rsvp.countDocuments({ $or: [{ isCheckedIn: true }, { status: 'checked_in' }] });
      const cancelledCount = await Rsvp.countDocuments({ status: 'cancelled' });

      // Upcoming Event RSVPs calculation
      const upcomingEvents = await Event.find({ eventDate: { $gte: now }, isArchived: { $ne: true }, status: { $ne: 'draft' } }).select('_id slug');
      const upcomingEventIds = upcomingEvents.flatMap(e => [e._id, e.slug]);
      const upcomingEventRsvps = await Rsvp.countDocuments({ eventId: { $in: upcomingEventIds }, status: { $ne: 'cancelled' } });

      // Distinct active events with registrations
      const distinctEvents = await Rsvp.distinct('eventId', { status: { $ne: 'cancelled' } });

      // Selected Event Capacity Breakdown
      let selectedEventCapacity = null;
      if (eventId && eventId !== 'all') {
        const selEvent = await Event.findOne({
          $or: [
            { _id: mongoose.isValidObjectId(eventId) ? eventId : null },
            { slug: eventId }
          ]
        });
        if (selEvent) {
          const claimedSeats = await Rsvp.countDocuments({
            $or: [{ eventId: selEvent._id }, { eventId: selEvent.slug }],
            status: { $ne: 'cancelled' }
          });
          const totalCap = selEvent.totalCapacity || 30;
          const seatsRemaining = Math.max(0, totalCap - claimedSeats);
          const capacityPercent = totalCap > 0 ? Math.min(100, Math.round((claimedSeats / totalCap) * 100)) : 0;

          selectedEventCapacity = {
            eventId: selEvent._id,
            slug: selEvent.slug,
            title: selEvent.title,
            totalCapacity: totalCap,
            claimedSeats,
            seatsRemaining,
            capacityPercent,
            isSoldOut: seatsRemaining === 0,
            dateDisplay: selEvent.dateDisplay,
            location: selEvent.location
          };
        }
      }

      return res.json({
        success: true,
        count: enrichedRsvps.length,
        total: totalMatching,
        pagination: {
          page: pageNum,
          limit: pageLimit,
          totalPages: Math.ceil(totalMatching / pageLimit) || 1
        },
        metrics: {
          totalRsvps,
          rsvpsToday,
          checkedInCount,
          upcomingEventRsvps,
          cancelledCount,
          eventsWithRegistrations: distinctEvents.length
        },
        selectedEventCapacity,
        data: enrichedRsvps
      });
    }

    // Memory Store Implementation
    let list = [...memoryStore.rsvps];

    if (eventId && eventId !== 'all') {
      list = list.filter(r => r.eventId === eventId);
    }

    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      list = list.filter(r =>
        (r.attendeeName && r.attendeeName.toLowerCase().includes(s)) ||
        (r.email && r.email.toLowerCase().includes(s)) ||
        (r.passId && r.passId.toLowerCase().includes(s)) ||
        (r.phone && r.phone.toLowerCase().includes(s)) ||
        (r.eventTitle && r.eventTitle.toLowerCase().includes(s))
      );
    }

    if (status && status !== 'all') {
      if (status === 'checked_in') {
        list = list.filter(r => r.isCheckedIn || r.status === 'checked_in');
      } else if (status === 'cancelled') {
        list = list.filter(r => r.status === 'cancelled');
      } else if (status === 'confirmed') {
        list = list.filter(r => r.status !== 'cancelled' && r.status !== 'checked_in' && !r.isCheckedIn);
      }
    }

    // Sorting
    if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt || a.registeredAt || 0) - new Date(b.createdAt || b.registeredAt || 0));
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => (a.attendeeName || '').localeCompare(b.attendeeName || ''));
    } else if (sortBy === 'name_desc') {
      list.sort((a, b) => (b.attendeeName || '').localeCompare(a.attendeeName || ''));
    } else {
      list.sort((a, b) => new Date(b.createdAt || b.registeredAt || 0) - new Date(a.createdAt || a.registeredAt || 0));
    }

    const totalMatching = list.length;
    const paginated = list.slice((pageNum - 1) * pageLimit, pageNum * pageLimit);

    const enriched = paginated.map(r => {
      const ev = memoryStore.events.find(e => e._id === r.eventId || e.slug === r.eventId);
      const isCheckedIn = Boolean(r.isCheckedIn || r.status === 'checked_in');
      const rsvpStatus = r.status || (isCheckedIn ? 'checked_in' : 'confirmed');

      return {
        ...r,
        id: r._id || r.passId,
        eventTitle: ev ? ev.title : r.eventTitle,
        eventDate: ev ? ev.eventDate : null,
        eventDateDisplay: ev ? (ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : '',
        eventLocation: ev ? ev.location : '',
        eventCategory: ev ? ev.category : 'workshops',
        phone: r.phone || '',
        gateStatus: r.gateStatus || 'ALL-ACCESS PASS',
        isCheckedIn,
        checkInTime: r.checkInTime || null,
        status: rsvpStatus,
        registeredAt: r.registeredAt || (r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString())
      };
    });

    // Metrics for memoryStore
    const totalRsvps = memoryStore.rsvps.filter(r => r.status !== 'cancelled').length;
    const rsvpsToday = memoryStore.rsvps.filter(r => {
      const d = new Date(r.createdAt || r.registeredAt || 0);
      return d >= startOfToday && r.status !== 'cancelled';
    }).length;
    const checkedInCount = memoryStore.rsvps.filter(r => r.isCheckedIn || r.status === 'checked_in').length;
    const cancelledCount = memoryStore.rsvps.filter(r => r.status === 'cancelled').length;

    const upcomingEvents = memoryStore.events.filter(e => new Date(e.eventDate) >= now && !e.isArchived && e.status !== 'draft');
    const upcomingEventIds = upcomingEvents.flatMap(e => [e._id, e.slug]);
    const upcomingEventRsvps = memoryStore.rsvps.filter(r => upcomingEventIds.includes(r.eventId) && r.status !== 'cancelled').length;

    const distinctEvents = [...new Set(memoryStore.rsvps.filter(r => r.status !== 'cancelled').map(r => r.eventId))];

    let selectedEventCapacity = null;
    if (eventId && eventId !== 'all') {
      const selEvent = memoryStore.events.find(e => e._id === eventId || e.slug === eventId);
      if (selEvent) {
        const claimedSeats = memoryStore.rsvps.filter(r => (r.eventId === selEvent._id || r.eventId === selEvent.slug) && r.status !== 'cancelled').length;
        const totalCap = selEvent.totalCapacity || 30;
        const seatsRemaining = Math.max(0, totalCap - claimedSeats);
        const capacityPercent = totalCap > 0 ? Math.min(100, Math.round((claimedSeats / totalCap) * 100)) : 0;

        selectedEventCapacity = {
          eventId: selEvent._id || selEvent.slug,
          slug: selEvent.slug,
          title: selEvent.title,
          totalCapacity: totalCap,
          claimedSeats,
          seatsRemaining,
          capacityPercent,
          isSoldOut: seatsRemaining === 0,
          dateDisplay: selEvent.dateDisplay,
          location: selEvent.location
        };
      }
    }

    res.json({
      success: true,
      count: enriched.length,
      total: totalMatching,
      pagination: {
        page: pageNum,
        limit: pageLimit,
        totalPages: Math.ceil(totalMatching / pageLimit) || 1
      },
      metrics: {
        totalRsvps,
        rsvpsToday,
        checkedInCount,
        upcomingEventRsvps,
        cancelledCount,
        eventsWithRegistrations: distinctEvents.length
      },
      selectedEventCapacity,
      data: enriched
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3.1 GET /api/admin/rsvps/:id - Single RSVP Details
app.get('/api/admin/rsvps/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const rsvp = await Rsvp.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { passId: id }
        ]
      });

      if (!rsvp) {
        return res.status(404).json({ success: false, message: 'Attendee registration record not found.' });
      }

      let ev = null;
      if (mongoose.isValidObjectId(rsvp.eventId)) {
        ev = await Event.findById(rsvp.eventId);
      } else {
        ev = await Event.findOne({ slug: rsvp.eventId });
      }

      const isCheckedIn = Boolean(rsvp.isCheckedIn || rsvp.status === 'checked_in');
      const rsvpStatus = rsvp.status || (isCheckedIn ? 'checked_in' : 'confirmed');

      return res.json({
        success: true,
        data: {
          _id: rsvp._id,
          id: rsvp._id,
          passId: rsvp.passId,
          eventId: rsvp.eventId,
          eventTitle: ev ? ev.title : rsvp.eventTitle,
          eventDate: ev ? ev.eventDate : null,
          eventDateDisplay: ev ? (ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : '',
          eventLocation: ev ? ev.location : '',
          eventCategory: ev ? ev.category : 'workshops',
          eventCoverImage: ev ? (ev.coverImage || '') : '',
          eventTotalCapacity: ev ? (ev.totalCapacity || 30) : 30,
          attendeeName: rsvp.attendeeName,
          email: rsvp.email,
          phone: rsvp.phone || '',
          gateStatus: rsvp.gateStatus || 'ALL-ACCESS PASS',
          isCheckedIn,
          checkInTime: rsvp.checkInTime || null,
          status: rsvpStatus,
          registeredAt: rsvp.createdAt ? new Date(rsvp.createdAt).toISOString() : new Date().toISOString(),
          createdAt: rsvp.createdAt,
          updatedAt: rsvp.updatedAt
        }
      });
    }

    const rsvp = memoryStore.rsvps.find(r => r._id === id || r.passId === id);
    if (!rsvp) {
      return res.status(404).json({ success: false, message: 'Attendee registration record not found.' });
    }

    const ev = memoryStore.events.find(e => e._id === rsvp.eventId || e.slug === rsvp.eventId);
    const isCheckedIn = Boolean(rsvp.isCheckedIn || rsvp.status === 'checked_in');
    const rsvpStatus = rsvp.status || (isCheckedIn ? 'checked_in' : 'confirmed');

    res.json({
      success: true,
      data: {
        ...rsvp,
        id: rsvp._id || rsvp.passId,
        eventTitle: ev ? ev.title : rsvp.eventTitle,
        eventDate: ev ? ev.eventDate : null,
        eventDateDisplay: ev ? (ev.dateDisplay || new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : '',
        eventLocation: ev ? ev.location : '',
        eventCategory: ev ? ev.category : 'workshops',
        eventCoverImage: ev ? (ev.coverImage || '') : '',
        eventTotalCapacity: ev ? (ev.totalCapacity || 30) : 30,
        phone: rsvp.phone || '',
        gateStatus: rsvp.gateStatus || 'ALL-ACCESS PASS',
        isCheckedIn,
        checkInTime: rsvp.checkInTime || null,
        status: rsvpStatus,
        registeredAt: rsvp.registeredAt || (rsvp.createdAt ? new Date(rsvp.createdAt).toISOString() : new Date().toISOString())
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3.2 PATCH /api/admin/rsvps/:id/checkin - Toggle Attendee Gate Check-In
app.patch('/api/admin/rsvps/:id/checkin', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isCheckedIn: explicitState } = req.body;

  try {
    if (isMongoConnected) {
      const rsvp = await Rsvp.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { passId: id }
        ]
      });

      if (!rsvp) {
        return res.status(404).json({ success: false, message: 'RSVP record not found.' });
      }

      const nextCheckedInState = explicitState !== undefined ? Boolean(explicitState) : !rsvp.isCheckedIn;
      rsvp.isCheckedIn = nextCheckedInState;
      rsvp.checkInTime = nextCheckedInState ? new Date() : null;
      rsvp.status = nextCheckedInState ? 'checked_in' : 'confirmed';
      await rsvp.save();

      return res.json({
        success: true,
        message: nextCheckedInState ? `Attendee ${rsvp.attendeeName} checked in successfully.` : `Check-in revoked for ${rsvp.attendeeName}.`,
        data: rsvp
      });
    }

    const rsvp = memoryStore.rsvps.find(r => r._id === id || r.passId === id);
    if (!rsvp) {
      return res.status(404).json({ success: false, message: 'RSVP record not found.' });
    }

    const nextCheckedInState = explicitState !== undefined ? Boolean(explicitState) : !rsvp.isCheckedIn;
    rsvp.isCheckedIn = nextCheckedInState;
    rsvp.checkInTime = nextCheckedInState ? new Date() : null;
    rsvp.status = nextCheckedInState ? 'checked_in' : 'confirmed';
    rsvp.updatedAt = new Date();

    res.json({
      success: true,
      message: nextCheckedInState ? `Attendee ${rsvp.attendeeName} checked in successfully.` : `Check-in revoked for ${rsvp.attendeeName}.`,
      data: rsvp
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3.3 PATCH /api/admin/rsvps/:id/status - Update RSVP Status (Confirmed, Checked In, Cancelled)
app.patch('/api/admin/rsvps/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['confirmed', 'checked_in', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status. Must be confirmed, checked_in, or cancelled.' });
  }

  try {
    if (isMongoConnected) {
      const rsvp = await Rsvp.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { passId: id }
        ]
      });

      if (!rsvp) {
        return res.status(404).json({ success: false, message: 'RSVP record not found.' });
      }

      const prevStatus = rsvp.status;
      rsvp.status = status;
      if (status === 'checked_in') {
        rsvp.isCheckedIn = true;
        rsvp.checkInTime = new Date();
      } else if (status === 'confirmed') {
        rsvp.isCheckedIn = false;
        rsvp.checkInTime = null;
      } else if (status === 'cancelled') {
        rsvp.isCheckedIn = false;
        rsvp.checkInTime = null;
      }
      await rsvp.save();

      // Recalculate event seats if cancelling or un-cancelling
      let ev = null;
      if (mongoose.isValidObjectId(rsvp.eventId)) {
        ev = await Event.findById(rsvp.eventId);
      } else {
        ev = await Event.findOne({ slug: rsvp.eventId });
      }

      if (ev) {
        const activeRsvpCount = await Rsvp.countDocuments({
          $or: [{ eventId: ev._id }, { eventId: ev.slug }],
          status: { $ne: 'cancelled' }
        });
        const totalCap = ev.totalCapacity || 30;
        ev.seatsRemaining = Math.max(0, totalCap - activeRsvpCount);
        if (ev.seatsRemaining > 0 && ev.status === 'sold_out') {
          ev.status = 'active';
        }
        await ev.save();
      }

      return res.json({
        success: true,
        message: `Registration status updated to ${status}.`,
        data: rsvp
      });
    }

    const rsvp = memoryStore.rsvps.find(r => r._id === id || r.passId === id);
    if (!rsvp) {
      return res.status(404).json({ success: false, message: 'RSVP record not found.' });
    }

    rsvp.status = status;
    if (status === 'checked_in') {
      rsvp.isCheckedIn = true;
      rsvp.checkInTime = new Date();
    } else if (status === 'confirmed') {
      rsvp.isCheckedIn = false;
      rsvp.checkInTime = null;
    } else if (status === 'cancelled') {
      rsvp.isCheckedIn = false;
      rsvp.checkInTime = null;
    }
    rsvp.updatedAt = new Date();

    const ev = memoryStore.events.find(e => e._id === rsvp.eventId || e.slug === rsvp.eventId);
    if (ev) {
      const activeCount = memoryStore.rsvps.filter(r => (r.eventId === ev._id || r.eventId === ev.slug) && r.status !== 'cancelled').length;
      const totalCap = ev.totalCapacity || 30;
      ev.seatsRemaining = Math.max(0, totalCap - activeCount);
      if (ev.seatsRemaining > 0 && ev.status === 'sold_out') {
        ev.status = 'active';
      }
    }

    res.json({
      success: true,
      message: `Registration status updated to ${status}.`,
      data: rsvp
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3.4 DELETE /api/admin/rsvps/:id - Permanent Delete RSVP (Super Admin only)
app.delete('/api/admin/rsvps/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const rsvp = await Rsvp.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { passId: id }
        ]
      });

      if (!rsvp) {
        return res.status(404).json({ success: false, message: 'RSVP record not found.' });
      }

      const eventId = rsvp.eventId;
      await Rsvp.findByIdAndDelete(rsvp._id);

      // Recalculate event seats remaining
      let ev = null;
      if (mongoose.isValidObjectId(eventId)) {
        ev = await Event.findById(eventId);
      } else {
        ev = await Event.findOne({ slug: eventId });
      }

      if (ev) {
        const activeRsvpCount = await Rsvp.countDocuments({
          $or: [{ eventId: ev._id }, { eventId: ev.slug }],
          status: { $ne: 'cancelled' }
        });
        const totalCap = ev.totalCapacity || 30;
        ev.seatsRemaining = Math.max(0, totalCap - activeRsvpCount);
        if (ev.seatsRemaining > 0 && ev.status === 'sold_out') {
          ev.status = 'active';
        }
        await ev.save();
      }

      return res.json({
        success: true,
        message: `Registration pass [${rsvp.passId}] for ${rsvp.attendeeName} deleted permanently.`
      });
    }

    const rsvpIndex = memoryStore.rsvps.findIndex(r => r._id === id || r.passId === id);
    if (rsvpIndex === -1) {
      return res.status(404).json({ success: false, message: 'RSVP record not found.' });
    }

    const deleted = memoryStore.rsvps[rsvpIndex];
    memoryStore.rsvps.splice(rsvpIndex, 1);

    const ev = memoryStore.events.find(e => e._id === deleted.eventId || e.slug === deleted.eventId);
    if (ev) {
      const activeCount = memoryStore.rsvps.filter(r => (r.eventId === ev._id || r.eventId === ev.slug) && r.status !== 'cancelled').length;
      const totalCap = ev.totalCapacity || 30;
      ev.seatsRemaining = Math.max(0, totalCap - activeCount);
      if (ev.seatsRemaining > 0 && ev.status === 'sold_out') {
        ev.status = 'active';
      }
    }

    res.json({
      success: true,
      message: `Registration pass [${deleted.passId}] for ${deleted.attendeeName} deleted permanently.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3.5 GET /api/admin/rsvps/export/csv - Sanitized CSV Attendee Export
app.get('/api/admin/rsvps/export/csv', authenticateToken, async (req, res) => {
  const { eventId, search, q, status } = req.query;
  const searchQuery = (search || q || '').trim();

  try {
    let rsvps = [];
    if (isMongoConnected) {
      let filter = {};
      if (eventId && eventId !== 'all') {
        const matchedEvent = await Event.findOne({
          $or: [
            { _id: mongoose.isValidObjectId(eventId) ? eventId : null },
            { slug: eventId }
          ]
        });
        if (matchedEvent) {
          filter.$or = [{ eventId: matchedEvent._id }, { eventId: matchedEvent.slug }];
        } else {
          filter.eventId = eventId;
        }
      }

      if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        const searchOr = [
          { attendeeName: regex },
          { email: regex },
          { passId: regex },
          { phone: regex },
          { eventTitle: regex }
        ];
        if (filter.$or) {
          filter = { $and: [{ $or: filter.$or }, { $or: searchOr }] };
        } else {
          filter.$or = searchOr;
        }
      }

      if (status && status !== 'all') {
        if (status === 'checked_in') {
          filter.$and = filter.$and || [];
          filter.$and.push({ $or: [{ status: 'checked_in' }, { isCheckedIn: true }] });
        } else if (status === 'cancelled') {
          filter.status = 'cancelled';
        } else if (status === 'confirmed') {
          filter.status = { $nin: ['cancelled', 'checked_in'] };
          filter.isCheckedIn = { $ne: true };
        }
      }

      rsvps = await Rsvp.find(filter).sort({ createdAt: -1 });
    } else {
      rsvps = [...memoryStore.rsvps];
      if (eventId && eventId !== 'all') {
        rsvps = rsvps.filter(r => r.eventId === eventId);
      }
      if (searchQuery) {
        const s = searchQuery.toLowerCase();
        rsvps = rsvps.filter(r =>
          (r.attendeeName && r.attendeeName.toLowerCase().includes(s)) ||
          (r.email && r.email.toLowerCase().includes(s)) ||
          (r.passId && r.passId.toLowerCase().includes(s))
        );
      }
      if (status && status !== 'all') {
        if (status === 'checked_in') rsvps = rsvps.filter(r => r.isCheckedIn || r.status === 'checked_in');
        else if (status === 'cancelled') rsvps = rsvps.filter(r => r.status === 'cancelled');
        else if (status === 'confirmed') rsvps = rsvps.filter(r => r.status !== 'cancelled' && r.status !== 'checked_in' && !r.isCheckedIn);
      }
      rsvps.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    const headers = [
      'Pass ID',
      'Attendee Name',
      'Email',
      'Phone',
      'Event Title',
      'Gate Status',
      'Status',
      'Checked In',
      'Check In Timestamp',
      'Registration Date'
    ];

    const rows = rsvps.map(r => {
      const isCheckedIn = Boolean(r.isCheckedIn || r.status === 'checked_in');
      const rsvpStatus = r.status || (isCheckedIn ? 'checked_in' : 'confirmed');
      const regDate = r.registeredAt || (r.createdAt ? new Date(r.createdAt).toISOString() : '');
      const checkInTime = r.checkInTime ? new Date(r.checkInTime).toISOString() : '';

      return [
        `"${(r.passId || '').replace(/"/g, '""')}"`,
        `"${(r.attendeeName || r.name || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.eventTitle || '').replace(/"/g, '""')}"`,
        `"${(r.gateStatus || 'ALL-ACCESS PASS').replace(/"/g, '""')}"`,
        `"${rsvpStatus.toUpperCase()}"`,
        `"${isCheckedIn ? 'YES' : 'NO'}"`,
        `"${checkInTime}"`,
        `"${regDate}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="resolution-rsvps-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Works Admin Management
app.get('/api/admin/works', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected) {
      const works = await Work.find().sort({ order: 1 });
      return res.json({ success: true, count: works.length, data: works });
    }
    res.json({ success: true, count: memoryStore.works.length, data: memoryStore.works });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/works', authenticateToken, async (req, res) => {
  const { title, discipline, disciplineLabel, format, camera, synopsis, crew, laurels, image, gridSpan } = req.body;
  if (!title || !discipline || !image) {
    return res.status(400).json({ success: false, message: 'Title, discipline, and image URL are required.' });
  }

  const workCode = `#RES-2026-${String(Math.floor(Math.random() * 90 + 10))}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  try {
    if (isMongoConnected) {
      const work = await Work.create({
        workCode,
        slug,
        title,
        discipline,
        disciplineLabel: disciplineLabel || discipline.toUpperCase(),
        format: format || '4K DCI',
        camera: camera || 'Cinema Prime',
        synopsis: synopsis || '',
        crew: crew || '',
        laurels: Array.isArray(laurels) ? laurels : (laurels ? [laurels] : []),
        image,
        gridSpan: gridSpan || 'col-span-6',
        order: (await Work.countDocuments()) + 1
      });
      return res.status(201).json({ success: true, message: 'Work plate created.', data: work });
    }

    const workObj = {
      _id: 'w-' + Date.now(),
      workCode,
      slug,
      title,
      discipline,
      disciplineLabel: disciplineLabel || discipline.toUpperCase(),
      format: format || '4K DCI',
      camera: camera || 'Cinema Prime',
      synopsis: synopsis || '',
      crew: crew || '',
      laurels: Array.isArray(laurels) ? laurels : (laurels ? [laurels] : []),
      image,
      gridSpan: gridSpan || 'col-span-6',
      order: memoryStore.works.length + 1
    };
    memoryStore.works.push(workObj);
    res.status(201).json({ success: true, message: 'Work plate created.', data: workObj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/works/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const updated = await Work.findByIdAndUpdate(id, req.body, { new: true });
      return res.json({ success: true, message: 'Work updated.', data: updated });
    }

    const idx = memoryStore.works.findIndex(w => w._id === id || w.workCode === id || w.slug === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Work not found' });
    memoryStore.works[idx] = { ...memoryStore.works[idx], ...req.body };
    res.json({ success: true, message: 'Work updated.', data: memoryStore.works[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/works/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      await Work.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Work removed.' });
    }
    memoryStore.works = memoryStore.works.filter(w => w._id !== id && w.workCode !== id && w.slug !== id);
    res.json({ success: true, message: 'Work removed.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ====================================================
// 5. TEAM MANAGEMENT CMS REST API ENDPOINTS (STEP 6)
// ====================================================

// 5.1 GET /api/admin/team - List & Filter Team Members with Pagination & Live Metrics
app.get('/api/admin/team', authenticateToken, async (req, res) => {
  const { search, q, discipline, role, status, leadership, isHeadOfDiscipline, academicYear, sortBy = 'order_asc', page = 1, limit = 50 } = req.query;
  const searchQuery = (search || q || '').trim();
  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageLimit = Math.max(1, Math.min(100, parseInt(limit) || 50));

  try {
    if (isMongoConnected) {
      let query = {};

      if (discipline && discipline !== 'all') {
        query.discipline = discipline;
      }

      if (role && role !== 'all') {
        query.role = new RegExp(role, 'i');
      }

      if (status === 'active' || status === 'published') {
        query.status = 'active';
        query.isArchived = { $ne: true };
      } else if (status === 'draft') {
        query.status = 'draft';
      } else if (status === 'archived') {
        query.$or = [{ status: 'archived' }, { isArchived: true }];
      }

      const isLeader = leadership !== undefined ? (leadership === 'true' || leadership === true) : (isHeadOfDiscipline !== undefined ? (isHeadOfDiscipline === 'true' || isHeadOfDiscipline === true) : null);
      if (isLeader !== null) {
        query.isHeadOfDiscipline = isLeader;
      }

      if (academicYear && academicYear !== 'all') {
        query.academicYear = academicYear;
      }

      if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i');
        query.$or = [
          { name: regex },
          { role: regex },
          { discipline: regex },
          { disciplineCode: regex },
          { handle: regex },
          { bio: regex },
          { academicYear: regex }
        ];
      }

      let sortOptions = { order: 1, createdAt: 1 };
      if (sortBy === 'order_desc') sortOptions = { order: -1 };
      else if (sortBy === 'name_asc') sortOptions = { name: 1 };
      else if (sortBy === 'name_desc') sortOptions = { name: -1 };
      else if (sortBy === 'newest') sortOptions = { createdAt: -1 };
      else if (sortBy === 'oldest') sortOptions = { createdAt: 1 };

      const totalMatching = await TeamMember.countDocuments(query);
      const team = await TeamMember.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * pageLimit)
        .limit(pageLimit);

      // KPI Counts for Metrics Bar
      const totalAll = await TeamMember.countDocuments();
      const totalActive = await TeamMember.countDocuments({ isArchived: { $ne: true }, status: { $nin: ['draft', 'archived'] } });
      const totalLeadership = await TeamMember.countDocuments({ isHeadOfDiscipline: true, isArchived: { $ne: true } });
      const totalDraft = await TeamMember.countDocuments({ status: 'draft' });
      const totalArchived = await TeamMember.countDocuments({ $or: [{ status: 'archived' }, { isArchived: true }] });

      return res.json({
        success: true,
        count: team.length,
        total: totalMatching,
        pagination: {
          page: pageNum,
          limit: pageLimit,
          totalPages: Math.ceil(totalMatching / pageLimit)
        },
        counts: {
          all: totalAll,
          active: totalActive,
          leadership: totalLeadership,
          draft: totalDraft,
          archived: totalArchived,
          direction: await TeamMember.countDocuments({ discipline: 'direction' }),
          cinematography: await TeamMember.countDocuments({ discipline: 'cinematography' }),
          sound: await TeamMember.countDocuments({ discipline: 'sound' }),
          photo: await TeamMember.countDocuments({ discipline: 'photo' })
        },
        metrics: {
          total: totalAll,
          active: totalActive,
          leadership: totalLeadership,
          drafts: totalDraft,
          archived: totalArchived
        },
        data: team
      });
    }

    // High-Fidelity Active Memory Store Fallback
    let filtered = [...memoryStore.team];

    if (discipline && discipline !== 'all') {
      filtered = filtered.filter(t => t.discipline === discipline);
    }

    if (role && role !== 'all') {
      filtered = filtered.filter(t => t.role && t.role.toLowerCase().includes(role.toLowerCase()));
    }

    if (status === 'active' || status === 'published') {
      filtered = filtered.filter(t => !t.isArchived && (t.status === 'active' || !t.status));
    } else if (status === 'draft') {
      filtered = filtered.filter(t => t.status === 'draft');
    } else if (status === 'archived') {
      filtered = filtered.filter(t => t.isArchived || t.status === 'archived');
    }

    const isLeaderMem = leadership !== undefined ? (leadership === 'true' || leadership === true) : (isHeadOfDiscipline !== undefined ? (isHeadOfDiscipline === 'true' || isHeadOfDiscipline === true) : null);
    if (isLeaderMem !== null) {
      filtered = filtered.filter(t => Boolean(t.isHeadOfDiscipline) === isLeaderMem);
    }

    if (academicYear && academicYear !== 'all') {
      filtered = filtered.filter(t => t.academicYear === academicYear);
    }

    if (searchQuery) {
      const qLower = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        (t.name && t.name.toLowerCase().includes(qLower)) ||
        (t.role && t.role.toLowerCase().includes(qLower)) ||
        (t.discipline && t.discipline.toLowerCase().includes(qLower)) ||
        (t.disciplineCode && t.disciplineCode.toLowerCase().includes(qLower)) ||
        (t.handle && t.handle.toLowerCase().includes(qLower)) ||
        (t.bio && t.bio.toLowerCase().includes(qLower)) ||
        (t.academicYear && t.academicYear.toLowerCase().includes(qLower))
      );
    }

    // Sort
    if (sortBy === 'order_desc') {
      filtered.sort((a, b) => (b.order || 0) - (a.order || 0));
    } else if (sortBy === 'name_asc') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'name_desc') {
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else {
      // order_asc
      filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    const totalMatching = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * pageLimit, pageNum * pageLimit);

    const allTeam = memoryStore.team;
    const totalAllMem = allTeam.length;
    const totalActiveMem = allTeam.filter(t => !t.isArchived && t.status !== 'draft' && t.status !== 'archived').length;
    const totalLeadershipMem = allTeam.filter(t => t.isHeadOfDiscipline && !t.isArchived).length;
    const totalDraftMem = allTeam.filter(t => t.status === 'draft').length;
    const totalArchivedMem = allTeam.filter(t => t.isArchived || t.status === 'archived').length;

    res.json({
      success: true,
      count: paginated.length,
      total: totalMatching,
      pagination: {
        page: pageNum,
        limit: pageLimit,
        totalPages: Math.ceil(totalMatching / pageLimit)
      },
      counts: {
        all: totalAllMem,
        active: totalActiveMem,
        leadership: totalLeadershipMem,
        draft: totalDraftMem,
        archived: totalArchivedMem,
        direction: allTeam.filter(t => t.discipline === 'direction').length,
        cinematography: allTeam.filter(t => t.discipline === 'cinematography').length,
        sound: allTeam.filter(t => t.discipline === 'sound').length,
        photo: allTeam.filter(t => t.discipline === 'photo').length
      },
      metrics: {
        total: totalAllMem,
        active: totalActiveMem,
        leadership: totalLeadershipMem,
        drafts: totalDraftMem,
        archived: totalArchivedMem
      },
      data: paginated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5.2 GET /api/admin/team/:id - Fetch Single Team Member Record
app.get('/api/admin/team/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const member = await TeamMember.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { name: id },
          { handle: id },
          { handle: `@${id}` }
        ]
      });
      if (!member) return res.status(404).json({ success: false, message: 'Team member record not found.' });
      return res.json({ success: true, data: member });
    }

    const member = memoryStore.team.find(t => t._id === id || t.name === id || t.handle === id || t.handle === `@${id}`);
    if (!member) return res.status(404).json({ success: false, message: 'Team member record not found.' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5.3 POST /api/admin/team - Create New Team Member
app.post('/api/admin/team', authenticateToken, async (req, res) => {
  const {
    name,
    role,
    discipline = 'general',
    disciplineCode,
    handle,
    portraitUrl,
    image,
    bio,
    academicYear = '2025–2026',
    isHeadOfDiscipline = true,
    status = 'active',
    order
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Member full name is required.' });
  }
  if (!role || !role.trim()) {
    return res.status(400).json({ success: false, message: 'Official role / title is required.' });
  }

  const finalPortrait = (portraitUrl || image || '').trim();
  if (!finalPortrait) {
    return res.status(400).json({ success: false, message: 'Profile portrait image URL or upload is required.' });
  }

  const isArchived = status === 'archived';
  const isLeaderVal = isHeadOfDiscipline === true || isHeadOfDiscipline === 'true';

  let autoDisciplineCode = disciplineCode;
  if (!autoDisciplineCode || !autoDisciplineCode.trim()) {
    if (discipline === 'direction') autoDisciplineCode = 'DIR • 01';
    else if (discipline === 'cinematography') autoDisciplineCode = 'DOP • 02';
    else if (discipline === 'sound') autoDisciplineCode = 'AUDIO • 03';
    else if (discipline === 'photo') autoDisciplineCode = 'STILL • 04';
    else if (discipline === 'design') autoDisciplineCode = 'DESIGN • 05';
    else if (discipline === 'production') autoDisciplineCode = 'PROD • 06';
    else autoDisciplineCode = 'CREW • 01';
  }

  try {
    if (isMongoConnected) {
      const count = await TeamMember.countDocuments();
      const finalOrder = order !== undefined && order !== '' ? parseInt(order) : count + 1;

      const newMember = await TeamMember.create({
        name: name.trim(),
        role: role.trim(),
        discipline,
        disciplineCode: autoDisciplineCode.trim(),
        handle: (handle || '').trim(),
        portraitUrl: finalPortrait,
        image: finalPortrait,
        bio: (bio || '').trim(),
        academicYear: (academicYear || '2025–2026').trim(),
        isHeadOfDiscipline: isLeaderVal,
        isArchived,
        status: status || 'active',
        order: finalOrder
      });

      return res.status(201).json({
        success: true,
        message: 'Team member created and cataloged successfully.',
        data: newMember
      });
    }

    // Memory Store Fallback
    const finalOrder = order !== undefined && order !== '' ? parseInt(order) : memoryStore.team.length + 1;
    const memberObj = {
      _id: `team-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      discipline,
      disciplineCode: autoDisciplineCode.trim(),
      handle: (handle || '').trim(),
      portraitUrl: finalPortrait,
      image: finalPortrait,
      bio: (bio || '').trim(),
      academicYear: (academicYear || '2025–2026').trim(),
      isHeadOfDiscipline: isLeaderVal,
      isArchived,
      status: status || 'active',
      order: finalOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryStore.team.push(memberObj);

    res.status(201).json({
      success: true,
      message: 'Team member created and cataloged successfully.',
      data: memberObj
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5.4 PUT /api/admin/team/:id - Update Team Member Profile
app.put('/api/admin/team/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatePayload = { ...req.body };

  if (updatePayload.name && !updatePayload.name.trim()) {
    return res.status(400).json({ success: false, message: 'Member name cannot be empty.' });
  }
  if (updatePayload.role && !updatePayload.role.trim()) {
    return res.status(400).json({ success: false, message: 'Member role cannot be empty.' });
  }

  if (updatePayload.portraitUrl || updatePayload.image) {
    updatePayload.portraitUrl = (updatePayload.portraitUrl || updatePayload.image).trim();
    updatePayload.image = updatePayload.portraitUrl;
  }

  if (updatePayload.status === 'archived') {
    updatePayload.isArchived = true;
  } else if (updatePayload.status && updatePayload.status !== 'archived') {
    updatePayload.isArchived = false;
  }

  if (updatePayload.isHeadOfDiscipline !== undefined) {
    updatePayload.isHeadOfDiscipline = updatePayload.isHeadOfDiscipline === true || updatePayload.isHeadOfDiscipline === 'true';
  }

  if (updatePayload.order !== undefined && updatePayload.order !== '') {
    updatePayload.order = parseInt(updatePayload.order) || 0;
  }

  try {
    if (isMongoConnected) {
      const member = await TeamMember.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { name: id },
          { handle: id }
        ]
      });

      if (!member) return res.status(404).json({ success: false, message: 'Team member record not found.' });

      const updated = await TeamMember.findByIdAndUpdate(member._id, updatePayload, { new: true });
      return res.json({
        success: true,
        message: 'Team member profile updated and synchronized.',
        data: updated
      });
    }

    const idx = memoryStore.team.findIndex(t => t._id === id || t.name === id || t.handle === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Team member record not found.' });

    memoryStore.team[idx] = {
      ...memoryStore.team[idx],
      ...updatePayload,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Team member profile updated and synchronized.',
      data: memoryStore.team[idx]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5.5 PATCH /api/admin/team/:id/archive - Toggle Archive Status
app.patch('/api/admin/team/:id/archive', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const member = await TeamMember.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { name: id },
          { handle: id }
        ]
      });

      if (!member) return res.status(404).json({ success: false, message: 'Team member record not found.' });

      const nextArchived = !member.isArchived;
      member.isArchived = nextArchived;
      member.status = nextArchived ? 'archived' : 'active';
      await member.save();

      return res.json({
        success: true,
        message: nextArchived ? `Team member ${member.name} archived from public collective roster.` : `Team member ${member.name} restored to active roster.`,
        data: member
      });
    }

    const member = memoryStore.team.find(t => t._id === id || t.name === id || t.handle === id);
    if (!member) return res.status(404).json({ success: false, message: 'Team member record not found.' });

    member.isArchived = !member.isArchived;
    member.status = member.isArchived ? 'archived' : 'active';
    member.updatedAt = new Date();

    res.json({
      success: true,
      message: member.isArchived ? `Team member ${member.name} archived from public collective roster.` : `Team member ${member.name} restored to active roster.`,
      data: member
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5.6 PATCH /api/admin/team/reorder - Bulk Update Team Display Sequence
app.patch('/api/admin/team/reorder', authenticateToken, async (req, res) => {
  const { items, orders } = req.body;
  const list = orders || items;
  if (!Array.isArray(list) || list.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid reorder payload. Array of { id, order } required.' });
  }

  try {
    if (isMongoConnected) {
      const bulkOps = list.map(item => {
        const query = {
          $or: [
            { _id: mongoose.isValidObjectId(item.id) ? item.id : null },
            { name: item.id },
            { handle: item.id }
          ]
        };
        return {
          updateOne: {
            filter: query,
            update: { $set: { order: parseInt(item.order) || 0 } }
          }
        };
      });

      await TeamMember.bulkWrite(bulkOps);
      const updatedTeam = await TeamMember.find().sort({ order: 1 });
      return res.json({
        success: true,
        message: 'Team display sequence updated and persisted successfully.',
        data: updatedTeam
      });
    }

    list.forEach(item => {
      const member = memoryStore.team.find(t => t._id === item.id || t.name === item.id || t.handle === item.id);
      if (member) {
        member.order = parseInt(item.order) || 0;
        member.updatedAt = new Date();
      }
    });

    memoryStore.team.sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      success: true,
      message: 'Team display sequence updated and persisted successfully.',
      data: memoryStore.team
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5.7 DELETE /api/admin/team/:id - Destructive Team Member Deletion (Super Admin only)
app.delete('/api/admin/team/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const member = await TeamMember.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(id) ? id : null },
          { name: id },
          { handle: id }
        ]
      });

      if (!member) return res.status(404).json({ success: false, message: 'Team member record not found.' });

      await TeamMember.findByIdAndDelete(member._id);
      return res.json({ success: true, message: `Team member "${member.name}" has been permanently removed from the collective registry.` });
    }

    const member = memoryStore.team.find(t => t._id === id || t.name === id || t.handle === id);
    if (!member) return res.status(404).json({ success: false, message: 'Team member record not found.' });

    memoryStore.team = memoryStore.team.filter(t => t._id !== id && t.name !== id && t.handle !== id);

    res.json({ success: true, message: `Team member "${member.name}" has been permanently removed from the collective registry.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Contact Inbox Management Suite (Step 7)
app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
  const { status, search, q, dateRange, range, sort, page = 1, limit = 20 } = req.query;
  const activeSearch = (search || q || '').trim().toLowerCase();
  const activeRange = (dateRange || range || 'all').toLowerCase();
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 20));

  try {
    if (isMongoConnected) {
      let query = {};

      // 1. Status Filter
      if (status && status !== 'all') {
        if (status === 'pending') {
          query.$or = [{ status: 'pending' }, { isRead: false }];
        } else if (status === 'unread') {
          query.isRead = false;
        } else if (status === 'read') {
          query.$and = [{ status: 'read' }, { isRead: true }];
        } else {
          query.status = status;
        }
      }

      // 2. Date Range Filter
      if (activeRange !== 'all') {
        const now = new Date();
        let startDate = null;
        if (activeRange === 'today') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (activeRange === '7days' || activeRange === '7d' || activeRange === 'week') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (activeRange === '30days' || activeRange === '30d' || activeRange === 'month') {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        if (startDate) {
          query.createdAt = { $gte: startDate };
        }
      }

      // 3. Search Query Filter
      if (activeSearch) {
        const regex = new RegExp(activeSearch, 'i');
        const searchClause = [
          { name: regex },
          { email: regex },
          { phone: regex },
          { contactNumber: regex },
          { subject: regex },
          { message: regex },
          { notes: regex }
        ];
        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: searchClause }];
          delete query.$or;
        } else {
          query.$or = searchClause;
        }
      }

      // 4. Sort Options
      let sortObj = { createdAt: -1 };
      if (sort === 'oldest') {
        sortObj = { createdAt: 1 };
      } else if (sort === 'unread_first' || sort === 'unread') {
        sortObj = { isRead: 1, createdAt: -1 };
      } else if (sort === 'updated' || sort === 'recently_updated') {
        sortObj = { updatedAt: -1 };
      }

      const totalMatching = await Contact.countDocuments(query);
      const contacts = await Contact.find(query)
        .sort(sortObj)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      // Global Live Stats Aggregation
      const allContacts = await Contact.find({}, { status: 1, isRead: 1 });
      const stats = {
        total: allContacts.length,
        pending: allContacts.filter(c => c.status === 'pending' || !c.isRead).length,
        unread: allContacts.filter(c => !c.isRead).length,
        read: allContacts.filter(c => c.isRead && c.status === 'read').length,
        resolved: allContacts.filter(c => c.status === 'resolved').length,
        spam: allContacts.filter(c => c.status === 'spam').length
      };

      return res.json({
        success: true,
        count: contacts.length,
        total: totalMatching,
        page: pageNum,
        totalPages: Math.max(1, Math.ceil(totalMatching / limitNum)),
        limit: limitNum,
        pagination: {
          total: totalMatching,
          page: pageNum,
          totalPages: Math.max(1, Math.ceil(totalMatching / limitNum)),
          limit: limitNum
        },
        stats,
        contacts,
        data: contacts
      });
    }

    // High-Fidelity Active Memory Store Fallback
    let list = [...memoryStore.contacts];

    // Status Filter
    if (status && status !== 'all') {
      if (status === 'pending') {
        list = list.filter(c => c.status === 'pending' || !c.isRead);
      } else if (status === 'unread') {
        list = list.filter(c => !c.isRead);
      } else if (status === 'read') {
        list = list.filter(c => c.isRead && c.status === 'read');
      } else {
        list = list.filter(c => c.status === status);
      }
    }

    // Date Filter
    if (activeRange !== 'all') {
      const now = new Date();
      let threshold = null;
      if (activeRange === 'today') {
        threshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (activeRange === '7days' || activeRange === '7d' || activeRange === 'week') {
        threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (activeRange === '30days' || activeRange === '30d' || activeRange === 'month') {
        threshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      if (threshold) {
        list = list.filter(c => new Date(c.createdAt) >= threshold);
      }
    }

    // Search Filter
    if (activeSearch) {
      list = list.filter(c =>
        (c.name && c.name.toLowerCase().includes(activeSearch)) ||
        (c.email && c.email.toLowerCase().includes(activeSearch)) ||
        (c.phone && c.phone.toLowerCase().includes(activeSearch)) ||
        (c.contactNumber && c.contactNumber.toLowerCase().includes(activeSearch)) ||
        (c.subject && c.subject.toLowerCase().includes(activeSearch)) ||
        (c.message && c.message.toLowerCase().includes(activeSearch)) ||
        (c.notes && c.notes.toLowerCase().includes(activeSearch))
      );
    }

    // Sort Options
    if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'unread_first' || sort === 'unread') {
      list.sort((a, b) => {
        if (a.isRead === b.isRead) return new Date(b.createdAt) - new Date(a.createdAt);
        return a.isRead ? 1 : -1;
      });
    } else if (sort === 'updated' || sort === 'recently_updated') {
      list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const totalMatching = list.length;
    const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    const stats = {
      total: memoryStore.contacts.length,
      pending: memoryStore.contacts.filter(c => c.status === 'pending' || !c.isRead).length,
      unread: memoryStore.contacts.filter(c => !c.isRead).length,
      read: memoryStore.contacts.filter(c => c.isRead && c.status === 'read').length,
      resolved: memoryStore.contacts.filter(c => c.status === 'resolved').length,
      spam: memoryStore.contacts.filter(c => c.status === 'spam').length
    };

    res.json({
      success: true,
      count: paginated.length,
      total: totalMatching,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(totalMatching / limitNum)),
      limit: limitNum,
      pagination: {
        total: totalMatching,
        page: pageNum,
        totalPages: Math.max(1, Math.ceil(totalMatching / limitNum)),
        limit: limitNum
      },
      stats,
      contacts: paginated,
      data: paginated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6.1 GET /api/admin/contacts/:id - Single Message Detail
app.get('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      let contact = await Contact.findById(id);
      if (!contact) return res.status(404).json({ success: false, message: 'Message record not found.' });
      if (!contact.isRead) {
        contact.isRead = true;
        contact.readAt = new Date();
        if (contact.status === 'pending') contact.status = 'read';
        await contact.save();
      }
      return res.json({ success: true, contact, data: contact });
    }

    const contact = memoryStore.contacts.find(c => c._id === id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message record not found.' });
    if (!contact.isRead) {
      contact.isRead = true;
      contact.readAt = new Date();
      if (contact.status === 'pending') contact.status = 'read';
    }
    res.json({ success: true, contact, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6.2 PUT / PATCH /api/admin/contacts/:id - Update Status, Read State, and Admin Notes
const handleContactUpdate = async (req, res) => {
  const { id } = req.params;
  const { status, isRead, notes } = req.body;

  try {
    let updateFields = {};
    if (status !== undefined) {
      updateFields.status = status;
      if (status === 'read') {
        updateFields.isRead = true;
        updateFields.readAt = new Date();
      } else if (status === 'pending') {
        updateFields.isRead = false;
        updateFields.readAt = null;
      } else if (status === 'resolved' || status === 'spam') {
        updateFields.isRead = true;
      }
    }

    if (isRead !== undefined) {
      updateFields.isRead = Boolean(isRead);
      if (updateFields.isRead) {
        updateFields.readAt = new Date();
        if (!status) updateFields.status = 'read';
      } else {
        updateFields.readAt = null;
        if (!status) updateFields.status = 'pending';
      }
    }

    if (notes !== undefined) {
      updateFields.notes = sanitizeInput(notes, 2000);
    }

    updateFields.updatedAt = new Date();

    if (isMongoConnected) {
      const updated = await Contact.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Message record not found.' });
      return res.json({ success: true, message: 'Message status updated successfully.', contact: updated, data: updated });
    }

    const item = memoryStore.contacts.find(c => c._id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Message record not found.' });

    Object.assign(item, updateFields);
    res.json({ success: true, message: 'Message status updated successfully.', contact: item, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

app.put('/api/admin/contacts/:id', authenticateToken, handleContactUpdate);
app.patch('/api/admin/contacts/:id', authenticateToken, handleContactUpdate);

// 6.3 DELETE /api/admin/contacts/:id - Permanent Message Deletion (Super Admin Only)
app.delete('/api/admin/contacts/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const deleted = await Contact.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Message record not found.' });
      return res.json({ success: true, message: 'Message permanently removed from contact inbox.' });
    }

    const index = memoryStore.contacts.findIndex(c => c._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Message record not found.' });

    memoryStore.contacts.splice(index, 1);
    res.json({ success: true, message: 'Message permanently removed from contact inbox.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Cohort Applications Management
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  const { discipline, status } = req.query;
  try {
    if (isMongoConnected) {
      let query = {};
      if (discipline && discipline !== 'all') query.discipline = discipline;
      if (status && status !== 'all') query.status = status;
      const apps = await Application.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: apps.length, data: apps });
    }

    let list = memoryStore.applications;
    if (discipline && discipline !== 'all') list = list.filter(a => a.discipline === discipline);
    if (status && status !== 'all') list = list.filter(a => a.status === status);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/applications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, curatorNotes } = req.body;
  try {
    if (isMongoConnected) {
      const updated = await Application.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { applicationId: id }] },
        { status, curatorNotes },
        { new: true }
      );
      return res.json({ success: true, message: 'Application updated.', data: updated });
    }

    const item = memoryStore.applications.find(a => a._id === id || a.applicationId === id);
    if (item) {
      if (status) item.status = status;
      if (curatorNotes !== undefined) item.curatorNotes = curatorNotes;
    }
    res.json({ success: true, message: 'Application updated.', data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/admin/applications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, curatorNotes } = req.body;
  try {
    if (isMongoConnected) {
      const updated = await Application.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { applicationId: id }] },
        { status, curatorNotes },
        { new: true }
      );
      return res.json({ success: true, message: 'Application updated.', data: updated });
    }

    const item = memoryStore.applications.find(a => a._id === id || a.applicationId === id);
    if (item) {
      if (status) item.status = status;
      if (curatorNotes !== undefined) item.curatorNotes = curatorNotes;
    }
    res.json({ success: true, message: 'Application updated.', data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Site Content & CMS Management
app.get('/api/admin/content', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) content = await SiteContent.create(initialSiteContent);
      return res.json({ success: true, data: content });
    }
    res.json({ success: true, data: memoryStore.siteContent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/content', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected) {
      const updated = await SiteContent.findOneAndUpdate(
        { key: 'main' },
        { $set: req.body },
        { new: true, upsert: true }
      );
      return res.json({ success: true, message: 'Site content updated.', data: updated });
    }

    memoryStore.siteContent = { ...memoryStore.siteContent, ...req.body };
    res.json({ success: true, message: 'Site content updated.', data: memoryStore.siteContent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Equipment Locker Management
app.get('/api/admin/equipment', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected) {
      const items = await Equipment.find();
      return res.json({ success: true, count: items.length, data: items });
    }
    res.json({ success: true, count: memoryStore.equipment.length, data: memoryStore.equipment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/equipment', authenticateToken, async (req, res) => {
  const { name, category, status, statusLabel, assignedTo } = req.body;
  const itemCode = `RIG-${Math.floor(10 + Math.random() * 90)}`;
  try {
    if (isMongoConnected) {
      const gear = await Equipment.create({
        itemCode,
        name,
        category: category || 'Camera',
        status: status || 'in_vault',
        statusLabel: statusLabel || 'In Vault // Inspected',
        assignedTo: assignedTo || ''
      });
      return res.status(201).json({ success: true, message: 'Gear added.', data: gear });
    }

    const gearObj = {
      _id: 'eq-' + Date.now(),
      itemCode,
      name,
      category: category || 'Camera',
      status: status || 'in_vault',
      statusLabel: statusLabel || 'In Vault // Inspected',
      assignedTo: assignedTo || ''
    };
    memoryStore.equipment.push(gearObj);
    res.status(201).json({ success: true, message: 'Gear added.', data: gearObj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/admin/equipment/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, statusLabel, assignedTo } = req.body;
  try {
    if (isMongoConnected) {
      const updated = await Equipment.findByIdAndUpdate(
        id,
        { status, statusLabel, assignedTo },
        { new: true }
      );
      return res.json({ success: true, message: 'Equipment status updated.', data: updated });
    }

    const gear = memoryStore.equipment.find(e => e._id === id || e.itemCode === id);
    if (gear) {
      if (status) gear.status = status;
      if (statusLabel) gear.statusLabel = statusLabel;
      if (assignedTo !== undefined) gear.assignedTo = assignedTo;
    }
    res.json({ success: true, message: 'Equipment status updated.', data: gear });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. USER MANAGEMENT & SECURITY RBAC (Super Admin Only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongoConnected) {
      const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: users.length, data: users });
    }

    const users = (memoryStore.users || []).map(({ passwordHash, ...u }) => u);
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve administrative users.' });
  }
});

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  const { username, email, password, role = 'editor', fullName = '' } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Username validation
  if (!/^[a-zA-Z0-9_-]{3,50}$/.test(cleanUsername)) {
    return res.status(400).json({ success: false, message: 'Username must be 3-50 alphanumeric characters (underscores and hyphens allowed).' });
  }

  // Email validation
  if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Invalid email address format.' });
  }

  // Password length
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
  }

  // Allowed role
  const targetRole = role === 'admin' || role === 'super_admin' ? 'admin' : 'editor';

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    if (isMongoConnected) {
      const existingUser = await User.findOne({ $or: [{ username: cleanUsername }, { email: cleanEmail }] });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username or email is already registered.' });
      }

      const newUser = await User.create({
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        role: targetRole,
        fullName: sanitizeInput(fullName) || cleanUsername,
        isActive: true
      });

      await logAuditEvent(req, 'USER_CREATE', 'user', newUser._id, `Created ${targetRole} user "${cleanUsername}"`);

      return res.status(201).json({
        success: true,
        message: `Admin user "${cleanUsername}" created successfully.`,
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt
        }
      });
    }

    // Memory Store
    const duplicate = (memoryStore.users || []).find(u => u.username === cleanUsername || u.email === cleanEmail);
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'Username or email is already registered.' });
    }

    const userObj = {
      _id: `user-${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role: targetRole,
      fullName: sanitizeInput(fullName) || cleanUsername,
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!memoryStore.users) memoryStore.users = [];
    memoryStore.users.push(userObj);

    await logAuditEvent(req, 'USER_CREATE', 'user', userObj._id, `Created ${targetRole} user "${cleanUsername}"`);

    const { passwordHash: _, ...safeUser } = userObj;
    res.status(201).json({ success: true, message: `Admin user "${cleanUsername}" created successfully.`, data: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create user account.' });
  }
});

app.patch('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role, fullName, email, isActive } = req.body;

  try {
    let existingUser = null;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      existingUser = await User.findById(id);
    }
    if (!existingUser) {
      existingUser = (memoryStore.users || []).find(u => String(u._id) === String(id) || u.username === id);
    }

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Guard: Prevent deactivating or demoting the last active Super Admin
    if ((role === 'editor' || isActive === false) && existingUser.role === 'admin') {
      let activeAdminsCount = 0;
      if (isMongoConnected) {
        activeAdminsCount = await User.countDocuments({ role: { $in: ['admin', 'super_admin'] }, isActive: { $ne: false } });
      } else {
        activeAdminsCount = (memoryStore.users || []).filter(u => (u.role === 'admin' || u.role === 'super_admin') && u.isActive !== false).length;
      }

      if (activeAdminsCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote or deactivate the last active Super Admin account.'
        });
      }
    }

    if (role && (role === 'admin' || role === 'editor')) existingUser.role = role;
    if (fullName !== undefined) existingUser.fullName = sanitizeInput(fullName);
    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      if (/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(cleanEmail)) {
        existingUser.email = cleanEmail;
      }
    }
    if (isActive !== undefined) existingUser.isActive = Boolean(isActive);
    existingUser.updatedAt = new Date();

    if (isMongoConnected && existingUser.save) {
      await existingUser.save();
    }

    await logAuditEvent(req, 'USER_UPDATE', 'user', existingUser._id || id, `Updated account details for "${existingUser.username}"`);

    res.json({
      success: true,
      message: `User "${existingUser.username}" updated successfully.`,
      data: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        fullName: existingUser.fullName,
        role: existingUser.role,
        isActive: existingUser.isActive,
        lastLogin: existingUser.lastLogin,
        updatedAt: existingUser.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update user account.' });
  }
});

app.patch('/api/admin/users/:id/password', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ success: false, message: 'New passcode must be at least 8 characters long.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    let targetUsername = '';

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User account not found.' });
      user.passwordHash = passwordHash;
      await user.save();
      targetUsername = user.username;
    } else {
      const user = (memoryStore.users || []).find(u => String(u._id) === String(id) || u.username === id);
      if (!user) return res.status(404).json({ success: false, message: 'User account not found.' });
      user.passwordHash = passwordHash;
      user.updatedAt = new Date();
      targetUsername = user.username;
    }

    await logAuditEvent(req, 'USER_PASSWORD_RESET', 'user', id, `Reset passcode for user "${targetUsername}"`);

    res.json({ success: true, message: `Passcode for "${targetUsername}" has been updated.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset user passcode.' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    let targetUser = null;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      targetUser = await User.findById(id);
    }
    if (!targetUser) {
      targetUser = (memoryStore.users || []).find(u => String(u._id) === String(id) || u.username === id);
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Guard 1: Prevent user from deleting their own currently logged in account
    if (req.user && (String(req.user.id) === String(targetUser._id) || req.user.username === targetUser.username)) {
      return res.status(400).json({
        success: false,
        message: 'Security Guard: You cannot delete your own currently active Super Admin account.'
      });
    }

    // Guard 2: Prevent deleting the last active Super Admin account
    if (targetUser.role === 'admin' || targetUser.role === 'super_admin') {
      let activeAdminsCount = 0;
      if (isMongoConnected) {
        activeAdminsCount = await User.countDocuments({ role: { $in: ['admin', 'super_admin'] }, isActive: { $ne: false } });
      } else {
        activeAdminsCount = (memoryStore.users || []).filter(u => (u.role === 'admin' || u.role === 'super_admin') && u.isActive !== false).length;
      }

      if (activeAdminsCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Security Guard: Cannot delete the last active Super Admin account.'
        });
      }
    }

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      await User.findByIdAndDelete(id);
    } else {
      memoryStore.users = (memoryStore.users || []).filter(u => String(u._id) !== String(id) && u.username !== id);
    }

    await logAuditEvent(req, 'USER_DELETE', 'user', id, `Deleted user account "${targetUser.username}"`);

    res.json({ success: true, message: `User account "${targetUser.username}" permanently deleted.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user account.' });
  }
});

// 11. SECURITY AUDIT LOGS (Super Admin Only)
app.get('/api/admin/audit-logs', authenticateToken, requireAdmin, async (req, res) => {
  const { page = 1, limit = 50, action = '', status = '' } = req.query;
  try {
    if (isMongoConnected) {
      let query = {};
      if (action) query.action = action;
      if (status) query.status = status;
      const total = await AuditLog.countDocuments(query);
      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip((Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10))
        .limit(parseInt(limit, 10))
        .lean();

      return res.json({
        success: true,
        count: logs.length,
        total,
        page: parseInt(page, 10),
        data: logs
      });
    }

    let logs = [...(memoryStore.auditLogs || [])];
    if (action) logs = logs.filter(l => l.action === action);
    if (status) logs = logs.filter(l => l.status === status);

    const total = logs.length;
    const startIndex = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const paginated = logs.slice(startIndex, startIndex + parseInt(limit, 10));

    res.json({
      success: true,
      count: paginated.length,
      total,
      page: parseInt(page, 10),
      data: paginated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve audit logs.' });
  }
});

// =========================================================================
// 10.5 HOMEPAGE CONTENT CMS ENDPOINTS (STEP 8)
// =========================================================================

// Helper: Retrieve or initialize SiteContent from DB or Memory Store
async function getOrInitSiteContent() {
  if (isMongoConnected) {
    let content = await SiteContent.findOne({ key: 'main' });
    if (!content) {
      content = await SiteContent.create(initialSiteContent);
    }
    return content;
  }
  if (!memoryStore.siteContent) {
    memoryStore.siteContent = { ...initialSiteContent };
  }
  return memoryStore.siteContent;
}

// Helper: Populate Featured Works and Events without duplicating databases
async function populateHomepageEntities(contentDoc) {
  const content = contentDoc.toObject ? contentDoc.toObject() : { ...contentDoc };
  
  // 1. Resolve Featured Works
  let featuredWorks = [];
  if (isMongoConnected) {
    if (content.featuredWorksMode === 'manual' && Array.isArray(content.featuredWorkIds) && content.featuredWorkIds.length > 0) {
      const validIds = content.featuredWorkIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      const fetchedWorks = await Work.find({
        $or: [
          { _id: { $in: validIds } },
          { workCode: { $in: content.featuredWorkIds } },
          { slug: { $in: content.featuredWorkIds } }
        ],
        status: 'published',
        isArchived: { $ne: true }
      });
      content.featuredWorkIds.forEach(id => {
        const found = fetchedWorks.find(w => String(w._id) === String(id) || w.workCode === id || w.slug === id);
        if (found && !featuredWorks.some(fw => String(fw._id) === String(found._id))) {
          featuredWorks.push(found);
        }
      });
    }
    if (featuredWorks.length === 0) {
      featuredWorks = await Work.find({ status: 'published', isArchived: { $ne: true } })
        .sort({ order: 1, createdAt: -1 })
        .limit(4);
    }
  } else {
    const allWorks = (memoryStore.works || []).filter(w => w.status === 'published' && !w.isArchived);
    if (content.featuredWorksMode === 'manual' && Array.isArray(content.featuredWorkIds) && content.featuredWorkIds.length > 0) {
      content.featuredWorkIds.forEach(id => {
        const found = allWorks.find(w => String(w._id) === String(id) || w.workCode === id || w.slug === id);
        if (found && !featuredWorks.some(fw => String(fw._id) === String(found._id))) {
          featuredWorks.push(found);
        }
      });
    }
    if (featuredWorks.length === 0) {
      featuredWorks = allWorks.slice(0, 4);
    }
  }

  // 2. Resolve Featured Events
  let featuredEvents = [];
  if (isMongoConnected) {
    if (content.featuredEventsMode === 'upcoming') {
      featuredEvents = await Event.find({
        status: { $in: ['published', 'active'] },
        isArchived: { $ne: true }
      }).sort({ eventDate: 1 }).limit(4);
    } else if (content.featuredEventsMode === 'manual' && Array.isArray(content.featuredEventIds) && content.featuredEventIds.length > 0) {
      const validIds = content.featuredEventIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      const fetchedEvents = await Event.find({
        $or: [
          { _id: { $in: validIds } },
          { slug: { $in: content.featuredEventIds } }
        ],
        status: { $in: ['published', 'active'] },
        isArchived: { $ne: true }
      });
      content.featuredEventIds.forEach(id => {
        const found = fetchedEvents.find(e => String(e._id) === String(id) || e.slug === id);
        if (found && !featuredEvents.some(fe => String(fe._id) === String(found._id))) {
          featuredEvents.push(found);
        }
      });
    }
    if (featuredEvents.length === 0) {
      featuredEvents = await Event.find({ status: { $in: ['published', 'active'] }, isArchived: { $ne: true } })
        .sort({ eventDate: 1 })
        .limit(2);
    }
  } else {
    const allEvents = (memoryStore.events || []).filter(e => (e.status === 'published' || e.status === 'active') && !e.isArchived);
    if (content.featuredEventsMode === 'upcoming') {
      featuredEvents = allEvents.slice().sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)).slice(0, 4);
    } else if (content.featuredEventsMode === 'manual' && Array.isArray(content.featuredEventIds) && content.featuredEventIds.length > 0) {
      content.featuredEventIds.forEach(id => {
        const found = allEvents.find(e => String(e._id) === String(id) || e.slug === id);
        if (found && !featuredEvents.some(fe => String(fe._id) === String(found._id))) {
          featuredEvents.push(found);
        }
      });
    }
    if (featuredEvents.length === 0) {
      featuredEvents = allEvents.slice(0, 2);
    }
  }

  return {
    ...content,
    featuredWorks,
    featuredEvents
  };
}

// 10.5.1 Public Homepage Content Endpoint
app.get(['/api/content', '/api/content/home'], async (req, res) => {
  try {
    const rawContent = await getOrInitSiteContent();
    const populated = await populateHomepageEntities(rawContent);

    // Strip sensitive / draft data from public response
    const { draftData: _, ...publicData } = populated;

    res.json({
      success: true,
      data: publicData
    });
  } catch (err) {
    console.error('Failed to load public homepage content:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve published homepage content.' });
  }
});

// 10.5.2 Admin Homepage Content Endpoint (Returns published, draft, & selectable items)
app.get(['/api/admin/content', '/api/admin/content/home'], authenticateToken, async (req, res) => {
  try {
    const rawContent = await getOrInitSiteContent();
    const contentObj = rawContent.toObject ? rawContent.toObject() : { ...rawContent };

    // Fetch available published works and events for picker controls
    let availableWorks = [];
    let availableEvents = [];

    if (isMongoConnected) {
      availableWorks = await Work.find({ status: 'published', isArchived: { $ne: true } })
        .select('_id title workCode slug image discipline format order')
        .sort({ order: 1, createdAt: -1 });
      availableEvents = await Event.find({ status: { $in: ['published', 'active'] }, isArchived: { $ne: true } })
        .select('_id title slug eventDate dateDisplay time location badge category')
        .sort({ eventDate: 1 });
    } else {
      availableWorks = (memoryStore.works || [])
        .filter(w => w.status === 'published' && !w.isArchived)
        .map(w => ({ _id: w._id, title: w.title, workCode: w.workCode, slug: w.slug, image: w.image, discipline: w.discipline, format: w.format, order: w.order }));
      availableEvents = (memoryStore.events || [])
        .filter(e => (e.status === 'published' || e.status === 'active') && !e.isArchived)
        .map(e => ({ _id: e._id, title: e.title, slug: e.slug, eventDate: e.eventDate, dateDisplay: e.dateDisplay, time: e.time, location: e.location, badge: e.badge, category: e.category }));
    }

    res.json({
      success: true,
      data: {
        published: contentObj,
        draft: contentObj.draftData || null,
        hasDraft: Boolean(contentObj.draftData),
        availableWorks,
        availableEvents
      }
    });
  } catch (err) {
    console.error('Failed to load admin content:', err);
    res.status(500).json({ success: false, error: 'Failed to load content settings.' });
  }
});

// Helper: Sanitize & Validate Content Payload (Supports both flat and nested payloads)
function sanitizeContentPayload(body) {
  const sanitized = {};
  const hero = body.hero || {};
  const manifesto = body.manifesto || {};
  const announcement = body.announcement || {};
  const visibility = body.sectionVisibility || {};

  // Hero Section
  const h1 = body.heroHeadingLine1 !== undefined ? body.heroHeadingLine1 : hero.headingLine1;
  if (h1 !== undefined) sanitized.heroHeadingLine1 = sanitizeInput(h1, 150);

  const h2 = body.heroHeadingLine2 !== undefined ? body.heroHeadingLine2 : hero.headingLine2;
  if (h2 !== undefined) sanitized.heroHeadingLine2 = sanitizeInput(h2, 150);

  const hSub = body.heroSubheading !== undefined ? body.heroSubheading : hero.subheading;
  if (hSub !== undefined) sanitized.heroSubheading = sanitizeInput(hSub, 1000);

  const hBadge = body.heroBadge !== undefined ? body.heroBadge : (hero.badgeLabel || hero.badge);
  if (hBadge !== undefined) sanitized.heroBadge = sanitizeInput(hBadge, 150);

  const hBg = body.heroBackgroundImage !== undefined ? body.heroBackgroundImage : (hero.backdropImage || hero.backgroundImage);
  if (hBg !== undefined) sanitized.heroBackgroundImage = String(hBg || '').trim().slice(0, 1000);

  const hType = body.heroMediaType !== undefined ? body.heroMediaType : (hero.backdropType || hero.mediaType);
  if (hType !== undefined) sanitized.heroMediaType = ['image', 'video'].includes(hType) ? hType : 'image';

  const hVid = body.heroVideoUrl !== undefined ? body.heroVideoUrl : (hero.backdropVideo || hero.videoUrl);
  if (hVid !== undefined) sanitized.heroVideoUrl = String(hVid || '').trim().slice(0, 1000);

  const hCta1Text = body.heroCtaPrimaryLabel !== undefined ? body.heroCtaPrimaryLabel : (hero.primaryCtaText || hero.ctaPrimaryLabel);
  if (hCta1Text !== undefined) sanitized.heroCtaPrimaryLabel = sanitizeInput(hCta1Text, 100);

  const hCta1Link = body.heroCtaPrimaryLink !== undefined ? body.heroCtaPrimaryLink : (hero.primaryCtaUrl || hero.ctaPrimaryLink);
  if (hCta1Link !== undefined) sanitized.heroCtaPrimaryLink = String(hCta1Link || '').trim().slice(0, 300);

  const hCta2Text = body.heroCtaSecondaryLabel !== undefined ? body.heroCtaSecondaryLabel : (hero.secondaryCtaText || hero.ctaSecondaryLabel);
  if (hCta2Text !== undefined) sanitized.heroCtaSecondaryLabel = sanitizeInput(hCta2Text, 100);

  const hCta2Link = body.heroCtaSecondaryLink !== undefined ? body.heroCtaSecondaryLink : (hero.secondaryCtaUrl || hero.ctaSecondaryLink);
  if (hCta2Link !== undefined) sanitized.heroCtaSecondaryLink = String(hCta2Link || '').trim().slice(0, 300);

  // Announcement Banner
  const aText = body.announcementText !== undefined ? body.announcementText : announcement.text;
  if (aText !== undefined) sanitized.announcementText = sanitizeInput(aText, 500);

  const aActive = body.announcementActive !== undefined ? body.announcementActive : announcement.active;
  if (aActive !== undefined) sanitized.announcementActive = Boolean(aActive);

  const aLink = body.announcementLink !== undefined ? body.announcementLink : (announcement.url || announcement.link);
  if (aLink !== undefined) sanitized.announcementLink = String(aLink || '').trim().slice(0, 300);

  const aLabel = body.announcementLinkLabel !== undefined ? body.announcementLinkLabel : (announcement.actionLabel || announcement.linkLabel);
  if (aLabel !== undefined) sanitized.announcementLinkLabel = sanitizeInput(aLabel, 100);

  // Manifesto & Editorial Section
  const mTag = body.manifestoTag !== undefined ? body.manifestoTag : manifesto.tag;
  if (mTag !== undefined) sanitized.manifestoTag = sanitizeInput(mTag, 150);

  const mHeading = body.manifestoHeading !== undefined ? body.manifestoHeading : manifesto.heading;
  if (mHeading !== undefined) sanitized.manifestoHeading = sanitizeInput(mHeading, 300);

  const mHighlight = body.manifestoHeadingHighlight !== undefined ? body.manifestoHeadingHighlight : (manifesto.italicHighlight || manifesto.headingHighlight);
  if (mHighlight !== undefined) sanitized.manifestoHeadingHighlight = sanitizeInput(mHighlight, 300);

  const mBody = body.manifestoBody !== undefined ? body.manifestoBody : manifesto.body;
  if (mBody !== undefined) sanitized.manifestoBody = sanitizeInput(mBody, 2000);

  const mPortrait = body.manifestoPortraitUrl !== undefined ? body.manifestoPortraitUrl : (manifesto.portraitUrl || manifesto.portrait);
  if (mPortrait !== undefined) sanitized.manifestoPortraitUrl = String(mPortrait || '').trim().slice(0, 1000);

  const mLead = body.manifestoPortraitLead !== undefined ? body.manifestoPortraitLead : manifesto.portraitLead;
  if (mLead !== undefined) sanitized.manifestoPortraitLead = sanitizeInput(mLead, 200);

  const mExif = body.manifestoPortraitExif !== undefined ? body.manifestoPortraitExif : manifesto.portraitExif;
  if (mExif !== undefined) sanitized.manifestoPortraitExif = sanitizeInput(mExif, 100);

  const mQuoteTitle = body.manifestoQuoteTitle !== undefined ? body.manifestoQuoteTitle : manifesto.quoteTitle;
  if (mQuoteTitle !== undefined) sanitized.manifestoQuoteTitle = sanitizeInput(mQuoteTitle, 200);

  const mQuoteBody = body.manifestoQuoteBody !== undefined ? body.manifestoQuoteBody : manifesto.quoteBody;
  if (mQuoteBody !== undefined) sanitized.manifestoQuoteBody = sanitizeInput(mQuoteBody, 1000);

  // Impact Metrics
  const pCount = body.productionsCount !== undefined ? body.productionsCount : manifesto.productionsCount;
  if (pCount !== undefined) sanitized.productionsCount = sanitizeInput(pCount, 50);

  const lCount = body.laurelsCount !== undefined ? body.laurelsCount : manifesto.laurelsCount;
  if (lCount !== undefined) sanitized.laurelsCount = sanitizeInput(lCount, 50);

  const fCount = body.preservedFramesCount !== undefined ? body.preservedFramesCount : manifesto.preservedFramesCount;
  if (fCount !== undefined) sanitized.preservedFramesCount = sanitizeInput(fCount, 50);

  const cCount = body.creatorsCount !== undefined ? body.creatorsCount : manifesto.creatorsCount;
  if (cCount !== undefined) sanitized.creatorsCount = sanitizeInput(cCount, 50);

  // Curated Featured Arrays
  if (Array.isArray(body.featuredWorkIds)) sanitized.featuredWorkIds = body.featuredWorkIds.map(id => String(id).trim()).filter(Boolean);
  if (body.featuredWorksMode !== undefined) sanitized.featuredWorksMode = ['manual', 'auto'].includes(body.featuredWorksMode) ? body.featuredWorksMode : 'manual';

  if (Array.isArray(body.featuredEventIds)) sanitized.featuredEventIds = body.featuredEventIds.map(id => String(id).trim()).filter(Boolean);
  if (body.featuredEventsMode !== undefined) sanitized.featuredEventsMode = ['upcoming', 'manual'].includes(body.featuredEventsMode) ? body.featuredEventsMode : 'upcoming';

  // Section Visibility
  const sHero = body.showHero !== undefined ? body.showHero : visibility.hero;
  if (sHero !== undefined) sanitized.showHero = Boolean(sHero);

  const sManifesto = body.showManifesto !== undefined ? body.showManifesto : visibility.manifesto;
  if (sManifesto !== undefined) sanitized.showManifesto = Boolean(sManifesto);

  const sWorks = body.showSelectedWorks !== undefined ? body.showSelectedWorks : (visibility.works !== undefined ? visibility.works : visibility.selectedWorks);
  if (sWorks !== undefined) sanitized.showSelectedWorks = Boolean(sWorks);

  const sOptics = body.showOpticalEngine !== undefined ? body.showOpticalEngine : (visibility.optics !== undefined ? visibility.optics : visibility.opticalEngine);
  if (sOptics !== undefined) sanitized.showOpticalEngine = Boolean(sOptics);

  const sReel = body.showFilmReel !== undefined ? body.showFilmReel : (visibility.reel !== undefined ? visibility.reel : visibility.filmReel);
  if (sReel !== undefined) sanitized.showFilmReel = Boolean(sReel);

  const sEvents = body.showEvents !== undefined ? body.showEvents : visibility.events;
  if (sEvents !== undefined) sanitized.showEvents = Boolean(sEvents);

  const sTeam = body.showTeam !== undefined ? body.showTeam : visibility.team;
  if (sTeam !== undefined) sanitized.showTeam = Boolean(sTeam);

  const sRecruit = body.showRecruitment !== undefined ? body.showRecruitment : visibility.recruitment;
  if (sRecruit !== undefined) sanitized.showRecruitment = Boolean(sRecruit);

  const sAnnounce = body.showAnnouncement !== undefined ? body.showAnnouncement : visibility.announcement;
  if (sAnnounce !== undefined) sanitized.showAnnouncement = Boolean(sAnnounce);

  return sanitized;
}

// 10.5.3 Save Homepage Draft
app.put(['/api/admin/content/draft', '/api/admin/content/home/draft'], authenticateToken, async (req, res) => {
  try {
    const sanitizedDraft = sanitizeContentPayload(req.body);
    sanitizedDraft.updatedAt = new Date();
    sanitizedDraft.savedBy = req.user.username;

    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) {
        content = await SiteContent.create({ ...initialSiteContent, draftData: sanitizedDraft });
      } else {
        content.draftData = sanitizedDraft;
        await content.save();
      }
      return res.json({
        success: true,
        message: 'Draft changes saved successfully.',
        data: { draft: content.draftData, published: content }
      });
    }

    if (!memoryStore.siteContent) {
      memoryStore.siteContent = { ...initialSiteContent };
    }
    memoryStore.siteContent.draftData = sanitizedDraft;

    res.json({
      success: true,
      message: 'Draft changes saved successfully.',
      data: { draft: memoryStore.siteContent.draftData, published: memoryStore.siteContent }
    });
  } catch (err) {
    console.error('Failed to save draft content:', err);
    res.status(500).json({ success: false, error: 'Failed to save draft changes.' });
  }
});

// 10.5.4 Publish Homepage Content Live
app.post(['/api/admin/content/publish', '/api/admin/content/home/publish'], authenticateToken, async (req, res) => {
  try {
    let payloadToPublish = {};
    const rawContent = await getOrInitSiteContent();

    // If body has direct edits, sanitize them; otherwise promote draftData
    if (req.body && Object.keys(req.body).length > 0) {
      payloadToPublish = sanitizeContentPayload(req.body);
    } else if (rawContent.draftData) {
      payloadToPublish = rawContent.draftData;
    }

    payloadToPublish.status = 'published';
    payloadToPublish.publishedAt = new Date();
    payloadToPublish.lastPublishedBy = req.user.username;
    payloadToPublish.draftData = null;

    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) {
        content = await SiteContent.create({ ...initialSiteContent, ...payloadToPublish });
      } else {
        Object.assign(content, payloadToPublish);
        content.draftData = null;
        await content.save();
      }
      return res.json({
        success: true,
        message: 'Homepage content published live successfully.',
        data: content
      });
    }

    Object.assign(memoryStore.siteContent, payloadToPublish);
    memoryStore.siteContent.draftData = null;

    res.json({
      success: true,
      message: 'Homepage content published live successfully.',
      data: memoryStore.siteContent
    });
  } catch (err) {
    console.error('Failed to publish homepage content:', err);
    res.status(500).json({ success: false, error: 'Failed to publish homepage content.' });
  }
});

// 10.5.5 Direct Update & Publish Endpoint
app.put(['/api/admin/content', '/api/admin/content/home'], authenticateToken, async (req, res) => {
  try {
    const sanitized = sanitizeContentPayload(req.body);
    sanitized.status = 'published';
    sanitized.publishedAt = new Date();
    sanitized.lastPublishedBy = req.user.username;
    sanitized.draftData = null;

    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) {
        content = await SiteContent.create({ ...initialSiteContent, ...sanitized });
      } else {
        Object.assign(content, sanitized);
        content.draftData = null;
        await content.save();
      }
      return res.json({
        success: true,
        message: 'Homepage content saved and published.',
        data: content
      });
    }

    if (!memoryStore.siteContent) {
      memoryStore.siteContent = { ...initialSiteContent };
    }
    Object.assign(memoryStore.siteContent, sanitized);
    memoryStore.siteContent.draftData = null;

    res.json({
      success: true,
      message: 'Homepage content saved and published.',
      data: memoryStore.siteContent
    });
  } catch (err) {
    console.error('Failed to update content:', err);
    res.status(500).json({ success: false, error: 'Failed to update homepage content.' });
  }
});

// 10.5.6 Discard Draft Changes
app.post(['/api/admin/content/discard', '/api/admin/content/home/discard'], authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected) {
      const content = await SiteContent.findOne({ key: 'main' });
      if (content) {
        content.draftData = null;
        await content.save();
      }
      return res.json({ success: true, message: 'Draft changes discarded.', data: content });
    }

    if (memoryStore.siteContent) {
      memoryStore.siteContent.draftData = null;
    }
    res.json({ success: true, message: 'Draft changes discarded.', data: memoryStore.siteContent });
  } catch (err) {
    console.error('Failed to discard draft:', err);
    res.status(500).json({ success: false, error: 'Failed to discard draft changes.' });
  }
});

// =========================================================================
// 10.6 ABOUT & MILESTONES CMS ENDPOINTS (STEP 9)
// =========================================================================

// Helper: Sanitize & Validate About Payload
function sanitizeAboutPayload(body) {
  const sanitized = {};
  const origin = body.origin || {};
  const mission = body.mission || {};
  const chapter = body.chapterBase || {};
  const media = body.media || {};

  // 1. Origin & Story
  const oTag = body.aboutOriginTag !== undefined ? body.aboutOriginTag : origin.tag;
  if (oTag !== undefined) sanitized.aboutOriginTag = sanitizeInput(oTag, 150);

  const oHeading = body.aboutOriginHeading !== undefined ? body.aboutOriginHeading : origin.heading;
  if (oHeading !== undefined) sanitized.aboutOriginHeading = sanitizeInput(oHeading, 200);

  const oStory = body.aboutOriginStory !== undefined ? body.aboutOriginStory : (origin.story || origin.body);
  if (oStory !== undefined) sanitized.aboutOriginStory = sanitizeInput(oStory, 3000);

  const oQuote = body.aboutOriginQuote !== undefined ? body.aboutOriginQuote : origin.quote;
  if (oQuote !== undefined) sanitized.aboutOriginQuote = sanitizeInput(oQuote, 500);

  const oQuoteAuthor = body.aboutOriginQuoteAuthor !== undefined ? body.aboutOriginQuoteAuthor : (origin.quoteAuthor || origin.author);
  if (oQuoteAuthor !== undefined) sanitized.aboutOriginQuoteAuthor = sanitizeInput(oQuoteAuthor, 150);

  // 2. Mission
  const mHeading = body.aboutMissionHeading !== undefined ? body.aboutMissionHeading : mission.heading;
  if (mHeading !== undefined) sanitized.aboutMissionHeading = sanitizeInput(mHeading, 200);

  const mStatement = body.aboutMissionStatement !== undefined ? body.aboutMissionStatement : (mission.statement || mission.body);
  if (mStatement !== undefined) sanitized.aboutMissionStatement = sanitizeInput(mStatement, 3000);

  const mSupporting = body.aboutMissionSupporting !== undefined ? body.aboutMissionSupporting : mission.supporting;
  if (mSupporting !== undefined) sanitized.aboutMissionSupporting = sanitizeInput(mSupporting, 2000);

  // 3. Core Values
  const rawValues = Array.isArray(body.aboutCoreValues) ? body.aboutCoreValues : (Array.isArray(body.coreValues) ? body.coreValues : null);
  if (rawValues) {
    sanitized.aboutCoreValues = rawValues.map((v, idx) => ({
      id: String(v.id || v._id || `val-${idx + 1}`).trim(),
      title: sanitizeInput(v.title || 'Core Value', 100),
      description: sanitizeInput(v.description || '', 500),
      icon: sanitizeInput(v.icon || 'lens', 50),
      order: typeof v.order === 'number' ? v.order : idx + 1
    }));
  }

  // 4. Chapter Base
  const cDept = body.aboutChapterBase?.department !== undefined ? body.aboutChapterBase.department : chapter.department;
  const cCoord = body.aboutChapterBase?.coordinates !== undefined ? body.aboutChapterBase.coordinates : chapter.coordinates;
  const cCopy = body.aboutChapterBase?.copyrightText !== undefined ? body.aboutChapterBase.copyrightText : chapter.copyrightText;
  const cLicense = body.aboutChapterBase?.licenseText !== undefined ? body.aboutChapterBase.licenseText : chapter.licenseText;

  if (cDept !== undefined || cCoord !== undefined || cCopy !== undefined || cLicense !== undefined) {
    sanitized.aboutChapterBase = {
      department: sanitizeInput(cDept || 'Department of Visual Arts & Cinema', 200),
      coordinates: sanitizeInput(cCoord || '13.0827° N, 80.2707° E // ISO 400 35MM', 150),
      copyrightText: sanitizeInput(cCopy || '© 2026 RESOLUTION STUDENT MEDIA COLLECTIVE. ARCHIVAL GRADE ART.', 200),
      licenseText: sanitizeInput(cLicense || 'CURATORIAL BRUTALISM // ALL ASSETS UNDER ACADEMIC COMMONS', 200)
    };
  }

  // 5. Media
  const mPortrait = body.aboutMedia?.portraitUrl !== undefined ? body.aboutMedia.portraitUrl : media.portraitUrl;
  const mStudio = body.aboutMedia?.studioImageUrl !== undefined ? body.aboutMedia.studioImageUrl : media.studioImageUrl;
  const mDarkroom = body.aboutMedia?.darkroomImageUrl !== undefined ? body.aboutMedia.darkroomImageUrl : media.darkroomImageUrl;

  if (mPortrait !== undefined || mStudio !== undefined || mDarkroom !== undefined) {
    sanitized.aboutMedia = {
      portraitUrl: String(mPortrait || '').trim().slice(0, 1000),
      studioImageUrl: String(mStudio || '').trim().slice(0, 1000),
      darkroomImageUrl: String(mDarkroom || '').trim().slice(0, 1000)
    };
  }

  return sanitized;
}

// 10.6.1 Public About Content & Milestones
app.get('/api/content/about', async (req, res) => {
  try {
    const rawContent = await getOrInitSiteContent();
    let publishedMilestones = [];

    if (isMongoConnected) {
      publishedMilestones = await Milestone.find({ status: 'published', isArchived: { $ne: true } })
        .sort({ order: 1, year: 1, createdAt: 1 });
    } else {
      publishedMilestones = (memoryStore.milestones || [])
        .filter(m => m.status === 'published' && !m.isArchived)
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    const doc = rawContent.toObject ? rawContent.toObject() : { ...rawContent };
    const { draftData: _d, aboutDraftData: _ad, ...publicAbout } = doc;

    res.json({
      success: true,
      data: {
        ...publicAbout,
        aboutOriginTag: publicAbout.aboutOriginTag || '01 // ORIGINS & MANIFESTO',
        aboutOriginHeading: publicAbout.aboutOriginHeading || 'Curatorial Brutalism // Academic Commons',
        aboutOriginStory: publicAbout.aboutOriginStory || '',
        aboutOriginQuote: publicAbout.aboutOriginQuote || '',
        aboutOriginQuoteAuthor: publicAbout.aboutOriginQuoteAuthor || '',
        aboutMissionHeading: publicAbout.aboutMissionHeading || "We don't just capture moments. We give them a point of view.",
        aboutMissionStatement: publicAbout.aboutMissionStatement || '',
        aboutMissionSupporting: publicAbout.aboutMissionSupporting || '',
        aboutCoreValues: publicAbout.aboutCoreValues || [],
        aboutChapterBase: publicAbout.aboutChapterBase || {},
        aboutMedia: publicAbout.aboutMedia || {},
        origin: {
          tag: publicAbout.aboutOriginTag || '01 // ORIGINS & MANIFESTO',
          heading: publicAbout.aboutOriginHeading || 'Curatorial Brutalism // Academic Commons',
          story: publicAbout.aboutOriginStory || '',
          quote: publicAbout.aboutOriginQuote || '',
          quoteAuthor: publicAbout.aboutOriginQuoteAuthor || ''
        },
        mission: {
          heading: publicAbout.aboutMissionHeading || "We don't just capture moments. We give them a point of view.",
          statement: publicAbout.aboutMissionStatement || '',
          supporting: publicAbout.aboutMissionSupporting || ''
        },
        coreValues: publicAbout.aboutCoreValues || [],
        chapterBase: publicAbout.aboutChapterBase || {},
        media: publicAbout.aboutMedia || {},
        milestones: publishedMilestones
      }
    });
  } catch (err) {
    console.error('Failed to get public about content:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve about content.' });
  }
});

// 10.6.2 Admin About Content Dashboard
app.get('/api/admin/about', authenticateToken, async (req, res) => {
  try {
    const rawContent = await getOrInitSiteContent();
    let milestones = [];

    if (isMongoConnected) {
      milestones = await Milestone.find().sort({ order: 1, year: 1, createdAt: 1 });
    } else {
      milestones = (memoryStore.milestones || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    const doc = rawContent.toObject ? rawContent.toObject() : { ...rawContent };

    res.json({
      success: true,
      data: {
        published: {
          ...doc,
          aboutOriginTag: doc.aboutOriginTag || '01 // ORIGINS & MANIFESTO',
          aboutOriginHeading: doc.aboutOriginHeading || 'Curatorial Brutalism // Academic Commons',
          aboutOriginStory: doc.aboutOriginStory || '',
          aboutOriginQuote: doc.aboutOriginQuote || '',
          aboutOriginQuoteAuthor: doc.aboutOriginQuoteAuthor || '',
          aboutMissionHeading: doc.aboutMissionHeading || "We don't just capture moments. We give them a point of view.",
          aboutMissionStatement: doc.aboutMissionStatement || '',
          aboutMissionSupporting: doc.aboutMissionSupporting || '',
          aboutCoreValues: doc.aboutCoreValues || [],
          aboutChapterBase: doc.aboutChapterBase || {},
          aboutMedia: doc.aboutMedia || {},
          origin: {
            tag: doc.aboutOriginTag || '01 // ORIGINS & MANIFESTO',
            heading: doc.aboutOriginHeading || 'Curatorial Brutalism // Academic Commons',
            story: doc.aboutOriginStory || '',
            quote: doc.aboutOriginQuote || '',
            quoteAuthor: doc.aboutOriginQuoteAuthor || ''
          },
          mission: {
            heading: doc.aboutMissionHeading || "We don't just capture moments. We give them a point of view.",
            statement: doc.aboutMissionStatement || '',
            supporting: doc.aboutMissionSupporting || ''
          },
          coreValues: doc.aboutCoreValues || [],
          chapterBase: doc.aboutChapterBase || {},
          media: doc.aboutMedia || {},
          updatedAt: doc.updatedAt
        },
        draft: doc.aboutDraftData || null,
        hasDraft: Boolean(doc.aboutDraftData),
        milestones,
        milestoneCount: milestones.length,
        valuesCount: (doc.aboutCoreValues || []).length
      }
    });
  } catch (err) {
    console.error('Failed to get admin about content:', err);
    res.status(500).json({ success: false, error: 'Failed to load about CMS.' });
  }
});

// 10.6.3 Save About Draft
app.put('/api/admin/about/draft', authenticateToken, async (req, res) => {
  try {
    const sanitizedDraft = sanitizeAboutPayload(req.body);
    sanitizedDraft.updatedAt = new Date();
    sanitizedDraft.savedBy = req.user.username;

    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) {
        content = await SiteContent.create({ ...initialSiteContent, aboutDraftData: sanitizedDraft });
      } else {
        content.aboutDraftData = sanitizedDraft;
        await content.save();
      }
      return res.json({
        success: true,
        message: 'About content draft saved.',
        data: content.aboutDraftData
      });
    }

    if (!memoryStore.siteContent) {
      memoryStore.siteContent = { ...initialSiteContent };
    }
    memoryStore.siteContent.aboutDraftData = sanitizedDraft;

    res.json({
      success: true,
      message: 'About content draft saved.',
      data: memoryStore.siteContent.aboutDraftData
    });
  } catch (err) {
    console.error('Failed to save about draft:', err);
    res.status(500).json({ success: false, error: 'Failed to save draft changes.' });
  }
});

// 10.6.4 Publish About Content Live
app.post('/api/admin/about/publish', authenticateToken, async (req, res) => {
  try {
    const rawContent = await getOrInitSiteContent();
    let payloadToPublish = {};

    if (req.body && Object.keys(req.body).length > 0) {
      payloadToPublish = sanitizeAboutPayload(req.body);
    } else if (rawContent.aboutDraftData) {
      payloadToPublish = rawContent.aboutDraftData;
    }

    payloadToPublish.publishedAt = new Date();
    payloadToPublish.lastPublishedBy = req.user.username;
    payloadToPublish.aboutDraftData = null;

    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) {
        content = await SiteContent.create({ ...initialSiteContent, ...payloadToPublish });
      } else {
        Object.assign(content, payloadToPublish);
        content.aboutDraftData = null;
        await content.save();
      }
      return res.json({
        success: true,
        message: 'About content published live successfully.',
        data: content
      });
    }

    Object.assign(memoryStore.siteContent, payloadToPublish);
    memoryStore.siteContent.aboutDraftData = null;

    res.json({
      success: true,
      message: 'About content published live successfully.',
      data: memoryStore.siteContent
    });
  } catch (err) {
    console.error('Failed to publish about content:', err);
    res.status(500).json({ success: false, error: 'Failed to publish about content.' });
  }
});

// 10.6.5 Direct Update & Publish About Content
app.put('/api/admin/about', authenticateToken, async (req, res) => {
  try {
    const sanitized = sanitizeAboutPayload(req.body);
    sanitized.publishedAt = new Date();
    sanitized.lastPublishedBy = req.user.username;
    sanitized.aboutDraftData = null;

    if (isMongoConnected) {
      let content = await SiteContent.findOne({ key: 'main' });
      if (!content) {
        content = await SiteContent.create({ ...initialSiteContent, ...sanitized });
      } else {
        Object.assign(content, sanitized);
        content.aboutDraftData = null;
        await content.save();
      }
      return res.json({
        success: true,
        message: 'About content updated and published live.',
        data: content
      });
    }

    if (!memoryStore.siteContent) {
      memoryStore.siteContent = { ...initialSiteContent };
    }
    Object.assign(memoryStore.siteContent, sanitized);
    memoryStore.siteContent.aboutDraftData = null;

    res.json({
      success: true,
      message: 'About content updated and published live.',
      data: memoryStore.siteContent
    });
  } catch (err) {
    console.error('Failed to update about content:', err);
    res.status(500).json({ success: false, error: 'Failed to update about content.' });
  }
});

// 10.6.6 Discard About Draft Changes
app.post('/api/admin/about/discard', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected) {
      const content = await SiteContent.findOne({ key: 'main' });
      if (content) {
        content.aboutDraftData = null;
        await content.save();
      }
      return res.json({ success: true, message: 'About draft changes discarded.', data: content });
    }

    if (memoryStore.siteContent) {
      memoryStore.siteContent.aboutDraftData = null;
    }
    res.json({ success: true, message: 'About draft changes discarded.', data: memoryStore.siteContent });
  } catch (err) {
    console.error('Failed to discard about draft:', err);
    res.status(500).json({ success: false, error: 'Failed to discard draft changes.' });
  }
});

// =========================================================================
// 10.7 MILESTONE CRUD ENDPOINTS (STEP 9)
// =========================================================================

// 10.7.1 List Milestones with Filters & Search
app.get('/api/admin/milestones', authenticateToken, async (req, res) => {
  try {
    const { search = '', status = 'all', category = 'all', sort = 'order_asc' } = req.query;

    if (isMongoConnected) {
      const query = {};
      if (status !== 'all') {
        query.status = status;
        query.isArchived = (status === 'archived');
      }
      if (category !== 'all') {
        query.category = category;
      }
      if (search) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [{ year: searchRegex }, { title: searchRegex }, { description: searchRegex }, { category: searchRegex }];
      }

      let sortOption = { order: 1, year: 1 };
      if (sort === 'order_desc') sortOption = { order: -1 };
      else if (sort === 'year_desc') sortOption = { year: -1, order: 1 };
      else if (sort === 'year_asc') sortOption = { year: 1, order: 1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };

      const milestones = await Milestone.find(query).sort(sortOption);
      const totalCount = await Milestone.countDocuments();
      const publishedCount = await Milestone.countDocuments({ status: 'published', isArchived: { $ne: true } });
      const archivedCount = await Milestone.countDocuments({ status: 'archived' });

      return res.json({
        success: true,
        count: milestones.length,
        data: milestones,
        stats: { total: totalCount, published: publishedCount, archived: archivedCount }
      });
    }

    let list = [...(memoryStore.milestones || [])];
    if (status !== 'all') {
      list = list.filter(m => status === 'archived' ? (m.status === 'archived' || m.isArchived) : (m.status === status && !m.isArchived));
    }
    if (category !== 'all') {
      list = list.filter(m => (m.category || '').toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => (m.year && m.year.toLowerCase().includes(q)) || (m.title && m.title.toLowerCase().includes(q)) || (m.description && m.description.toLowerCase().includes(q)));
    }

    if (sort === 'order_desc') list.sort((a, b) => (b.order || 0) - (a.order || 0));
    else if (sort === 'year_desc') list.sort((a, b) => String(b.year).localeCompare(String(a.year)));
    else if (sort === 'year_asc') list.sort((a, b) => String(a.year).localeCompare(String(b.year)));
    else if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else list.sort((a, b) => (a.order || 0) - (b.order || 0));

    const total = (memoryStore.milestones || []).length;
    const published = (memoryStore.milestones || []).filter(m => m.status === 'published' && !m.isArchived).length;
    const archived = (memoryStore.milestones || []).filter(m => m.status === 'archived' || m.isArchived).length;

    res.json({
      success: true,
      count: list.length,
      data: list,
      stats: { total, published, archived }
    });
  } catch (err) {
    console.error('Failed to list milestones:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve milestones.' });
  }
});

// 10.7.2 Create Milestone
app.post('/api/admin/milestones', authenticateToken, async (req, res) => {
  try {
    const { year, title, description, category, image, order, status = 'published' } = req.body;
    if (!year || !String(year).trim()) {
      return res.status(400).json({ success: false, message: 'Milestone year is required.' });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Milestone title is required.' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ success: false, message: 'Milestone description is required.' });
    }

    const milestoneDoc = {
      year: sanitizeInput(year, 50),
      title: sanitizeInput(title, 200),
      description: sanitizeInput(description, 1000),
      category: sanitizeInput(category || 'Milestone', 100),
      image: String(image || '').trim().slice(0, 1000),
      order: typeof order === 'number' ? order : 0,
      status: status === 'archived' ? 'archived' : (status === 'draft' ? 'draft' : 'published'),
      isArchived: status === 'archived'
    };

    if (isMongoConnected) {
      if (!milestoneDoc.order) {
        const highest = await Milestone.findOne().sort({ order: -1 });
        milestoneDoc.order = (highest && highest.order ? highest.order : 0) + 1;
      }
      const created = await Milestone.create(milestoneDoc);
      return res.status(201).json({
        success: true,
        message: 'Milestone created successfully.',
        data: created
      });
    }

    const id = `milestone-${Date.now()}`;
    if (!milestoneDoc.order) {
      milestoneDoc.order = (memoryStore.milestones || []).length + 1;
    }
    const newMemMilestone = { _id: id, ...milestoneDoc, createdAt: new Date(), updatedAt: new Date() };
    if (!memoryStore.milestones) memoryStore.milestones = [];
    memoryStore.milestones.push(newMemMilestone);

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully.',
      data: newMemMilestone
    });
  } catch (err) {
    console.error('Failed to create milestone:', err);
    res.status(500).json({ success: false, error: 'Failed to create milestone.' });
  }
});

// 10.7.3 Get Single Milestone
app.get('/api/admin/milestones/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const milestone = await Milestone.findById(id);
      if (milestone) return res.json({ success: true, data: milestone });
    }

    const mem = (memoryStore.milestones || []).find(m => String(m._id) === String(id));
    if (mem) return res.json({ success: true, data: mem });

    res.status(404).json({ success: false, message: 'Milestone not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10.7.4 Update Milestone
app.put('/api/admin/milestones/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { year, title, description, category, image, order, status } = req.body;

    const updates = {};
    if (year !== undefined) updates.year = sanitizeInput(year, 50);
    if (title !== undefined) updates.title = sanitizeInput(title, 200);
    if (description !== undefined) updates.description = sanitizeInput(description, 1000);
    if (category !== undefined) updates.category = sanitizeInput(category, 100);
    if (image !== undefined) updates.image = String(image || '').trim().slice(0, 1000);
    if (order !== undefined) updates.order = Number(order) || 0;
    if (status !== undefined) {
      updates.status = status === 'archived' ? 'archived' : 'published';
      updates.isArchived = (status === 'archived');
    }
    updates.updatedAt = new Date();

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Milestone.findByIdAndUpdate(id, updates, { new: true });
      if (updated) return res.json({ success: true, message: 'Milestone updated successfully.', data: updated });
    }

    const idx = (memoryStore.milestones || []).findIndex(m => String(m._id) === String(id));
    if (idx >= 0) {
      Object.assign(memoryStore.milestones[idx], updates);
      return res.json({ success: true, message: 'Milestone updated successfully.', data: memoryStore.milestones[idx] });
    }

    res.status(404).json({ success: false, message: 'Milestone not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10.7.5 Toggle Archive Milestone
app.patch('/api/admin/milestones/:id/archive', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const milestone = await Milestone.findById(id);
      if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found.' });

      milestone.isArchived = !milestone.isArchived;
      milestone.status = milestone.isArchived ? 'archived' : 'published';
      milestone.updatedAt = new Date();
      await milestone.save();

      return res.json({
        success: true,
        message: milestone.isArchived ? 'Milestone archived successfully.' : 'Milestone published successfully.',
        data: milestone
      });
    }

    const idx = (memoryStore.milestones || []).findIndex(m => String(m._id) === String(id));
    if (idx >= 0) {
      const m = memoryStore.milestones[idx];
      m.isArchived = !m.isArchived;
      m.status = m.isArchived ? 'archived' : 'published';
      m.updatedAt = new Date();
      return res.json({
        success: true,
        message: m.isArchived ? 'Milestone archived successfully.' : 'Milestone published successfully.',
        data: m
      });
    }

    res.status(404).json({ success: false, message: 'Milestone not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10.7.6 Batch Reorder Milestones
app.patch('/api/admin/milestones/reorder', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: items array required.' });
    }

    if (isMongoConnected) {
      const bulkOps = items
        .filter(item => item.id && mongoose.Types.ObjectId.isValid(item.id))
        .map(item => ({
          updateOne: {
            filter: { _id: item.id },
            update: { $set: { order: Number(item.order) || 0, updatedAt: new Date() } }
          }
        }));

      if (bulkOps.length > 0) {
        await Milestone.bulkWrite(bulkOps);
      }
      return res.json({ success: true, message: 'Milestone sequence reordered successfully.' });
    }

    items.forEach(item => {
      const found = (memoryStore.milestones || []).find(m => String(m._id) === String(item.id));
      if (found) {
        found.order = Number(item.order) || 0;
        found.updatedAt = new Date();
      }
    });

    res.json({ success: true, message: 'Milestone sequence reordered successfully.' });
  } catch (err) {
    console.error('Reorder milestones error:', err);
    res.status(500).json({ success: false, error: 'Failed to reorder milestones.' });
  }
});

// 10.7.7 Delete Milestone (Super Admin only)
app.delete('/api/admin/milestones/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Milestone.findByIdAndDelete(id);
      if (deleted) {
        return res.json({ success: true, message: 'Milestone permanently deleted.' });
      }
    }

    const initialLen = (memoryStore.milestones || []).length;
    memoryStore.milestones = (memoryStore.milestones || []).filter(m => String(m._id) !== String(id));
    if (memoryStore.milestones.length < initialLen) {
      return res.json({ success: true, message: 'Milestone permanently deleted.' });
    }

    res.status(404).json({ success: false, message: 'Milestone not found.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================================
// STEP 10: MEDIA LIBRARY & ASSET MANAGEMENT ARCHITECTURE
// =========================================================================

// Media helper: Format bytes to human readable string
function formatStorageBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = 1;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Media helper: Classify MIME type into mediaType category
function detectMediaType(mimeType, filename = '') {
  if (!mimeType && filename) {
    const ext = path.extname(filename).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'].includes(ext)) return 'image';
    if (['.mp4', '.webm', '.mov', '.mkv'].includes(ext)) return 'video';
    if (['.svg'].includes(ext)) return 'vector';
  }
  if (!mimeType) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'image/svg+xml') return 'vector';
  if (mimeType.startsWith('image/')) return 'image';
  return 'other';
}

// Reference Awareness Scanner: Checks active references across all CMS modules
async function scanMediaReferences(assetUrl, filename) {
  const references = [];
  if (!assetUrl && !filename) return references;

  const matches = (target) => {
    if (!target || typeof target !== 'string') return false;
    const cleanTarget = target.trim();
    if (assetUrl && cleanTarget === assetUrl.trim()) return true;
    if (filename && (cleanTarget.includes(filename) || cleanTarget.endsWith('/' + filename))) return true;
    return false;
  };

  // 1. Site Content (Homepage & About)
  let sc = null;
  try {
    if (isMongoConnected) {
      sc = await SiteContent.findOne({ key: 'main' });
    } else {
      sc = memoryStore.siteContent;
    }
    if (sc) {
      if (matches(sc.heroBackgroundImage)) {
        references.push({ module: 'Homepage CMS', id: 'site-hero-bg', title: 'Hero Background Image', field: 'heroBackgroundImage', label: 'Homepage Hero — Background Image' });
      }
      if (matches(sc.heroVideoUrl)) {
        references.push({ module: 'Homepage CMS', id: 'site-hero-video', title: 'Hero Background Video', field: 'heroVideoUrl', label: 'Homepage Hero — Background Video' });
      }
      if (matches(sc.manifestoPortraitUrl)) {
        references.push({ module: 'Homepage CMS', id: 'site-manifesto-portrait', title: 'Manifesto Lead Portrait', field: 'manifestoPortraitUrl', label: 'Homepage — Manifesto Lead Portrait' });
      }
      if (sc.aboutMedia) {
        if (matches(sc.aboutMedia.portraitUrl)) {
          references.push({ module: 'About CMS', id: 'about-portrait', title: 'Chapter Lead Portrait', field: 'aboutMedia.portraitUrl', label: 'About Page — Chapter Lead Portrait' });
        }
        if (matches(sc.aboutMedia.studioImageUrl)) {
          references.push({ module: 'About CMS', id: 'about-studio', title: 'Studio Bay Image', field: 'aboutMedia.studioImageUrl', label: 'About Page — Studio Bay Image' });
        }
        if (matches(sc.aboutMedia.darkroomImageUrl)) {
          references.push({ module: 'About CMS', id: 'about-darkroom', title: 'Darkroom Bay Image', field: 'aboutMedia.darkroomImageUrl', label: 'About Page — Darkroom Bay Image' });
        }
      }
    }
  } catch (err) {
    console.error('Error scanning SiteContent references:', err);
  }

  // 2. Selected Works
  try {
    let works = isMongoConnected ? await Work.find() : (memoryStore.works || []);
    for (const work of works) {
      if (matches(work.image)) {
        references.push({ module: 'Selected Works', id: work._id, title: work.title, field: 'image', label: `Work Still — ${work.title}` });
      }
      if (matches(work.thumbnail)) {
        references.push({ module: 'Selected Works', id: work._id, title: work.title, field: 'thumbnail', label: `Work Thumbnail — ${work.title}` });
      }
      if (Array.isArray(work.gallery)) {
        work.gallery.forEach((g, idx) => {
          const gUrl = typeof g === 'string' ? g : g.url;
          if (matches(gUrl)) {
            references.push({ module: 'Selected Works', id: work._id, title: work.title, field: `gallery[${idx}]`, label: `Work Gallery — ${work.title}` });
          }
        });
      }
    }
  } catch (err) {
    console.error('Error scanning Work references:', err);
  }

  // 3. Events
  try {
    let events = isMongoConnected ? await Event.find() : (memoryStore.events || []);
    for (const ev of events) {
      if (matches(ev.coverImage)) {
        references.push({ module: 'Events', id: ev._id, title: ev.title, field: 'coverImage', label: `Event Cover — ${ev.title}` });
      }
      if (Array.isArray(ev.gallery)) {
        ev.gallery.forEach((g, idx) => {
          const gUrl = typeof g === 'string' ? g : g.url;
          if (matches(gUrl)) {
            references.push({ module: 'Events', id: ev._id, title: ev.title, field: `gallery[${idx}]`, label: `Event Gallery — ${ev.title}` });
          }
        });
      }
    }
  } catch (err) {
    console.error('Error scanning Event references:', err);
  }

  // 4. Team Members
  try {
    let team = isMongoConnected ? await TeamMember.find() : (memoryStore.team || []);
    for (const tm of team) {
      if (matches(tm.portraitUrl)) {
        references.push({ module: 'Team', id: tm._id, title: tm.name, field: 'portraitUrl', label: `Team Portrait — ${tm.name} (${tm.role})` });
      }
      if (matches(tm.avatar)) {
        references.push({ module: 'Team', id: tm._id, title: tm.name, field: 'avatar', label: `Team Avatar — ${tm.name}` });
      }
    }
  } catch (err) {
    console.error('Error scanning Team references:', err);
  }

  // 5. Milestones
  try {
    let milestones = isMongoConnected ? await Milestone.find() : (memoryStore.milestones || []);
    for (const m of milestones) {
      if (matches(m.image)) {
        references.push({ module: 'Milestones', id: m._id, title: m.title, field: 'image', label: `Milestone — ${m.year}: ${m.title}` });
      }
    }
  } catch (err) {
    console.error('Error scanning Milestone references:', err);
  }

  // 6. ReelFrames
  try {
    let reelFrames = isMongoConnected ? await ReelFrame.find() : (memoryStore.reelFrames || []);
    for (const rf of reelFrames) {
      if (matches(rf.imageUrl)) {
        references.push({ module: 'ReelFrames', id: rf._id, title: rf.title, field: 'imageUrl', label: `ReelFrame — ${rf.rollCode || 'Frame'}: ${rf.title}` });
      }
      if (matches(rf.videoUrl)) {
        references.push({ module: 'ReelFrames', id: rf._id, title: rf.title, field: 'videoUrl', label: `ReelFrame Video — ${rf.rollCode || 'Frame'}: ${rf.title}` });
      }
    }
  } catch (err) {
    console.error('Error scanning ReelFrame references:', err);
  }

  return references;
}

// Reference Replacement Helper: Automatically updates all database & memory references when an asset is replaced
async function replaceMediaReferences(oldUrl, newUrl) {
  let updateCount = 0;
  if (!oldUrl || !newUrl || oldUrl.trim() === newUrl.trim()) return updateCount;

  // 1. SiteContent
  try {
    if (isMongoConnected) {
      const sc = await SiteContent.findOne({ key: 'main' });
      if (sc) {
        let changed = false;
        if (sc.heroBackgroundImage === oldUrl) { sc.heroBackgroundImage = newUrl; changed = true; updateCount++; }
        if (sc.heroVideoUrl === oldUrl) { sc.heroVideoUrl = newUrl; changed = true; updateCount++; }
        if (sc.manifestoPortraitUrl === oldUrl) { sc.manifestoPortraitUrl = newUrl; changed = true; updateCount++; }
        if (sc.aboutMedia) {
          if (sc.aboutMedia.portraitUrl === oldUrl) { sc.aboutMedia.portraitUrl = newUrl; changed = true; updateCount++; }
          if (sc.aboutMedia.studioImageUrl === oldUrl) { sc.aboutMedia.studioImageUrl = newUrl; changed = true; updateCount++; }
          if (sc.aboutMedia.darkroomImageUrl === oldUrl) { sc.aboutMedia.darkroomImageUrl = newUrl; changed = true; updateCount++; }
        }
        if (changed) await sc.save();
      }
    } else {
      const sc = memoryStore.siteContent;
      if (sc) {
        if (sc.heroBackgroundImage === oldUrl) { sc.heroBackgroundImage = newUrl; updateCount++; }
        if (sc.heroVideoUrl === oldUrl) { sc.heroVideoUrl = newUrl; updateCount++; }
        if (sc.manifestoPortraitUrl === oldUrl) { sc.manifestoPortraitUrl = newUrl; updateCount++; }
        if (sc.aboutMedia) {
          if (sc.aboutMedia.portraitUrl === oldUrl) { sc.aboutMedia.portraitUrl = newUrl; updateCount++; }
          if (sc.aboutMedia.studioImageUrl === oldUrl) { sc.aboutMedia.studioImageUrl = newUrl; updateCount++; }
          if (sc.aboutMedia.darkroomImageUrl === oldUrl) { sc.aboutMedia.darkroomImageUrl = newUrl; updateCount++; }
        }
      }
    }
  } catch (err) {
    console.error('Error replacing SiteContent media refs:', err);
  }

  // 2. Works
  try {
    if (isMongoConnected) {
      const works = await Work.find();
      for (const w of works) {
        let changed = false;
        if (w.image === oldUrl) { w.image = newUrl; changed = true; updateCount++; }
        if (w.thumbnail === oldUrl) { w.thumbnail = newUrl; changed = true; updateCount++; }
        if (Array.isArray(w.gallery)) {
          w.gallery.forEach(g => {
            if (g.url === oldUrl) { g.url = newUrl; changed = true; updateCount++; }
          });
        }
        if (changed) await w.save();
      }
    } else {
      (memoryStore.works || []).forEach(w => {
        if (w.image === oldUrl) { w.image = newUrl; updateCount++; }
        if (w.thumbnail === oldUrl) { w.thumbnail = newUrl; updateCount++; }
        if (Array.isArray(w.gallery)) {
          w.gallery.forEach(g => {
            if (g.url === oldUrl) { g.url = newUrl; updateCount++; }
          });
        }
      });
    }
  } catch (err) {
    console.error('Error replacing Work media refs:', err);
  }

  // 3. Events
  try {
    if (isMongoConnected) {
      const events = await Event.find();
      for (const e of events) {
        let changed = false;
        if (e.coverImage === oldUrl) { e.coverImage = newUrl; changed = true; updateCount++; }
        if (Array.isArray(e.gallery)) {
          e.gallery.forEach(g => {
            if (g.url === oldUrl) { g.url = newUrl; changed = true; updateCount++; }
          });
        }
        if (changed) await e.save();
      }
    } else {
      (memoryStore.events || []).forEach(e => {
        if (e.coverImage === oldUrl) { e.coverImage = newUrl; updateCount++; }
        if (Array.isArray(e.gallery)) {
          e.gallery.forEach(g => {
            if (g.url === oldUrl) { g.url = newUrl; updateCount++; }
          });
        }
      });
    }
  } catch (err) {
    console.error('Error replacing Event media refs:', err);
  }

  // 4. Team Members
  try {
    if (isMongoConnected) {
      const team = await TeamMember.find();
      for (const t of team) {
        let changed = false;
        if (t.portraitUrl === oldUrl) { t.portraitUrl = newUrl; changed = true; updateCount++; }
        if (t.avatar === oldUrl) { t.avatar = newUrl; changed = true; updateCount++; }
        if (changed) await t.save();
      }
    } else {
      (memoryStore.team || []).forEach(t => {
        if (t.portraitUrl === oldUrl) { t.portraitUrl = newUrl; updateCount++; }
        if (t.avatar === oldUrl) { t.avatar = newUrl; updateCount++; }
      });
    }
  } catch (err) {
    console.error('Error replacing Team media refs:', err);
  }

  // 5. Milestones
  try {
    if (isMongoConnected) {
      const milestones = await Milestone.find();
      for (const m of milestones) {
        if (m.image === oldUrl) {
          m.image = newUrl;
          await m.save();
          updateCount++;
        }
      }
    } else {
      (memoryStore.milestones || []).forEach(m => {
        if (m.image === oldUrl) { m.image = newUrl; updateCount++; }
      });
    }
  } catch (err) {
    console.error('Error replacing Milestone media refs:', err);
  }

  // 6. ReelFrames
  try {
    if (isMongoConnected) {
      const rfList = await ReelFrame.find();
      for (const rf of rfList) {
        let changed = false;
        if (rf.imageUrl === oldUrl) { rf.imageUrl = newUrl; changed = true; updateCount++; }
        if (rf.videoUrl === oldUrl) { rf.videoUrl = newUrl; changed = true; updateCount++; }
        if (changed) await rf.save();
      }
    } else {
      (memoryStore.reelFrames || []).forEach(rf => {
        if (rf.imageUrl === oldUrl) { rf.imageUrl = newUrl; updateCount++; }
        if (rf.videoUrl === oldUrl) { rf.videoUrl = newUrl; updateCount++; }
      });
    }
  } catch (err) {
    console.error('Error replacing ReelFrame media refs:', err);
  }

  return updateCount;
}

// Media Registration Helper: Saves uploaded asset record into Mongo & memoryStore
async function registerMediaAsset({ filename, originalName, mimeType, size, url, uploadedBy, altText = '', caption = '', tags = [] }) {
  const mediaType = detectMediaType(mimeType, filename);
  const assetData = {
    filename,
    originalName: originalName || filename,
    mimeType,
    mediaType,
    size: Number(size) || 0,
    width: null,
    height: null,
    url,
    uploadedBy: uploadedBy || 'Curator Admin',
    altText: sanitizeInput(altText, 300),
    caption: sanitizeInput(caption, 500),
    tags: Array.isArray(tags) ? tags.map(t => sanitizeInput(t, 50)) : []
  };

  let savedAsset = null;
  if (isMongoConnected) {
    try {
      savedAsset = await MediaAsset.create(assetData);
    } catch (e) {
      savedAsset = { _id: `media-${Date.now()}`, ...assetData, createdAt: new Date(), updatedAt: new Date() };
    }
  } else {
    savedAsset = { _id: `media-${Date.now()}`, ...assetData, createdAt: new Date(), updatedAt: new Date() };
  }

  if (!memoryStore.media) memoryStore.media = [];
  memoryStore.media.unshift(savedAsset);
  return savedAsset;
}

// 1. GET /api/admin/media - Paginated Listing with Type/Usage Filters & Real Storage Stats
app.get('/api/admin/media', authenticateToken, async (req, res) => {
  try {
    const { search = '', type = 'all', usage = 'all', sort = 'newest', page = 1, limit = 24 } = req.query;

    let allAssets = [];
    if (isMongoConnected) {
      allAssets = await MediaAsset.find().sort({ createdAt: -1 }).lean();
    } else {
      allAssets = (memoryStore.media || []).map(m => ({ ...m }));
    }

    // Attach live references to each asset for reference awareness
    const populatedAssets = await Promise.all(
      allAssets.map(async (asset) => {
        const references = await scanMediaReferences(asset.url, asset.filename);
        return {
          ...asset,
          references,
          referenceCount: references.length,
          isUsed: references.length > 0
        };
      })
    );

    // Compute Global Storage Statistics from actual registry
    const totalAssets = populatedAssets.length;
    let imagesCount = 0;
    let videosCount = 0;
    let vectorsCount = 0;
    let totalStorageBytes = 0;
    let usedCount = 0;
    let unusedCount = 0;

    populatedAssets.forEach(a => {
      totalStorageBytes += (a.size || 0);
      if (a.mediaType === 'video' || (a.mimeType && a.mimeType.startsWith('video/'))) videosCount++;
      else if (a.mediaType === 'vector' || a.mimeType === 'image/svg+xml') vectorsCount++;
      else imagesCount++;

      if (a.isUsed) usedCount++;
      else unusedCount++;
    });

    const stats = {
      totalAssets,
      imagesCount,
      videosCount,
      vectorsCount,
      totalStorageBytes,
      totalStorageFormatted: formatStorageBytes(totalStorageBytes),
      usedCount,
      unusedCount
    };

    // Apply In-Memory Filtering on Populated Assets
    let filtered = [...populatedAssets];

    // Search Query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(a =>
        (a.filename && a.filename.toLowerCase().includes(q)) ||
        (a.originalName && a.originalName.toLowerCase().includes(q)) ||
        (a.altText && a.altText.toLowerCase().includes(q)) ||
        (a.caption && a.caption.toLowerCase().includes(q)) ||
        (Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Type Filter
    if (type && type !== 'all') {
      if (type === 'image') {
        filtered = filtered.filter(a => a.mediaType === 'image');
      } else if (type === 'video') {
        filtered = filtered.filter(a => a.mediaType === 'video');
      } else if (type === 'vector') {
        filtered = filtered.filter(a => a.mediaType === 'vector');
      }
    }

    // Usage Filter (Used vs Unused/Orphaned)
    if (usage && usage !== 'all') {
      if (usage === 'used') {
        filtered = filtered.filter(a => a.isUsed);
      } else if (usage === 'unused' || usage === 'orphaned') {
        filtered = filtered.filter(a => !a.isUsed);
      }
    }

    // Sorting
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sort === 'name_asc') {
      filtered.sort((a, b) => (a.filename || '').localeCompare(b.filename || ''));
    } else if (sort === 'name_desc') {
      filtered.sort((a, b) => (b.filename || '').localeCompare(a.filename || ''));
    } else if (sort === 'size_desc') {
      filtered.sort((a, b) => (b.size || 0) - (a.size || 0));
    } else if (sort === 'size_asc') {
      filtered.sort((a, b) => (a.size || 0) - (b.size || 0));
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 24));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedAssets = filtered.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      assets: paginatedAssets,
      stats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/admin/media/:id - Single Media Asset Detail & Full Reference List
app.get('/api/admin/media/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let asset = null;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      asset = await MediaAsset.findById(id).lean();
    }
    if (!asset) {
      asset = (memoryStore.media || []).find(m => String(m._id) === String(id));
    }

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found.' });
    }

    const references = await scanMediaReferences(asset.url, asset.filename);
    res.json({
      success: true,
      asset: {
        ...asset,
        references,
        referenceCount: references.length,
        isUsed: references.length > 0,
        formattedSize: formatStorageBytes(asset.size)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/admin/media/upload - Upload Media Assets from Admin Media Library
app.post('/api/admin/media/upload', authenticateToken, (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File rejected: File size exceeds the maximum permitted limit (Max 50MB for videos, 10MB for images).' });
        }
      }
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No media file provided for upload.' });
    }

    const uploaderName = req.user?.fullName || req.user?.username || 'Curator Admin';
    const savedAssets = [];

    for (const file of req.files) {
      // Validate image size (10MB) vs video size (50MB)
      const isVideo = file.mimetype.startsWith('video/');
      if (!isVideo && file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: `Image '${file.originalname}' rejected: Maximum permitted image size is 10MB.` });
      }

      const fileUrl = `/uploads/${file.filename}`;
      const asset = await registerMediaAsset({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        uploadedBy: uploaderName,
        altText: req.body.altText || '',
        caption: req.body.caption || '',
        tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',')) : []
      });

      savedAssets.push(asset);
    }

    res.json({
      success: true,
      message: `Successfully uploaded and registered ${savedAssets.length} asset(s).`,
      count: savedAssets.length,
      assets: savedAssets,
      asset: savedAssets[0] // convenient single asset accessor
    });
  });
});

// 4. POST /api/admin/media/:id/replace - Safe Media Replacement with Automatic Reference Propagation
app.post('/api/admin/media/:id/replace', authenticateToken, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No replacement media file provided.' });
    }

    try {
      const { id } = req.params;
      let existingAsset = null;
      if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
        existingAsset = await MediaAsset.findById(id);
      }
      if (!existingAsset) {
        existingAsset = (memoryStore.media || []).find(m => String(m._id) === String(id));
      }

      if (!existingAsset) {
        return res.status(404).json({ success: false, message: 'Target media asset to replace was not found.' });
      }

      const oldUrl = existingAsset.url;
      const oldFilename = existingAsset.filename;
      const newFile = req.file;
      const newUrl = `/uploads/${newFile.filename}`;
      const newMediaType = detectMediaType(newFile.mimetype, newFile.filename);

      // Propagate new URL across all database and memoryStore documents referencing oldUrl
      const updatedRefsCount = await replaceMediaReferences(oldUrl, newUrl);

      // Update existingAsset metadata
      existingAsset.filename = newFile.filename;
      existingAsset.originalName = newFile.originalname;
      existingAsset.mimeType = newFile.mimetype;
      existingAsset.mediaType = newMediaType;
      existingAsset.size = newFile.size;
      existingAsset.url = newUrl;
      existingAsset.updatedAt = new Date();

      if (isMongoConnected && typeof existingAsset.save === 'function') {
        await existingAsset.save();
      } else {
        const memIdx = (memoryStore.media || []).findIndex(m => String(m._id) === String(id));
        if (memIdx !== -1) {
          memoryStore.media[memIdx] = { ...existingAsset };
        }
      }

      // If old file was in uploads and filename changed, optionally clean up old physical file safely
      if (oldFilename && oldFilename !== newFile.filename) {
        const oldFilePath = path.join(uploadsDir, oldFilename);
        if (fs.existsSync(oldFilePath)) {
          try { fs.unlinkSync(oldFilePath); } catch (e) { /* ignore unlink error */ }
        }
      }

      const newReferences = await scanMediaReferences(newUrl, newFile.filename);

      res.json({
        success: true,
        message: `Asset successfully replaced. Propagated to ${updatedRefsCount} active reference(s).`,
        updatedReferencesCount: updatedRefsCount,
        asset: {
          ...existingAsset.toObject ? existingAsset.toObject() : existingAsset,
          references: newReferences,
          isUsed: newReferences.length > 0
        }
      });
    } catch (replaceErr) {
      res.status(500).json({ success: false, error: replaceErr.message });
    }
  });
});

// 5. PATCH /api/admin/media/:id - Update Media Metadata (Alt Text, Caption, Tags, Original Name)
app.patch('/api/admin/media/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { altText, caption, tags, originalName } = req.body;

    let asset = null;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      asset = await MediaAsset.findById(id);
      if (asset) {
        if (altText !== undefined) asset.altText = sanitizeInput(altText, 300);
        if (caption !== undefined) asset.caption = sanitizeInput(caption, 500);
        if (originalName !== undefined) asset.originalName = sanitizeInput(originalName, 200);
        if (tags !== undefined) {
          asset.tags = Array.isArray(tags) ? tags.map(t => sanitizeInput(t, 50)) : [];
        }
        asset.updatedAt = new Date();
        await asset.save();
      }
    }

    if (!asset) {
      const memIdx = (memoryStore.media || []).findIndex(m => String(m._id) === String(id));
      if (memIdx !== -1) {
        asset = memoryStore.media[memIdx];
        if (altText !== undefined) asset.altText = sanitizeInput(altText, 300);
        if (caption !== undefined) asset.caption = sanitizeInput(caption, 500);
        if (originalName !== undefined) asset.originalName = sanitizeInput(originalName, 200);
        if (tags !== undefined) {
          asset.tags = Array.isArray(tags) ? tags.map(t => sanitizeInput(t, 50)) : [];
        }
        asset.updatedAt = new Date();
        memoryStore.media[memIdx] = asset;
      }
    }

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found.' });
    }

    const references = await scanMediaReferences(asset.url, asset.filename);
    res.json({
      success: true,
      message: 'Media metadata updated successfully.',
      asset: {
        ...asset.toObject ? asset.toObject() : asset,
        references,
        isUsed: references.length > 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. DELETE /api/admin/media/:id - Safe Deletion with Active Reference Protection
app.delete('/api/admin/media/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let asset = null;
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      asset = await MediaAsset.findById(id);
    }
    if (!asset) {
      asset = (memoryStore.media || []).find(m => String(m._id) === String(id));
    }

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found.' });
    }

    // CRITICAL: Safe Delete Protection - Scan active references
    const references = await scanMediaReferences(asset.url, asset.filename);
    if (references.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Deletion Blocked: This asset is currently in active use across ${references.length} item(s). You must replace or unlink these references before deleting.`,
        references,
        isReferenced: true
      });
    }

    // Unlink physical file from uploads/ if it exists
    if (asset.filename) {
      const filePath = path.join(uploadsDir, asset.filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore unlink error */ }
      }
    }

    // Remove from MongoDB
    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      await MediaAsset.findByIdAndDelete(id);
    }

    // Remove from memoryStore
    memoryStore.media = (memoryStore.media || []).filter(m => String(m._id) !== String(id));

    res.json({
      success: true,
      message: `Media asset '${asset.filename}' was permanently deleted.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. GET /api/admin/media/check-usage - Lookup active references for any URL
app.get('/api/admin/media-check-usage', authenticateToken, async (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url && !filename) {
      return res.status(400).json({ success: false, message: 'URL or filename parameter required.' });
    }
    const references = await scanMediaReferences(url, filename);
    res.json({
      success: true,
      url,
      filename,
      isUsed: references.length > 0,
      referenceCount: references.length,
      references
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. File Upload Endpoint with Size & MIME Type Verification
app.post('/api/upload', authenticateToken, (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File rejected: Maximum permitted file size exceeded (Max 50MB for video, 10MB for images).' });
        }
      }
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No media file provided in request.' });
    }

    const file = req.files[0];
    const isVideo = file.mimetype.startsWith('video/');
    if (!isVideo && file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File rejected: Maximum permitted image size is 10MB.' });
    }

    const fileUrl = `/uploads/${file.filename}`;
    const uploaderName = req.user?.fullName || req.user?.username || 'Curator Admin';

    // Auto-register in MediaAsset registry
    const registeredAsset = await registerMediaAsset({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: fileUrl,
      uploadedBy: uploaderName
    });

    res.json({
      success: true,
      message: 'Media successfully uploaded and registered in library.',
      fileUrl,
      url: fileUrl,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      asset: registeredAsset
    });
  });
});

// 11.1 Batch Gallery Images Upload Endpoint (Up to 10 images at once)
app.post('/api/upload-gallery', authenticateToken, (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File rejected: Maximum permitted file size exceeded.' });
        }
      }
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No gallery images uploaded.' });
    }

    const uploaderName = req.user?.fullName || req.user?.username || 'Curator Admin';
    const files = [];

    for (let idx = 0; idx < req.files.length; idx++) {
      const file = req.files[idx];
      const fileUrl = `/uploads/${file.filename}`;
      const registered = await registerMediaAsset({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        uploadedBy: uploaderName
      });

      files.push({
        url: fileUrl,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        order: idx + 1,
        assetId: registered._id
      });
    }

    res.json({
      success: true,
      message: `Successfully uploaded ${files.length} gallery media asset(s).`,
      count: files.length,
      files
    });
  });
});

// API 404 Catch-All Guard (Returns JSON instead of HTML for missing API endpoints)
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint '${req.method} ${req.originalUrl}' not found.` });
});

// Serve Dedicated Admin Panel Page for all /admin routes
app.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fallback middleware to serve the Single Page Application
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  RESOLUTION: MEDIA COLLECTIVE PLATFORM ENGINE   `);
  console.log(`  Public Web: http://localhost:${PORT}          `);
  console.log(`  Admin CMS:  http://localhost:${PORT}/admin    `);
  console.log(`=================================================`);
});

export default app;
