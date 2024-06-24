// Import React
import React from 'react';

// DifficultySelect component to select difficulty level
const DifficultySelect = ({ onSelect }) => {
  return (
    <div id="difficulty-selection">
      <label htmlFor="difficulty">Difficulty:</label>
      <select id="difficulty" onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select A Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
};

export default DifficultySelect;