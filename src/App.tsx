
import React, { useEffect } from 'react';
import { GameRenderer } from './components/GameRenderer';
import { useGameStateManager } from './hooks/useGameStateManager';
import { useImageLoader } from './hooks/useImageLoader';
import { useCanvasInteraction } from './hooks/useCanvasInteraction';

const App: React.FC = () => {
  const { gameState, setGameState, gameData, setGameData, initMiniGame } = useGameStateManager();
  const { xavierImage, xavierImageLoaded, mortyImage, mortyImageLoaded, mikeImage, mikeImageLoaded } = useImageLoader();
  const {
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
  } = useCanvasInteraction();

  useEffect(() => {
    if (canvas && ctx) {
      const render = () => {
        GameRenderer({
          gameState,
          ctx,
          canvas,
          mouseX,
          mouseY,
          clicked,
          frameCount,
          backgroundStars,
          particles,
          keys,
          gameData,
          xavierImage,
          xavierImageLoaded,
          mortyImage,
          mortyImageLoaded,
          mikeImage,
          mikeImageLoaded,
          onStateChange: setGameState,
          onUpdateGameData: setGameData,
          onInitMiniGame: (state) => initMiniGame(state, canvas)
        });

        updateFrameCount();
        updateParticles();
        requestAnimationFrame(render);
      };

      render();
    }
  }, [ctx, canvas, gameState, mouseX, mouseY, clicked, backgroundStars, gameData, xavierImage, xavierImageLoaded, mortyImage, mortyImageLoaded, mikeImage, mikeImageLoaded, keys]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const nativeEvent = e.nativeEvent;
    handleMouseMove(nativeEvent);
  };

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
      onClick={handleClick}
      onMouseMove={handleCanvasMouseMove}
    />
  );
};

export default App;
