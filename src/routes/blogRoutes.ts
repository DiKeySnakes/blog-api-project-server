import express from 'express';
import {
  getAllBlogs,
  getDetailedBlog,
  createNewBlog,
  updateBlog,
  publishBlog,
} from '../controllers/blogController.js';

const router = express.Router();

// @desc Get all published blogs
// @route GET /blog/blogs_all
// @access Public
router.get('/blogs_all', getAllBlogs);

// @desc Create new blog
// @route POST /blog/create_blog
// @access Private
router.post('/create_blog', createNewBlog);

// @desc Display detail page for a specific blog
// @route GET /blog/:id
// @access Public
router.get('/:id', getDetailedBlog);

// @desc Update a blog
// @route PATCH /blog/update/:id
// @access Private
router.patch('/update/:id', updateBlog);

// @desc Publish a blog
// @route PATCH /blog/publish/:id
// @access Private
router.patch('/publish/:id', publishBlog);

export default router;
