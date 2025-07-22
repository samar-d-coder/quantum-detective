import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Zap, Search, Users, Clock, Eye, Lightbulb } from 'lucide-react';

interface HowToPlayGuideProps {
  onClose: () => void;
}

export const HowToPlayGuide: React.FC<HowToPlayGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[90vh] bg-card border border-primary/30 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-primary/30 flex items-center justify-between">
          <h2 className="font-orbitron text-2xl font-bold text-primary">
            How to Play Quantum Detective
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="font-orbitron text-xl font-semibold text-secondary mb-3">
              Game Overview
            </h3>
            <p className="text-muted-foreground mb-4">
              You are a quantum detective investigating crimes across multiple timelines. Each timeline presents different perspectives of the same murder case, revealing unique clues and suspects. Use advanced forensics tools, interview witnesses, and piece together evidence from parallel realities to uncover the truth behind these quantum crimes.
            </p>
            <div className="bg-accent/20 border border-accent/50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-accent mb-2">The Case: Marcus Vrain's Murder</h4>
              <p className="text-sm text-muted-foreground">
                CEO Marcus Vrain is found dead in his office. In Timeline Alpha, it appears to be corporate espionage. In Beta, family secrets emerge. Gamma reveals syndicate connections. Delta exposes the quantum conspiracy behind it all.
              </p>
            </div>
          </section>
          <section>
            <h3 className="font-orbitron text-xl font-semibold text-secondary mb-3">
              Core Mechanics
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 bg-muted/20">
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 mr-2 text-accent" />
                  <h4 className="font-semibold">Quantum Energy</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Powers timeline switches and special abilities. Recharges over time and through story progression.
                </p>
              </Card>
              <Card className="p-4 bg-muted/20">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  <h4 className="font-semibold">Timeline Navigation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Switch between Alpha, Beta, Gamma, and Delta timelines to see different perspectives of events.
                </p>
              </Card>
              <Card className="p-4 bg-muted/20">
                <div className="flex items-center mb-2">
                  <Search className="w-5 h-5 mr-2 text-green-400" />
                  <h4 className="font-semibold">Evidence Collection</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gather clues, analyze them in the lab, and combine evidence to unlock new insights.
                </p>
              </Card>
              <Card className="p-4 bg-muted/20">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  <h4 className="font-semibold">Character Interactions</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Interview witnesses, detect lies, and build relationships to uncover the truth.
                </p>
              </Card>
            </div>
          </section>
          <section>
            <h3 className="font-orbitron text-xl font-semibold text-secondary mb-3">
              Investigation Tools
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">Lab Analysis</Badge>
                <div>
                  <h4 className="font-semibold text-sm">Evidence Analysis Lab</h4>
                  <p className="text-xs text-muted-foreground">Use UV light, magnification, and chemical tests to reveal hidden details in evidence.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">Interview</Badge>
                <div>
                  <h4 className="font-semibold text-sm">Witness Interview System</h4>
                  <p className="text-xs text-muted-foreground">Watch for micro-expressions and stress indicators to detect lies and build trust.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">3D Reconstruction</Badge>
                <div>
                  <h4 className="font-semibold text-sm">Crime Scene Reconstruction</h4>
                  <p className="text-xs text-muted-foreground">Visualize character movements and events in a 3D timeline to find inconsistencies.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-1">Photo Compare</Badge>
                <div>
                  <h4 className="font-semibold text-sm">Photo Comparison Tool</h4>
                  <p className="text-xs text-muted-foreground">Compare evidence photos side-by-side to spot differences and tampering.</p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="font-orbitron text-xl font-semibold text-secondary mb-3">
              Quantum Mechanics
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Eye className="w-4 h-4 mt-1 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-sm">Temporal Echoes</h4>
                  <p className="text-xs text-muted-foreground">Glimpse alternate timeline events for additional context and clues.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-4 h-4 mt-1 text-green-400" />
                <div>
                  <h4 className="font-semibold text-sm">Quantum Entanglement</h4>
                  <p className="text-xs text-muted-foreground">Actions in one timeline affect evidence and characters in other timelines.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 mt-1 text-purple-400" />
                <div>
                  <h4 className="font-semibold text-sm">Parallel Investigation</h4>
                  <p className="text-xs text-muted-foreground">View multiple timelines simultaneously to compare evidence and events.</p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="font-orbitron text-xl font-semibold text-secondary mb-3">
              Getting Started
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Step 1: Begin Investigation</h4>
                <p className="text-sm text-muted-foreground">
                  Start in Timeline Alpha to examine the basic crime scene. Look for evidence, make choices to progress the story.
                </p>
              </div>
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Step 2: Use Investigation Tools</h4>
                <p className="text-sm text-muted-foreground">
                  Click toolbar buttons to access the Evidence Analysis Lab, conduct witness interviews, and compare photos.
                </p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Step 3: Switch Timelines</h4>
                <p className="text-sm text-muted-foreground">
                  When you have enough quantum energy, switch to other timelines to see different perspectives and gather more evidence.
                </p>
              </div>
            </div>
          </section>
          <section>
            <h3 className="font-orbitron text-xl font-semibold text-secondary mb-3">
              Pro Tips
            </h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  <strong>Save Quantum Energy:</strong> Only switch timelines when necessary, as it costs 20 QE each time.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  <strong>Analyze Everything:</strong> Use forensic tools on all evidence - hidden details often reveal crucial information.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  <strong>Interactive Elements:</strong> Complete mini-games and challenges for bonus evidence and insights.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  <strong>Watch for Patterns:</strong> Compare the same events across different timelines to spot anomalies.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  <strong>Use Skip Text:</strong> Press the skip button during story sections to jump directly to choices.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 mt-1 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  <strong>Evidence Collection:</strong> Each timeline provides unique evidence - collect from all to see the full picture.
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className="p-6 border-t border-primary/30">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/80">
            Start Your Investigation
          </Button>
        </div>
      </Card>
    </div>
  );
};