import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Lock, Zap, Clock, Target } from 'lucide-react';
import { Timeline } from '../QuantumDetective';

interface ProgressTrackerProps {
  gameData: any;
  currentChapter: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  gameData, 
  currentChapter 
}) => {
  const timelines: Timeline[] = ['alpha', 'beta', 'gamma', 'delta'];
  const totalStoryPoints = Object.values(gameData.storyProgress || {}).reduce(
    (sum: number, progress: any) => sum + Number(progress || 0), 0
  );
  const maxStoryPoints = timelines.length * 5; 
  const storyProgress = maxStoryPoints > 0 ? (Number(totalStoryPoints) / maxStoryPoints) * 100 : 0;
  
  const evidenceProgress = Math.min((gameData.evidence?.length || 0) / 15 * 100, 100);
  const quantumProgress = ((100 - gameData.quantumEnergy) / 100) * 100; 
  
  const getTimelineStatus = (timeline: Timeline) => {
    const progress = Number(gameData.storyProgress?.[timeline] || 0);
    if (progress === 0) return 'locked';
    if (progress < 3) return 'active';
    if (progress >= 5) return 'completed';
    return 'in-progress';
  };

  const getTimelineIcon = (timeline: Timeline) => {
    const status = getTimelineStatus(timeline);
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress': return <Circle className="w-4 h-4 text-blue-400" />;
      case 'active': return <Target className="w-4 h-4 text-primary" />;
      case 'locked': return <Lock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTimelineColor = (timeline: Timeline) => {
    const status = getTimelineStatus(timeline);
    const isActive = gameData.currentTimeline === timeline;
    
    if (isActive) {
      return 'border-primary bg-primary/10 text-primary';
    }
    
    switch (status) {
      case 'completed': return 'border-green-400 bg-green-400/10 text-green-400';
      case 'in-progress': return 'border-blue-400 bg-blue-400/10 text-blue-400';
      case 'active': return 'border-primary bg-primary/10 text-primary';
      case 'locked': return 'border-muted bg-muted/10 text-muted-foreground';
    }
  };
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Chapter {currentChapter}: The Investigation</h3>
            <Badge variant="outline" className="text-primary border-primary">
              {Math.round(storyProgress)}% Complete
            </Badge>
          </div>
          <Progress value={storyProgress} className="h-2" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Timeline Exploration</h4>
          <div className="grid grid-cols-4 gap-2">
            {timelines.map(timeline => {
              const progress = Number(gameData.storyProgress?.[timeline] || 0);
              const maxProgress = 5;
              return (
                <div key={timeline} className="text-center">
                  <div className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                    getTimelineColor(timeline)
                  }`}>
                    <div className="flex items-center justify-center mb-1">
                      {getTimelineIcon(timeline)}
                    </div>
                    <div className="text-xs font-medium capitalize">
                      {timeline}
                    </div>
                    <div className="text-xs opacity-70">
                      {progress}/{maxProgress}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-medium">Evidence</div>
            <div className="text-xs text-muted-foreground">
              {gameData.evidence?.length || 0}/15
            </div>
            <Progress value={evidenceProgress} className="h-1 mt-1" />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-medium">Quantum Energy</div>
            <div className="text-xs text-muted-foreground">
              {gameData.quantumEnergy || 0}/100
            </div>
            <Progress 
              value={gameData.quantumEnergy || 0} 
              className="h-1 mt-1" 
            />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-sm font-medium">Investigation</div>
            <div className="text-xs text-muted-foreground">
              {Math.round(quantumProgress)}%
            </div>
            <Progress value={quantumProgress} className="h-1 mt-1" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Objectives</h4>
          <div className="space-y-1 text-xs">
            {storyProgress < 25 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Circle className="w-3 h-3" />
                <span>Examine the crime scene thoroughly</span>
              </div>
            )}
            {gameData.evidence?.length < 5 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Circle className="w-3 h-3" />
                <span>Collect more evidence ({gameData.evidence?.length || 0}/5)</span>
              </div>
            )}
            {Object.values(gameData.storyProgress || {}).filter((p: any) => Number(p) > 0).length < 2 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Circle className="w-3 h-3" />
                <span>Explore alternate timelines</span>
              </div>
            )}
            {storyProgress >= 75 && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Ready to confront the truth</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};