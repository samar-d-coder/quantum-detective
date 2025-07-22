import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { HowToPlayGuide } from './HowToPlayGuide';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useGameStorage } from '@/hooks/useGameStorage';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  hasSavedGame: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onLoadGame,
  hasSavedGame
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  
  const { settings } = useGameStorage();
  const { playSound } = useSoundEffects(settings);
  const menuItems = [
    'new-game',
    ...(hasSavedGame ? ['continue-case'] : []),
    'quantum-archives',
    'how-to-play',
    'settings'
  ];

  const handleMenuSelect = (index: number) => {
    const item = menuItems[index];
    playSound('select');
    
    switch (item) {
      case 'new-game':
        onNewGame();
        break;
      case 'continue-case':
        onLoadGame();
        break;
      case 'quantum-archives':
        playSound('error'); 
        break;
      case 'how-to-play':
        setShowHowToPlay(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
    }
  };
  const { getItemProps } = useKeyboardNavigation({
    items: menuItems,
    onSelect: handleMenuSelect,
    enabled: !showSettings && !showHowToPlay
  });
  
  const matrixAscii = `
    ╔═══════════════════════════════════╗
    ║ █▀▀█ █░░█ █▀▀█ █▀▀▄ ▀▀█▀▀ █░░█ █▀▄▀█ ║
    ║ █░░█ █░░█ █▄▄█ █░░█ ░░█░░ █░░█ █░▀░█ ║
    ║ ▀▀▀▀ ░▀▀▀ ▀░░▀ ▀░░▀ ░░▀░░ ░▀▀▀ ▀░░░▀ ║
    ║                                   ║
    ║ ▀▀█▀▀ █▀▀ ▀▀█▀▀ █▀▀ █▀▀ ▀▀█▀▀ ░▀░ █░░█ █▀▀ ║
    ║ ░░█░░ █▀▀ ░░█░░ █▀▀ █░░ ░░█░░ ▀█▀ ▀█▀ █▀▀ ║
    ║ ░░▀░░ ▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ░░▀░░ ▀▀▀ ░▀░ ▀▀▀ ║
    ╚═══════════════════════════════════╝
    ┌─────────────────────────────────┐
    │ Reality.exe is loading...       │
    │ ████████████████████████ 100%   │
    │ Quantum matrices synchronized   │
    └─────────────────────────────────┘
  `;

  return (
    <>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showHowToPlay && <HowToPlayGuide onClose={() => setShowHowToPlay(false)} />}
      <div
      className="min-h-screen flex items-center justify-center p-8">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/30 p-12 max-w-4xl w-full text-center">
          <div className="mb-8">
            <pre className="text-primary text-xs font-mono leading-tight opacity-80">
              {matrixAscii}
            </pre>
          </div>
          <div className="mb-12">
            <h1 className="font-orbitron text-6xl md:text-8xl font-black mb-4 animate-quantum-pulse">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                QUANTUM
              </span>
            </h1>
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-secondary animate-neon-flicker">
              DETECTIVE
            </h2>
            <p className="text-xl text-muted-foreground mt-6 font-rajdhani">
              Solve murders across parallel realities
            </p>
          </div>
        <div className="space-y-6">
          <Button
            {...getItemProps(0)}
            onClick={() => {
              playSound('button');
              onNewGame();
            }}
            className="quantum-btn w-full text-xl py-6 font-orbitron font-semibold transition-all duration-200"
          >
            NEW INVESTIGATION
          </Button>
          {hasSavedGame && (
            <Button
              {...getItemProps(1)}
              onClick={() => {
                playSound('button');
                onLoadGame();
              }}
              variant="outline"
              className="w-full text-xl py-6 font-orbitron font-semibold border-secondary hover:border-secondary-glow hover:shadow-[0_0_20px_hsl(var(--secondary)/0.4)] transition-all duration-200"
            >
              CONTINUE CASE
            </Button>
          )}
          <Button
            {...getItemProps(hasSavedGame ? 2 : 1)}
            variant="outline"
            className="w-full text-xl py-6 font-orbitron font-semibold border-accent hover:border-accent-glow hover:shadow-[0_0_20px_hsl(var(--accent)/0.4)] opacity-60 cursor-not-allowed"
            disabled
            onClick={() => playSound('error')}
          >
            QUANTUM ARCHIVES
            <span className="ml-2 text-sm">(Coming Soon)</span>
          </Button>

          <Button
            {...getItemProps(hasSavedGame ? 3 : 2)}
            variant="outline"
            className="w-full text-xl py-6 font-orbitron font-semibold border-blue-400 hover:border-blue-400/80 hover:shadow-[0_0_20px_hsl(220,91%,60%,0.3)] transition-all duration-200"
            onClick={() => {
              playSound('button');
              setShowHowToPlay(true);
            }}
          >
            <HelpCircle className="mr-3 h-6 w-6" />
            HOW TO PLAY
          </Button>

          <Button
            {...getItemProps(hasSavedGame ? 4 : 3)}
            variant="outline"
            className="w-full text-xl py-6 font-orbitron font-semibold border-muted hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-200"
            onClick={() => {
              playSound('button');
              setShowSettings(true);
            }}
          >
            SETTINGS
          </Button>
        </div>
        <div className="mt-8 text-xs text-muted-foreground opacity-60 text-center">
          Use ↑↓ arrow keys to navigate • Enter to select • Esc to cancel
        </div>
        <div className="mt-12 text-sm text-muted-foreground font-rajdhani">
          <div className="typewriter">
            Reality is not what it seems...
          </div>
          <div className="mt-4 text-xs opacity-60">
            made with ❤️ by samar
          </div>
        </div>
        </Card>
      </div>
    </>
  );
};