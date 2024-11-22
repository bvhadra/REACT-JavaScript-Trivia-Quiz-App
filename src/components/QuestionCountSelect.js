import React from 'react';

const QuestionCountSelect = ({ value, onSelect }) => {
  return (
    <div id="question-count-selection" className="select-container">
      <label htmlFor="question-count">Number of Questions:</label>
      <select
        id="question-count"
        value={value}
        onChange={(e) => onSelect(parseInt(e.target.value))}
        className="select-element"
      >
        <option value="">Select Number of Questions</option>
        <option value="5">5 Questions</option>
        <option value="10">10 Questions</option>
        <option value="15">15 Questions</option>
        <option value="20">20 Questions</option>
      </select>
    </div>
  );
};

export default QuestionCountSelect;