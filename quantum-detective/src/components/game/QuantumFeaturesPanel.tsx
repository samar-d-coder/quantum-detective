import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '../QuantumDetective';
import { 
  Zap, 
  GitBranch, 
  Cloud, 
  Split, 
  Eye,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

interface QuantumEvent {
  id: string;
  type: 'echo' | 'entanglement' | 'corruption' | 'split';
  description: string;
  timeline: Timeline;
  intensity: number;
  timestamp: number;
}

interface QuantumFeaturesPanelProps {
  currentTimeline: Timeline;
  quantumEnergy: number;
  onTimelineChange: (timeline: Timeline) => void;
  onQuantumEventTriggered: (event: QuantumEvent) => void;
  className?: string;
}

export const QuantumFeaturesPanel: React.FC<QuantumFeaturesPanelProps> = ({
  currentTimeline,
  quantumEnergy,
  onTimelineChange,
  onQuantumEventTriggered,
  className = ""
}) => {
  const [activeEvents, setActiveEvents] = useState<QuantumEvent[]>([]);
  const [entanglementStrength, setEntanglementStrength] = useState(0);
  const [corruptionLevel, setCorruptionLevel] = useState(0);
  const [parallelMode, setParallelMode] = useState(false);
  const [echoIntensity, setEchoIntensity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomQuantumEvents();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTimeline, quantumEnergy]);

  const generateRandomQuantumEvents = () => {
    if (Math.random() < 0.3) {
      const eventTypes: QuantumEvent['type'][] = ['echo', 'entanglement', 'corruption'];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const event: QuantumEvent = {
        id: `quantum-${Date.now()}`,
        type: randomType,
        description: getEventDescription(randomType),
        timeline: currentTimeline,
        intensity: Math.random() * 100,
        timestamp: Date.now()
      };

      setActiveEvents(prev => [...prev.slice(-2), event]);
      onQuantumEventTriggered(event);
      updateQuantumStates(event);
    }
  };

  const getEventDescription = (type: QuantumEvent['type']): string => {
    switch (type) {
      case 'echo':
        return 'Temporal echo detected - glimpse of alternate reality';
      case 'entanglement':
        return 'Quantum entanglement activated - timelines affecting each other';
      case 'corruption':
        return 'Quantum storm detected - evidence may be scrambled';
      case 'split':
        return 'Timeline bifurcation - new possibilities emerging';
      default:
        return 'Unknown quantum phenomenon';
    }
  };

  const updateQuantumStates = (event: QuantumEvent) => {
    switch (event.type) {
      case 'echo':
        setEchoIntensity(prev => Math.min(100, prev + event.intensity * 0.3));
        break;
      case 'entanglement':
        setEntanglementStrength(prev => Math.min(100, prev + event.intensity * 0.5));
        break;
      case 'corruption':
        setCorruptionLevel(prev => Math.min(100, prev + event.intensity * 0.4));
        break;
    }
  };

  const triggerTemporalEcho = () => {
    if (quantumEnergy >= 30) {
      const echo: QuantumEvent = {
        id: `echo-${Date.now()}`,
        type: 'echo',
        description: 'Manually triggered temporal echo',
        timeline: currentTimeline,
        intensity: 80,
        timestamp: Date.now()
      };
      
      setActiveEvents(prev => [...prev.slice(-2), echo]);
      onQuantumEventTriggered(echo);
      setEchoIntensity(80);
    }
  };

  const activateQuantumEntanglement = () => {
    if (quantumEnergy >= 50) {
      const entanglement: QuantumEvent = {
        id: `entangle-${Date.now()}`,
        type: 'entanglement',
        description: 'Quantum entanglement chains activated',
        timeline: currentTimeline,
        intensity: 90,
        timestamp: Date.now()
      };
      
      setActiveEvents(prev => [...prev.slice(-2), entanglement]);
      onQuantumEventTriggered(entanglement);
      setEntanglementStrength(90);
    }
  };

  const toggleParallelMode = () => {
    if (quantumEnergy >= 40) {
      setParallelMode(!parallelMode);
      
      const split: QuantumEvent = {
        id: `split-${Date.now()}`,
        type: 'split',
        description: parallelMode ? 'Parallel mode deactivated' : 'Parallel investigation mode activated',
        timeline: currentTimeline,
        intensity: 70,
        timestamp: Date.now()
      };
      
      setActiveEvents(prev => [...prev.slice(-2), split]);
      onQuantumEventTriggered(split);
    }
  };

  const stabilizeQuantumField = () => {
    if (quantumEnergy >= 20) {
      setCorruptionLevel(0);
      setActiveEvents(prev => prev.filter(e => e.type !== 'corruption'));
    }
  };

  const getEventIcon = (type: QuantumEvent['type']) => {
    switch (type) {
      case 'echo':
        return Eye;
      case 'entanglement':
        return GitBranch;
      case 'corruption':
        return AlertTriangle;
      case 'split':
        return Split;
      default:
        return Zap;
    }
  };

  const getEventColor = (type: QuantumEvent['type']) => {
    switch (type) {
      case 'echo':
        return 'text-blue-400 border-blue-400';
      case 'entanglement':
        return 'text-green-400 border-green-400';
      case 'corruption':
        return 'text-red-400 border-red-400';
      case 'split':
        return 'text-purple-400 border-purple-400';
      default:
        return 'text-yellow-400 border-yellow-400';
    }
  };

  return (
    <Card className={`bg-card/80 backdrop-blur-sm border border-primary/30 ${className}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron text-lg font-bold text-primary">
            Quantum Field Interface
          </h3>
          <Badge variant="outline" className="text-accent">
            Active Timeline: {currentTimeline.toUpperCase()}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Temporal Echoes</span>
              <span className="text-xs text-blue-400">{Math.round(echoIntensity)}%</span>
            </div>
            <Progress value={echoIntensity} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Entanglement</span>
              <span className="text-xs text-green-400">{Math.round(entanglementStrength)}%</span>
            </div>
            <Progress value={entanglementStrength} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Field Corruption</span>
              <span className="text-xs text-red-400">{Math.round(corruptionLevel)}%</span>
            </div>
            <Progress value={corruptionLevel} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Parallel Mode</span>
              <Badge variant={parallelMode ? "default" : "outline"} className="text-xs">
                {parallelMode ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerTemporalEcho}
            disabled={quantumEnergy < 30}
            className="text-xs h-8 border-blue-400 hover:bg-blue-400/10"
          >
            <Eye className="w-3 h-3 mr-1" />
            Echo ({30} QE)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={activateQuantumEntanglement}
            disabled={quantumEnergy < 50}
            className="text-xs h-8 border-green-400 hover:bg-green-400/10"
          >
            <GitBranch className="w-3 h-3 mr-1" />
            Entangle ({50} QE)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleParallelMode}
            disabled={quantumEnergy < 40}
            className="text-xs h-8 border-purple-400 hover:bg-purple-400/10"
          >
            <Split className="w-3 h-3 mr-1" />
            Parallel ({40} QE)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={stabilizeQuantumField}
            disabled={quantumEnergy < 20 || corruptionLevel === 0}
            className="text-xs h-8 border-yellow-400 hover:bg-yellow-400/10"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Stabilize ({20} QE)
          </Button>
        </div>
        {activeEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-accent">Quantum Events</h4>
            <div className="space-y-1">
              {activeEvents.slice(-3).map((event) => {
                const Icon = getEventIcon(event.type);
                return (
                  <div
                    key={event.id}
                    className={`flex items-center p-2 rounded border text-xs ${getEventColor(event.type)}`}
                  >
                    <Icon className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="flex-1">{event.description}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(event.intensity)}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {parallelMode && (
          <div className="border border-purple-400/30 rounded-lg p-3 bg-purple-400/5">
            <div className="flex items-center mb-2">
              <Split className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Parallel Investigation Active</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Viewing multiple timeline perspectives simultaneously. Evidence relationships across realities are now visible.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};