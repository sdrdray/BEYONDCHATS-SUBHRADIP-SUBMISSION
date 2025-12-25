import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ArticleModal = ({ article, onClose }) => {
  const isEnhanced = article.is_updated;
  const hasReferences = article.references && article.references.length > 0;

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px' }}>
              <span className={`article-status ${isEnhanced ? 'status-enhanced' : 'status-original'}`}>
                {isEnhanced ? '✨ Enhanced Article' : '📄 Original Article'}
              </span>
            </div>
            <h2>{article.title}</h2>
            <div className="article-meta" style={{ marginTop: '12px' }}>
              <span>📅 Published: {formatDate(article.created_at)}</span>
              {isEnhanced && (
                <span>🔄 Enhanced: {formatDate(article.updated_at)}</span>
              )}
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="article-content">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {hasReferences && (
            <div style={{ 
              marginTop: '32px', 
              padding: '20px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              borderLeft: '4px solid #2563eb'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>
                📚 References
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {article.references.map((ref, index) => (
                  <li key={index} style={{ marginBottom: '12px' }}>
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#2563eb', 
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {index + 1}. {ref.title || ref.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.original_content && article.original_content !== article.content && (
            <details style={{ 
              marginTop: '32px', 
              padding: '20px', 
              backgroundColor: '#fffbeb', 
              borderRadius: '8px',
              border: '1px solid #fcd34d'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '600', 
                marginBottom: '16px',
                fontSize: '16px'
              }}>
                📜 View Original Content
              </summary>
              <div className="article-content">
                <ReactMarkdown>{article.original_content}</ReactMarkdown>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
