import express from 'express';
import { sign_up } from '../controllers/authController.js';

const router = express.Router();

// @desc Create new user (Sign up)
// @route POST /auth/sign_up
// @access Public
router.get('/sign_up', sign_up);

export default router;
