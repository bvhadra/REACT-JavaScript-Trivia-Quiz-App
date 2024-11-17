// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import CategorySelect from './components/CategorySelect';
import DifficultySelect from './components/DifficultySelect';
import QuestionCountSelect from './components/QuestionCountSelect';
import Question from './components/Question';
import Timer from './components/Timer';
import Score from './components/Score';
import './App.css';

// Main App component
const App = () => {
  // State variables
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timerKey, setTimerKey] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(10);

  // Fetch categories
  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then((response) => response.json())
      .then((data) => setCategories(data.trivia_categories))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const fetchQuestions = () => {
    fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple&category=${category}&difficulty=${difficulty}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setQuestions(data.results);
          setCurrentQuestion(data.results[0]);
          setQuestionCount(0);
          resetGameStates();
        } else {
          console.error('No questions found in the API response.');
        }
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  };

  const resetGameStates = () => {
    setScore(0);
    setIsGameOver(false);
    setIsAnswerSelected(false);
    setSelectedAnswer(null);
    setFeedbackMessage('');
    setTimerKey((prevKey) => prevKey + 1);
    setIsTimerRunning(true);
  };

  const startGame = () => {
    fetchQuestions();
  };

  const playAgain = () => {
    setCategory('');
    setDifficulty('');
    setCurrentQuestion(null);
    setQuestions([]);
    resetGameStates();
  };

  const handleAnswerSelection = (selectedAnswer) => {
    if (isAnswerSelected) return;

    setIsAnswerSelected(true);
    setSelectedAnswer(selectedAnswer);
    setIsTimerRunning(false);

    const correctAnswer = decodeHtml(currentQuestion.correct_answer);
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setFeedbackMessage('Correct Answer!');
    } else {
      setFeedbackMessage(`Wrong Answer! The correct answer is: ${correctAnswer}`);
    }

    if (questionCount === totalQuestions - 1) {
      setIsGameOver(true);
    }
  };

  const handleTimeUp = () => {
    setIsAnswerSelected(true);
    setIsTimerRunning(false);
    const correctAnswer = decodeHtml(currentQuestion.correct_answer);
    setFeedbackMessage(`Time Up! The correct answer is: ${correctAnswer}`);

    if (questionCount === totalQuestions - 1) {
      setIsGameOver(true);
    }
  };

  const nextQuestion = () => {
    setQuestionCount((prevCount) => prevCount + 1);
    setCurrentQuestion(questions[questionCount + 1]);
    setIsAnswerSelected(false);
    setSelectedAnswer(null);
    setFeedbackMessage('');
    setTimerKey((prevKey) => prevKey + 1);
    setIsTimerRunning(true);
  };

  const quitGame = () => {
    if (window.confirm('Are you sure you want to quit the game?')) {
      window.close();
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>TRIVIA QUIZ APP</h1>
        <h2>Select a category, level, and number of questions!</h2>
      </div>
      <div className="content">
        {!currentQuestion && !isGameOver && (
          <div>
            <CategorySelect categories={categories} onSelect={setCategory} />
            <DifficultySelect onSelect={setDifficulty} />
            <QuestionCountSelect value={totalQuestions} onSelect={setTotalQuestions} />
            <button className="start-button" onClick={startGame} disabled={!category || !difficulty}>
              Start Game
            </button>
          </div>
        )}
        {currentQuestion && (
          <div>
            <div className="score-question-container">
              <div className="question-number">
                <h3>
                  Question {questionCount + 1} of {totalQuestions}
                </h3>
              </div>
              <Score score={score} classname="score" />
            </div>
            <Question
              question={currentQuestion}
              onSelectAnswer={handleAnswerSelection}
              isAnswerSelected={isAnswerSelected}
              selectedAnswer={selectedAnswer}
              correctAnswer={decodeHtml(currentQuestion.correct_answer)}
            />
            {isAnswerSelected && (
              <p
                className={`feedback-message ${
                  feedbackMessage.includes('Correct')
                    ? 'feedback-correct'
                    : feedbackMessage.includes('Wrong')
                    ? 'feedback-wrong'
                    : 'feedback-timeup'
                }`}
              >
                {feedbackMessage}
              </p>
            )}
            {isAnswerSelected && !isGameOver && (
              <button className="next-button" onClick={nextQuestion}>
                Next Question
              </button>
            )}
            {isGameOver && (
              <div className="game-over-container">
                <p className="game-over-message">
                  Game Over! Your final score is: {score} out of {totalQuestions}
                </p>
                <div className="game-over-actions">
                  <button className="play-again-button" onClick={playAgain}>
                    Play Again
                  </button>
                  <button className="quit-button" onClick={quitGame}>
                    Quit
                  </button>
                </div>
              </div>
            )}
            {!isGameOver && !isAnswerSelected && <Timer key={timerKey} isRunning={isTimerRunning} onTimeUp={handleTimeUp} />}
          </div>
        )}
      </div>
      <div className="footer">
        <p>
          Designed & Developed by <a href="https://github.com/bvhadra" target="_blank" rel="noopener noreferrer">Bidhan Vhadra</a>
        </p>
        <p>Copyright &copy; Bidhan Vhadra {new Date().getFullYear()}.</p>
      </div>
    </div>
  );
};

// Function to decode HTML entities
const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export default App;