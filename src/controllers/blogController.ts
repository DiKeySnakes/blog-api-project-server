import Blog from '../models/blog.js';
import { Request, Response } from 'express';

// @desc Get all published blogs
// @route GET /blog/blogs_all
// @access Public
const getAllBlogs = async (req: Request, res: Response) => {
  // Get all published blogs from MongoDB excluding content fields and comments arrays
  const blogs = await Blog.find({ published: true })
    .select('-content -comments')
    .exec();

  // If no published blogs
  if (!blogs?.length) {
    return res.status(400).json({ message: 'No published blogs found' });
  }

  res.json(blogs);
};

export { getAllBlogs };
