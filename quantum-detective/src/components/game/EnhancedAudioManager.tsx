import { Timeline } from '../QuantumDetective';

class EnhancedAudioManagerClass {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private timelineAmbients: Map<Timeline, OscillatorNode[]> = new Map();
  private isInitialized = false;
  private currentTimeline: Timeline = 'alpha';

  initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.ambientGain = this.audioContext.createGain();
      this.effectsGain = this.audioContext.createGain();
      
      this.masterGain.connect(this.audioContext.destination);
      this.ambientGain.connect(this.masterGain);
      this.effectsGain.connect(this.masterGain);
      
      this.masterGain.gain.value = 0.6;
      this.ambientGain.gain.value = 0.3;
      this.effectsGain.gain.value = 0.7;
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode | null {
    if (!this.audioContext) return null;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    return oscillator;
  }

  private getTimelineAmbientConfig(timeline: Timeline) {
    const configs = {
      alpha: { base: 55, harmony: [110, 165], type: 'sawtooth' as OscillatorType },
      beta: { base: 73, harmony: [146, 220], type: 'triangle' as OscillatorType },
      gamma: { base: 98, harmony: [196, 294], type: 'square' as OscillatorType },
      delta: { base: 82, harmony: [164, 247], type: 'sine' as OscillatorType }
    };
    return configs[timeline];
  }

  switchTimelineAmbient(timeline: Timeline) {
    if (timeline === this.currentTimeline) return;
    this.stopTimelineAmbient(this.currentTimeline);
    setTimeout(() => {
      this.startTimelineAmbient(timeline);
      this.currentTimeline = timeline;
    }, 300);
  }

  private startTimelineAmbient(timeline: Timeline) {
    if (!this.audioContext || !this.ambientGain) return;

    const config = this.getTimelineAmbientConfig(timeline);
    const oscillators: OscillatorNode[] = [];
    const baseOsc = this.createOscillator(config.base, config.type);
    if (baseOsc) {
      const gain = this.audioContext.createGain();
      gain.gain.value = 0.4;
      baseOsc.connect(gain);
      gain.connect(this.ambientGain);
      baseOsc.start();
      oscillators.push(baseOsc);
    }
    config.harmony.forEach((freq, index) => {
      const harmonyOsc = this.createOscillator(freq, config.type);
      if (harmonyOsc) {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.2 - (index * 0.05);
        harmonyOsc.connect(gain);
        gain.connect(this.ambientGain);
        harmonyOsc.start();
        oscillators.push(harmonyOsc);
      }
    });

    this.timelineAmbients.set(timeline, oscillators);
  }
  private stopTimelineAmbient(timeline: Timeline) {
    const oscillators = this.timelineAmbients.get(timeline);
    if (oscillators) {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
        }
      });
      this.timelineAmbients.delete(timeline);
    }
  }

  playTimelineSwitch() {
    if (!this.audioContext || !this.effectsGain) return;

    const now = this.audioContext.currentTime;
    for (let i = 0; i < 3; i++) {
      const oscillator = this.createOscillator(800 + (i * 200), 'square');
      if (oscillator) {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.3;
        
        oscillator.connect(gain);
        gain.connect(this.effectsGain);
        
        oscillator.frequency.setValueAtTime(800 + (i * 200), now + (i * 0.1));
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.5 + (i * 0.1));
        
        gain.gain.setValueAtTime(0.3, now + (i * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5 + (i * 0.1));
        
        oscillator.start(now + (i * 0.1));
        oscillator.stop(now + 0.5 + (i * 0.1));
      }
    }
  }

  playEvidenceFound() {
    if (!this.audioContext || !this.effectsGain) return;

    const now = this.audioContext.currentTime;
    const frequencies = [523, 659, 784]; 
    frequencies.forEach((freq, index) => {
      const oscillator = this.createOscillator(freq, 'sine');
      if (oscillator) {
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.4;
        
        oscillator.connect(gain);
        gain.connect(this.effectsGain);
        
        gain.gain.setValueAtTime(0.4, now + (index * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8 + (index * 0.1));
        
        oscillator.start(now + (index * 0.1));
        oscillator.stop(now + 0.8 + (index * 0.1));
      }
    });
  }

  playQuantumAlert() {
    if (!this.audioContext || !this.effectsGain) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(440, 'triangle');
    
    if (oscillator) {
      const gain = this.audioContext.createGain();
      gain.gain.value = 0.5;
      
      oscillator.connect(gain);
      gain.connect(this.effectsGain);
      
      for (let i = 0; i < 3; i++) {
        gain.gain.setValueAtTime(0.5, now + (i * 0.3));
        gain.gain.exponentialRampToValueAtTime(0.1, now + 0.15 + (i * 0.3));
      }
      
      oscillator.start(now);
      oscillator.stop(now + 1);
    }
  }

  playUIClick() {
    if (!this.audioContext || !this.effectsGain) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(800, 'sine');
    
    if (oscillator) {
      const gain = this.audioContext.createGain();
      gain.gain.value = 0.3;
      
      oscillator.connect(gain);
      gain.connect(this.effectsGain);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    }
  }

  setVolume(master: number, ambient: number, effects: number) {
    if (this.masterGain) this.masterGain.gain.value = master;
    if (this.ambientGain) this.ambientGain.gain.value = ambient;
    if (this.effectsGain) this.effectsGain.gain.value = effects;
  }

  cleanup() {
    this.timelineAmbients.forEach((oscillators) => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
        }
      });
    });
    this.timelineAmbients.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
      this.ambientGain = null;
      this.effectsGain = null;
      this.isInitialized = false;
    }
  }
}

export const EnhancedAudioManager = new EnhancedAudioManagerClass();