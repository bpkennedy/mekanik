'use client';

import { useState } from 'react';
import { useGame } from '@/lib/store/gameContext';
import { ComponentData, ModuleType } from '@/types/game';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModuleDisplay from '@/components/game/modules/ModuleDisplay';
import Inventory from '@/components/game/inventory/Inventory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function GamePage() {
  const { state } = useGame();
  const [selectedModuleType, setSelectedModuleType] = useState<ModuleType>('engine');
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  
  // Handle component selection
  const handleSelectComponent = (component: ComponentData) => {
    // This function can be used to show more details about a component
    console.log('Selected component:', component);
  };
  
  // Handle slot selection
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mekanik</h1>
          <p className="text-slate-400">Ship Engineering Simulator</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium">{state.player.name}</div>
          <div className="text-sm text-slate-400">Level {state.player.level} Engineer</div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>{state.ship.name}</div>
                <div className="text-sm font-normal">Credits: {state.credits}</div>
              </CardTitle>
              <CardDescription>
                Ship Status and Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-slate-400">Speed</div>
                  <Progress value={state.ship.performance.speed} className="h-2 mt-1" />
                  <div className="text-right text-xs mt-1">{Math.round(state.ship.performance.speed)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Shield Strength</div>
                  <Progress value={state.ship.performance.shieldStrength} className="h-2 mt-1" />
                  <div className="text-right text-xs mt-1">{Math.round(state.ship.performance.shieldStrength)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Power Output</div>
                  <Progress value={state.ship.performance.powerOutput} className="h-2 mt-1" />
                  <div className="text-right text-xs mt-1">{Math.round(state.ship.performance.powerOutput)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Maneuverability</div>
                  <Progress value={state.ship.performance.maneuverability} className="h-2 mt-1" />
                  <div className="text-right text-xs mt-1">{Math.round(state.ship.performance.maneuverability)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Heat Management</div>
                  <Progress value={state.ship.performance.heatManagement} className="h-2 mt-1" />
                  <div className="text-right text-xs mt-1">{Math.round(state.ship.performance.heatManagement)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Fuel Efficiency</div>
                  <Progress value={state.ship.performance.fuelEfficiency} className="h-2 mt-1" />
                  <div className="text-right text-xs mt-1">{Math.round(state.ship.performance.fuelEfficiency)}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(state.ship.status).map(([key, value]) => (
                  value && (
                    <div 
                      key={key} 
                      className="px-2 py-1 bg-red-900/30 border border-red-500/30 rounded-md text-xs text-red-400"
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="engine" onValueChange={(value) => setSelectedModuleType(value as ModuleType)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="engine">Engine</TabsTrigger>
              <TabsTrigger value="shield">Shield</TabsTrigger>
              <TabsTrigger value="power">Power</TabsTrigger>
            </TabsList>
            
            <TabsContent value="engine">
              <ModuleDisplay moduleType="engine" onSlotSelect={handleSlotSelect} />
            </TabsContent>
            
            <TabsContent value="shield">
              <ModuleDisplay moduleType="shield" onSlotSelect={handleSlotSelect} />
            </TabsContent>
            
            <TabsContent value="power">
              <ModuleDisplay moduleType="power" onSlotSelect={handleSlotSelect} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Inventory 
            onSelectComponent={handleSelectComponent}
            selectedModuleType={selectedModuleType}
            selectedSlot={selectedSlot}
          />
        </div>
      </div>
    </div>
  );
} 