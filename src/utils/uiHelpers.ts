
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
  // Improved scaling calculation for better readability
  const baseScale = Math.min(ctx.canvas.width / 800, ctx.canvas.height / 600);
  const scaledSize = Math.max(size * baseScale, 10);
  
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
  // Improved scaling for different orientations
  const baseScale = Math.min(ctx.canvas.width / 800, ctx.canvas.height / 600);
  const scaledWidth = width * baseScale;
  const scaledHeight = height * baseScale;
  const scaledX = x * baseScale;
  const scaledY = y * baseScale;
  
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
  
  // Improved text sizing
  const textSize = Math.max(20 * baseScale, 12);
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
  
  // Improved scaling for button detection
  if (canvas) {
    const baseScale = Math.min(canvas.width / 800, canvas.height / 600);
    const scaledX = x * baseScale;
    const scaledY = y * baseScale;
    const scaledWidth = width * baseScale;
    const scaledHeight = height * baseScale;
    
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
  // Improved scaling for button detection
  if (canvas) {
    const baseScale = Math.min(canvas.width / 800, canvas.height / 600);
    const scaledX = x * baseScale;
    const scaledY = y * baseScale;
    const scaledWidth = width * baseScale;
    const scaledHeight = height * baseScale;
    
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
  const baseScale = Math.min(ctx.canvas.width / 800, ctx.canvas.height / 600);
  const scaledX = x * baseScale;
  const scaledY = y * baseScale;
  const buttonSize = 50 * baseScale;
  
  ctx.fillStyle = isPressed ? color : '#666';
  ctx.fillRect(scaledX - buttonSize/2, scaledY - buttonSize/2, buttonSize, buttonSize);
  
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(scaledX - buttonSize/2, scaledY - buttonSize/2, buttonSize, buttonSize);
  
  const textSize = Math.max(16 * baseScale, 12);
  drawText(ctx, text, scaledX, scaledY + textSize/4, textSize, 'white', 'center', true);
}

// New utility function for responsive positioning
export function getResponsivePosition(
  baseX: number,
  baseY: number,
  canvas: HTMLCanvasElement,
  alignX: 'left' | 'center' | 'right' = 'center',
  alignY: 'top' | 'center' | 'bottom' = 'center'
) {
  const baseScale = Math.min(canvas.width / 800, canvas.height / 600);
  
  let x = baseX * baseScale;
  let y = baseY * baseScale;
  
  // Adjust for alignment
  if (alignX === 'center') {
    x = canvas.width / 2 + (baseX - 400) * baseScale;
  } else if (alignX === 'right') {
    x = canvas.width - (800 - baseX) * baseScale;
  }
  
  if (alignY === 'center') {
    y = canvas.height / 2 + (baseY - 300) * baseScale;
  } else if (alignY === 'bottom') {
    y = canvas.height - (600 - baseY) * baseScale;
  }
  
  return { x, y };
}
