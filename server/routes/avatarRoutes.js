import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `avatar-${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post('/upload', upload.single('avatar'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), user.avatar);
      fs.access(oldAvatarPath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(oldAvatarPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting old avatar:', unlinkErr);
          });
        }
      });
    }

    // Save new avatar path (relative to server root)
    user.avatar = `uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ avatar: user.avatar });
  } catch (err) {
    console.error('Avatar upload error:', err.message);
    res.status(500).json({ message: 'Avatar upload failed', error: err.message });
  }
});

export default router;
