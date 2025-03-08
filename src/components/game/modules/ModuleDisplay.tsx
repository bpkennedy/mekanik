'use client';

import { useGame } from '@/lib/store/gameContext';
import { ModuleType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

interface ModuleDisplayProps {
  moduleType: ModuleType;
  onSlotSelect?: (slotId: string) => void;
}

export default function ModuleDisplay({ moduleType, onSlotSelect }: ModuleDisplayProps) {
  const { state, dispatch } = useGame();
  const moduleData = state.ship.modules[moduleType];
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Format module type for display
  const moduleTitle = moduleType.charAt(0).toUpperCase() + moduleType.slice(1);
  
  // Get background color class based on module type
  const getModuleColorClass = (type: ModuleType): string => {
    switch (type) {
      case 'engine':
        return 'bg-orange-950/20 border-orange-500/30';
      case 'shield':
        return 'bg-blue-950/20 border-blue-500/30';
      case 'power':
        return 'bg-purple-950/20 border-purple-500/30';
      default:
        return 'bg-slate-950/20 border-slate-500/30';
    }
  };
  
  // Get text color class based on module type
  const getModuleTextClass = (type: ModuleType): string => {
    switch (type) {
      case 'engine':
        return 'text-orange-500';
      case 'shield':
        return 'text-blue-500';
      case 'power':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };
  
  // Handle component removal
  const handleRemoveComponent = (slotType: string) => {
    dispatch({
      type: 'REMOVE_COMPONENT',
      moduleType,
      slotType
    });
    
    // Update ship performance after component removal
    dispatch({ type: 'UPDATE_SHIP_PERFORMANCE' });
  };
  
  // Handle slot selection
  const handleSlotClick = (slotType: string) => {
    setSelectedSlot(slotType);
    
    // Call the parent's onSlotSelect if provided
    if (onSlotSelect) {
      onSlotSelect(slotType);
    }
  };
  
  return (
    <Card className={`shadow-lg w-full ${getModuleColorClass(moduleType)}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${getModuleTextClass(moduleType)}`}>
          {moduleTitle} Module
        </CardTitle>
        <CardDescription>
          Health: <Progress value={moduleData.health} className="h-2 mt-1" />
          Efficiency: <Progress value={moduleData.efficiency} className="h-2 mt-1" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(moduleData.components).map(([slotType, component]) => (
            <div 
              key={slotType} 
              className={`
                border rounded-md p-4 h-48 flex flex-col
                ${selectedSlot === slotType ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-0'}
                ${component ? 'bg-slate-900/50' : 'bg-slate-950/50 border-dashed'}
              `}
              onClick={() => handleSlotClick(slotType)}
            >
              <div className="text-sm text-slate-400 mb-2">
                Slot: {slotType.replace('slot', '')}
              </div>
              
              {component ? (
                <>
                  <div className="flex-1">
                    <h4 className="font-medium text-md">{component.name}</h4>
                    <div className="text-xs text-slate-400 mt-1">{component.subtype}</div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="text-xs">
                        Power Rating: {component.properties.powerRating}
                      </div>
                      <div className="text-xs">
                        Durability:
                        <Progress 
                          value={component.properties.durability} 
                          className={`h-1 mt-1 ${
                            component.properties.durability > 80 ? "bg-green-500/20" :
                            component.properties.durability > 40 ? "bg-yellow-500/20" : 
                            "bg-red-500/20"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveComponent(slotType);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <span className="block">Empty Slot</span>
                    <span className="text-xs">Click to install a component</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <h4 className="font-medium mb-2">Performance</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
          {Object.entries(moduleData.performance).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-sm text-slate-400">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <span className="text-sm font-mono">{Math.round(value * 10) / 10}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
} 