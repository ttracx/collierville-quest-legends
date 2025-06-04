
import React from 'react';
import { GameState, GAME_STATES } from '../../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../../utils/uiHelpers';
import { createParticle, Particle } from '../../utils/particleSystem';
import { loreManager } from '../../utils/loreManager';

interface MenuButtonsProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  particles: Particle[];
  onStateChange: (state: GameState) => void;
}

export const MenuButtons: React.FC<MenuButtonsProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  particles,
  onStateChange
}) => {
  // Enhanced buttons with hover effects
  const buttonX = canvas.width / 2 - 100;
  const startHovered = isButtonHovered(buttonX, 400, 200, 50, mouseX, mouseY, canvas);
  const instructionsHovered = isButtonHovered(buttonX, 460, 200, 50, mouseX, mouseY, canvas);
  const leaderboardHovered = isButtonHovered(buttonX, 520, 200, 50, mouseX, mouseY, canvas);
  const saveLoadHovered = isButtonHovered(buttonX, 580, 200, 50, mouseX, mouseY, canvas);
  
  drawGradientButton(ctx, buttonX, 400, 200, 50, 'START GAME', '#ff6b35', '#ff4500', startHovered);
  drawGradientButton(ctx, buttonX, 460, 200, 50, 'INSTRUCTIONS', '#2196F3', '#1976D2', instructionsHovered);
  drawGradientButton(ctx, buttonX, 520, 200, 50, 'LEADERBOARD', '#9c27b0', '#7b1fa2', leaderboardHovered);
  drawGradientButton(ctx, buttonX, 580, 200, 50, 'SAVE/LOAD', '#4caf50', '#388e3c', saveLoadHovered);

  if (isButtonClicked(buttonX, 400, 200, 50, mouseX, mouseY, clicked, canvas)) {
    createParticle(canvas.width / 2, 425, '#ff6b35', 'burst', particles);
    createParticle(canvas.width / 2, 425, '#FFD700', 'burst', particles);
    
    // Generate lore when starting game
    if (!loreManager.isLoaded()) {
      loreManager.generateGameLore();
    }
    
    onStateChange(GAME_STATES.MAP);
  }
  if (isButtonClicked(buttonX, 460, 200, 50, mouseX, mouseY, clicked, canvas)) {
    createParticle(canvas.width / 2, 485, '#2196F3', 'burst', particles);
    onStateChange(GAME_STATES.INSTRUCTIONS);
  }
  if (isButtonClicked(buttonX, 520, 200, 50, mouseX, mouseY, clicked, canvas)) {
    createParticle(canvas.width / 2, 545, '#9c27b0', 'burst', particles);
    onStateChange(GAME_STATES.LEADERBOARD);
  }
  if (isButtonClicked(buttonX, 580, 200, 50, mouseX, mouseY, clicked, canvas)) {
    createParticle(canvas.width / 2, 605, '#4caf50', 'burst', particles);
    onStateChange(GAME_STATES.SAVE_LOAD);
  }

  drawText(ctx, 'Click characters or buttons to play', canvas.width / 2, 650, 16, '#888');

  // Show AI status
  drawText(ctx, '✓ AI Features Enabled', canvas.width / 2, 680, 12, '#4CAF50', 'center');

  return null;
};
