// Import React
import React from 'react';

// Score component to display the user's score
const Score = ({ score }) => {
  return (
    <div className="score">
      <h3>Score: {score}</h3>
    </div>
  );
};

export default Score;