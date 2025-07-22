import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Play, Pause, RotateCcw, Clock, MapPin } from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: number; 
  description: string;
  location: { x: number; y: number };
  character: string;
  evidenceId?: string;
}

interface CrimeSceneReconstructionProps {
  events: TimelineEvent[];
  onClose: () => void;
  onReconstructionComplete: (insights: string[]) => void;
}

export const CrimeSceneReconstruction: React.FC<CrimeSceneReconstructionProps> = ({
  events,
  onClose,
  onReconstructionComplete
}) => {
  const [currentTime, setCurrentTime] = useState([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [discoveredInsights, setDiscoveredInsights] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const maxTime = Math.max(...events.map(e => e.time));
  const currentEvents = events.filter(e => e.time <= currentTime[0]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(() => {
        if (currentTime[0] < maxTime) {
          setCurrentTime([currentTime[0] + 0.5]);
        } else {
          setIsPlaying(false);
        }
      });
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, maxTime]);

  useEffect(() => {
    if (canvasRef.current) {
      drawScene();
    }
  }, [currentTime, selectedEvent]);

  useEffect(() => {
    analyzeTimeline();
  }, [currentTime]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 500, 300);
    
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(100, 100, 80, 40);
    ctx.fillRect(400, 80, 40, 100);
    ctx.fillRect(300, 250, 100, 60);
    const characterPaths: { [key: string]: { x: number; y: number; time: number }[] } = {};
    
    currentEvents.forEach(event => {
      if (!characterPaths[event.character]) {
        characterPaths[event.character] = [];
      }
      characterPaths[event.character].push({
        x: event.location.x,
        y: event.location.y,
        time: event.time
      });
    });
    Object.entries(characterPaths).forEach(([character, path], index) => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 3;
      
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
      if (path.length > 0) {
        const lastPosition = path[path.length - 1];
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.arc(lastPosition.x, lastPosition.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(character, lastPosition.x + 10, lastPosition.y + 5);
      }
    });
    if (selectedEvent) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(selectedEvent.location.x, selectedEvent.location.y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }
    currentEvents.filter(e => e.evidenceId).forEach(event => {
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(event.location.x, event.location.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const analyzeTimeline = () => {
    const newInsights: string[] = [];
    
    const charactersAtTime = currentEvents
      .filter(e => Math.abs(e.time - currentTime[0]) < 2)
      .map(e => e.character);
    
    const uniqueCharacters = [...new Set(charactersAtTime)];
    if (uniqueCharacters.length > 1) {
      newInsights.push(`Multiple suspects present at ${Math.round(currentTime[0])} minutes`);
    }
    const evidenceEvents = currentEvents.filter(e => e.evidenceId);
    if (evidenceEvents.length > 0) {
      newInsights.push('Evidence interaction detected');
    }

    const recentEvents = currentEvents.filter(e => currentTime[0] - e.time < 5);
    if (recentEvents.length > 3) {
      newInsights.push('High activity period - potential critical moment');
    }

    newInsights.forEach(insight => {
      if (!discoveredInsights.includes(insight)) {
        setDiscoveredInsights(prev => [...prev, insight]);
      }
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const resetReconstruction = () => {
    setCurrentTime([0]);
    setIsPlaying(false);
    setSelectedEvent(null);
  };

  const completeReconstruction = () => {
    onReconstructionComplete(discoveredInsights);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl h-[90vh] bg-card border border-primary/30 flex flex-col">
        <div className="p-4 border-b border-primary/30 flex items-center justify-between">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-primary">
              Crime Scene Reconstruction
            </h2>
            <p className="text-muted-foreground">3D Timeline Visualization</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 flex">
          <div className="w-80 p-4 border-r border-primary/30 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron text-lg font-semibold text-secondary">
                  Timeline Control
                </h3>
                <Badge variant="outline">
                  {formatTime(currentTime[0])}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Time: {formatTime(currentTime[0])}</span>
                </div>
                <Slider
                  value={currentTime}
                  onValueChange={setCurrentTime}
                  max={maxTime}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(0)}</span>
                  <span>{formatTime(maxTime)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline" size="sm" onClick={resetReconstruction}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-accent">Active Events</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {currentEvents.map((event) => (
                  <Button
                    key={event.id}
                    variant={selectedEvent?.id === event.id ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start text-xs h-auto p-2"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{formatTime(event.time)}</div>
                      <div className="text-muted-foreground">{event.character}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            {discoveredInsights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-accent">Insights</h4>
                <div className="space-y-1">
                  {discoveredInsights.map((insight, index) => (
                    <Badge key={index} variant="outline" className="text-xs w-full justify-start">
                      {insight}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="h-full border border-primary/30 rounded-lg bg-muted/10 flex flex-col">
              <div className="p-2 border-b border-primary/30 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Crime Scene Layout</span>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border rounded max-w-full max-h-full"
                />
              </div>

              {selectedEvent && (
                <div className="p-3 border-t border-primary/30 bg-card/50">
                  <h5 className="font-semibold text-sm mb-1">
                    {formatTime(selectedEvent.time)} - {selectedEvent.character}
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-primary/30 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close Reconstruction
          </Button>
          <Button 
            onClick={completeReconstruction}
            disabled={discoveredInsights.length === 0}
            className="bg-accent hover:bg-accent/80"
          >
            Apply Insights ({discoveredInsights.length})
          </Button>
        </div>
      </Card>
    </div>
  );
};