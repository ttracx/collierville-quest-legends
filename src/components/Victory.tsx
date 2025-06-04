
import React from 'react';
import { GameState, GAME_STATES } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';
import { drawXavier, drawMorty } from '../utils/characterDrawing';
import { createParticle, Particle } from '../utils/particleSystem';

interface VictoryProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  totalScore: number;
  particles: Particle[];
  xavierImage?: HTMLImageElement;
  xavierImageLoaded?: boolean;
  mortyImage?: HTMLImageElement;
  mortyImageLoaded?: boolean;
  mikeImage?: HTMLImageElement;
  mikeImageLoaded?: boolean;
  carsonImage?: HTMLImageElement;
  carsonImageLoaded?: boolean;
  avaImage?: HTMLImageElement;
  avaImageLoaded?: boolean;
  onStateChange: (state: GameState) => void;
  completedGames: Set<GameState>;
}

export const Victory: React.FC<VictoryProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  totalScore,
  particles,
  xavierImage,
  xavierImageLoaded,
  mortyImage,
  mortyImageLoaded,
  onStateChange,
  completedGames
}) => {
  // Animated victory background
  const victoryGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
  victoryGradient.addColorStop(0, '#FFD700');
  victoryGradient.addColorStop(0.5, '#FFA500');
  victoryGradient.addColorStop(1, '#FF6347');
  ctx.fillStyle = victoryGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continuous celebration particles
  if (frameCount % 10 === 0) {
    createParticle(Math.random() * canvas.width, 0, '#FFD700', 'burst', particles);
    createParticle(Math.random() * canvas.width, 0, '#4CAF50', 'burst', particles);
    createParticle(Math.random() * canvas.width, 0, '#2196F3', 'burst', particles);
  }

  const titlePulse = 1 + Math.sin(frameCount * 0.1) * 0.1;
  
  // Victory title with animation
  ctx.save();
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 30;
  drawText(ctx, 'VICTORY!', canvas.width / 2, 100, 48 * titlePulse, '#FF4500', 'center', true);
  ctx.restore();

  drawText(ctx, 'Congratulations!', canvas.width / 2, 150, 28, 'white', 'center', true);
  drawText(ctx, 'Xavier & Morty completed all challenges!', canvas.width / 2, 180, 20, 'white', 'center', true);

  // Draw both victory characters with celebration animation
  const celebrationBob = Math.sin(frameCount * 0.15) * 10;
  drawXavier(ctx, canvas.width / 2 - 100, 250 + celebrationBob, 1.5, true, frameCount, xavierImage, xavierImageLoaded);
  drawMorty(ctx, canvas.width / 2 + 100, 250 - celebrationBob, 1.5, true, frameCount, mortyImage, mortyImageLoaded);

  // Victory sparkles around characters
  if (frameCount % 20 === 0) {
    createParticle(canvas.width / 2 - 100 + (Math.random() - 0.5) * 60, 250, '#FFD700', 'burst', particles);
    createParticle(canvas.width / 2 + 100 + (Math.random() - 0.5) * 60, 250, '#00BFFF', 'burst', particles);
  }

  // Score display with glow
  ctx.save();
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 15;
  drawText(ctx, `Final Score: ${totalScore}`, canvas.width / 2, 450, 32, '#FFD700', 'center', true);
  ctx.restore();

  // Performance rating
  let rating = 'Good Job!';
  let ratingColor = '#4CAF50';
  if (totalScore > 1500) {
    rating = 'AMAZING!';
    ratingColor = '#FFD700';
  } else if (totalScore > 1000) {
    rating = 'Excellent!';
    ratingColor = '#FF6347';
  } else if (totalScore > 500) {
    rating = 'Great!';
    ratingColor = '#FFA500';
  }

  drawText(ctx, rating, canvas.width / 2, 480, 24, ratingColor, 'center', true);

  // Play again and main menu buttons - NOW PASSING CANVAS PARAMETER
  const playAgainHovered = isButtonHovered(200, 520, 180, 60, mouseX, mouseY, canvas);
  drawGradientButton(ctx, 200, 520, 180, 60, 'PLAY AGAIN', '#4CAF50', '#388E3C', playAgainHovered);
  
  const menuHovered = isButtonHovered(420, 520, 180, 60, mouseX, mouseY, canvas);
  drawGradientButton(ctx, 420, 520, 180, 60, 'MAIN MENU', '#2196F3', '#1976D2', menuHovered);

  if (isButtonClicked(200, 520, 180, 60, mouseX, mouseY, clicked, canvas)) {
    // Reset game for replay
    createParticle(290, 550, '#4CAF50', 'burst', particles);
    onStateChange(GAME_STATES.MAP);
  }

  if (isButtonClicked(420, 520, 180, 60, mouseX, mouseY, clicked, canvas)) {
    createParticle(510, 550, '#2196F3', 'burst', particles);
    onStateChange(GAME_STATES.MENU);
  }

  return null;
};
