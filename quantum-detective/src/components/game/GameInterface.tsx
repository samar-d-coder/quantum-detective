import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameData, Timeline } from '../QuantumDetective';
import { TimelineSelector } from './TimelineSelector';
import { StoryDisplay } from './StoryDisplay';
import { EvidencePanel } from './EvidencePanel';
import { QuantumEnergyMeter } from './QuantumEnergyMeter';
import { EvidenceAnalysisLab } from './EvidenceAnalysisLab';
import { WitnessInterviewSystem } from './WitnessInterviewSystem';
import { CrimeSceneReconstruction } from './CrimeSceneReconstruction';
import { PhotoComparisonTool } from './PhotoComparisonTool';
import { QuantumFeaturesPanel } from './QuantumFeaturesPanel';
import { AchievementSystem } from './AchievementSystem';
import { ProgressTracker } from './ProgressTracker';
import { VisualFeedback, QuantumDistortion } from './VisualFeedback';
import { InteractiveTutorial } from './InteractiveTutorial';
import { AutoSaveManager } from './AutoSaveManager';
import { CharacterPortraits } from './CharacterPortraits';
import { EvidenceReactionSystem } from './EvidenceReactionSystem';
import { EnhancedAudioManager } from './EnhancedAudioManager';

interface GameInterfaceProps {
  gameData: GameData;
  onGameDataChange: (data: GameData) => void;
  onReturnToMenu: () => void;
  onSaveGame: () => void;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  gameData,
  onGameDataChange,
  onReturnToMenu,
  onSaveGame
}) => {
  const [showEvidencePanel, setShowEvidencePanel] = useState(false);
  const [showAnalysisLab, setShowAnalysisLab] = useState(false);
  const [showInterviewSystem, setShowInterviewSystem] = useState(false);
  const [showReconstruction, setShowReconstruction] = useState(false);
  const [showPhotoComparison, setShowPhotoComparison] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [selectedWitness, setSelectedWitness] = useState<any>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);
  const [visualFeedback, setVisualFeedback] = useState<string | null>(null);
  const [showQuantumDistortion, setShowQuantumDistortion] = useState(false);

  const handleTimelineSwitch = (timeline: Timeline) => {
    if (gameData.quantumEnergy >= 20 && timeline !== gameData.currentTimeline) {
      EnhancedAudioManager.playTimelineSwitch();
      EnhancedAudioManager.switchTimelineAmbient(timeline);
      setVisualFeedback('timeline_switch');
      setShowQuantumDistortion(true);
      
      setTimeout(() => {
        setShowQuantumDistortion(false);
      }, 800);

      onGameDataChange({
        ...gameData,
        currentTimeline: timeline,
        quantumEnergy: gameData.quantumEnergy - 20
      });
    }
  };

  const handleStoryChoice = (choiceId: string) => {
    const newProgress = { ...gameData.storyProgress };
    newProgress[gameData.currentTimeline] += 1;
    
    onGameDataChange({
      ...gameData,
      storyProgress: newProgress
    });
  };

  const addEvidence = (evidence: any) => {
    const exists = gameData.evidence.find(item => item.id === evidence.id);
    if (!exists) {
      EnhancedAudioManager.playEvidenceFound();
      setVisualFeedback('evidence_found');
      
      onGameDataChange({
        ...gameData,
        evidence: [...gameData.evidence, { ...evidence, timeline: gameData.currentTimeline }]
      });
    }
  };

  const openAnalysisLab = (evidence: any) => {
    setSelectedEvidence(evidence);
    setShowAnalysisLab(true);
  };

  const openInterviewSystem = (witness: any) => {
    setSelectedWitness(witness);
    setShowInterviewSystem(true);
  };

  const handleQuantumEvent = (event: any) => {
    if (event.type === 'corruption') {
      setTimeout(() => {
      }, 3000);
    }
  };
  const mockTimelineEvents = [
    { id: '1', time: 10, description: 'Victim enters office', location: { x: 100, y: 150 }, character: 'Victim' },
    { id: '2', time: 25, description: 'Suspect arrives', location: { x: 200, y: 100 }, character: 'Suspect A' },
    { id: '3', time: 40, description: 'Confrontation occurs', location: { x: 150, y: 125 }, character: 'Both' },
    { id: '4', time: 55, description: 'Evidence placed', location: { x: 180, y: 140 }, character: 'Unknown', evidenceId: 'evidence1' }
  ];

  const mockPhotos = [
    { id: 'photo1', name: 'Crime Scene Alpha', timeline: 'alpha', description: 'Initial crime scene photo' },
    { id: 'photo2', name: 'Crime Scene Beta', timeline: 'beta', description: 'Same scene in alternate timeline' },
    { id: 'photo3', name: 'Evidence Close-up', timeline: 'alpha', description: 'Detailed evidence photo' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-card/80 backdrop-blur-sm border-b border-primary/30 p-4">
        <div className="flex items-center justify-between">
          <TimelineSelector
            currentTimeline={gameData.currentTimeline}
            onTimelineChange={handleTimelineSwitch}
            quantumEnergy={gameData.quantumEnergy}
          />
          <QuantumEnergyMeter energy={gameData.quantumEnergy} />
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEvidencePanel(!showEvidencePanel)}
              className="border-accent hover:border-accent-glow"
            >
              Evidence ({gameData.evidence.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCharacters(!showCharacters)}
              className="border-green-400 hover:border-green-400/80"
            >
              Characters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAutoSave(!showAutoSave)}
              className="border-blue-400 hover:border-blue-400/80"
            >
              Save/Load
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalysisLab(true)}
              disabled={gameData.evidence.length === 0}
              className="border-purple-400 hover:border-purple-400/80"
            >
              Lab Analysis
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievements(!showAchievements)}
              className="border-yellow-400 hover:border-yellow-400/80"
            >
              Achievements
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReturnToMenu}
              className="border-destructive hover:border-destructive"
            >
              Menu
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="flex-1 p-6 space-y-4">
          <ProgressTracker 
            gameData={gameData} 
            currentChapter={gameData.currentChapter} 
          />
          
          <StoryDisplay
            timeline={gameData.currentTimeline}
            progress={gameData.storyProgress[gameData.currentTimeline]}
            onChoice={handleStoryChoice}
            onEvidenceFound={addEvidence}
          />
          <EvidenceReactionSystem
            evidence={gameData.evidence}
            onEvidenceSelect={(evidence) => {
              EnhancedAudioManager.playUIClick();
              setSelectedEvidence(evidence);
            }}
            onConnectionDiscovered={(connection) => {
              EnhancedAudioManager.playQuantumAlert();
              setVisualFeedback('quantum_event');
            }}
            currentTimeline={gameData.currentTimeline}
          />
          <QuantumFeaturesPanel
            currentTimeline={gameData.currentTimeline}
            quantumEnergy={gameData.quantumEnergy}
            onTimelineChange={handleTimelineSwitch}
            onQuantumEventTriggered={handleQuantumEvent}
          />
        </div>
        {(showEvidencePanel || showAchievements || showCharacters || showAutoSave) && (
          <div className="w-80 border-l border-primary/30 bg-card/50 backdrop-blur-sm">
            {showEvidencePanel && (
              <EvidencePanel
                evidence={gameData.evidence}
                characters={gameData.characters}
                onClose={() => setShowEvidencePanel(false)}
                onEvidenceAdd={(newEvidence) => {
                  onGameDataChange({
                    ...gameData,
                    evidence: [...gameData.evidence, newEvidence]
                  });
                }}
              />
            )}
            {showCharacters && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Characters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowCharacters(false)}
                  >
                    ×
                  </Button>
                </div>
                <CharacterPortraits
                  characters={gameData.characters}
                  onInteract={openInterviewSystem}
                  onViewProfile={(character) => {
                    console.log('View profile:', character);
                  }}
                  currentTimeline={gameData.currentTimeline}
                />
              </div>
            )}
            
            {showAutoSave && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Save & Load</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAutoSave(false)}
                  >
                    ×
                  </Button>
                </div>
                <AutoSaveManager
                  gameData={gameData}
                  onLoad={(data) => {
                    onGameDataChange(data);
                    setShowAutoSave(false);
                  }}
                />
              </div>
            )}
            
            {showAchievements && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Achievements</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAchievements(false)}
                  >
                    ×
                  </Button>
                </div>
                <AchievementSystem 
                  gameData={gameData}
                  onAchievementUnlock={(achievement) => {
                    setVisualFeedback('achievement');
                    onGameDataChange({
                      ...gameData,
                      achievements: [...gameData.achievements, achievement.id]
                    });
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {showAnalysisLab && selectedEvidence && (
        <EvidenceAnalysisLab
          evidence={selectedEvidence}
          onClose={() => {
            setShowAnalysisLab(false);
            setSelectedEvidence(null);
          }}
          onAnalysisComplete={(findings) => {
            findings.forEach(finding => {
              addEvidence({
                id: `analysis-${Date.now()}`,
                name: `Lab Finding: ${finding}`,
                description: finding,
                timeline: gameData.currentTimeline
              });
            });
          }}
        />
      )}

      {showAnalysisLab && !selectedEvidence && gameData.evidence.length > 0 && (
        <EvidenceAnalysisLab
          evidence={gameData.evidence[0]}
          onClose={() => setShowAnalysisLab(false)}
          onAnalysisComplete={(findings) => {
            findings.forEach(finding => {
              addEvidence({
                id: `analysis-${Date.now()}`,
                name: `Lab Finding: ${finding}`,
                description: finding,
                timeline: gameData.currentTimeline
              });
            });
          }}
        />
      )}

      {showInterviewSystem && selectedWitness && (
        <WitnessInterviewSystem
          witness={selectedWitness}
          onClose={() => {
            setShowInterviewSystem(false);
            setSelectedWitness(null);
          }}
          onInterviewComplete={(results) => {
            results.truthRevealed.forEach(truth => {
              addEvidence({
                id: `interview-${Date.now()}`,
                name: `Interview Revelation: ${truth}`,
                description: truth,
                timeline: gameData.currentTimeline
              });
            });
          }}
        />
      )}

      {showReconstruction && (
        <CrimeSceneReconstruction
          events={mockTimelineEvents}
          onClose={() => setShowReconstruction(false)}
          onReconstructionComplete={(insights) => {
            insights.forEach(insight => {
              addEvidence({
                id: `reconstruction-${Date.now()}`,
                name: `Timeline Insight: ${insight}`,
                description: insight,
                timeline: gameData.currentTimeline
              });
            });
          }}
        />
      )}

      {showPhotoComparison && (
        <PhotoComparisonTool
          photos={mockPhotos}
          onClose={() => setShowPhotoComparison(false)}
          onComparisonComplete={(differences) => {
            differences.forEach(difference => {
              addEvidence({
                id: `comparison-${Date.now()}`,
                name: `Photo Analysis: ${difference}`,
                description: difference,
                timeline: gameData.currentTimeline
              });
            });
          }}
        />
      )}
      <div className="bg-card/80 backdrop-blur-sm border-t border-primary/30 p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Timeline: <span className="text-foreground font-semibold">{gameData.currentTimeline.toUpperCase()}</span>
          </div>
          <div>
            Progress: {gameData.storyProgress[gameData.currentTimeline]}/10
          </div>
          <div>
            Chapter {gameData.currentChapter}: The Crime Scene
          </div>
        </div>
      </div>
      <VisualFeedback 
        trigger={visualFeedback} 
        onComplete={() => setVisualFeedback(null)} 
      />
      <QuantumDistortion active={showQuantumDistortion} />
      {gameData.showTutorial && (
        <InteractiveTutorial
          isActive={gameData.showTutorial}
          onComplete={() => {
            onGameDataChange({
              ...gameData,
              showTutorial: false
            });
          }}
          onSkip={() => {
            onGameDataChange({
              ...gameData,
              showTutorial: false
            });
          }}
        />
      )}
    </div>
  );
};