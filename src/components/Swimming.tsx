
import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked } from '../utils/uiHelpers';
import { createParticle, Particle } from '../utils/particleSystem';

interface SwimmingProps {
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

export const Swimming: React.FC<SwimmingProps> = ({
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
  const swimmingData = gameData.swimming;

  // Game setup
  if (swimmingData.timer <= 0 && swimmingData.timer !== -1) {
    swimmingData.timer = 60;
    swimmingData.stamina = 100;
  }

  // Pool background
  const poolGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  poolGradient.addColorStop(0, '#87CEEB');
  poolGradient.addColorStop(1, '#4682B4');
  ctx.fillStyle = poolGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pool lanes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 1; i < 6; i++) {
    const y = (canvas.height / 6) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Swimming controls
  const leftPressed = keys['ArrowLeft'] || keys['a'] || keys['A'];
  const rightPressed = keys['ArrowRight'] || keys['d'] || keys['D'];
  
  // Swimming mechanics
  if (leftPressed && rightPressed) {
    // Perfect rhythm - both keys pressed
    swimmingData.speed = Math.min(swimmingData.speed + 0.5, 10);
    swimmingData.rhythm = Math.min(swimmingData.rhythm + 2, 100);
    swimmingData.stamina = Math.max(swimmingData.stamina - 0.3, 0);
  } else if (leftPressed || rightPressed) {
    // Single stroke
    swimmingData.speed = Math.min(swimmingData.speed + 0.2, 8);
    swimmingData.rhythm = Math.max(swimmingData.rhythm - 1, 0);
    swimmingData.stamina = Math.max(swimmingData.stamina - 0.5, 0);
  } else {
    // No input - slowing down
    swimmingData.speed = Math.max(swimmingData.speed - 0.3, 0);
    swimmingData.rhythm = Math.max(swimmingData.rhythm - 0.5, 0);
    swimmingData.stamina = Math.min(swimmingData.stamina + 0.1, 100);
  }

  // Update position
  swimmingData.position += swimmingData.speed;

  // Lap completion
  if (swimmingData.position >= canvas.width - 100) {
    swimmingData.laps++;
    swimmingData.position = 100;
    swimmingData.score += Math.round(swimmingData.rhythm + swimmingData.speed * 10);
    
    // Create splash particles
    for (let i = 0; i < 8; i++) {
      createParticle(canvas.width - 100, canvas.height / 2, '#87CEEB', 'burst', particles);
    }
  }

  // Draw swimmer
  const swimmerY = canvas.height / 2;
  ctx.save();
  
  // Body
  ctx.fillStyle = '#ffdbac';
  ctx.fillRect(swimmingData.position - 20, swimmerY - 5, 40, 10);
  
  // Arms (animated)
  const armAnimation = Math.sin(frameCount * 0.3) * 20;
  ctx.fillStyle = '#ffdbac';
  ctx.beginPath();
  ctx.arc(swimmingData.position - 15, swimmerY + armAnimation * 0.1, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(swimmingData.position + 15, swimmerY - armAnimation * 0.1, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = '#ffdbac';
  ctx.beginPath();
  ctx.arc(swimmingData.position, swimmerY - 8, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Swimming goggles
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(swimmingData.position, swimmerY - 8, 6, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();

  // Water ripples
  if (swimmingData.speed > 0) {
    for (let i = 0; i < 3; i++) {
      const rippleX = swimmingData.position - (i * 20);
      const rippleSize = (frameCount + i * 10) % 60;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - rippleSize / 60})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rippleX, swimmerY, rippleSize, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Timer countdown
  if (swimmingData.timer > 0) {
    swimmingData.timer -= 1/60;
  }

  // UI Elements
  drawText(ctx, 'SWIMMING CHALLENGE', canvas.width / 2, 50, 32, '#4682B4', 'center', true);
  drawText(ctx, `Time: ${Math.ceil(swimmingData.timer)}s`, 50, 100, 20, 'white', 'left');
  drawText(ctx, `Laps: ${swimmingData.laps}`, 50, 130, 20, 'white', 'left');
  drawText(ctx, `Speed: ${swimmingData.speed.toFixed(1)}`, 50, 160, 20, 'white', 'left');
  drawText(ctx, `Score: ${swimmingData.score}`, 50, 190, 20, '#FFD700', 'left');

  // Stamina bar
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(50, 220, 200, 20);
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(50, 220, (swimmingData.stamina / 100) * 200, 20);
  drawText(ctx, `Stamina: ${Math.round(swimmingData.stamina)}%`, 50, 250, 16, 'white', 'left');

  // Rhythm indicator
  const rhythmColor = swimmingData.rhythm > 70 ? '#4CAF50' : swimmingData.rhythm > 40 ? '#FFD700' : '#ff4444';
  drawText(ctx, `Rhythm: ${Math.round(swimmingData.rhythm)}%`, 50, 270, 16, rhythmColor, 'left');

  // Instructions
  drawText(ctx, 'Press A and D alternately for perfect rhythm!', canvas.width / 2, canvas.height - 50, 18, 'white', 'center');
  drawText(ctx, 'Both keys together = Power Stroke!', canvas.width / 2, canvas.height - 25, 16, '#FFD700', 'center');

  // Game over check
  if (swimmingData.timer <= 0 || swimmingData.stamina <= 0) {
    const finalScore = swimmingData.score + (swimmingData.laps * 50);
    
    drawText(ctx, swimmingData.stamina <= 0 ? 'EXHAUSTED!' : 'TIME UP!', canvas.width / 2, canvas.height / 2 - 50, 36, '#4682B4', 'center', true);
    drawText(ctx, `Final Score: ${finalScore}`, canvas.width / 2, canvas.height / 2, 24, '#FFD700', 'center');
    drawText(ctx, `Lap Bonus: ${swimmingData.laps * 50}`, canvas.width / 2, canvas.height / 2 + 30, 20, '#4CAF50', 'center');

    if (isButtonClicked(300, canvas.height / 2 + 80, 200, 60, mouseX, mouseY, clicked, canvas)) {
      gameData.totalScore += finalScore;
      gameData.completedGames.add(GAME_STATES.SWIMMING);
      onUpdateGameData({ ...gameData });
      onStateChange(GAME_STATES.MAP);
    }
    
    drawGradientButton(ctx, 300, canvas.height / 2 + 80, 200, 60, 'FINISH', '#4CAF50', '#388E3C', false);
  }

  onUpdateGameData({ ...gameData });
  return null;
};
