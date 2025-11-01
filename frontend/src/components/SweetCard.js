import React, { useState } from 'react';
import api from '../services/api';

function SweetCard({ sweet, onAction, actionType, onEdit, onDelete }) {
  const { name, category, price, quantity, _id } = sweet;
  const isOutOfStock = quantity === 0;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    
    try {
      // Use the purchase endpoint
      const res = await api.post(`/sweets/${_id}/purchase`);
      onAction(res.data); // Pass the updated sweet back to the parent
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    }
    setIsLoading(false);
  };

  return (
    <div className={`sweet-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="sweet-card-image">
        <span>🍬</span> {/* Simple emoji placeholder */}
      </div>
      <div className="sweet-card-info">
        <h3>{name}</h3>
        <p className="category">{category}</p>
        <p className="price">Price: ₹{price.toFixed(2)}</p>
        <p className="quantity">Stock: {quantity}</p>
        {error && <p className="error-message small">{error}</p>}
      </div>
      
      {/* Conditional buttons based on 'actionType' */}
      <div className="sweet-card-actions">
        {actionType === 'purchase' && (
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || isLoading}
            className="purchase-button"
          >
            {isLoading ? '...' : (isOutOfStock ? 'Out of Stock' : 'Purchase')}
          </button>
        )}
        
        {actionType === 'admin' && (
          <div className="admin-buttons">
            <button onClick={() => onEdit(sweet)} className="edit-button">Edit</button>
            <button onClick={() => onDelete(_id)} className="delete-button">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SweetCard;
