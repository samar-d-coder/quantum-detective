import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Heart, Brain, AlertTriangle } from 'lucide-react';

interface DialogueOption {
  id: string;
  text: string;
  type: 'neutral' | 'aggressive' | 'sympathetic' | 'probing';
  stressLevel: number;
}

interface WitnessState {
  name: string;
  trustLevel: number;
  stressLevel: number;
  currentEmotion: 'calm' | 'nervous' | 'defensive' | 'cooperative' | 'suspicious';
  tells: string[];
}

interface WitnessInterviewSystemProps {
  witness: WitnessState;
  onClose: () => void;
  onInterviewComplete: (results: { truthRevealed: string[]; suspicionLevel: number }) => void;
}

export const WitnessInterviewSystem: React.FC<WitnessInterviewSystemProps> = ({
  witness: initialWitness,
  onClose,
  onInterviewComplete
}) => {
  const [witness, setWitness] = useState<WitnessState>(initialWitness);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [truthsRevealed, setTruthsRevealed] = useState<string[]>([]);
  const [detectedLies, setDetectedLies] = useState<string[]>([]);
  const [microExpressions, setMicroExpressions] = useState<string[]>([]);
  const [interviewPhase, setInterviewPhase] = useState<'intro' | 'questioning' | 'conclusion'>('intro');

  const questions = [
    {
      id: 'whereabouts',
      text: "Where were you at the time of the incident?",
      responses: [
        { id: 'truth', text: "I was at home watching TV", isLie: false, stressChange: -5 },
        { id: 'lie', text: "I was at home watching TV", isLie: true, stressChange: 15 },
        { id: 'partial', text: "I was... around the neighborhood", isLie: true, stressChange: 10 }
      ]
    },
    {
      id: 'knowledge',
      text: "What do you know about the victim?",
      responses: [
        { id: 'honest', text: "We had some disagreements recently", isLie: false, stressChange: 5 },
        { id: 'denial', text: "Nothing really, we barely knew each other", isLie: true, stressChange: 20 },
        { id: 'deflect', text: "Why are you asking me this?", isLie: false, stressChange: 8 }
      ]
    },
    {
      id: 'motive',
      text: "Did you have any reason to wish harm to the victim?",
      responses: [
        { id: 'admit', text: "We had business disputes", isLie: false, stressChange: -10 },
        { id: 'deny', text: "Absolutely not!", isLie: true, stressChange: 25 },
        { id: 'minimize', text: "Nothing serious", isLie: true, stressChange: 15 }
      ]
    }
  ];

  const dialogueOptions: DialogueOption[] = [
    { id: 'neutral', text: "Can you tell me more about that?", type: 'neutral', stressLevel: 2 },
    { id: 'aggressive', text: "I think you're lying to me.", type: 'aggressive', stressLevel: 15 },
    { id: 'sympathetic', text: "I understand this must be difficult.", type: 'sympathetic', stressLevel: -5 },
    { id: 'probing', text: "Are you absolutely certain about that?", type: 'probing', stressLevel: 8 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (witness.stressLevel > 60) {
        setMicroExpressions(prev => {
          const expressions = ['eye twitch', 'lip compression', 'nostril flare', 'hand fidgeting'];
          const newExpression = expressions[Math.floor(Math.random() * expressions.length)];
          return [...prev.slice(-2), newExpression];
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [witness.stressLevel]);

  const handleDialogueChoice = (option: DialogueOption) => {
    const newStress = Math.max(0, Math.min(100, witness.stressLevel + option.stressLevel));
    const trustChange = option.type === 'sympathetic' ? 5 : option.type === 'aggressive' ? -10 : 0;
    const newTrust = Math.max(0, Math.min(100, witness.trustLevel + trustChange));

    setWitness(prev => ({
      ...prev,
      stressLevel: newStress,
      trustLevel: newTrust,
      currentEmotion: getEmotionFromStats(newStress, newTrust)
    }));

    if (newTrust > 60 && newStress < 40) {
      setTruthsRevealed(prev => [...prev, `Revealed truth about ${questions[currentQuestion]?.id}`]);
    } else if (newStress > 70) {
      setDetectedLies(prev => [...prev, `Detected lie about ${questions[currentQuestion]?.id}`]);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setInterviewPhase('conclusion');
    }
  };

  const getEmotionFromStats = (stress: number, trust: number): WitnessState['currentEmotion'] => {
    if (stress > 70) return 'defensive';
    if (stress > 40) return 'nervous';
    if (trust > 60) return 'cooperative';
    if (trust < 30) return 'suspicious';
    return 'calm';
  };

  const getEmotionColor = (emotion: WitnessState['currentEmotion']) => {
    switch (emotion) {
      case 'calm': return 'text-green-500';
      case 'nervous': return 'text-yellow-500';
      case 'defensive': return 'text-red-500';
      case 'cooperative': return 'text-blue-500';
      case 'suspicious': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const completeInterview = () => {
    const suspicionLevel = Math.max(0, 100 - witness.trustLevel + (detectedLies.length * 20));
    onInterviewComplete({
      truthRevealed: truthsRevealed,
      suspicionLevel
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] bg-card border border-primary/30 flex flex-col">
        <div className="p-4 border-b border-primary/30 flex items-center justify-between">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-primary">
              Witness Interview
            </h2>
            <p className="text-muted-foreground">Interviewing: {witness.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 flex">
          <div className="w-80 p-4 border-r border-primary/30 space-y-4">
            <h3 className="font-orbitron text-lg font-semibold text-secondary">
              Psychological Profile
            </h3>            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current State:</span>
                <Badge className={getEmotionColor(witness.currentEmotion)}>
                  {witness.currentEmotion.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Stress Level</span>
              </div>
              <Progress value={witness.stressLevel} className="w-full" />
              <span className="text-xs text-muted-foreground">{witness.stressLevel}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Trust Level</span>
              </div>
              <Progress value={witness.trustLevel} className="w-full" />
              <span className="text-xs text-muted-foreground">{witness.trustLevel}%</span>
            </div>
            {microExpressions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-accent" />
                  <span className="text-sm font-medium">Micro-Expressions</span>
                </div>
                <div className="space-y-1">
                  {microExpressions.slice(-3).map((expression, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {expression}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {detectedLies.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm font-medium">Detected Lies</span>
                </div>
                <div className="space-y-1">
                  {detectedLies.map((lie, index) => (
                    <Badge key={index} variant="destructive" className="text-xs block">
                      {lie}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 flex flex-col">
            {interviewPhase === 'questioning' && currentQuestion < questions.length ? (
              <>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">
                    Question {currentQuestion + 1}/{questions.length}
                  </h4>
                  <p className="text-muted-foreground bg-muted/20 p-4 rounded border-l-4 border-primary">
                    {questions[currentQuestion].text}
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Choose your approach:</h5>
                  {dialogueOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 text-left"
                      onClick={() => handleDialogueChoice(option)}
                    >
                      <div>
                        <div className="font-medium">{option.text}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {option.type.charAt(0).toUpperCase() + option.type.slice(1)} approach
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </>
            ) : interviewPhase === 'intro' ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <h3 className="text-2xl font-bold">Interview Preparation</h3>
                <p className="text-muted-foreground max-w-md">
                  Watch for micro-expressions, listen for inconsistencies, and build rapport to uncover the truth.
                </p>
                <Button 
                  onClick={() => setInterviewPhase('questioning')}
                  className="bg-primary hover:bg-primary/80"
                >
                  Begin Interview
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <h3 className="text-2xl font-bold">Interview Complete</h3>
                <div className="space-y-2">
                  <p>Truths Revealed: {truthsRevealed.length}</p>
                  <p>Lies Detected: {detectedLies.length}</p>
                  <p>Final Trust Level: {witness.trustLevel}%</p>
                </div>
                <Button 
                  onClick={completeInterview}
                  className="bg-accent hover:bg-accent/80"
                >
                  Complete Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};