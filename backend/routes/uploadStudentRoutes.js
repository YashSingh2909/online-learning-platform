import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';

import { protect } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const base = path.basename(file.originalname || 'upload', ext);
    const safeBase = base.replace(/[^a-zA-Z0-9_-]/g, '');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase || 'file'}-${unique}${ext}`);
  },
});

const makeUrl = (filename) => {
  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${filename}`;
};

const hasCloudinaryConfig = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const uploadToCloudinary = async (file, folder, resourceType = 'auto') => {
  if (!hasCloudinaryConfig()) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');
  const buffer = await fs.readFile(file.path);

  const formData = new FormData();
  formData.append('file', new Blob([buffer], { type: file.mimetype }), file.originalname);
  formData.append('api_key', process.env.CLOUDINARY_API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
  const response = await fetch(url, { method: 'POST', body: formData });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed');
  }
  return data.secure_url;
};

const uploadUrl = async (file, folder, resourceType = 'auto') => {
  const cloudinaryUrl = await uploadToCloudinary(file, folder, resourceType);
  return cloudinaryUrl || makeUrl(file.filename);
};

const uploadResources = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      /^image\//,
    ];

    const mime = file.mimetype;
    const ok = allowedMimes.some((t) => (typeof t === 'string' ? t === mime : t.test(mime)));

    if (!ok) return cb(new Error('Unsupported file type'));
    cb(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Student uploads (assignment submission file)
router.post('/student-assignment-file', protect, (req, res, next) => {
  // Only students allowed to use this endpoint
  if (req.user?.role !== 'student' && req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only students can upload assignment files' });
  }
  next();
}, uploadResources.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'file is required' });

    const url = await uploadUrl(req.file, 'edusphere/student-assignments', 'auto');
    return res.status(200).json({ success: true, data: { url } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

export default router;

