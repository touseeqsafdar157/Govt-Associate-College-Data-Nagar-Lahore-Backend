const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

router.get('/', async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems.map(item => ({...item.toObject(), id: item._id})));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newGalleryItem = await new Gallery(req.body).save();
    res.status(201).json({...newGalleryItem.toObject(), id: newGalleryItem._id});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
