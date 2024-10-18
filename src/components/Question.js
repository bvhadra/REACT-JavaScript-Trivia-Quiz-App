import React from 'react';

const Question = ({ question, onSelectAnswer, isAnswerSelected, selectedAnswer, correctAnswer }) => {
  const handleClick = (answer) => {
    if (!isAnswerSelected) {
      onSelectAnswer(answer);
    }
  };

  const getButtonStyle = (answer) => {
    if (!isAnswerSelected) return {};
    if (answer === selectedAnswer) {
      return { backgroundColor: answer === correctAnswer ? '#5c9c00' : '#FF4545' };
    }
    return {};
  };

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="question-container">
      <h2 className="question-text">{decodeHtml(question.question)}</h2>
      <div className="answers-horizontal">
        {question.incorrect_answers.concat(question.correct_answer).sort().map((answer, index) => (
          <button
            key={index}
            onClick={() => handleClick(decodeHtml(answer))}
            style={getButtonStyle(decodeHtml(answer))}
            className="answer-button"
            disabled={isAnswerSelected}
          >
            {decodeHtml(answer)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;