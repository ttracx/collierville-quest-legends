
import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked } from '../utils/uiHelpers';
import { createParticle, Particle } from '../utils/particleSystem';

interface BasketballProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  gameData: GameData;
  keys: { [key: string]: boolean };
  particles: Particle[];
  onStateChange: (state: GameState) => void;
  onUpdateGameData: (gameData: GameData) => void;
}

export const Basketball: React.FC<BasketballProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  gameData,
  keys,
  particles,
  onStateChange,
  onUpdateGameData
}) => {
  const basketballData = gameData.basketball;

  // Game setup
  if (basketballData.timer <= 0 && basketballData.timer !== -1) {
    basketballData.timer = 45; // 45 second game
  }

  // Background
  const courtGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  courtGradient.addColorStop(0, '#4a5568');
  courtGradient.addColorStop(1, '#2d3748');
  ctx.fillStyle = courtGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw basketball court elements
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  
  // Court lines
  ctx.beginPath();
  ctx.rect(100, 100, canvas.width - 200, canvas.height - 200);
  ctx.stroke();
  
  // Basketball hoop
  const hoopX = canvas.width / 2;
  const hoopY = 120;
  
  ctx.fillStyle = '#ff6b35';
  ctx.fillRect(hoopX - 30, hoopY, 60, 8);
  
  // Net
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(hoopX - 25 + i * 10, hoopY + 8);
    ctx.lineTo(hoopX - 20 + i * 8, hoopY + 30);
    ctx.stroke();
  }

  // Ball physics
  const ballRadius = 15;
  const gravity = 0.5;
  const bounce = 0.7;

  // Handle mouse/touch controls for shooting
  if (clicked && basketballData.ballY > canvas.height - 100) {
    const power = Math.min(100, Math.sqrt(Math.pow(mouseX - basketballData.ballX, 2) + Math.pow(mouseY - basketballData.ballY, 2)) / 3);
    const angle = Math.atan2(mouseY - basketballData.ballY, mouseX - basketballData.ballX);
    
    basketballData.ballVelocityX = Math.cos(angle) * power * 0.3;
    basketballData.ballVelocityY = Math.sin(angle) * power * 0.3;
    basketballData.shots++;
  }

  // Update ball position
  basketballData.ballVelocityY += gravity;
  basketballData.ballX += basketballData.ballVelocityX;
  basketballData.ballY += basketballData.ballVelocityY;

  // Ball collision with ground
  if (basketballData.ballY > canvas.height - 50 - ballRadius) {
    basketballData.ballY = canvas.height - 50 - ballRadius;
    basketballData.ballVelocityY *= -bounce;
    basketballData.ballVelocityX *= 0.8;
    
    if (Math.abs(basketballData.ballVelocityY) < 2) {
      basketballData.ballVelocityY = 0;
    }
  }

  // Ball collision with walls
  if (basketballData.ballX < ballRadius || basketballData.ballX > canvas.width - ballRadius) {
    basketballData.ballVelocityX *= -bounce;
    basketballData.ballX = basketballData.ballX < ballRadius ? ballRadius : canvas.width - ballRadius;
  }

  // Check for basket score
  if (basketballData.ballX > hoopX - 30 && basketballData.ballX < hoopX + 30 && 
      basketballData.ballY > hoopY - 10 && basketballData.ballY < hoopY + 20 &&
      basketballData.ballVelocityY > 0) {
    basketballData.makes++;
    basketballData.score += 100;
    
    // Reset ball position
    basketballData.ballX = canvas.width / 2;
    basketballData.ballY = canvas.height - 100;
    basketballData.ballVelocityX = 0;
    basketballData.ballVelocityY = 0;
    
    // Create celebration particles
    for (let i = 0; i < 10; i++) {
      createParticle(hoopX, hoopY, '#FFD700', 'burst', particles);
    }
  }

  // Draw basketball
  ctx.save();
  ctx.fillStyle = '#ff6b35';
  ctx.beginPath();
  ctx.arc(basketballData.ballX, basketballData.ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Basketball lines
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(basketballData.ballX, basketballData.ballY, ballRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(basketballData.ballX - ballRadius, basketballData.ballY);
  ctx.lineTo(basketballData.ballX + ballRadius, basketballData.ballY);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(basketballData.ballX, basketballData.ballY - ballRadius);
  ctx.lineTo(basketballData.ballX, basketballData.ballY + ballRadius);
  ctx.stroke();
  ctx.restore();

  // Timer countdown
  if (basketballData.timer > 0) {
    basketballData.timer -= 1/60;
  }

  // UI Elements
  drawText(ctx, 'BASKETBALL CHALLENGE', canvas.width / 2, 50, 32, '#ff6b35', 'center', true);
  drawText(ctx, `Time: ${Math.ceil(basketballData.timer)}s`, 100, 100, 20, 'white', 'left');
  drawText(ctx, `Shots: ${basketballData.shots}`, 100, 130, 20, 'white', 'left');
  drawText(ctx, `Makes: ${basketballData.makes}`, 100, 160, 20, 'white', 'left');
  drawText(ctx, `Score: ${basketballData.score}`, 100, 190, 20, '#FFD700', 'left');

  const accuracy = basketballData.shots > 0 ? Math.round((basketballData.makes / basketballData.shots) * 100) : 0;
  drawText(ctx, `Accuracy: ${accuracy}%`, 100, 220, 20, '#4CAF50', 'left');

  // Shooting guide
  if (basketballData.ballY > canvas.height - 100) {
    drawText(ctx, 'Click to aim and shoot!', canvas.width / 2, canvas.height - 30, 18, '#ccc', 'center');
    
    // Draw aiming line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(basketballData.ballX, basketballData.ballY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Game over check
  if (basketballData.timer <= 0) {
    const finalScore = basketballData.score + (accuracy * 10);
    
    drawText(ctx, 'TIME UP!', canvas.width / 2, canvas.height / 2 - 50, 36, '#ff6b35', 'center', true);
    drawText(ctx, `Final Score: ${finalScore}`, canvas.width / 2, canvas.height / 2, 24, '#FFD700', 'center');
    drawText(ctx, `Accuracy Bonus: ${accuracy * 10}`, canvas.width / 2, canvas.height / 2 + 30, 20, '#4CAF50', 'center');

    if (isButtonClicked(300, canvas.height / 2 + 80, 200, 60, mouseX, mouseY, clicked, canvas)) {
      gameData.totalScore += finalScore;
      gameData.completedGames.add(GAME_STATES.BASKETBALL);
      onUpdateGameData({ ...gameData });
      onStateChange(GAME_STATES.MAP);
    }
    
    drawGradientButton(ctx, 300, canvas.height / 2 + 80, 200, 60, 'FINISH', '#4CAF50', '#388E3C', false);
  }

  onUpdateGameData({ ...gameData });
  return null;
};
