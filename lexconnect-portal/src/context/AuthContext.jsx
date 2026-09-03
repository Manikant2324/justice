import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('lex_token') || '';
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    return savedToken;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup Axios 401 Interceptor for seamless auth error handling
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.warn('[AuthContext] 401 Unauthorized encountered. Cleaning up auth session.');
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch auth user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: userToken, ...userData } = res.data;
    localStorage.setItem('lex_token', userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    const { token: userToken, ...userData } = res.data;
    localStorage.setItem('lex_token', userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  const updateProfile = async (formData) => {
    const res = await axios.put('/api/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('lex_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
