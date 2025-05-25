
import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';
import { createParticle, Particle } from '../utils/particleSystem';

interface WorkoutProps {
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

export const Workout: React.FC<WorkoutProps> = ({
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
  bgGradient.addColorStop(0, '#1a365d');
  bgGradient.addColorStop(1, '#2c5282');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText(ctx, 'WORKOUT CHALLENGE', canvas.width / 2, 60, 32, '#ff6b35', 'center', true);

  const { reps, progress, lastKey, timer, score } = gameData.workout;

  // Timer countdown
  if (frameCount % 60 === 0 && timer > 0) {
    gameData.workout.timer--;
    onUpdateGameData(gameData);
  }

  // Handle key presses for workout
  const currentKey = keys['a'] || keys['A'] ? 'A' : keys['d'] || keys['D'] ? 'D' : null;
  
  if (currentKey && currentKey !== lastKey && timer > 0) {
    if ((lastKey === 'A' && currentKey === 'D') || (lastKey === 'D' && currentKey === 'A') || !lastKey) {
      gameData.workout.progress += 10;
      gameData.workout.lastKey = currentKey;
      
      if (gameData.workout.progress >= 100) {
        gameData.workout.reps++;
        gameData.workout.progress = 0;
        gameData.workout.score += Math.max(50 - (45 - timer), 25);
        createParticle(canvas.width / 2, 300, '#4CAF50', 'burst', particles);
        
        if (gameData.workout.reps >= 15) {
          gameData.totalScore += gameData.workout.score;
          gameData.completedGames.add(GAME_STATES.WORKOUT);
          onUpdateGameData(gameData);
          onStateChange(GAME_STATES.MAP);
          return;
        }
      }
      onUpdateGameData(gameData);
    }
  }

  // Handle touch controls for mobile
  const leftSideClicked = isButtonClicked(0, 0, canvas.width / 2, canvas.height, mouseX, mouseY, clicked);
  const rightSideClicked = isButtonClicked(canvas.width / 2, 0, canvas.width / 2, canvas.height, mouseX, mouseY, clicked);
  
  if (leftSideClicked && lastKey !== 'A' && timer > 0) {
    gameData.workout.progress += 10;
    gameData.workout.lastKey = 'A';
    
    if (gameData.workout.progress >= 100) {
      gameData.workout.reps++;
      gameData.workout.progress = 0;
      gameData.workout.score += Math.max(50 - (45 - timer), 25);
      createParticle(canvas.width / 2, 300, '#4CAF50', 'burst', particles);
      
      if (gameData.workout.reps >= 15) {
        gameData.totalScore += gameData.workout.score;
        gameData.completedGames.add(GAME_STATES.WORKOUT);
        onUpdateGameData(gameData);
        onStateChange(GAME_STATES.MAP);
        return;
      }
    }
    onUpdateGameData(gameData);
  }
  
  if (rightSideClicked && lastKey !== 'D' && timer > 0) {
    gameData.workout.progress += 10;
    gameData.workout.lastKey = 'D';
    
    if (gameData.workout.progress >= 100) {
      gameData.workout.reps++;
      gameData.workout.progress = 0;
      gameData.workout.score += Math.max(50 - (45 - timer), 25);
      createParticle(canvas.width / 2, 300, '#4CAF50', 'burst', particles);
      
      if (gameData.workout.reps >= 15) {
        gameData.totalScore += gameData.workout.score;
        gameData.completedGames.add(GAME_STATES.WORKOUT);
        onUpdateGameData(gameData);
        onStateChange(GAME_STATES.MAP);
        return;
      }
    }
    onUpdateGameData(gameData);
  }

  // Draw workout equipment (barbell)
  ctx.fillStyle = '#666';
  ctx.fillRect(canvas.width / 2 - 100, 250, 200, 20);
  ctx.fillRect(canvas.width / 2 - 110, 240, 20, 40);
  ctx.fillRect(canvas.width / 2 + 90, 240, 20, 40);

  // Draw progress bar for current rep
  const barWidth = 300;
  const barHeight = 30;
  const barX = canvas.width / 2 - barWidth / 2;
  const barY = 350;
  
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(barX, barY, (progress / 100) * barWidth, barHeight);
  
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  drawText(ctx, `${progress}%`, canvas.width / 2, barY + barHeight / 2 + 8, 20, 'white', 'center');

  // Instructions
  drawText(ctx, 'Press A & D keys alternately (or tap screen sides)', canvas.width / 2, 150, 18, 'white', 'center', true);
  drawText(ctx, `Current key: ${lastKey || 'None'}`, canvas.width / 2, 180, 16, '#ccc', 'center');

  // Game info
  drawText(ctx, `Timer: ${timer}`, 100, 500, 20, timer < 10 ? '#f44336' : 'white');
  drawText(ctx, `Reps: ${reps}/15`, 300, 500, 20, 'white');
  drawText(ctx, `Score: ${score}`, 500, 500, 20, 'white');

  // Game over check
  if (timer <= 0) {
    drawText(ctx, 'TIME UP!', canvas.width / 2, 450, 36, '#f44336', 'center', true);
    const backHovered = isButtonHovered(300, 520, 200, 60, mouseX, mouseY);
    drawGradientButton(ctx, 300, 520, 200, 60, 'BACK TO MAP', '#f44336', '#d32f2f', backHovered);
    
    if (isButtonClicked(300, 520, 200, 60, mouseX, mouseY, clicked)) {
      onStateChange(GAME_STATES.MAP);
    }
  }

  return null;
};
