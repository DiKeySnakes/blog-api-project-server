import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  getBlogs,
  getAllBlogs,
  getDetailedBlog,
  createNewBlog,
  updateBlog,
  publishBlog,
} from '../controllers/blogController.js';

const router = express.Router();

// @desc Get all published and unpublished blogs
// @route GET /blog/blogs
// @access Private Admin
router.get('/blogs', verifyJWT, isAdmin, getBlogs);

// @desc Get all published blogs
// @route GET /blog/blogs_all
// @access Public
router.get('/blogs_all', getAllBlogs);

// @desc Create new blog
// @route POST /blog/create_blog
// @access Private Admin
router.post('/create_blog', verifyJWT, isAdmin, createNewBlog);

// @desc Display detail page for a specific blog
// @route GET /blog/:id
// @access Public
router.get('/:id', getDetailedBlog);

// @desc Update a blog
// @route PATCH /blog/update/:id
// @access Private Admin
router.patch('/update/:id', verifyJWT, isAdmin, updateBlog);

// @desc Publish a blog
// @route PATCH /blog/publish/:id
// @access Private Admin
router.patch('/publish/:id', verifyJWT, isAdmin, publishBlog);

export default router;
