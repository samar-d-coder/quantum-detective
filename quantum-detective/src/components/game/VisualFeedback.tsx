import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface VisualFeedbackProps {
  trigger: string | null; 
  onComplete?: () => void;
}

export const VisualFeedback: React.FC<VisualFeedbackProps> = ({
  trigger,
  onComplete
}) => {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowEffect(true);
      const timer = setTimeout(() => {
        setShowEffect(false);
        onComplete?.();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  const getEffectConfig = () => {
    switch (trigger) {
      case 'evidence_found':
        return {
          icon: <Search className="w-8 h-8" />,
          color: 'text-green-400',
          bgColor: 'bg-green-400/20',
          particles: 'green',
          message: 'Evidence Discovered!'
        };
      case 'timeline_switch':
        return {
          icon: <Zap className="w-8 h-8" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/20',
          particles: 'blue',
          message: 'Timeline Shifted!'
        };
      case 'quantum_event':
        return {
          icon: <Sparkles className="w-8 h-8" />,
          color: 'text-purple-400',
          bgColor: 'bg-purple-400/20',
          particles: 'purple',
          message: 'Quantum Event!'
        };
      case 'achievement':
        return {
          icon: <CheckCircle className="w-8 h-8" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/20',
          particles: 'yellow',
          message: 'Achievement Unlocked!'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8" />,
          color: 'text-red-400',
          bgColor: 'bg-red-400/20',
          particles: 'red',
          message: 'Quantum Instability!'
        };
      default:
        return null;
    }
  };

  const effectConfig = getEffectConfig();

  if (!showEffect || !effectConfig) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute w-96 h-96 rounded-full ${effectConfig.bgColor} blur-3xl`}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: 0 }}
          animate={{ 
            opacity: 1, 
            scale: [0.5, 1.1, 1],
            rotateY: 360
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1, ease: "backOut" }}
          className={`relative z-10 p-4 rounded-full bg-background/80 backdrop-blur-sm border-2 border-current ${effectConfig.color}`}
        >
          {effectConfig.icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`absolute top-[60%] text-xl font-semibold ${effectConfig.color}`}
        >
          {effectConfig.message}
        </motion.div>

        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i * 30) * Math.PI / 180) * 120,
              y: Math.sin((i * 30) * Math.PI / 180) * 120
            }}
            transition={{ 
              duration: 1.2,
              delay: 0.2 + (i * 0.05),
              ease: "easeOut"
            }}
            className={`absolute w-2 h-2 rounded-full ${effectConfig.color} opacity-60`}
            style={{ backgroundColor: 'currentColor' }}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};

export const QuantumDistortion: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
        style={{
          background: `
            linear-gradient(45deg, transparent 30%, rgba(var(--primary-rgb), 0.1) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 30%, rgba(var(--secondary-rgb), 0.1) 50%, transparent 70%)
          `,
          animation: 'quantum-glitch 0.5s ease-out'
        }}
      />
      
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        style={{ width: '200%' }}
      />
    </div>
  );
};