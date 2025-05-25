
import React from 'react';
import { GameState, GAME_STATES } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';
import { drawXavier, drawMorty } from '../utils/characterDrawing';
import { drawBackgroundStars, createParticle, Particle } from '../utils/particleSystem';

interface GameMenuProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  backgroundStars: any[];
  particles: Particle[];
  xavierImage?: HTMLImageElement;
  xavierImageLoaded?: boolean;
  mortyImage?: HTMLImageElement;
  mortyImageLoaded?: boolean;
  onStateChange: (state: GameState) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  backgroundStars,
  particles,
  xavierImage,
  xavierImageLoaded,
  mortyImage,
  mortyImageLoaded,
  onStateChange
}) => {
  // Animated gradient background
  const bgGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
  bgGradient.addColorStop(0, '#2a1a3a');
  bgGradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBackgroundStars(ctx, backgroundStars, canvas.height, canvas.width);

  const titleFloat = frameCount * 0.02;
  const menuPulse = frameCount * 0.05;
  
  const titleY = 120 + Math.sin(titleFloat) * 5;
  const pulseScale = 1 + Math.sin(menuPulse) * 0.05;

  // Title with glow effect
  ctx.save();
  ctx.shadowColor = '#ff6b35';
  ctx.shadowBlur = 20;
  drawText(ctx, 'LIFETIME LEGENDS', canvas.width / 2, titleY, 48 * pulseScale, '#ff6b35', 'center', true);
  ctx.restore();
  
  drawText(ctx, 'Collierville Quest', canvas.width / 2, 170, 32, 'white', 'center', true);
  drawText(ctx, 'Starring Xavier & Morty', canvas.width / 2, 210, 20, '#ccc', 'center', true);

  // Draw both characters with animation
  drawXavier(ctx, canvas.width / 2 - 80, 290, 1.2, true, frameCount, xavierImage, xavierImageLoaded);
  drawText(ctx, 'Xavier', canvas.width / 2 - 80, 360, 16, 'white', 'center', true);
  
  drawMorty(ctx, canvas.width / 2 + 80, 290, 1.2, true, frameCount, mortyImage, mortyImageLoaded);
  drawText(ctx, 'Morty', canvas.width / 2 + 80, 360, 16, 'white', 'center', true);

  // Enhanced buttons with hover effects
  const startHovered = isButtonHovered(300, 400, 200, 60, mouseX, mouseY);
  const instructionsHovered = isButtonHovered(300, 480, 200, 60, mouseX, mouseY);
  
  drawGradientButton(ctx, 300, 400, 200, 60, 'START GAME', '#ff6b35', '#ff4500', startHovered);
  drawGradientButton(ctx, 300, 480, 200, 60, 'INSTRUCTIONS', '#2196F3', '#1976D2', instructionsHovered);

  if (isButtonClicked(300, 400, 200, 60, mouseX, mouseY, clicked)) {
    createParticle(400, 430, '#ff6b35', 'burst', particles);
    createParticle(400, 430, '#FFD700', 'burst', particles);
    onStateChange(GAME_STATES.MAP);
  }
  if (isButtonClicked(300, 480, 200, 60, mouseX, mouseY, clicked)) {
    createParticle(400, 510, '#2196F3', 'burst', particles);
    onStateChange(GAME_STATES.INSTRUCTIONS);
  }

  drawText(ctx, 'Click or tap to play', canvas.width / 2, 560, 16, '#888');

  return null;
};
