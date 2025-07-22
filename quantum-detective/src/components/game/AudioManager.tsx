class AudioManagerClass {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOscillator: OscillatorNode | null = null;
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.1; 
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode | null {
    if (!this.audioContext || !this.masterGain) return null;
    
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.05;
    
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    
    return oscillator;
  }

  playAmbient() {
    if (!this.audioContext || this.ambientOscillator) return;

    this.ambientOscillator = this.createOscillator(55, 'sawtooth'); 
    if (this.ambientOscillator) {
      this.ambientOscillator.start();

      const lfo = this.createOscillator(0.1, 'sine');
      if (lfo && this.audioContext) {
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 2;
        lfo.connect(lfoGain);
        lfoGain.connect(this.ambientOscillator.frequency);
        lfo.start();
      }
    }
  }

  stopAmbient() {
    if (this.ambientOscillator) {
      this.ambientOscillator.stop();
      this.ambientOscillator = null;
    }
  }

  playQuantumJump() {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(800, 'square');
    
    if (oscillator) {
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.5);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    }
  }

  playEvidenceFound() {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(1000, 'sine');
    
    if (oscillator) {
      oscillator.frequency.setValueAtTime(1000, now);
      oscillator.frequency.setValueAtTime(1500, now + 0.1);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    }
  }

  playUISound(frequency: number = 440) {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(frequency, 'sine');
    
    if (oscillator) {
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    }
  }

  cleanup() {
    this.stopAmbient();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
      this.isInitialized = false;
    }
  }
}

export const AudioManager = new AudioManagerClass();