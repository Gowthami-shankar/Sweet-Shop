import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Pages
// ⭐️ THIS IS THE FIX ⭐️
// Your components are exported as "default", so they MUST be
// imported WITHOUT curly braces {}.
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Import Layout
// Make sure your file is named 'NavBar.js' (with a capital B)
// in 'frontend/src/components/layout/'
import Navbar from './components/layout/NavBar'; 

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
          />

          {/* Protected Routes (all logged-in users) */}
          <Route 
            path="/" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
          />

          {/* Protected Routes (Admin only) */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated && user?.role === 'admin' ? (
                <AdminPanelPage />
              ) : (
                <Navigate to="/" />
              )
            } 
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

