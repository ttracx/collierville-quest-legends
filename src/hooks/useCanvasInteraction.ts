
import { useState, useEffect, useRef } from 'react';
import { Particle, updateParticles as updateParticleSystem, createParticle } from '../utils/particleSystem';
import { useIsMobile } from './use-mobile';

export const useCanvasInteraction = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [backgroundStars, setBackgroundStars] = useState<any[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvas) return;

    // Initialize background stars
    const initializeStars = () => {
      const newStars = [];
      const starCount = isMobile ? 20 : 50;
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
      setBackgroundStars(newStars);
    };

    initializeStars();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMouseX((e.clientX - rect.left) * (canvas.width / rect.width));
      setMouseY((e.clientY - rect.top) * (canvas.height / rect.height));
    };

    const handleClick = () => {
      setClicked(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvas, isMobile]);

  const handleClick = () => {
    setClicked(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMouseX((e.clientX - rect.left) * (canvas.width / rect.width));
    setMouseY((e.clientY - rect.top) * (canvas.height / rect.height));
  };

  const updateFrameCount = () => {
    setFrameCount(prev => prev + 1);
    setClicked(false);
  };

  const updateParticles = () => {
    setParticles(prev => updateParticleSystem(prev));
    
    // Add occasional particles
    if (frameCount % 120 === 0 && canvas) {
      setParticles(prev => {
        const newParticles = [...prev];
        createParticle(Math.random() * canvas.width, 0, '#ffffff', 'trail', newParticles);
        return newParticles;
      });
    }
  };

  return {
    canvas,
    setCanvas,
    ctx,
    setCtx,
    mouseX,
    mouseY,
    clicked,
    frameCount,
    backgroundStars,
    particles,
    keys,
    handleClick,
    handleMouseMove,
    updateFrameCount,
    updateParticles
  };
};
