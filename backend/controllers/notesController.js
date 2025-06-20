const Note = require('../models/Note');

function extractTitle(text) {
  if (!text) return '';
  return text.split('\n')[0].slice(0, 120); // limit title length for safety
}

exports.getNotes = async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const count = await Note.countDocuments({ user: req.user.id });
    const notes = await Note.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({ notes, page, pages: Math.ceil(count / pageSize) });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createNote = async (req, res) => {
  const { text } = req.body;
  try {
    const title = extractTitle(text);
    const note = new Note({ user: req.user.id, text, title });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateNote = async (req, res) => {
  const { text } = req.body;
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    note.text = text;
    note.title = extractTitle(text);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Note.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Search notes by title (case-insensitive, partial match)
exports.searchNotesByTitle = async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ msg: 'Title query parameter is required' });
  }
  try {
    const notes = await Note.find({
      user: req.user.id,
      title: { $regex: title, $options: 'i' },
    }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 