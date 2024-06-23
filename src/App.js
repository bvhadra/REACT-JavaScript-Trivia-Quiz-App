import React, { useState, useEffect } from 'react';
import CategorySelect from './components/CategorySelect';
import DifficultySelect from './components/DifficultySelect';
import Question from './components/Question';
import Timer from './components/Timer';
import Score from './components/Score';
import GameOver from './components/GameOver';
import './App.css';

const App = () => {
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
  const [showNextButton, setShowNextButton] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // used to reset the timer
  const [isTimerRunning, setIsTimerRunning] = useState(true); // timer control
  const [totalQuestions, setTotalQuestions] = useState(10); // default total questions

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
          setScore(0);
          setIsGameOver(false);
          setIsAnswerSelected(false);
          setSelectedAnswer(null);
          setFeedbackMessage('');
          setShowNextButton(false);
          setTimerKey(prevKey => prevKey + 1); // reset timer
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

  const startGame = () => {
    fetchQuestions();
  };

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
    setTimerKey(prevKey => prevKey + 1); // reset timer
    setIsTimerRunning(true);
  };

  const handleAnswerSelection = (selectedAnswer) => {
    if (isAnswerSelected) return;

    setIsAnswerSelected(true);
    setSelectedAnswer(selectedAnswer);
    setIsTimerRunning(false); // stop timer

    const correctAnswer = decodeHtml(currentQuestion.correct_answer);
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setFeedbackMessage('Correct Answer!');
    } else {
      setFeedbackMessage(`Wrong Answer! The correct answer is: ${correctAnswer}`);
    }
    setShowNextButton(true);
  };

  const handleTimeUp = () => {
    setIsAnswerSelected(true);
    setIsTimerRunning(false); // stop timer
    const correctAnswer = decodeHtml(currentQuestion.correct_answer);
    setFeedbackMessage(`Time Up! The correct answer is: ${correctAnswer}`);
    setShowNextButton(true);
  };

  const nextQuestion = () => {
    if (questionCount < totalQuestions - 1) {
      setQuestionCount((prevCount) => prevCount + 1);
      setCurrentQuestion(questions[questionCount + 1]);
      setIsAnswerSelected(false);
      setSelectedAnswer(null);
      setFeedbackMessage('');
      setShowNextButton(false);
      setTimerKey(prevKey => prevKey + 1); // reset timer
      setIsTimerRunning(true); // restart timer
    } else {
      setIsGameOver(true);
    }
  };

  const endGame = () => {
    setIsGameOver(true);
  };

  const quitGame = () => {
    if (window.confirm("Are you sure you want to quit the game?")) {
      window.close();
    }
  };

  if (isGameOver) {
    return <GameOver score={score} onRestart={playAgain} onQuit={quitGame} />;
  }

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
        Developed by <strong>Bidhan Vhadra</strong> from <strong>Web Pulse Marketing Ltd</strong>.<br />
        <a href="https://github.com/bvhadra" target="_blank" rel="noopener noreferrer">
          Visit my GitHub profile
        </a>
      </p>
      <p>&copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export default App;
