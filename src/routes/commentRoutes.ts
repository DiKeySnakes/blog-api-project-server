import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import { createNewComment } from '../controllers/commentController.js';

const router = express.Router();

// @desc Create new comment
// @route POST /comment/create_comment
// @access Private
router.post('/create_comment', verifyJWT, createNewComment);

export default router;
