import express from 'express';
import {
  sign_up,
  login,
  logout,
  refresh,
} from '../controllers/authController.js';

const router = express.Router();

// @desc Create new user (Sign up)
// @route POST /auth/sign_up
// @access Public
router.post('/sign_up', sign_up);

// @desc Login
// @route POST /auth/login
// @access Public
router.post('/login', login);

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
router.get('/refresh', refresh);

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
router.post('/logout', logout);

export default router;
