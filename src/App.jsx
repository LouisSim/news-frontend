import React, { useState } from 'react';
import { fetchFacts } from './api';
import SearchBar from './components/SearchBar';
import FactDisplay from './components/FactDisplay';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const handleSearch = async (topic, dateRange, reputable) => {
    setArticles([]);
    setError(null);
    setisLoading(true);
    try {
      const data = await fetchFacts(topic, dateRange, reputable);
      setArticles(data.articles);
      setisLoading(false);
    } catch (err) {
      setError('Unable to fetch facts. Please try again.');
    }
  };

  return (
    <div>
      <h1 >NewsByte</h1>
      <SearchBar onSearch={handleSearch} />
      <FactDisplay articles={articles} error={error} isLoading={isLoading}/>
    </div>
  );
};

export default App;
