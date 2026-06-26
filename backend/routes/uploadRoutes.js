import express from 'express';
import multer from 'multer';

import { protect } from '../middleware/auth.js';
import { cloudinaryUploadStream } from '../config/cloudinary.js';

const router = express.Router();

const uploadImages = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isImage = /^image\//.test(file.mimetype);
    if (!isImage) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const uploadVideos = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isVideo = /^video\//.test(file.mimetype);
    if (!isVideo) return cb(new Error('Only video files are allowed'));
    cb(null, true);
  },
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

const uploadResources = multer({
  storage: multer.memoryStorage(),
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

const uploadUrl = async (file, folder, resourceType = 'auto') => {
  const result = await cloudinaryUploadStream({
    buffer: file.buffer,
    mimetype: file.mimetype,
    folder,
    resourceType,
  });

  if (!result?.secure_url) {
    // Cloudinary isn't configured or upload failed.
    // Preserve legacy contract by failing explicitly.
    throw new Error('Cloudinary upload failed');
  }

  return result.secure_url;
};


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



