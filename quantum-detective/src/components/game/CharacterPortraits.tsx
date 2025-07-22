import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Heart, Shield, Zap, MessageCircle } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  suspicionLevel: number;
  trustLevel: number;
  lastSeen: string;
  timeline: string;
  status: 'available' | 'busy' | 'suspicious' | 'cooperative';
  background: string;
  traits: string[];
}

interface CharacterPortraitsProps {
  characters: Character[];
  onInteract: (character: Character) => void;
  onViewProfile: (character: Character) => void;
  currentTimeline: string;
}

export const CharacterPortraits: React.FC<CharacterPortraitsProps> = ({
  characters,
  onInteract,
  onViewProfile,
  currentTimeline
}) => {
  const getStatusColor = (status: Character['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'suspicious': return 'bg-red-500';
      case 'cooperative': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Character['status']) => {
    switch (status) {
      case 'available': return <MessageCircle className="h-3 w-3" />;
      case 'busy': return <Zap className="h-3 w-3" />;
      case 'suspicious': return <Shield className="h-3 w-3" />;
      case 'cooperative': return <Heart className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSuspicionBadge = (level: number) => {
    if (level >= 80) return { text: 'High Risk', variant: 'destructive' as const };
    if (level >= 50) return { text: 'Suspicious', variant: 'secondary' as const };
    if (level >= 20) return { text: 'Person of Interest', variant: 'outline' as const };
    return { text: 'Clear', variant: 'default' as const };
  };

  const getTrustBadge = (level: number) => {
    if (level >= 80) return { text: 'Trusted', variant: 'default' as const };
    if (level >= 50) return { text: 'Reliable', variant: 'secondary' as const };
    return { text: 'Unverified', variant: 'outline' as const };
  };

  const filteredCharacters = characters.filter(char => 
    char.timeline === currentTimeline || char.timeline === 'all'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredCharacters.map((character) => (
        <Card key={character.id} className="p-4 hover:shadow-lg transition-all duration-200">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(character.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(character.status)} flex items-center justify-center`}>
                    <div className="text-white">
                      {getStatusIcon(character.status)}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{character.name}</h3>
                  <p className="text-xs text-muted-foreground">{character.role}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge {...getSuspicionBadge(character.suspicionLevel)} className="text-xs">
                {getSuspicionBadge(character.suspicionLevel).text}
              </Badge>
              <Badge {...getTrustBadge(character.trustLevel)} className="text-xs">
                {getTrustBadge(character.trustLevel).text}
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Suspicion</span>
                  <span>{character.suspicionLevel}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${character.suspicionLevel}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Trust</span>
                  <span>{character.trustLevel}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${character.trustLevel}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {character.traits.slice(0, 3).map((trait, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                  {trait}
                </Badge>
              ))}
              {character.traits.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{character.traits.length - 3}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Last seen: {character.lastSeen}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onInteract(character)}
                disabled={character.status === 'busy'}
                className="flex-1 text-xs"
              >
                {character.status === 'busy' ? 'Unavailable' : 'Interview'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewProfile(character)}
                className="px-3 text-xs"
              >
                Profile
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {filteredCharacters.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No characters available in this timeline
        </div>
      )}
    </div>
  );
};