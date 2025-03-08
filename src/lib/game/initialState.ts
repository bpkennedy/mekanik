import { GameState, ComponentData, ModuleData, ShipData, PlayerData, MissionData } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

// Helper to create an empty module
function createEmptyModule(type: 'engine' | 'shield' | 'power'): ModuleData {
  return {
    id: uuidv4(),
    type,
    health: 100,
    efficiency: 100,
    components: {
      // Each module will have 3 component slots
      slot1: null,
      slot2: null,
      slot3: null
    },
    performance: {
      efficiency: 0,
      stability: 0,
      output: 0,
      heat: 0
    }
  };
}

// Create initial ship
function createInitialShip(): ShipData {
  return {
    id: uuidv4(),
    name: 'The Nebula Voyager',
    modules: {
      engine: createEmptyModule('engine'),
      shield: createEmptyModule('shield'),
      power: createEmptyModule('power')
    },
    performance: {
      speed: 0,
      maneuverability: 0,
      shieldStrength: 0,
      powerOutput: 0,
      heatManagement: 0,
      fuelEfficiency: 0
    },
    status: {
      overheating: false,
      powerFluctuations: false,
      shieldHarmonicsDestabilized: false,
      coolantLeak: false,
      powerSurge: false
    }
  };
}

// Create initial player data
function createInitialPlayer(): PlayerData {
  return {
    id: uuidv4(),
    name: 'Rookie Engineer',
    experience: 0,
    level: 1,
    skills: {
      engineering: 1,
      diagnostics: 1,
      powerSystems: 1,
      propulsionSystems: 1,
      defenseSystems: 1
    }
  };
}

