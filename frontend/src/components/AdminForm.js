import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminForm({ onSave, initialData, onClear }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Classic',
    price: '',
    quantity: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price.toString(),
        quantity: initialData.quantity.toString(),
      });
      setIsEditing(true);
    } else {
      setFormData({ name: '', category: 'Classic', price: '', quantity: '' });
      setIsEditing(false);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      let res;
      if (isEditing) {
        // We are updating
        res = await api.put(`/sweets/${initialData._id}`, dataToSave);
      } else {
        // We are creating
        res = await api.post('/sweets', dataToSave);
      }
      
      onSave(res.data); // Pass the saved sweet to the parent
      handleClearForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save sweet.');
    }
    setIsLoading(false);
  };

  const handleClearForm = () => {
    setFormData({ name: '', category: 'Classic', price: '', quantity: '' });
    setIsEditing(false);
    if (onClear) {
      onClear(); // Tell parent to clear the 'editingSweet' state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>{isEditing ? 'Edit Sweet' : 'Add New Sweet'}</h3>
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="Classic">Classic</option>
          <option value="Premium">Premium</option>
          <option value="Festive">Festive</option>
          <option value="Sugar-Free">Sugar-Free</option>
        </select>
      </div>

      <div className="form-group">
        <label>Price (₹)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="1"
          step="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          step="1"
          required
        />
      </div>

      <div className="admin-form-buttons">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (isEditing ? 'Update Sweet' : 'Add Sweet')}
        </button>
        {isEditing && (
          <button type="button" className="clear-button" onClick={handleClearForm}>
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default AdminForm;
