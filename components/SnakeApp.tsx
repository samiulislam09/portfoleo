"use client";
import React, { useState, useEffect } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120;

export function SnakeApp() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp': if (dir.y !== 1) setDir({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (dir.y !== -1) setDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (dir.x !== 1) setDir({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (dir.x !== -1) setDir({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir, isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };
        
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return prev;
        }
        
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(intervalId);
  }, [dir, isPlaying, gameOver, food]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setFood({ x: 5, y: 5 });
  };

  const getHeadRotation = () => {
    if (dir.y === -1) return 0;
    if (dir.x === 1) return 90;
    if (dir.y === 1) return 180;
    if (dir.x === -1) return 270;
    return 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#111', color: '#fff', borderRadius: '0 0 8px 8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: GRID_SIZE * CELL_SIZE, marginBottom: '10px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>Score: {score}</span>
        {gameOver && <span style={{ color: '#ff4444', fontWeight: 'bold' }}>GAME OVER</span>}
      </div>
      
      <div 
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE, 
          backgroundColor: '#2a2a2a', 
          position: 'relative',
          border: '2px solid #444',
          boxSizing: 'content-box',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
        }}
      >
        {!isPlaying && !gameOver && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20 }}>
            <button onClick={startGame} className="mint-button" style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>Play Snake</button>
          </div>
        )}
        {gameOver && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 20 }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#ff4444', fontSize: '1.5rem' }}>Final Score: {score}</h3>
            <button onClick={startGame} className="mint-button">Try Again</button>
          </div>
        )}
        
        {/* Food (Apple) */}
        <div style={{
          position: 'absolute',
          left: food.x * CELL_SIZE,
          top: food.y * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
          zIndex: 5
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 30% 30%, #ff5252 0%, #c62828 80%)',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
          }} />
          <div style={{
            position: 'absolute',
            top: '-15%',
            right: '15%',
            width: '40%',
            height: '40%',
            backgroundColor: '#4caf50',
            borderRadius: '0 50% 50% 50%',
            transform: 'rotate(-45deg)'
          }} />
        </div>
        
        {/* Snake */}
        {snake.map((segment, i) => {
          const isHead = i === 0;
          const isTail = i === snake.length - 1 && i !== 0;
          
          if (isHead) {
            return (
              <div key={i} style={{
                position: 'absolute',
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: '#2e7d32',
                borderRadius: '50% 50% 20% 20%',
                transform: `rotate(${getHeadRotation()}deg)`,
                zIndex: 10,
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
              }}>
                {/* Left Eye */}
                <div style={{ position: 'absolute', top: '15%', left: '15%', width: '30%', height: '30%', background: 'white', borderRadius: '50%' }}>
                  <div style={{ position: 'absolute', top: '20%', left: '20%', width: '40%', height: '40%', background: 'black', borderRadius: '50%' }} />
                </div>
                {/* Right Eye */}
                <div style={{ position: 'absolute', top: '15%', right: '15%', width: '30%', height: '30%', background: 'white', borderRadius: '50%' }}>
                  <div style={{ position: 'absolute', top: '20%', left: '20%', width: '40%', height: '40%', background: 'black', borderRadius: '50%' }} />
                </div>
                {/* Tongue */}
                <div style={{ position: 'absolute', top: '-30%', left: '45%', width: '10%', height: '30%', background: '#ff3333', zIndex: -1, borderRadius: '2px' }} />
              </div>
            );
          }

          return (
            <div key={i} style={{
              position: 'absolute',
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              background: 'radial-gradient(circle at 30% 30%, #66bb6a 0%, #2e7d32 80%)',
              borderRadius: isTail ? '50%' : '35%',
              zIndex: 9,
              transform: 'scale(0.9)',
              boxShadow: 'inset -1px -1px 4px rgba(0,0,0,0.6)'
            }} />
          );
        })}
      </div>
      
      <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1.5rem' }}>Use arrow keys to move. Click to play.</p>
    </div>
  );
}
