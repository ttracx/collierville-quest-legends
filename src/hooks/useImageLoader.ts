
import { useState, useEffect } from 'react';

export const useImageLoader = () => {
  const [xavierImage, setXavierImage] = useState<HTMLImageElement>();
  const [xavierImageLoaded, setXavierImageLoaded] = useState(false);
  const [mortyImage, setMortyImage] = useState<HTMLImageElement>();
  const [mortyImageLoaded, setMortyImageLoaded] = useState(false);
  const [mikeImage, setMikeImage] = useState<HTMLImageElement>();
  const [mikeImageLoaded, setMikeImageLoaded] = useState(false);

  useEffect(() => {
    // Load Xavier's image
    const xavierImg = new Image();
    xavierImg.src = '/lovable-uploads/8131f420-fab4-4256-83b6-5f8339d387f4.png';
    xavierImg.onload = () => {
      console.log('Xavier image loaded successfully');
      setXavierImageLoaded(true);
    };
    xavierImg.onerror = (error) => {
      console.error('Failed to load Xavier image:', error);
      setXavierImageLoaded(false);
    };
    setXavierImage(xavierImg);

    // Load Morty's image
    const mortyImg = new Image();
    mortyImg.src = '/lovable-uploads/7bd337f7-c72b-48c2-a522-fc4dea130240.png';
    mortyImg.onload = () => {
      console.log('Morty image loaded successfully');
      setMortyImageLoaded(true);
    };
    mortyImg.onerror = (error) => {
      console.error('Failed to load Morty image:', error);
      setMortyImageLoaded(false);
    };
    setMortyImage(mortyImg);

    // Load Mike's image (placeholder for now)
    const mikeImg = new Image();
    mikeImg.src = '/lovable-uploads/8131f420-fab4-4256-83b6-5f8339d387f4.png'; // Using Xavier's image as placeholder
    mikeImg.onload = () => {
      console.log('Mike image loaded successfully');
      setMikeImageLoaded(true);
    };
    mikeImg.onerror = (error) => {
      console.error('Failed to load Mike image:', error);
      setMikeImageLoaded(false);
    };
    setMikeImage(mikeImg);
  }, []);

  return {
    xavierImage,
    xavierImageLoaded,
    mortyImage,
    mortyImageLoaded,
    mikeImage,
    mikeImageLoaded
  };
};
