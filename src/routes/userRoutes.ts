import express from 'express';
import verifyJWT from '../middleware/verifyJWT.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  getAllUsers,
  updateUserActive,
  updateUserRoles,
} from '../controllers/userController.js';

const router = express.Router();

// @desc Get all users
// @route GET /user/users
// @access Private Admin
router.get('/users', verifyJWT, isAdmin, getAllUsers);

// @desc Update a user active state
// @route PATCH /user/active/:id
// @access Private Admin
router.patch('/active/:id', verifyJWT, isAdmin, updateUserActive);

// @desc Update a user roles array
// @route PATCH /user/roles/:id
// @access Private Admin
router.patch('/roles/:id', verifyJWT, isAdmin, updateUserRoles);

export default router;
