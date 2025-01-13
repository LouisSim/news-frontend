import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './FactDisplay.css';
const BASE_URL = process.env.REACT_APP_API_URL;

const FactDisplay = ({ articles, error, isLoading }) => {
  const [expandedArticleIndex, setExpandedArticleIndex] = useState(null);
  const [additionalData, setAdditionalData] = useState({});
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(false);
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [loadingTopHeadlines, setLoadingTopHeadlines] = useState(true);
  const cache = useRef({});

  useEffect(() => {
    if(isLoading){
      setExpandedArticleIndex(null);
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchTopHeadlines = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/top-headlines`);
        setTopHeadlines(response.data.headlines);
      } catch (err) {
        console.error('Error fetching top headlines:', err);
      } finally {
        setLoadingTopHeadlines(false);
      }
    };

    fetchTopHeadlines();
  }, []);

  const handleToggleExpand = async (index, article) => {
    if (expandedArticleIndex === index) {
      setExpandedArticleIndex(null);
    } else {
      setExpandedArticleIndex(index);
      setLoadingAdditionalData(true);

      const cacheKey = `${article.url}`;
      if (cache.current[cacheKey]) {
        setAdditionalData((prevData) => ({
          ...prevData,
          [index]: cache.current[cacheKey],
        }));
        setLoadingAdditionalData(false);
      } else {
        try {
          const response = await axios.get(`${BASE_URL}/additional-data`, {
            params: {
              articleId: index,
              articleUrl: article.url,
            },
          });
          cache.current[cacheKey] = response.data;
          setAdditionalData((prevData) => ({
            ...prevData,
            [index]: response.data,
          }));
        } catch (err) {
          console.error('Error fetching additional data:', err);
        } finally {
          setLoadingAdditionalData(false);
        }
      }
    }
  };

  if (loadingTopHeadlines) {
    return <div className="no-facts">Loading top headlines...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if ((!articles || articles.length === 0) && !isLoading) {
    return (
      <div className="fact-display">
        <h3>Top Headlines:</h3>
        <ul>
          {topHeadlines.map((article, index) => (
            <li key={index} className="fact-item bullet-color" onClick={() => handleToggleExpand(index, article)}>
              <h4>{article.title}</h4>
              <p className='article-description'>{article.description}</p>
              <div
              className={`expanded-content ${expandedArticleIndex === index ? 'expanded' : ''}`}
              style={{
                maxHeight: expandedArticleIndex === index ? 'none' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              {loadingAdditionalData && expandedArticleIndex === index ? (
                <p>Loading additional information...</p>
              ) : (
                expandedArticleIndex === index && additionalData[index] && (
                  <>
                    <p className='ai-summary'> <div className='add-info-header'>AI Summary:</div> {additionalData[index].summary}</p>
                    <p className='ai-summary'> <div className='add-info-header'>Bias Rating:</div> {additionalData[index].biasRating}</p>
                  </>
                )
              )}
            </div>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read full article
              </a>
              <p>Source: {article.source}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (isLoading) {
    return <div className="no-facts">Loading...</div>;
  }

  return (
    <div className="fact-display">
      <h3>Articles:</h3>
      <ul>
        {articles.map((article, index) => (
          <li key={index} className="fact-item bullet-color" onClick={() => handleToggleExpand(index, article)}>
            <h4>{article.title}</h4>
            <p className='article-description'>{article.description}</p>

            <div
              className={`expanded-content ${expandedArticleIndex === index ? 'expanded' : ''}`}
              style={{
                maxHeight: expandedArticleIndex === index ? 'none' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              {loadingAdditionalData && expandedArticleIndex === index ? (
                <p>Loading additional information...</p>
              ) : (
                expandedArticleIndex === index && additionalData[index] && (
                  <>
                    <p className='ai-summary'> <div className='add-info-header'>AI Summary:</div> {additionalData[index].summary}</p>
                    <p className='ai-summary'> <div className='add-info-header'>Bias Rating:</div> {additionalData[index].biasRating}</p>
                  </>
                )
              )}
            </div>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read full article
            </a>
            <p>Source: {article.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FactDisplay;
