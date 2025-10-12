import { Routes, Route, Navigate } from 'react-router-dom';
import RoleGuard from '../components/common/RoleGuard';
import Login from '../pages/Login';
import AdminPanel from '../pages/AdminPanel';
import PresenterPanel from '../pages/PresenterPanel';
import ViewerScreen from '../pages/ViewerScreen';
import Unauthorized from '../pages/Unauthorized';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RoleGuard allowed={['Admin']}>
            <AdminPanel />
          </RoleGuard>
        }
      />
      <Route
        path="/presenter"
        element={
          <RoleGuard allowed={['Presenter']}>
            <PresenterPanel />
          </RoleGuard>
        }
      />
      <Route
        path="/viewer"
        element={
          <RoleGuard allowed={['Viewer']}>
            <ViewerScreen />
          </RoleGuard>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
