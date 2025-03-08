'use client';

import { GameState } from '@/types/game';

const STORAGE_KEY = 'mekanikGameState';
const SAVE_SLOTS_KEY = 'mekanikSaveSlots';

interface SaveSlotInfo {
  id: string;
  name: string;
  timestamp: number;
  playerName: string;
  playerLevel: number;
  shipName: string;
  screenshot?: string; // Base64 encoded image
}

/**
 * Save the current game state to localStorage
 */
export function saveGame(gameState: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

/**
 * Load the game state from localStorage
 */
export function loadGame(): GameState | null {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState) as GameState;
    }
    return null;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/**
 * Save the game to a specific slot
 */
export function saveToSlot(gameState: GameState, slotName: string): void {
  try {
    // Create a unique ID for the save
    const saveId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create slot info
    const slotInfo: SaveSlotInfo = {
      id: saveId,
      name: slotName,
      timestamp: Date.now(),
      playerName: gameState.player.name,
      playerLevel: gameState.player.level,
      shipName: gameState.ship.name
    };
    
    // Get existing slots
    const existingSlotsJson = localStorage.getItem(SAVE_SLOTS_KEY);
    const slots: Record<string, SaveSlotInfo> = existingSlotsJson 
      ? JSON.parse(existingSlotsJson) 
      : {};
    
    // Add or update slot
    slots[saveId] = slotInfo;
    
    // Save slot info
    localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
    
    // Save actual game state
    localStorage.setItem(`${STORAGE_KEY}_${saveId}`, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save to slot:', error);
  }
}

/**
 * Load a game from a specific slot
 */
export function loadFromSlot(saveId: string): GameState | null {
  try {
    const savedState = localStorage.getItem(`${STORAGE_KEY}_${saveId}`);
    if (savedState) {
      return JSON.parse(savedState) as GameState;
    }
    return null;
  } catch (error) {
    console.error('Failed to load from slot:', error);
    return null;
  }
}

/**
 * Get information about all save slots
 */
export function getSaveSlots(): SaveSlotInfo[] {
  try {
    const slotsJson = localStorage.getItem(SAVE_SLOTS_KEY);
    if (!slotsJson) return [];
    
    const slots = JSON.parse(slotsJson) as Record<string, SaveSlotInfo>;
    return Object.values(slots).sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get save slots:', error);
    return [];
  }
}

/**
 * Delete a save slot
 */
export function deleteSaveSlot(saveId: string): boolean {
  try {
    // Remove the game state
    localStorage.removeItem(`${STORAGE_KEY}_${saveId}`);
    
    // Update slots list
    const slotsJson = localStorage.getItem(SAVE_SLOTS_KEY);
    if (slotsJson) {
      const slots = JSON.parse(slotsJson) as Record<string, SaveSlotInfo>;
      delete slots[saveId];
      localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete save slot:', error);
    return false;
  }
}

/**
 * Export the current game state as a JSON string
 */
export function exportGame(gameState: GameState): string {
  return JSON.stringify(gameState);
}

/**
 * Import a game state from a JSON string
 */
export function importGame(jsonString: string): GameState | null {
  try {
    return JSON.parse(jsonString) as GameState;
  } catch (error) {
    console.error('Failed to import game:', error);
    return null;
  }
} 