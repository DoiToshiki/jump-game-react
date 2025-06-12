import React, { useState, useEffect, useRef } from 'react';
import './game.css'; // 後で作成
import characterImg from '../assets/character.png';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const characterRef = useRef(null);
  const obstacleRef = useRef(null);

  // スペースキーでジャンプ
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isJumping) {
        setIsJumping(true);
        let height = 0;
        const jumpHeight = 120;
        const speed = 10;
        const interval = 16;

        const upInterval = setInterval(() => {
          height += speed;
          setPosition(height);
          if (height >= jumpHeight) {
            clearInterval(upInterval);

            const downInterval = setInterval(() => {
              height -= speed;
              setPosition(height);
              if (height <= 0) {
                clearInterval(downInterval);
                setIsJumping(false);
                setPosition(0);
              }
            }, interval);
          }
        }, interval);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping]);

  // 衝突判定ループ
  useEffect(() => {
    const checkCollision = setInterval(() => {
      if (characterRef.current && obstacleRef.current) {
        const charRect = characterRef.current.getBoundingClientRect();
        const obsRect = obstacleRef.current.getBoundingClientRect();

        const isCollision =
          charRect.right > obsRect.left &&
          charRect.left < obsRect.right &&
          charRect.bottom > obsRect.top &&
          charRect.top < obsRect.bottom;

        if (isCollision) {
          alert("💥 ゲームオーバー！");
          window.location.reload();
        }
      }
    }, 50);
    return () => clearInterval(checkCollision);
  }, []);


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
        <img
          ref={characterRef}
          src={characterImg}
          alt="character"
          className="character"
          style={{ bottom: `${position}px` }}
        />
        <div
          ref={obstacleRef}
          className="obstacle"
        />
      </div>
      <p>Press Space to Jump</p>
    </div>
  );
};

export default Game;
