
import React, { useEffect, useRef } from 'react';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game states
    const STATES = {
      MENU: 'menu',
      INSTRUCTIONS: 'instructions',
      MAP: 'map',
      FRONTDESK: 'frontdesk',
      WORKOUT: 'workout',
      SMOOTHIE: 'smoothie',
      VICTORY: 'victory'
    };

    let gameState = STATES.MENU;
    let totalScore = 0;
    let completedGames = new Set();

    // Input handling
    let mouseX = 0, mouseY = 0;
    let clicked = false;
    let keys: { [key: string]: boolean } = {};

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

    // Utility functions
    function drawText(text: string, x: number, y: number, size = 20, color = 'white', align: CanvasTextAlign = 'center') {
      ctx.font = `${size}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(text, x, y);
    }

    function drawButton(x: number, y: number, width: number, height: number, text: string, color = '#ff6b35') {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(x, y, width, height);
      drawText(text, x + width / 2, y + height / 2 + 8, 24, 'white');
    }

    function isButtonClicked(x: number, y: number, width: number, height: number) {
      return clicked && mouseX >= x && mouseX <= x + width &&
        mouseY >= y && mouseY <= y + height;
    }

    // Character drawing functions
    function drawXavier(x: number, y: number, scale = 1) {
      // Head
      ctx.fillStyle = '#8B6F47';
      ctx.beginPath();
      ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(x, y - 10 * scale, 20 * scale, Math.PI, 0);
      ctx.fill();

      // Beard
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x - 15 * scale, y + 5 * scale, 30 * scale, 15 * scale);

      // Eyes
      ctx.fillStyle = 'white';
      ctx.fillRect(x - 8 * scale, y - 5 * scale, 6 * scale, 6 * scale);
      ctx.fillRect(x + 2 * scale, y - 5 * scale, 6 * scale, 6 * scale);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x - 6 * scale, y - 3 * scale, 3 * scale, 3 * scale);
      ctx.fillRect(x + 3 * scale, y - 3 * scale, 3 * scale, 3 * scale);

      // Body (beige sweater)
      ctx.fillStyle = '#D4A574';
      ctx.fillRect(x - 25 * scale, y + 20 * scale, 50 * scale, 60 * scale);

      // Arms
      ctx.fillRect(x - 35 * scale, y + 25 * scale, 10 * scale, 40 * scale);
      ctx.fillRect(x + 25 * scale, y + 25 * scale, 10 * scale, 40 * scale);

      // Earring
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x - 20 * scale, y, 2 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawMemberAvatar(x: number, y: number, color: string) {
      // Head
      ctx.fillStyle = '#8B6F47';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y - 8, 15, Math.PI, 0);
      ctx.fill();

      // Body
      ctx.fillStyle = color;
      ctx.fillRect(x - 20, y + 15, 40, 40);
    }

    // Menu screen
    function drawMenu() {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('LIFETIME LEGENDS', canvas.width / 2, 150, 48, '#ff6b35');
      drawText('Collierville Quest', canvas.width / 2, 200, 32, 'white');
      drawText('Starring Xavier Payne', canvas.width / 2, 250, 20, '#ccc');

      // Draw Xavier
      drawXavier(canvas.width / 2, 320, 1.5);

      drawButton(300, 400, 200, 60, 'START GAME');
      drawButton(300, 480, 200, 60, 'INSTRUCTIONS', '#2196F3');

      if (isButtonClicked(300, 400, 200, 60)) {
        gameState = STATES.MAP;
      }
      if (isButtonClicked(300, 480, 200, 60)) {
        gameState = STATES.INSTRUCTIONS;
      }

      drawText('Click or tap to play', canvas.width / 2, 560, 16, '#888');
    }

    // Instructions screen
    function drawInstructions() {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('HOW TO PLAY', canvas.width / 2, 60, 36, '#ff6b35');

      // Front Desk Instructions
      ctx.fillStyle = '#333';
      ctx.fillRect(50, 100, 220, 140);
      drawText('FRONT DESK', 160, 130, 20, '#ff6b35');
      drawText('Match members to', 160, 160, 16, 'white');
      drawText('their correct badges', 160, 180, 16, 'white');
      drawText('Click the right badge!', 160, 200, 16, 'white');
      drawText('Goal: 10 matches', 160, 220, 16, '#4CAF50');

      // Workout Instructions
      ctx.fillStyle = '#333';
      ctx.fillRect(290, 100, 220, 140);
      drawText('WORKOUT', 400, 130, 20, '#ff6b35');
      drawText('Press A & D keys', 400, 160, 16, 'white');
      drawText('alternately to lift', 400, 180, 16, 'white');
      drawText('(or tap screen sides)', 400, 200, 16, 'white');
      drawText('Goal: 15 reps', 400, 220, 16, '#4CAF50');

      // Smoothie Instructions
      ctx.fillStyle = '#333';
      ctx.fillRect(530, 100, 220, 140);
      drawText('SMOOTHIE RUSH', 640, 130, 20, '#ff6b35');
      drawText('Click ingredients in', 640, 160, 16, 'white');
      drawText('the recipe order', 640, 180, 16, 'white');
      drawText('to make smoothies', 640, 200, 16, 'white');
      drawText('Goal: 5 smoothies', 640, 220, 16, '#4CAF50');

      // General tips
      drawText('TIPS', canvas.width / 2, 280, 24, '#ff6b35');
      drawText('• Complete all 3 challenges to win!', canvas.width / 2, 320, 18, 'white');
      drawText('• Each challenge has a time limit', canvas.width / 2, 350, 18, 'white');
      drawText('• Wrong answers reduce your time', canvas.width / 2, 380, 18, 'white');
      drawText('• Earn points for speed and accuracy', canvas.width / 2, 410, 18, 'white');

      drawButton(300, 480, 200, 60, 'BACK TO MENU');

      if (isButtonClicked(300, 480, 200, 60)) {
        gameState = STATES.MENU;
      }
    }

    // Map screen
    function drawMap() {
      ctx.fillStyle = '#2c2c2c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('SELECT A CHALLENGE', canvas.width / 2, 80, 36, '#ff6b35');

      // Draw Xavier on the map
      drawXavier(canvas.width / 2, 130, 1);

      // Draw mini-game buttons
      const games = [
        { name: 'Front Desk\nCheck-In', state: STATES.FRONTDESK, x: 150, y: 200 },
        { name: 'Workout\nChallenge', state: STATES.WORKOUT, x: 325, y: 200 },
        { name: 'Smoothie\nRush', state: STATES.SMOOTHIE, x: 500, y: 200 }
      ];

      games.forEach(game => {
        const completed = completedGames.has(game.state);
        const color = completed ? '#4CAF50' : '#ff6b35';

        ctx.fillStyle = color;
        ctx.fillRect(game.x, game.y, 150, 150);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(game.x, game.y, 150, 150);

        const lines = game.name.split('\n');
        lines.forEach((line, i) => {
          drawText(line, game.x + 75, game.y + 60 + i * 30, 20, 'white');
        });

        if (completed) {
          drawText('✓', game.x + 75, game.y + 120, 40, 'white');
        }

        if (!completed && isButtonClicked(game.x, game.y, 150, 150)) {
          gameState = game.state;
          initMiniGame(game.state);
        }
      });

      drawText(`Score: ${totalScore}`, canvas.width / 2, 450, 24, 'white');

      if (completedGames.size === 3) {
        drawButton(300, 500, 200, 60, 'VICTORY!', '#4CAF50');
        if (isButtonClicked(300, 500, 200, 60)) {
          gameState = STATES.VICTORY;
        }
      }
    }

    // Mini-game data
    let frontDeskData = {
      timer: 30,
      matches: 0,
      currentMember: null as any,
      badges: [] as any[],
      score: 0
    };

    let workoutData = {
      reps: 0,
      progress: 0,
      lastKey: null as string | null,
      timer: 45,
      score: 0
    };

    let smoothieData = {
      smoothies: 0,
      currentRecipe: [] as string[],
      blender: [] as string[],
      ingredients: [] as any[],
      score: 0
    };

    function initMiniGame(state: string) {
      if (state === STATES.FRONTDESK) {
        frontDeskData = {
          timer: 30,
          matches: 0,
          currentMember: generateMember(),
          badges: [],
          score: 0
        };
        frontDeskData.badges = generateBadges();
      } else if (state === STATES.WORKOUT) {
        workoutData = {
          reps: 0,
          progress: 0,
          lastKey: null,
          timer: 45,
          score: 0
        };
      } else if (state === STATES.SMOOTHIE) {
        smoothieData = {
          smoothies: 0,
          currentRecipe: generateRecipe(),
          blender: [],
          ingredients: generateIngredients(),
          score: 0
        };
      }
    }

    function generateMember() {
      const names = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa'];
      const colors = ['#ff6b35', '#4CAF50', '#2196F3', '#9C27B0'];
      return {
        name: names[Math.floor(Math.random() * names.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        id: Math.floor(Math.random() * 9000) + 1000
      };
    }

    function generateBadges() {
      const badges = [];
      const correctBadge = { ...frontDeskData.currentMember };
      badges.push(correctBadge);

      for (let i = 0; i < 3; i++) {
        badges.push(generateMember());
      }

      return badges.sort(() => Math.random() - 0.5);
    }

    function drawFrontDesk() {
      ctx.fillStyle = '#2c2c2c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('FRONT DESK CHECK-IN', canvas.width / 2, 50, 32, '#ff6b35');
      drawText(`Timer: ${frontDeskData.timer}s`, 100, 100, 24, 'white');
      drawText(`Matches: ${frontDeskData.matches}/10`, canvas.width - 150, 100, 24, 'white');

      // Draw Xavier at desk
      drawXavier(100, 250, 1.2);
      drawText('Xavier', 100, 320, 16, 'white');

      // Draw member
      if (frontDeskData.currentMember) {
        drawMemberAvatar(400, 200, frontDeskData.currentMember.color);
        drawText(frontDeskData.currentMember.name, 400, 260, 20, 'white');
        drawText('Match this member!', 400, 290, 16, '#ccc');
      }

      // Draw badge options
      frontDeskData.badges.forEach((badge, i) => {
        const x = 150 + (i % 2) * 250;
        const y = 380 + Math.floor(i / 2) * 100;

        ctx.fillStyle = '#444';
        ctx.fillRect(x, y, 200, 80);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x, y, 200, 80);

        ctx.fillStyle = badge.color;
        ctx.fillRect(x + 10, y + 10, 30, 30);

        drawText(badge.name, x + 100, y + 30, 18, 'white');
        drawText(`ID: ${badge.id}`, x + 100, y + 55, 16, '#ccc');

        if (isButtonClicked(x, y, 200, 80)) {
          if (badge.id === frontDeskData.currentMember.id) {
            frontDeskData.matches++;
            frontDeskData.score += 100;
            if (frontDeskData.matches >= 10) {
              completedGames.add(STATES.FRONTDESK);
              totalScore += frontDeskData.score;
              gameState = STATES.MAP;
            } else {
              frontDeskData.currentMember = generateMember();
              frontDeskData.badges = generateBadges();
            }
          } else {
            frontDeskData.timer -= 5;
          }
        }
      });

      // Update timer
      if (frameCount % 60 === 0 && frontDeskData.timer > 0) {
        frontDeskData.timer--;
        if (frontDeskData.timer <= 0) {
          gameState = STATES.MAP;
        }
      }
    }

    function drawWorkout() {
      ctx.fillStyle = '#2c2c2c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('WORKOUT CHALLENGE', canvas.width / 2, 50, 32, '#ff6b35');
      drawText(`Timer: ${workoutData.timer}s`, 100, 100, 24, 'white');
      drawText(`Reps: ${workoutData.reps}/15`, canvas.width - 150, 100, 24, 'white');

      // Draw Xavier working out with animation
      const offset = Math.sin(workoutData.progress * 0.1) * 10;
      drawXavier(canvas.width / 2, 230 + offset, 1.5);

      // Draw weights
      ctx.fillStyle = '#666';
      ctx.fillRect(canvas.width / 2 - 100, 220 + offset, 30, 10);
      ctx.fillRect(canvas.width / 2 + 70, 220 + offset, 30, 10);
      ctx.fillRect(canvas.width / 2 - 110, 210 + offset, 10, 30);
      ctx.fillRect(canvas.width / 2 + 100, 210 + offset, 10, 30);

      // Progress bar
      ctx.fillStyle = '#444';
      ctx.fillRect(200, 350, 400, 40);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(200, 350, workoutData.progress * 4, 40);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(200, 350, 400, 40);

      drawText('Press A and D alternately!', canvas.width / 2, 450, 24, 'white');
      drawText('(or tap left/right sides on mobile)', canvas.width / 2, 480, 16, '#ccc');

      // Handle input
      const leftPressed = keys['a'] || keys['A'] || keys['ArrowLeft'] ||
        (clicked && mouseX < canvas.width / 2);
      const rightPressed = keys['d'] || keys['D'] || keys['ArrowRight'] ||
        (clicked && mouseX >= canvas.width / 2);

      if (leftPressed && workoutData.lastKey !== 'left') {
        workoutData.lastKey = 'left';
        workoutData.progress = Math.min(100, workoutData.progress + 10);
      } else if (rightPressed && workoutData.lastKey !== 'right') {
        workoutData.lastKey = 'right';
        workoutData.progress = Math.min(100, workoutData.progress + 10);
      }

      // Progress decay
      if (frameCount % 10 === 0) {
        workoutData.progress = Math.max(0, workoutData.progress - 2);
      }

      // Complete rep
      if (workoutData.progress >= 100) {
        workoutData.reps++;
        workoutData.score += 150;
        workoutData.progress = 0;

        if (workoutData.reps >= 15) {
          completedGames.add(STATES.WORKOUT);
          totalScore += workoutData.score;
          gameState = STATES.MAP;
        }
      }

      // Update timer
      if (frameCount % 60 === 0 && workoutData.timer > 0) {
        workoutData.timer--;
        if (workoutData.timer <= 0) {
          gameState = STATES.MAP;
        }
      }
    }

    function generateRecipe() {
      const items = ['Banana', 'Berry', 'Mango', 'Spinach', 'Protein'];
      const recipe = [];
      for (let i = 0; i < 3; i++) {
        recipe.push(items[Math.floor(Math.random() * items.length)]);
      }
      return recipe;
    }

    function generateIngredients() {
      const items = ['Banana', 'Berry', 'Mango', 'Spinach', 'Protein'];
      return items.map((item, i) => ({
        name: item,
        x: 100 + (i * 120),
        y: 450,
        color: ['#FFE135', '#E91E63', '#FF9800', '#4CAF50', '#9C27B0'][i]
      }));
    }

    function drawSmoothie() {
      ctx.fillStyle = '#2c2c2c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('SMOOTHIE RUSH', canvas.width / 2, 50, 32, '#ff6b35');
      drawText(`Smoothies: ${smoothieData.smoothies}/5`, canvas.width / 2, 100, 24, 'white');

      // Draw Xavier making smoothies
      drawXavier(100, 300, 1);
      drawText('Xavier', 100, 370, 16, 'white');

      // Draw recipe
      drawText('Recipe:', 100, 180, 24, 'white');
      smoothieData.currentRecipe.forEach((item, i) => {
        drawText(`${i + 1}. ${item}`, 100, 220 + i * 30, 20, '#ccc');
      });

      // Draw blender
      ctx.fillStyle = '#666';
      ctx.fillRect(500, 200, 150, 200);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(500, 200, 150, 200);
      drawText('BLENDER', 575, 190, 16, 'white');

      // Draw items in blender
      smoothieData.blender.forEach((item, i) => {
        drawText(item, 575, 240 + i * 30, 16, 'white');
      });

      // Draw ingredients
      smoothieData.ingredients.forEach(ing => {
        ctx.fillStyle = ing.color;
        ctx.fillRect(ing.x, ing.y, 100, 50);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(ing.x, ing.y, 100, 50);
        drawText(ing.name, ing.x + 50, ing.y + 30, 16, 'white');
      });

      // Handle clicks on ingredients
      if (clicked) {
        smoothieData.ingredients.forEach(ing => {
          if (mouseX >= ing.x && mouseX <= ing.x + 100 &&
            mouseY >= ing.y && mouseY <= ing.y + 50) {
            // Check if it's next in recipe
            if (ing.name === smoothieData.currentRecipe[smoothieData.blender.length]) {
              smoothieData.blender.push(ing.name);
              smoothieData.score += 100;

              if (smoothieData.blender.length === smoothieData.currentRecipe.length) {
                smoothieData.smoothies++;
                if (smoothieData.smoothies >= 5) {
                  completedGames.add(STATES.SMOOTHIE);
                  totalScore += smoothieData.score;
                  gameState = STATES.MAP;
                } else {
                  smoothieData.currentRecipe = generateRecipe();
                  smoothieData.blender = [];
                }
              }
            }
          }
        });
      }

      drawText('Click ingredients in recipe order!', canvas.width / 2, 550, 18, '#ccc');
    }

    // Victory screen
    function drawVictory() {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('CONGRATULATIONS!', canvas.width / 2, 150, 48, '#4CAF50');
      drawText('Xavier has completed all challenges!', canvas.width / 2, 220, 24, 'white');

      // Draw Xavier celebrating
      drawXavier(canvas.width / 2, 280, 2);

      drawText(`Final Score: ${totalScore}`, canvas.width / 2, 360, 32, '#ff6b35');

      drawText('Thanks for playing!', canvas.width / 2, 420, 20, '#ccc');
      drawText('The Lifetime Collierville team salutes you!', canvas.width / 2, 450, 18, '#ccc');

      drawButton(300, 500, 200, 60, 'PLAY AGAIN');

      if (isButtonClicked(300, 500, 200, 60)) {
        totalScore = 0;
        completedGames.clear();
        gameState = STATES.MENU;
      }
    }

    // Main game loop
    let frameCount = 0;

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (gameState) {
        case STATES.MENU:
          drawMenu();
          break;
        case STATES.INSTRUCTIONS:
          drawInstructions();
          break;
        case STATES.MAP:
          drawMap();
          break;
        case STATES.FRONTDESK:
          drawFrontDesk();
          break;
        case STATES.WORKOUT:
          drawWorkout();
          break;
        case STATES.SMOOTHIE:
          drawSmoothie();
          break;
        case STATES.VICTORY:
          drawVictory();
          break;
      }

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
