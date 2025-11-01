import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🍬 Sweet Shop</Link>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            {/* Show Admin Panel link only if user is admin */}
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin">Admin Panel</Link>
              </li>
            )}
            <li>
              <span>Welcome, {user?.username}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
