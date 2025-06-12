import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="game-container">
      <h1>JUMP GAME</h1>
      <button
        onClick={() => navigate('/game')}
        className="start-button"
      >
        START
      </button>
    </div>
  );
};

export default StartScreen;
