
import React from 'react';
import { GameState, GAME_STATES } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered, getResponsivePosition } from '../utils/uiHelpers';
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

  // Responsive positioning for title
  const titlePos = getResponsivePosition(400, 80, canvas);
  drawText(ctx, 'SELECT A CHALLENGE', titlePos.x, titlePos.y, 36, '#ff6b35', 'center', true);

  // Draw characters with responsive positioning
  const xavierPos = getResponsivePosition(340, 130, canvas);
  const mortyPos = getResponsivePosition(460, 130, canvas);
  
  drawXavier(ctx, xavierPos.x, xavierPos.y, 1, true, frameCount, xavierImage, xavierImageLoaded);
  drawMorty(ctx, mortyPos.x, mortyPos.y, 1, true, frameCount, mortyImage, mortyImageLoaded);
  
  // Add trail particles to both characters
  if (frameCount % 30 === 0) {
    createParticle(xavierPos.x + (Math.random() - 0.5) * 20, xavierPos.y + 50, '#FFD700', 'trail', particles);
    createParticle(mortyPos.x + (Math.random() - 0.5) * 20, mortyPos.y + 50, '#00BFFF', 'trail', particles);
  }

  // Dynamic button positioning based on screen orientation
  const isLandscape = canvas.width > canvas.height;
  
  let games;
  if (isLandscape) {
    // Horizontal layout for landscape
    games = [
      { name: 'Front Desk\nCheck-In', state: GAME_STATES.FRONTDESK, x: 200, y: 200 },
      { name: 'Workout\nChallenge', state: GAME_STATES.WORKOUT, x: 400, y: 200 },
      { name: 'Smoothie\nRush', state: GAME_STATES.SMOOTHIE, x: 600, y: 200 }
    ];
  } else {
    // Vertical layout for portrait
    games = [
      { name: 'Front Desk\nCheck-In', state: GAME_STATES.FRONTDESK, x: 400, y: 220 },
      { name: 'Workout\nChallenge', state: GAME_STATES.WORKOUT, x: 400, y: 320 },
      { name: 'Smoothie\nRush', state: GAME_STATES.SMOOTHIE, x: 400, y: 420 }
    ];
  }

  games.forEach(game => {
    const gamePos = getResponsivePosition(game.x, game.y, canvas);
    const completed = completedGames.has(game.state);
    const hovered = isButtonHovered(game.x, game.y, 150, 80, mouseX, mouseY, canvas);
    const color1 = completed ? '#4CAF50' : '#ff6b35';
    const color2 = completed ? '#388E3C' : '#ff4500';

    // Enhanced button with gradient and glow
    const gradient = ctx.createLinearGradient(gamePos.x - 75, gamePos.y - 40, gamePos.x - 75, gamePos.y + 40);
    gradient.addColorStop(0, hovered ? color2 : color1);
    gradient.addColorStop(1, hovered ? color1 : color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(gamePos.x - 75, gamePos.y - 40, 150, 80);
    
    if (hovered || completed) {
      ctx.shadowColor = color1;
      ctx.shadowBlur = 15;
    }
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(gamePos.x - 75, gamePos.y - 40, 150, 80);
    ctx.shadowBlur = 0;

    const lines = game.name.split('\n');
    lines.forEach((line, i) => {
      drawText(ctx, line, gamePos.x, gamePos.y - 10 + i * 20, 16, 'white', 'center', true);
    });

    if (completed) {
      ctx.save();
      ctx.shadowColor = '#4CAF50';
      ctx.shadowBlur = 10;
      drawText(ctx, '✓', gamePos.x, gamePos.y + 25, 30, '#4CAF50', 'center');
      ctx.restore();
    }

    if (!completed && isButtonClicked(game.x, game.y, 150, 80, mouseX, mouseY, clicked, canvas)) {
      // Create explosion effect
      for (let i = 0; i < 10; i++) {
        createParticle(gamePos.x, gamePos.y, color1, 'burst', particles);
      }
      onInitMiniGame(game.state);
      onStateChange(game.state);
    }
  });

  // Animated score display
  const scoreFloat = Math.sin(frameCount * 0.1) * 2;
  const scorePos = getResponsivePosition(400, isLandscape ? 350 : 520, canvas);
  drawText(ctx, `Score: ${totalScore}`, scorePos.x, scorePos.y + scoreFloat, 24, 'white', 'center', true);

  if (completedGames.size === 3) {
    const victoryPos = getResponsivePosition(400, isLandscape ? 400 : 560, canvas);
    const victoryHovered = isButtonHovered(300, isLandscape ? 400 : 560, 200, 60, mouseX, mouseY, canvas);
    drawGradientButton(ctx, 300, isLandscape ? 400 : 560, 200, 60, 'VICTORY!', '#4CAF50', '#FFD700', victoryHovered);
    
    // Victory sparkles
    if (frameCount % 5 === 0) {
      createParticle(victoryPos.x + (Math.random() - 0.5) * 200, victoryPos.y + (Math.random() - 0.5) * 60, '#FFD700', 'burst', particles);
    }
    
    if (isButtonClicked(300, isLandscape ? 400 : 560, 200, 60, mouseX, mouseY, clicked, canvas)) {
      onStateChange(GAME_STATES.VICTORY);
    }
  }

  return null;
};
