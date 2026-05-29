import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FAQPage from './pages/FAQPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<FAQPage onLogin={(userData) => setUser(userData)} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            user && user.role === 'student' 
              ? <StudentDashboard user={user} onLogout={() => setUser(null)} /> 
              : <Navigate to="/" />
          } 
        />
        <Route 
          path="/admin" 
          element={<AdminDashboard user={user} onLogout={() => setUser(null)} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
