import React from 'react';

const AddNote = ({ onAddNoteModal }) => {
  return (
    <div className="note new add-note-trigger" onClick={onAddNoteModal} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 170 }}>
      <span style={{ color: '#67d7cc', fontWeight: 700, fontSize: '1.2em' }}>+ Add Note</span>
    </div>
  );
};

export default AddNote;