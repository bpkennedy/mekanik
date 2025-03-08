'use client';

import { ComponentData, Rarity } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ComponentCardProps {
  component: ComponentData;
  onInstall?: () => void;
  onRepair?: () => void;
  showActions?: boolean;
}

export default function ComponentCard({ component, onInstall, onRepair, showActions = true }: ComponentCardProps) {
  // Get color class based on rarity
  const getRarityColorClass = (rarity: Rarity): string => {
    switch (rarity) {
      case 'common':
        return 'border-slate-500/40 bg-slate-950/40';
      case 'uncommon':
        return 'border-green-500/40 bg-green-950/40';
      case 'rare':
        return 'border-blue-500/40 bg-blue-950/40';
      case 'legendary':
        return 'border-orange-500/40 bg-orange-950/40';
      default:
        return 'border-slate-500/40 bg-slate-950/40';
    }
  };
  
  // Get badge color based on rarity
  const getRarityBadgeClass = (rarity: Rarity): string => {
    switch (rarity) {
      case 'common':
        return 'bg-slate-500/40';
      case 'uncommon':
        return 'bg-green-500/40';
      case 'rare':
        return 'bg-blue-500/40';
      case 'legendary':
        return 'bg-orange-500/40';
      default:
        return 'bg-slate-500/40';
    }
  };
  
  // Get condition color
  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case 'pristine':
        return 'text-green-500';
      case 'damaged':
        return 'text-yellow-500';
      case 'degraded':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };
  
  return (
    <Card className={`shadow-md ${getRarityColorClass(component.rarity)}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{component.name}</CardTitle>
          <Badge className={getRarityBadgeClass(component.rarity)}>
            {component.rarity.charAt(0).toUpperCase() + component.rarity.slice(1)}
          </Badge>
        </div>
        <CardDescription>
          {component.subtype.replace(/([A-Z])/g, ' $1').trim()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm mb-4">{component.description}</p>
        
        <div className="space-y-3">
          <div>
            <span className="text-xs text-slate-400">Power Rating</span>
            <div className="flex justify-between items-center">
              <Progress value={component.properties.powerRating} max={100} className="flex-1 h-2" />
              <span className="text-xs ml-2 w-6 text-right">{component.properties.powerRating}</span>
            </div>
          </div>
          
          <div>
            <span className="text-xs text-slate-400">Energy Consumption</span>
            <div className="flex justify-between items-center">
              <Progress value={component.properties.energyConsumption} max={100} className="flex-1 h-2" />
              <span className="text-xs ml-2 w-6 text-right">{component.properties.energyConsumption}</span>
            </div>
          </div>
          
          <div>
            <span className="text-xs text-slate-400">Heat Generation</span>
            <div className="flex justify-between items-center">
              <Progress 
                value={Math.abs(component.properties.heatGeneration)} 
                max={100} 
                className={`flex-1 h-2 ${component.properties.heatGeneration < 0 ? 'bg-blue-950/40' : 'bg-red-950/40'}`} 
              />
              <span className="text-xs ml-2 w-6 text-right">{component.properties.heatGeneration}</span>
            </div>
          </div>
          
          <div>
            <span className="text-xs text-slate-400">Durability</span>
            <div className="flex justify-between items-center">
              <Progress 
                value={component.properties.durability} 
                max={100}
                className={`flex-1 h-2 ${
                  component.properties.durability > 80 ? 'bg-green-950/40' :
                  component.properties.durability > 40 ? 'bg-yellow-950/40' :
                  'bg-red-950/40'
                }`}
              />
              <span className="text-xs ml-2 w-6 text-right">{component.properties.durability}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-slate-400">Mass</span>
            <p className="text-sm">{component.properties.mass} kg</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Size</span>
            <p className="text-sm">Class {component.properties.sizeClass}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Condition</span>
            <p className={`text-sm ${getConditionColor(component.secondaryProperties.condition)}`}>
              {component.secondaryProperties.condition.charAt(0).toUpperCase() + component.secondaryProperties.condition.slice(1)}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Tech Level</span>
            <p className="text-sm">{component.secondaryProperties.requiredTechLevel}</p>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex gap-2 pt-2">
          {onInstall && (
            <Button 
              size="sm" 
              variant="default" 
              className="flex-1"
              onClick={onInstall}
            >
              Install
            </Button>
          )}
          
          {onRepair && component.properties.durability < 100 && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={onRepair}
            >
              Repair
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 