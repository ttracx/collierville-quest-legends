
import React from 'react';
import { drawText } from '../../utils/uiHelpers';

interface MenuTitleProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  frameCount: number;
}

export const MenuTitle: React.FC<MenuTitleProps> = ({
  ctx,
  canvas,
  frameCount
}) => {
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
  drawText(ctx, 'Starring Xavier, Morty, Mike, Carson & Ava', canvas.width / 2, 210, 20, '#ccc', 'center', true);

  return null;
};
