import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Zap } from 'lucide-react';

interface AdventureChallenge {
  task: string;
  description: string;
  type: 'hacking' | 'decryption' | 'timeline' | 'confrontation';
  puzzle: string;
  solution: string;
  reward: string;
}

interface AdventureChallengeProps {
  challenge: AdventureChallenge;
  onComplete: (reward: string) => void;
  onClose: () => void;
}

export const AdventureChallengeComponent: React.FC<AdventureChallengeProps> = ({
  challenge,
  onComplete,
  onClose
}) => {
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const hackingAscii = `
    ╔════════════════════════════════╗
    ║        HACKING INTERFACE       ║
    ║  ┌──────────────────────────┐  ║
    ║  │ >_ SYSTEM ACCESS DENIED  │  ║
    ║  │ >_ ATTEMPTING BYPASS...  │  ║
    ║  │ >_ [████████████] 87%    │  ║
    ║  │ >_ ENTER DECRYPTION KEY  │  ║
    ║  └──────────────────────────┘  ║
    ║   STATUS: [LOCKED] 🔒         ║
    ╚════════════════════════════════╝
  `;

  const decryptionAscii = `
    ╔════════════════════════════════╗
    ║      QUANTUM DECRYPTION        ║
    ║  ⚛️  CIPHER MATRIX ACTIVE ⚛️   ║
    ║  ┌──────────────────────────┐  ║
    ║  │ ENCRYPTED: [${challenge.puzzle.slice(0, 20)}...] │  ║
    ║  │ ALGORITHM: CAESAR SHIFT   │  ║
    ║  │ KEY SPACE: 26 POSITIONS   │  ║
    ║  └──────────────────────────┘  ║
    ║   PROGRESS: [░░░░░░░░] 0%      ║
    ╚════════════════════════════════╝
  `;

  const timelineAscii = `
    ╔════════════════════════════════╗
    ║      TEMPORAL ANALYSIS         ║
    ║  🌀 QUANTUM PARADOX DETECTED   ║
    ║  ┌──────────────────────────┐  ║
    ║  │ TIMELINE-A: 5:00 PM EXIT │  ║
    ║  │ TIMELINE-B: 6:00 PM TOD  │  ║
    ║  │ TIMELINE-C: 6:30 PM ALIBI│  ║
    ║  │ PARADOX: IMPOSSIBLE TIME │  ║
    ║  └──────────────────────────┘  ║
    ║   SOLUTION: [?????] ❓        ║
    ╚════════════════════════════════╝
  `;

  const confrontationAscii = `
    ╔════════════════════════════════╗
    ║        FINAL CHOICE            ║
    ║  ⚖️  THE MOMENT OF TRUTH ⚖️    ║
    ║  ┌──────────────────────────┐  ║
    ║  │ Three paths diverge:     │  ║
    ║  │ [FORCE] - Direct Action  │  ║
    ║  │ [DECEPTION] - Misdirect  │  ║
    ║  │ [TRUTH] - Honest Reveal  │  ║
    ║  └──────────────────────────┘  ║
    ║   CHOOSE WISELY... 🎯         ║
    ╚════════════════════════════════╝
  `;

  const getAsciiArt = () => {
    switch (challenge.type) {
      case 'hacking': return hackingAscii;
      case 'decryption': return decryptionAscii;
      case 'timeline': return timelineAscii;
      case 'confrontation': return confrontationAscii;
      default: return hackingAscii;
    }
  };

  const getHint = () => {
    switch (challenge.type) {
      case 'hacking':
        return "💡 Binary codes often spell words when converted to ASCII";
      case 'decryption':
        return "💡 Try shifting each letter by 13 positions in the alphabet";
      case 'timeline':
        return "💡 What if there were two people who looked identical?";
      case 'confrontation':
        return "💡 Honesty often reveals more than deception in investigations";
      default:
        return "💡 Think about the context of the story so far";
    }
  };

  const handleSubmit = () => {
    if (userInput.toUpperCase() === challenge.solution.toUpperCase()) {
      setCompleted(true);
      setTimeout(() => {
        onComplete(challenge.reward);
      }, 1500);
    } else {
      setAttempts(prev => prev + 1);
      setUserInput('');
      if (attempts >= 1) {
        setShowHint(true);
      }
    }
  };

  useEffect(() => {
    if (attempts >= 2) {
      setShowHint(true);
    }
  }, [attempts]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-card/90 backdrop-blur-sm border-primary/50 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-quantum-gamma animate-quantum-pulse" />
            <h3 className="font-orbitron text-xl font-bold text-primary">
              {challenge.task}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="mb-6">
          <pre className="text-accent text-xs font-mono leading-tight text-center opacity-80">
            {getAsciiArt()}
          </pre>
        </div>

        {completed ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-500">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold text-lg">CHALLENGE COMPLETED!</span>
            </div>
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-400 font-semibold">🎉 {challenge.reward}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-foreground mb-2">{challenge.description}</p>
              <div className="p-3 bg-muted/20 border border-muted/30 rounded font-mono text-sm">
                {challenge.puzzle}
              </div>
            </div>

            {showHint && (
              <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-400 text-sm">{getHint()}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Your Solution:
                </label>
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter your answer..."
                  className="font-mono"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Attempts: {attempts}/3
                  </Badge>
                  {attempts > 0 && (
                    <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">
                      Try Again
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={handleSubmit}
                  className="quantum-btn"
                  disabled={!userInput.trim()}
                >
                  Submit Solution
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Reward: {challenge.reward}
          </p>
        </div>
      </Card>
    </div>
  );
};