import React, { useEffect, useRef } from 'react';
import { Timeline } from '../QuantumDetective';

interface CanvasSceneProps {
  timeline: Timeline;
  progress: number;
  scene: string;
  className?: string;
}

export const CanvasScene: React.FC<CanvasSceneProps> = ({
  timeline,
  progress,
  scene,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const timelineColors = {
      alpha: { primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' },
      beta: { primary: '#10b981', secondary: '#047857', accent: '#34d399' },
      gamma: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
      delta: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
    };

    const colors = timelineColors[timeline];

    drawScene(ctx, scene, colors, progress);
  }, [timeline, progress, scene]);

  const drawScene = (ctx: CanvasRenderingContext2D, sceneType: string, colors: any, progress: number) => {
    const width = ctx.canvas.width / window.devicePixelRatio;
    const height = ctx.canvas.height / window.devicePixelRatio;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.primary + '20');
    gradient.addColorStop(1, colors.secondary + '10');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    switch (sceneType) {
      case 'office':
        drawOfficeScene(ctx, colors, width, height, progress);
        break;
      case 'investigation':
        drawInvestigationScene(ctx, colors, width, height, progress);
        break;
      case 'confrontation':
        drawConfrontationScene(ctx, colors, width, height, progress);
        break;
      case 'quantum':
        drawQuantumScene(ctx, colors, width, height, progress);
        break;
      default:
        drawDefaultScene(ctx, colors, width, height, progress);
    }
    drawQuantumParticles(ctx, colors, width, height);
  };

  const drawOfficeScene = (ctx: CanvasRenderingContext2D, colors: any, width: number, height: number, progress: number) => {
    ctx.fillStyle = colors.secondary + '80';
    ctx.fillRect(width * 0.1, height * 0.3, width * 0.8, height * 0.7);
    
    ctx.fillStyle = colors.accent + '60';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 6; j++) {
        const x = width * 0.15 + i * (width * 0.08);
        const y = height * 0.35 + j * (height * 0.08);
        ctx.fillRect(x, y, width * 0.04, height * 0.04);
      }
    }
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(width * 0.7, height * 0.4, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff0000' + '80';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.7, height * 0.4, 8 + Math.sin(Date.now() * 0.01) * 4, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawInvestigationScene = (ctx: CanvasRenderingContext2D, colors: any, width: number, height: number, progress: number) => {
    ctx.strokeStyle = colors.primary + '60';
    ctx.lineWidth = 2;
    
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.min(width, height) * 0.3;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawConfrontationScene = (ctx: CanvasRenderingContext2D, colors: any, width: number, height: number, progress: number) => {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.3, 0, width * 0.5, height * 0.3, width * 0.6);
    gradient.addColorStop(0, colors.accent + '40');
    gradient.addColorStop(1, colors.secondary + '20');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = colors.secondary + '80';
    ctx.fillRect(width * 0.1, height * 0.4, width * 0.15, height * 0.6);
    ctx.fillRect(width * 0.75, height * 0.4, width * 0.15, height * 0.6);
    ctx.strokeStyle = colors.primary + '60';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(width * 0.25, height * 0.5 + i * 20);
      ctx.lineTo(width * 0.75, height * 0.5 + i * 20);
      ctx.stroke();
    }
  };

  const drawQuantumScene = (ctx: CanvasRenderingContext2D, colors: any, width: number, height: number, progress: number) => {
    const time = Date.now() * 0.001;
    for (let i = 0; i < 50; i++) {
      const x = (i / 50) * width;
      const y = height * 0.5 + Math.sin(x * 0.01 + time) * 50;
      
      ctx.fillStyle = colors.primary + '40';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 4; i++) {
      const x = width * (0.2 + i * 0.2);
      const y = height * 0.5;
      
      ctx.strokeStyle = colors.accent + '80';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 30 + Math.sin(time + i) * 10, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawDefaultScene = (ctx: CanvasRenderingContext2D, colors: any, width: number, height: number, progress: number) => {
    ctx.strokeStyle = colors.primary + '60';
    ctx.lineWidth = 2; 
    for (let i = 0; i < 20; i++) {
      const x = (i / 20) * width;
      const y = height * 0.5 + Math.sin(i * 0.5) * 100;
      
      if (i === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawQuantumParticles = (ctx: CanvasRenderingContext2D, colors: any, width: number, height: number) => {
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 10; i++) {
      const x = (Math.sin(time + i) * 0.5 + 0.5) * width;
      const y = (Math.cos(time * 0.7 + i) * 0.5 + 0.5) * height;
      
      ctx.fillStyle = colors.accent + '60';
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.sin(time * 2 + i) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  return (
    <canvas
      ref={canvasRef}
      className={`rounded-lg border border-primary/30 ${className}`}
      style={{ width: '100%', height: '200px' }}
    />
  );
};