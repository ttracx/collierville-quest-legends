
import { useState } from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';

export const useGameStateManager = () => {
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.MENU);
  const [gameData, setGameData] = useState<GameData>({
    frontDesk: {
      timer: 30,
      matches: 0,
      currentMember: null,
      badges: [],
      score: 0,
    },
    workout: {
      reps: 0,
      progress: 0,
      lastKey: null,
      timer: 45,
      score: 0,
    },
    smoothie: {
      smoothies: 0,
      currentRecipe: ['Banana', 'Strawberry'],
      blender: [],
      ingredients: [],
      score: 0,
    },
    basketball: {
      shots: 0,
      makes: 0,
      ballX: 400,
      ballY: 500,
      ballVelocityX: 0,
      ballVelocityY: 0,
      isCharging: false,
      chargePower: 0,
      timer: 0,
      score: 0,
    },
    swimming: {
      laps: 0,
      position: 100,
      speed: 0,
      stamina: 100,
      rhythm: 0,
      timer: 0,
      score: 0,
    },
    yoga: {
      currentPose: 'Mountain Pose',
      poseTimer: 15,
      posesCompleted: 0,
      balance: 50,
      breathing: 50,
      timer: 0,
      score: 0,
    },
    cardio: {
      currentExercise: 'Running',
      intensity: 50,
      heartRate: 80,
      calories: 0,
      exerciseTimer: 15,
      timer: 0,
      score: 0,
    },
    totalScore: 0,
    completedGames: new Set(),
  });

  const initMiniGame = (state: GameState, canvas: HTMLCanvasElement) => {
    switch (state) {
      case GAME_STATES.FRONTDESK:
        setGameData(prev => ({
          ...prev,
          frontDesk: {
            timer: 30,
            matches: 0,
            currentMember: null,
            badges: [],
            score: 0,
          }
        }));
        break;
      case GAME_STATES.WORKOUT:
        setGameData(prev => ({
          ...prev,
          workout: {
            reps: 0,
            progress: 0,
            lastKey: null,
            timer: 45,
            score: 0,
          }
        }));
        break;
      case GAME_STATES.SMOOTHIE:
        setGameData(prev => ({
          ...prev,
          smoothie: {
            smoothies: 0,
            currentRecipe: ['Banana', 'Strawberry'],
            blender: [],
            ingredients: [],
            score: 0,
          }
        }));
        break;
      case GAME_STATES.BASKETBALL:
        setGameData(prev => ({
          ...prev,
          basketball: {
            shots: 0,
            makes: 0,
            ballX: canvas.width / 2,
            ballY: canvas.height - 100,
            ballVelocityX: 0,
            ballVelocityY: 0,
            isCharging: false,
            chargePower: 0,
            timer: 0,
            score: 0,
          }
        }));
        break;
      case GAME_STATES.SWIMMING:
        setGameData(prev => ({
          ...prev,
          swimming: {
            laps: 0,
            position: 100,
            speed: 0,
            stamina: 100,
            rhythm: 0,
            timer: 0,
            score: 0,
          }
        }));
        break;
      case GAME_STATES.YOGA:
        setGameData(prev => ({
          ...prev,
          yoga: {
            currentPose: 'Mountain Pose',
            poseTimer: 15,
            posesCompleted: 0,
            balance: 50,
            breathing: 50,
            timer: 0,
            score: 0,
          }
        }));
        break;
      case GAME_STATES.CARDIO:
        setGameData(prev => ({
          ...prev,
          cardio: {
            currentExercise: 'Running',
            intensity: 50,
            heartRate: 80,
            calories: 0,
            exerciseTimer: 15,
            timer: 0,
            score: 0,
          }
        }));
        break;
      default:
        break;
    }
  };

  return {
    gameState,
    setGameState,
    gameData,
    setGameData,
    initMiniGame
  };
};
