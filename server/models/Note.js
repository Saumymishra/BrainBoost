import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answerIndex: Number, // index of the correct option
});

const noteSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  userId: String,
  mcqs: [mcqSchema], // ✅ only one clean definition
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
