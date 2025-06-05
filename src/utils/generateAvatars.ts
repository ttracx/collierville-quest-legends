// Avatar generation utility for creating character images
export const generateAvatar = (canvas: HTMLCanvasElement, character: 'mike' | 'carson' | 'ava' | 'prince') => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 200;
  canvas.height = 200;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Enable smooth edges
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  switch (character) {
    case 'mike':
      drawMikeAvatar(ctx, canvas.width, canvas.height);
      break;
    case 'carson':
      drawCarsonAvatar(ctx, canvas.width, canvas.height);
      break;
    case 'ava':
      drawAvaAvatar(ctx, canvas.width, canvas.height);
      break;
    case 'prince':
      drawPrinceAvatar(ctx, canvas.width, canvas.height);
      break;
  }
};

const drawMikeAvatar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const centerX = width / 2;
  const centerY = height / 2;

  // Background circle
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#ffdbac';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 10, 60, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair (short brown hair)
  ctx.fillStyle = '#654321';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 50, 55, 35, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath();
  ctx.ellipse(centerX - 20, centerY - 15, 8, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(centerX + 20, centerY - 15, 8, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(centerX - 20, centerY - 15, 4, 0, Math.PI * 2);
  ctx.arc(centerX + 20, centerY - 15, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX - 20, centerY - 25, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.arc(centerX + 20, centerY - 25, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#d4a373';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 5);
  ctx.lineTo(centerX - 5, centerY + 5);
  ctx.lineTo(centerX + 5, centerY + 5);
  ctx.stroke();

  // Smile
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 10, 20, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Fitness outfit (tank top)
  ctx.fillStyle = '#1976d2';
  ctx.beginPath();
  ctx.rect(centerX - 45, centerY + 45, 90, 55);
  ctx.fill();

  // Muscles definition
  ctx.strokeStyle = '#1565c0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 30, centerY + 60);
  ctx.lineTo(centerX - 30, centerY + 80);
  ctx.moveTo(centerX + 30, centerY + 60);
  ctx.lineTo(centerX + 30, centerY + 80);
  ctx.stroke();
};

const drawCarsonAvatar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const centerX = width / 2;
  const centerY = height / 2;

  // Background circle
  ctx.fillStyle = '#4169E1';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#fdbcb4';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 10, 58, 68, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair (brown styled)
  ctx.fillStyle = '#654321';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 45, 60, 40, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  
  // Hair spike detail
  ctx.beginPath();
  ctx.moveTo(centerX - 40, centerY - 60);
  ctx.quadraticCurveTo(centerX - 30, centerY - 75, centerX - 20, centerY - 65);
  ctx.moveTo(centerX + 20, centerY - 65);
  ctx.quadraticCurveTo(centerX + 30, centerY - 75, centerX + 40, centerY - 60);
  ctx.fill();

  // Glasses frame
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Left lens
  ctx.rect(centerX - 35, centerY - 25, 30, 25);
  // Right lens
  ctx.rect(centerX + 5, centerY - 25, 30, 25);
  ctx.stroke();
  
  // Bridge
  ctx.beginPath();
  ctx.moveTo(centerX - 5, centerY - 15);
  ctx.lineTo(centerX + 5, centerY - 15);
  ctx.stroke();

  // Eyes (blue behind glasses)
  ctx.fillStyle = '#4169E1';
  ctx.beginPath();
  ctx.ellipse(centerX - 18, centerY - 15, 9, 11, 0, 0, Math.PI * 2);
  ctx.ellipse(centerX + 18, centerY - 15, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 15, 4, 0, Math.PI * 2);
  ctx.arc(centerX + 18, centerY - 15, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 35, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.arc(centerX + 18, centerY - 35, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#e6a88a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 5);
  ctx.lineTo(centerX - 4, centerY + 3);
  ctx.lineTo(centerX + 4, centerY + 3);
  ctx.stroke();

  // Confident smile
  ctx.strokeStyle = '#dc143c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 12, 22, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Athletic wear (compression shirt)
  ctx.fillStyle = '#ff6347';
  ctx.beginPath();
  ctx.rect(centerX - 50, centerY + 45, 100, 55);
  ctx.fill();

  // Number on shirt
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('7', centerX, centerY + 80);
};

const drawAvaAvatar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const centerX = width / 2;
  const centerY = height / 2;

  // Background circle
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#ffdfc4';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 10, 58, 68, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair (long auburn)
  ctx.fillStyle = '#a0522d';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 40, 65, 45, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  
  // Long hair sides
  ctx.beginPath();
  ctx.ellipse(centerX - 50, centerY + 10, 20, 60, -0.2, 0, Math.PI);
  ctx.ellipse(centerX + 50, centerY + 10, 20, 60, 0.2, 0, Math.PI);
  ctx.fill();

  // Hair highlight
  ctx.fillStyle = '#cd853f';
  ctx.beginPath();
  ctx.ellipse(centerX - 20, centerY - 50, 15, 25, -0.3, 0, Math.PI);
  ctx.fill();

  // Big glasses frame
  ctx.strokeStyle = '#8b1538';
  ctx.lineWidth = 4;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  // Left lens - big and round
  ctx.arc(centerX - 22, centerY - 15, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  // Right lens - big and round
  ctx.arc(centerX + 22, centerY - 15, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Bridge
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 15);
  ctx.lineTo(centerX, centerY - 15);
  ctx.stroke();
  
  // Temple arms
  ctx.beginPath();
  ctx.moveTo(centerX - 44, centerY - 15);
  ctx.lineTo(centerX - 55, centerY - 20);
  ctx.moveTo(centerX + 44, centerY - 15);
  ctx.lineTo(centerX + 55, centerY - 20);
  ctx.stroke();

  // Eyes (hazel behind glasses)
  ctx.fillStyle = '#8b7355';
  ctx.beginPath();
  ctx.ellipse(centerX - 20, centerY - 15, 10, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(centerX + 20, centerY - 15, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye sparkle
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 17, 3, 0, Math.PI * 2);
  ctx.arc(centerX + 22, centerY - 17, 3, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(centerX - 20, centerY - 15, 4, 0, Math.PI * 2);
  ctx.arc(centerX + 20, centerY - 15, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eyelashes
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 28, centerY - 18);
  ctx.lineTo(centerX - 30, centerY - 20);
  ctx.moveTo(centerX + 28, centerY - 18);
  ctx.lineTo(centerX + 30, centerY - 20);
  ctx.stroke();

  // Eyebrows
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX - 20, centerY - 40, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.arc(centerX + 20, centerY - 40, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#daa89b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 5);
  ctx.lineTo(centerX - 4, centerY + 3);
  ctx.lineTo(centerX + 4, centerY + 3);
  ctx.stroke();

  // Friendly smile
  ctx.strokeStyle = '#dc143c';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 12, 20, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Yoga outfit
  ctx.fillStyle = '#9370db';
  ctx.beginPath();
  ctx.rect(centerX - 48, centerY + 45, 96, 55);
  ctx.fill();

  // Yoga symbol
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 75, 15, 0, Math.PI * 2);
  ctx.moveTo(centerX, centerY + 60);
  ctx.lineTo(centerX, centerY + 90);
  ctx.moveTo(centerX - 10, centerY + 70);
  ctx.lineTo(centerX + 10, centerY + 70);
  ctx.stroke();
};

const drawPrinceAvatar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const centerX = width / 2;
  const centerY = height / 2;

  // Background circle
  ctx.fillStyle = '#8A2BE2';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#f4c2a1';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 10, 58, 68, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair (styled dark hair)
  ctx.fillStyle = '#2c1810';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - 45, 62, 42, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  
  // Hair texture/style
  ctx.beginPath();
  ctx.moveTo(centerX - 30, centerY - 70);
  ctx.quadraticCurveTo(centerX - 15, centerY - 80, centerX, centerY - 70);
  ctx.quadraticCurveTo(centerX + 15, centerY - 80, centerX + 30, centerY - 70);
  ctx.fill();

  // Eyes (confident brown eyes)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(centerX - 18, centerY - 15, 9, 11, 0, 0, Math.PI * 2);
  ctx.ellipse(centerX + 18, centerY - 15, 9, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(centerX - 16, centerY - 17, 2, 0, Math.PI * 2);
  ctx.arc(centerX + 20, centerY - 17, 2, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 15, 4, 0, Math.PI * 2);
  ctx.arc(centerX + 18, centerY - 15, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows (well-groomed)
  ctx.strokeStyle = '#2c1810';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX - 18, centerY - 30, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.arc(centerX + 18, centerY - 30, 12, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#e6a88a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 5);
  ctx.lineTo(centerX - 4, centerY + 3);
  ctx.lineTo(centerX + 4, centerY + 3);
  ctx.stroke();

  // Charming smile
  ctx.strokeStyle = '#dc143c';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 12, 20, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Cafe uniform (polo shirt)
  ctx.fillStyle = '#6B46C1';
  ctx.beginPath();
  ctx.rect(centerX - 48, centerY + 45, 96, 55);
  ctx.fill();

  // Collar
  ctx.strokeStyle = '#553C9A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 15, centerY + 45);
  ctx.lineTo(centerX - 25, centerY + 60);
  ctx.moveTo(centerX + 15, centerY + 45);
  ctx.lineTo(centerX + 25, centerY + 60);
  ctx.stroke();

  // Name tag
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.rect(centerX - 20, centerY + 65, 40, 15);
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Name text
  ctx.fillStyle = '#000';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PRINCE', centerX, centerY + 75);
};

// Export function to save avatars as data URLs
export const generateAvatarDataURL = (character: 'mike' | 'carson' | 'ava' | 'prince'): string => {
  const canvas = document.createElement('canvas');
  generateAvatar(canvas, character);
  return canvas.toDataURL('image/png');
};
