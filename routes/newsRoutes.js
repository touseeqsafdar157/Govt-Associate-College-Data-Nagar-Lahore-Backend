const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    // Map _id to id for frontend
    res.json(news.map(item => ({...item.toObject(), id: item._id})));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create news
router.post('/', async (req, res) => {
  const news = new News(req.body);
  try {
    const newNews = await news.save();
    res.status(201).json({...newNews.toObject(), id: newNews._id});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update news
router.put('/:id', async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({...updatedNews.toObject(), id: updatedNews._id});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
