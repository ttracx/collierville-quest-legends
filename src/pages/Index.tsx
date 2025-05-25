import React, { useEffect, useRef } from 'react';
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

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // Input handling
    let mouseX = 0, mouseY = 0;
    let clicked = false;
    let keys: { [key: string]: boolean } = {};

    // Animation and effects
    let particles: Particle[] = [];
    let backgroundStars: any[] = [];

    // Initialize background stars
    for (let i = 0; i < 50; i++) {
      backgroundStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    const handleClick = () => clicked = true;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height);
      }
      clicked = true;
    };

    const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keys[e.key] = false;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart);
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
    }

    // Main game loop
    let frameCount = 0;

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles = updateParticles(particles);

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
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-orange-500 bg-gray-800 max-w-full max-h-[80vh] rounded-lg shadow-2xl"
          style={{ touchAction: 'none' }}
        />
        <div className="absolute -bottom-12 left-0 right-0 text-center text-white text-sm">
          Use mouse/touch to interact, A/D keys for workout challenge
        </div>
      </div>
    </div>
  );
};

export default Index;
