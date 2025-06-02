// Character avatar data URLs generated from canvas drawings
// This file contains embedded avatar images as base64 data URLs

import { generateAvatarDataURL } from './generateAvatars';

// Generate avatars on demand or use pre-generated data
export const getCharacterAvatars = () => {
  // These will be generated dynamically when needed
  return {
    mike: generateAvatarDataURL('mike'),
    carson: generateAvatarDataURL('carson'),
    ava: generateAvatarDataURL('ava')
  };
};

// Pre-generated avatar data (to be filled after generation)
export const AVATAR_DATA = {
  mike: '', // Will be filled with base64 data
  carson: '', // Will be filled with base64 data
  ava: '' // Will be filled with base64 data
};