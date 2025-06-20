import React from 'react';
import { MdDeleteForever } from 'react-icons/md';

const Note = ({ id, text, date, handleDeleteNote, onViewNote, title }) => {
  // Split text for display
  const [displayTitle, ...bodyLines] = (title ? [title, ...text.split('\n').slice(1)] : text.split('\n'));
  const body = bodyLines.join(' ');
  const truncatedBody = body.length > 120 ? body.slice(0, 120) + '...' : body;

  return (
    <div className="note" onClick={() => onViewNote && onViewNote({ id, title: displayTitle, text, date })} style={{ cursor: 'pointer' }}>
      <div className="note-title"><strong>{displayTitle}</strong></div>
      <div className="note-body">{truncatedBody}</div>
      <div className="note-footer">
        <small>{date && (typeof date === 'string' ? date.slice(0, 10) : date)}</small>
        <MdDeleteForever
          onClick={e => { e.stopPropagation(); handleDeleteNote(id); }}
          className="delete-icon"
          size="1.3em"
        />
      </div>
    </div>
  );
};

export default Note;