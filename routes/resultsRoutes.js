const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Result = require('../models/Result');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10*1024*1024 } });

router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.class) query.class = req.query.class;
    if (req.query.year) query.year = req.query.year;
    if (req.query.search) {
      const re = { $regex: req.query.search, $options: 'i' };
      query.$or = [{ name: re }, { rollNumber: re }];
    }
    const results = await Result.find(query).sort({ marks: -1 });
    res.json(results);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    const result = new Result(data);
    await result.save();
    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
