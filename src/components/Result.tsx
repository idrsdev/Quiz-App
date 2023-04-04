import React from 'react';
import { useLocation } from 'react-router-dom';
import './result.css';

function Result() {
  const location = useLocation();
  const { name, score } = location.state;

  return (
    <div className="result-container">
      <h1 className="result-heading">Quiz Results </h1>
      <p className="result-text">Congratulations, {name}!</p>
      <p className="result-text">Your score is: {score}</p>
    </div>
  );
}

export default Result;
