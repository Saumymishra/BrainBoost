import express from 'express';
import { signup, login, getUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getUserProfile);

export default router;
