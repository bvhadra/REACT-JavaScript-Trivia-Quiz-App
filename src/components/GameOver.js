import React from 'react';

const GameOver = ({ score, onRestart }) => {
  const quitGame = () => {
    if (window.confirm("Are you sure you want to quit the game?")) {
      window.close();
    }
  };

  return (

    <div className="game-over">

      <div className="header">
       <h1>TRIVIA QUIZ APP</h1>
       <h2>Select a category, level and number of questions!</h2>
      </div>

      <h2>Game Over</h2>
      <p className="score">Your score: {score}</p>
      <div className="button-container">
        <button onClick={onRestart} className="next-button">Play Again</button>
        <button onClick={quitGame} className="end-game-button">Quit</button>
      </div>
      <div className="footer">
        <p>
          Designed & Developed by <a href="https://github.com/bvhadra" target="_blank" rel="noopener noreferrer">Bidhan Vhadra</a>
        </p>
        <p>
          Copyright &copy; Bidhan Vhadra {new Date().getFullYear()}.
        </p>  
      </div>
    </div>
  );
};

export default GameOver;
