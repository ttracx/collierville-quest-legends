
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

  // Enhanced animated background
  const mapGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
  mapGradient.addColorStop(0, '#4a5568');
  mapGradient.addColorStop(0.5, '#2d3748');
  mapGradient.addColorStop(1, '#1a202c');
  ctx.fillStyle = mapGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Animated title with enhanced effects
  const titlePos = getResponsivePosition(400, isMobile ? 60 : 80, canvas);
  const titleSize = isMobile ? 28 : 36;
  const titlePulse = 1 + Math.sin(frameCount * 0.05) * 0.1;
  
  ctx.save();
  ctx.shadowColor = '#ff6b35';
  ctx.shadowBlur = 15;
  ctx.scale(titlePulse, titlePulse);
  drawText(ctx, 'FITNESS CHALLENGES', titlePos.x / titlePulse, titlePos.y / titlePulse, titleSize, '#ff6b35', 'center', true);
  ctx.restore();

  // Character positioning with enhanced animations
  const characterY = isMobile ? (isPortrait ? 120 : 100) : 130;
  const characterSpacing = isMobile ? 50 : 80;
  const xavierPos = getResponsivePosition(400 - characterSpacing, characterY, canvas);
  const mortyPos = getResponsivePosition(400, characterY, canvas);
  const mikePos = getResponsivePosition(400 + characterSpacing, characterY, canvas);
  
  const characterScale = isMobile ? 0.7 : 0.9;
  drawXavier(ctx, xavierPos.x, xavierPos.y, characterScale, true, frameCount, xavierImage, xavierImageLoaded);
  drawMorty(ctx, mortyPos.x, mortyPos.y, characterScale, true, frameCount, mortyImage, mortyImageLoaded);
  drawMike(ctx, mikePos.x, mikePos.y, characterScale, true, frameCount, mikeImage, mikeImageLoaded);
  
  // Enhanced trail particles for all characters
  const particleFrequency = isMobile ? 60 : 30;
  if (frameCount % particleFrequency === 0) {
    createParticle(xavierPos.x + (Math.random() - 0.5) * 20, xavierPos.y + 50, '#FFD700', 'trail', particles);
    createParticle(mortyPos.x + (Math.random() - 0.5) * 20, mortyPos.y + 50, '#00BFFF', 'trail', particles);
    createParticle(mikePos.x + (Math.random() - 0.5) * 20, mikePos.y + 50, '#8B4513', 'trail', particles);
  }

  // Enhanced game layout with more games
  let games;
  const buttonWidth = isMobile ? 140 : 150;
  const buttonHeight = isMobile ? 70 : 80;
  
  if (isPortrait || isMobile) {
    // Grid layout for mobile portrait - 2 columns
    const startY = isMobile ? 200 : 220;
    const spacing = isMobile ? 90 : 100;
    const colSpacing = 160;
    games = [
      // Row 1
      { name: 'Front Desk\nCheck-In', state: GAME_STATES.FRONTDESK, x: 320, y: startY },
      { name: 'Workout\nChallenge', state: GAME_STATES.WORKOUT, x: 480, y: startY },
      // Row 2
      { name: 'Smoothie\nRush', state: GAME_STATES.SMOOTHIE, x: 320, y: startY + spacing },
      { name: 'Basketball\nShootout', state: GAME_STATES.BASKETBALL, x: 480, y: startY + spacing },
      // Row 3
      { name: 'Swimming\nLaps', state: GAME_STATES.SWIMMING, x: 320, y: startY + spacing * 2 },
      { name: 'Yoga &\nMindfulness', state: GAME_STATES.YOGA, x: 480, y: startY + spacing * 2 },
      // Row 4
      { name: 'Cardio\nBlast', state: GAME_STATES.CARDIO, x: 400, y: startY + spacing * 3 }
    ];
  } else {
    // Horizontal layout for landscape with multiple rows
    const buttonY1 = isMobile ? 180 : 200;
    const buttonY2 = buttonY1 + 100;
    games = [
      // Top row
      { name: 'Front Desk\nCheck-In', state: GAME_STATES.FRONTDESK, x: 150, y: buttonY1 },
      { name: 'Workout\nChallenge', state: GAME_STATES.WORKOUT, x: 320, y: buttonY1 },
      { name: 'Smoothie\nRush', state: GAME_STATES.SMOOTHIE, x: 490, y: buttonY1 },
      { name: 'Basketball\nShootout', state: GAME_STATES.BASKETBALL, x: 660, y: buttonY1 },
      // Bottom row
      { name: 'Swimming\nLaps', state: GAME_STATES.SWIMMING, x: 200, y: buttonY2 },
      { name: 'Yoga &\nMindfulness', state: GAME_STATES.YOGA, x: 400, y: buttonY2 },
      { name: 'Cardio\nBlast', state: GAME_STATES.CARDIO, x: 600, y: buttonY2 }
    ];
  }

  games.forEach(game => {
    const gamePos = getResponsivePosition(game.x, game.y, canvas);
    const completed = completedGames.has(game.state);
    const hovered = isButtonHovered(game.x, game.y, buttonWidth, buttonHeight, mouseX, mouseY, canvas);
    
    // Enhanced button colors based on game type
    let color1, color2;
    switch (game.state) {
      case GAME_STATES.BASKETBALL:
        color1 = completed ? '#4CAF50' : '#ff6b35';
        color2 = completed ? '#388E3C' : '#e55100';
        break;
      case GAME_STATES.SWIMMING:
        color1 = completed ? '#4CAF50' : '#2196F3';
        color2 = completed ? '#388E3C' : '#1565C0';
        break;
      case GAME_STATES.YOGA:
        color1 = completed ? '#4CAF50' : '#9C27B0';
        color2 = completed ? '#388E3C' : '#7B1FA2';
        break;
      case GAME_STATES.CARDIO:
        color1 = completed ? '#4CAF50' : '#F44336';
        color2 = completed ? '#388E3C' : '#D32F2F';
        break;
      default:
        color1 = completed ? '#4CAF50' : '#ff6b35';
        color2 = completed ? '#388E3C' : '#ff4500';
    }

    // Enhanced button with hover and completion effects
    drawGradientButton(ctx, game.x, game.y, buttonWidth, buttonHeight, '', color1, color2, hovered);

    // Enhanced text rendering with better spacing
    const lines = game.name.split('\n');
    const textSize = isMobile ? 14 : 16;
    const lineSpacing = isMobile ? 18 : 20;
    
    lines.forEach((line, i) => {
      const yOffset = lines.length === 1 ? 0 : (i - (lines.length - 1) / 2) * lineSpacing;
      drawText(ctx, line, gamePos.x, gamePos.y + yOffset, textSize, 'white', 'center', true);
    });

    // Enhanced completion indicator
    if (completed) {
      ctx.save();
      ctx.shadowColor = '#4CAF50';
      ctx.shadowBlur = 15;
      const checkSize = isMobile ? 28 : 35;
      const checkY = gamePos.y + (lines.length > 1 ? 30 : 25);
      drawText(ctx, '✓', gamePos.x, checkY, checkSize, '#4CAF50', 'center');
      
      // Sparkle effect for completed games
      if (frameCount % 60 === 0) {
        createParticle(gamePos.x + (Math.random() - 0.5) * buttonWidth, gamePos.y + (Math.random() - 0.5) * buttonHeight, '#FFD700', 'burst', particles);
      }
      ctx.restore();
    }

    // Enhanced button interaction
    if (!completed && isButtonClicked(game.x, game.y, buttonWidth, buttonHeight, mouseX, mouseY, clicked, canvas)) {
      // Create enhanced explosion effect
      for (let i = 0; i < (isMobile ? 8 : 15); i++) {
        createParticle(gamePos.x, gamePos.y, color1, 'burst', particles);
        createParticle(gamePos.x, gamePos.y, '#FFD700', 'burst', particles);
      }
      onInitMiniGame(game.state);
      onStateChange(game.state);
    }
  });

  // Enhanced score display with pulsing effect
  const scoreFloat = Math.sin(frameCount * 0.1) * 3;
  const scoreY = isPortrait ? 
    (isMobile ? games[games.length - 1].y + 120 : 520) : 
    (isMobile ? 350 : 400);
  const scorePos = getResponsivePosition(400, scoreY, canvas);
  const scoreSize = isMobile ? 20 : 24;
  
  ctx.save();
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 10;
  drawText(ctx, `Total Score: ${totalScore}`, scorePos.x, scorePos.y + scoreFloat, scoreSize, '#FFD700', 'center', true);
  ctx.restore();

  // Progress indicator
  const totalGames = 7;
  const progressY = scoreY + 40;
  const progressPos = getResponsivePosition(400, progressY, canvas);
  const progressWidth = isMobile ? 200 : 300;
  const progressHeight = 20;
  
  ctx.fillStyle = '#333';
  ctx.fillRect(progressPos.x - progressWidth/2, progressPos.y - progressHeight/2, progressWidth, progressHeight);
  
  ctx.fillStyle = '#4CAF50';
  const progressFill = (completedGames.size / totalGames) * progressWidth;
  ctx.fillRect(progressPos.x - progressWidth/2, progressPos.y - progressHeight/2, progressFill, progressHeight);
  
  drawText(ctx, `Progress: ${completedGames.size}/${totalGames}`, progressPos.x, progressPos.y - 35, 16, 'white', 'center');

  // Enhanced victory condition
  if (completedGames.size === totalGames) {
    const victoryY = progressY + 80;
    const victoryPos = getResponsivePosition(400, victoryY, canvas);
    const victoryHovered = isButtonHovered(300, victoryY, 200, 60, mouseX, mouseY, canvas);
    
    // Pulsing victory button
    const victoryPulse = 1 + Math.sin(frameCount * 0.15) * 0.1;
    ctx.save();
    ctx.scale(victoryPulse, victoryPulse);
    drawGradientButton(ctx, 300 / victoryPulse, victoryY / victoryPulse, 200, 60, 'ULTIMATE VICTORY!', '#FFD700', '#FFA000', victoryHovered);
    ctx.restore();
    
    // Enhanced victory sparkles
    const sparkleFrequency = isMobile ? 8 : 5;
    if (frameCount % sparkleFrequency === 0) {
      createParticle(victoryPos.x + (Math.random() - 0.5) * 300, victoryPos.y + (Math.random() - 0.5) * 100, '#FFD700', 'burst', particles);
      createParticle(victoryPos.x + (Math.random() - 0.5) * 300, victoryPos.y + (Math.random() - 0.5) * 100, '#ff6b35', 'burst', particles);
    }
    
    if (isButtonClicked(300, victoryY, 200, 60, mouseX, mouseY, clicked, canvas)) {
      onStateChange(GAME_STATES.VICTORY);
    }
  }

  return null;
};
