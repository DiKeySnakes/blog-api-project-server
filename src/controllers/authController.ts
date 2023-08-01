import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator';

// @desc Create new user (Sign up)
// @route POST /auth/sign_up
// @access Public
const sign_up = [
  // Validate and sanitize username, email and password fields.
  body('username', 'Username must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .custom(async (value) => {
      const existingUsername = await User.findOne({ username: value });
      if (existingUsername) {
        throw new Error('This username is already in use');
      }
    })
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .custom(async (value) => {
      const existingEmail = await User.findOne({ email: value });
      if (existingEmail) {
        throw new Error('This email is already in use');
      }
    })
    .escape(),
  body(
    'password',
    'Password must contain at least 8 characters, at least 1 lowercase character, at least 1 uppercase character, at least 1 number and at least 1 symbol'
  )
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .escape(),
  body(
    'confirmPassword',
    'Password must contain at least 8 characters, at least 1 lowercase character, at least 1 uppercase character, at least 1 number and at least 1 symbol'
  )
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape(),

  // Process request after validation and sanitization.
  async (req: Request, res: Response) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    // Hash password
    const hashedPwd = await bcrypt.hash(req.body.password, 10); // salt rounds

    // Create a user object with escaped and trimmed data.
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPwd,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({ errors: errors.array() });
      return;
    } else {
      // Data is valid.
      // Save new user.
      await user.save();
      // New user saved.
      return res
        .status(201)
        .json({ message: `New user ${user.username} created` });
    }
  },
];

export { sign_up };
