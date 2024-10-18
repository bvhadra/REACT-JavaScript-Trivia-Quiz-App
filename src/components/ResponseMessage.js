import React from 'react';

const ResponseMessage = ({ isCorrect, correctAnswer }) => {
  return (
    <div className={`response-message ${isCorrect ? 'correct' : 'wrong'}`}>
      {isCorrect ? (
        <p>Correct Answer!</p>
      ) : (
        <p>Wrong Answer! The correct answer is: <strong>{correctAnswer}</strong></p>
      )}
    </div>
  );
};

export default ResponseMessage;
