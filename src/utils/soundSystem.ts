
export class SoundSystem {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private enabled = true;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  async init() {
    if (!this.audioContext) return;
    
    // Resume audio context on user interaction
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  createBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playSuccess() {
    this.createBeep(523.25, 0.1); // C5
    setTimeout(() => this.createBeep(659.25, 0.1), 100); // E5
    setTimeout(() => this.createBeep(783.99, 0.2), 200); // G5
  }

  playError() {
    this.createBeep(220, 0.3, 'sawtooth');
  }

  playClick() {
    this.createBeep(440, 0.1, 'square');
  }

  playVictory() {
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
    notes.forEach((note, index) => {
      setTimeout(() => this.createBeep(note, 0.15), index * 100);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundSystem = new SoundSystem();
