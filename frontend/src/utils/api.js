const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8004';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const templeId = localStorage.getItem('temple_admin_id');
  if (templeId && !endpoint.includes('/login/')) {
    headers['X-Temple-ID'] = templeId;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'omit', // or 'include'
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || data.message || Object.values(data.errors || {})[0] || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.data = data;
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  // Superadmin
  superadminLogin: (username, password) =>
    request('/api/superadmin/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  superadminMe: () => request('/api/superadmin/me/'),

  superadminLogout: () =>
    request('/api/superadmin/logout/', {
      method: 'POST',
    }),

  getTemples: (q = '') => {
    const query = q ? `?q=${encodeURIComponent(q)}` : '';
    return request(`/api/superadmin/temples/${query}`);
  },

  createTemple: (templeData) =>
    request('/api/superadmin/temples/', {
      method: 'POST',
      body: JSON.stringify(templeData),
    }),

  updateTemple: (id, templeData) =>
    request(`/api/superadmin/temples/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(templeData),
    }),

  deleteTemple: (id) =>
    request(`/api/superadmin/temples/${id}/`, {
      method: 'DELETE',
    }),

  toggleTempleStatus: (id) =>
    request(`/api/superadmin/temples/${id}/toggle-status/`, {
      method: 'POST',
    }),

  // Temple Admin
  adminLogin: (email, password) =>
    request('/api/admin/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  adminLogout: () =>
    request('/api/admin/logout/', {
      method: 'POST',
    }),

  getAdminTemple: () => request('/api/admin/temple/'),

  updateAdminTemple: (data) =>
    request('/api/admin/temple/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

