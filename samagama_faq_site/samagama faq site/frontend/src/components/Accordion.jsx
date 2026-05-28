import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export default function Accordion({ faq, isOpen, onToggle, searchQuery }) {
  // Safe highlighting for HTML content (matches search term only outside HTML tags)
  const getHighlightedContent = (html, query) => {
    if (!query || !query.trim()) return html;
    
    // Escape regex characters
    const escapedQuery = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    // Match the query string only if it is outside HTML tags (not inside <...>)
    const regex = new RegExp(`(?![^<>]*>)(${escapedQuery})`, 'gi');
    return html.replace(regex, '<mark class="highlight">$1</mark>');
  };

  const getHighlightedText = (text, query) => {
    if (!query || !query.trim()) return text;
    const escapedQuery = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="highlight">{part}</mark> 
        : part
    );
  };

  return (
    <div className={`faq-accordion glass-card ${isOpen ? 'open' : ''}`} id={faq.id}>
      <div className="accordion-trigger-row">
        <button className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
          <span className="accordion-question">
            {getHighlightedText(faq.question, searchQuery)}
          </span>
        </button>
        <div className="accordion-actions">
          <button className="btn-chevron" onClick={onToggle} aria-label={isOpen ? 'Collapse question' : 'Expand question'} aria-expanded={isOpen}>
            <ChevronDown className="chevron-icon" size={18} />
          </button>
        </div>
      </div>
      
      <div className="accordion-content-wrap">
        <div className="accordion-content">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: getHighlightedContent(faq.answer, searchQuery) 
            }}
          />
        </div>
      </div>
    </div>
  );
}
