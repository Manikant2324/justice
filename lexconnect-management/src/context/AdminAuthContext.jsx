import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('lex_admin_token') || '';
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    return savedToken;
  });
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup Axios 401 Interceptor for seamless admin auth error handling
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.warn('[AdminAuthContext] 401 Unauthorized encountered. Cleaning up admin auth session.');
          logoutAdmin();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchAdminProfile();
    } else {
      setAdmin(null);
      setLoading(false);
    }
  }, [token]);

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data.role !== 'admin') {
        logoutAdmin();
      } else {
        setAdmin(res.data);
      }
    } catch (err) {
      console.error('Admin profile fetch failed:', err);
      logoutAdmin();
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    const res = await axios.post('/api/auth/admin-login', { email, password });
    const { token: userToken, ...userData } = res.data;
    localStorage.setItem('lex_admin_token', userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    setToken(userToken);
    setAdmin(userData);
    return res.data;
  };

  const updateAdminProfile = async (formData) => {
    const res = await axios.put('/api/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setAdmin(res.data);
    return res.data;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('lex_admin_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, loginAdmin, updateAdminProfile, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
