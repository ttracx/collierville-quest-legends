
import { useState, useEffect } from 'react';
import { Particle } from '../utils/particleSystem';

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

  const handleClick = (e: React.MouseEvent) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
    setClicked(true);
    setTimeout(() => setClicked(false), 100);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  const updateFrameCount = () => {
    setFrameCount(prevFrameCount => prevFrameCount + 1);
  };

  const updateParticles = () => {
    setParticles(particles => particles.filter(particle => particle.life > 0));
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
