import express from 'express';
import multer from 'multer';
import Note from '../models/Note.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const allowedMimeTypes = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF, TXT, and DOCX files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// POST: Upload file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { filename, originalname, path, mimetype, size } = req.file;
    const userId = req.body.userId;

    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const note = new Note({
      filename,
      originalname,
      path,
      mimetype,
      size,
      userId,
    });

    await note.save();
    res.status(200).json({ message: 'File uploaded and metadata saved', note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Get all notes for a user
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    const notes = await Note.find({ userId }).sort({ uploadedAt: -1 });
    res.status(200).json({ notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
