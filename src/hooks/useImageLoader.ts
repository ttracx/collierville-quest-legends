
import { useState, useEffect } from 'react';
import { generateAvatarDataURL } from '../utils/generateAvatars';

export const useImageLoader = () => {
  const [xavierImage, setXavierImage] = useState<HTMLImageElement>();
  const [xavierImageLoaded, setXavierImageLoaded] = useState(false);
  const [mortyImage, setMortyImage] = useState<HTMLImageElement>();
  const [mortyImageLoaded, setMortyImageLoaded] = useState(false);
  const [mikeImage, setMikeImage] = useState<HTMLImageElement>();
  const [mikeImageLoaded, setMikeImageLoaded] = useState(false);
  const [carsonImage, setCarsonImage] = useState<HTMLImageElement>();
  const [carsonImageLoaded, setCarsonImageLoaded] = useState(false);
  const [avaImage, setAvaImage] = useState<HTMLImageElement>();
  const [avaImageLoaded, setAvaImageLoaded] = useState(false);
  const [princeImage, setPrinceImage] = useState<HTMLImageElement>();
  const [princeImageLoaded, setPrinceImageLoaded] = useState(false);

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

    // Load Mike's image
    const mikeImg = new Image();
    mikeImg.src = generateAvatarDataURL('mike');
    mikeImg.onload = () => {
      console.log('Mike image loaded successfully');
      setMikeImageLoaded(true);
    };
    mikeImg.onerror = (error) => {
      console.error('Failed to load Mike image:', error);
      setMikeImageLoaded(false);
    };
    setMikeImage(mikeImg);

    // Load Carson's image
    const carsonImg = new Image();
    carsonImg.src = generateAvatarDataURL('carson');
    carsonImg.onload = () => {
      console.log('Carson image loaded successfully');
      setCarsonImageLoaded(true);
    };
    carsonImg.onerror = (error) => {
      console.error('Failed to load Carson image:', error);
      setCarsonImageLoaded(false);
    };
    setCarsonImage(carsonImg);

    // Load Ava's image
    const avaImg = new Image();
    avaImg.src = generateAvatarDataURL('ava');
    avaImg.onload = () => {
      console.log('Ava image loaded successfully');
      setAvaImageLoaded(true);
    };
    avaImg.onerror = (error) => {
      console.error('Failed to load Ava image:', error);
      setAvaImageLoaded(false);
    };
    setAvaImage(avaImg);

    // Load Prince's image
    const princeImg = new Image();
    princeImg.src = generateAvatarDataURL('prince');
    princeImg.onload = () => {
      console.log('Prince image loaded successfully');
      setPrinceImageLoaded(true);
    };
    princeImg.onerror = (error) => {
      console.error('Failed to load Prince image:', error);
      setPrinceImageLoaded(false);
    };
    setPrinceImage(princeImg);
  }, []);

  return {
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
    princeImageLoaded
  };
};
