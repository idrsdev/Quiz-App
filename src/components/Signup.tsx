import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/quiz', { state: { name } });
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Quiz Game</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <label className="signup-label">
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
          />
        </label>
        <br />
        <button type="submit" className="signup-button">
          Start Quiz
        </button>
      </form>
    </div>
  );
}

export default Signup;
