import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered } from '../utils/uiHelpers';
import { createParticle, Particle } from '../utils/particleSystem';
import { generateRecipe, generateIngredients } from '../utils/gameUtils';

interface SmoothieProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  gameData: GameData;
  particles: Particle[];
  onStateChange: (state: GameState) => void;
  onUpdateGameData: (gameData: GameData) => void;
}

export const Smoothie: React.FC<SmoothieProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  gameData,
  particles,
  onStateChange,
  onUpdateGameData
}) => {
  // Gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, '#4a148c');
  bgGradient.addColorStop(1, '#6a1b9a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawText(ctx, 'SMOOTHIE RUSH', canvas.width / 2, 60, 32, '#ff6b35', 'center', true);

  const { smoothies, currentRecipe, blender, ingredients, score } = gameData.smoothie;

  // Initialize ingredients if empty
  if (ingredients.length === 0) {
    gameData.smoothie.ingredients = generateIngredients();
    onUpdateGameData(gameData);
  }

  // Display current recipe
  drawText(ctx, 'Recipe:', 200, 120, 20, 'white', 'center', true);
  currentRecipe.forEach((item, index) => {
    drawText(ctx, `${index + 1}. ${item}`, 200, 150 + index * 25, 16, '#FFD700', 'center');
  });

  // Display blender contents
  drawText(ctx, 'Blender:', 600, 120, 20, 'white', 'center', true);
  blender.forEach((item, index) => {
    drawText(ctx, `${index + 1}. ${item}`, 600, 150 + index * 25, 16, '#4CAF50', 'center');
  });

  // Draw ingredients
  ingredients.forEach((ingredient, index) => {
    const hovered = isButtonHovered(ingredient.x - 40, ingredient.y - 40, 80, 80, mouseX, mouseY, canvas);
    
    ctx.fillStyle = hovered ? ingredient.color : '#333';
    ctx.fillRect(ingredient.x - 40, ingredient.y - 40, 80, 80);
    
    ctx.strokeStyle = ingredient.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(ingredient.x - 40, ingredient.y - 40, 80, 80);
    
    drawText(ctx, ingredient.name, ingredient.x, ingredient.y, 14, 'white', 'center');
    
    if (isButtonClicked(ingredient.x - 40, ingredient.y - 40, 80, 80, mouseX, mouseY, clicked, canvas)) {
      gameData.smoothie.blender.push(ingredient.name);
      createParticle(ingredient.x, ingredient.y, ingredient.color, 'burst', particles);
      
      // Check if recipe is complete
      if (gameData.smoothie.blender.length === currentRecipe.length) {
        const isCorrect = gameData.smoothie.blender.every((item, index) => item === currentRecipe[index]);
        
        if (isCorrect) {
          gameData.smoothie.smoothies++;
          gameData.smoothie.score += 100;
          createParticle(600, 200, '#4CAF50', 'burst', particles);
          
          if (gameData.smoothie.smoothies >= 5) {
            gameData.totalScore += gameData.smoothie.score;
            gameData.completedGames.add(GAME_STATES.SMOOTHIE);
            onUpdateGameData(gameData);
            onStateChange(GAME_STATES.MAP);
            return;
          }
          
          // Generate new recipe
          gameData.smoothie.currentRecipe = generateRecipe();
        } else {
          createParticle(600, 200, '#f44336', 'burst', particles);
        }
        
        // Clear blender
        gameData.smoothie.blender = [];
      }
      
      onUpdateGameData(gameData);
    }
  });

  // Draw blender
  ctx.fillStyle = '#555';
  ctx.fillRect(550, 250, 100, 150);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeRect(550, 250, 100, 150);

  // Clear blender button
  const clearHovered = isButtonHovered(550, 420, 100, 40, mouseX, mouseY, canvas);
  drawGradientButton(ctx, 550, 420, 100, 40, 'CLEAR', '#f44336', '#d32f2f', clearHovered);
  
  if (isButtonClicked(550, 420, 100, 40, mouseX, mouseY, clicked, canvas)) {
    gameData.smoothie.blender = [];
    onUpdateGameData(gameData);
  }

  // Game info
  drawText(ctx, `Smoothies: ${smoothies}/5`, 100, 500, 20, 'white');
  drawText(ctx, `Score: ${score}`, 300, 500, 20, 'white');

  // Back to map button
  const backHovered = isButtonHovered(600, 500, 150, 40, mouseX, mouseY, canvas);
  drawGradientButton(ctx, 600, 500, 150, 40, 'BACK TO MAP', '#2196F3', '#1976D2', backHovered);
  
  if (isButtonClicked(600, 500, 150, 40, mouseX, mouseY, clicked, canvas)) {
    onStateChange(GAME_STATES.MAP);
  }

  return null;
};
