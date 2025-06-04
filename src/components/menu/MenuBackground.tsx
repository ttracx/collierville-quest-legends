
import React from 'react';
import { drawBackgroundStars } from '../../utils/particleSystem';

interface MenuBackgroundProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  frameCount: number;
  backgroundStars: any[];
}

export const MenuBackground: React.FC<MenuBackgroundProps> = ({
  ctx,
  canvas,
  frameCount,
  backgroundStars
}) => {
  // Animated gradient background
  const bgGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
  bgGradient.addColorStop(0, '#2a1a3a');
  bgGradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBackgroundStars(ctx, backgroundStars, canvas.height, canvas.width);

  return null;
};
