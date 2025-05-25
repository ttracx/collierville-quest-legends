
import React from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { drawText, drawGradientButton, isButtonClicked, isButtonHovered, getResponsivePosition } from '../utils/uiHelpers';
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
  const isMobile = canvas.width < 768;
  const isPortrait = canvas.height > canvas.width;

  // Enhanced mobile-responsive background
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, '#4a148c');
  bgGradient.addColorStop(1, '#6a1b9a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Mobile-optimized title
  const titlePos = getResponsivePosition(400, 60, canvas);
  const titleSize = isMobile ? 24 : 32;
  drawText(ctx, 'SMOOTHIE RUSH', titlePos.x, titlePos.y, titleSize, '#ff6b35', 'center', true);

  const { smoothies, currentRecipe, blender, ingredients, score } = gameData.smoothie;

  // Initialize ingredients if empty
  if (ingredients.length === 0) {
    gameData.smoothie.ingredients = generateIngredients();
    onUpdateGameData(gameData);
  }

  // Mobile-responsive layout positioning
  const recipeX = isPortrait ? 400 : 200;
  const recipeY = isMobile ? (isPortrait ? 120 : 100) : 120;
  const blenderX = isPortrait ? 400 : 600;
  const blenderY = isPortrait ? 280 : 120;

  // Display current recipe with mobile optimization
  const recipePos = getResponsivePosition(recipeX, recipeY, canvas);
  const recipeTextSize = isMobile ? 16 : 20;
  drawText(ctx, 'Recipe:', recipePos.x, recipePos.y, recipeTextSize, 'white', 'center', true);
  
  currentRecipe.forEach((item, index) => {
    const itemY = recipeY + 30 + index * (isMobile ? 20 : 25);
    const itemPos = getResponsivePosition(recipeX, itemY, canvas);
    const itemTextSize = isMobile ? 12 : 16;
    drawText(ctx, `${index + 1}. ${item}`, itemPos.x, itemPos.y, itemTextSize, '#FFD700', 'center');
  });

  // Display blender contents with mobile optimization
  const blenderPos = getResponsivePosition(blenderX, blenderY, canvas);
  drawText(ctx, 'Blender:', blenderPos.x, blenderPos.y, recipeTextSize, 'white', 'center', true);
  
  blender.forEach((item, index) => {
    const itemY = blenderY + 30 + index * (isMobile ? 20 : 25);
    const itemPos = getResponsivePosition(blenderX, itemY, canvas);
    const itemTextSize = isMobile ? 12 : 16;
    drawText(ctx, `${index + 1}. ${item}`, itemPos.x, itemPos.y, itemTextSize, '#4CAF50', 'center');
  });

  // Mobile-optimized ingredients layout
  const ingredientStartY = isPortrait ? 420 : (isMobile ? 320 : 450);
  const ingredientSpacing = isMobile ? (isPortrait ? 80 : 60) : 120;
  const ingredientSize = isMobile ? 60 : 80;

  ingredients.forEach((ingredient, index) => {
    let ingredientX, ingredientY;
    
    if (isPortrait) {
      // Vertical layout for portrait mobile
      ingredientX = 400;
      ingredientY = ingredientStartY + index * 70;
    } else {
      // Horizontal layout for landscape
      ingredientX = 100 + (index * ingredientSpacing);
      ingredientY = ingredientStartY;
    }

    const ingredientPos = getResponsivePosition(ingredientX, ingredientY, canvas);
    const buttonSize = ingredientSize;
    
    const hovered = isButtonHovered(
      ingredientX - buttonSize/2, 
      ingredientY - buttonSize/2, 
      buttonSize, 
      buttonSize, 
      mouseX, 
      mouseY, 
      canvas
    );
    
    // Enhanced mobile-friendly ingredient buttons
    const gradient = ctx.createLinearGradient(
      ingredientPos.x - buttonSize/2, 
      ingredientPos.y - buttonSize/2, 
      ingredientPos.x + buttonSize/2, 
      ingredientPos.y + buttonSize/2
    );
    
    if (hovered) {
      gradient.addColorStop(0, ingredient.color);
      gradient.addColorStop(1, '#333');
    } else {
      gradient.addColorStop(0, '#333');
      gradient.addColorStop(1, ingredient.color);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      ingredientPos.x - buttonSize/2, 
      ingredientPos.y - buttonSize/2, 
      buttonSize, 
      buttonSize
    );
    
    ctx.strokeStyle = ingredient.color;
    ctx.lineWidth = hovered ? 4 : 2;
    ctx.strokeRect(
      ingredientPos.x - buttonSize/2, 
      ingredientPos.y - buttonSize/2, 
      buttonSize, 
      buttonSize
    );
    
    const textSize = isMobile ? 10 : 14;
    drawText(ctx, ingredient.name, ingredientPos.x, ingredientPos.y, textSize, 'white', 'center', true);
    
    if (isButtonClicked(
      ingredientX - buttonSize/2, 
      ingredientY - buttonSize/2, 
      buttonSize, 
      buttonSize, 
      mouseX, 
      mouseY, 
      clicked, 
      canvas
    )) {
      gameData.smoothie.blender.push(ingredient.name);
      createParticle(ingredientPos.x, ingredientPos.y, ingredient.color, 'burst', particles);
      
      // Check if recipe is complete
      if (gameData.smoothie.blender.length === currentRecipe.length) {
        const isCorrect = gameData.smoothie.blender.every((item, index) => item === currentRecipe[index]);
        
        if (isCorrect) {
          gameData.smoothie.smoothies++;
          gameData.smoothie.score += 100;
          createParticle(blenderPos.x, blenderPos.y, '#4CAF50', 'burst', particles);
          
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
          createParticle(blenderPos.x, blenderPos.y, '#f44336', 'burst', particles);
        }
        
        // Clear blender
        gameData.smoothie.blender = [];
      }
      
      onUpdateGameData(gameData);
    }
  });

  // Mobile-optimized blender visual
  const blenderVisualY = isPortrait ? 200 : 250;
  const blenderVisualPos = getResponsivePosition(blenderX, blenderVisualY, canvas);
  const blenderWidth = isMobile ? 80 : 100;
  const blenderHeight = isMobile ? 120 : 150;

  ctx.fillStyle = '#555';
  ctx.fillRect(
    blenderVisualPos.x - blenderWidth/2, 
    blenderVisualPos.y - blenderHeight/2, 
    blenderWidth, 
    blenderHeight
  );
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeRect(
    blenderVisualPos.x - blenderWidth/2, 
    blenderVisualPos.y - blenderHeight/2, 
    blenderWidth, 
    blenderHeight
  );

  // Mobile-optimized clear button
  const clearButtonY = blenderVisualY + blenderHeight/2 + (isMobile ? 30 : 40);
  const clearButtonPos = getResponsivePosition(blenderX, clearButtonY, canvas);
  const clearButtonWidth = isMobile ? 80 : 100;
  const clearButtonHeight = isMobile ? 35 : 40;
  
  const clearHovered = isButtonHovered(
    blenderX - clearButtonWidth/2, 
    clearButtonY - clearButtonHeight/2, 
    clearButtonWidth, 
    clearButtonHeight, 
    mouseX, 
    mouseY, 
    canvas
  );
  
  drawGradientButton(
    ctx, 
    blenderX - clearButtonWidth/2, 
    clearButtonY - clearButtonHeight/2, 
    clearButtonWidth, 
    clearButtonHeight, 
    'CLEAR', 
    '#f44336', 
    '#d32f2f', 
    clearHovered
  );
  
  if (isButtonClicked(
    blenderX - clearButtonWidth/2, 
    clearButtonY - clearButtonHeight/2, 
    clearButtonWidth, 
    clearButtonHeight, 
    mouseX, 
    mouseY, 
    clicked, 
    canvas
  )) {
    gameData.smoothie.blender = [];
    onUpdateGameData(gameData);
  }

  // Mobile-optimized game info positioning
  const infoY = canvas.height - (isMobile ? 80 : 100);
  const smoothiesPos = getResponsivePosition(150, infoY, canvas);
  const scorePos = getResponsivePosition(400, infoY, canvas);
  const infoTextSize = isMobile ? 16 : 20;
  
  drawText(ctx, `Smoothies: ${smoothies}/5`, smoothiesPos.x, smoothiesPos.y, infoTextSize, 'white', 'center', true);
  drawText(ctx, `Score: ${score}`, scorePos.x, scorePos.y, infoTextSize, 'white', 'center', true);

  // Mobile-optimized back button
  const backButtonY = canvas.height - (isMobile ? 40 : 60);
  const backButtonPos = getResponsivePosition(650, backButtonY, canvas);
  const backButtonWidth = isMobile ? 120 : 150;
  const backButtonHeight = isMobile ? 35 : 40;
  
  const backHovered = isButtonHovered(
    650 - backButtonWidth/2, 
    backButtonY - backButtonHeight/2, 
    backButtonWidth, 
    backButtonHeight, 
    mouseX, 
    mouseY, 
    canvas
  );
  
  drawGradientButton(
    ctx, 
    650 - backButtonWidth/2, 
    backButtonY - backButtonHeight/2, 
    backButtonWidth, 
    backButtonHeight, 
    'BACK TO MAP', 
    '#2196F3', 
    '#1976D2', 
    backHovered
  );
  
  if (isButtonClicked(
    650 - backButtonWidth/2, 
    backButtonY - backButtonHeight/2, 
    backButtonWidth, 
    backButtonHeight, 
    mouseX, 
    mouseY, 
    clicked, 
    canvas
  )) {
    onStateChange(GAME_STATES.MAP);
  }

  return null;
};
