import React, { useEffect, useRef } from 'react';

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

    // Animation and effects
    let particles: any[] = [];
    let backgroundStars: any[] = [];
    let titleFloat = 0;
    let menuPulse = 0;

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

    // Particle system
    function createParticle(x: number, y: number, color: string, type = 'burst') {
      const particle = {
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 2,
        color,
        life: 1,
        decay: 0.02,
        type
      };
      
      if (type === 'trail') {
        particle.vx *= 0.3;
        particle.vy *= 0.3;
        particle.decay = 0.05;
      }
      
      particles.push(particle);
    }

    function updateParticles() {
      particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.life -= particle.decay;
        
        if (particle.type === 'trail') {
          particle.vy += 0.2; // gravity for trail particles
        }
        
        return particle.life > 0;
      });
    }

    function drawParticles() {
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    function drawBackgroundStars() {
      backgroundStars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Enhanced utility functions
    function drawText(text: string, x: number, y: number, size = 20, color = 'white', align: CanvasTextAlign = 'center', shadow = false) {
      ctx.font = `${size}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      
      if (shadow) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillText(text, x + 2, y + 2);
        ctx.restore();
        ctx.fillStyle = color;
      }
      
      ctx.fillText(text, x, y);
    }

    function drawGradientButton(x: number, y: number, width: number, height: number, text: string, color1 = '#ff6b35', color2 = '#ff4500', isHovered = false) {
      const gradient = ctx.createLinearGradient(x, y, x, y + height);
      
      if (isHovered) {
        gradient.addColorStop(0, color2);
        gradient.addColorStop(1, color1);
      } else {
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, height);
      
      // Add glow effect
      ctx.shadowColor = color1;
      ctx.shadowBlur = isHovered ? 20 : 10;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.shadowBlur = 0;
      
      drawText(text, x + width / 2, y + height / 2 + 8, 24, 'white', 'center', true);
    }

    function isButtonClicked(x: number, y: number, width: number, height: number) {
      return clicked && mouseX >= x && mouseX <= x + width &&
        mouseY >= y && mouseY <= y + height;
    }

    function isButtonHovered(x: number, y: number, width: number, height: number) {
      return mouseX >= x && mouseX <= x + width &&
        mouseY >= y && mouseY <= y + height;
    }

    // Enhanced character drawing functions with Xavier's and Morty's real images
    function drawXavier(x: number, y: number, scale = 1, animated = false) {
      const bobOffset = animated ? Math.sin(frameCount * 0.1) * 3 : 0;
      const currentY = y + bobOffset;
      
      // Shadow
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(x, y + 100 * scale, 30 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (xavierImageLoaded) {
        // Draw Xavier's real photo as a circular avatar
        ctx.save();
        
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw the image scaled and centered
        const imgSize = 70 * scale;
        ctx.drawImage(xavierImage, x - imgSize/2, currentY - 45 * scale, imgSize, imgSize);
        
        ctx.restore();
        
        // Add a cool border around the photo
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add glow effect
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10 * scale;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        // Head
        ctx.fillStyle = '#8B6F47';
        ctx.beginPath();
        ctx.arc(x, currentY, 20 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Hair with gradient
        const hairGradient = ctx.createRadialGradient(x, currentY - 10 * scale, 0, x, currentY - 10 * scale, 20 * scale);
        hairGradient.addColorStop(0, '#2a2a2a');
        hairGradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = hairGradient;
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 20 * scale, Math.PI, 0);
        ctx.fill();

        // Beard with gradient
        const beardGradient = ctx.createLinearGradient(x - 15 * scale, currentY + 5 * scale, x + 15 * scale, currentY + 20 * scale);
        beardGradient.addColorStop(0, '#2a2a2a');
        beardGradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = beardGradient;
        ctx.fillRect(x - 15 * scale, currentY + 5 * scale, 30 * scale, 15 * scale);

        // Eyes with shine
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 8 * scale, currentY - 5 * scale, 6 * scale, 6 * scale);
        ctx.fillRect(x + 2 * scale, currentY - 5 * scale, 6 * scale, 6 * scale);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x - 6 * scale, currentY - 3 * scale, 3 * scale, 3 * scale);
        ctx.fillRect(x + 3 * scale, currentY - 3 * scale, 3 * scale, 3 * scale);
        
        // Eye shine
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 7 * scale, currentY - 4 * scale, 1 * scale, 1 * scale);
        ctx.fillRect(x + 2 * scale, currentY - 4 * scale, 1 * scale, 1 * scale);

        // Earring with glow
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x - 20 * scale, currentY, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Body with gradient (beige sweater) - always draw this
      const bodyGradient = ctx.createLinearGradient(x - 25 * scale, currentY + 20 * scale, x + 25 * scale, currentY + 80 * scale);
      bodyGradient.addColorStop(0, '#E4B584');
      bodyGradient.addColorStop(1, '#D4A574');
      ctx.fillStyle = bodyGradient;
      ctx.fillRect(x - 25 * scale, currentY + 20 * scale, 50 * scale, 60 * scale);

      // Arms
      ctx.fillRect(x - 35 * scale, currentY + 25 * scale, 10 * scale, 40 * scale);
      ctx.fillRect(x + 25 * scale, currentY + 25 * scale, 10 * scale, 40 * scale);
    }

    // New function to draw Morty (Clark Kirby) with his hilarious avatar
    function drawMorty(x: number, y: number, scale = 1, animated = false) {
      const bobOffset = animated ? Math.sin(frameCount * 0.12) * 3 : 0;
      const currentY = y + bobOffset;
      
      // Shadow
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(x, y + 100 * scale, 30 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (mortyImageLoaded) {
        // Draw Morty's real photo as a circular avatar
        ctx.save();
        
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw the image scaled and centered
        const imgSize = 70 * scale;
        ctx.drawImage(mortyImage, x - imgSize/2, currentY - 45 * scale, imgSize, imgSize);
        
        ctx.restore();
        
        // Add a fun border around Morty's photo (bright blue like his shirt)
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add glow effect
        ctx.save();
        ctx.shadowColor = '#00BFFF';
        ctx.shadowBlur = 10 * scale;
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        // Fallback pixel art for Morty
        // Head
        ctx.fillStyle = '#FDBCB4';
        ctx.beginPath();
        ctx.arc(x, currentY, 20 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Hair (brown)
        const hairGradient = ctx.createRadialGradient(x, currentY - 10 * scale, 0, x, currentY - 10 * scale, 20 * scale);
        hairGradient.addColorStop(0, '#8B4513');
        hairGradient.addColorStop(1, '#654321');
        ctx.fillStyle = hairGradient;
        ctx.beginPath();
        ctx.arc(x, currentY - 10 * scale, 20 * scale, Math.PI, 0);
        ctx.fill();

        // Eyes with shine
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 8 * scale, currentY - 5 * scale, 6 * scale, 6 * scale);
        ctx.fillRect(x + 2 * scale, currentY - 5 * scale, 6 * scale, 6 * scale);
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - 6 * scale, currentY - 3 * scale, 3 * scale, 3 * scale);
        ctx.fillRect(x + 3 * scale, currentY - 3 * scale, 3 * scale, 3 * scale);
        
        // Eye shine
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 7 * scale, currentY - 4 * scale, 1 * scale, 1 * scale);
        ctx.fillRect(x + 2 * scale, currentY - 4 * scale, 1 * scale, 1 * scale);

        // Big smile
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(x, currentY + 5 * scale, 8 * scale, 0, Math.PI);
        ctx.stroke();
      }

      // Body with gradient (bright blue shirt like in photo)
      const bodyGradient = ctx.createLinearGradient(x - 25 * scale, currentY + 20 * scale, x + 25 * scale, currentY + 80 * scale);
      bodyGradient.addColorStop(0, '#00BFFF');
      bodyGradient.addColorStop(1, '#0099CC');
      ctx.fillStyle = bodyGradient;
      ctx.fillRect(x - 25 * scale, currentY + 20 * scale, 50 * scale, 60 * scale);

      // Arms
      ctx.fillRect(x - 35 * scale, currentY + 25 * scale, 10 * scale, 40 * scale);
      ctx.fillRect(x + 25 * scale, currentY + 25 * scale, 10 * scale, 40 * scale);

      // Add backpack straps (like in the photo)
      ctx.fillStyle = '#333';
      ctx.fillRect(x - 15 * scale, currentY + 30 * scale, 5 * scale, 30 * scale);
      ctx.fillRect(x + 10 * scale, currentY + 30 * scale, 5 * scale, 30 * scale);
    }

    function drawMemberAvatar(x: number, y: number, color: string, animated = false) {
      const bobOffset = animated ? Math.sin(frameCount * 0.15) * 2 : 0;
      const currentY = y + bobOffset;
      
      // Shadow
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(x, y + 50, 20, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Head
      ctx.fillStyle = '#8B6F47';
      ctx.beginPath();
      ctx.arc(x, currentY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, currentY - 8, 15, Math.PI, 0);
      ctx.fill();

      // Body
      ctx.fillStyle = color;
      ctx.fillRect(x - 20, currentY + 15, 40, 40);
    }

    // Enhanced menu screen
    function drawMenu() {
      // Animated gradient background
      const bgGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
      bgGradient.addColorStop(0, '#2a1a3a');
      bgGradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBackgroundStars();

      titleFloat += 0.02;
      menuPulse += 0.05;
      
      const titleY = 120 + Math.sin(titleFloat) * 5;
      const pulseScale = 1 + Math.sin(menuPulse) * 0.05;

      // Title with glow effect
      ctx.save();
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 20;
      drawText('LIFETIME LEGENDS', canvas.width / 2, titleY, 48 * pulseScale, '#ff6b35', 'center', true);
      ctx.restore();
      
      drawText('Collierville Quest', canvas.width / 2, 170, 32, 'white', 'center', true);
      drawText('Starring Xavier & Morty', canvas.width / 2, 210, 20, '#ccc', 'center', true);

      // Draw both characters with animation
      drawXavier(canvas.width / 2 - 80, 290, 1.2, true);
      drawText('Xavier', canvas.width / 2 - 80, 360, 16, 'white', 'center', true);
      
      drawMorty(canvas.width / 2 + 80, 290, 1.2, true);
      drawText('Morty', canvas.width / 2 + 80, 360, 16, 'white', 'center', true);

      // Enhanced buttons with hover effects
      const startHovered = isButtonHovered(300, 400, 200, 60);
      const instructionsHovered = isButtonHovered(300, 480, 200, 60);
      
      drawGradientButton(300, 400, 200, 60, 'START GAME', '#ff6b35', '#ff4500', startHovered);
      drawGradientButton(300, 480, 200, 60, 'INSTRUCTIONS', '#2196F3', '#1976D2', instructionsHovered);

      if (isButtonClicked(300, 400, 200, 60)) {
        createParticle(400, 430, '#ff6b35');
        createParticle(400, 430, '#FFD700');
        gameState = STATES.MAP;
      }
      if (isButtonClicked(300, 480, 200, 60)) {
        createParticle(400, 510, '#2196F3');
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

      const backHovered = isButtonHovered(300, 480, 200, 60);
      drawGradientButton(300, 480, 200, 60, 'BACK TO MENU', '#4CAF50', '#388E3C', backHovered);

      if (isButtonClicked(300, 480, 200, 60)) {
        gameState = STATES.MENU;
      }
    }

    // Enhanced map screen
    function drawMap() {
      // Animated background
      const mapGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      mapGradient.addColorStop(0, '#3c3c3c');
      mapGradient.addColorStop(1, '#2c2c2c');
      ctx.fillStyle = mapGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('SELECT A CHALLENGE', canvas.width / 2, 80, 36, '#ff6b35', 'center', true);

      // Draw both characters on the map with trail particles
      drawXavier(canvas.width / 2 - 60, 130, 1, true);
      drawMorty(canvas.width / 2 + 60, 130, 1, true);
      
      // Add trail particles to both characters
      if (frameCount % 30 === 0) {
        createParticle(canvas.width / 2 - 60 + (Math.random() - 0.5) * 20, 180, '#FFD700', 'trail');
        createParticle(canvas.width / 2 + 60 + (Math.random() - 0.5) * 20, 180, '#00BFFF', 'trail');
      }

      // Draw mini-game buttons with enhanced effects
      const games = [
        { name: 'Front Desk\nCheck-In', state: STATES.FRONTDESK, x: 150, y: 200 },
        { name: 'Workout\nChallenge', state: STATES.WORKOUT, x: 325, y: 200 },
        { name: 'Smoothie\nRush', state: STATES.SMOOTHIE, x: 500, y: 200 }
      ];

      games.forEach(game => {
        const completed = completedGames.has(game.state);
        const hovered = isButtonHovered(game.x, game.y, 150, 150);
        const color1 = completed ? '#4CAF50' : '#ff6b35';
        const color2 = completed ? '#388E3C' : '#ff4500';

        // Enhanced button with gradient and glow
        const gradient = ctx.createLinearGradient(game.x, game.y, game.x, game.y + 150);
        gradient.addColorStop(0, hovered ? color2 : color1);
        gradient.addColorStop(1, hovered ? color1 : color2);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(game.x, game.y, 150, 150);
        
        if (hovered || completed) {
          ctx.shadowColor = color1;
          ctx.shadowBlur = 15;
        }
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(game.x, game.y, 150, 150);
        ctx.shadowBlur = 0;

        const lines = game.name.split('\n');
        lines.forEach((line, i) => {
          drawText(line, game.x + 75, game.y + 60 + i * 30, 20, 'white', 'center', true);
        });

        if (completed) {
          ctx.save();
          ctx.shadowColor = '#4CAF50';
          ctx.shadowBlur = 10;
          drawText('✓', game.x + 75, game.y + 120, 40, '#4CAF50', 'center');
          ctx.restore();
        }

        if (!completed && isButtonClicked(game.x, game.y, 150, 150)) {
          // Create explosion effect
          for (let i = 0; i < 10; i++) {
            createParticle(game.x + 75, game.y + 75, color1);
          }
          gameState = game.state;
          initMiniGame(game.state);
        }
      });

      // Animated score display
      const scoreFloat = Math.sin(frameCount * 0.1) * 2;
      drawText(`Score: ${totalScore}`, canvas.width / 2, 450 + scoreFloat, 24, 'white', 'center', true);

      if (completedGames.size === 3) {
        const victoryHovered = isButtonHovered(300, 500, 200, 60);
        drawGradientButton(300, 500, 200, 60, 'VICTORY!', '#4CAF50', '#FFD700', victoryHovered);
        
        // Victory sparkles
        if (frameCount % 5 === 0) {
          createParticle(300 + Math.random() * 200, 500 + Math.random() * 60, '#FFD700');
        }
        
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

    // Enhanced front desk mini-game
    function drawFrontDesk() {
      // Animated background
      const deskGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      deskGradient.addColorStop(0, '#3c3c3c');
      deskGradient.addColorStop(1, '#2c2c2c');
      ctx.fillStyle = deskGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('FRONT DESK CHECK-IN', canvas.width / 2, 50, 32, '#ff6b35', 'center', true);
      
      // Animated timer with color change
      const timerColor = frontDeskData.timer < 10 ? '#ff4444' : 'white';
      drawText(`Timer: ${frontDeskData.timer}s`, 100, 100, 24, timerColor, 'left', true);
      drawText(`Matches: ${frontDeskData.matches}/10`, canvas.width - 150, 100, 24, 'white', 'right', true);

      // Draw Xavier and Morty at desk with animation
      drawXavier(80, 250, 1, true);
      drawText('Xavier', 80, 320, 16, 'white', 'center', true);
      
      drawMorty(160, 250, 1, true);
      drawText('Morty', 160, 320, 16, 'white', 'center', true);

      // Draw member with glow effect
      if (frontDeskData.currentMember) {
        ctx.save();
        ctx.shadowColor = frontDeskData.currentMember.color;
        ctx.shadowBlur = 15;
        drawMemberAvatar(400, 200, frontDeskData.currentMember.color, true);
        ctx.restore();
        
        drawText(frontDeskData.currentMember.name, 400, 260, 20, 'white', 'center', true);
        drawText('Match this member!', 400, 290, 16, '#ccc', 'center', true);
      }

      // Draw badge options with enhanced effects
      frontDeskData.badges.forEach((badge, i) => {
        const x = 150 + (i % 2) * 250;
        const y = 380 + Math.floor(i / 2) * 100;
        const hovered = isButtonHovered(x, y, 200, 80);
        
        // Enhanced badge design
        const badgeGradient = ctx.createLinearGradient(x, y, x, y + 80);
        badgeGradient.addColorStop(0, hovered ? '#555' : '#444');
        badgeGradient.addColorStop(1, hovered ? '#333' : '#222');
        
        ctx.fillStyle = badgeGradient;
        ctx.fillRect(x, y, 200, 80);
        
        if (hovered) {
          ctx.shadowColor = 'white';
          ctx.shadowBlur = 10;
        }
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 200, 80);
        ctx.shadowBlur = 0;

        // Color indicator with glow
        ctx.save();
        ctx.shadowColor = badge.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = badge.color;
        ctx.fillRect(x + 10, y + 10, 30, 30);
        ctx.restore();

        drawText(badge.name, x + 100, y + 30, 18, 'white', 'center', true);
        drawText(`ID: ${badge.id}`, x + 100, y + 55, 16, '#ccc', 'center', true);

        if (isButtonClicked(x, y, 200, 80)) {
          if (badge.id === frontDeskData.currentMember.id) {
            // Success particles
            for (let j = 0; j < 15; j++) {
              createParticle(x + 100, y + 40, '#4CAF50');
            }
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
            // Error particles
            for (let j = 0; j < 10; j++) {
              createParticle(x + 100, y + 40, '#ff4444');
            }
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

    // Enhanced workout mini-game
    function drawWorkout() {
      // Animated background
      const workoutGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      workoutGradient.addColorStop(0, '#3c2c4c');
      workoutGradient.addColorStop(1, '#2c2c2c');
      ctx.fillStyle = workoutGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('WORKOUT CHALLENGE', canvas.width / 2, 50, 32, '#ff6b35', 'center', true);
      drawText(`Timer: ${workoutData.timer}s`, 100, 100, 24, 'white', 'left', true);
      drawText(`Reps: ${workoutData.reps}/15`, canvas.width - 150, 100, 24, 'white', 'right', true);

      // Draw both characters working out with enhanced animation
      const offset = Math.sin(workoutData.progress * 0.1) * 15;
      const sweatOffset = Math.sin(frameCount * 0.3) * 2;
      
      drawXavier(canvas.width / 2 - 60, 230 + offset, 1.2, true);
      drawMorty(canvas.width / 2 + 60, 230 + offset, 1.2, true);
      
      // Sweat particles for both characters
      if (workoutData.progress > 50 && frameCount % 10 === 0) {
        createParticle(canvas.width / 2 - 60 + sweatOffset, 200 + offset, '#87CEEB', 'trail');
        createParticle(canvas.width / 2 + 60 + sweatOffset, 200 + offset, '#87CEEB', 'trail');
      }

      // Enhanced weights with metallic effect
      const metalGradient = ctx.createLinearGradient(canvas.width / 2 - 100, 220 + offset, canvas.width / 2 + 100, 240 + offset);
      metalGradient.addColorStop(0, '#888');
      metalGradient.addColorStop(0.5, '#ccc');
      metalGradient.addColorStop(1, '#666');
      
      ctx.fillStyle = metalGradient;
      ctx.fillRect(canvas.width / 2 - 100, 220 + offset, 30, 10);
      ctx.fillRect(canvas.width / 2 + 70, 220 + offset, 30, 10);
      ctx.fillRect(canvas.width / 2 - 110, 210 + offset, 10, 30);
      ctx.fillRect(canvas.width / 2 + 100, 210 + offset, 10, 30);

      // Enhanced progress bar with glow
      ctx.fillStyle = '#444';
      ctx.fillRect(200, 350, 400, 40);
      
      const progressGradient = ctx.createLinearGradient(200, 350, 200 + workoutData.progress * 4, 390);
      progressGradient.addColorStop(0, '#4CAF50');
      progressGradient.addColorStop(1, '#81C784');
      ctx.fillStyle = progressGradient;
      ctx.fillRect(200, 350, workoutData.progress * 4, 40);
      
      if (workoutData.progress > 80) {
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 20;
      }
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(200, 350, 400, 40);
      ctx.shadowBlur = 0;

      drawText('Press A and D alternately!', canvas.width / 2, 450, 24, 'white', 'center', true);
      drawText('(or tap left/right sides on mobile)', canvas.width / 2, 480, 16, '#ccc', 'center', true);

      // Handle input
      const leftPressed = keys['a'] || keys['A'] || keys['ArrowLeft'] ||
        (clicked && mouseX < canvas.width / 2);
      const rightPressed = keys['d'] || keys['D'] || keys['ArrowRight'] ||
        (clicked && mouseX >= canvas.width / 2);

      if (leftPressed && workoutData.lastKey !== 'left') {
        workoutData.lastKey = 'left';
        workoutData.progress = Math.min(100, workoutData.progress + 10);
        createParticle(canvas.width / 4, 400, '#4CAF50');
      } else if (rightPressed && workoutData.lastKey !== 'right') {
        workoutData.lastKey = 'right';
        workoutData.progress = Math.min(100, workoutData.progress + 10);
        createParticle(3 * canvas.width / 4, 400, '#4CAF50');
      }

      // Progress decay
      if (frameCount % 10 === 0) {
        workoutData.progress = Math.max(0, workoutData.progress - 2);
      }

      // Complete rep
      if (workoutData.progress >= 100) {
        // Rep completion effect
        for (let i = 0; i < 20; i++) {
          createParticle(canvas.width / 2, 300, '#FFD700');
        }
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

    // Enhanced smoothie mini-game
    function drawSmoothie() {
      // Animated background
      const smoothieGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      smoothieGradient.addColorStop(0, '#4c3c2c');
      smoothieGradient.addColorStop(1, '#2c2c2c');
      ctx.fillStyle = smoothieGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawText('SMOOTHIE RUSH', canvas.width / 2, 50, 32, '#ff6b35', 'center', true);
      drawText(`Smoothies: ${smoothieData.smoothies}/5`, canvas.width / 2, 100, 24, 'white', 'center', true);

      // Draw both characters making smoothies
      drawXavier(80, 300, 1, true);
      drawText('Xavier', 80, 370, 16, 'white', 'center', true);
      
      drawMorty(180, 300, 1, true);
      drawText('Morty', 180, 370, 16, 'white', 'center', true);

      // Enhanced recipe display
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(80, 160, 140, 120);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(80, 160, 140, 120);
      
      drawText('Recipe:', 150, 180, 24, 'white', 'center', true);
      smoothieData.currentRecipe.forEach((item, i) => {
        const completed = i < smoothieData.blender.length;
        const color = completed ? '#4CAF50' : '#ccc';
        drawText(`${i + 1}. ${item}`, 150, 220 + i * 30, 20, color, 'center', true);
      });

      // Enhanced blender with animation
      const blenderShake = smoothieData.blender.length > 0 ? Math.sin(frameCount * 0.5) * 2 : 0;
      
      const blenderGradient = ctx.createLinearGradient(500, 200, 650, 400);
      blenderGradient.addColorStop(0, '#888');
      blenderGradient.addColorStop(0.5, '#666');
      blenderGradient.addColorStop(1, '#444');
      
      ctx.fillStyle = blenderGradient;
      ctx.fillRect(500 + blenderShake, 200, 150, 200);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.strokeRect(500 + blenderShake, 200, 150, 200);
      
      drawText('BLENDER', 575, 190, 16, 'white', 'center', true);

      // Draw items in blender with bubble effects
      smoothieData.blender.forEach((item, i) => {
        drawText(item, 575 + blenderShake, 240 + i * 30, 16, 'white', 'center', true);
        
        // Blending particles
        if (frameCount % 5 === 0) {
          createParticle(575 + Math.random() * 100 - 50, 300, '#fff', 'trail');
        }
      });

      // Enhanced ingredients with hover effects
      smoothieData.ingredients.forEach(ing => {
        const hovered = isButtonHovered(ing.x, ing.y, 100, 50);
        const isNext = ing.name === smoothieData.currentRecipe[smoothieData.blender.length];
        
        const ingGradient = ctx.createLinearGradient(ing.x, ing.y, ing.x, ing.y + 50);
        ingGradient.addColorStop(0, ing.color);
        ingGradient.addColorStop(1, ing.color + '80');
        
        ctx.fillStyle = ingGradient;
        ctx.fillRect(ing.x, ing.y, 100, 50);
        
        if (hovered || isNext) {
          ctx.shadowColor = ing.color;
          ctx.shadowBlur = 15;
        }
        
        ctx.strokeStyle = isNext ? '#FFD700' : 'white';
        ctx.lineWidth = isNext ? 3 : 2;
        ctx.strokeRect(ing.x, ing.y, 100, 50);
        ctx.shadowBlur = 0;
        
        drawText(ing.name, ing.x + 50, ing.y + 30, 16, 'white', 'center', true);
      });

      // Handle clicks on ingredients
      if (clicked) {
        smoothieData.ingredients.forEach(ing => {
          if (mouseX >= ing.x && mouseX <= ing.x + 100 &&
            mouseY >= ing.y && mouseY <= ing.y + 50) {
            // Check if it's next in recipe
            if (ing.name === smoothieData.currentRecipe[smoothieData.blender.length]) {
              // Success particles
              for (let i = 0; i < 10; i++) {
                createParticle(ing.x + 50, ing.y + 25, ing.color);
              }
              
              smoothieData.blender.push(ing.name);
              smoothieData.score += 100;

              if (smoothieData.blender.length === smoothieData.currentRecipe.length) {
                // Smoothie complete effect
                for (let i = 0; i < 20; i++) {
                  createParticle(575, 300, '#FFD700');
                }
                
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
            } else {
              // Error particles
              for (let i = 0; i < 5; i++) {
                createParticle(ing.x + 50, ing.y + 25, '#ff4444');
              }
            }
          }
        });
      }

      drawText('Click ingredients in recipe order!', canvas.width / 2, 550, 18, '#ccc', 'center', true);
    }

    // Enhanced victory screen
    function drawVictory() {
      // Animated victory background
      const victoryGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
      victoryGradient.addColorStop(0, '#4a3c5a');
      victoryGradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = victoryGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Victory particles
      if (frameCount % 3 === 0) {
        createParticle(Math.random() * canvas.width, 0, '#FFD700');
        createParticle(Math.random() * canvas.width, 0, '#4CAF50');
        createParticle(Math.random() * canvas.width, 0, '#ff6b35');
      }

      const victoryFloat = Math.sin(frameCount * 0.05) * 10;
      
      ctx.save();
      ctx.shadowColor = '#4CAF50';
      ctx.shadowBlur = 30;
      drawText('CONGRATULATIONS!', canvas.width / 2, 150 + victoryFloat, 48, '#4CAF50', 'center', true);
      ctx.restore();
      
      drawText('Xavier and Morty have completed all challenges!', canvas.width / 2, 220, 24, 'white', 'center', true);

      // Draw both characters celebrating with enhanced animation
      const celebrateScale = 1.8 + Math.sin(frameCount * 0.1) * 0.2;
      drawXavier(canvas.width / 2 - 80, 280, celebrateScale, true);
      drawMorty(canvas.width / 2 + 80, 280, celebrateScale, true);

      // Fireworks effect around both characters
      if (frameCount % 15 === 0) {
        const colors = ['#FFD700', '#ff6b35', '#4CAF50', '#2196F3', '#9C27B0'];
        for (let i = 0; i < 5; i++) {
          createParticle(
            canvas.width / 2 - 80 + (Math.random() - 0.5) * 150,
            300 + (Math.random() - 0.5) * 100,
            colors[Math.floor(Math.random() * colors.length)]
          );
          createParticle(
            canvas.width / 2 + 80 + (Math.random() - 0.5) * 150,
            300 + (Math.random() - 0.5) * 100,
            colors[Math.floor(Math.random() * colors.length)]
          );
        }
      }

      const scoreFloat = Math.sin(frameCount * 0.08) * 5;
      ctx.save();
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 15;
      drawText(`Final Score: ${totalScore}`, canvas.width / 2, 360 + scoreFloat, 32, '#ff6b35', 'center', true);
      ctx.restore();

      drawText('Thanks for playing!', canvas.width / 2, 420, 20, '#ccc', 'center', true);
      drawText('The Lifetime Collierville team salutes you!', canvas.width / 2, 450, 18, '#ccc', 'center', true);

      const playAgainHovered = isButtonHovered(300, 500, 200, 60);
      drawGradientButton(300, 500, 200, 60, 'PLAY AGAIN', '#4CAF50', '#FFD700', playAgainHovered);

      if (isButtonClicked(300, 500, 200, 60)) {
        // Reset game with particles
        for (let i = 0; i < 20; i++) {
          createParticle(400, 530, '#4CAF50');
        }
        totalScore = 0;
        completedGames.clear();
        gameState = STATES.MENU;
      }
    }

    // Main game loop
    let frameCount = 0;

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      updateParticles();

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

      // Draw particles on top
      drawParticles();

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
