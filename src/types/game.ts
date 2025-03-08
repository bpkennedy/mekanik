// Game Data Types
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type ModuleType = 'engine' | 'shield' | 'power';
export type ComponentSizeClass = 'S' | 'M' | 'L' | 'XL';
export type ComponentCondition = 'pristine' | 'damaged' | 'degraded';

// Component subtypes
export type EngineComponentType = 'propulsionCore' | 'thrustModulator' | 'coolantSystem';
export type ShieldComponentType = 'barrierProjector' | 'shieldHarmonic' | 'energyDistribution';
export type PowerComponentType = 'energySource' | 'stabilizer' | 'amplifier';
export type ComponentSubtype = EngineComponentType | ShieldComponentType | PowerComponentType;

export interface Material {
  id: string;
  name: string;
  quantity: number;
}

export interface SpecialEffect {
  id: string;
  name: string;
  description: string;
  effect: (state: GameState) => void;
}

export interface ComponentProperties {
  powerRating: number;
  energyConsumption: number;
  heatGeneration: number;
  durability: number;
  mass: number;
  sizeClass: ComponentSizeClass;
}

export interface ComponentSecondaryProperties {
  compatibility: string[];
  specialEffects: SpecialEffect[];
  condition: ComponentCondition;
  requiredTechLevel: number;
  materialComposition: Material[];
}

export interface ComponentData {
  id: string;
  name: string;
  type: ModuleType;
  subtype: ComponentSubtype;
  rarity: Rarity;
  properties: ComponentProperties;
  secondaryProperties: ComponentSecondaryProperties;
  sprite: string; // Reference to sprite sheet position
  description: string;
}

export interface ModulePerformanceMetrics {
  efficiency: number;
  stability: number;
  output: number;
  heat: number;
  // Module-specific metrics
  [key: string]: number;
}

export interface ModuleData {
  id: string;
  type: ModuleType;
  health: number;
  efficiency: number;
  components: {
    [slotType: string]: ComponentData | null;
  };
  performance: ModulePerformanceMetrics;
}

export interface ShipPerformanceMetrics {
  speed: number;
  maneuverability: number;
  shieldStrength: number;
  powerOutput: number;
  heatManagement: number;
  fuelEfficiency: number;
}

export interface ShipStatusEffects {
  overheating: boolean;
  powerFluctuations: boolean;
  shieldHarmonicsDestabilized: boolean;
  coolantLeak: boolean;
  powerSurge: boolean;
}

export interface ShipData {
  id: string;
  name: string;
  modules: {
    engine: ModuleData;
    shield: ModuleData;
    power: ModuleData;
  };
  performance: ShipPerformanceMetrics;
  status: ShipStatusEffects;
}

export interface PlayerData {
  id: string;
  name: string;
  experience: number;
  level: number;
  skills: {
    engineering: number;
    diagnostics: number;
    powerSystems: number;
    propulsionSystems: number;
    defenseSystems: number;
  };
}

export interface MissionObjective {
  id: string;
  description: string;
  completed: boolean;
  requiredPerformance?: Partial<ShipPerformanceMetrics>;
}

export interface MissionReward {
  credits: number;
  experience: number;
  components?: ComponentData[];
}

export interface MissionData {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  timeLimit: number | null; // null means no time limit
  objectives: MissionObjective[];
  rewards: MissionReward;
  status: 'available' | 'active' | 'completed' | 'failed';
}

export interface GameState {
  player: PlayerData;
  ship: ShipData;
  inventory: ComponentData[];
  missions: MissionData[];
  gameTime: number;
  credits: number;
  settings: {
    soundEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
    tutorialEnabled: boolean;
  };
} 