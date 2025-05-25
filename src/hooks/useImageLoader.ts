
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
    xavierImg.onload = () => {
      setXavierImage(xavierImg);
      setXavierImageLoaded(true);
      console.log('Xavier image loaded successfully');
    };
    xavierImg.onerror = (error) => {
      console.error('Failed to load Xavier image:', error);
      setXavierImageLoaded(false);
    };
    xavierImg.src = '/lovable-uploads/46f9249d-797d-4991-a9d7-728954ada963.png';

    // Load Morty's image
    const mortyImg = new Image();
    mortyImg.onload = () => {
      setMortyImage(mortyImg);
      setMortyImageLoaded(true);
      console.log('Morty image loaded successfully');
    };
    mortyImg.onerror = (error) => {
      console.error('Failed to load Morty image:', error);
      setMortyImageLoaded(false);
    };
    mortyImg.src = '/lovable-uploads/0a509393-0a99-4a04-8949-344699379246.png';

    // Load Mike's image
    const img = new Image();
    img.onload = () => {
      setMikeImage(img);
      setMikeImageLoaded(true);
      console.log('Mike image loaded successfully');
    };
    img.onerror = (error) => {
      console.error('Failed to load Mike image:', error);
      setMikeImageLoaded(false);
    };
    img.src = '/lovable-uploads/8131f420-fab4-4256-83b6-5f8339d387f4.png';
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
