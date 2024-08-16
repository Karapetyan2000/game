import React, { useRef, useEffect, useState } from 'react';
import './Game.css';
import SettingsMenu from './SettingsMenu';

const Game = () => {
  const canvasRef = useRef(null);
  const [playerSettings, setPlayerSettings] = useState([
    { color: 'red', speed: 5, fireRate: 1000 },
    { color: 'blue', speed: 5, fireRate: 1000 }
  ]);
  const [showSettings, setShowSettings] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const playerRadius = 20;
    const bulletRadius = 5;
    const players = [
      { x: 50, y: canvas.height / 2, dy: playerSettings[0].speed, color: playerSettings[0].color, fireRate: playerSettings[0].fireRate, lastFire: 0 },
      { x: canvas.width - 50, y: canvas.height / 2, dy: playerSettings[1].speed, color: playerSettings[1].color, fireRate: playerSettings[1].fireRate, lastFire: 0 }
    ];
    const bullets = [];
    let hits = [0, 0];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      players.forEach(player => {
        ctx.beginPath();
        ctx.arc(player.x, player.y, playerRadius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.closePath();
      });
      bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bulletRadius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        ctx.closePath();
      });
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText(`Hits: ${hits[0]} - ${hits[1]}`, canvas.width / 2 - 50, 30);
    };

    const update = (time) => {
      players.forEach(player => {
        player.y += player.dy;
        if (player.y - playerRadius < 0 || player.y + playerRadius > canvas.height) {
          player.dy = -player.dy;
        }
        if (time - player.lastFire > player.fireRate) {
          bullets.push({ x: player.x, y: player.y, dx: player.x === 50 ? 10 : -10, dy: 0, color: player.color });
          player.lastFire = time;
        }
      });
      bullets.forEach((bullet, index) => {
        bullet.x += bullet.dx;
        players.forEach((player, playerIndex) => {
          if (Math.hypot(bullet.x - player.x, bullet.y - player.y) < playerRadius + bulletRadius) {
            hits[playerIndex === 0 ? 1 : 0]++;
            bullets.splice(index, 1);
          }
        });
        if (bullet.x < 0 || bullet.x > canvas.width) {
          bullets.splice(index, 1);
        }
      });
    };

    const gameLoop = (time) => {
      update(time);
      draw();
      animationFrameId = window.requestAnimationFrame(gameLoop);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseY = event.clientY - rect.top;
      players.forEach(player => {
        if (Math.abs(mouseY - player.y) < playerRadius) {
          player.dy = -player.dy;
          player.y = mouseY;
        }
      });
    };

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      players.forEach((player, index) => {
        if (Math.hypot(mouseX - player.x, mouseY - player.y) < playerRadius) {
          setShowSettings(index);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    gameLoop();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [playerSettings]);

  return (
    <div className="game">
      <canvas ref={canvasRef} width={800} height={600} />
      {showSettings !== null && (
        <SettingsMenu
          settings={playerSettings[showSettings]}
          onClose={() => setShowSettings(null)}
          onSave={(newSettings) => {
            const newPlayerSettings = [...playerSettings];
            newPlayerSettings[showSettings] = newSettings;
            setPlayerSettings(newPlayerSettings);
            setShowSettings(null);
          }}
        />
      )}
    </div>
  );
};

export default Game;