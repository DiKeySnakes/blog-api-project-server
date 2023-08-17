import User from '../models/user.js';
import { Request, Response } from 'express';

// @desc Get all users
// @route GET /user/users
// @access Private Admin
const getAllUsers = async (req: Request, res: Response) => {
  // Get all users from MongoDB
  const users = await User.find().select('-password').lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' });
  }

  res.json(users);
};

// @desc Update a user active state
// @route PATCH /user/active/:id
// @access Private Admin
const updateUserActive = async (req: Request, res: Response) => {
  // Confirm user exists to update
  const userToUpdate = await User.findById(req.params.id).exec();

  if (!userToUpdate) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Create a user object with reversed active property (and the old id!)
  const user = new User({
    username: userToUpdate.username,
    email: userToUpdate.email,
    password: userToUpdate.password,
    roles: userToUpdate.roles,
    active: !userToUpdate.active,
    _id: req.params.id,
  });
  // Update active property.
  await User.findByIdAndUpdate(req.params.id, user, {});
  return res.json({ message: `Active property of ${user.username} updated` });
};

// @desc Update a user roles array
// @route PATCH /user/roles/:id
// @access Private Admin
const updateUserRoles = async (req: Request, res: Response) => {
  const roles = req.body.roles;

  // Confirm data
  if (!Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'Add roles! User, Admin or both' });
  }

  // Confirm user exists to update
  const userToUpdate = await User.findById(req.params.id).exec();

  if (!userToUpdate) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Create a user object with new roles array (and the old id!)
  const user = new User({
    username: userToUpdate.username,
    email: userToUpdate.email,
    password: userToUpdate.password,
    roles: roles,
    active: userToUpdate.active,
    _id: req.params.id,
  });
  // Update roles array.
  await User.findByIdAndUpdate(req.params.id, user, {});
  return res.json({ message: `Roles array of ${user.username} updated` });
};

export { getAllUsers, updateUserActive, updateUserRoles };
