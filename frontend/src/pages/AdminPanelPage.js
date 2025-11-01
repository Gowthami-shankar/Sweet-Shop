import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import SweetList from '../components/SweetList';
import AdminForm from '../components/AdminForm';

function AdminPanelPage() {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // This state holds the sweet that is currently being edited
  const [editingSweet, setEditingSweet] = useState(null);

  // Fetch all sweets
  const fetchSweets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/sweets'); // Just get all sweets
      setSweets(res.data);
    } catch (err) {
      setError('Failed to fetch sweets.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  // Handle successful form submission (create or update)
  const handleSave = (savedSweet) => {
    if (editingSweet) {
      // We were editing, so replace the old one
      setSweets(sweets.map(s => (s._id === savedSweet._id ? savedSweet : s)));
    } else {
      // We were creating, so add the new one
      setSweets([savedSweet, ...sweets]);
    }
    setEditingSweet(null); // Clear the form
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }
    try {
      await api.delete(`/sweets/${id}`);
      setSweets(sweets.filter(s => s._id !== id));
    } catch (err) {
      setError('Failed to delete sweet.');
    }
  };

  return (
    <div className="admin-panel-page">
      <div className="admin-form-section">
        <AdminForm
          key={editingSweet?._id || 'new'} // Re-render form when editingSweet changes
          onSave={handleSave}
          initialData={editingSweet}
          onClear={() => setEditingSweet(null)}
        />
      </div>
      
      <div className="admin-list-section">
        <h2>Manage Sweets</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <SweetList
          sweets={sweets}
          actionType="admin"
          onEdit={(sweet) => setEditingSweet(sweet)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default AdminPanelPage;
