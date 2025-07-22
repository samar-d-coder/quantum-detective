import { useState, useEffect } from 'react';
import { GameData } from '@/components/QuantumDetective';

const STORAGE_KEY = 'quantum-detective-save';
const SETTINGS_KEY = 'quantum-detective-settings';

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  autoSave: boolean;
  difficulty: 'rookie' | 'investigator' | 'bender';
  subtitles: boolean;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicVolume: 0.7,
  effectsVolume: 0.8,
  autoSave: true,
  difficulty: 'investigator',
  subtitles: false
};

export const useGameStorage = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [saveSlots, setSaveSlots] = useState<(GameData | null)[]>([null, null, null]);

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }

    for (let i = 0; i < 3; i++) {
      const slotData = localStorage.getItem(`${STORAGE_KEY}-slot-${i}`);
      if (slotData) {
        try {
          setSaveSlots(prev => {
            const newSlots = [...prev];
            newSlots[i] = JSON.parse(slotData);
            return newSlots;
          });
        } catch (error) {
          console.error(`Failed to load save slot ${i}:`, error);
        }
      }
    }
  }, []);

  const saveSettings = (newSettings: Partial<GameSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  };

  const saveGame = (gameData: GameData, slot: number = 0) => {
    try {
      const saveData = {
        ...gameData,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      
      localStorage.setItem(`${STORAGE_KEY}-slot-${slot}`, JSON.stringify(saveData));
      setSaveSlots(prev => {
        const newSlots = [...prev];
        newSlots[slot] = saveData;
        return newSlots;
      });
      
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  };

  const loadGame = (slot: number = 0): GameData | null => {
    try {
      const savedData = localStorage.getItem(`${STORAGE_KEY}-slot-${slot}`);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
    return null;
  };

  const deleteGame = (slot: number) => {
    localStorage.removeItem(`${STORAGE_KEY}-slot-${slot}`);
    setSaveSlots(prev => {
      const newSlots = [...prev];
      newSlots[slot] = null;
      return newSlots;
    });
  };

  const hasAnySave = () => saveSlots.some(slot => slot !== null);

  return {
    settings,
    saveSettings,
    saveSlots,
    saveGame,
    loadGame,
    deleteGame,
    hasAnySave
  };
};