import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  createNewComment,
  deleteComment,
} from '../controllers/commentController.js';

const router = express.Router();

// @desc Create new comment
// @route POST /comment/create/:id
// @access Private
router.post('/create/:id', verifyJWT, createNewComment);

// @desc Delete comment
// @route DELETE /comment/delete/:id
// @access Private Admin
router.delete('/delete/:id', verifyJWT, isAdmin, deleteComment);

export default router;
