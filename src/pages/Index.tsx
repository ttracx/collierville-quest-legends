import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { Particle, createParticle, updateParticles, drawParticles } from '../utils/particleSystem';
import { GameMenu } from '../components/GameMenu';
import { GameInstructions } from '../components/GameInstructions';
import { GameMap } from '../components/GameMap';
import { generateMember, generateBadges, generateRecipe, generateIngredients } from '../utils/gameUtils';
import { FrontDesk } from '../components/FrontDesk';
import { Workout } from '../components/Workout';
import { Smoothie } from '../components/Smoothie';
import { Basketball } from '../components/Basketball';
import { Swimming } from '../components/Swimming';
import { Yoga } from '../components/Yoga';
import { Cardio } from '../components/Cardio';
import { Victory } from '../components/Victory';
import { Leaderboard } from '../components/Leaderboard';
import { SaveLoadGame } from '../components/SaveLoadGame';
import { soundSystem } from '../utils/soundSystem';
import { useIsMobile } from '../hooks/use-mobile';
import { generateAvatarDataURL } from '../utils/generateAvatars';

const Index = () => {
  console.log('Index component mounting...');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [currentGameState, setCurrentGameState] = useState<GameState>(GAME_STATES.MENU);
  const [currentGameData, setCurrentGameData] = useState<GameData | null>(null);
  const isMobile = useIsMobile();

  console.log('Initial game state:', currentGameState);
  console.log('Is mobile:', isMobile);

  useEffect(() => {
    console.log('Main useEffect starting...');
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref is null!');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context is null!');
      return;
    }

    console.log('Canvas and context initialized successfully');

    const updateCanvasSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const actualHeight = window.visualViewport ? window.visualViewport.height : viewportHeight;
      
      canvas.width = viewportWidth;
      canvas.height = actualHeight;
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${actualHeight}px`;
      
      canvas.style.touchAction = 'manipulation';
      
      console.log(`Canvas sized: ${viewportWidth}x${actualHeight} (mobile-optimized)`);
    };

    updateCanvasSize();
    
    const handleResize = () => {
      setTimeout(updateCanvasSize, 100);
    };
    
    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        setTimeout(updateCanvasSize, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    console.log('Sound system initializing...');
    soundSystem.init();

    console.log('Loading character images...');
    const xavierImage = new Image();
    xavierImage.src = '/lovable-uploads/8131f420-fab4-4256-83b6-5f8339d387f4.png';
    let xavierImageLoaded = false;
    
    xavierImage.onload = () => {
      console.log('Xavier image loaded');
      xavierImageLoaded = true;
    };
    xavierImage.onerror = (error) => {
      console.error('Xavier image failed to load:', error);
    };

    const mortyImage = new Image();
    mortyImage.src = '/lovable-uploads/7bd337f7-c72b-48c2-a522-fc4dea130240.png';
    let mortyImageLoaded = false;
    
    mortyImage.onload = () => {
      console.log('Morty image loaded');
      mortyImageLoaded = true;
    };
    mortyImage.onerror = (error) => {
      console.error('Morty image failed to load:', error);
    };

    const mikeImage = new Image();
    mikeImage.src = generateAvatarDataURL('mike');
    let mikeImageLoaded = false;
    
    mikeImage.onload = () => {
      console.log('Mike image loaded');
      mikeImageLoaded = true;
    };
    mikeImage.onerror = (error) => {
      console.error('Mike image failed to load:', error);
    };

    const carsonImage = new Image();
    carsonImage.src = generateAvatarDataURL('carson');
    let carsonImageLoaded = false;
    
    carsonImage.onload = () => {
      console.log('Carson image loaded');
      carsonImageLoaded = true;
    };
    carsonImage.onerror = (error) => {
      console.error('Carson image failed to load:', error);
    };

    const avaImage = new Image();
    avaImage.src = generateAvatarDataURL('ava');
    let avaImageLoaded = false;
    
    avaImage.onload = () => {
      console.log('Ava image loaded');
      avaImageLoaded = true;
    };
    avaImage.onerror = (error) => {
      console.error('Ava image failed to load:', error);
    };

    const princeImage = new Image();
    princeImage.src = generateAvatarDataURL('prince');
    let princeImageLoaded = false;
    
    princeImage.onload = () => {
      console.log('Prince image loaded');
      princeImageLoaded = true;
    };
    princeImage.onerror = (error) => {
      console.error('Prince image failed to load:', error);
    };

    let gameState: GameState = GAME_STATES.MENU;
    console.log('Game state initialized to:', gameState);

    // ... keep existing code (gameData initialization)
    let gameData: GameData = {
      frontDesk: {
        timer: 30,
        matches: 0,
        currentMember: null,
        badges: [],
        score: 0
      },
      workout: {
        reps: 0,
        progress: 0,
        lastKey: null,
        timer: 45,
        score: 0
      },
      smoothie: {
        smoothies: 0,
        currentRecipe: [],
        blender: [],
        ingredients: [],
        score: 0
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
      basketballScore: 0,
      swimmingScore: 0,
      yogaScore: 0,
      cardioScore: 0,
      frontDeskScore: 0,
      workoutScore: 0,
      smoothieScore: 0
    };

    let mouseX = 0, mouseY = 0;
    let clicked = false;
    let keys: { [key: string]: boolean } = {};
    let lastTouchTime = 0;

    let particles: Particle[] = [];
    let backgroundStars: any[] = [];

    const getStarCount = () => {
      const area = canvas.width * canvas.height;
      const baseCount = isMobile ? 20 : 50;
      return Math.max(baseCount, Math.min(80, Math.floor(area / 25000)));
    };

    const initializeStars = () => {
      backgroundStars = [];
      const starCount = getStarCount();
      console.log('Initializing', starCount, 'stars');
      for (let i = 0; i < starCount; i++) {
        backgroundStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    };

    initializeStars();

    // ... keep existing code (event handler functions)
    const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('changedTouches' in e && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return { x: mouseX, y: mouseY };
      }
      
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const coords = getEventCoordinates(e);
      mouseX = coords.x;
      mouseY = coords.y;
    };

    const handleClick = () => {
      clicked = true;
      soundSystem.playClick();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const coords = getEventCoordinates(e);
      mouseX = coords.x;
      mouseY = coords.y;
      
      const now = Date.now();
      if (now - lastTouchTime < 300) {
        e.preventDefault();
      }
      lastTouchTime = now;
      
      clicked = true;
      soundSystem.playClick();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const coords = getEventCoordinates(e);
      mouseX = coords.x;
      mouseY = coords.y;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // ... keep existing code (initMiniGame and handleStateChange functions)
    function initMiniGame(state: GameState) {
      if (state === GAME_STATES.FRONTDESK) {
        const currentMember = generateMember();
        gameData.frontDesk = {
          timer: 30,
          matches: 0,
          currentMember,
          badges: generateBadges(currentMember),
          score: 0
        };
      } else if (state === GAME_STATES.WORKOUT) {
        gameData.workout = {
          reps: 0,
          progress: 0,
          lastKey: null,
          timer: 45,
          score: 0
        };
      } else if (state === GAME_STATES.SMOOTHIE) {
        gameData.smoothie = {
          smoothies: 0,
          currentRecipe: generateRecipe(),
          blender: [],
          ingredients: generateIngredients(),
          score: 0
        };
      }
    }

    function handleStateChange(newState: GameState) {
      console.log('State changing from', gameState, 'to', newState);
      gameState = newState;
      
      if (newState === GAME_STATES.MENU) {
        initializeStars();
      }
      
      if (newState === GAME_STATES.VICTORY) {
        soundSystem.playVictory();
      }
    }

    let frameCount = 0;

    function gameLoop() {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = updateParticles(particles);

        const particleFrequency = isMobile ? 240 : 120;
        if (frameCount % particleFrequency === 0) {
          createParticle(Math.random() * canvas.width, 0, '#ffffff', 'trail', particles);
        }

        if (frameCount === 0) {
          console.log('First frame rendered, game state:', gameState);
        }

        switch (gameState) {
          case GAME_STATES.MENU:
            if (frameCount === 0) {
              console.log('Rendering GameMenu component');
            }
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
              carsonImage,
              carsonImageLoaded,
              avaImage,
              avaImageLoaded,
              princeImage,
              princeImageLoaded,
              onStateChange: handleStateChange
            });
            break;
          // ... keep existing code (all other game state cases)
          case GAME_STATES.INSTRUCTIONS:
            GameInstructions({
              ctx,
              canvas,
              mouseX,
              mouseY,
              clicked,
              onStateChange: handleStateChange
            });
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
              carsonImage,
              carsonImageLoaded,
              avaImage,
              avaImageLoaded,
              princeImage,
              princeImageLoaded,
              onStateChange: handleStateChange,
              onInitMiniGame: initMiniGame
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
              gameData: gameData,
              keys: keys,
              particles: particles,
              onStateChange: handleStateChange,
              onUpdateGameData: (newGameData) => { gameData = newGameData; }
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
              gameData: gameData,
              keys: keys,
              particles: particles,
              onStateChange: handleStateChange,
              onUpdateGameData: (newGameData) => { gameData = newGameData; }
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
              gameData: gameData,
              particles: particles,
              onStateChange: handleStateChange,
              onUpdateGameData: (newGameData) => { gameData = newGameData; }
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
              gameData: gameData,
              keys: keys,
              particles: particles,
              onStateChange: handleStateChange,
              onUpdateGameData: (newGameData) => { gameData = newGameData; }
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
              gameData: gameData,
              keys: keys,
              particles: particles,
              onStateChange: handleStateChange,
              onUpdateGameData: (newGameData) => { gameData = newGameData; }
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
              gameData: gameData,
              keys: keys,
              particles: particles,
              onStateChange: handleStateChange,
              onUpdateGameData: (newGameData) => { gameData = newGameData; }
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
              gameData: gameData,
              keys: keys,
              particles: particles,
              onStateChange: handleStateChange,
              onUpdateGameData: (newGameData) => { gameData = newGameData; }
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
              particles: particles,
              xavierImage: xavierImage,
              xavierImageLoaded: xavierImageLoaded,
              mortyImage: mortyImage,
              mortyImageLoaded: mortyImageLoaded,
              mikeImage: mikeImage,
              mikeImageLoaded: mikeImageLoaded,
              carsonImage: carsonImage,
              carsonImageLoaded: carsonImageLoaded,
              avaImage: avaImage,
              avaImageLoaded: avaImageLoaded,
              princeImage: princeImage,
              princeImageLoaded: princeImageLoaded,
              onStateChange: handleStateChange,
              completedGames: gameData.completedGames
            });
            break;
          case GAME_STATES.LEADERBOARD:
            setShowLeaderboard(true);
            setCurrentGameData(gameData);
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
              carsonImage,
              carsonImageLoaded,
              avaImage,
              avaImageLoaded,
              princeImage,
              princeImageLoaded,
              onStateChange: handleStateChange
            });
            break;
          case GAME_STATES.SAVE_LOAD:
            setShowSaveLoad(true);
            setCurrentGameData(gameData);
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
              carsonImage,
              carsonImageLoaded,
              avaImage,
              avaImageLoaded,
              princeImage,
              princeImageLoaded,
              onStateChange: handleStateChange
            });
            break;
        }

        drawParticles(ctx, particles);

        clicked = false;
        frameCount++;
        
        if (frameCount === 1) {
          console.log('Game loop running successfully, frame count:', frameCount);
        }
        
        requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error('Error in game loop:', error);
      }
    }

    console.log('Starting game loop...');
    gameLoop();

    return () => {
      console.log('Cleaning up Index component...');
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, [isMobile]);

  const toggleSound = () => {
    const enabled = soundSystem.toggle();
    setSoundEnabled(enabled);
  };

  const handleLoadGame = (loadedState: any, loadedScores: any) => {
    if (currentGameData) {
      setCurrentGameData({
        ...currentGameData,
        ...loadedScores
      });
    }
    setShowSaveLoad(false);
    setCurrentGameState(GAME_STATES.MAP);
  };

  console.log('Rendering Index component JSX...');

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center overflow-hidden">
      <button
        onClick={toggleSound}
        className={`absolute top-2 right-2 z-20 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors shadow-lg ${
          isMobile ? 'p-2 text-lg' : 'p-3 text-xl'
        }`}
        style={{ 
          minHeight: isMobile ? '44px' : 'auto',
          minWidth: isMobile ? '44px' : 'auto',
          touchAction: 'manipulation'
        }}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
      
      <canvas
        ref={canvasRef}
        className="block"
        style={{ 
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      />
      
      <div className={`absolute ${isMobile ? 'bottom-1' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-20`}>
        <p className={`text-gray-400 text-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
          by{' '}
          <a 
            href="https://tunaas.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            Tunaas.ai
          </a>
        </p>
      </div>

      {showLeaderboard && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Leaderboard
              currentScore={currentGameData?.totalScore}
              onClose={() => {
                setShowLeaderboard(false);
                setCurrentGameState(GAME_STATES.MENU);
              }}
            />
          </div>
        </div>,
        document.body
      )}

      {showSaveLoad && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <SaveLoadGame
              gameState={currentGameState}
              scores={{
                basketball: currentGameData?.basketball.score || 0,
                swimming: currentGameData?.swimming.score || 0,
                yoga: currentGameData?.yoga.score || 0,
                cardio: currentGameData?.cardio.score || 0,
                frontDesk: currentGameData?.frontDesk.score || 0,
                workout: currentGameData?.workout.score || 0,
                smoothie: currentGameData?.smoothie.score || 0
              }}
              onLoadGame={handleLoadGame}
              onClose={() => {
                setShowSaveLoad(false);
                setCurrentGameState(GAME_STATES.MENU);
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Index;