// Create some starter components for the player's inventory
function createStarterComponents(): ComponentData[] {
  return [
    // Basic Fusion Reactor (Engine - Propulsion Core)
    {
      id: uuidv4(),
      name: 'Basic Fusion Reactor',
      type: 'engine',
      subtype: 'propulsionCore',
      rarity: 'common',
      properties: {
        powerRating: 40,
        energyConsumption: 35,
        heatGeneration: 45,
        durability: 100,
        mass: 120,
        sizeClass: 'M'
      },
      secondaryProperties: {
        compatibility: ['Standard Radiator Grid', 'Basic Thrust Vectoring Vanes'],
        specialEffects: [],
        condition: 'pristine',
        requiredTechLevel: 1,
        materialComposition: [
          { id: uuidv4(), name: 'Steel Alloy', quantity: 5 },
          { id: uuidv4(), name: 'Copper Wiring', quantity: 3 }
        ]
      },
      sprite: 'engine_core_common_1',
      description: 'A standard fusion reactor that provides basic propulsion capabilities. Reliable but not particularly efficient.'
    },
    
    // Basic Thrust Vectoring Vanes (Engine - Thrust Modulator)
    {
      id: uuidv4(),
      name: 'Basic Thrust Vectoring Vanes',
      type: 'engine',
      subtype: 'thrustModulator',
      rarity: 'common',
      properties: {
        powerRating: 35,
        energyConsumption: 25,
        heatGeneration: 30,
        durability: 100,
        mass: 70,
        sizeClass: 'S'
      },
      secondaryProperties: {
        compatibility: ['Basic Fusion Reactor', 'Standard Radiator Grid'],
        specialEffects: [],
        condition: 'pristine',
        requiredTechLevel: 1,
        materialComposition: [
          { id: uuidv4(), name: 'Aluminum Plating', quantity: 4 },
          { id: uuidv4(), name: 'Control Circuits', quantity: 2 }
        ]
      },
      sprite: 'engine_mod_common_1',
      description: 'Simple vanes that direct engine thrust. Provides basic maneuverability for the ship.'
    },
    
    // Standard Radiator Grid (Engine - Coolant System)
    {
      id: uuidv4(),
      name: 'Standard Radiator Grid',
      type: 'engine',
      subtype: 'coolantSystem',
      rarity: 'common',
      properties: {
        powerRating: 30,
        energyConsumption: 15,
        heatGeneration: -50, // Negative because it reduces heat
        durability: 100,
        mass: 85,
        sizeClass: 'M'
      },
      secondaryProperties: {
        compatibility: ['Basic Fusion Reactor', 'Basic Thrust Vectoring Vanes'],
        specialEffects: [],
        condition: 'pristine',
        requiredTechLevel: 1,
        materialComposition: [
          { id: uuidv4(), name: 'Cooling Pipes', quantity: 6 },
          { id: uuidv4(), name: 'Heat-Resistant Alloy', quantity: 3 }
        ]
      },
      sprite: 'engine_cool_common_1',
      description: 'A basic radiator system that dissipates excess heat from the engine.'
    },
    
    // Electromagnetic Deflector (Shield - Barrier Projector)
    {
      id: uuidv4(),
      name: 'Electromagnetic Deflector',
      type: 'shield',
      subtype: 'barrierProjector',
      rarity: 'common',
      properties: {
        powerRating: 40,
        energyConsumption: 45,
        heatGeneration: 20,
        durability: 100,
        mass: 90,
        sizeClass: 'M'
      },
      secondaryProperties: {
        compatibility: ['Fixed Frequency Matrix', 'Linear Power Conduit'],
        specialEffects: [],
        condition: 'pristine',
        requiredTechLevel: 1,
        materialComposition: [
          { id: uuidv4(), name: 'Conductive Mesh', quantity: 5 },
          { id: uuidv4(), name: 'Field Emitters', quantity: 4 }
        ]
      },
      sprite: 'shield_proj_common_1',
      description: 'Basic shield projector that creates a weak electromagnetic field around the ship.'
    },
    
    // Fusion Reactor (Power - Energy Source)
    {
      id: uuidv4(),
      name: 'Fusion Reactor',
      type: 'power',
      subtype: 'energySource',
      rarity: 'common',
      properties: {
        powerRating: 60,
        energyConsumption: 0, // It's a generator, so it doesn't consume energy
        heatGeneration: 55,
        durability: 100,
        mass: 150,
        sizeClass: 'L'
      },
      secondaryProperties: {
        compatibility: ['Mechanical Governor', 'Power Boosting Circuit'],
        specialEffects: [],
        condition: 'pristine',
        requiredTechLevel: 1,
        materialComposition: [
          { id: uuidv4(), name: 'Containment Vessel', quantity: 5 },
          { id: uuidv4(), name: 'Plasma Injectors', quantity: 3 },
          { id: uuidv4(), name: 'Cooling Rods', quantity: 4 }
        ]
      },
      sprite: 'power_source_common_1',
      description: 'Standard fusion reactor that provides the base power for all ship systems.'
    }
  ];
}

// Create initial missions
function createInitialMissions(): MissionData[] {
  return [
    {
      id: uuidv4(),
      name: 'First Steps: Engine Installation',
      description: 'The ship\'s engine module is completely empty. Install basic components to get it working.',
      difficulty: 1,
      timeLimit: null, // No time limit for the tutorial mission
      objectives: [
        {
          id: uuidv4(),
          description: 'Install a Propulsion Core in the engine module',
          completed: false
        },
        {
          id: uuidv4(),
          description: 'Install a Thrust Modulator in the engine module',
          completed: false
        },
        {
          id: uuidv4(),
          description: 'Install a Coolant System in the engine module',
          completed: false
        }
      ],
      rewards: {
        credits: 100,
        experience: 50
      },
      status: 'available'
    },
    {
      id: uuidv4(),
      name: 'Power Up: Core Systems',
      description: 'The ship needs power. Install the basic power generation components.',
      difficulty: 1,
      timeLimit: null,
      objectives: [
        {
          id: uuidv4(),
          description: 'Install an Energy Source in the power module',
          completed: false
        }
      ],
      rewards: {
        credits: 75,
        experience: 40,
        components: [] // Will be filled with a mechanical governor reward when completed
      },
      status: 'available'
    }
  ];
}

// Generate complete initial game state
export function generateInitialState(): GameState {
  return {
    player: createInitialPlayer(),
    ship: createInitialShip(),
    inventory: createStarterComponents(),
    missions: createInitialMissions(),
    gameTime: 0,
    credits: 200,
    settings: {
      soundEnabled: true,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      tutorialEnabled: true
    }
  };
} 