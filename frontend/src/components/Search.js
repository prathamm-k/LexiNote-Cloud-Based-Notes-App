import React from 'react';
import {MdSearch} from 'react-icons/md';
const Search = ({ handleSearchNote }) => {
  return (
  <div className="search" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
    <MdSearch className="search-icons" size="1.3em" style={{ flexShrink: 0 }} />
    <input
      onChange={event => handleSearchNote(event.target.value)}
      type="text"
      placeholder="type to search"
      style={{ flex: 1, marginLeft: '0.7em', minWidth: 0 }}
    />
  </div>
  );
};
export default Search;