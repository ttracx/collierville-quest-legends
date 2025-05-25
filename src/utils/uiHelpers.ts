
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size = 20,
  color = 'white',
  align: CanvasTextAlign = 'center',
  shadow = false
) {
  // Dynamic scaling based on actual canvas size for fullscreen
  const baseWidth = 800;
  const baseHeight = 600;
  const scaleX = ctx.canvas.width / baseWidth;
  const scaleY = ctx.canvas.height / baseHeight;
  const scale = Math.min(scaleX, scaleY);
  
  const scaledSize = Math.max(size * scale, 12);
  
  ctx.font = `${scaledSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  
  if (shadow) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillText(text, x + 1, y + 1);
    ctx.restore();
    ctx.fillStyle = color;
  }
  
  ctx.fillText(text, x, y);
}

export function drawGradientButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  color1 = '#ff6b35',
  color2 = '#ff4500',
  isHovered = false,
  pulseAnimation = 0
) {
  // Responsive scaling for fullscreen
  const baseWidth = 800;
  const baseHeight = 600;
  const scaleX = ctx.canvas.width / baseWidth;
  const scaleY = ctx.canvas.height / baseHeight;
  const scale = Math.min(scaleX, scaleY);
  
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledX = x * scaleX;
  const scaledY = y * scaleY;
  
  // Add pulse animation
  const pulse = 1 + Math.sin(pulseAnimation) * 0.03;
  const finalWidth = scaledWidth * pulse;
  const finalHeight = scaledHeight * pulse;
  const finalX = scaledX - (finalWidth - scaledWidth) / 2;
  const finalY = scaledY - (finalHeight - scaledHeight) / 2;
  
  const gradient = ctx.createLinearGradient(finalX, finalY, finalX, finalY + finalHeight);
  
  if (isHovered) {
    gradient.addColorStop(0, color2);
    gradient.addColorStop(1, color1);
  } else {
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(finalX, finalY, finalWidth, finalHeight);
  
  // Add glow effect
  ctx.shadowColor = color1;
  ctx.shadowBlur = isHovered ? 15 : 8;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(finalX, finalY, finalWidth, finalHeight);
  ctx.shadowBlur = 0;
  
  // Better text sizing
  const textSize = Math.max(20 * scale, 14);
  drawText(ctx, text, finalX + finalWidth / 2, finalY + finalHeight / 2 + textSize / 4, textSize, 'white', 'center', true);
}

export function isButtonClicked(
  x: number,
  y: number,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  clicked: boolean,
  canvas?: HTMLCanvasElement
) {
  if (!clicked) return false;
  
  if (canvas) {
    const baseWidth = 800;
    const baseHeight = 600;
    const scaleX = canvas.width / baseWidth;
    const scaleY = canvas.height / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    return mouseX >= scaledX && mouseX <= scaledX + scaledWidth &&
           mouseY >= scaledY && mouseY <= scaledY + scaledHeight;
  }
  
  return mouseX >= x && mouseX <= x + width &&
         mouseY >= y && mouseY <= y + height;
}

export function isButtonHovered(
  x: number,
  y: number,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  canvas?: HTMLCanvasElement
) {
  if (canvas) {
    const baseWidth = 800;
    const baseHeight = 600;
    const scaleX = canvas.width / baseWidth;
    const scaleY = canvas.height / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    return mouseX >= scaledX && mouseX <= scaledX + scaledWidth &&
           mouseY >= scaledY && mouseY <= scaledY + scaledHeight;
  }
  
  return mouseX >= x && mouseX <= x + width &&
         mouseY >= y && mouseY <= y + height;
}

export function drawMobileWorkoutButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  isPressed: boolean,
  color = '#4CAF50'
) {
  const baseWidth = 800;
  const baseHeight = 600;
  const scaleX = ctx.canvas.width / baseWidth;
  const scaleY = ctx.canvas.height / baseHeight;
  const scale = Math.min(scaleX, scaleY);
  
  const scaledX = x * scaleX;
  const scaledY = y * scaleY;
  const buttonSize = 50 * scale;
  
  ctx.fillStyle = isPressed ? color : '#666';
  ctx.fillRect(scaledX - buttonSize/2, scaledY - buttonSize/2, buttonSize, buttonSize);
  
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(scaledX - buttonSize/2, scaledY - buttonSize/2, buttonSize, buttonSize);
  
  const textSize = Math.max(16 * scale, 12);
  drawText(ctx, text, scaledX, scaledY + textSize/4, textSize, 'white', 'center', true);
}

// Enhanced responsive positioning for fullscreen
export function getResponsivePosition(
  baseX: number,
  baseY: number,
  canvas: HTMLCanvasElement,
  alignX: 'left' | 'center' | 'right' = 'center',
  alignY: 'top' | 'center' | 'bottom' = 'center'
) {
  const baseWidth = 800;
  const baseHeight = 600;
  const scaleX = canvas.width / baseWidth;
  const scaleY = canvas.height / baseHeight;
  
  let x = baseX * scaleX;
  let y = baseY * scaleY;
  
  // Adjust for alignment
  if (alignX === 'center') {
    x = canvas.width / 2 + (baseX - baseWidth/2) * scaleX;
  } else if (alignX === 'right') {
    x = canvas.width - (baseWidth - baseX) * scaleX;
  }
  
  if (alignY === 'center') {
    y = canvas.height / 2 + (baseY - baseHeight/2) * scaleY;
  } else if (alignY === 'bottom') {
    y = canvas.height - (baseHeight - baseY) * scaleY;
  }
  
  return { x, y };
}
