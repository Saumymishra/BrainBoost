import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  userId: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  accuracy: { type: Number, required: true },  // store accuracy as percentage
  timeSpent: { type: Number, default: 0 },     // time in seconds
  answers: { type: Object, default: {} },
  attemptedAt: { type: Date, default: Date.now },
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
