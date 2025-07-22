import React, { useState, useEffect } from 'react';
import { MainMenu } from './game/MainMenu';
import { GameInterface } from './game/GameInterface';
import { AudioManager } from './game/AudioManager';
import { EnhancedAudioManager } from './game/EnhancedAudioManager';
import { LoadingSpinner } from './ui/loading-spinner';
import { useGameStorage } from '@/hooks/useGameStorage';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export type GameState = 'menu' | 'playing' | 'paused' | 'completed';
export type Timeline = 'alpha' | 'beta' | 'gamma' | 'delta';

export interface GameData {
  currentTimeline: Timeline;
  quantumEnergy: number;
  evidence: any[];
  characters: any[];
  storyProgress: Record<Timeline, number>;
  currentChapter: number;
  achievements: string[];
  showTutorial: boolean;
  startTime: number;
}

export const QuantumDetective = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [gameData, setGameData] = useState<GameData>({
    currentTimeline: 'alpha',
    quantumEnergy: 100,
    evidence: [],
    characters: [
      {
        id: 'witness1',
        name: 'Dr. Sarah Chen',
        role: 'Quantum Physicist',
        suspicionLevel: 25,
        trustLevel: 75,
        lastSeen: '2 hours ago',
        timeline: 'alpha',
        status: 'available',
        background: 'Lead researcher on the quantum entanglement project',
        traits: ['Analytical', 'Cautious', 'Detail-oriented']
      },
      {
        id: 'witness2',
        name: 'Marcus Webb',
        role: 'Security Guard',
        suspicionLevel: 60,
        trustLevel: 40,
        lastSeen: '30 minutes ago',
        timeline: 'alpha',
        status: 'suspicious',
        background: 'Night shift security, first on scene',
        traits: ['Nervous', 'Secretive', 'Observant']
      }
    ],
    storyProgress: { alpha: 0, beta: 0, gamma: 0, delta: 0 },
    currentChapter: 1,
    achievements: [],
    showTutorial: true,
    startTime: Date.now()
  });

  const { settings, saveGame: saveToStorage, loadGame: loadFromStorage, hasAnySave } = useGameStorage();
  const { playSound } = useSoundEffects(settings);

  useEffect(() => {
    AudioManager.initialize();
    EnhancedAudioManager.initialize();
    return () => {
      AudioManager.cleanup();
      EnhancedAudioManager.cleanup();
    };
  }, []);

  const startNewGame = async () => {
    setIsLoading(true);
    setLoadingMessage('Initializing quantum matrices...');
    playSound('quantum');

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoadingMessage('Calibrating timeline detectors...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoadingMessage('Loading reality framework...');
    await new Promise(resolve => setTimeout(resolve, 800));

    const newGameData = {
      currentTimeline: 'alpha' as Timeline,
      quantumEnergy: 100,
      evidence: [],
      characters: [],
      storyProgress: { alpha: 0, beta: 0, gamma: 0, delta: 0 },
      currentChapter: 1,
      achievements: [],
      showTutorial: true,
      startTime: Date.now()
    };

    setGameData(newGameData);
    setGameState('playing');
    setIsLoading(false);
    AudioManager.playAmbient();
    playSound('success');
  };

  const loadGame = async () => {
    setIsLoading(true);
    setLoadingMessage('Reconstructing quantum state...');
    playSound('quantum');

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedData = loadFromStorage(0);
    if (savedData) {
      setLoadingMessage('Synchronizing timelines...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGameData(savedData);
      setGameState('playing');
      AudioManager.playAmbient();
      playSound('success');
    } else {
      playSound('error');
    }
    
    setIsLoading(false);
  };

  const saveGame = () => {
    const success = saveToStorage(gameData, 0);
    if (success) {
      playSound('success');
    } else {
      playSound('error');
    }
    return success;
  };

  const returnToMenu = async () => {
    setIsLoading(true);
    setLoadingMessage('Saving quantum state...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    saveGame();
    
    setGameState('menu');
    setIsLoading(false);
    AudioManager.stopAmbient();
    playSound('timeline');
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">

      <div className="fixed inset-0 matrix-bg"></div>
      <div className="fixed inset-0 scanlines pointer-events-none"></div>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-30 animate-quantum-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-8">
            <LoadingSpinner size="lg" variant="quantum" className="mx-auto" />
            <div className="space-y-4">
              <h2 className="text-2xl font-orbitron text-primary">
                {loadingMessage}
              </h2>
              <div className="w-64 h-2 bg-muted rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {gameState === 'menu' && !isLoading && (
          <MainMenu
            onNewGame={startNewGame}
            onLoadGame={loadGame}
            hasSavedGame={hasAnySave()}
          />
        )}

        {gameState === 'playing' && !isLoading && (
          <GameInterface
            gameData={gameData}
            onGameDataChange={setGameData}
            onReturnToMenu={returnToMenu}
            onSaveGame={saveGame}
          />
        )}
      </div>
    </div>
  );
};