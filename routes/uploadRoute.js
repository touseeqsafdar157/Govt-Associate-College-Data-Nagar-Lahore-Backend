const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const UploadedFile = require('../models/UploadedFile');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage config — save to /uploads folder with original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
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

// POST /api/upload — saves to disk AND permanent MongoDB storage, returns image URL(s)
router.post('/', (req, res) => {
  upload.array('image', 10)(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(400).json({ error: err.message });
    }
    
    let uploadedFiles = req.files || [];
    if (uploadedFiles.length === 0 && req.file) {
      uploadedFiles = [req.file];
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Save every uploaded file to MongoDB permanently so Render never deletes them
    for (const file of uploadedFiles) {
      try {
        const fileBuffer = fs.readFileSync(file.path);
        await UploadedFile.findOneAndUpdate(
          { filename: file.filename },
          {
            filename: file.filename,
            data: fileBuffer,
            contentType: file.mimetype,
            size: file.size
          },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        console.error("Error backing up file to MongoDB:", dbErr);
      }
    }
    
    const proto = req.headers['x-forwarded-proto'] || (req.get('host').includes('localhost') ? 'http' : 'https');
    const host = req.get('host');
    const urls = uploadedFiles.map(file => `${proto}://${host}/uploads/${file.filename}`);
    
    res.json({ url: urls[0], urls });
  });
});

module.exports = router;
