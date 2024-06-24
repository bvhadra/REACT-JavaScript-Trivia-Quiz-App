// Import React
import React from 'react';

// CategorySelect component to select a trivia category
const CategorySelect = ({ categories, onSelect }) => {
  return (
    <div id="category-selection">
      <label htmlFor="category">Category:</label>
      <select id="category" onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select A Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;