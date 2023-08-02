import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import {
  getAllUsers,
  updateUserActive,
  updateUserRoles,
} from '../controllers/userController.js';

const router = express.Router();

// @desc Get all users
// @route GET /user/users
// @access Private
router.get('/users', verifyJWT, getAllUsers);

// @desc Update a user active state
// @route PATCH /user/active/:id
// @access Private
router.patch('/active/:id', verifyJWT, updateUserActive);

// @desc Update a user roles array
// @route PATCH /user/roles/:id
// @access Private
router.patch('/roles/:id', verifyJWT, updateUserRoles);

export default router;
