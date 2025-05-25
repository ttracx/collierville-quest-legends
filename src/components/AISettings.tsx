
import React, { useState } from 'react';
import { aiService } from '../utils/aiService';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';

interface AISettingsProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  onClose: () => void;
}

export const AISettings: React.FC<AISettingsProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  onClose
}) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(!aiService.getApiKey());

  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Settings panel
  const panelWidth = 400;
  const panelHeight = 300;
  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = (canvas.height - panelHeight) / 2;

  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

  drawText(ctx, 'AI SETTINGS', panelX + panelWidth / 2, panelY + 40, 24, '#ff6b35', 'center', true);

  if (showApiKeyInput) {
    drawText(ctx, 'OpenAI API Key Required', panelX + panelWidth / 2, panelY + 80, 16, 'white', 'center');
    drawText(ctx, 'Please enter your OpenAI API key to enable', panelX + panelWidth / 2, panelY + 100, 14, '#ccc', 'center');
    drawText(ctx, 'AI-generated characters and lore.', panelX + panelWidth / 2, panelY + 120, 14, '#ccc', 'center');
    
    drawText(ctx, 'For security, get a new key from:', panelX + panelWidth / 2, panelY + 150, 12, '#888', 'center');
    drawText(ctx, 'platform.openai.com/api-keys', panelX + panelWidth / 2, panelY + 170, 12, '#4CAF50', 'center');
  } else {
    drawText(ctx, 'AI Features Enabled!', panelX + panelWidth / 2, panelY + 80, 16, '#4CAF50', 'center');
    drawText(ctx, 'Characters and lore will be generated', panelX + panelWidth / 2, panelY + 100, 14, '#ccc', 'center');
    drawText(ctx, 'using OpenAI when you play.', panelX + panelWidth / 2, panelY + 120, 14, '#ccc', 'center');
  }

  // Buttons
  const setupHovered = isButtonHovered(panelX + 50, panelY + 200, 120, 40, mouseX, mouseY);
  const closeHovered = isButtonHovered(panelX + 230, panelY + 200, 120, 40, mouseX, mouseY);

  if (showApiKeyInput) {
    drawGradientButton(ctx, panelX + 50, panelY + 200, 120, 40, 'SETUP KEY', '#4CAF50', '#388E3C', setupHovered);
  }
  
  drawGradientButton(ctx, panelX + 230, panelY + 200, 120, 40, 'CLOSE', '#f44336', '#d32f2f', closeHovered);

  if (showApiKeyInput && isButtonClicked(panelX + 50, panelY + 200, 120, 40, mouseX, mouseY, clicked)) {
    // In a real implementation, you'd show a proper input modal
    const apiKey = prompt('Enter your OpenAI API key:');
    if (apiKey) {
      aiService.setApiKey(apiKey);
      setShowApiKeyInput(false);
    }
  }

  if (isButtonClicked(panelX + 230, panelY + 200, 120, 40, mouseX, mouseY, clicked)) {
    onClose();
  }

  return null;
};
