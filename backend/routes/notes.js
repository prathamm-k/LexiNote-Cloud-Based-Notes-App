const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const auth = require('../middleware/auth');

// @route   GET /api/notes
// @desc    Get all notes for the logged-in user
router.get('/', auth, notesController.getNotes);

// @route   POST /api/notes
// @desc    Create a new note
router.post('/', auth, notesController.createNote);

// @route   PUT /api/notes/:id
// @desc    Update a note
router.put('/:id', auth, notesController.updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete a note
router.delete('/:id', auth, notesController.deleteNote);

// Add search by title endpoint
router.get('/search', auth, notesController.searchNotesByTitle);

module.exports = router; 