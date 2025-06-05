
import React from 'react';
import { GameState, GAME_STATES } from '../../types/gameTypes';
import { drawText } from '../../utils/uiHelpers';
import { drawXavier, drawMorty, drawMike, drawCarson, drawAva, drawPrince } from '../../utils/characterDrawing';
import { createParticle, Particle } from '../../utils/particleSystem';
import { loreManager } from '../../utils/loreManager';

interface CharacterSelectorProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
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
  princeImage?: HTMLImageElement;
  princeImageLoaded?: boolean;
  onStateChange: (state: GameState) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
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
  princeImage,
  princeImageLoaded = false,
  onStateChange
}) => {
  // Character positions and click areas - now with 6 characters
  const characterSpacing = 64;
  const xavierX = canvas.width / 2 - characterSpacing * 2.5;
  const mortyX = canvas.width / 2 - characterSpacing * 1.5;
  const mikeX = canvas.width / 2 - characterSpacing * 0.5;
  const carsonX = canvas.width / 2 + characterSpacing * 0.5;
  const avaX = canvas.width / 2 + characterSpacing * 1.5;
  const princeX = canvas.width / 2 + characterSpacing * 2.5;
  const characterY = 290;
  const characterClickRadius = 50;

  // Draw all six characters with animation
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

  drawPrince(ctx, princeX, characterY, 1.2, true, frameCount, princeImage, princeImageLoaded);
  drawText(ctx, 'Prince', princeX, 360, 16, 'white', 'center', true);
  drawText(ctx, 'Cafe Worker', princeX, 380, 12, '#8A2BE2', 'center', true);

  // Check for character clicks
  const distanceToXavier = Math.sqrt(Math.pow(mouseX - xavierX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToMorty = Math.sqrt(Math.pow(mouseX - mortyX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToMike = Math.sqrt(Math.pow(mouseX - mikeX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToCarson = Math.sqrt(Math.pow(mouseX - carsonX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToAva = Math.sqrt(Math.pow(mouseX - avaX, 2) + Math.pow(mouseY - characterY, 2));
  const distanceToPrince = Math.sqrt(Math.pow(mouseX - princeX, 2) + Math.pow(mouseY - characterY, 2));
  
  const xavierHovered = distanceToXavier < characterClickRadius;
  const mortyHovered = distanceToMorty < characterClickRadius;
  const mikeHovered = distanceToMike < characterClickRadius;
  const carsonHovered = distanceToCarson < characterClickRadius;
  const avaHovered = distanceToAva < characterClickRadius;
  const princeHovered = distanceToPrince < characterClickRadius;

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

  if (princeHovered) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#8A2BE2';
    ctx.beginPath();
    ctx.arc(princeX, characterY, characterClickRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawText(ctx, 'Click to start!', princeX, characterY + 80, 14, '#8A2BE2', 'center', true);
  }

  // Handle character clicks
  if (clicked && (xavierHovered || mortyHovered || mikeHovered || carsonHovered || avaHovered || princeHovered)) {
    const clickX = xavierHovered ? xavierX : mortyHovered ? mortyX : mikeHovered ? mikeX : carsonHovered ? carsonX : avaHovered ? avaX : princeX;
    const clickY = characterY;
    const clickColor = xavierHovered ? '#FFD700' : mortyHovered ? '#00BFFF' : mikeHovered ? '#8B4513' : carsonHovered ? '#4169E1' : avaHovered ? '#D2691E' : '#8A2BE2';
    
    createParticle(clickX, clickY, clickColor, 'burst', particles);
    createParticle(clickX, clickY, '#FFD700', 'burst', particles);
    
    // Generate lore when starting game
    if (!loreManager.isLoaded()) {
      loreManager.generateGameLore();
    }
    
    onStateChange(GAME_STATES.MAP);
  }

  return null;
};
