const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile (email, username)
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    if (req.body.username && req.body.username !== user.username) {
      // Check for unique username
      const existing = await User.findOne({ username: req.body.username });
      if (existing) {
        res.status(400);
        throw new Error('Username already exists');
      }
      user.username = req.body.username;
    }
    user.email = req.body.email || user.email;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (user && (await bcrypt.compare(currentPassword, user.password))) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401);
    throw new Error('Invalid current password');
  }
});

// @desc    Upload user avatar
// @route   POST /api/user/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  // Save the file path as the avatarUrl (assuming /uploads is served statically)
  user.avatarUrl = `/uploads/${req.file.filename}`;
  await user.save();
  res.json({ avatarUrl: user.avatarUrl });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  uploadAvatar,
}; 