import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Save, RotateCcw } from 'lucide-react';
import { GameData } from '../QuantumDetective';
import { useGameStorage } from '@/hooks/useGameStorage';

interface AutoSaveManagerProps {
  gameData: GameData;
  onLoad: (data: GameData) => void;
}

export const AutoSaveManager: React.FC<AutoSaveManagerProps> = ({
  gameData,
  onLoad
}) => {
  const { saveGame, saveSlots, settings } = useGameStorage();
  const [lastAutoSave, setLastAutoSave] = useState<number | null>(null);
  const [showRecap, setShowRecap] = useState(false);
  useEffect(() => {
    if (!settings.autoSave) return;

    const interval = setInterval(() => {
      const success = saveGame(gameData, 0);
      if (success) {
        setLastAutoSave(Date.now());
      }
    }, 120000); 
    return () => clearInterval(interval);
  }, [gameData, settings.autoSave, saveGame]);

  useEffect(() => {
    const significantEvents = [
      gameData.evidence.length,
      gameData.currentChapter,
      gameData.achievements.length,
      gameData.currentTimeline
    ];

    if (settings.autoSave && significantEvents.some(value => typeof value === 'number' && value > 0)) {
      const success = saveGame(gameData, 0);
      if (success) {
        setLastAutoSave(Date.now());
      }
    }
  }, [gameData.evidence.length, gameData.currentChapter, gameData.achievements.length, gameData.currentTimeline, settings.autoSave, saveGame]);

  const getGameSummary = (data: GameData) => {
    const timelineProgress = Object.values(data.storyProgress).reduce((a, b) => a + b, 0);
    const totalEvidence = data.evidence.length;
    const achievements = data.achievements.length;
    
    return {
      timelineProgress,
      totalEvidence,
      achievements,
      currentTimeline: data.currentTimeline,
      chapter: data.currentChapter,
      playTime: data.startTime ? Math.floor((Date.now() - data.startTime) / 60000) : 0
    };
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineColor = (timeline: string) => {
    const colors = {
      alpha: 'bg-blue-500',
      beta: 'bg-green-500',
      gamma: 'bg-purple-500',
      delta: 'bg-orange-500'
    };
    return colors[timeline as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      {settings.autoSave && lastAutoSave && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Save className="h-4 w-4 text-green-500" />
          <span>Auto-saved {formatTime(lastAutoSave)}</span>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowRecap(!showRecap)}
        className="w-full"
      >
        {showRecap ? 'Hide' : 'Show'} Story Recap
      </Button>

      {showRecap && (
        <Card className="p-4 bg-card/80 backdrop-blur-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Case Summary
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Chapter</div>
                <div className="font-medium">{gameData.currentChapter}: The Crime Scene</div>
              </div>
              <div>
                <div className="text-muted-foreground">Timeline</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getTimelineColor(gameData.currentTimeline)}`} />
                  <span className="font-medium capitalize">{gameData.currentTimeline}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-2">Evidence Collected</div>
              <div className="flex flex-wrap gap-1">
                {gameData.evidence.slice(0, 6).map((evidence, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {evidence.name}
                  </Badge>
                ))}
                {gameData.evidence.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{gameData.evidence.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-2">Timeline Progress</div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(['alpha', 'beta', 'gamma', 'delta'] as const).map(timeline => (
                  <div key={timeline} className="text-center">
                    <div className={`w-full h-2 rounded ${getTimelineColor(timeline)} opacity-20`}>
                      <div 
                        className={`h-full rounded ${getTimelineColor(timeline)}`}
                        style={{ width: `${Math.min(100, (gameData.storyProgress[timeline] / 10) * 100)}%` }}
                      />
                    </div>
                    <div className="mt-1 capitalize">{timeline}</div>
                  </div>
                ))}
              </div>
            </div>
            {gameData.startTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {Math.floor((Date.now() - gameData.startTime) / 60000)} minutes played
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Recent Saves</h4>
        {saveSlots.map((slot, index) => {
          if (!slot) return null;
          
          const summary = getGameSummary(slot);
          const timestamp = (slot as any).timestamp;
          
          return (
            <Card 
              key={index} 
              className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onLoad(slot)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    Chapter {summary.chapter}
                    <Badge 
                      variant="outline" 
                      className={`ml-2 ${getTimelineColor(summary.currentTimeline)} text-white border-0`}
                    >
                      {summary.currentTimeline}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {summary.totalEvidence} evidence • {summary.achievements} achievements
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {timestamp ? formatTime(timestamp) : 'Unknown'}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};