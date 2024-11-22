import React from 'react';

const DifficultySelect = ({ onSelect }) => {
  return (
    <div id="difficulty-selection" className="select-container">
      <label htmlFor="difficulty">Difficulty:</label>
      <select id="difficulty" onChange={(e) => onSelect(e.target.value)} className="select-element">
        <option value="">Select A Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
};

export default DifficultySelect;