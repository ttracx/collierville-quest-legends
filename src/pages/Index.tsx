import React, { useEffect, useRef, useState } from 'react';
import { GameState, GAME_STATES, GameData } from '../types/gameTypes';
import { Particle, createParticle, updateParticles, drawParticles } from '../utils/particleSystem';
import { GameMenu } from '../components/GameMenu';
import { GameInstructions } from '../components/GameInstructions';
import { GameMap } from '../components/GameMap';
import { generateMember, generateBadges, generateRecipe, generateIngredients } from '../utils/gameUtils';
import { FrontDesk } from '../components/FrontDesk';
import { Workout } from '../components/Workout';
import { Smoothie } from '../components/Smoothie';
import { Victory } from '../components/Victory';
import { soundSystem } from '../utils/soundSystem';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enhanced mobile-first canvas sizing
    const updateCanvasSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Account for iOS Safari's dynamic viewport and safe areas
      const actualHeight = window.visualViewport ? window.visualViewport.height : viewportHeight;
      
      // Use full viewport for immersive experience on mobile
      canvas.width = viewportWidth;
      canvas.height = actualHeight;
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${actualHeight}px`;
      
      // Prevent zoom on iOS
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
    
    // iOS Safari viewport handling
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    // Initialize sound system
    soundSystem.init();

    // Load Xavier's image
    const xavierImage = new Image();
    xavierImage.src = '/lovable-uploads/8131f420-fab4-4256-83b6-5f8339d387f4.png';
    let xavierImageLoaded = false;
    
    xavierImage.onload = () => {
      xavierImageLoaded = true;
    };

    // Load Morty's (Clark's) image
    const mortyImage = new Image();
    mortyImage.src = '/lovable-uploads/7bd337f7-c72b-48c2-a522-fc4dea130240.png';
    let mortyImageLoaded = false;
    
    mortyImage.onload = () => {
      mortyImageLoaded = true;
    };

    let gameState: GameState = GAME_STATES.MENU;
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
      completedGames: new Set()
    };

    // Enhanced mobile input handling
    let mouseX = 0, mouseY = 0;
    let clicked = false;
    let keys: { [key: string]: boolean } = {};
    let lastTouchTime = 0;

    // Animation and effects
    let particles: Particle[] = [];
    let backgroundStars: any[] = [];

    // Initialize background stars with mobile-optimized count
    const getStarCount = () => {
      const area = canvas.width * canvas.height;
      const baseCount = isMobile ? 20 : 50; // Fewer stars on mobile for performance
      return Math.max(baseCount, Math.min(80, Math.floor(area / 25000)));
    };

    const initializeStars = () => {
      backgroundStars = [];
      const starCount = getStarCount();
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
      
      // Prevent double-tap zoom on iOS
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

    // Enhanced event listeners for mobile
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

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
      gameState = newState;
      
      // Reinitialize stars when state changes for consistency
      if (newState === GAME_STATES.MENU) {
        initializeStars();
      }
      
      // Add sound effects for state changes
      if (newState === GAME_STATES.VICTORY) {
        soundSystem.playVictory();
      }
    }

    // Main game loop with mobile optimizations
    let frameCount = 0;

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles with mobile performance considerations
      particles = updateParticles(particles);

      // Reduce particle frequency on mobile for better performance
      const particleFrequency = isMobile ? 240 : 120;
      if (frameCount % particleFrequency === 0) {
        createParticle(Math.random() * canvas.width, 0, '#ffffff', 'trail', particles);
      }

      switch (gameState) {
        case GAME_STATES.MENU:
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
            onStateChange: handleStateChange
          });
          break;
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
            onStateChange: handleStateChange,
            completedGames: gameData.completedGames
          });
          break;
      }

      // Draw particles on top
      drawParticles(ctx, particles);

      clicked = false;
      frameCount++;
      requestAnimationFrame(gameLoop);
    }

    // Start the game
    gameLoop();

    // Cleanup
    return () => {
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

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* Enhanced mobile-optimized sound toggle button */}
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
      
      {/* Enhanced footer for mobile */}
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
    </div>
  );
};

export default Index;
