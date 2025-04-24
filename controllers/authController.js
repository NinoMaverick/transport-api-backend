const User = require('../models/userModel');
const { sendPasswordResetEmail } = require('../utils/email');

const jwt = require('jsonwebtoken');

const signToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    );
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    const newUser = await User.signup({
      name,
      email,
      phoneNumber,
      password,
      role 
    });

    const token = signToken(newUser);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
          walletBalance: newUser.walletBalance,
        }
      }
    });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both email and password',
      });
    }

    const user = await User.login(email, password);

    const token = signToken(user);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err); 
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an email address'
      });
    }

    const user = await User.findOne({ email: req.body.email });
    
    // Always return the same response regardless of whether user exists
    // This prevents user enumeration attacks
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If a user with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

    // 6. Send email (implemented in email.js)
    try {
      await sendPasswordResetEmail(user.email, resetURL);
      
      // 7. Return success response (without the actual URL)
      return res.status(200).json({
        status: 'success',
        message: 'If a user with that email exists, a password reset link has been sent.'
      });
    } catch (err) {
      // 8. Handle email failure
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later.'
      });
    }
  } catch (err) {
    // 9. Global error handling
    next(err);
  }
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000), // expires in 10s
        httpOnly: true,
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' })
};

