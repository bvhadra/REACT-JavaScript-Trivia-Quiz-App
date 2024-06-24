import React from 'react';

const GameOver = ({ score, onRestart }) => {
  const quitGame = () => {
    if (window.confirm("Are you sure you want to quit the game?")) {
      window.close();
    }
  };

  return (
    <div className="game-over">
      <h2>Game Over</h2>
      <p>Your score: {score}</p>
      <div className="button-container">
        <button onClick={onRestart} className="next-button">Play Again</button>
        <button onClick={quitGame} className="end-game-button">Quit</button>
      </div>
      <div className="footer">
        <p>
        Copyright &copy; Bidhan Vhadra {new Date().getFullYear()}. Designed & Developed by Bidhan Vhadra, <a href="https://github.com/bvhadra" target="_blank" rel="noopener noreferrer">Visit my GitHub profile</a>
        </p>
      </div>
    </div>
  );
};

export default GameOver;
