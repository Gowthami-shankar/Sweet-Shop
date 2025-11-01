import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import SweetList from '../components/SweetList';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get user info

  // Function to fetch sweets
  const fetchSweets = useCallback(async (searchParams = {}) => {
    setIsLoading(true);
    setError('');
    try {
      // Use the /api/sweets/search endpoint
      const res = await api.get('/sweets/search', { params: searchParams });
      setSweets(res.data);
    } catch (err) {
      setError('Failed to fetch sweets. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  // Fetch sweets when the component loads
  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  // Handle a purchase, which updates the quantity of a sweet in the list
  const handlePurchase = (updatedSweet) => {
    setSweets(currentSweets =>
      currentSweets.map(sweet =>
        sweet._id === updatedSweet._id ? updatedSweet : sweet
      )
    );
  };

  return (
    <div className="dashboard-page">
      <h1>Welcome to the Sweet Shop, {user?.username}!</h1>
      <p>Browse our collection of delicious sweets.</p>
      
      <SearchBar onSearch={fetchSweets} />
      
      {isLoading && <p>Loading sweets...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!isLoading && !error && (
        <SweetList 
          sweets={sweets} 
          onAction={handlePurchase} 
          actionType="purchase"
        />
      )}
    </div>
  );
}

export default DashboardPage;
