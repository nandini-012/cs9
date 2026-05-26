import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Topbar from '../../Topbar/Topbar';
import QuestionCard from './QuestionCard';
import Sidebar from './Sidebar';
import AskQuestionModal from '../AskQuestionModal/AskQuestionModal';
import { MOCK_QUESTIONS } from '../../../data/mockData';

const TABS = ['All', 'Unanswered', 'My Questions', 'Trending'];

export default function FaqFeed() {
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('q') || '';

  const [activeTab,           setActiveTab]           = useState('All');
  const [selectedCategories,  setSelectedCategories]  = useState([]);
  const [questions,           setQuestions]           = useState(MOCK_QUESTIONS);
  const [askOpen,             setAskOpen]             = useState(false);

  const filtered = useMemo(() => {
    let list = [...questions];

    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(q2 =>
        q2.title.toLowerCase().includes(q) ||
        q2.body.toLowerCase().includes(q) ||
        q2.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (activeTab === 'Unanswered') list = list.filter(q => q.status === 'unanswered');
    if (activeTab === 'Trending')   list = list.sort((a, b) => b.upvotes - a.upvotes);

    if (selectedCategories.length > 0)
      list = list.filter(q => selectedCategories.includes(q.category));

    return list;
  }, [questions, activeTab, selectedCategories, searchQ]);

  const handleNewQuestion = (q) => {
    setQuestions(prev => [q, ...prev]);
  };

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-surface)' }}>
      <Topbar onAskQuestion={() => setAskOpen(true)} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px' }}>
        {searchQ && (
          <p style={{ marginBottom: 16, color: 'var(--color-text-2)', fontSize: 14 }}>
            Showing results for <strong>"{searchQ}"</strong>
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* Left — Question list */}
          <div>
            {/* Filter tabs */}
            <div style={{
              display: 'flex', gap: 2, marginBottom: 16,
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 10, padding: 4,
              width: 'fit-content',
            }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 16px', borderRadius: 7, border: 'none',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === tab ? '#fff' : 'var(--color-text-2)',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Question cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 24px',
                  color: 'var(--color-text-3)', background: 'var(--color-bg)',
                  borderRadius: 10, border: '1px solid var(--color-border)',
                }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
                  <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No questions found</p>
                  <p style={{ fontSize: 13 }}>Try different filters or be the first to ask!</p>
                </div>
              ) : (
                filtered.map(q => (
                  <QuestionCard key={q.id} question={q} />
                ))
              )}
            </div>
          </div>

          {/* Right — Sidebar */}
          <Sidebar
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        </div>
      </div>

      {/* Ask a Question modal */}
      {askOpen && (
        <AskQuestionModal
          onClose={() => setAskOpen(false)}
          onSubmit={handleNewQuestion}
        />
      )}
    </div>
  );
}
