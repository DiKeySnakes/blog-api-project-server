import express from 'express';
import { sign_up, login } from '../controllers/authController.js';

const router = express.Router();

// @desc Create new user (Sign up)
// @route POST /auth/sign_up
// @access Public
router.post('/sign_up', sign_up);

// @desc Login
// @route POST /auth/login
// @access Public
router.post('/login', login);

export default router;
