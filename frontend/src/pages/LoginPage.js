import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  // 1. We use 'formData' to hold an object
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // 2. We get 'username' and 'password' from the 'formData' state
  const { username, password } = formData;

  // 3. The 'onChange' handler updates the 'formData' object
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 4. We wrap the login call in a 'try...catch'
    try {
      // 5. We pass the *entire* 'formData' object, as expected
      await login(formData);
      
      // If it succeeds, navigate to the dashboard
      navigate('/');

    } catch (err) {
      // 6. If it fails, we catch the error and show it
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username" // 7. 'name' attribute is critical
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password" // 8. 'name' attribute is critical
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="auth-button">Login</button>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;