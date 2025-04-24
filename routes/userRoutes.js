const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
// Protected
router
  .route('/')
  .get(authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.getAllUsers); // Admin only

router
  .route('/:id')
  .get(authMiddleware.protect, userController.getUser)
  .patch(authMiddleware.protect, userController.updateUser)
  .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), userController.deleteUser);

// Logged-in user routes
router
  .patch('/updateMe', authMiddleware.protect, userController.updateMe);

module.exports = router;

