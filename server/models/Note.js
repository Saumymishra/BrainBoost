// models/Note.js

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  userId: String,
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
