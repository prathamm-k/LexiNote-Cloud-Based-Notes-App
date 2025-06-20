import React, { useState, useEffect } from 'react';
import Note from './Note';
import AddNote from './AddNote';

const MAX_LENGTH = 10000;

const NotesList = ({ notes, handleAddNote, handleDeleteNote, handleUpdateNote }) => {
  const [modalState, setModalState] = useState({ open: false, mode: null, note: null });
  const [modalText, setModalText] = useState('');
  const [modalError, setModalError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Open modal for new note
  const handleAddNoteModal = () => {
    setModalState({ open: true, mode: 'create', note: null });
    setModalText('');
    setModalError('');
    setIsEditing(true);
  };

  // Open modal for viewing note
  const handleViewNote = (note) => {
    setModalState({ open: true, mode: 'edit', note });
    setModalText(note.text);
    setModalError('');
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setModalState({ open: false, mode: null, note: null });
    setModalText('');
    setModalError('');
    setIsEditing(false);
  };

  useEffect(() => {
    if (!modalState.open) setIsEditing(false);
  }, [modalState.open]);

  const handleModalSave = () => {
    if (!modalText.trim()) {
      setModalError('Note cannot be empty');
      return;
    }
    if (modalText.length > MAX_LENGTH) {
      setModalError('Note is too long');
      return;
    }
    if (modalState.mode === 'create') {
      handleAddNote(modalText);
    } else if (modalState.mode === 'edit' && modalState.note) {
      handleUpdateNote(modalState.note.id || modalState.note._id, modalText);
    }
    handleCloseModal();
  };

  // For modal display
  const modalTitle = modalText.split('\n')[0] || (modalState.mode === 'create' ? 'New Note' : '');
  const modalBodyLines = modalText.split('\n').slice(1);

  return (
    <>
      <div className='notes-list'>
        <AddNote onAddNoteModal={handleAddNoteModal} />
        {notes.map((note) => (
          <Note
            key={note._id}
            id={note._id}
            text={note.text}
            date={note.date}
            title={note.title}
            handleDeleteNote={handleDeleteNote}
            onViewNote={handleViewNote}
          />
        ))}
      </div>
      {modalState.open && (
        <div className="note-modal-overlay" onClick={handleCloseModal}>
          <div className="note-modal" onClick={e => e.stopPropagation()}>
            <button className="note-modal-close" onClick={handleCloseModal}>&times;</button>
            <div className="note-modal-title">
              <strong>{modalTitle}</strong>
            </div>
            {!isEditing ? (
              <>
                <div className="note-modal-body" style={{ marginBottom: '1.5em' }}>
                  {modalBodyLines.length > 0
                    ? modalBodyLines.map((line, idx) => <div key={idx}>{line}</div>)
                    : <span style={{ color: '#888' }}>[No content]</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1em' }}>
                  <button className="primary-btn" onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  className="note-modal-textarea"
                  value={modalText}
                  onChange={e => setModalText(e.target.value)}
                  rows={12}
                  maxLength={MAX_LENGTH}
                  placeholder="Type your note here..."
                  style={{ width: '96%', minHeight: 180, fontSize: '1.1em', marginBottom: '1em', borderRadius: 8, border: '1px solid #eafaf8', padding: '1em', background: 'inherit', color: 'inherit', resize: 'vertical', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1em' }}>
                  <small>{modalText.length} / {MAX_LENGTH}</small>
                  <div style={{ display: 'flex', gap: '1em' }}>
                    <button className="primary-btn" onClick={handleModalSave}>
                      Save
                    </button>
                    <button className="primary-btn" style={{ background: '#eafaf8', color: '#67d7cc' }} onClick={() => { setIsEditing(false); setModalText(modalState.note ? modalState.note.text : ''); }}>
                      Cancel
                    </button>
                  </div>
                </div>
                {modalError && <div className="error-msg">{modalError}</div>}
              </>
            )}
            {modalState.mode === 'edit' && (
              <div className="note-modal-footer">
                <small>{modalState.note.date && (typeof modalState.note.date === 'string' ? modalState.note.date.slice(0, 10) : modalState.note.date)}</small>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default NotesList;