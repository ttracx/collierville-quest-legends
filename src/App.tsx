
import React, { useState, useEffect } from 'react';
import { GameMenu } from './components/GameMenu';
import { GameMap } from './components/GameMap';
import { FrontDesk } from './components/FrontDesk';
import { Workout } from './components/Workout';
import { Smoothie } from './components/Smoothie';
import { Victory } from './components/Victory';
import { GameInstructions as Instructions } from './components/GameInstructions';
import { GameState, GAME_STATES, GameData } from './types/gameTypes';
import { Particle } from './utils/particleSystem';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.MENU);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [backgroundStars, setBackgroundStars] = useState<any[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [xavierImage, setXavierImage] = useState<HTMLImageElement>();
  const [xavierImageLoaded, setXavierImageLoaded] = useState(false);
  const [mortyImage, setMortyImage] = useState<HTMLImageElement>();
  const [mortyImageLoaded, setMortyImageLoaded] = useState(false);
  const [mikeImage, setMikeImage] = useState<HTMLImageElement>();
  const [mikeImageLoaded, setMikeImageLoaded] = useState(false);

  // Initialize game data
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
    totalScore: 0,
    completedGames: new Set(),
  });

  useEffect(() => {
    const initStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          x: Math.random() * (canvas?.width || 800),
          y: Math.random() * (canvas?.height || 600),
          size: Math.random() * 2,
          opacity: Math.random()
        });
      }
      setBackgroundStars(newStars);
    };

    // Load Xavier's image
    const xavierImg = new Image();
    xavierImg.onload = () => {
      setXavierImage(xavierImg);
      setXavierImageLoaded(true);
      console.log('Xavier image loaded successfully');
    };
    xavierImg.onerror = (error) => {
      console.error('Failed to load Xavier image:', error);
      setXavierImageLoaded(false);
    };
    xavierImg.src = '/lovable-uploads/46f9249d-797d-4991-a9d7-728954ada963.png';

    // Load Morty's image
    const mortyImg = new Image();
    mortyImg.onload = () => {
      setMortyImage(mortyImg);
      setMortyImageLoaded(true);
      console.log('Morty image loaded successfully');
    };
    mortyImg.onerror = (error) => {
      console.error('Failed to load Morty image:', error);
      setMortyImageLoaded(false);
    };
    mortyImg.src = '/lovable-uploads/0a509393-0a99-4a04-8949-344699379246.png';

    // Load Mike's image - using the uploaded image
    const img = new Image();
    img.onload = () => {
      setMikeImage(img);
      setMikeImageLoaded(true);
      console.log('Mike image loaded successfully');
    };
    img.onerror = (error) => {
      console.error('Failed to load Mike image:', error);
      setMikeImageLoaded(false);
    };
    // Use the most recent uploaded image for Mike
    img.src = '/lovable-uploads/8131f420-fab4-4256-83b6-5f8339d387f4.png';

    if (canvas) {
      initStars();
    }

    // Add keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvas]);

  useEffect(() => {
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      const render = () => {
        if (!ctx) return;

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
                onStateChange: setGameState
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
              onStateChange: setGameState,
              onInitMiniGame: (state: GameState) => {
                // Reset minigame state when navigating away
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
                  default:
                    break;
                }
              }
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
              onStateChange: setGameState,
              onUpdateGameData: setGameData
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
              onStateChange: setGameState,
              onUpdateGameData: setGameData
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
              onStateChange: setGameState,
              onUpdateGameData: setGameData
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
              onStateChange: setGameState,
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
              onStateChange: setGameState
            });
            break;
          default:
            break;
        }

        setFrameCount(prevFrameCount => prevFrameCount + 1);
        setParticles(particles => particles.filter(particle => particle.life > 0));
        requestAnimationFrame(render);
      };

      render();
    }
  }, [ctx, canvas, gameState, mouseX, mouseY, clicked, backgroundStars, gameData, xavierImage, xavierImageLoaded, mortyImage, mortyImageLoaded, mikeImage, mikeImageLoaded, keys]);

  return (
    <canvas
      ref={ref => {
        if (ref) {
          setCanvas(ref);
          setCtx(ref.getContext('2d'));
          ref.width = window.innerWidth;
          ref.height = window.innerHeight;
        }
      }}
      style={{ background: 'black' }}
      onClick={e => {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
        setClicked(true);
        setTimeout(() => setClicked(false), 100);
      }}
      onMouseMove={e => {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
      }}
    />
  );
};

export default App;
