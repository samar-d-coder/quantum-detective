import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Zap, Users } from 'lucide-react';
import { EvidenceCombination } from './EvidenceCombination';
import { CharacterRelationship } from './CharacterRelationship';

interface Evidence {
  id: string;
  name: string;
  description: string;
  timeline?: string;
}

interface Character {
  id: string;
  name: string;
  relationship: string;
  suspicion: number;
}

interface EvidencePanelProps {
  evidence: Evidence[];
  characters: Character[];
  onClose: () => void;
  onEvidenceAdd?: (evidence: Evidence) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  characters,
  onClose,
  onEvidenceAdd
}) => {
  const [showCombination, setShowCombination] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);
  const fileSystemAscii = `
    ╔═══ EVIDENCE MATRIX ═══╗
    ║ ┌─────────────────────┐ ║
    ║ │ FILE_001.dat [▓▓▓▓] │ ║
    ║ │ FILE_002.dat [▓▓▓▓] │ ║
    ║ │ FILE_003.dat [▓▓▓▓] │ ║
    ║ └─────────────────────┘ ║
    ║   QUANTUM ENCRYPTED     ║
    ╚═══════════════════════╝
  `;

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <pre className="text-accent text-xs font-mono leading-tight mb-2">
          {fileSystemAscii}
        </pre>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-orbitron text-xl font-bold text-primary">
          Case Files
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-destructive/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setShowCombination(true)}
          disabled={evidence.length < 2}
          className="flex-1 text-sm"
          variant="outline"
        >
          <Zap className="w-4 h-4 mr-1" />
          Combine Evidence
        </Button>
        <Button
          onClick={() => setShowRelationships(true)}
          disabled={characters.length === 0}
          className="flex-1 text-sm"
          variant="outline"
        >
          <Users className="w-4 h-4 mr-1" />
          Relationships
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <h4 className="font-orbitron text-lg font-semibold text-secondary mb-3">
            Evidence ({evidence.length})
          </h4>
          
          {evidence.length === 0 ? (
            <Card className="p-4 bg-muted/20 border-muted/30">
              <p className="text-muted-foreground text-sm text-center">
                No evidence collected yet.
                <br />
                Explore the story to find clues.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {evidence.map((item) => (
                <Card key={item.id} className="p-4 bg-card/50 border-accent/30 hover:border-accent/50 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-accent">{item.name}</h5>
                    {item.timeline && (
                      <Badge variant="outline" className="text-xs">
                        {item.timeline.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-orbitron text-lg font-semibold text-secondary mb-3">
            Persons of Interest ({characters.length})
          </h4>
          
          {characters.length === 0 ? (
            <Card className="p-4 bg-muted/20 border-muted/30">
              <p className="text-muted-foreground text-sm text-center">
                No persons of interest identified.
                <br />
                Continue investigating to meet suspects.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {characters.map((character) => (
                <Card key={character.id} className="p-4 bg-card/50 border-secondary/30 hover:border-secondary/50 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-secondary">{character.name}</h5>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        character.suspicion > 70 ? 'border-destructive text-destructive' :
                        character.suspicion > 40 ? 'border-yellow-500 text-yellow-500' :
                        'border-green-500 text-green-500'
                      }`}
                    >
                      {character.suspicion}% Suspect
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{character.relationship}</p>
                  <div className="mt-3">
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          character.suspicion > 70 ? 'bg-destructive' :
                          character.suspicion > 40 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${character.suspicion}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        {evidence.length > 1 && (
          <div>
            <h4 className="font-orbitron text-lg font-semibold text-accent mb-3">
              Timeline Analysis
            </h4>
            <Card className="p-4 bg-accent/10 border-accent/30">
              <p className="text-sm text-accent font-medium mb-2">Quantum Insights:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Evidence patterns detected across {evidence.length} realities</li>
                <li>• Cross-reference potential identified</li>
                <li>• Quantum resonance: {Math.min(evidence.length * 15, 100)}%</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
      {showCombination && (
        <EvidenceCombination
          evidence={evidence}
          onCombine={(combinedEvidence) => {
            if (onEvidenceAdd) {
              onEvidenceAdd(combinedEvidence);
            }
            setShowCombination(false);
          }}
          onClose={() => setShowCombination(false)}
        />
      )}
      {showRelationships && (
        <CharacterRelationship
          characters={characters}
          onClose={() => setShowRelationships(false)}
        />
      )}
    </div>
  );
};