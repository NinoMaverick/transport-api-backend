const user = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (user) = {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    );
};

exports.signup = async (req, res) => {
    const user = await User.create(req.body);
    const token = signToken(user._id, user.role);
    res.status(201).json({ status: 'success', token, data: { user } });
};

exports.login = async (req, res) => {
    const user = await User.findOne({ email }).select('+password');
    const token = signToken(user._id, user.role);
    res.status(200).json({ status: 'success', token });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1. Input validation
    if (!req.body.email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an email address'
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: req.body.email });
    
    // 3. Always return the same response regardless of whether user exists
    // This prevents user enumeration attacks
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If a user with that email exists, a password reset link has been sent.'
      });
    }

    // 4. Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 5. Create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

    // 6. Send email (implement this function elsewhere)
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

