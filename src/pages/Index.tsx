
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

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Optimized canvas sizing for both orientations
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isLandscape = viewportWidth > viewportHeight;
      
      let canvasWidth, canvasHeight;
      
      if (isLandscape) {
        // Landscape: wider canvas
        const maxWidth = Math.min(viewportWidth * 0.9, 900);
        const maxHeight = Math.min(viewportHeight * 0.8, 600);
        const aspectRatio = 900 / 600; // 3:2 for landscape
        
        canvasWidth = maxWidth;
        canvasHeight = canvasWidth / aspectRatio;
        
        if (canvasHeight > maxHeight) {
          canvasHeight = maxHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
      } else {
        // Portrait: taller canvas
        const maxWidth = Math.min(viewportWidth * 0.95, 400);
        const maxHeight = Math.min(viewportHeight * 0.75, 700);
        const aspectRatio = 400 / 700; // Portrait ratio
        
        canvasWidth = maxWidth;
        canvasHeight = canvasWidth / aspectRatio;
        
        if (canvasHeight > maxHeight) {
          canvasHeight = maxHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateCanvasSize, 100); // Delay for orientation change
    });

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
      totalScore: 0,
      completedGames: new Set()
    };

    // Input handling optimized for mobile
    let mouseX = 0, mouseY = 0;
    let clicked = false;
    let keys: { [key: string]: boolean } = {};

    // Animation and effects
    let particles: Particle[] = [];
    let backgroundStars: any[] = [];

    // Initialize background stars with dynamic count
    const getStarCount = () => {
      const area = canvas.width * canvas.height;
      return Math.max(20, Math.min(50, Math.floor(area / 15000)));
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
      clicked = true;
      soundSystem.playClick();
    };

    const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
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

    // Main game loop
    let frameCount = 0;

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles = updateParticles(particles);

      // Add ambient particles for atmosphere
      if (frameCount % 120 === 0) {
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
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('orientationchange', updateCanvasSize);
    };
  }, []);

  const toggleSound = () => {
    const enabled = soundSystem.toggle();
    setSoundEnabled(enabled);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-2 sm:p-4 relative">
      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors text-lg"
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
      
      <div className="relative flex flex-col items-center w-full max-w-4xl">
        <canvas
          ref={canvasRef}
          className="border-2 border-orange-500 bg-gray-800 rounded-lg shadow-2xl touch-none max-w-full max-h-[75vh]"
          style={{ touchAction: 'none' }}
        />
        <div className="mt-2 sm:mt-4 text-center text-white text-xs sm:text-sm max-w-xs sm:max-w-md px-2">
          Tap to interact • Use A/D keys for workout (or tap workout buttons on mobile)
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-4 sm:mt-8 text-center px-4">
        <p className="text-gray-400 text-xs sm:text-sm">
          Lifetime Legends by{' '}
          <a 
            href="https://tunaas.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 transition-colors"
          >
            Tunaas.ai
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
