
import React from 'react';
import { GameMenu } from './GameMenu';
import { GameMap } from './GameMap';
import { FrontDesk } from './FrontDesk';
import { Workout } from './Workout';
import { Smoothie } from './Smoothie';
import { Basketball } from './Basketball';
import { Swimming } from './Swimming';
import { Yoga } from './Yoga';
import { Cardio } from './Cardio';
import { Victory } from './Victory';
import { GameInstructions as Instructions } from './GameInstructions';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { Particle } from '../utils/particleSystem';

interface GameRendererProps {
  gameState: GameState;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  backgroundStars: any[];
  particles: Particle[];
  keys: { [key: string]: boolean };
  gameData: GameData;
  xavierImage?: HTMLImageElement;
  xavierImageLoaded: boolean;
  mortyImage?: HTMLImageElement;
  mortyImageLoaded: boolean;
  mikeImage?: HTMLImageElement;
  mikeImageLoaded: boolean;
  onStateChange: (state: GameState) => void;
  onUpdateGameData: (gameData: GameData) => void;
  onInitMiniGame: (state: GameState) => void;
}

export const GameRenderer: React.FC<GameRendererProps> = ({
  gameState,
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  backgroundStars,
  particles,
  keys,
  gameData,
  xavierImage,
  xavierImageLoaded,
  mortyImage,
  mortyImageLoaded,
  mikeImage,
  mikeImageLoaded,
  onStateChange,
  onUpdateGameData,
  onInitMiniGame
}) => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render the current game state
  switch (gameState) {
    case GAME_STATES.MENU:
      // Ensure images are loaded before rendering the menu
      if (xavierImageLoaded && mortyImageLoaded && mikeImageLoaded) {
        GameMenu({
          ctx,
          canvas,
          mouseX,
          mouseY,
          clicked,
          frameCount,
          backgroundStars,
          particles,
          xavierImage,
          xavierImageLoaded,
          mortyImage,
          mortyImageLoaded,
          mikeImage,
          mikeImageLoaded,
          onStateChange
        });
      }
      break;
    case GAME_STATES.MAP:
      GameMap({
        ctx,
        canvas,
        mouseX,
        mouseY,
        clicked,
        frameCount,
        totalScore: gameData.totalScore,
        completedGames: gameData.completedGames,
        particles,
        xavierImage,
        xavierImageLoaded,
        mortyImage,
        mortyImageLoaded,
        mikeImage,
        mikeImageLoaded,
        onStateChange,
        onInitMiniGame
      });
      break;
    case GAME_STATES.FRONTDESK:
      FrontDesk({
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
      });
      break;
    case GAME_STATES.WORKOUT:
      Workout({
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
      });
      break;
    case GAME_STATES.SMOOTHIE:
      Smoothie({
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
      });
      break;
    case GAME_STATES.BASKETBALL:
      Basketball({
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
      });
      break;
    case GAME_STATES.SWIMMING:
      Swimming({
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
      });
      break;
    case GAME_STATES.YOGA:
      Yoga({
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
      });
      break;
    case GAME_STATES.CARDIO:
      Cardio({
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
      });
      break;
    case GAME_STATES.VICTORY:
      Victory({
        ctx,
        canvas,
        mouseX,
        mouseY,
        clicked,
        frameCount,
        totalScore: gameData.totalScore,
        completedGames: gameData.completedGames,
        onStateChange,
        particles
      });
      break;
    case GAME_STATES.INSTRUCTIONS:
      Instructions({
        ctx,
        canvas,
        mouseX,
        mouseY,
        clicked,
        onStateChange
      });
      break;
    default:
      break;
  }

  return null;
};
