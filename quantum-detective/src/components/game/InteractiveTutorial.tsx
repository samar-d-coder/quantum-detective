import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Lightbulb, Zap, Search, ArrowRight } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  targetElement?: string;
  completed: boolean;
}

interface InteractiveTutorialProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  isActive,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([
    {
      id: 'welcome',
      title: 'Welcome, Quantum Detective',
      description: 'You\'ve been called to investigate a murder that occurred across multiple timelines. Your quantum jumping technology allows you to see different versions of events.',
      action: 'Click "Continue" to begin your investigation',
      completed: false
    },
    {
      id: 'timeline_explanation',
      title: 'Timeline Navigation',
      description: 'Use the timeline selector at the top to jump between different quantum realities. Each timeline shows a different version of the same crime.',
      action: 'Try switching to the BETA timeline',
      targetElement: 'timeline-selector',
      completed: false
    },
    {
      id: 'evidence_collection',
      title: 'Evidence Collection',
      description: 'As you explore each timeline, you\'ll discover evidence. Some clues only exist in certain realities - collect them all to solve the case.',
      action: 'Look for your first piece of evidence in the story',
      targetElement: 'story-display',
      completed: false
    },
    {
      id: 'quantum_energy',
      title: 'Quantum Energy',
      description: 'Timeline jumping consumes quantum energy. Manage it wisely - if it runs out, you\'ll be trapped in your current timeline.',
      action: 'Monitor your energy in the top-right meter',
      targetElement: 'energy-meter',
      completed: false
    },
    {
      id: 'investigation_tools',
      title: 'Investigation Tools',
      description: 'Use advanced forensic tools like the Evidence Lab and 3D Reconstruction to analyze clues from different perspectives.',
      action: 'Ready to solve your first quantum mystery?',
      completed: false
    }
  ]);

  const currentStepData = steps[currentStep];

  const completeStep = () => {
    const newSteps = [...steps];
    newSteps[currentStep].completed = true;
    setSteps(newSteps);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipTutorial = () => {
    onSkip();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Quantum Detective Tutorial</span>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              {currentStep + 1} / {steps.length}
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <motion.div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center">
                <div className="p-4 rounded-full bg-primary/20 border-2 border-primary/30">
                  {currentStep === 0 && <Lightbulb className="w-8 h-8 text-primary" />}
                  {currentStep === 1 && <Zap className="w-8 h-8 text-primary" />}
                  {currentStep === 2 && <Search className="w-8 h-8 text-primary" />}
                  {currentStep === 3 && <Zap className="w-8 h-8 text-primary" />}
                  {currentStep === 4 && <ArrowRight className="w-8 h-8 text-primary" />}
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {currentStepData.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {currentStepData.description}
                </p>
                
                {currentStepData.action && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <p className="text-primary font-medium">
                      📍 {currentStepData.action}
                    </p>
                  </div>
                )}
              </div>
              {currentStep === 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm font-medium">Timeline Jump</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Search className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-sm font-medium">Find Evidence</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <ArrowRight className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-sm font-medium">Solve Case</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-between mt-8">
            <Button 
              variant="ghost" 
              onClick={skipTutorial}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Tutorial
            </Button>
            
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
              <Button 
                onClick={completeStep}
                className="bg-primary hover:bg-primary/90"
              >
                {currentStep === steps.length - 1 ? 'Start Investigation' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};