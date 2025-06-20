const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, default: '' },
  text: { type: String, required: true, maxlength: 10000 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', NoteSchema); 