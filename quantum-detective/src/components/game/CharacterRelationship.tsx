import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Users, Heart, Sword, Eye, HelpCircle } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  relationship: string;
  suspicion: number;
  timeline?: string;
}

interface Relationship {
  from: string;
  to: string;
  type: 'friend' | 'enemy' | 'suspect' | 'witness' | 'victim' | 'unknown';
  strength: number;
  timeline: string;
}

interface CharacterRelationshipProps {
  characters: Character[];
  onClose: () => void;
}

export const CharacterRelationship: React.FC<CharacterRelationshipProps> = ({
  characters,
  onClose
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const networkAscii = `
    ╔══════════════════════════════════════╗
    ║        RELATIONSHIP MATRIX           ║
    ║  🕸️  QUANTUM SOCIAL NETWORK 🕸️      ║
    ║  ┌────────────────────────────────┐  ║
    ║  │    👤────❤️────👤────⚔️────👤   │  ║
    ║  │     │         │         │     │  ║
    ║  │    👁️────❓────👤────🔍────👤   │  ║
    ║  │     │         │         │     │  ║
    ║  │    👤────⚖️────💀────💰────👤   │  ║
    ║  └────────────────────────────────┘  ║
    ║   STATUS: MAPPING CONNECTIONS...     ║
    ╚══════════════════════════════════════╝
  `;
  const generateRelationships = (): Relationship[] => {
    const relationships: Relationship[] = [];
    characters.forEach(char => {
      if (char.name.includes('Vrain')) {
        relationships.push({
          from: char.id,
          to: 'all',
          type: 'victim',
          strength: 100,
          timeline: char.timeline || 'alpha'
        });
      }
      
      if (char.suspicion > 70) {
        relationships.push({
          from: char.id,
          to: 'detective',
          type: 'suspect',
          strength: char.suspicion,
          timeline: char.timeline || 'alpha'
        });
      } else if (char.suspicion > 40) {
        relationships.push({
          from: char.id,
          to: 'detective',
          type: 'witness',
          strength: char.suspicion,
          timeline: char.timeline || 'alpha'
        });
      } else {
        relationships.push({
          from: char.id,
          to: 'detective',
          type: 'friend',
          strength: 100 - char.suspicion,
          timeline: char.timeline || 'alpha'
        });
      }
    });

    return relationships;
  };

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'friend': return <Heart className="w-4 h-4 text-green-500" />;
      case 'enemy': return <Sword className="w-4 h-4 text-red-500" />;
      case 'suspect': return <Eye className="w-4 h-4 text-orange-500" />;
      case 'witness': return <Users className="w-4 h-4 text-blue-500" />;
      case 'victim': return <X className="w-4 h-4 text-purple-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'friend': return 'border-green-500 text-green-500';
      case 'enemy': return 'border-red-500 text-red-500';
      case 'suspect': return 'border-orange-500 text-orange-500';
      case 'witness': return 'border-blue-500 text-blue-500';
      case 'victim': return 'border-purple-500 text-purple-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  const relationships = generateRelationships();
  const selectedChar = characters.find(c => c.id === selectedCharacter);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-card/90 backdrop-blur-sm border-primary/50 p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-quantum-gamma animate-quantum-pulse" />
            <h3 className="font-orbitron text-xl font-bold text-primary">
              Relationship Web Analysis
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
            {networkAscii}
          </pre>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-orbitron text-lg font-semibold text-secondary mb-3">
              Characters ({characters.length})
            </h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {characters.map((character) => (
                <Card
                  key={character.id}
                  className={`p-3 cursor-pointer transition-all border ${
                    selectedCharacter === character.id
                      ? 'border-accent bg-accent/20'
                      : 'border-muted/30 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedCharacter(character.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-sm">{character.name}</h5>
                    {character.timeline && (
                      <Badge variant="outline" className="text-xs">
                        {character.timeline.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {character.relationship}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Suspicion</span>
                      <span className={`font-semibold ${
                        character.suspicion > 70 ? 'text-red-500' :
                        character.suspicion > 40 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {character.suspicion}%
                      </span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          character.suspicion > 70 ? 'bg-red-500' :
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
          </div>
          <div className="md:col-span-2">
            <h4 className="font-orbitron text-lg font-semibold text-secondary mb-3">
              {selectedChar ? `${selectedChar.name} - Connections` : 'Select a Character'}
            </h4>
            
            {selectedChar ? (
              <div className="space-y-4">
                <Card className="p-4 bg-accent/10 border-accent/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-lg text-accent">{selectedChar.name}</h5>
                      <p className="text-sm text-muted-foreground">{selectedChar.relationship}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        selectedChar.suspicion > 70 ? 'border-red-500 text-red-500' :
                        selectedChar.suspicion > 40 ? 'border-yellow-500 text-yellow-500' :
                        'border-green-500 text-green-500'
                      }`}
                    >
                      {selectedChar.suspicion}% Suspect
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trust Level:</span>
                      <div className="text-foreground font-semibold">
                        {selectedChar.suspicion < 30 ? 'High Trust' :
                         selectedChar.suspicion < 60 ? 'Moderate Trust' :
                         'Low Trust'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cooperation:</span>
                      <div className="text-foreground font-semibold">
                        {selectedChar.suspicion < 40 ? 'Willing' :
                         selectedChar.suspicion < 70 ? 'Cautious' :
                         'Resistant'}
                      </div>
                    </div>
                  </div>
                </Card>

                <div>
                  <h5 className="font-semibold text-foreground mb-3">Known Relationships:</h5>
                  <div className="space-y-2">
                    {relationships
                      .filter(rel => rel.from === selectedChar.id)
                      .map((rel, index) => (
                        <Card key={index} className="p-3 bg-card/50 border-muted/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getRelationshipIcon(rel.type)}
                              <div>
                                <div className="font-semibold text-sm capitalize">
                                  {rel.type} {rel.to === 'detective' ? '(You)' : rel.to === 'all' ? '' : `- ${rel.to}`}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Strength: {rel.strength}% | Timeline: {rel.timeline.toUpperCase()}
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getRelationshipColor(rel.type)}`}
                            >
                              {rel.type.toUpperCase()}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
                <Card className="p-4 bg-quantum-gamma/10 border-quantum-gamma/30">
                  <h5 className="font-semibold text-quantum-gamma mb-2">Cross-Timeline Analysis:</h5>
                  <p className="text-sm text-muted-foreground">
                    This character's role and relationships may vary across different quantum realities. 
                    Pay attention to how their behavior and motivations change between timelines.
                  </p>
                </Card>
              </div>
            ) : (
              <Card className="p-8 bg-muted/20 border-muted/30">
                <div className="text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a character to view their relationships and psychological profile.</p>
                  <p className="text-sm mt-2">
                    Understanding character dynamics is crucial for solving quantum mysteries.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Relationships change across timelines - the same person might be friend or foe in different realities
          </p>
        </div>
      </Card>
    </div>
  );
};