import React from 'react';
import { GameState, GAME_STATES } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';
import { drawXavier, drawMorty } from '../utils/characterDrawing';
import { createParticle, Particle } from '../utils/particleSystem';

interface GameMapProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  totalScore: number;
  completedGames: Set<GameState>;
  particles: Particle[];
  xavierImage?: HTMLImageElement;
  xavierImageLoaded?: boolean;
  mortyImage?: HTMLImageElement;
  mortyImageLoaded?: boolean;
  onStateChange: (state: GameState) => void;
  onInitMiniGame: (state: GameState) => void;
}

export const GameMap: React.FC<GameMapProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  totalScore,
  completedGames,
  particles,
  xavierImage,
  xavierImageLoaded,
  mortyImage,
  mortyImageLoaded,
  onStateChange,
  onInitMiniGame
}) => {
  // Animated background
  const mapGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  mapGradient.addColorStop(0, '#3c3c3c');
  mapGradient.addColorStop(1, '#2c2c2c');
  ctx.fillStyle = mapGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText(ctx, 'SELECT A CHALLENGE', canvas.width / 2, 80, 36, '#ff6b35', 'center', true);

  // Draw both characters on the map with trail particles
  drawXavier(ctx, canvas.width / 2 - 60, 130, 1, true, frameCount, xavierImage, xavierImageLoaded);
  drawMorty(ctx, canvas.width / 2 + 60, 130, 1, true, frameCount, mortyImage, mortyImageLoaded);
  
  // Add trail particles to both characters
  if (frameCount % 30 === 0) {
    createParticle(canvas.width / 2 - 60 + (Math.random() - 0.5) * 20, 180, '#FFD700', 'trail', particles);
    createParticle(canvas.width / 2 + 60 + (Math.random() - 0.5) * 20, 180, '#00BFFF', 'trail', particles);
  }

  // Draw mini-game buttons with enhanced effects - NOW PASSING CANVAS PARAMETER
  const games = [
    { name: 'Front Desk\nCheck-In', state: GAME_STATES.FRONTDESK, x: 150, y: 200 },
    { name: 'Workout\nChallenge', state: GAME_STATES.WORKOUT, x: 325, y: 200 },
    { name: 'Smoothie\nRush', state: GAME_STATES.SMOOTHIE, x: 500, y: 200 }
  ];

  games.forEach(game => {
    const completed = completedGames.has(game.state);
    const hovered = isButtonHovered(game.x, game.y, 150, 150, mouseX, mouseY, canvas);
    const color1 = completed ? '#4CAF50' : '#ff6b35';
    const color2 = completed ? '#388E3C' : '#ff4500';

    // Enhanced button with gradient and glow
    const gradient = ctx.createLinearGradient(game.x, game.y, game.x, game.y + 150);
    gradient.addColorStop(0, hovered ? color2 : color1);
    gradient.addColorStop(1, hovered ? color1 : color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(game.x, game.y, 150, 150);
    
    if (hovered || completed) {
      ctx.shadowColor = color1;
      ctx.shadowBlur = 15;
    }
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(game.x, game.y, 150, 150);
    ctx.shadowBlur = 0;

    const lines = game.name.split('\n');
    lines.forEach((line, i) => {
      drawText(ctx, line, game.x + 75, game.y + 60 + i * 30, 20, 'white', 'center', true);
    });

    if (completed) {
      ctx.save();
      ctx.shadowColor = '#4CAF50';
      ctx.shadowBlur = 10;
      drawText(ctx, '✓', game.x + 75, game.y + 120, 40, '#4CAF50', 'center');
      ctx.restore();
    }

    if (!completed && isButtonClicked(game.x, game.y, 150, 150, mouseX, mouseY, clicked, canvas)) {
      // Create explosion effect
      for (let i = 0; i < 10; i++) {
        createParticle(game.x + 75, game.y + 75, color1, 'burst', particles);
      }
      onInitMiniGame(game.state);
      onStateChange(game.state);
    }
  });

  // Animated score display
  const scoreFloat = Math.sin(frameCount * 0.1) * 2;
  drawText(ctx, `Score: ${totalScore}`, canvas.width / 2, 450 + scoreFloat, 24, 'white', 'center', true);

  if (completedGames.size === 3) {
    const victoryHovered = isButtonHovered(300, 500, 200, 60, mouseX, mouseY, canvas);
    drawGradientButton(ctx, 300, 500, 200, 60, 'VICTORY!', '#4CAF50', '#FFD700', victoryHovered);
    
    // Victory sparkles
    if (frameCount % 5 === 0) {
      createParticle(300 + Math.random() * 200, 500 + Math.random() * 60, '#FFD700', 'burst', particles);
    }
    
    if (isButtonClicked(300, 500, 200, 60, mouseX, mouseY, clicked, canvas)) {
      onStateChange(GAME_STATES.VICTORY);
    }
  }

  return null;
};
