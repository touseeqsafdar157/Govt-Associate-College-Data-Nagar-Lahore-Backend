const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const ContactMessage = require('../models/ContactMessage');
const Settings = require('../models/Settings');
const { sendFacultyQueryEmail } = require('../utils/emailService');

// POST a query directly to a faculty member (sends email via nodemailer and logs to contact messages)
router.post('/query', async (req, res) => {
  try {
    const {
      facultyId,
      facultyName,
      facultyEmail,
      senderName,
      senderEmail,
      senderPhone,
      subject,
      message,
      department,
      designation
    } = req.body;

    if (!senderName || !senderEmail || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    let targetEmail = (facultyEmail || '').trim();
    let targetName = (facultyName || '').trim();

    // If email is missing or empty, try looking up faculty member in database
    if (!targetEmail && facultyId) {
      try {
        const found = await Faculty.findById(facultyId);
        if (found) {
          if (!targetName) targetName = found.name;
          if (found.email) targetEmail = found.email.trim();
        }
      } catch (fErr) {
        console.error('Faculty lookup error:', fErr);
      }
    }

    // If still no email, fallback to site settings email
    if (!targetEmail) {
      try {
        const siteSettings = await Settings.findOne();
        if (siteSettings && siteSettings.email) {
          targetEmail = siteSettings.email.trim();
        }
      } catch (sErr) {
        console.error('Settings lookup error:', sErr);
      }
    }

    if (!targetEmail) {
      targetEmail = 'datanagargacw@gmail.com';
    }

    // 1. Save query in ContactMessage so admin dashboard has a permanent record
    const contactMsg = new ContactMessage({
      name: senderName.trim(),
      email: senderEmail.trim(),
      phone: (senderPhone || '').trim(),
      subject: `Query for ${targetName || 'Faculty'} (${designation || 'Staff'}): ${subject.trim()}`,
      message: `[FACULTY INQUIRY DIRECT EMAIL]\nRecipient Faculty: ${targetName || 'Faculty Member'}\nDesignation: ${designation || 'N/A'}\nDepartment: ${department || 'N/A'}\nRecipient Email: ${targetEmail}\n\nSender: ${senderName.trim()} <${senderEmail.trim()}>\nPhone: ${(senderPhone || 'N/A').trim()}\n\nSubject: ${subject.trim()}\n\nDescription / Message:\n${message.trim()}`,
      status: 'unread'
    });
    await contactMsg.save();

    // 2. Send email directly to faculty member's inbox via nodemailer
    let emailResult = { success: false };
    try {
      emailResult = await sendFacultyQueryEmail({
        facultyName: targetName,
        facultyEmail: targetEmail,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        senderPhone: (senderPhone || '').trim(),
        subject: subject.trim(),
        message: message.trim(),
        department,
        designation
      });
    } catch (mailErr) {
      console.error('Nodemailer error sending faculty query:', mailErr);
      emailResult = { success: false, error: mailErr.message };
    }

    return res.status(200).json({
      success: true,
      message: `Email and inquiry sent to ${targetName || 'Faculty Member'} (${targetEmail}) successfully!`,
      facultyEmail: targetEmail,
      contactId: contactMsg._id,
      emailSent: emailResult.success,
      previewUrl: emailResult.previewUrl || undefined
    });
  } catch (err) {
    console.error('Error handling faculty query:', err);
    return res.status(500).json({ message: err.message || 'Failed to process inquiry' });
  }
});

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
    const faculty = await Faculty.find().sort({ createdAt: 1 });
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
