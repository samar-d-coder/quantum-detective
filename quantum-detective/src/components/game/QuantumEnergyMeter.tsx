import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface QuantumEnergyMeterProps {
  energy: number;
  maxEnergy?: number;
}

export const QuantumEnergyMeter: React.FC<QuantumEnergyMeterProps> = ({
  energy,
  maxEnergy = 100
}) => {
  const percentage = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));
  
  const getEnergyColor = () => {
    if (percentage > 60) return 'accent'; 
    if (percentage > 30) return 'secondary'; 
    return 'destructive'; 
  };

  const getEnergyStatus = () => {
    if (percentage > 80) return 'Optimal';
    if (percentage > 60) return 'High';
    if (percentage > 40) return 'Moderate';
    if (percentage > 20) return 'Low';
    return 'Critical';
  };

  const energyColor = getEnergyColor();
  const energyStatus = getEnergyStatus();

  return (
    <Card className="p-3 bg-card/50 border-primary/30 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Zap 
            className={`w-5 h-5 text-${energyColor} ${percentage > 20 ? 'animate-quantum-pulse' : 'animate-neon-flicker'}`} 
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-orbitron text-sm font-semibold text-foreground">
              Quantum Energy
            </span>
            <span className={`text-xs font-bold text-${energyColor}`}>
              {energy}/{maxEnergy}
            </span>
          </div>
          <div className="relative w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out bg-${energyColor} relative`}
              style={{ width: `${percentage}%` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse`} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs font-medium text-${energyColor}`}>
              {energyStatus}
            </span>
            {percentage < 25 && (
              <span className="text-xs text-destructive animate-pulse">
                Timeline jumps disabled
              </span>
            )}
          </div>
        </div>
      </div>
      {percentage < 100 && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Energy regenerates over time
        </div>
      )}
    </Card>
  );
};