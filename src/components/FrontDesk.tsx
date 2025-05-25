import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';
import { drawMemberAvatar } from '../utils/characterDrawing';
import { createParticle, Particle } from '../utils/particleSystem';
import { generateMember, generateBadges } from '../utils/gameUtils';
import { loreManager } from '../utils/loreManager';
import { aiService } from '../utils/aiService';

interface FrontDeskProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  gameData: GameData;
  keys: { [key: string]: boolean };
  particles: Particle[];
  onStateChange: (state: GameState) => void;
  onUpdateGameData: (gameData: GameData) => void;
}

export const FrontDesk: React.FC<FrontDeskProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  gameData,
  keys,
  particles,
  onStateChange,
  onUpdateGameData
}) => {
  // Gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, '#4a5568');
  bgGradient.addColorStop(1, '#2d3748');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Show lore if available
  const currentLore = loreManager.getCurrentLore();
  if (currentLore) {
    drawText(ctx, 'FRONT DESK CHECK-IN', canvas.width / 2, 40, 28, '#ff6b35', 'center', true);
    drawText(ctx, currentLore.locations.frontDesk, canvas.width / 2, 70, 14, '#ccc', 'center');
  } else {
    drawText(ctx, 'FRONT DESK CHECK-IN', canvas.width / 2, 60, 32, '#ff6b35', 'center', true);
  }

  if (!gameData.frontDesk.currentMember) {
    // Try to use AI-generated character first
    const aiCharacters = loreManager.getAICharacters();
    const memberCharacters = aiCharacters.filter(char => char.role === 'member');
    
    let currentMember;
    if (memberCharacters.length > 0 && Math.random() > 0.5) {
      const aiChar = memberCharacters[Math.floor(Math.random() * memberCharacters.length)];
      currentMember = {
        name: aiChar.name,
        color: aiChar.color,
        id: parseInt(aiChar.id.slice(-4), 16) % 9000 + 1000 // Convert to number
      };
    } else {
      currentMember = generateMember();
      
      // Generate a new AI character occasionally
      if (aiService.getApiKey() && Math.random() > 0.7 && !loreManager.isGenerating()) {
        loreManager.generateCharacter('member');
      }
    }
    
    gameData.frontDesk.currentMember = currentMember;
    gameData.frontDesk.badges = generateBadges(currentMember);
    onUpdateGameData(gameData);
  }

  const { currentMember, badges, timer, matches, score } = gameData.frontDesk;

  // Timer countdown
  if (frameCount % 60 === 0 && timer > 0) {
    gameData.frontDesk.timer--;
    onUpdateGameData(gameData);
  }

  // Display member info
  if (currentMember) {
    drawText(ctx, `Member: ${currentMember.name}`, canvas.width / 2, 120, 24, 'white', 'center', true);
    drawText(ctx, `ID: ${currentMember.id}`, canvas.width / 2, 150, 20, '#ccc', 'center', true);
    
    // Draw member avatar
    drawMemberAvatar(ctx, canvas.width / 2, 200, currentMember.color, true, frameCount);
  }

  // Display badges
  drawText(ctx, 'Select the correct badge:', canvas.width / 2, 280, 20, 'white', 'center', true);
  
  badges.forEach((badge, index) => {
    const x = 150 + index * 150;
    const y = 320;
    const hovered = isButtonHovered(x - 50, y - 50, 100, 100, mouseX, mouseY);
    
    // Badge background
    ctx.fillStyle = hovered ? '#555' : '#333';
    ctx.fillRect(x - 50, y - 50, 100, 100);
    ctx.strokeStyle = badge.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 50, y - 50, 100, 100);
    
    drawText(ctx, badge.name, x, y - 20, 16, 'white', 'center');
    drawText(ctx, badge.id.toString(), x, y + 10, 14, '#ccc', 'center');
    
    if (isButtonClicked(x - 50, y - 50, 100, 100, mouseX, mouseY, clicked)) {
      if (currentMember && badge.id === currentMember.id) {
        // Correct match
        gameData.frontDesk.matches++;
        gameData.frontDesk.score += Math.max(100 - (30 - timer) * 2, 50);
        createParticle(x, y, '#4CAF50', 'burst', particles);
        
        if (gameData.frontDesk.matches >= 10) {
          gameData.totalScore += gameData.frontDesk.score;
          gameData.completedGames.add(GAME_STATES.FRONTDESK);
          onUpdateGameData(gameData);
          onStateChange(GAME_STATES.MAP);
          return;
        }
        
        // Generate new member (potentially AI-generated)
        const aiCharacters = loreManager.getAICharacters();
        const memberCharacters = aiCharacters.filter(char => char.role === 'member');
        
        let newMember;
        if (memberCharacters.length > 0 && Math.random() > 0.5) {
          const aiChar = memberCharacters[Math.floor(Math.random() * memberCharacters.length)];
          newMember = {
            name: aiChar.name,
            color: aiChar.color,
            id: parseInt(aiChar.id.slice(-4), 16) % 9000 + 1000
          };
        } else {
          newMember = generateMember();
        }
        
        gameData.frontDesk.currentMember = newMember;
        gameData.frontDesk.badges = generateBadges(newMember);
      } else {
        // Wrong match
        gameData.frontDesk.timer = Math.max(0, gameData.frontDesk.timer - 3);
        createParticle(x, y, '#f44336', 'burst', particles);
      }
      onUpdateGameData(gameData);
    }
  });

  // Game info
  drawText(ctx, `Timer: ${timer}`, 100, 500, 20, timer < 10 ? '#f44336' : 'white');
  drawText(ctx, `Matches: ${matches}/10`, 300, 500, 20, 'white');
  drawText(ctx, `Score: ${score}`, 500, 500, 20, 'white');

  // Game over check
  if (timer <= 0) {
    drawText(ctx, 'TIME UP!', canvas.width / 2, 450, 36, '#f44336', 'center', true);
    const backHovered = isButtonHovered(300, 500, 200, 60, mouseX, mouseY);
    drawGradientButton(ctx, 300, 500, 200, 60, 'BACK TO MAP', '#f44336', '#d32f2f', backHovered);
    
    if (isButtonClicked(300, 500, 200, 60, mouseX, mouseY, clicked)) {
      onStateChange(GAME_STATES.MAP);
    }
  }

  return null;
};
