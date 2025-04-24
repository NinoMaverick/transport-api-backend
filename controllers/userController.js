const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
try {
    const users = await User.find();
    if(!users) {
        return res.status(404).json({ status: 'fail', message: 'No users found' });   
    }
    res.status(200).json({ status: 'success', data: users });
} catch (error) {
    console.error(error);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.',
    });
} 
};

// @desc    Get a single user by ID
// @route   GET /api/v1/users/:id
// @access  Admin or logged-in user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong. Please try again later.',
        });
      }
};

// @desc    Update user data (admin or self)
// @route   PATCH /api/v1/users/:id
// @access  Admin or logged-in user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true, // Ensure validators run on updated fields
        });
        if (!user) {
          return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong. Please try again later.',
        });
      }
};

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
          return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(204).json({ status: 'success', message: 'User deleted' });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong. Please try again later.',
        });
      }
};

// @desc    Update current user info (excluding password/role)
// @route   PATCH /api/v1/users/updateMe
// @access  Logged-in user
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create an error if the user tries to update password or role
  if (req.body.password || req.body.role) {
    return next(new AppError('You are not allowed to change password or role here.', 400));
  }

  // 2. Update user document except password and role fields
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, // Logged-in user's ID
    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    },
    {
      new: true, // Return updated document
      runValidators: true, // Validate the data
    }
  );

  // 3. If user not found, return error
  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  // 4. Send response with updated user data
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
