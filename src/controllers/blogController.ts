import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import { Request, Response, NextFunction } from 'express';
import { body, Result, validationResult } from 'express-validator';

// @desc Get all published blogs
// @route GET /blog/blogs_all
// @access Public
const getAllBlogs = async (req: Request, res: Response) => {
  // Get all published blogs from MongoDB excluding content fields and comments arrays
  const blogs = await Blog.find({ published: true })
    .select('-content -comments')
    .sort({ createdAt: -1 })
    .exec();

  // If no published blogs
  if (!blogs?.length) {
    return res.status(400).json({ message: 'No published blogs found' });
  }

  res.json(blogs);
};

// @desc Display detail page for a specific blog
// @route GET /blog/:id
// @access Public
const getDetailedBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get details of a blog.

  const [blog, comments] = await Promise.all([
    Blog.findById(req.params.id).exec(),
    Comment.find({ blog: req.params.id }).populate('user').exec(),
  ]);

  if (blog === null) {
    // No results.
    const err = new Error('Blog not found');
    return next(err);
  }

  res.json({ blog: blog, comments: comments });
};

// @desc Create new blog
// @route POST /blog/create_blog
// @access Private
const createNewBlog = [
  // Validate and sanitize title, description and content fields.
  body('title', 'Blog title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .custom(async (value) => {
      const existingTitle = await Blog.findOne({ title: value });
      if (existingTitle) {
        throw new Error('This title is already in use');
      }
    })
    .escape(),
  body('description', 'Blog description must contain at least 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('content', 'Blog content must contain at least 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),

  // Process request after validation and sanitization.
  async (req: Request, res: Response) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    // Create a blog object with escaped and trimmed data.
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({ errors: errors.array() });
      return;
    } else {
      // Data is valid.
      // Save new blog.
      await blog.save();
      // New blog saved.
      return res.status(201).json({ message: 'New blog created' });
    }
  },
];

// @desc Update a blog
// @route PATCH /blog/update/:id
// @access Private
const updateBlog = [
  // Validate and sanitize title, description and content fields.
  body('title', 'Blog title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Blog description must contain at least 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('content', 'Blog content must contain at least 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),

  // Process request after validation and sanitization.
  async (req: Request, res: Response) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    // Confirm blog exists to update
    const blogToUpdate = await Blog.findById(req.params.id).exec();

    if (!blogToUpdate) {
      return res.status(400).json({ message: 'Blog not found' });
    }

    // Create a blog object with escaped and trimmed data (and the old id!)
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      comments: blogToUpdate.comments,
      published: blogToUpdate.published,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({ errors: errors.array() });
      return;
    } else {
      // Data is valid.
      // Update blog.
      await Blog.findByIdAndUpdate(req.params.id, blog, {});
      return res.json({ message: `${blog.title} updated` });
    }
  },
];

// @desc Publish a blog
// @route PATCH /blog/publish/:id
// @access Private
const publishBlog = async (req: Request, res: Response) => {
  // Confirm blog exists to publish
  const blogToPublish = await Blog.findById(req.params.id).exec();

  if (!blogToPublish) {
    return res.status(400).json({ message: 'Blog not found' });
  }

  // Create a blog object with reversed published property (and the old id!)
  const blog = new Blog({
    title: blogToPublish.title,
    description: blogToPublish.description,
    content: blogToPublish.content,
    comments: blogToPublish.comments,
    published: !blogToPublish.published,
    _id: req.params.id,
  });
  // Update published property.
  await Blog.findByIdAndUpdate(req.params.id, blog, {});
  return res.json({ message: `Publish property of ${blog.title} updated` });
};

export { getAllBlogs, getDetailedBlog, createNewBlog, updateBlog, publishBlog };
