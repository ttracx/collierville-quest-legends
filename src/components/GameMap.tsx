import React from 'react';
import { GameState, GAME_STATES } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered, getResponsivePosition } from '../utils/uiHelpers';
import { drawXavier, drawMorty, drawMike } from '../utils/characterDrawing';
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
  mikeImage?: HTMLImageElement;
  mikeImageLoaded?: boolean;
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
  mikeImage,
  mikeImageLoaded,
  onStateChange,
  onInitMiniGame
}) => {
  const isMobile = canvas.width < 768;
  const isPortrait = canvas.height > canvas.width;

  // Animated background
  const mapGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  mapGradient.addColorStop(0, '#3c3c3c');
  mapGradient.addColorStop(1, '#2c2c2c');
  ctx.fillStyle = mapGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Mobile-optimized title positioning
  const titlePos = getResponsivePosition(400, isMobile ? 60 : 80, canvas);
  const titleSize = isMobile ? 28 : 36;
  drawText(ctx, 'SELECT A CHALLENGE', titlePos.x, titlePos.y, titleSize, '#ff6b35', 'center', true);

  // Mobile-optimized character positioning - now with three characters
  const characterY = isMobile ? (isPortrait ? 120 : 100) : 130;
  const characterSpacing = isMobile ? 50 : 80;
  const xavierPos = getResponsivePosition(400 - characterSpacing, characterY, canvas);
  const mortyPos = getResponsivePosition(400, characterY, canvas);
  const mikePos = getResponsivePosition(400 + characterSpacing, characterY, canvas);
  
  const characterScale = isMobile ? 0.7 : 0.9;
  drawXavier(ctx, xavierPos.x, xavierPos.y, characterScale, true, frameCount, xavierImage, xavierImageLoaded);
  drawMorty(ctx, mortyPos.x, mortyPos.y, characterScale, true, frameCount, mortyImage, mortyImageLoaded);
  drawMike(ctx, mikePos.x, mikePos.y, characterScale, true, frameCount, mikeImage, mikeImageLoaded);
  
  // Add trail particles to all characters (reduced frequency on mobile)
  const particleFrequency = isMobile ? 60 : 30;
  if (frameCount % particleFrequency === 0) {
    createParticle(xavierPos.x + (Math.random() - 0.5) * 20, xavierPos.y + 50, '#FFD700', 'trail', particles);
    createParticle(mortyPos.x + (Math.random() - 0.5) * 20, mortyPos.y + 50, '#00BFFF', 'trail', particles);
    createParticle(mikePos.x + (Math.random() - 0.5) * 20, mikePos.y + 50, '#8B4513', 'trail', particles);
  }

  // Enhanced mobile-responsive button layout
  let games;
  const buttonWidth = isMobile ? 140 : 150;
  const buttonHeight = isMobile ? 70 : 80;
  
  if (isPortrait || isMobile) {
    // Vertical layout optimized for mobile portrait
    const startY = isMobile ? 200 : 220;
    const spacing = isMobile ? 90 : 100;
    games = [
      { name: 'Front Desk\nCheck-In', state: GAME_STATES.FRONTDESK, x: 400, y: startY },
      { name: 'Workout\nChallenge', state: GAME_STATES.WORKOUT, x: 400, y: startY + spacing },
      { name: 'Smoothie\nRush', state: GAME_STATES.SMOOTHIE, x: 400, y: startY + spacing * 2 }
    ];
  } else {
    // Horizontal layout for landscape
    const buttonY = isMobile ? 180 : 200;
    games = [
      { name: 'Front Desk\nCheck-In', state: GAME_STATES.FRONTDESK, x: 200, y: buttonY },
      { name: 'Workout\nChallenge', state: GAME_STATES.WORKOUT, x: 400, y: buttonY },
      { name: 'Smoothie\nRush', state: GAME_STATES.SMOOTHIE, x: 600, y: buttonY }
    ];
  }

  games.forEach(game => {
    const gamePos = getResponsivePosition(game.x, game.y, canvas);
    const completed = completedGames.has(game.state);
    const hovered = isButtonHovered(game.x, game.y, buttonWidth, buttonHeight, mouseX, mouseY, canvas);
    const color1 = completed ? '#4CAF50' : '#ff6b35';
    const color2 = completed ? '#388E3C' : '#ff4500';

    // Enhanced button with mobile-optimized sizing
    drawGradientButton(ctx, game.x, game.y, buttonWidth, buttonHeight, '', color1, color2, hovered);

    // Mobile-optimized text rendering
    const lines = game.name.split('\n');
    const textSize = isMobile ? 14 : 16;
    const lineSpacing = isMobile ? 18 : 20;
    
    lines.forEach((line, i) => {
      const yOffset = lines.length === 1 ? 0 : (i - (lines.length - 1) / 2) * lineSpacing;
      drawText(ctx, line, gamePos.x, gamePos.y + yOffset, textSize, 'white', 'center', true);
    });

    if (completed) {
      ctx.save();
      ctx.shadowColor = '#4CAF50';
      ctx.shadowBlur = 10;
      const checkSize = isMobile ? 24 : 30;
      const checkY = gamePos.y + (lines.length > 1 ? 25 : 20);
      drawText(ctx, '✓', gamePos.x, checkY, checkSize, '#4CAF50', 'center');
      ctx.restore();
    }

    if (!completed && isButtonClicked(game.x, game.y, buttonWidth, buttonHeight, mouseX, mouseY, clicked, canvas)) {
      // Create explosion effect
      for (let i = 0; i < (isMobile ? 5 : 10); i++) {
        createParticle(gamePos.x, gamePos.y, color1, 'burst', particles);
      }
      onInitMiniGame(game.state);
      onStateChange(game.state);
    }
  });

  // Mobile-optimized score display
  const scoreFloat = Math.sin(frameCount * 0.1) * 2;
  const scoreY = isPortrait ? 
    (isMobile ? games[games.length - 1].y + 120 : 520) : 
    (isMobile ? 280 : 350);
  const scorePos = getResponsivePosition(400, scoreY, canvas);
  const scoreSize = isMobile ? 20 : 24;
  drawText(ctx, `Score: ${totalScore}`, scorePos.x, scorePos.y + scoreFloat, scoreSize, 'white', 'center', true);

  if (completedGames.size === 3) {
    const victoryY = scoreY + (isMobile ? 50 : 60);
    const victoryPos = getResponsivePosition(400, victoryY, canvas);
    const victoryHovered = isButtonHovered(300, victoryY, 200, 60, mouseX, mouseY, canvas);
    
    drawGradientButton(ctx, 300, victoryY, 200, 60, 'VICTORY!', '#4CAF50', '#FFD700', victoryHovered);
    
    // Victory sparkles (reduced on mobile)
    const sparkleFrequency = isMobile ? 10 : 5;
    if (frameCount % sparkleFrequency === 0) {
      createParticle(victoryPos.x + (Math.random() - 0.5) * 200, victoryPos.y + (Math.random() - 0.5) * 60, '#FFD700', 'burst', particles);
    }
    
    if (isButtonClicked(300, victoryY, 200, 60, mouseX, mouseY, clicked, canvas)) {
      onStateChange(GAME_STATES.VICTORY);
    }
  }

  return null;
};
