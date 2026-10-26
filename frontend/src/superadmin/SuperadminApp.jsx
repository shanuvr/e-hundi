import { Routes, Route, Navigate } from 'react-router-dom';
import SuperadminLogin from './SuperadminLogin';
import SuperadminDashboard from './SuperadminDashboard';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('superadmin_user');
  if (!user) {
    return <Navigate to="/superadmin/login" replace />;
  }
  return children;
}

export default function SuperadminApp() {
  return (
    <Routes>
      <Route path="login" element={<SuperadminLogin />} />
      <Route
        index
        element={
          <ProtectedRoute>
            <SuperadminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/superadmin" replace />} />
    </Routes>
  );
}
