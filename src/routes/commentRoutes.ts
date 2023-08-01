import express from 'express';
import { createNewComment } from '../controllers/commentController.js';

const router = express.Router();

// @desc Create new comment
// @route POST /comment/create_comment
// @access Private
router.post('/create_comment', createNewComment);

export default router;
