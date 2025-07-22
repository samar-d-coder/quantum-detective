import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Volume2, VolumeX, Zap, Eye } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [volume, setVolume] = useState([50]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quantumEffects, setQuantumEffects] = useState(true);
  const [typewriterSpeed, setTypewriterSpeed] = useState([30]);
  const [showHints, setShowHints] = useState(false);

  const asciiArt = `
    ⚙️ QUANTUM SETTINGS ⚙️
    ╔═══════════════════════╗
    ║  [ CONFIGURE MATRIX ] ║
    ║  Reality: Adjustable  ║
    ║  Status: Operational  ║
    ╚═══════════════════════╝
  `;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-card/90 backdrop-blur-md border-primary/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <pre className="text-primary text-xs font-mono leading-tight mb-4">
              {asciiArt}
            </pre>
            <h2 className="font-orbitron text-2xl font-bold text-primary">
              Quantum Configuration
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-6">
          <Card className="p-4 bg-card/50 border-secondary/30">
            <h3 className="font-orbitron text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio Matrix
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Sound Effects</span>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Master Volume</span>
                  <Badge variant="outline" className="text-accent">
                    {volume[0]}%
                  </Badge>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={!soundEnabled}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-accent/30">
            <h3 className="font-orbitron text-lg font-semibold text-accent mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visual Reality
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Quantum Effects</span>
                <Switch
                  checked={quantumEffects}
                  onCheckedChange={setQuantumEffects}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Typewriter Speed</span>
                  <Badge variant="outline" className="text-primary">
                    {typewriterSpeed[0]}ms
                  </Badge>
                </div>
                <Slider
                  value={typewriterSpeed}
                  onValueChange={setTypewriterSpeed}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-quantum-gamma/30">
            <h3 className="font-orbitron text-lg font-semibold text-quantum-gamma mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Detective Assistance
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Show Investigation Hints</span>
                <Switch
                  checked={showHints}
                  onCheckedChange={setShowHints}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Enable hints to get subtle guidance when investigating clues across timelines.
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-quantum-beta/30">
            <h3 className="font-orbitron text-lg font-semibold text-quantum-beta mb-4">
              Investigation Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-muted-foreground">Cases Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">0</div>
                <div className="text-muted-foreground">Quantum Jumps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-muted-foreground">Evidence Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-delta">0</div>
                <div className="text-muted-foreground">Timelines Explored</div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              className="quantum-btn flex-1"
              onClick={() => {
                onClose();
              }}
            >
              Apply Configuration
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-destructive hover:border-destructive text-destructive"
              onClick={() => {
                setVolume([50]);
                setSoundEnabled(true);
                setQuantumEffects(true);
                setTypewriterSpeed([30]);
                setShowHints(false);
              }}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};