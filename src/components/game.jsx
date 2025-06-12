import React, { useState, useEffect, useRef } from 'react';
import './game.css';
import characterImg from '../assets/character.png';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);             // 🔹 スコア用のstate
  const [isGameOver, setIsGameOver] = useState(false); // 🔹 GameOverフラグ
  const characterRef = useRef(null);
  const obstacleRef = useRef(null);

  // スコア更新ループ（毎秒+1）
  useEffect(() => {
    if (isGameOver) return; // ゲームオーバー中は止める
    const scoreInterval = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(scoreInterval);
  }, [isGameOver]);

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
          setIsGameOver(true); // フラグだけ立てる
        }
      }
    }, 50);
    return () => clearInterval(checkCollision);
  }, []);


  return (
    <div className="game-container">
      <h1>JUMP GAME</h1>
      <p>Score: 0</p>
      <p>Score: {score}</p>  {/* スコア反映 */}
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
      {isGameOver ? <p className="game-over">💥 GAME OVER 💥</p> : <p>Press Space to Jump</p>}
    </div>
  );
};

export default Game;
