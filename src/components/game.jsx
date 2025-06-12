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
        let height = 0;
        const jumpHeight = 120;
        const speed = 10;

        // 上昇
        const upInterval = setInterval(() => {
          height += speed;
          setPosition(height);
          if (height >= jumpHeight) {
            clearInterval(upInterval);

            // 下降
            const downInterval = setInterval(() => {
              height -= speed;
              setPosition(height);
              if (height <= 0) {
                clearInterval(downInterval);
                setIsJumping(false);
                setPosition(0); // 地面に戻す
              }
            }, 16); // 約60fps相当
          }
        }, 16);
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
