import express from 'express';
import { getAllBlogs } from '../controllers/blogController.js';

const router = express.Router();

// @desc Get all published blogs
// @route GET /blog/blogs_all
// @access Public
router.get('/blogs_all', getAllBlogs);

export default router;
