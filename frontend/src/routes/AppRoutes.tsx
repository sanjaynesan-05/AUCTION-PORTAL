import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RoleGuard from '../components/common/RoleGuard';
import { LoadingSpinner } from '../components/Loading';

// Lazy load components for better performance
const Login = lazy(() => import('../pages/Login'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const PresenterPanel = lazy(() => import('../pages/PresenterPanel'));
const ViewerScreen = lazy(() => import('../pages/ViewerScreen'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RoleGuard allowed={['admin']}>
              <AdminPanel />
            </RoleGuard>
          }
        />
        <Route
          path="/presenter"
          element={
            <RoleGuard allowed={['presenter']}>
              <PresenterPanel />
            </RoleGuard>
          }
        />
        <Route
          path="/viewer"
          element={
            <RoleGuard allowed={['viewer']}>
              <ViewerScreen />
            </RoleGuard>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
