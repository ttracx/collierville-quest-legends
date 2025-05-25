
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
  // Scale text for mobile
  const scaledSize = Math.max(size * (ctx.canvas.width / 800), 12);
  
  ctx.font = `${scaledSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  
  if (shadow) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText(text, x + 2, y + 2);
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
  // Scale button for mobile
  const scaleX = ctx.canvas.width / 800;
  const scaleY = ctx.canvas.height / 600;
  const scaledWidth = width * scaleX;
  const scaledHeight = height * scaleY;
  const scaledX = x * scaleX;
  const scaledY = y * scaleY;
  
  // Add pulse animation
  const pulse = 1 + Math.sin(pulseAnimation) * 0.05;
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
  ctx.shadowBlur = isHovered ? 20 : 10;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(finalX, finalY, finalWidth, finalHeight);
  ctx.shadowBlur = 0;
  
  // Scale text size
  const textSize = Math.max(24 * Math.min(scaleX, scaleY), 14);
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
  
  // Scale coordinates for mobile
  if (canvas) {
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;
    
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
  // Scale coordinates for mobile
  if (canvas) {
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;
    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;
    
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
  const scaleX = ctx.canvas.width / 800;
  const scaleY = ctx.canvas.height / 600;
  const scaledX = x * scaleX;
  const scaledY = y * scaleY;
  const buttonSize = 60 * Math.min(scaleX, scaleY);
  
  ctx.fillStyle = isPressed ? color : '#666';
  ctx.fillRect(scaledX - buttonSize/2, scaledY - buttonSize/2, buttonSize, buttonSize);
  
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(scaledX - buttonSize/2, scaledY - buttonSize/2, buttonSize, buttonSize);
  
  const textSize = 20 * Math.min(scaleX, scaleY);
  drawText(ctx, text, scaledX, scaledY + textSize/4, textSize, 'white', 'center', true);
}
