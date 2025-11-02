import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Make sure you ran: npm install jwt-decode
import api from '../services/api'; // We will use our api instance

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a token in local storage when the app loads
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        
        // Check if token is expired
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          throw new Error('Token expired');
        }

        // Set auth state
        setUser(decodedUser.user);
        setIsAuthenticated(true);
        // Add token to api headers for all future requests
        api.defaults.headers.common['x-auth-token'] = `Bearer ${token}`;
      } catch (err) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false); // Finished loading auth state
  }, []);

  // Login function
  const login = async (formData) => {
    // 'formData' will be { username, password }
    try {
      const res = await api.post('/auth/login', formData);
      const { token } = res.data;

      // Store token
      localStorage.setItem('token', token);
      
      // Decode user info from token
      const decodedUser = jwtDecode(token);
      setUser(decodedUser.user);
      setIsAuthenticated(true);
      
      // Set default header for api
      api.defaults.headers.common['x-auth-token'] = token;
      
    } catch (err) {
      console.error('Login Error:', err.response.data);
      throw err; // Re-throw error to be caught by the LoginPage
    }
  };

  // Register function
  const register = async (formData) => {
    // 'formData' will be { username, password, role }
    try {
      // We don't need to log the user in or get a token here
      // We'll just create the user
      await api.post('/auth/register', formData);
    } catch (err) {
      console.error('Register Error:', err.response.data);
      throw err; // Re-throw error to be caught by the RegisterPage
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['x-auth-token'];
  };

  // Value to be passed to consuming components
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  // Don't render children until we've checked for a token
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};