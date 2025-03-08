'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { GameState, ComponentData, ModuleType } from '@/types/game';
import { generateInitialState } from '@/lib/game/initialState';

// Action types
type GameAction =
  | { type: 'INSTALL_COMPONENT'; moduleType: ModuleType; slotType: string; component: ComponentData }
  | { type: 'REMOVE_COMPONENT'; moduleType: ModuleType; slotType: string }
  | { type: 'REPAIR_COMPONENT'; moduleType: ModuleType; slotType: string; amount: number }
  | { type: 'DAMAGE_COMPONENT'; moduleType: ModuleType; slotType: string; amount: number }
  | { type: 'ADD_TO_INVENTORY'; component: ComponentData }
  | { type: 'REMOVE_FROM_INVENTORY'; componentId: string }
  | { type: 'UPDATE_SHIP_PERFORMANCE' }
  | { type: 'SET_GAME_STATE'; state: GameState }
  | { type: 'COMPLETE_MISSION'; missionId: string }
  | { type: 'ADD_CREDITS'; amount: number }
  | { type: 'SUBTRACT_CREDITS'; amount: number }
  | { type: 'TICK_GAME_TIME'; amount: number };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INSTALL_COMPONENT': {
      const { moduleType, slotType, component } = action;
      
      // Create a deep copy of the state
      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      
      // Install the component
      newState.ship.modules[moduleType].components[slotType] = component;
      
      // Remove from inventory
      newState.inventory = newState.inventory.filter(item => item.id !== component.id);
      
      // Update ship performance (simple implementation for now)
      // In a real implementation, this would be more complex and calculate based on all components
      
      return newState;
    }
    
    case 'REMOVE_COMPONENT': {
      const { moduleType, slotType } = action;
      
      // Create a deep copy of the state
      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      
      // Get the component before removing it
      const component = newState.ship.modules[moduleType].components[slotType];
      
      if (component) {
        // Add to inventory
        newState.inventory.push(component);
        
        // Remove from module
        newState.ship.modules[moduleType].components[slotType] = null;
      }
      
      return newState;
    }
    
    case 'REPAIR_COMPONENT': {
      const { moduleType, slotType, amount } = action;
      
      // Create a deep copy of the state
      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      
      const component = newState.ship.modules[moduleType].components[slotType];
      
      if (component) {
        // Increase durability up to 100
        const newDurability = Math.min(100, component.properties.durability + amount);
        component.properties.durability = newDurability;
        
        // Update condition based on durability
        if (newDurability > 80) {
          component.secondaryProperties.condition = 'pristine';
        } else if (newDurability > 40) {
          component.secondaryProperties.condition = 'damaged';
        } else {
          component.secondaryProperties.condition = 'degraded';
        }
      }
      
      return newState;
    }
    
    case 'DAMAGE_COMPONENT': {
      const { moduleType, slotType, amount } = action;
      
      // Create a deep copy of the state
      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      
      const component = newState.ship.modules[moduleType].components[slotType];
      
      if (component) {
        // Decrease durability, minimum 0
        const newDurability = Math.max(0, component.properties.durability - amount);
        component.properties.durability = newDurability;
        
        // Update condition based on durability
        if (newDurability > 80) {
          component.secondaryProperties.condition = 'pristine';
        } else if (newDurability > 40) {
          component.secondaryProperties.condition = 'damaged';
        } else {
          component.secondaryProperties.condition = 'degraded';
        }
      }
      
      return newState;
    }
    
    case 'ADD_TO_INVENTORY': {
      return {
        ...state,
        inventory: [...state.inventory, action.component]
      };
    }
    
    case 'REMOVE_FROM_INVENTORY': {
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.componentId)
      };
    }
    
    case 'UPDATE_SHIP_PERFORMANCE': {
      // In a real implementation, this would calculate performance based on all installed components
      // For now, we'll just return the state unchanged
      return state;
    }
    
    case 'SET_GAME_STATE': {
      return action.state;
    }
    
    case 'COMPLETE_MISSION': {
      const newState = JSON.parse(JSON.stringify(state)) as GameState;
      
      // Find the mission
      const mission = newState.missions.find(m => m.id === action.missionId);
      
      if (mission) {
        // Update mission status
        mission.status = 'completed';
        
        // Add rewards
        newState.credits += mission.rewards.credits;
        newState.player.experience += mission.rewards.experience;
        
        // Add component rewards to inventory if any
        if (mission.rewards.components) {
          newState.inventory = [...newState.inventory, ...mission.rewards.components];
        }
      }
      
      return newState;
    }
    
    case 'ADD_CREDITS': {
      return {
        ...state,
        credits: state.credits + action.amount
      };
    }
    
    case 'SUBTRACT_CREDITS': {
      return {
        ...state,
        credits: Math.max(0, state.credits - action.amount)
      };
    }
    
    case 'TICK_GAME_TIME': {
      return {
        ...state,
        gameTime: state.gameTime + action.amount
      };
    }
    
    default:
      return state;
  }
}

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    // Initialize with default state
    return generateInitialState();
  });
  
  // Load game from localStorage on mount
  useEffect(() => {
    const loadGame = async () => {
      try {
        const savedState = localStorage.getItem('mekanikGameState');
        
        if (savedState) {
          const parsedState = JSON.parse(savedState) as GameState;
          dispatch({ type: 'SET_GAME_STATE', state: parsedState });
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGame();
  }, []);
  
  // Save game to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mekanikGameState', JSON.stringify(state));
    }
  }, [state, isLoading]);
  
  return (
    <GameContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook for using the game context
export function useGame() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
} 