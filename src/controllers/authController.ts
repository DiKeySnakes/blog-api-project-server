import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt, { VerifyErrors, Jwt, JwtPayload } from 'jsonwebtoken';
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
    }),
  // .escape(), // applies the HTML style entities to the values
  body('email')
    .trim()
    .isEmail()
    .custom(async (value) => {
      const existingEmail = await User.findOne({ email: value });
      if (existingEmail) {
        throw new Error('This email is already in use');
      }
    }),
  // .escape(), // applies the HTML style entities to the values
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
    }),
  // .escape(), // applies the HTML style entities to the values
  body('confirmPassword', 'Passwords do not match!')
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
    }),
  // .escape(), // applies the HTML style entities to the values

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
      res.status(400).json({ errors: errors.array() });
      return;
    } else {
      // Data is valid.
      // Save new user.
      await user.save();
      // New user saved.
      return res
        .status(200)
        .json({ message: `New user ${user.username} created` });
    }
  },
];

// @desc Login
// @route POST /auth/login
// @access Public
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: 'Unauthorized' });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'none', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req: Request, res: Response) => {
  const cookies = req.cookies;

  interface IJWTPayload {
    username: string;
  }

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    async (
      err: VerifyErrors | null,
      decoded: string | Jwt | JwtPayload | undefined
    ) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const payload = decoded as IJWTPayload;

      const foundUser = await User.findOne({
        username: payload.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '15m' }
      );

      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  res.json({ message: 'Cookie cleared' });
};

export { sign_up, login, refresh, logout };
