import React from 'react';

const ActionButtons = ({ showNextButton, onNext, onEndGame }) => {
  return (
    <div className="action-buttons">
      {showNextButton && (
        <button className="next-button" onClick={onNext}>
          Next Question
        </button>
      )}
      <button className="end-game-button" onClick={onEndGame}>
        End Game
      </button>
    </div>
  );
};

export default ActionButtons;
