import React, { useState, useEffect } from 'react';
import ArticleCard from './components/ArticleCard';
import ArticleModal from './components/ArticleModal';
import { articleAPI } from './services/api';
import './index.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState('all'); // all, original, enhanced

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredArticles(articles);
    } else if (filter === 'original') {
      setFilteredArticles(articles.filter(article => !article.is_updated));
    } else if (filter === 'enhanced') {
      setFilteredArticles(articles.filter(article => article.is_updated));
    }
  }, [articles, filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleAPI.getAllArticles(1, 50);
      
      if (response.success) {
        setArticles(response.data.data || response.data);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (err) {
      setError(err.message || 'Failed to load articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };



  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>📰 BeyondChats Articles</h1>
          <p>Explore original and AI-enhanced articles</p>
        </div>
      </header>

      <main className="container">
        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="filter">Filter by:</label>
            <select 
              id="filter"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Articles ({articles.length})</option>
              <option value="original">
                Original Only ({articles.filter(a => !a.is_updated).length})
              </option>
              <option value="enhanced">
                Enhanced Only ({articles.filter(a => a.is_updated).length})
              </option>
            </select>
          </div>
          
          <button 
            onClick={fetchArticles}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <>
            {filteredArticles.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ marginBottom: '8px' }}>No articles found</h3>
                <p>Try adjusting your filters or add some articles first.</p>
              </div>
            ) : (
              <div className="article-grid">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => handleArticleClick(article)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
