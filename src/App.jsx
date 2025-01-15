import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { fetchFacts } from './api';
import SearchBar from './components/SearchBar';
import FactDisplay from './components/FactDisplay';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setIsConnected(false);
        await axios.get(`${process.env.REACT_APP_API_URL}/health`);
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);


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
      <div className={`connection-status ${isConnected ? 'connected' : ''}`}></div>
      <h1 ><span class="highlighted-letter">N</span>ews<span class="highlighted-letter">B</span>yte</h1>
      <SearchBar onSearch={handleSearch} />
      <FactDisplay articles={articles} error={error} isLoading={isLoading}/>
    </div>
  );
};

export default App;
