import React from 'react';
import ReactMarkdown from 'react-markdown';

const ArticleCard = ({ article, onClick }) => {
  const isEnhanced = article.is_updated;
  const hasReferences = article.references && article.references.length > 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExcerpt = (content) => {
    if (article.excerpt) return article.excerpt;
    
    // Remove markdown and get first 150 characters
    const plainText = content
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~`]/g, '')
      .trim();
    
    return plainText.substring(0, 150) + '...';
  };

  return (
    <div className="article-card" onClick={onClick}>
      <div className="article-card-header">
        <span className={`article-status ${isEnhanced ? 'status-enhanced' : 'status-original'}`}>
          {isEnhanced ? '✨ Enhanced' : '📄 Original'}
        </span>
        <h3>{article.title}</h3>
        <div className="article-meta">
          <span>📅 {formatDate(article.created_at)}</span>
          {isEnhanced && <span>🔄 Updated: {formatDate(article.updated_at)}</span>}
        </div>
      </div>
      
      <div className="article-card-body">
        <p className="article-excerpt">
          {getExcerpt(article.content)}
        </p>
        
        {hasReferences && (
          <div className="article-references">
            📚 {article.references.length} reference{article.references.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div className="article-card-footer">
        <button className="read-more-btn">
          Read Full Article →
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
