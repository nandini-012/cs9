import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/* Screens */
import LandingPage       from './components/screens/LandingPage/LandingPage';
import LoginPage         from './components/LoginPage/LoginPage';
import FaqFeed           from './components/screens/FaqFeed/FaqFeed';
import QuestionDetail    from './components/screens/QuestionDetail/QuestionDetail';
import ExpertAnswerForm  from './components/screens/ExpertAnswerForm/ExpertAnswerForm';
import AdminDashboard    from './components/screens/AdminDashboard/AdminDashboard';
import Leaderboard       from './components/screens/Leaderboard/Leaderboard';
import ComingSoon        from './components/screens/ComingSoon/ComingSoon';
import OnboardingFlow    from './components/screens/OnboardingFlow/OnboardingFlow';
import ProtectedRoute    from './components/ProtectedRoute';
import Unauthorized      from './components/Unauthorized';

function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-surface)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <p style={{ color: 'var(--color-text-3)', fontSize: 14 }}>Loading…</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/unauthorized"  element={<Unauthorized />} />
        <Route path="/coming-soon"   element={<ComingSoon />} />

        {/* Protected — any authenticated user */}
        <Route path="/feed"          element={<AuthGuard><FaqFeed /></AuthGuard>} />
        <Route path="/questions/:id" element={<AuthGuard><QuestionDetail /></AuthGuard>} />
        <Route path="/answer-select/:questionId" element={<AuthGuard><ExpertAnswerForm /></AuthGuard>} />
        <Route path="/leaderboard"   element={<AuthGuard><Leaderboard /></AuthGuard>} />
        <Route path="/onboarding"    element={<AuthGuard><OnboardingFlow /></AuthGuard>} />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
