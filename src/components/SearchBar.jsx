import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const [dateRange, setDateRange] = useState('last_3_days');
  const [reputable, setReputable] = useState(false);

  const handleSearch = () => {
    if (input.trim()) {
      onSearch(input, dateRange, reputable);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter a news topic..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className="search-input"
      />
      
      <button onClick={handleSearch} className="search-button">Search</button>
      <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-range-select">
        <option value="last_3_days">Last 3 days</option>
        <option value="last_week">Last week</option>
        <option value="last_month">Last month</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={reputable}
          onChange={(e) => setReputable(e.target.checked)}
        />
        <span className='reputable-sources-tag'>Limit to reputable sources</span>
      </label>
    </div>
  );
};

export default SearchBar;
