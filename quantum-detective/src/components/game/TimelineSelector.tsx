import React from 'react';
import { Button } from '@/components/ui/button';
import { Timeline } from '../QuantumDetective';

interface TimelineSelectorProps {
  currentTimeline: Timeline;
  onTimelineChange: (timeline: Timeline) => void;
  quantumEnergy: number;
}

const timelineConfig = {
  alpha: { name: 'Alpha', color: 'quantum-alpha', description: 'The Corporate Timeline' },
  beta: { name: 'Beta', color: 'quantum-beta', description: 'The Family Timeline' },
  gamma: { name: 'Gamma', color: 'quantum-gamma', description: 'The Underground Timeline' },
  delta: { name: 'Delta', color: 'quantum-delta', description: 'The Truth Timeline' }
};

export const TimelineSelector: React.FC<TimelineSelectorProps> = ({
  currentTimeline,
  onTimelineChange,
  quantumEnergy
}) => {
  return (
    <div className="flex gap-2">
      {(Object.keys(timelineConfig) as Timeline[]).map((timeline) => {
        const config = timelineConfig[timeline];
        const isActive = currentTimeline === timeline;
        const canSwitch = quantumEnergy >= 20 || isActive;
        
        return (
          <Button
            key={timeline}
            onClick={() => onTimelineChange(timeline)}
            disabled={!canSwitch}
            className={`
              timeline-indicator
              ${isActive ? `timeline-${timeline} bg-current/20` : 'border-muted text-muted-foreground'}
              ${!canSwitch && !isActive ? 'opacity-50 cursor-not-allowed' : ''}
              transition-all duration-300
            `}
            title={`${config.description} ${!canSwitch && !isActive ? '(Insufficient Quantum Energy)' : ''}`}
          >
            <div className="text-center">
              <div className="font-orbitron font-bold text-sm">
                {config.name}
              </div>
              {!canSwitch && !isActive && (
                <div className="text-xs opacity-60">
                  Locked
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
};