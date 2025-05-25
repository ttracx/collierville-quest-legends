
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  decay: number;
  type: string;
}

export function createParticle(
  x: number,
  y: number,
  color: string,
  type = 'burst',
  particles: Particle[]
) {
  const particle: Particle = {
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    size: Math.random() * 4 + 2,
    color,
    life: 1,
    decay: 0.02,
    type
  };
  
  if (type === 'trail') {
    particle.vx *= 0.3;
    particle.vy *= 0.3;
    particle.decay = 0.05;
  }
  
  particles.push(particle);
}

export function updateParticles(particles: Particle[]) {
  return particles.filter(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.98;
    particle.vy *= 0.98;
    particle.life -= particle.decay;
    
    if (particle.type === 'trail') {
      particle.vy += 0.2; // gravity for trail particles
    }
    
    return particle.life > 0;
  });
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(particle => {
    ctx.save();
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function drawBackgroundStars(
  ctx: CanvasRenderingContext2D,
  backgroundStars: any[],
  canvasHeight: number,
  canvasWidth: number
) {
  backgroundStars.forEach(star => {
    star.y += star.speed;
    if (star.y > canvasHeight) {
      star.y = 0;
      star.x = Math.random() * canvasWidth;
    }
    
    ctx.save();
    ctx.globalAlpha = star.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}
