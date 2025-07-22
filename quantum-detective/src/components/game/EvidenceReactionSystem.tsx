import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Zap, Link2, Star, ArrowRight } from 'lucide-react';

interface Evidence {
  id: string;
  name: string;
  description: string;
  timeline: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

interface EvidenceConnection {
  evidence1: string;
  evidence2: string;
  relationship: string;
  strength: number;
}

interface EvidenceReactionSystemProps {
  evidence: Evidence[];
  onEvidenceSelect: (evidence: Evidence) => void;
  onConnectionDiscovered: (connection: EvidenceConnection) => void;
  currentTimeline: string;
}

export const EvidenceReactionSystem: React.FC<EvidenceReactionSystemProps> = ({
  evidence,
  onEvidenceSelect,
  onConnectionDiscovered,
  currentTimeline
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence[]>([]);
  const [discoveredConnections, setDiscoveredConnections] = useState<EvidenceConnection[]>([]);
  const [showReaction, setShowReaction] = useState<{ evidence: Evidence; type: string } | null>(null);
  const [animatingEvidence, setAnimatingEvidence] = useState<string | null>(null);

  const getImportanceColor = (importance: Evidence['importance']) => {
    switch (importance) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getImportanceIcon = (importance: Evidence['importance']) => {
    switch (importance) {
      case 'critical': return <Zap className="h-4 w-4 text-red-500" />;
      case 'high': return <Star className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Search className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Search className="h-4 w-4 text-blue-500" />;
      default: return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleEvidenceClick = (evidenceItem: Evidence) => {
    setAnimatingEvidence(evidenceItem.id);
    setShowReaction({ evidence: evidenceItem, type: 'select' });
    
    if (selectedEvidence.length < 2 && !selectedEvidence.find(e => e.id === evidenceItem.id)) {
      const newSelected = [...selectedEvidence, evidenceItem];
      setSelectedEvidence(newSelected);
      
      if (newSelected.length === 2) {
        checkForConnection(newSelected[0], newSelected[1]);
      }
    } else if (selectedEvidence.find(e => e.id === evidenceItem.id)) {
      setSelectedEvidence(selectedEvidence.filter(e => e.id !== evidenceItem.id));
    } else {
      setSelectedEvidence([evidenceItem]);
    }
    
    onEvidenceSelect(evidenceItem);
    
    setTimeout(() => {
      setAnimatingEvidence(null);
      setShowReaction(null);
    }, 1500);
  };

  const checkForConnection = (evidence1: Evidence, evidence2: Evidence) => {
    const connectionStrength = Math.random() * 100;
    
    if (connectionStrength > 60) {
      const connection: EvidenceConnection = {
        evidence1: evidence1.id,
        evidence2: evidence2.id,
        relationship: getConnectionType(evidence1, evidence2),
        strength: connectionStrength
      };
      
      setDiscoveredConnections([...discoveredConnections, connection]);
      setShowReaction({ evidence: evidence1, type: 'connection' });
      onConnectionDiscovered(connection);
    }
  };

  const getConnectionType = (evidence1: Evidence, evidence2: Evidence) => {
    const types = [
      'Timeline Contradiction',
      'Witness Corroboration',
      'Physical Evidence Link',
      'Temporal Anomaly',
      'Causal Relationship',
      'Quantum Entanglement'
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  const isSelected = (evidenceId: string) => selectedEvidence.some(e => e.id === evidenceId);

  const currentTimelineEvidence = evidence.filter(e => e.timeline === currentTimeline);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showReaction && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <Card className="p-6 bg-background/95 backdrop-blur-sm border-primary/50 shadow-2xl">
              <div className="text-center space-y-2">
                {showReaction.type === 'connection' && (
                  <>
                    <div className="text-2xl">🔗</div>
                    <h3 className="font-semibold text-primary">Connection Discovered!</h3>
                    <p className="text-sm text-muted-foreground">
                      Evidence relationship detected
                    </p>
                  </>
                )}
                {showReaction.type === 'select' && (
                  <>
                    <div className="text-2xl">🔍</div>
                    <h3 className="font-semibold text-primary">Evidence Analyzed</h3>
                    <p className="text-sm text-muted-foreground">
                      {showReaction.evidence.name}
                    </p>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {selectedEvidence.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Analyzing Evidence ({selectedEvidence.length}/2)
          </h3>
          <div className="flex gap-2">
            {selectedEvidence.map((evidence, index) => (
              <Badge key={evidence.id} variant="secondary" className="flex items-center gap-1">
                {evidence.name}
                {index === 0 && selectedEvidence.length === 2 && (
                  <ArrowRight className="h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
          {selectedEvidence.length === 2 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setSelectedEvidence([])}
            >
              Clear Selection
            </Button>
          )}
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTimelineEvidence.map((evidenceItem) => (
          <motion.div
            key={evidenceItem.id}
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={animatingEvidence === evidenceItem.id ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`p-4 cursor-pointer transition-all duration-200 ${
                getImportanceColor(evidenceItem.importance)
              } ${
                isSelected(evidenceItem.id) 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleEvidenceClick(evidenceItem)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getImportanceIcon(evidenceItem.importance)}
                    <h3 className="font-semibold text-sm">{evidenceItem.name}</h3>
                  </div>
                  {isSelected(evidenceItem.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {evidenceItem.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {evidenceItem.category}
                </Badge>
                {discoveredConnections.some(conn => 
                  conn.evidence1 === evidenceItem.id || conn.evidence2 === evidenceItem.id
                ) && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Link2 className="h-3 w-3" />
                    <span>Connected</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      {discoveredConnections.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Discovered Connections
          </h3>
          <div className="space-y-2">
            {discoveredConnections.map((connection, index) => {
              const ev1 = evidence.find(e => e.id === connection.evidence1);
              const ev2 = evidence.find(e => e.id === connection.evidence2);
              
              return (
                <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded">
                  <Badge variant="outline">{ev1?.name}</Badge>
                  <ArrowRight className="h-3 w-3" />
                  <Badge variant="outline">{ev2?.name}</Badge>
                  <span className="text-muted-foreground">• {connection.relationship}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {Math.round(connection.strength)}%
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {currentTimelineEvidence.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No evidence found in this timeline yet
        </div>
      )}
    </div>
  );
};