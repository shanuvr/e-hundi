import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const navigate = useNavigate();
  const [temple, setTemple] = useState(() => {
    try {
      const cached = localStorage.getItem('temple_admin_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemple = useCallback(async () => {
    const templeId = localStorage.getItem('temple_admin_id');
    if (!templeId) {
      setLoading(false);
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminTemple();
      if (res && res.temple) {
        setTemple(res.temple);
        localStorage.setItem('temple_admin_user', JSON.stringify(res.temple));
        if (res.temple.id) {
          localStorage.setItem('temple_admin_id', res.temple.id);
        }
      } else {
        throw new Error('Failed to retrieve temple information');
      }
    } catch (err) {
      console.error('Error loading admin temple profile:', err);
      setError(err.message || 'Failed to authenticate');
      // If unauthorized, redirect to login
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem('temple_admin_id');
        localStorage.removeItem('temple_admin_user');
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTemple();
  }, [fetchTemple]);

  const saveTemple = async (updatedData) => {
    setSaving(true);
    try {
      const res = await api.updateAdminTemple(updatedData);
      if (res && res.temple) {
        setTemple(res.temple);
        localStorage.setItem('temple_admin_user', JSON.stringify(res.temple));
        return { success: true, temple: res.temple };
      }
      throw new Error(res.message || 'Update failed');
    } catch (err) {
      console.error('Failed to update temple details:', err);
      return { success: false, error: err.message || 'Failed to save changes' };
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch (e) {
      console.warn('Logout network call error (proceeding to clear session):', e);
    }
    localStorage.removeItem('temple_admin_id');
    localStorage.removeItem('temple_admin_user');
    setTemple(null);
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminContext.Provider
      value={{
        temple,
        loading,
        saving,
        error,
        refreshTemple: fetchTemple,
        saveTemple,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
