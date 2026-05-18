const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Storage config — save to /uploads folder with original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|heic|avif|svg|pdf|doc|docx/i;
    const ext = allowed.test(path.extname(file.originalname));
    const mime = allowed.test(file.mimetype);
    if (ext || mime) return cb(null, true);
    cb(new Error(`Invalid file format for: ${file.originalname}. Only images/documents allowed.`));
  }
});

// POST /api/upload — returns the image URL(s)
router.post('/', (req, res) => {
  upload.array('image', 10)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.files || req.files.length === 0) {
      // Fallback if req.file is present (for single upload backward compatibility if needed)
      if (req.file) {
        const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        return res.json({ url, urls: [url] });
      }
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const urls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    // return both url (first one) and urls (array) to avoid breaking existing single-upload implementations that aren't updated yet
    res.json({ url: urls[0], urls });
  });
});

module.exports = router;
