import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Layers, ScanLine, AlertCircle } from 'lucide-react';

interface Photo {
  id: string;
  name: string;
  timeline: string;
  description: string;
  imageData?: string;
}

interface PhotoComparisonToolProps {
  photos: Photo[];
  onClose: () => void;
  onComparisonComplete: (differences: string[]) => void;
}

export const PhotoComparisonTool: React.FC<PhotoComparisonToolProps> = ({
  photos,
  onClose,
  onComparisonComplete
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<[Photo | null, Photo | null]>([null, null]);
  const [comparisonMode, setComparisonMode] = useState<'sidebyside' | 'overlay' | 'difference'>('sidebyside');
  const [overlayOpacity, setOverlayOpacity] = useState([50]);
  const [detectedDifferences, setDetectedDifferences] = useState<string[]>([]);
  const [highlightedRegions, setHighlightedRegions] = useState<Array<{x: number, y: number, width: number, height: number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const comparisonModes = [
    { id: 'sidebyside' as const, name: 'Side by Side', icon: Layers },
    { id: 'overlay' as const, name: 'Overlay', icon: Eye },
    { id: 'difference' as const, name: 'Difference Map', icon: ScanLine }
  ];

  useEffect(() => {
    if (selectedPhotos[0] && selectedPhotos[1]) {
      drawComparison();
      analyzePhotos();
    }
  }, [selectedPhotos, comparisonMode, overlayOpacity]);

  const selectPhoto = (photo: Photo, slot: 0 | 1) => {
    const newSelection: [Photo | null, Photo | null] = [...selectedPhotos];
    newSelection[slot] = photo;
    setSelectedPhotos(newSelection);
  };

  const drawComparison = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const [photo1, photo2] = selectedPhotos;
    if (!photo1 || !photo2) return;
    const drawMockImage = (x: number, y: number, width: number, height: number, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      
      ctx.fillStyle = '#333';
      ctx.fillRect(x + 20, y + 20, 60, 40);
      ctx.fillRect(x + 100, y + 30, 40, 80);
      
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(label, x + 10, y + height - 10);
    };

    switch (comparisonMode) {
      case 'sidebyside':
        drawMockImage(20, 20, 280, 200, '#f0f0f0', photo1.name);
        drawMockImage(320, 20, 280, 200, '#e0e0e0', photo2.name);
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(310, 20);
        ctx.lineTo(310, 220);
        ctx.stroke();
        break;

      case 'overlay':
        drawMockImage(20, 20, 560, 200, '#f0f0f0', photo1.name);
        
        ctx.globalAlpha = overlayOpacity[0] / 100;
        drawMockImage(20, 20, 560, 200, '#e0e0e0', photo2.name);
        ctx.globalAlpha = 1;
        break;

      case 'difference':
        drawMockImage(20, 20, 560, 200, '#f0f0f0', 'Difference Map');
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        highlightedRegions.forEach(region => {
          ctx.fillRect(20 + region.x, 20 + region.y, region.width, region.height);
        });
        break;
    }
    if (comparisonMode !== 'difference') {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      highlightedRegions.forEach(region => {
        const offsetX = comparisonMode === 'sidebyside' ? (region.x > 280 ? 320 : 20) : 20;
        ctx.strokeRect(offsetX + region.x, 20 + region.y, region.width, region.height);
      });
    }
  };

  const analyzePhotos = () => {
    const [photo1, photo2] = selectedPhotos;
    if (!photo1 || !photo2) return;

    const differences: string[] = [];
    const regions: Array<{x: number, y: number, width: number, height: number}> = [];

    if (photo1.timeline !== photo2.timeline) {
      differences.push(`Cross-timeline comparison: ${photo1.timeline} vs ${photo2.timeline}`);
      
      regions.push(
        { x: 50, y: 30, width: 40, height: 30 },
        { x: 120, y: 80, width: 60, height: 20 },
        { x: 200, y: 50, width: 30, height: 40 }
      );
      
      differences.push('Object position changed');
      differences.push('Shadow direction altered');
      differences.push('Missing evidence in second photo');
    }

    if (photo1.description.includes('evidence') && photo2.description.includes('evidence')) {
      differences.push('Evidence handling differences detected');
      regions.push({ x: 150, y: 100, width: 50, height: 25 });
    }

    setDetectedDifferences(differences);
    setHighlightedRegions(regions);
  };

  const completeComparison = () => {
    onComparisonComplete(detectedDifferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl h-[90vh] bg-card border border-primary/30 flex flex-col">
        <div className="p-4 border-b border-primary/30 flex items-center justify-between">
          <div>
            <h2 className="font-orbitron text-xl font-bold text-primary">
              Photo Comparison Tool
            </h2>
            <p className="text-muted-foreground">Advanced Evidence Analysis</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 flex">
          <div className="w-80 p-4 border-r border-primary/30 space-y-4">
            <div className="space-y-3">
              <h3 className="font-orbitron text-lg font-semibold text-secondary">
                Select Photos
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo 1 (Base)</label>
                <div className="space-y-1">
                  {photos.map((photo) => (
                    <Button
                      key={photo.id}
                      variant={selectedPhotos[0]?.id === photo.id ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs h-auto p-2"
                      onClick={() => selectPhoto(photo, 0)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{photo.name}</div>
                        <div className="text-muted-foreground">{photo.timeline}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Photo 2 (Compare)</label>
                <div className="space-y-1">
                  {photos.map((photo) => (
                    <Button
                      key={photo.id}
                      variant={selectedPhotos[1]?.id === photo.id ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs h-auto p-2"
                      onClick={() => selectPhoto(photo, 1)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{photo.name}</div>
                        <div className="text-muted-foreground">{photo.timeline}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-accent">Comparison Mode</h4>
              {comparisonModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={comparisonMode === mode.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setComparisonMode(mode.id)}
                >
                  <mode.icon className="w-4 h-4 mr-2" />
                  {mode.name}
                </Button>
              ))}
            </div>
            {comparisonMode === 'overlay' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Overlay Opacity</label>
                <Slider
                  value={overlayOpacity}
                  onValueChange={setOverlayOpacity}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{overlayOpacity[0]}%</span>
              </div>
            )}
            {detectedDifferences.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm font-medium">Differences Found</span>
                </div>
                <div className="space-y-1">
                  {detectedDifferences.map((difference, index) => (
                    <Badge key={index} variant="destructive" className="text-xs w-full justify-start">
                      {difference}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="h-full border border-primary/30 rounded-lg bg-muted/10 flex flex-col">
              <div className="p-2 border-b border-primary/30 flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Comparison View - {comparisonModes.find(m => m.id === comparisonMode)?.name}
                  </span>
                </div>
                {selectedPhotos[0] && selectedPhotos[1] && (
                  <Badge variant="outline">
                    {highlightedRegions.length} differences found
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 flex items-center justify-center p-4">
                {selectedPhotos[0] && selectedPhotos[1] ? (
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={260}
                    className="border rounded max-w-full max-h-full"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Select two photos to begin comparison</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-primary/30 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close Tool
          </Button>
          <Button 
            onClick={completeComparison}
            disabled={detectedDifferences.length === 0}
            className="bg-accent hover:bg-accent/80"
          >
            Apply Findings ({detectedDifferences.length})
          </Button>
        </div>
      </Card>
    </div>
  );
};