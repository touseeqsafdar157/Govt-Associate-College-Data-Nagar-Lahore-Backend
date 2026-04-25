const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// POST a new message (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMessage = new ContactMessage({ name, email, phone, subject, message });
    await newMessage.save();
    res.status(201).json({
      id: newMessage._id,
      name: newMessage.name,
      email: newMessage.email,
      phone: newMessage.phone,
      subject: newMessage.subject,
      message: newMessage.message,
      status: newMessage.status,
      createdAt: newMessage.createdAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all messages (Admin)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    // Map _id to id for frontend
    const formattedMessages = messages.map(m => ({
      id: m._id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      subject: m.subject,
      message: m.message,
      status: m.status,
      createdAt: m.createdAt
    }));
    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT mark message as read (Admin)
router.put('/:id/read', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    
    res.json({
      id: message._id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      status: message.status,
      createdAt: message.createdAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a message (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
