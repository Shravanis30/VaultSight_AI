import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vaultsight_token'));
  const [loading, setLoading] = useState(true);

  // Stats & Data
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('vaultsight_user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('vaultsight_token', token);
      localStorage.setItem('vaultsight_user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('vaultsight_token');
    localStorage.removeItem('vaultsight_user');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const registerNewUser = async (userData) => {
    try {
      const response = await api.post('admin/register', userData);
      await fetchUsers();
      return response;
    } catch (error) {
        throw error;
    }
  }

  const issueUserCard = async (userId) => {
    try {
      await api.post(`admin/issue-card/${userId}`);
      await fetchUsers();
    } catch (error) {
       throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('user/profile');
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('vaultsight_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await api.get('user/recipients');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipients:', error);
      return [];
    }
  };

  const raiseComplaint = async (complaintData) => {
    try {
      const response = await api.post('user/complaint', complaintData);
      return response.data;
    } catch (error) {
       throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      token, 
      loading,
      login, 
      logout,
      users,
      fetchUsers,
      registerNewUser,
      issueUserCard,
      fetchProfile,
      fetchRecipients,
      raiseComplaint,
      transactions,
      setTransactions,
      threats,
      setThreats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
