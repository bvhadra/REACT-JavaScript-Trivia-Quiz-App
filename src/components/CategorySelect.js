import React from 'react';

const CategorySelect = ({ categories, onSelect }) => {
  return (
    <div id="category-selection" className="select-container">
      <label htmlFor="category">Category:</label>
      <select id="category" onChange={(e) => onSelect(e.target.value)} className="select-element">
        <option value="">Select A Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;