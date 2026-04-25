const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

// Get all faculty
router.get('/', async (req, res) => {
  try {
    const count = await Faculty.countDocuments();
    if (count === 0) {
      await Faculty.insertMany([
        { name: "Dr. Ahmed Raza", dept: "Science", subject: "Chemistry", designation: "Head of Department", qualification: "Ph.D. Chemistry", experience: "20 Years", isHOD: true, staffType: "Teaching", email: "ahmed.raza@college.edu.pk" },
        { name: "Prof. Sarah Khan", dept: "Arts", subject: "English", designation: "Head of Department", qualification: "M.Phil English", experience: "18 Years", isHOD: true, staffType: "Teaching", email: "sarah.khan@college.edu.pk" },
        { name: "Prof. Usman Ali", dept: "Commerce", subject: "Accounting", designation: "Head of Department", qualification: "M.Com, CMA", experience: "15 Years", isHOD: true, staffType: "Teaching", email: "usman.ali@college.edu.pk" },
        { name: "Dr. Bilal Hussain", dept: "Science", subject: "Physics", designation: "Associate Professor", qualification: "Ph.D. Physics", experience: "10 Years", isHOD: false, staffType: "Teaching" },
        { name: "Mr. Imran Shah", dept: "Science", subject: "Biology", designation: "Assistant Professor", qualification: "M.Phil Botany", experience: "8 Years", isHOD: false, staffType: "Teaching" },
        { name: "Mr. Tariq Mehmood", designation: "Chief Librarian", experience: "15 Years", staffType: "Non-Teaching" },
        { name: "Mr. Asif Riaz", designation: "Head of Administration", experience: "20 Years", staffType: "Non-Teaching" }
      ]);
    }
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.json(faculty.map(f => ({ ...f.toObject(), id: f._id })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a faculty member
router.post('/', async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    const savedFaculty = await faculty.save();
    res.status(201).json({ ...savedFaculty.toObject(), id: savedFaculty._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a faculty member
router.put('/:id', async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ...updatedFaculty.toObject(), id: updatedFaculty._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a faculty member
router.delete('/:id', async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
