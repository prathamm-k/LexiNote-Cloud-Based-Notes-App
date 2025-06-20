const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  avatarUrl: { type: String, default: 'https://ui-avatars.com/api/?name=User&background=67d7cc&color=fff&size=128' },
});

module.exports = mongoose.model('User', UserSchema); 