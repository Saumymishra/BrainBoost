import express from 'express';
import multer from 'multer';
import Note from '../models/Note.js';
import { extractTextFromFile } from '../utils/extractText.js';
import { generateMCQsFromText } from '../utils/geminiAI.js';

const router = express.Router();

// Multer config
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

// POST: Upload file and store extracted text only
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { filename, originalname, path, mimetype, size } = req.file;
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const extractedText = await extractTextFromFile(path, mimetype);
    console.log('Extracted text:', extractedText.slice(0, 300));

    const note = new Note({
      filename,
      originalname,
      path,
      mimetype,
      size,
      userId,
      extractedText,
    });

    await note.save();

    res.status(200).json({ message: 'File uploaded successfully', note });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch all notes by userId
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

// GET: Fetch a single note by its ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({ note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Generate MCQs from extracted text for a note
router.post('/:id/generate', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (!note.extractedText || note.extractedText.length < 50) {
      return res.status(400).json({ message: 'Insufficient text to generate MCQs' });
    }

    const mcqs = await generateMCQsFromText(note.extractedText);
    note.mcqs = mcqs;
    await note.save();

    res.status(200).json({ message: 'MCQs generated successfully', mcqs });
  } catch (err) {
    console.error('MCQ generation error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
