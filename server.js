const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
 
// Routes
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/events', require('./routes/eventsRoutes'));
app.use('/api/announcements', require('./routes/announcementsRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/upload', require('./routes/uploadRoute'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/results', require('./routes/resultsRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Seed default admin user if none exist
const User = require('./models/User');
async function seedAdmin() {
  const count = await User.countDocuments();
  if (count === 0) {
    await new User({ name: 'Administrator', email: 'admin@gac.edu.pk', password: 'admin@gac123' }).save();
    console.log('Default admin created: admin@gac.edu.pk / admin@gac123');
  }
}
mongoose.connection.once('open', seedAdmin);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
