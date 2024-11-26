import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Tworzenie kontekstu
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [user, setUser] = useState(null); // Informacje o zalogowanym użytkowniku
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);

  // Przechowywanie tokenów w localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, [accessToken, refreshToken]);

  // Funkcja logowania
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', { email, password });
      const { accessToken, refreshToken, userId, role } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser({ userId, role });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Błąd logowania:', error);
    }
  };

  // Funkcja wylogowania
  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/auth/logout', null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Odświeżanie tokenu
  const refresh = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/refresh', { refreshToken });
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error('Błąd podczas odświeżania tokenu:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook do korzystania z kontekstu
export const useAuth = () => useContext(AuthContext);
