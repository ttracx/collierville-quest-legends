
import React from 'react';
import { GameLore } from '../types/loreTypes';
import { drawText } from '../utils/uiHelpers';

interface LoreDisplayProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  lore: GameLore;
  x: number;
  y: number;
  maxWidth?: number;
}

export const LoreDisplay: React.FC<LoreDisplayProps> = ({
  ctx,
  canvas,
  lore,
  x,
  y,
  maxWidth = 300
}) => {
  const drawWrappedText = (text: string, startX: number, startY: number, maxWidth: number, lineHeight: number, size: number, color: string) => {
    const words = text.split(' ');
    let line = '';
    let currentY = startY;

    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      ctx.font = `${size}px Arial`;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && index > 0) {
        drawText(ctx, line.trim(), startX, currentY, size, color, 'left');
        line = word + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    });

    if (line.trim()) {
      drawText(ctx, line.trim(), startX, currentY, size, color, 'left');
    }

    return currentY + lineHeight;
  };

  // Draw lore background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x - 10, y - 10, maxWidth + 20, 200);
  
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 10, y - 10, maxWidth + 20, 200);

  // Draw lore content
  drawText(ctx, 'GAME LORE', x + maxWidth / 2, y + 20, 20, '#ff6b35', 'center', true);
  
  let currentY = y + 50;
  currentY = drawWrappedText(lore.setting, x, currentY, maxWidth, 20, 14, 'white');
  currentY += 10;
  currentY = drawWrappedText(lore.backstory, x, currentY, maxWidth, 20, 12, '#ccc');

  return null;
};
