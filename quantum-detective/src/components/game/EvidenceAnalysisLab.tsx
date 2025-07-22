import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Lightbulb, Search, TestTube, Zap, Eye } from 'lucide-react';

interface Evidence {
  id: string;
  name: string;
  description: string;
  imageData?: string;
  analysisData?: {
    uvReveals?: string[];
    magnificationReveals?: string[];
    chemicalReveals?: string[];
  };
}

interface EvidenceAnalysisLabProps {
  evidence: Evidence;
  onClose: () => void;
  onAnalysisComplete: (findings: string[]) => void;
}

export const EvidenceAnalysisLab: React.FC<EvidenceAnalysisLabProps> = ({
  evidence,
  onClose,
  onAnalysisComplete
}) => {
  const [currentTool, setCurrentTool] = useState<'uv' | 'magnify' | 'chemical' | null>(null);
  const [magnification, setMagnification] = useState([1]);
  const [uvIntensity, setUvIntensity] = useState([0]);
  const [chemicalTest, setChemicalTest] = useState<string | null>(null);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tools = [
    { id: 'uv' as const, name: 'UV Light', icon: Lightbulb, color: 'bg-purple-500' },
    { id: 'magnify' as const, name: 'Magnification', icon: Search, color: 'bg-blue-500' },
    { id: 'chemical' as const, name: 'Chemical Tests', icon: TestTube, color: 'bg-green-500' }
  ];

  const chemicalTests = [
    { id: 'luminol', name: 'Luminol (Blood)', color: '#00ffff' },
    { id: 'ninhydrin', name: 'Ninhydrin (Fingerprints)', color: '#ff00ff' },
    { id: 'iodine', name: 'Iodine (Documents)', color: '#8b4513' }
  ];

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawEvidence(ctx);
      }
    }
  }, [currentTool, magnification, uvIntensity, chemicalTest]);

  const drawEvidence = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(50, 50, 300, 200);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 300, 200);
    if (currentTool === 'uv' && uvIntensity[0] > 50) {
      ctx.fillStyle = `rgba(138, 43, 226, ${uvIntensity[0] / 100})`;
      ctx.fillRect(50, 50, 300, 200);
      if (uvIntensity[0] > 80) {
        ctx.fillStyle = '#ff00ff';
        ctx.font = '16px monospace';
        ctx.fillText('HIDDEN TEXT REVEALED', 80, 120);
        
        if (!discoveries.includes('UV reveals hidden writing')) {
          setDiscoveries(prev => [...prev, 'UV reveals hidden writing']);
        }
      }
    }
    
    if (currentTool === 'magnify') {
      const zoom = magnification[0];
      if (zoom > 3) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(150, 120, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        if (zoom > 5) {
          ctx.fillStyle = '#ff0000';
          ctx.font = '12px monospace';
          ctx.fillText('FIBER FOUND', 160, 125);
          
          if (!discoveries.includes('Microscopic fiber evidence')) {
            setDiscoveries(prev => [...prev, 'Microscopic fiber evidence']);
          }
        }
      }
    }
    
    if (currentTool === 'chemical' && chemicalTest) {
      const test = chemicalTests.find(t => t.id === chemicalTest);
      if (test) {
        ctx.fillStyle = test.color + '80';
        ctx.fillRect(50, 50, 300, 200);
        
        ctx.fillStyle = test.color;
        ctx.font = '14px monospace';
        ctx.fillText(`${test.name.split('(')[1].replace(')', '')} DETECTED`, 80, 140);
        
        if (!discoveries.includes(`${test.name} positive result`)) {
          setDiscoveries(prev => [...prev, `${test.name} positive result`]);
        }
      }
    }
  };

  const handleToolSelect = (tool: typeof currentTool) => {
    setCurrentTool(tool);
    if (tool !== 'uv') setUvIntensity([0]);
    if (tool !== 'magnify') setMagnification([1]);
    if (tool !== 'chemical') setChemicalTest(null);
  };

  const completeAnalysis = () => {
    onAnalysisComplete(discoveries);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] bg-card border border-primary/30 flex flex-col">
        <div className="p-4 border-b border-primary/30 flex items-center justify-between">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-primary">
              Evidence Analysis Lab
            </h2>
            <p className="text-muted-foreground">Analyzing: {evidence.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 flex">
          <div className="w-64 p-4 border-r border-primary/30 space-y-4">
            <h3 className="font-orbitron text-lg font-semibold text-secondary">
              Analysis Tools
            </h3>
            
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "outline"}
                className={`w-full justify-start ${currentTool === tool.id ? tool.color : ''}`}
                onClick={() => handleToolSelect(tool.id)}
              >
                <tool.icon className="w-4 h-4 mr-2" />
                {tool.name}
              </Button>
            ))}
            {currentTool === 'uv' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">UV Intensity</label>
                <Slider
                  value={uvIntensity}
                  onValueChange={setUvIntensity}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{uvIntensity[0]}%</span>
              </div>
            )}

            {currentTool === 'magnify' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Magnification</label>
                <Slider
                  value={magnification}
                  onValueChange={setMagnification}
                  min={1}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{magnification[0]}x</span>
              </div>
            )}

            {currentTool === 'chemical' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Chemical Tests</label>
                {chemicalTests.map((test) => (
                  <Button
                    key={test.id}
                    variant={chemicalTest === test.id ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setChemicalTest(test.id)}
                  >
                    <TestTube className="w-3 h-3 mr-1" />
                    {test.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 p-4 space-y-4">
            <div className="border border-primary/30 rounded-lg p-4 bg-muted/10">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full h-auto border rounded"
              />
            </div>
            {discoveries.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-accent flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Discoveries
                </h4>
                <div className="space-y-1">
                  {discoveries.map((discovery, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-1">
                      {discovery}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t border-primary/30 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel Analysis
          </Button>
          <Button 
            onClick={completeAnalysis}
            disabled={discoveries.length === 0}
            className="bg-accent hover:bg-accent/80"
          >
            <Zap className="w-4 h-4 mr-2" />
            Complete Analysis ({discoveries.length} findings)
          </Button>
        </div>
      </Card>
    </div>
  );
};