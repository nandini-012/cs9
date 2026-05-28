import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

// Landing (public)
import { LandingPage } from '../pages/landing'
import { FAQPage } from '../pages/landing'

// User (authenticated)
import { Dashboard } from '../pages/user'
import { RaiseQuery } from '../pages/user'
import { RaiseQueryView } from '../pages/user'
import { TrackQuery } from '../pages/user'
import { StudentDashboard } from '../pages/user'
import { ProfileSettingsView } from '../pages/user'
import { QueryDetailView } from '../pages/user'

// Admin (admin role)
import { AdminDashboard } from '../pages/admin'
import { AdminQueryReview } from '../pages/admin'
import { FAQManagementView } from '../pages/admin'
import { QueriesManagementView } from '../pages/admin'
import { SpurtiManagementView } from '../pages/admin'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/faq" element={<FAQPage />} />

      {/* Student routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/raise-query"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <RaiseQuery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/track-query"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <TrackQuery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <ProfileSettingsView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/query/:id"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <QueryDetailView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/raise-query-view"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <RaiseQueryView />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/review/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminQueryReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faq"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <FAQManagementView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/queries"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <QueriesManagementView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/spurti"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SpurtiManagementView />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes