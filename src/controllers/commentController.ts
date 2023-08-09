import Blog from '../models/blog.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';
import { Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';

// @desc Create new comment
// @route POST /comment/create/:id
// @access Private
const createNewComment = [
  // Validate and sanitize content field.
  body('content', 'Comment must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  async (req: Request, res: Response) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    const username = req.body.user;

    const blog = req.params.id;

    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser || !foundUser.active) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create a blog object with escaped and trimmed data.
    const comment = new Comment({
      content: req.body.content,
      blog: blog,
      user: foundUser._id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.status(400).json({ errors: errors.array() });
      return;
    } else {
      // Data is valid.
      // Save new comment.
      await comment.save();
      // New comment saved.
      // Push comment into blog's comments array.
      await Blog.findOneAndUpdate(
        { _id: blog },
        { $push: { comments: comment } }
      );
      return res
        .status(200)
        .json({ message: 'Comment was added successfully' });
    }
  },
];

// @desc Delete comment
// @route DELETE /comment/delete/:id
// @access Private Admin
const deleteComment = async (req: Request, res: Response) => {
  const commentToDelete = await Comment.findById(req.params.id);
  if (!commentToDelete)
    return res.status(400).json({ message: 'Comment not found' });

  // Delete comment
  await Comment.findByIdAndDelete(req.params.id);

  // Comment deleted
  // Pull deleted comment from blog's comments array.

  await Blog.findByIdAndUpdate(commentToDelete.blog, {
    $pull: { comments: req.params.id },
  });
  return res.json({ message: 'Comment was successfully deleted' });
};

export { createNewComment, deleteComment };
