// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import CategorySelect from './components/CategorySelect';
import DifficultySelect from './components/DifficultySelect';
import Question from './components/Question';
import Timer from './components/Timer';
import Score from './components/Score';
import GameOver from './components/GameOver';
import './App.css';

// Main App component
const App = () => {
  // State variables
  const [categories, setCategories] = useState([]); // Categories for trivia questions
  const [questions, setQuestions] = useState([]); // Questions fetched from the API
  const [currentQuestion, setCurrentQuestion] = useState(null); // Current question
  const [score, setScore] = useState(0); // User's score
  const [questionCount, setQuestionCount] = useState(0); // Count of questions answered
  const [isGameOver, setIsGameOver] = useState(false); // Game over state
  const [category, setCategory] = useState(''); // Selected category
  const [difficulty, setDifficulty] = useState(''); // Selected difficulty
  const [isAnswerSelected, setIsAnswerSelected] = useState(false); // Answer selection state
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Selected answer
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Feedback message after answer selection
  const [showNextButton, setShowNextButton] = useState(false); // State to show/hide next button
  const [timerKey, setTimerKey] = useState(0); // Key to reset the timer
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Timer running state
  const [totalQuestions, setTotalQuestions] = useState(10); // Total number of questions

  // useEffect hook to fetch trivia categories from the API on component mount
  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then((response) => response.json())
      .then((data) => setCategories(data.trivia_categories))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  // Function to fetch questions based on selected category and difficulty
  const fetchQuestions = () => {
    fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple&category=${category}&difficulty=${difficulty}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          // Set state variables with fetched questions and reset necessary states
          setQuestions(data.results);
          setCurrentQuestion(data.results[0]);
          setQuestionCount(0);
          setScore(0);
          setIsGameOver(false);
          setIsAnswerSelected(false);
          setSelectedAnswer(null);
          setFeedbackMessage('');
          setShowNextButton(false);
          setTimerKey(prevKey => prevKey + 1); // Reset timer
          setIsTimerRunning(true);
        } else {
          console.error('No questions found in the API response.');
          // Handle error or show user feedback
        }
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        // Handle fetch error or show user feedback
      });
  };

  // Function to start the game by fetching questions
  const startGame = () => {
    fetchQuestions();
  };

  // Function to reset the game state and play again
  const playAgain = () => {
    setCategory('');
    setDifficulty('');
    setCurrentQuestion(null);
    setQuestions([]);
    setIsGameOver(false);
    setScore(0);
    setQuestionCount(0);
    setIsAnswerSelected(false);
    setSelectedAnswer(null);
    setFeedbackMessage('');
    setShowNextButton(false);
    setTimerKey(prevKey => prevKey + 1); // Reset timer
    setIsTimerRunning(true);
  };

  // Function to handle answer selection
  const handleAnswerSelection = (selectedAnswer) => {
    if (isAnswerSelected) return;

    setIsAnswerSelected(true);
    setSelectedAnswer(selectedAnswer);
    setIsTimerRunning(false); // Stop timer

    const correctAnswer = decodeHtml(currentQuestion.correct_answer);
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setFeedbackMessage('Correct Answer!');
    } else {
      setFeedbackMessage(`Wrong Answer! The correct answer is: ${correctAnswer}`);
    }
    setShowNextButton(true);
  };

  // Function to handle timer expiration
  const handleTimeUp = () => {
    setIsAnswerSelected(true);
    setIsTimerRunning(false); // Stop timer
    const correctAnswer = decodeHtml(currentQuestion.correct_answer);
    setFeedbackMessage(`Time Up! The correct answer is: ${correctAnswer}`);
    setShowNextButton(true);
  };

  // Function to go to the next question
  const nextQuestion = () => {
    if (questionCount < totalQuestions - 1) {
      setQuestionCount((prevCount) => prevCount + 1);
      setCurrentQuestion(questions[questionCount + 1]);
      setIsAnswerSelected(false);
      setSelectedAnswer(null);
      setFeedbackMessage('');
      setShowNextButton(false);
      setTimerKey(prevKey => prevKey + 1); // Reset timer
      setIsTimerRunning(true); // Restart timer
    } else {
      setIsGameOver(true);
    }
  };

  // Function to end the game
  const endGame = () => {
    setIsGameOver(true);
  };

  // Function to quit the game
  const quitGame = () => {
    if (window.confirm("Are you sure you want to quit the game?")) {
      window.close();
    }
  };

  // Render GameOver component if the game is over
  if (isGameOver) {
    return <GameOver score={score} onRestart={playAgain} onQuit={quitGame} />;
  }

  // Main render function
  return (
    <div className="App">
      <h1>Trivia Quiz</h1>
      {!currentQuestion && !isGameOver && (
        <div>
          <CategorySelect categories={categories} onSelect={setCategory} />
          <DifficultySelect onSelect={setDifficulty} />
          <div className="question-selection">
            <label htmlFor="question">Select Questions:</label>
            <select id="question" value={totalQuestions} onChange={(e) => setTotalQuestions(parseInt(e.target.value))}>
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>
          <button className="next-button" onClick={startGame} disabled={!category || !difficulty}>Start Game</button>
        </div>
      )}
      {currentQuestion && (
        <div>
          <div className="question-header">
            <span>Question {questionCount + 1} of {totalQuestions}</span>
          </div>
          <Question
            question={currentQuestion}
            onSelectAnswer={handleAnswerSelection}
            isAnswerSelected={isAnswerSelected}
            selectedAnswer={selectedAnswer}
            correctAnswer={decodeHtml(currentQuestion.correct_answer)}
          />
          {isAnswerSelected && <p>{feedbackMessage}</p>}
          {isAnswerSelected && (
            <div className="button-container">
              {showNextButton && <button className="next-button" onClick={nextQuestion}>Next</button>}
              <button onClick={endGame} className="end-game-button">End Game</button>
            </div>
          )}
          <Score score={score} />
          <Timer key={timerKey} isRunning={isTimerRunning} onTimeUp={handleTimeUp} />
        </div>
      )}

      <div className="footer">
        <p>
          Copyright &copy; Bidhan Vhadra {new Date().getFullYear()}. Designed & Developed by Bidhan Vhadra, <a href="https://github.com/bvhadra" target="_blank" rel="noopener noreferrer">Visit my GitHub profile</a>
        </p>
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