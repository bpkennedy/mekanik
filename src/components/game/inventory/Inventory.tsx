'use client';

import { useGame } from '@/lib/store/gameContext';
import { ComponentData, ModuleType } from '@/types/game';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComponentCard from '../components/ComponentCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface InventoryProps {
  onSelectComponent?: (component: ComponentData) => void;
  selectedModuleType?: ModuleType;
  selectedSlot?: string;
}

export default function Inventory({ 
  onSelectComponent, 
  selectedModuleType, 
  selectedSlot 
}: InventoryProps) {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  
  // Filter components by type for tabs
  const filterComponents = (filter: string): ComponentData[] => {
    if (filter === 'all') {
      return state.inventory;
    } else {
      return state.inventory.filter(component => component.type === filter);
    }
  };
  
  // Install component into the selected module and slot
  const handleInstall = (component: ComponentData) => {
    if (selectedModuleType && selectedSlot) {
      dispatch({
        type: 'INSTALL_COMPONENT',
        moduleType: selectedModuleType,
        slotType: selectedSlot,
        component
      });
      
      // Update ship performance after installation
      dispatch({ type: 'UPDATE_SHIP_PERFORMANCE' });
      
      // Close component detail if open
      setSelectedComponent(null);
    }
    
    // Call the onSelectComponent callback if provided
    if (onSelectComponent) {
      onSelectComponent(component);
    }
  };
  
  // Handle repair of a component
  const handleRepair = (component: ComponentData) => {
    // For simplicity, repair adds 20% durability
    const repairAmount = 20;
    
    // Find the index of the component in inventory
    const componentIndex = state.inventory.findIndex(c => c.id === component.id);
    
    if (componentIndex !== -1) {
      // Create a copy of the component with updated durability
      const updatedComponent = { ...component };
      updatedComponent.properties.durability = Math.min(100, component.properties.durability + repairAmount);
      
      // Update condition based on durability
      if (updatedComponent.properties.durability > 80) {
        updatedComponent.secondaryProperties.condition = 'pristine';
      } else if (updatedComponent.properties.durability > 40) {
        updatedComponent.secondaryProperties.condition = 'damaged';
      } else {
        updatedComponent.secondaryProperties.condition = 'degraded';
      }
      
      // Remove old component and add updated one
      dispatch({ type: 'REMOVE_FROM_INVENTORY', componentId: component.id });
      dispatch({ type: 'ADD_TO_INVENTORY', component: updatedComponent });
      
      // Update selected component if open
      if (selectedComponent && selectedComponent.id === component.id) {
        setSelectedComponent(updatedComponent);
      }
    }
  };
  
  // Filter components that are compatible with the selected module
  const filteredComponents = filterComponents(activeTab);
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Inventory
          <span className="text-sm font-normal">
            {state.inventory.length} item{state.inventory.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
        <CardDescription>
          Components available for installation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="engine">Engine</TabsTrigger>
            <TabsTrigger value="shield">Shield</TabsTrigger>
            <TabsTrigger value="power">Power</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredComponents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComponents.map(component => (
                  <Dialog key={component.id}>
                    <DialogTrigger asChild>
                      <Card 
                        className="cursor-pointer hover:ring-1 hover:ring-blue-500/50 transition-all"
                        onClick={() => setSelectedComponent(component)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{component.name}</h4>
                              <p className="text-sm text-slate-400">
                                {component.subtype.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                            </div>
                            <div className={`
                              px-2 py-1 text-xs rounded-full
                              ${component.rarity === 'common' ? 'bg-slate-800' : 
                                component.rarity === 'uncommon' ? 'bg-green-800' : 
                                component.rarity === 'rare' ? 'bg-blue-800' : 
                                'bg-orange-800'}
                            `}>
                              {component.rarity.charAt(0).toUpperCase() + component.rarity.slice(1)}
                            </div>
                          </div>
                          
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <div>Power: {component.properties.powerRating}</div>
                            <div>Size: {component.properties.sizeClass}</div>
                            <div className={`
                              ${component.secondaryProperties.condition === 'pristine' ? 'text-green-500' : 
                                component.secondaryProperties.condition === 'damaged' ? 'text-yellow-500' : 
                                'text-red-500'}
                            `}>
                              {component.secondaryProperties.condition.charAt(0).toUpperCase() + 
                               component.secondaryProperties.condition.slice(1)}
                            </div>
                            <div>Mass: {component.properties.mass} kg</div>
                          </div>
                          
                          {selectedModuleType && selectedSlot && component.type === selectedModuleType && (
                            <div className="mt-2">
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInstall(component);
                                }}
                              >
                                Install
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Component Details</DialogTitle>
                      </DialogHeader>
                      <ComponentCard 
                        component={component} 
                        onInstall={selectedModuleType && selectedSlot && component.type === selectedModuleType ? 
                          () => handleInstall(component) : undefined}
                        onRepair={() => handleRepair(component)}
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <p>No components found</p>
                {activeTab !== 'all' && (
                  <Button variant="link" onClick={() => setActiveTab('all')}>
                    View all components
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 