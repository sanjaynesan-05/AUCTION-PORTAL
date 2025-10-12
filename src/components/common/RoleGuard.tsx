import { Navigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { ReactNode } from 'react';

interface RoleGuardProps {
  allowed: string[];
  children: ReactNode;
}

export default function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { role } = useRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
