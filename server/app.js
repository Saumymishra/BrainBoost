import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static files
app.use('/uploads', express.static(path.resolve('uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Error handling
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});
