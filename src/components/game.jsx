import React, { useState, useEffect, useRef } from 'react';
import './game.css';
import characterImg from '../assets/character.png';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false); // 🔹 GameOverフラグ
  const [isPaused, setIsPaused] = useState(false); // 🔹一時停止フラグ
  const [isCleared, setIsCleared] = useState(false); // 🔹クリア状態

  const characterRef = useRef(null);
  const obstacleRef = useRef(null);

  // スペースキーでジャンプ
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isJumping && !isGameOver && !isPaused) {
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

  // 衝突判定ループ
  useEffect(() => {
    if (isPaused || isGameOver) return;
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
          setIsGameOver(true); // フラグだけ立てる
        }
        // 障害物が左側を通過（50px）していたら1回だけスコア加算
        if (!isCollision && obsRect.right < charRect.left && !obstacleRef.current.counted) {
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= 10) setIsCleared(true);
            return newScore;
          });
          obstacleRef.current.counted = true; // 1回だけカウント
        }
      }
    }, 50);
    return () => clearInterval(checkCollision);
  }, [isPaused, isGameOver, isCleared]);

  useEffect(() => {
    if (obstacleRef.current) {
      const obs = obstacleRef.current;
      const handleAnimationIteration = () => {
        obs.counted = false; // 再び通過判定できるようにする
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
    </div>
  );
};

export default Game;
