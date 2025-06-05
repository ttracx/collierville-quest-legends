
import React from 'react';
import { GameState } from '../types/gameTypes';
import { Particle } from '../utils/particleSystem';
import { MenuBackground } from './menu/MenuBackground';
import { MenuTitle } from './menu/MenuTitle';
import { CharacterSelector } from './menu/CharacterSelector';
import { MenuButtons } from './menu/MenuButtons';

interface GameMenuProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  mouseX: number;
  mouseY: number;
  clicked: boolean;
  frameCount: number;
  backgroundStars: any[];
  particles: Particle[];
  xavierImage?: HTMLImageElement;
  xavierImageLoaded?: boolean;
  mortyImage?: HTMLImageElement;
  mortyImageLoaded?: boolean;
  mikeImage?: HTMLImageElement;
  mikeImageLoaded?: boolean;
  carsonImage?: HTMLImageElement;
  carsonImageLoaded?: boolean;
  avaImage?: HTMLImageElement;
  avaImageLoaded?: boolean;
  princeImage?: HTMLImageElement;
  princeImageLoaded?: boolean;
  onStateChange: (state: GameState) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  ctx,
  canvas,
  mouseX,
  mouseY,
  clicked,
  frameCount,
  backgroundStars,
  particles,
  xavierImage,
  xavierImageLoaded = false,
  mortyImage,
  mortyImageLoaded = false,
  mikeImage,
  mikeImageLoaded = false,
  carsonImage,
  carsonImageLoaded = false,
  avaImage,
  avaImageLoaded = false,
  princeImage,
  princeImageLoaded = false,
  onStateChange
}) => {
  // Call the drawing functions directly
  MenuBackground({
    ctx,
    canvas,
    frameCount,
    backgroundStars
  });

  MenuTitle({
    ctx,
    canvas,
    frameCount
  });

  CharacterSelector({
    ctx,
    canvas,
    mouseX,
    mouseY,
    clicked,
    frameCount,
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
    onStateChange
  });

  MenuButtons({
    ctx,
    canvas,
    mouseX,
    mouseY,
    clicked,
    particles,
    onStateChange
  });

  return null;
};
