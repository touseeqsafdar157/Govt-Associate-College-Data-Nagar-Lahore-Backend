require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix for querySrv ECONNREFUSED

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. First attempt: Serve from disk (fast cache)
app.use('/uploads', express.static(uploadsDir));

// 2. Second attempt: Permanent MongoDB fallback for when Render wipes the ephemeral disk
const UploadedFile = require('./models/UploadedFile');

app.get('/uploads/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const file = await UploadedFile.findOne({ filename });
    if (!file) {
      return res.status(404).send('File not found');
    }

    // Restore back to local disk so subsequent requests are fast
    const localPath = path.join(uploadsDir, filename);
    try {
      if (!fs.existsSync(localPath)) {
        fs.writeFileSync(localPath, file.data);
      }
    } catch (writeErr) {
      // Ignore write errors on read-only cloud containers
    }

    res.set('Content-Type', file.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    return res.send(file.data);
  } catch (err) {
    console.error('Error retrieving file from MongoDB:', err);
    return res.status(500).send('Error retrieving file');
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
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

// Seed default admin and backup local files to MongoDB
const User = require('./models/User');

async function seedAdmin() {
  const count = await User.countDocuments();
  if (count === 0) {
    await new User({ name: 'Administrator', email: 'admin@gac.edu.pk', password: 'admin@gac123' }).save();
    console.log('Default admin created: admin@gac.edu.pk / admin@gac123');
  }
}

async function syncLocalUploadsToDB() {
  try {
    if (!fs.existsSync(uploadsDir)) return;
    const files = fs.readdirSync(uploadsDir);
    for (const filename of files) {
      const filePath = path.join(uploadsDir, filename);
      if (fs.statSync(filePath).isFile()) {
        const exists = await UploadedFile.exists({ filename });
        if (!exists) {
          const buffer = fs.readFileSync(filePath);
          const ext = path.extname(filename).toLowerCase();
          const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.avif': 'image/avif',
            '.pdf': 'application/pdf'
          };
          await UploadedFile.create({
            filename,
            data: buffer,
            contentType: mimeTypes[ext] || 'application/octet-stream',
            size: buffer.length
          });
          console.log(`Synced existing file to MongoDB: ${filename}`);
        }
      }
    }
  } catch (err) {
    console.error('Error syncing local uploads to MongoDB:', err);
  }
}

mongoose.connection.once('open', async () => {
  await seedAdmin();
  await syncLocalUploadsToDB();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
