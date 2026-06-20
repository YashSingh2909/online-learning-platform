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
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

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

const uploadImages = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isImage = /^image\//.test(file.mimetype);
    if (!isImage) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const uploadVideos = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isVideo = /^video\//.test(file.mimetype);
    if (!isVideo) return cb(new Error('Only video files are allowed'));
    cb(null, true);
  },
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

const uploadResources = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      // documents
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      // images
      /^image\//,
    ];

    const mime = file.mimetype;
    const ok = allowedMimes.some((t) => (typeof t === 'string' ? t === mime : t.test(mime)));
    if (!ok) {
      return cb(new Error('Unsupported file type for assignment resource'));
    }

    cb(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Upload course thumbnail (image only)
router.post('/course-thumbnail', protect, uploadImages.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Thumbnail file is required' });
    }

    const url = await uploadUrl(req.file, 'edusphere/course-thumbnails', 'image');
    res.status(200).json({ success: true, data: { url } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

// Upload lesson video (mp4/webm/ogg etc via video/* mime)
router.post('/lesson-video', protect, uploadVideos.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Video file is required' });
    }

    const url = await uploadUrl(req.file, 'edusphere/lesson-videos', 'video');
    res.status(200).json({ success: true, data: { url } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

// Upload assignment resources (pdf/docx/ppt/images/zip etc)
router.post('/assignment-resources', protect, uploadResources.array('resources', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one resource file is required' });
    }

    const urls = await Promise.all(req.files.map((f) => uploadUrl(f, 'edusphere/assignment-resources', 'auto')));
    res.status(200).json({ success: true, data: { urls } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

export default router;


