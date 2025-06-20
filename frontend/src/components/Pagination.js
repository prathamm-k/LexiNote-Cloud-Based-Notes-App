import React from 'react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="pagination">
      {[...Array(pages).keys()].map((p) => (
        <button
          key={p + 1}
          className={`pagination-btn ${p + 1 === page ? 'active' : ''}`}
          onClick={() => onPageChange(p + 1)}
        >
          {p + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination; 