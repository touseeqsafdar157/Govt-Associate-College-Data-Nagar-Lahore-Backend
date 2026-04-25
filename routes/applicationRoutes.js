const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10*1024*1024 } });
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'matricCert', maxCount: 1 },
  { name: 'cnicCopy', maxCount: 1 },
  { name: 'characterCert', maxCount: 1 }
]);

const fileUrl = (req, file) => file ? req.protocol + '://' + req.get('host') + '/uploads/' + file[0].filename : '';

// POST submit application
router.post('/', uploadFields, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files) {
      if (req.files.photo) data.photoUrl = fileUrl(req, req.files.photo);
      if (req.files.matricCert) data.matricCertUrl = fileUrl(req, req.files.matricCert);
      if (req.files.cnicCopy) data.cnicCopyUrl = fileUrl(req, req.files.cnicCopy);
      if (req.files.characterCert) data.characterCertUrl = fileUrl(req, req.files.characterCert);
    }
    const app = new Application(data);
    await app.save();
    res.status(201).json(app);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET all applications (admin)
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    const apps = await Application.find(query).sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update status
router.patch('/:id/status', async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(app);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE application
router.delete('/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
