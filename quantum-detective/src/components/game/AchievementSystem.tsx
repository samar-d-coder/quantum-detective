import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Lock, Zap, Eye, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  category: 'investigation' | 'story' | 'quantum' | 'speed' | 'completion';
}

interface AchievementSystemProps {
  gameData: any;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const achievements: Achievement[] = [
  {
    id: 'first_clue',
    title: 'First Discovery',
    description: 'Find your first piece of evidence',
    icon: 'search',
    rarity: 'common',
    points: 10,
    unlocked: false,
    category: 'investigation'
  },
  {
    id: 'timeline_jumper',
    title: 'Quantum Leap',
    description: 'Switch timelines for the first time',
    icon: 'zap',
    rarity: 'common',
    points: 15,
    unlocked: false,
    category: 'quantum'
  },
  {
    id: 'fast_thinker',
    title: 'Lightning Detective',
    description: 'Solve the first chapter in under 5 minutes',
    icon: 'clock',
    rarity: 'rare',
    points: 25,
    unlocked: false,
    category: 'speed'
  },
  {
    id: 'evidence_collector',
    title: 'Master Investigator',
    description: 'Collect 10 pieces of evidence',
    icon: 'trophy',
    rarity: 'rare',
    points: 30,
    unlocked: false,
    category: 'investigation'
  },
  {
    id: 'quantum_master',
    title: 'Reality Bender',
    description: 'Visit all four timelines in a single chapter',
    icon: 'star',
    rarity: 'epic',
    points: 50,
    unlocked: false,
    category: 'quantum'
  },
  {
    id: 'perfect_case',
    title: 'Quantum Detective',
    description: 'Solve the case with 100% evidence collection',
    icon: 'eye',
    rarity: 'legendary',
    points: 100,
    unlocked: false,
    category: 'completion'
  }
];

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  gameData,
  onAchievementUnlock
}) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  useEffect(() => {
    const checkAchievements = () => {
      const newUnlocks: Achievement[] = [];

      achievements.forEach(achievement => {
        if (!unlockedAchievements.find(a => a.id === achievement.id)) {
          let shouldUnlock = false;

          switch (achievement.id) {
            case 'first_clue':
              shouldUnlock = gameData.evidence?.length > 0;
              break;
            case 'timeline_jumper':
              shouldUnlock = gameData.currentTimeline !== 'alpha' || 
                Object.values(gameData.storyProgress || {}).some((p: any) => Number(p) > 0);
              break;
            case 'fast_thinker':
              shouldUnlock = Number(gameData.storyProgress?.[gameData.currentTimeline] || 0) >= 1;
              break;
            case 'evidence_collector':
              shouldUnlock = gameData.evidence?.length >= 10;
              break;
            case 'quantum_master':
              shouldUnlock = Object.values(gameData.storyProgress || {}).filter((p: any) => Number(p) > 0).length >= 4;
              break;
            case 'perfect_case':
              shouldUnlock = gameData.evidence?.length >= 15 && 
                Object.values(gameData.storyProgress || {}).every((p: any) => Number(p) >= 5);
              break;
          }

          if (shouldUnlock) {
            const unlockedAchievement = { ...achievement, unlocked: true };
            newUnlocks.push(unlockedAchievement);
          }
        }
      });

      if (newUnlocks.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newUnlocks]);
        setShowNotification(newUnlocks[0]);
        setTimeout(() => setShowNotification(null), 3000);
        const newPoints = newUnlocks.reduce((sum, a) => sum + a.points, totalPoints);
        setTotalPoints(newPoints);
        newUnlocks.forEach(achievement => {
          onAchievementUnlock?.(achievement);
        });
      }
    };

    checkAchievements();
  }, [gameData, unlockedAchievements, totalPoints, onAchievementUnlock]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-slate-400 bg-slate-100';
      case 'rare': return 'text-blue-400 bg-blue-100';
      case 'epic': return 'text-purple-400 bg-purple-100';
      case 'legendary': return 'text-yellow-400 bg-yellow-100';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'search': return <Eye className="w-4 h-4" />;
      case 'zap': return <Zap className="w-4 h-4" />;
      case 'clock': return <Clock className="w-4 h-4" />;
      case 'trophy': return <Trophy className="w-4 h-4" />;
      case 'star': return <Star className="w-4 h-4" />;
      case 'eye': return <Eye className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  {getIcon(showNotification.icon)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">Achievement Unlocked!</div>
                  <div className="text-sm text-muted-foreground">{showNotification.title}</div>
                  <Badge className={getRarityColor(showNotification.rarity)}>
                    +{showNotification.points} points
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-semibold">Detective Rank</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{totalPoints} points</div>
              <div className="text-sm text-muted-foreground">
                {unlockedAchievements.length}/{achievements.length} unlocked
              </div>
            </div>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(unlockedAchievements.length / achievements.length) * 100}%` 
              }}
            />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {achievements.map(achievement => {
          const isUnlocked = unlockedAchievements.find(a => a.id === achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0.5 }}
              animate={{ 
                opacity: isUnlocked ? 1 : 0.5,
                scale: isUnlocked ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`p-3 transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/50' 
                  : 'bg-card/30 border-muted'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isUnlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isUnlocked ? getIcon(achievement.icon) : <Lock className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-semibold ${
                      isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.description}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {achievement.points} pts
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};