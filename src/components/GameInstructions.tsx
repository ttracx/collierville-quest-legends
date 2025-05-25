
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
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText(ctx, 'HOW TO PLAY', canvas.width / 2, 60, 36, '#ff6b35');

  // Front Desk Instructions
  ctx.fillStyle = '#333';
  ctx.fillRect(50, 100, 220, 140);
  drawText(ctx, 'FRONT DESK', 160, 130, 20, '#ff6b35');
  drawText(ctx, 'Match members to', 160, 160, 16, 'white');
  drawText(ctx, 'their correct badges', 160, 180, 16, 'white');
  drawText(ctx, 'Click the right badge!', 160, 200, 16, 'white');
  drawText(ctx, 'Goal: 10 matches', 160, 220, 16, '#4CAF50');

  // Workout Instructions
  ctx.fillStyle = '#333';
  ctx.fillRect(290, 100, 220, 140);
  drawText(ctx, 'WORKOUT', 400, 130, 20, '#ff6b35');
  drawText(ctx, 'Press A & D keys', 400, 160, 16, 'white');
  drawText(ctx, 'alternately to lift', 400, 180, 16, 'white');
  drawText(ctx, '(or tap screen sides)', 400, 200, 16, 'white');
  drawText(ctx, 'Goal: 15 reps', 400, 220, 16, '#4CAF50');

  // Smoothie Instructions
  ctx.fillStyle = '#333';
  ctx.fillRect(530, 100, 220, 140);
  drawText(ctx, 'SMOOTHIE RUSH', 640, 130, 20, '#ff6b35');
  drawText(ctx, 'Click ingredients in', 640, 160, 16, 'white');
  drawText(ctx, 'the recipe order', 640, 180, 16, 'white');
  drawText(ctx, 'to make smoothies', 640, 200, 16, 'white');
  drawText(ctx, 'Goal: 5 smoothies', 640, 220, 16, '#4CAF50');

  // General tips
  drawText(ctx, 'TIPS', canvas.width / 2, 280, 24, '#ff6b35');
  drawText(ctx, '• Complete all 3 challenges to win!', canvas.width / 2, 320, 18, 'white');
  drawText(ctx, '• Each challenge has a time limit', canvas.width / 2, 350, 18, 'white');
  drawText(ctx, '• Wrong answers reduce your time', canvas.width / 2, 380, 18, 'white');
  drawText(ctx, '• Earn points for speed and accuracy', canvas.width / 2, 410, 18, 'white');

  const backHovered = isButtonHovered(300, 480, 200, 60, mouseX, mouseY);
  drawGradientButton(ctx, 300, 480, 200, 60, 'BACK TO MENU', '#4CAF50', '#388E3C', backHovered);

  if (isButtonClicked(300, 480, 200, 60, mouseX, mouseY, clicked)) {
    onStateChange(GAME_STATES.MENU);
  }

  return null;
};
