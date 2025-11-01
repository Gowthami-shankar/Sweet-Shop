import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build the params object
    const params = {};
    if (name) params.name = name;
    if (category) params.category = category;
    
    if (priceRange) { // If priceRange is not an empty string
      if (priceRange === '100+') {
        params.priceRange = '100-99999'; // Handle the "100+" case
      } else {
        params.priceRange = priceRange; // Pass "0-50" or "50-100" directly
      }
    }
    console.log('Frontend is sending params:', params);
    onSearch(params);
  };

  const handleClear = () => {
    setName('');
    setCategory('');
    setPriceRange('');
    onSearch({}); // Perform an empty search to reset
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search by name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Classic">Classic</option>
        <option value="Premium">Premium</option>
        <option value="Festive">Festive</option>
        {/* Add more categories as needed */}
      </select>
      <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
        <option value="">All Prices</option>
        <option value="0-50">₹0 - ₹50</option>
        <option value="50-100">₹50 - ₹100</option>
        <option value="100+">₹100+</option>
      </select>
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear} className="clear-button">Clear</button>
    </form>
  );
}

export default SearchBar;
