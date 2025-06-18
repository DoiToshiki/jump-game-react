import React, { useState, useEffect, useRef } from 'react';
import './game.css';
import characterImg from '../assets/character.png';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const characterRef = useRef(null);
  const obstacleRef = useRef(null);

  // 衝突時はアニメーション停止用クラスを付ける
  const obstacleClass = `obstacle ${isGameOver ? 'paused' : ''}`;

  useEffect(() => {
    if (isRestarting) {
      window.location.reload();
    }
  }, [isRestarting]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isJumping && !isGameOver && !isPaused && !isCleared) {
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
  }, [isJumping, isGameOver, isPaused, isCleared]);

  useEffect(() => {
    if (isPaused || isGameOver || isCleared) return;
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
          setIsGameOver(true); // ← 修正ポイント（reload削除）
        }

        if (!isCollision && obsRect.right < charRect.left && !obstacleRef.current.counted) {
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= 10) setIsCleared(true);
            return newScore;
          });
          obstacleRef.current.counted = true;
        }
      }
    }, 50);
    return () => clearInterval(checkCollision);
  }, [isPaused, isGameOver, isCleared]);

  useEffect(() => {
    if (obstacleRef.current) {
      const obs = obstacleRef.current;
      const handleAnimationIteration = () => {
        obs.counted = false;

      };
      obs.addEventListener('animationiteration', handleAnimationIteration);
      return () => {
        obs.removeEventListener('animationiteration', handleAnimationIteration);
      };
    }
  }, []);

  return (
    <div className="game-container">
      <button className="menu-button" onClick={() => setIsPaused(true)}>☰</button>
      <h1>JUMP GAME</h1>
      <p>Score: {score} / 10</p>

      <div className="game-area">
        <img
          ref={characterRef}
          src={characterImg}
          alt="character"
          className="character"
          style={{ bottom: `${position}px` }}
        />
        <div
          ref={obstacleRef}
          className={obstacleClass}
        />
      </div>

      {isGameOver && <p className="game-over">💥 GAME OVER 💥</p>}
      {isCleared && <p className="game-clear">🎉 GAME CLEAR 🎉</p>}
      {!isGameOver && !isCleared && <p>Press Space to Jump</p>}

      {isPaused && (
        <div className="menu-overlay">
          <button onClick={() => setIsPaused(false)}>▶ 再開</button>
          <button onClick={() => window.location.reload()}>🔁 リスタート</button>
          <button onClick={() => window.location.href = '/'}>🏠 スタート画面に戻る</button>
        </div>
      )}

      {(isGameOver || isCleared) && (
        <div className="result-screen">
          <h2>{isCleared ? '🎉 SUCCESS 🎉' : '💥 FAILURE 💥'}</h2>
          <p>Score: {score} / 10</p>
          <button onClick={() => setIsRestarting(true)}>🔁 Restart</button>
        </div>
      )}
    </div>
  );
};

export default Game;
