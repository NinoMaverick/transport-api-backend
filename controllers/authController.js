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

