const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: 1 });
    // Map _id to id for frontend and ensure category is populated
    res.json(news.map(item => {
      const obj = item.toObject();
      return {
        ...obj,
        id: item._id,
        category: obj.category || 'General'
      };
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create news
router.post('/', async (req, res) => {
  const newsData = { ...req.body };
  if (!newsData.category) newsData.category = 'General';
  if (!newsData.summary) newsData.summary = (newsData.content || '').substring(0, 50);
  const news = new News(newsData);
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
    const newsData = { ...req.body };
    if (!newsData.category) newsData.category = 'General';
    const updatedNews = await News.findByIdAndUpdate(req.params.id, newsData, { new: true });
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
