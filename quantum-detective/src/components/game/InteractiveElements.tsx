import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Zap, Target, Brain } from 'lucide-react';

interface InteractiveElementsProps {
  type: 'quick_time' | 'memory_game' | 'deduction' | 'observation';
  data: any;
  onComplete: (success: boolean, reward?: any) => void;
  onFail?: () => void;
}

export const InteractiveElements: React.FC<InteractiveElementsProps> = ({
  type,
  data,
  onComplete,
  onFail
}) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'completed' | 'failed'>('waiting');
  const [timeLeft, setTimeLeft] = useState(data.timeLimit || 10);
  const [progress, setProgress] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('failed');
      onFail?.();
    }
  }, [gameState, timeLeft, onFail]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(data.timeLimit || 10);
    setProgress(0);
    setSelectedAnswers([]);
  };

  const handleAnswer = (answer: string) => {
    if (gameState !== 'playing') return;

    const newAnswers = [...selectedAnswers, answer];
    setSelectedAnswers(newAnswers);

    if (type === 'quick_time') {
      const correct = answer === data.correctAnswer;
      setGameState(correct ? 'completed' : 'failed');
      onComplete(correct, correct ? data.reward : null);
    } else if (type === 'memory_game') {
      const allCorrect = data.sequence.every((item: string, index: number) => newAnswers[index] === item);
      const progress = (newAnswers.length / data.sequence.length) * 100;
      setProgress(progress);

      if (newAnswers.length === data.sequence.length) {
        setGameState(allCorrect ? 'completed' : 'failed');
        onComplete(allCorrect, allCorrect ? data.reward : null);
      }
    } else if (type === 'deduction') {
      if (newAnswers.length === data.requiredAnswers) {
        const score = newAnswers.filter(ans => data.correctAnswers.includes(ans)).length;
        const success = score >= data.passingScore;
        setGameState(success ? 'completed' : 'failed');
        onComplete(success, success ? data.reward : null);
      }
    }
  };

  const renderQuickTimeEvent = () => (
    <Card className="p-6 bg-destructive/10 border-destructive/30">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Timer className="w-6 h-6 text-destructive" />
          <h3 className="text-xl font-bold text-destructive">Quick Decision!</h3>
        </div>
        
        <p className="text-foreground">{data.question}</p>
        
        <div className="flex items-center justify-center gap-4">
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {timeLeft}s
          </Badge>
          <Progress value={(timeLeft / (data.timeLimit || 10)) * 100} className="w-32" />
        </div>

        {gameState === 'waiting' && (
          <Button onClick={startGame} className="w-full">
            Start Quick Time Event
          </Button>
        )}

        {gameState === 'playing' && (
          <div className="space-y-2">
            {data.options.map((option: string, index: number) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                variant="outline"
                className="w-full"
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-green-500 font-bold">
            ✓ Success! {data.reward}
          </div>
        )}

        {gameState === 'failed' && (
          <div className="text-destructive font-bold">
            ✗ Too slow! Try again.
          </div>
        )}
      </div>
    </Card>
  );

  const renderMemoryGame = () => (
    <Card className="p-6 bg-accent/10 border-accent/30">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold text-accent">Memory Challenge</h3>
        </div>
        
        <p className="text-foreground">{data.instruction}</p>
        
        <Progress value={progress} className="w-full" />

        {gameState === 'waiting' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Remember this sequence: {data.sequence.join(' → ')}
            </div>
            <Button onClick={startGame} className="w-full">
              Start Memory Test
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-4">
            <div className="text-sm">
              Enter sequence ({selectedAnswers.length + 1}/{data.sequence.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  variant="outline"
                  size="sm"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-green-500 font-bold">
            ✓ Perfect memory! {data.reward}
          </div>
        )}

        {gameState === 'failed' && (
          <div className="text-destructive font-bold">
            ✗ Incorrect sequence. Try again.
          </div>
        )}
      </div>
    </Card>
  );

  const renderDeductionGame = () => (
    <Card className="p-6 bg-secondary/10 border-secondary/30">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-secondary" />
          <h3 className="text-xl font-bold text-secondary">Deduction Challenge</h3>
        </div>
        
        <p className="text-foreground">{data.scenario}</p>
        
        <div className="text-sm text-muted-foreground">
          Select {data.requiredAnswers} answers (Need {data.passingScore} correct to pass)
        </div>

        {gameState === 'waiting' && (
          <Button onClick={startGame} className="w-full">
            Begin Analysis
          </Button>
        )}

        {gameState === 'playing' && (
          <div className="space-y-2">
            <div className="text-sm">
              Selected: {selectedAnswers.length}/{data.requiredAnswers}
            </div>
            {data.clues.map((clue: string, index: number) => (
              <Button
                key={index}
                onClick={() => handleAnswer(clue)}
                variant={selectedAnswers.includes(clue) ? "default" : "outline"}
                className="w-full text-left"
                disabled={selectedAnswers.includes(clue) || selectedAnswers.length >= data.requiredAnswers}
              >
                {clue}
              </Button>
            ))}
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-green-500 font-bold">
            ✓ Excellent deduction! {data.reward}
          </div>
        )}

        {gameState === 'failed' && (
          <div className="text-destructive font-bold">
            ✗ Insufficient evidence. Try again.
          </div>
        )}
      </div>
    </Card>
  );

  const renderObservationGame = () => (
    <Card className="p-6 bg-primary/10 border-primary/30">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-primary">Observation Test</h3>
        </div>
        
        <p className="text-foreground">{data.description}</p>
        
        <div className="bg-background/50 p-4 rounded-lg text-sm font-mono">
          {data.scenario}
        </div>

        {gameState === 'waiting' && (
          <Button onClick={startGame} className="w-full">
            Start Observation
          </Button>
        )}

        {gameState === 'playing' && (
          <div className="space-y-2">
            <div className="text-sm">What do you notice?</div>
            {data.observations.map((obs: string, index: number) => (
              <Button
                key={index}
                onClick={() => handleAnswer(obs)}
                variant="outline"
                className="w-full"
              >
                {obs}
              </Button>
            ))}
          </div>
        )}

        {gameState === 'completed' && (
          <div className="text-green-500 font-bold">
            ✓ Sharp observation! {data.reward}
          </div>
        )}

        {gameState === 'failed' && (
          <div className="text-destructive font-bold">
            ✗ Missed the clue. Try again.
          </div>
        )}
      </div>
    </Card>
  );

  switch (type) {
    case 'quick_time':
      return renderQuickTimeEvent();
    case 'memory_game':
      return renderMemoryGame();
    case 'deduction':
      return renderDeductionGame();
    case 'observation':
      return renderObservationGame();
    default:
      return null;
  }
};