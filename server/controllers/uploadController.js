const Note = require('../models/Note');
const path = require('path');

exports.uploadNote = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const note = new Note({
      userId: req.body.userId,
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype
    });

    await note.save();
    res.status(201).json({ message: 'File uploaded successfully', note });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
