
import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked } from '../utils/uiHelpers';
import { createParticle, Particle } from '../utils/particleSystem';

interface YogaProps {
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

const YOGA_POSES = [
  'Tree Pose', 'Warrior I', 'Downward Dog', 'Cobra', 'Mountain Pose', 'Triangle'
];

export const Yoga: React.FC<YogaProps> = ({
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
  const yogaData = gameData.yoga;

  // Game setup
  if (yogaData.timer <= 0 && yogaData.timer !== -1) {
    yogaData.timer = 90;
    yogaData.currentPose = YOGA_POSES[0];
    yogaData.poseTimer = 15;
    yogaData.balance = 50;
    yogaData.breathing = 50;
  }

  // Serene background
  const zenGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
  zenGradient.addColorStop(0, '#f0f8ff');
  zenGradient.addColorStop(1, '#e6e6fa');
  ctx.fillStyle = zenGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Floating particles for ambiance
  if (frameCount % 180 === 0) {
    createParticle(Math.random() * canvas.width, canvas.height, '#dda0dd', 'float', particles);
  }

  // Balance controls
  const spacePressed = keys[' '] || keys['Space'];
  const balanceLeft = keys['ArrowLeft'] || keys['a'] || keys['A'];
  const balanceRight = keys['ArrowRight'] || keys['d'] || keys['D'];

  // Breathing rhythm (spacebar)
  if (spacePressed) {
    yogaData.breathing = Math.min(yogaData.breathing + 1.5, 100);
  } else {
    yogaData.breathing = Math.max(yogaData.breathing - 0.5, 0);
  }

  // Balance mechanics
  const naturalSway = Math.sin(frameCount * 0.05) * 0.5;
  if (balanceLeft) {
    yogaData.balance = Math.max(yogaData.balance - 1.5, 0);
  } else if (balanceRight) {
    yogaData.balance = Math.min(yogaData.balance + 1.5, 100);
  } else {
    // Auto-center with small natural sway
    const center = 50 + naturalSway;
    if (yogaData.balance < center) {
      yogaData.balance = Math.min(yogaData.balance + 0.3, center);
    } else if (yogaData.balance > center) {
      yogaData.balance = Math.max(yogaData.balance - 0.3, center);
    }
  }

  // Draw yoga figure
  const figureX = canvas.width / 2;
  const figureY = canvas.height / 2 + 50;
  const balanceOffset = (yogaData.balance - 50) * 2;
  const breathingScale = 1 + (yogaData.breathing / 100) * 0.1;

  ctx.save();
  ctx.translate(figureX + balanceOffset, figureY);
  ctx.scale(breathingScale, breathingScale);

  // Draw different poses based on current pose
  ctx.fillStyle = '#ffdbac';
  
  switch (yogaData.currentPose) {
    case 'Tree Pose':
      // Standing figure with one leg up
      ctx.fillRect(-10, -50, 20, 80); // Body
      ctx.beginPath();
      ctx.arc(0, -60, 15, 0, Math.PI * 2); // Head
      ctx.fill();
      
      // Arms up
      ctx.fillRect(-25, -45, 10, 30);
      ctx.fillRect(15, -45, 10, 30);
      
      // One leg standing, one bent
      ctx.fillRect(-8, 30, 8, 40); // Standing leg
      ctx.fillRect(10, 10, 15, 8); // Bent leg
      break;
      
    case 'Warrior I':
      // Lunging pose
      ctx.fillRect(-10, -50, 20, 60); // Body
      ctx.beginPath();
      ctx.arc(0, -60, 15, 0, Math.PI * 2); // Head
      ctx.fill();
      
      // Arms raised
      ctx.fillRect(-8, -70, 6, 25);
      ctx.fillRect(2, -70, 6, 25);
      
      // Legs in lunge
      ctx.fillRect(-15, 10, 12, 35);
      ctx.fillRect(8, 25, 12, 25);
      break;
      
    default:
      // Default meditation pose
      ctx.fillRect(-15, -30, 30, 50); // Body
      ctx.beginPath();
      ctx.arc(0, -40, 12, 0, Math.PI * 2); // Head
      ctx.fill();
      
      // Crossed legs
      ctx.fillRect(-20, 20, 15, 8);
      ctx.fillRect(5, 20, 15, 8);
  }

  ctx.restore();

  // Balance indicator
  const balanceZone = Math.abs(yogaData.balance - 50) < 10;
  const breathingZone = yogaData.breathing > 60;
  
  if (balanceZone && breathingZone) {
    yogaData.score += 5;
    
    // Create peaceful particles
    if (frameCount % 30 === 0) {
      createParticle(figureX, figureY - 50, '#dda0dd', 'float', particles);
    }
  }

  // Pose timer
  yogaData.poseTimer -= 1/60;
  
  if (yogaData.poseTimer <= 0) {
    yogaData.posesCompleted++;
    yogaData.poseTimer = 15;
    yogaData.currentPose = YOGA_POSES[yogaData.posesCompleted % YOGA_POSES.length];
    yogaData.score += balanceZone && breathingZone ? 100 : 50;
  }

  // Timer countdown
  if (yogaData.timer > 0) {
    yogaData.timer -= 1/60;
  }

  // UI Elements
  drawText(ctx, 'YOGA & MINDFULNESS', canvas.width / 2, 50, 32, '#9370db', 'center', true);
  drawText(ctx, `Current Pose: ${yogaData.currentPose}`, canvas.width / 2, 90, 24, '#8b4513', 'center');
  drawText(ctx, `Pose Time: ${Math.ceil(yogaData.poseTimer)}s`, canvas.width / 2, 120, 20, 'white', 'center');

  // Stats
  drawText(ctx, `Time: ${Math.ceil(yogaData.timer)}s`, 50, 150, 20, 'white', 'left');
  drawText(ctx, `Poses: ${yogaData.posesCompleted}`, 50, 180, 20, 'white', 'left');
  drawText(ctx, `Score: ${yogaData.score}`, 50, 210, 20, '#FFD700', 'left');

  // Balance bar
  ctx.fillStyle = '#ccc';
  ctx.fillRect(50, 240, 200, 15);
  const balanceColor = balanceZone ? '#4CAF50' : '#ff6b35';
  ctx.fillStyle = balanceColor;
  ctx.fillRect(50 + (yogaData.balance / 100) * 200 - 5, 240, 10, 15);
  drawText(ctx, 'Balance', 50, 270, 16, 'white', 'left');

  // Breathing indicator
  const breathingColor = breathingZone ? '#4CAF50' : '#ff6b35';
  ctx.fillStyle = '#ccc';
  ctx.fillRect(50, 290, 200, 15);
  ctx.fillStyle = breathingColor;
  ctx.fillRect(50, 290, (yogaData.breathing / 100) * 200, 15);
  drawText(ctx, 'Breathing', 50, 320, 16, 'white', 'left');

  // Mindfulness indicator
  if (balanceZone && breathingZone) {
    drawText(ctx, '✨ PERFECT HARMONY ✨', canvas.width / 2, canvas.height - 80, 24, '#FFD700', 'center', true);
  }

  // Instructions
  drawText(ctx, 'Hold SPACE to breathe deeply', canvas.width / 2, canvas.height - 50, 16, '#666', 'center');
  drawText(ctx, 'Use A/D to maintain balance', canvas.width / 2, canvas.height - 30, 16, '#666', 'center');

  // Game over check
  if (yogaData.timer <= 0) {
    const mindfulnessBonus = yogaData.posesCompleted * 25;
    const finalScore = yogaData.score + mindfulnessBonus;
    
    drawText(ctx, 'NAMASTE', canvas.width / 2, canvas.height / 2 - 50, 36, '#9370db', 'center', true);
    drawText(ctx, `Final Score: ${finalScore}`, canvas.width / 2, canvas.height / 2, 24, '#FFD700', 'center');
    drawText(ctx, `Mindfulness Bonus: ${mindfulnessBonus}`, canvas.width / 2, canvas.height / 2 + 30, 20, '#4CAF50', 'center');

    if (isButtonClicked(300, canvas.height / 2 + 80, 200, 60, mouseX, mouseY, clicked, canvas)) {
      gameData.totalScore += finalScore;
      gameData.completedGames.add(GAME_STATES.YOGA);
      onUpdateGameData({ ...gameData });
      onStateChange(GAME_STATES.MAP);
    }
    
    drawGradientButton(ctx, 300, canvas.height / 2 + 80, 200, 60, 'FINISH', '#4CAF50', '#388E3C', false);
  }

  onUpdateGameData({ ...gameData });
  return null;
};
