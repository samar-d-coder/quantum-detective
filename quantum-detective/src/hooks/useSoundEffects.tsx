import { useEffect, useRef } from 'react';
import { GameSettings } from './useGameStorage';

type SoundEffect = 'button' | 'select' | 'error' | 'success' | 'quantum' | 'timeline' | 'evidence';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<SoundEffect, AudioBuffer> = new Map();
  private settings: GameSettings | null = null;

  async initialize(settings: GameSettings) {
    this.settings = settings;
    
    if (!settings.soundEnabled) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.loadSounds();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  private async loadSounds() {
    if (!this.audioContext) return;

    const sounds: Record<SoundEffect, () => AudioBuffer> = {
      button: () => this.generateTone(800, 0.1, 'sine'),
      select: () => this.generateTone(1000, 0.15, 'triangle'),
      error: () => this.generateTone(300, 0.3, 'sawtooth'),
      success: () => this.generateChord([800, 1000, 1200], 0.5),
      quantum: () => this.generateQuantumBeep(),
      timeline: () => this.generateTimelineShift(),
      evidence: () => this.generateTone(600, 0.2, 'sine')
    };

    for (const [name, generator] of Object.entries(sounds)) {
      try {
        this.sounds.set(name as SoundEffect, generator());
      } catch (error) {
        console.error(`Failed to generate sound ${name}:`, error);
      }
    }
  }

  private generateTone(frequency: number, duration: number, type: OscillatorType): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let value = 0;

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'triangle':
          value = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1;
          break;
        case 'sawtooth':
          value = 2 * (frequency * t - Math.floor(frequency * t)) - 1;
          break;
      }

      const envelope = Math.exp(-t * 3);
      data[i] = value * envelope * 0.3;
    }

    return buffer;
  }

  private generateChord(frequencies: number[], duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let value = 0;

      frequencies.forEach(freq => {
        value += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
      });

      const envelope = Math.exp(-t * 2);
      data[i] = value * envelope * 0.3;
    }

    return buffer;
  }

  private generateQuantumBeep(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.3;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const frequency = 1000 + Math.sin(t * 30) * 200; 
      const value = Math.sin(2 * Math.PI * frequency * t);
      const envelope = Math.exp(-t * 5);
      data[i] = value * envelope * 0.4;
    }

    return buffer;
  }

  private generateTimelineShift(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.8;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const frequency = 400 + t * 800; 
      const value = Math.sin(2 * Math.PI * frequency * t) * Math.sin(t * 20); 
      const envelope = Math.sin(t / duration * Math.PI); 
      data[i] = value * envelope * 0.3;
    }

    return buffer;
  }

  play(effect: SoundEffect) {
    if (!this.audioContext || !this.settings?.soundEnabled) return;

    const buffer = this.sounds.get(effect);
    if (!buffer) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.settings.effectsVolume * 0.5;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  updateSettings(settings: GameSettings) {
    this.settings = settings;
  }
}

const soundManager = new SoundManager();

export const useSoundEffects = (settings: GameSettings) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      soundManager.initialize(settings);
      initialized.current = true;
    } else {
      soundManager.updateSettings(settings);
    }
  }, [settings]);

  return {
    playSound: (effect: SoundEffect) => soundManager.play(effect)
  };
};