import React, { useState, useEffect } from 'react';
import './game.css'; // 後で作成
import characterImg from '../assets/character.png';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  // スペースキーでジャンプ
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isJumping) {
        setIsJumping(true);
        let up = 0;
        const upInterval = setInterval(() => {
          up += 5;
          setPosition((prev) => prev + 5);
          if (up >= 100) {
            clearInterval(upInterval);
            const downInterval = setInterval(() => {
              setPosition((prev) => {
                if (prev <= 0) {
                  clearInterval(downInterval);
                  setIsJumping(false);
                  return 0;
                }
                return prev - 5;
              });
            }, 20);
          }
        }, 20);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping]);

  return (
    <div className="game-container">
      <h1>JUMP GAME</h1>
      <p>Score: 0</p>
      <div className="game-area">
        <img
          src={characterImg}
          alt="character"
          className="character"
          style={{ bottom: `${position}px` }}
        />
        <div className="obstacle" />
      </div>
      <p>Press Space to Jump</p>
    </div>
  );
};

export default Game;
