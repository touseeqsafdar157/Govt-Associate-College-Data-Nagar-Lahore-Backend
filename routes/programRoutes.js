const express = require('express');
const router = express.Router();
const Program = require('../models/Program');

// Get all programs
router.get('/', async (req, res) => {
  try {
    const count = await Program.countDocuments();
    if (count === 0) {
      await Program.insertMany([
        { name: "FSc Pre-Medical", category: "Intermediate", duration: "2 Years", fee: "PKR 15,000/year", eligibility: "Matric with Science (Minimum 60% marks)", subjects: "Biology, Physics, Chemistry, English, Urdu, Islamic Studies" },
        { name: "FSc Pre-Engineering", category: "Intermediate", duration: "2 Years", fee: "PKR 15,000/year", eligibility: "Matric with Science (Minimum 60% marks)", subjects: "Mathematics, Physics, Chemistry, English, Urdu, Islamic Studies" },
        { name: "ICS", category: "Intermediate", duration: "2 Years", fee: "PKR 18,000/year", eligibility: "Matric (Minimum 55% marks)", subjects: "Computer Science, Mathematics, Physics/Stats, English, Urdu, Islamic Studies" },
        { name: "ADP Science", category: "ADP", duration: "2 Years", fee: "PKR 25,000/year", eligibility: "Intermediate (Minimum 50% marks)", subjects: "Advanced Physics, Chemistry, Zoology, Botany" },
        { name: "ADP Computer Science", category: "ADP", duration: "2 Years", fee: "PKR 30,000/year", eligibility: "ICS or equivalent (Minimum 50% marks)", subjects: "Programming, Databases, Web Development, Networking" }
      ]);
    }
    const programs = await Program.find().sort({ createdAt: -1 });
    res.json(programs.map(p => ({ ...p.toObject(), id: p._id })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a program
router.post('/', async (req, res) => {
  try {
    const program = new Program(req.body);
    const savedProgram = await program.save();
    res.status(201).json({ ...savedProgram.toObject(), id: savedProgram._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a program
router.put('/:id', async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ...updatedProgram.toObject(), id: updatedProgram._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a program
router.delete('/:id', async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
