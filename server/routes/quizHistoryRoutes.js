// routes/quizHistoryRoutes.js
import express from 'express';
import Result from '../models/Result.js';

const router = express.Router();

// GET /api/quiz-history/:userId - fetch all quiz attempts for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await Result.find({ userId }).populate('noteId', 'originalname').sort({ attemptedAt: -1 });

    if (!results || results.length === 0) {
      return res.status(200).json({ message: 'No quiz history found.', results: [] });
    }

    res.status(200).json({ results });
  } catch (err) {
    console.error('Error fetching quiz history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
