import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import './FloatingChat.css';

interface FloatingChatProps {
  userEmail?: string | null;
  apiBaseUrl?: string;
}

export default function FloatingChat({ userEmail, apiBaseUrl = 'http://localhost:5000' }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'Yaksha-mini',
      text: 'Welcome! I am Yaksha-mini, your AI assistant. You can ask me any question about the Vicharanashala internship. Try clicking one of the common topics below!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'What is Rosetta?',
    'What dates to put on NOC?',
    'Is there a stipend?',
    'How do I register for ViBe?',
    'Can I start late?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text || !text.trim()) return;

    const userMsg = { sender: 'student', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const email = userEmail || 'guest@example.com';
      const res = await fetch(`${apiBaseUrl}/api/intern/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, message: text })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { sender: 'Yaksha-mini', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { sender: 'Yaksha-mini', text: `Sorry, I encountered an error: ${data.message || 'Unknown error'}` }]);
      }
    } catch {
      setMessages(prev => [...prev, { sender: 'Yaksha-mini', text: 'Connection error. Please check if the backend server is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <button className={`ym-launcher ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Open Yaksha-mini chat">
        <span className="ym-launcher-tooltip">Ask Yaksha-mini</span>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <section className={`yaksha-mini-panel glass-card ${isOpen ? 'open' : ''}`} aria-label="Yaksha-mini chat panel">
        <div className="ym-header">
          <div className="ym-brand">
            <div className="ym-avatar"><Sparkles size={16} /></div>
            <div className="ym-titles">
              <span className="ym-title">Yaksha-mini</span>
              <span className="ym-subtitle">
                <span className="ym-online-dot"></span>
                Answers from this site
              </span>
            </div>
          </div>
          <button className="ym-close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
        </div>

        <div className="ym-chat-log">
          {messages.map((msg, index) => (
            <div key={index} className={`ym-message-wrap ${msg.sender === 'student' ? 'user' : 'bot'}`}>
              <div className="ym-message">
                <div className="ym-message-text" dangerouslySetInnerHTML={{
                  __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ym-message-wrap bot">
              <div className="ym-message typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ym-suggestions">
          <div className="suggestions-scroll">
            {suggestionChips.map((chip, index) => (
              <button key={index} className="suggestion-chip" onClick={() => handleSend(chip)} disabled={isLoading}>{chip}</button>
            ))}
          </div>
        </div>

        <div className="ym-footer-form">
          <div className="ym-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a question or #command..."
              disabled={isLoading}
            />
            <button className="btn-send" onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
              <Send size={16} />
            </button>
          </div>
          <p className="ym-note">
            {!userEmail && "💡 Sign in to use tags: #vibe-email, #exemption, #escalate."}
            {userEmail && "Commands: #vibe-email <gmail>, #exemption, #escalate <query>"}
          </p>
        </div>
      </section>
    </>
  );
}