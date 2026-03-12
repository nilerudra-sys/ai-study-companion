import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, getUserData, setAuthToken, setUserData, logout as clearLocalAuth } from '../utils/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const savedToken = getAuthToken();
    const savedUser = getUserData();
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setUserData(userData);
    setAuthToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearLocalAuth();
  };

  const updateProgressLocally = (updatedUser) => {
    setUser(updatedUser);
    setUserData(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateProgressLocally }}>
      {children}
    </AuthContext.Provider>
  );
};
