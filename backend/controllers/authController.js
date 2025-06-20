const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      if (user.email === email) {
        return res.status(400).json({ msg: 'Email already exists' });
      } else {
        return res.status(400).json({ msg: 'Username already exists' });
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Default avatar: use ui-avatars with username
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=67d7cc&color=fff&size=128`;
    user = new User({ username, email, password: hashedPassword, avatarUrl });
    await user.save();
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be username or email
  try {
    const user = await User.findOne({ $or: [ { email: identifier }, { username: identifier } ] });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 