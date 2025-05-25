
import React from 'react';
import { GameState, GAME_STATES } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';

interface GameInstructionsProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  onStateChange: (state: GameState) => void;
}

export const GameInstructions: React.FC<GameInstructionsProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  onStateChange
}) => {
  // Enhanced background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#2a1a3a');
  gradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText(ctx, 'HOW TO PLAY', canvas.width / 2, 60, 36, '#ff6b35', 'center', true);

  // Enhanced instructions layout - 2 columns for better space usage
  const col1X = canvas.width / 4;
  const col2X = (canvas.width / 4) * 3;
  const startY = 120;
  const boxWidth = 280;
  const boxHeight = 120;
  const spacing = 140;

  // Column 1 Games
  const games1 = [
    {
      title: 'FRONT DESK',
      instructions: ['Match members to', 'their correct badges', 'Click the right badge!'],
      goal: 'Goal: 10 matches',
      color: '#ff6b35'
    },
    {
      title: 'WORKOUT',
      instructions: ['Press A & D keys', 'alternately to lift', '(or tap screen sides)'],
      goal: 'Goal: 15 reps',
      color: '#ff6b35'
    },
    {
      title: 'SMOOTHIE RUSH',
      instructions: ['Click ingredients in', 'the recipe order', 'to make smoothies'],
      goal: 'Goal: 5 smoothies',
      color: '#ff6b35'
    },
    {
      title: 'BASKETBALL',
      instructions: ['Click to aim and shoot', 'at the basketball hoop', 'Hit swish shots!'],
      goal: 'Goal: High accuracy',
      color: '#ff6b35'
    }
  ];

  // Column 2 Games
  const games2 = [
    {
      title: 'SWIMMING',
      instructions: ['Press A & D alternately', 'for perfect rhythm', 'Both keys = power stroke'],
      goal: 'Goal: Complete laps',
      color: '#2196F3'
    },
    {
      title: 'YOGA',
      instructions: ['Hold SPACE to breathe', 'Use A/D for balance', 'Find your zen'],
      goal: 'Goal: Perfect harmony',
      color: '#9C27B0'
    },
    {
      title: 'CARDIO BLAST',
      instructions: ['Rapidly click/press keys', 'Keep intensity high', 'Multiple exercises'],
      goal: 'Goal: Max calories',
      color: '#F44336'
    }
  ];

  // Draw Column 1
  games1.forEach((game, i) => {
    const y = startY + i * spacing;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(col1X - boxWidth/2, y, boxWidth, boxHeight);
    
    drawText(ctx, game.title, col1X, y + 25, 18, game.color, 'center', true);
    
    game.instructions.forEach((line, lineIndex) => {
      drawText(ctx, line, col1X, y + 50 + lineIndex * 18, 14, 'white', 'center');
    });
    
    drawText(ctx, game.goal, col1X, y + 110, 14, '#4CAF50', 'center', true);
  });

  // Draw Column 2
  games2.forEach((game, i) => {
    const y = startY + i * spacing;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(col2X - boxWidth/2, y, boxWidth, boxHeight);
    
    drawText(ctx, game.title, col2X, y + 25, 18, game.color, 'center', true);
    
    game.instructions.forEach((line, lineIndex) => {
      drawText(ctx, line, col2X, y + 50 + lineIndex * 18, 14, 'white', 'center');
    });
    
    drawText(ctx, game.goal, col2X, y + 110, 14, '#4CAF50', 'center', true);
  });

  // General tips section
  const tipsY = canvas.height - 200;
  drawText(ctx, 'GENERAL TIPS', canvas.width / 2, tipsY, 24, '#ff6b35', 'center', true);
  
  const tips = [
    '• Complete all 7 challenges to achieve ultimate victory!',
    '• Each challenge has a time limit and unique mechanics',
    '• Wrong answers or poor performance reduce your time',
    '• Earn bonus points for speed, accuracy, and style',
    '• Master each game to maximize your total score!'
  ];

  tips.forEach((tip, i) => {
    drawText(ctx, tip, canvas.width / 2, tipsY + 35 + i * 25, 16, 'white', 'center');
  });

  // Enhanced back button
  const backHovered = isButtonHovered(300, canvas.height - 70, 200, 50, mouseX, mouseY, canvas);
  drawGradientButton(ctx, 300, canvas.height - 70, 200, 50, 'BACK TO MENU', '#4CAF50', '#388E3C', backHovered);

  if (isButtonClicked(300, canvas.height - 70, 200, 50, mouseX, mouseY, clicked, canvas)) {
    onStateChange(GAME_STATES.MENU);
  }

  return null;
};
