import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Zap, Lightbulb } from 'lucide-react';

interface Evidence {
  id: string;
  name: string;
  description: string;
  timeline?: string;
}

interface EvidenceCombinationProps {
  evidence: Evidence[];
  onCombine: (combinedEvidence: any) => void;
  onClose: () => void;
}

const combinationRules = [
  {
    ids: ['lipstick_cup_alpha', 'family_photo_beta'],
    result: {
      id: 'cross_timeline_connection',
      name: 'Cross-Timeline Connection',
      description: 'The lipstick on the cup matches the missing daughter in the family photo - same person across realities!'
    }
  },
  {
    ids: ['financial_records_alpha', 'encrypted_message_gamma'],
    result: {
      id: 'money_trail_connection',
      name: 'Money Trail Evidence',
      description: 'The financial records show transfers to accounts mentioned in the encrypted syndicate messages.'
    }
  },
  {
    ids: ['quantum_signature_delta', 'morrison_badge_delta'],
    result: {
      id: 'quantum_killer_proof',
      name: 'Quantum Killer Identity',
      description: 'The quantum signatures match Detective Morrison\'s equipment - he\'s the interdimensional killer!'
    }
  }
];

export const EvidenceCombination: React.FC<EvidenceCombinationProps> = ({
  evidence,
  onCombine,
  onClose
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [combinationResult, setCombinationResult] = useState<any>(null);

  const labAscii = `
    ╔══════════════════════════════════╗
    ║      QUANTUM EVIDENCE LAB        ║
    ║  🧪 CROSS-REFERENCE MATRIX 🧪    ║
    ║  ┌────────────────────────────┐  ║
    ║  │ [SLOT-1] ← DROP EVIDENCE   │  ║
    ║  │ [SLOT-2] ← DROP EVIDENCE   │  ║
    ║  │              +             │  ║
    ║  │     [SYNTHESIS BEAM]       │  ║
    ║  │              ↓             │  ║
    ║  │ [RESULT] ← NEW INSIGHT     │  ║
    ║  └────────────────────────────┘  ║
    ║   STATUS: READY FOR ANALYSIS     ║
    ╚══════════════════════════════════╝
  `;

  const toggleEvidence = (evidenceId: string) => {
    setSelectedEvidence(prev => {
      if (prev.includes(evidenceId)) {
        return prev.filter(id => id !== evidenceId);
      } else if (prev.length < 2) {
        return [...prev, evidenceId];
      } else {
        return [prev[1], evidenceId]; 
      }
    });
    setCombinationResult(null);
  };

  const attemptCombination = () => {
    if (selectedEvidence.length !== 2) return;

    const rule = combinationRules.find(rule => 
      rule.ids.every(id => selectedEvidence.includes(id))
    );

    if (rule) {
      setCombinationResult(rule.result);
    } else {
      setCombinationResult({
        id: 'no_connection',
        name: 'No Connection Found',
        description: 'These pieces of evidence don\'t seem to be directly related in any meaningful way.'
      });
    }
  };

  const confirmCombination = () => {
    if (combinationResult && combinationResult.id !== 'no_connection') {
      onCombine(combinationResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-card/90 backdrop-blur-sm border-primary/50 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-quantum-gamma animate-quantum-pulse" />
            <h3 className="font-orbitron text-xl font-bold text-primary">
              Evidence Synthesis Lab
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
            {labAscii}
          </pre>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-orbitron text-lg font-semibold text-secondary mb-3">
              Available Evidence ({evidence.length})
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {evidence.map((item) => (
                <Card
                  key={item.id}
                  className={`p-3 cursor-pointer transition-all border ${
                    selectedEvidence.includes(item.id)
                      ? 'border-accent bg-accent/20'
                      : 'border-muted/30 hover:border-primary/50'
                  }`}
                  onClick={() => toggleEvidence(item.id)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-semibold text-sm">{item.name}</h5>
                    {item.timeline && (
                      <Badge variant="outline" className="text-xs">
                        {item.timeline.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-lg font-semibold text-secondary mb-3">
              Synthesis Chamber
            </h4>
            <div className="space-y-3 mb-4">
              {[0, 1].map((slotIndex) => (
                <div
                  key={slotIndex}
                  className="p-4 border-2 border-dashed border-muted/30 rounded-lg min-h-[80px] flex items-center justify-center"
                >
                  {selectedEvidence[slotIndex] ? (
                    <div className="text-center">
                      <div className="text-sm font-semibold text-accent">
                        {evidence.find(e => e.id === selectedEvidence[slotIndex])?.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Slot {slotIndex + 1}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <div className="text-sm">Empty Slot {slotIndex + 1}</div>
                      <div className="text-xs">Click evidence to add</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={attemptCombination}
              disabled={selectedEvidence.length !== 2}
              className="w-full quantum-btn mb-4"
            >
              <Zap className="w-4 h-4 mr-2" />
              Synthesize Evidence
            </Button>
            {combinationResult && (
              <Card className={`p-4 ${
                combinationResult.id === 'no_connection' 
                  ? 'bg-muted/20 border-muted/30' 
                  : 'bg-green-500/20 border-green-500/50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    combinationResult.id === 'no_connection' 
                      ? 'bg-muted' 
                      : 'bg-green-500 animate-quantum-pulse'
                  }`}></div>
                  <h5 className={`font-semibold ${
                    combinationResult.id === 'no_connection' 
                      ? 'text-muted-foreground' 
                      : 'text-green-400'
                  }`}>
                    {combinationResult.name}
                  </h5>
                </div>
                <p className="text-sm text-foreground mb-3">
                  {combinationResult.description}
                </p>
                
                {combinationResult.id !== 'no_connection' && (
                  <Button
                    onClick={confirmCombination}
                    className="w-full"
                    variant="outline"
                  >
                    Add to Evidence Collection
                  </Button>
                )}
              </Card>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Try combining evidence from different timelines to discover hidden connections
          </p>
        </div>
      </Card>
    </div>
  );
};