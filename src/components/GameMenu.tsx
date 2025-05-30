import React from 'react';
import { GameState, GAME_STATES } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';
import { drawXavier, drawMorty, drawMike, drawCarson, drawAva } from '../utils/characterDrawing';
import { drawBackgroundStars, createParticle, Particle } from '../utils/particleSystem';
import { loreManager } from '../utils/loreManager';

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
  mikeImage?: HTMLImageElement;
  mikeImageLoaded?: boolean;
  carsonImage?: HTMLImageElement;
  carsonImageLoaded?: boolean;
  avaImage?: HTMLImageElement;
  avaImageLoaded?: boolean;
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
  xavierImageLoaded = false,
  mortyImage,
  mortyImageLoaded = false,
  mikeImage,
  mikeImageLoaded = false,
  carsonImage,
  carsonImageLoaded = false,
  avaImage,
  avaImageLoaded = false,
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
  drawText(ctx, 'Starring Xavier, Morty, Mike & Carson', canvas.width / 2, 210, 20, '#ccc', 'center', true);

  // Character positions and click areas - now with five characters
  const characterSpacing = 80;
  const xavierX = canvas.width / 2 - characterSpacing * 2;
  const mortyX = canvas.width / 2 - characterSpacing;
  const mikeX = canvas.width / 2;
  const carsonX = canvas.width / 2 + characterSpacing;
  const avaX = canvas.width / 2 + characterSpacing * 2;
  const characterY = 290;
  const characterClickRadius = 50;

  // Draw all five characters with animation
  drawXavier(ctx, xavierX, characterY, 1.2, true, frameCount, xavierImage, xavierImageLoaded);
  drawText(ctx, 'Xavier', xavierX, 360, 16, 'white', 'center', true);
  
  drawMorty(ctx, mortyX, characterY, 1.2, true, frameCount, mortyImage, mortyImageLoaded);
  drawText(ctx, 'Morty', mortyX, 360, 16, 'white', 'center', true);

  drawMike(ctx, mikeX, characterY, 1.2, true, frameCount, mikeImage, mikeImageLoaded);
  drawText(ctx, 'Mike', mikeX, 360, 16, 'white', 'center', true);
  drawText(ctx, 'Cafe Manager', mikeX, 380, 12, '#8B4513', 'center', true);

  drawCarson(ctx, carsonX, characterY, 1.2, true, frameCount, carsonImage, carsonImageLoaded);
  drawText(ctx, 'Carson', carsonX, 360, 16, 'white', 'center', true);
  drawText(ctx, 'Night Desk', carsonX, 380, 12, '#4169E1', 'center', true);

  drawAva(ctx, avaX, characterY, 1.2, true, frameCount, avaImage, avaImageLoaded);
  drawText(ctx, 'Ava', avaX, 360, 16, 'white', 'center', true);
  drawText(ctx, 'Cafe Worker', avaX, 380, 12, '#D2691E', 'center', true);

  // Check for character clicks (using circular hit detection)
  const distanceToXavier = Math.sqrt(Math.pow(mouseX - xavierX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToMorty = Math.sqrt(Math.pow(mouseX - mortyX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToMike = Math.sqrt(Math.pow(mouseX - mikeX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToCarson = Math.sqrt(Math.pow(mouseX - carsonX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToAva = Math.sqrt(Math.pow(mouseX - avaX, 2) + Math.pow(mouseY - characterY, 2));
  
  const xavierHovered = distanceToXavier < characterClickRadius;
  const mortyHovered = distanceToMorty < characterClickRadius;
  const mikeHovered = distanceToMike < characterClickRadius;
  const carsonHovered = distanceToCarson < characterClickRadius;
  const avaHovered = distanceToAva < characterClickRadius;

  // Add hover effects for characters
  if (xavierHovered) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(xavierX, characterY, characterClickRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawText(ctx, 'Click to start!', xavierX, characterY + 80, 14, '#FFD700', 'center', true);
  }

  if (mortyHovered) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#00BFFF';
    ctx.beginPath();
    ctx.arc(mortyX, characterY, characterClickRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawText(ctx, 'Click to start!', mortyX, characterY + 80, 14, '#00BFFF', 'center', true);
  }

  if (mikeHovered) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(mikeX, characterY, characterClickRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawText(ctx, 'Click to start!', mikeX, characterY + 80, 14, '#8B4513', 'center', true);
  }

  if (carsonHovered) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(carsonX, characterY, characterClickRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawText(ctx, 'Click to start!', carsonX, characterY + 80, 14, '#4169E1', 'center', true);
  }

  if (avaHovered) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.arc(avaX, characterY, characterClickRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawText(ctx, 'Click to start!', avaX, characterY + 80, 14, '#D2691E', 'center', true);
  }

  // Handle character clicks
  if (clicked && (xavierHovered || mortyHovered || mikeHovered || carsonHovered || avaHovered)) {
    const clickX = xavierHovered ? xavierX : mortyHovered ? mortyX : mikeHovered ? mikeX : carsonHovered ? carsonX : avaHovered ? avaX;
    const clickY = characterY;
    const clickColor = xavierHovered ? '#FFD700' : mortyHovered ? '#00BFFF' : mikeHovered ? '#8B4513' : carsonHovered ? '#4169E1' : '#D2691E';
    
    createParticle(clickX, clickY, clickColor, 'burst', particles);
    createParticle(clickX, clickY, '#FFD700', 'burst', particles);
    
    // Generate lore when starting game
    if (!loreManager.isLoaded()) {
      loreManager.generateGameLore();
    }
    
    onStateChange(GAME_STATES.MAP);
  }

  // Enhanced buttons with hover effects
  const startHovered = isButtonHovered(300, 400, 200, 60, mouseX, mouseY, canvas);
  const instructionsHovered = isButtonHovered(300, 480, 200, 60, mouseX, mouseY, canvas);
  
  drawGradientButton(ctx, 300, 400, 200, 60, 'START GAME', '#ff6b35', '#ff4500', startHovered);
  drawGradientButton(ctx, 300, 480, 200, 60, 'INSTRUCTIONS', '#2196F3', '#1976D2', instructionsHovered);

  if (isButtonClicked(300, 400, 200, 60, mouseX, mouseY, clicked, canvas)) {
    createParticle(400, 430, '#ff6b35', 'burst', particles);
    createParticle(400, 430, '#FFD700', 'burst', particles);
    
    // Generate lore when starting game
    if (!loreManager.isLoaded()) {
      loreManager.generateGameLore();
    }
    
    onStateChange(GAME_STATES.MAP);
  }
  if (isButtonClicked(300, 480, 200, 60, mouseX, mouseY, clicked, canvas)) {
    createParticle(400, 510, '#2196F3', 'burst', particles);
    onStateChange(GAME_STATES.INSTRUCTIONS);
  }

  drawText(ctx, 'Click characters or buttons to play', canvas.width / 2, 650, 16, '#888');

  // Show AI status
  drawText(ctx, '✓ AI Features Enabled', canvas.width / 2, 680, 12, '#4CAF50', 'center');

  return null;
};
