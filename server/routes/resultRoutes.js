import express from 'express';
import Result from '../models/Result.js';

const router = express.Router();

// POST /api/results - Save quiz results
router.post('/', async (req, res) => {
  try {
    const { noteId, totalQuestions, correctAnswers, answers, userId, timeSpent } = req.body;

    if (!noteId || !userId) {
      return res.status(400).json({ message: 'noteId and userId are required' });
    }
    if (
      typeof totalQuestions !== 'number' ||
      typeof correctAnswers !== 'number' ||
      typeof answers !== 'object' ||
      answers === null
    ) {
      return res.status(400).json({ message: 'totalQuestions, correctAnswers, and answers are required and must be valid' });
    }

    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const result = new Result({
      noteId,
      userId,
      totalQuestions,
      correctAnswers,
      accuracy,
      answers,
      timeSpent: typeof timeSpent === 'number' ? timeSpent : 0,
      attemptedAt: new Date(),
    });

    await result.save();

    res.status(201).json({ message: 'Result saved successfully', result });
  } catch (err) {
    console.error('Save result error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/results/user/:userId - Get all quiz attempts of a user, with note details populated
router.get('/user/:userId', async (req, res) => {
  try {
    let { userId } = req.params;
    userId = userId.trim();  // Trim whitespace/newlines

    // console.log('Fetching results for user:', userId);

    const results = await Result.find({ userId })
      .populate('noteId', 'originalname')
      .sort({ attemptedAt: -1 });

    // console.log('Number of results found:', results.length);

    res.json({ results });
  } catch (err) {
    console.error('Fetch results error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/results/user/:userId/summary - Get analytics summary for user with note populated
router.get('/user/:userId/summary', async (req, res) => {
  try {
    let { userId } = req.params;
    userId = userId.trim();  // Trim whitespace/newlines

    const results = await Result.find({ userId }).populate('noteId', 'originalname');

    if (results.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        averageAccuracy: 0,
        averageTimeSpent: 0,
        bestAttempt: null,
        worstAttempt: null,
      });
    }

    const totalAttempts = results.length;
    const totalScore = results.reduce((acc, r) => acc + (r.correctAnswers ?? 0), 0);
    const totalAccuracy = results.reduce((acc, r) => acc + (r.accuracy ?? 0), 0);
    const totalTimeSpent = results.reduce((acc, r) => acc + (r.timeSpent ?? 0), 0);

    // Find best and worst attempts (by correctAnswers)
    const bestAttempt = results.reduce(
      (best, r) => (r.correctAnswers > (best?.correctAnswers ?? 0) ? r : best),
      null
    );

    const worstAttempt = results.reduce(
      (worst, r) => (r.correctAnswers < (worst?.correctAnswers ?? Infinity) ? r : worst),
      null
    );

    res.json({
      totalAttempts,
      averageScore: totalScore / totalAttempts,
      averageAccuracy: totalAccuracy / totalAttempts,
      averageTimeSpent: totalTimeSpent / totalAttempts,
      bestAttempt,
      worstAttempt,
    });
  } catch (err) {
    console.error('Fetch summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
