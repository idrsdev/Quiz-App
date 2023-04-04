import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './quiz.css';

interface QuizItem {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const Quiz = () => {
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [percentage, setPercentage] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  const location = useLocation();
  const { name } = location.state;

  useEffect(() => {
    // Fetch questions from server when component mounts
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/questions');
        const data: QuizItem[] = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // Update timer every second
    const timer = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    // End quiz when timer reaches 0
    if (timeLeft === 0) {
      endQuiz();
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    // Calculate percentage of correct answers
    if (score > 0) {
      const percentage = (score / currentQuestionIndex) * 100;
      setPercentage(percentage);
    }
  }, [score, currentQuestionIndex]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    // Calculate progress
    const newProgress = Math.floor(
      ((currentQuestionIndex + 1) / questions.length) * 100
    );
    setProgress(newProgress);

    // Update score if answer is correct
    if (selectedOption === questions[currentQuestionIndex].correct_answer) {
      setScore((score) => score + 1);
    }

    // Move to next question
    setCurrentQuestionIndex((index) => index + 1);
    setSelectedOption(null);
  };

  const endQuiz = async () => {
    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          score,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/result', { state: { name, score } });
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="quiz-container">
      <div
        className="quiz-progress-bar"
        style={{ width: `${progress}%` }}
      ></div>
      <header className="quiz-header">
        <h1 className="quiz-title">Quiz Game</h1>
        <p className="quiz-welcome">Welcome, {name}!</p>
        <p className="quiz-timer">Time left: {timeLeft} seconds</p>
      </header>
      {questions.length > 0 && (
        <main className="quiz-main">
          <p className="quiz-progress">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <h3 className="quiz-question">
            {questions[currentQuestionIndex].question}
          </h3>
          <ul className="quiz-options">
            {shuffleArray([
              ...questions[currentQuestionIndex].incorrect_answers,
              questions[currentQuestionIndex].correct_answer,
            ]).map((option, index) => (
              <li className="quiz-option" key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                  className="quiz-input"
                />
                <label htmlFor={`option-${index}`} className="quiz-label">
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <button
            className="quiz-button"
            onClick={
              currentQuestionIndex === questions.length - 1
                ? endQuiz
                : handleNextQuestion
            }
            disabled={selectedOption === null}
            type={
              currentQuestionIndex === questions.length - 1
                ? 'submit'
                : 'button'
            }
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
          <div className="quiz-score-bar">
            <div className="quiz-score" style={{ width: `${percentage}%` }}>
              {`${percentage}%`}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Quiz;

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
