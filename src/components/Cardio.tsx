
import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked } from '../utils/uiHelpers';
import { createParticle, Particle } from '../utils/particleSystem';

interface CardioProps {
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

const CARDIO_EXERCISES = [
  'Running', 'Jumping Jacks', 'Burpees', 'High Knees', 'Mountain Climbers'
];

export const Cardio: React.FC<CardioProps> = ({
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
  const cardioData = gameData.cardio;

  // Game setup
  if (cardioData.timer <= 0 && cardioData.timer !== -1) {
    cardioData.timer = 75;
    cardioData.currentExercise = CARDIO_EXERCISES[0];
    cardioData.exerciseTimer = 15;
    cardioData.intensity = 50;
    cardioData.heartRate = 80;
    cardioData.calories = 0;
  }

  // Dynamic background based on intensity
  const intensityColor = Math.floor(cardioData.intensity / 20);
  const bgColors = ['#2c3e50', '#e74c3c', '#e67e22', '#f39c12', '#27ae60'];
  const bgColor = bgColors[Math.min(intensityColor, 4)];
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cardio controls - rapid key presses increase intensity
  const spacePressed = keys[' '] || keys['Space'];
  const enterPressed = keys['Enter'];
  const actionPressed = spacePressed || enterPressed || clicked;

  // Track key press frequency for intensity
  if (actionPressed && frameCount % 3 === 0) {
    cardioData.intensity = Math.min(cardioData.intensity + 3, 100);
    cardioData.heartRate = Math.min(cardioData.heartRate + 2, 180);
    cardioData.calories += cardioData.intensity / 50;
    
    // Create sweat particles
    createParticle(canvas.width / 2 + (Math.random() - 0.5) * 100, canvas.height / 2, '#87CEEB', 'trail', particles);
  } else {
    cardioData.intensity = Math.max(cardioData.intensity - 0.5, 0);
    cardioData.heartRate = Math.max(cardioData.heartRate - 0.3, 60);
  }

  // Draw animated exercise figure
  const figureX = canvas.width / 2;
  const figureY = canvas.height / 2 + 50;
  const exerciseAnimation = Math.sin(frameCount * 0.3) * (cardioData.intensity / 10);

  ctx.save();
  ctx.translate(figureX, figureY);

  // Figure color changes with intensity
  const figureColor = cardioData.intensity > 80 ? '#ff6b6b' : cardioData.intensity > 50 ? '#ffa726' : '#ffdbac';
  ctx.fillStyle = figureColor;

  // Draw exercise-specific animations
  switch (cardioData.currentExercise) {
    case 'Running':
      // Running figure with leg movement
      ctx.fillRect(-10, -40, 20, 50); // Body
      ctx.beginPath();
      ctx.arc(0, -50, 12, 0, Math.PI * 2); // Head
      ctx.fill();
      
      // Moving arms
      ctx.save();
      ctx.rotate(exerciseAnimation * 0.3);
      ctx.fillRect(-20, -30, 8, 25);
      ctx.restore();
      
      ctx.save();
      ctx.rotate(-exerciseAnimation * 0.3);
      ctx.fillRect(12, -30, 8, 25);
      ctx.restore();
      
      // Running legs
      ctx.fillRect(-8 + exerciseAnimation, 10, 6, 30);
      ctx.fillRect(2 - exerciseAnimation, 10, 6, 30);
      break;
      
    case 'Jumping Jacks':
      // Jumping figure
      const jumpHeight = Math.abs(exerciseAnimation) * 2;
      ctx.translate(0, -jumpHeight);
      
      ctx.fillRect(-10, -40, 20, 50); // Body
      ctx.beginPath();
      ctx.arc(0, -50, 12, 0, Math.PI * 2); // Head
      ctx.fill();
      
      // Arms spread
      const armSpread = Math.abs(exerciseAnimation) * 20;
      ctx.fillRect(-15 - armSpread, -35, 8, 25);
      ctx.fillRect(7 + armSpread, -35, 8, 25);
      
      // Legs spread
      ctx.fillRect(-8 - armSpread/2, 10, 6, 30);
      ctx.fillRect(2 + armSpread/2, 10, 6, 30);
      break;
      
    default:
      // Default exercise pose
      ctx.fillRect(-10, -40, 20, 50); // Body
      ctx.beginPath();
      ctx.arc(0, -50, 12, 0, Math.PI * 2); // Head
      ctx.fill();
      
      // Active arms
      ctx.fillRect(-15 + exerciseAnimation, -35, 8, 25);
      ctx.fillRect(7 - exerciseAnimation, -35, 8, 25);
      
      // Legs
      ctx.fillRect(-8, 10, 6, 30);
      ctx.fillRect(2, 10, 6, 30);
  }

  ctx.restore();

  // Exercise timer and progression
  cardioData.exerciseTimer -= 1/60;
  
  if (cardioData.exerciseTimer <= 0) {
    cardioData.exerciseTimer = 15;
    const currentIndex = CARDIO_EXERCISES.indexOf(cardioData.currentExercise);
    cardioData.currentExercise = CARDIO_EXERCISES[(currentIndex + 1) % CARDIO_EXERCISES.length];
    cardioData.score += Math.round(cardioData.intensity * 2);
  }

  // Timer countdown
  if (cardioData.timer > 0) {
    cardioData.timer -= 1/60;
  }

  // UI Elements
  drawText(ctx, 'CARDIO BLAST', canvas.width / 2, 50, 32, '#ff6b35', 'center', true);
  drawText(ctx, `Exercise: ${cardioData.currentExercise}`, canvas.width / 2, 90, 24, 'white', 'center');
  drawText(ctx, `Next in: ${Math.ceil(cardioData.exerciseTimer)}s`, canvas.width / 2, 120, 20, '#FFD700', 'center');

  // Stats panel
  drawText(ctx, `Time: ${Math.ceil(cardioData.timer)}s`, 50, 150, 20, 'white', 'left');
  drawText(ctx, `Heart Rate: ${Math.round(cardioData.heartRate)} BPM`, 50, 180, 20, cardioData.heartRate > 150 ? '#ff6b6b' : '#4CAF50', 'left');
  drawText(ctx, `Calories: ${Math.round(cardioData.calories)}`, 50, 210, 20, '#ff9800', 'left');
  drawText(ctx, `Score: ${cardioData.score}`, 50, 240, 20, '#FFD700', 'left');

  // Intensity meter
  ctx.fillStyle = '#333';
  ctx.fillRect(canvas.width - 250, 150, 200, 20);
  
  const intensityColor = cardioData.intensity > 80 ? '#ff4444' : cardioData.intensity > 50 ? '#ffaa00' : '#4CAF50';
  ctx.fillStyle = intensityColor;
  ctx.fillRect(canvas.width - 250, 150, (cardioData.intensity / 100) * 200, 20);
  
  drawText(ctx, `Intensity: ${Math.round(cardioData.intensity)}%`, canvas.width - 250, 140, 16, 'white', 'left');

  // Heart rate zone indicator
  let zone = 'Resting';
  let zoneColor = '#4CAF50';
  
  if (cardioData.heartRate > 140) {
    zone = 'Max Effort';
    zoneColor = '#ff4444';
  } else if (cardioData.heartRate > 120) {
    zone = 'High Intensity';
    zoneColor = '#ff9800';
  } else if (cardioData.heartRate > 100) {
    zone = 'Moderate';
    zoneColor = '#FFD700';
  }
  
  drawText(ctx, `Zone: ${zone}`, canvas.width - 250, 200, 16, zoneColor, 'left');

  // Instructions with pulsing effect
  const instructionAlpha = 0.7 + Math.sin(frameCount * 0.1) * 0.3;
  ctx.save();
  ctx.globalAlpha = instructionAlpha;
  drawText(ctx, 'CLICK / SPACE / ENTER RAPIDLY!', canvas.width / 2, canvas.height - 60, 20, 'white', 'center', true);
  drawText(ctx, 'Keep your intensity up!', canvas.width / 2, canvas.height - 35, 16, '#FFD700', 'center');
  ctx.restore();

  // Motivation messages based on intensity
  if (cardioData.intensity > 80) {
    drawText(ctx, '🔥 ON FIRE! 🔥', canvas.width / 2, canvas.height / 2 - 100, 24, '#ff4444', 'center', true);
  } else if (cardioData.intensity > 60) {
    drawText(ctx, '💪 GREAT EFFORT! 💪', canvas.width / 2, canvas.height / 2 - 100, 20, '#ff9800', 'center');
  } else if (cardioData.intensity < 30) {
    drawText(ctx, 'Pick up the pace!', canvas.width / 2, canvas.height / 2 - 100, 18, '#fff', 'center');
  }

  // Game over check
  if (cardioData.timer <= 0) {
    const fitnessBonus = Math.round(cardioData.calories * 5);
    const finalScore = cardioData.score + fitnessBonus;
    
    drawText(ctx, 'WORKOUT COMPLETE!', canvas.width / 2, canvas.height / 2 - 50, 36, '#ff6b35', 'center', true);
    drawText(ctx, `Final Score: ${finalScore}`, canvas.width / 2, canvas.height / 2, 24, '#FFD700', 'center');
    drawText(ctx, `Fitness Bonus: ${fitnessBonus}`, canvas.width / 2, canvas.height / 2 + 30, 20, '#4CAF50', 'center');

    if (isButtonClicked(300, canvas.height / 2 + 80, 200, 60, mouseX, mouseY, clicked, canvas)) {
      gameData.totalScore += finalScore;
      gameData.completedGames.add(GAME_STATES.CARDIO);
      onUpdateGameData({ ...gameData });
      onStateChange(GAME_STATES.MAP);
    }
    
    drawGradientButton(ctx, 300, canvas.height / 2 + 80, 200, 60, 'FINISH', '#4CAF50', '#388E3C', false);
  }

  onUpdateGameData({ ...gameData });
  return null;
};
