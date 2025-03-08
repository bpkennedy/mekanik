import { ModuleData, ShipData, ShipPerformanceMetrics, ComponentData } from '@/types/game';

/**
 * Calculate the overall performance of a module based on its installed components
 */
export function calculateModulePerformance(module: ModuleData): ModuleData {
  const components = Object.values(module.components).filter(Boolean) as ComponentData[];
  const updatedModule = { ...module };
  
  // If no components installed, return zeros for performance
  if (components.length === 0) {
    updatedModule.performance = {
      efficiency: 0,
      stability: 0,
      output: 0,
      heat: 0
    };
    return updatedModule;
  }
  
  // Calculate base metrics from components
  let totalEfficiency = 0;
  let totalStability = 0;
  let totalOutput = 0;
  let totalHeat = 0;
  
  // Sum up the individual contributions
  components.forEach(component => {
    // Base calculation
    totalOutput += component.properties.powerRating;
    totalHeat += component.properties.heatGeneration;
    
    // Efficiency is inversely related to energy consumption
    const efficiencyFactor = 100 / (component.properties.energyConsumption + 1); // Avoid division by zero
    totalEfficiency += efficiencyFactor * (component.properties.durability / 100); // Durability affects efficiency
    
    // Stability is based on component condition
    const conditionFactor = component.secondaryProperties.condition === 'pristine' ? 1.0 : 
                            component.secondaryProperties.condition === 'damaged' ? 0.7 : 0.4;
    totalStability += conditionFactor * 100;
  });
  
  // Average for metrics that should be averaged
  const componentCount = components.length;
  totalEfficiency = totalEfficiency / componentCount;
  totalStability = totalStability / componentCount;
  
  // Special calculations for each module type
  switch (module.type) {
    case 'engine':
      updatedModule.performance = {
        efficiency: totalEfficiency,
        stability: totalStability,
        output: totalOutput,
        heat: totalHeat,
        // Engine-specific metrics
        thrust: totalOutput * (totalEfficiency / 100),
        maneuverability: totalStability * 0.8
      };
      break;
      
    case 'shield':
      updatedModule.performance = {
        efficiency: totalEfficiency,
        stability: totalStability,
        output: totalOutput,
        heat: totalHeat,
        // Shield-specific metrics
        strength: totalOutput * (totalStability / 100),
        rechargeRate: totalOutput * (totalEfficiency / 100)
      };
      break;
      
    case 'power':
      updatedModule.performance = {
        efficiency: totalEfficiency,
        stability: totalStability,
        output: totalOutput,
        heat: totalHeat,
        // Power-specific metrics
        energyStorage: totalOutput * 2,
        distribution: totalStability * 0.5
      };
      break;
  }
  
  return updatedModule;
}

/**
 * Calculate synergy bonuses between compatible components
 */
export function calculateComponentSynergies(module: ModuleData): number {
  const components = Object.values(module.components).filter(Boolean) as ComponentData[];
  let synergyBonus = 0;
  
  // Check for compatible components
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const component1 = components[i];
      const component2 = components[j];
      
      // Check if components are compatible with each other
      if (component1.secondaryProperties.compatibility.includes(component2.name) ||
          component2.secondaryProperties.compatibility.includes(component1.name)) {
        synergyBonus += 10; // 10% bonus for each compatible pair
      }
    }
  }
  
  return synergyBonus;
}

/**
 * Calculate the overall ship performance based on module performances
 */
export function calculateShipPerformance(ship: ShipData): ShipPerformanceMetrics {
  // First, ensure all modules have up-to-date performance calculations
  const updatedEngine = calculateModulePerformance(ship.modules.engine);
  const updatedShield = calculateModulePerformance(ship.modules.shield);
  const updatedPower = calculateModulePerformance(ship.modules.power);
  
  // Calculate synergy bonuses
  const engineSynergy = calculateComponentSynergies(updatedEngine);
  const shieldSynergy = calculateComponentSynergies(updatedShield);
  const powerSynergy = calculateComponentSynergies(updatedPower);
  
  // Get power module output as it affects all systems
  const availablePower = updatedPower.performance.output;
  
  // If power is zero, all systems fail
  if (availablePower <= 0) {
    return {
      speed: 0,
      maneuverability: 0,
      shieldStrength: 0,
      powerOutput: 0,
      heatManagement: 0,
      fuelEfficiency: 0
    };
  }
  
  // Calculate how power affects each system
  // Engine might not get full power if not enough is available
  const enginePowerRequirement = Object.values(updatedEngine.components)
    .filter(Boolean)
    .reduce((sum, comp) => sum + (comp?.properties.energyConsumption || 0), 0);
  
  // Shield might not get full power if not enough is available
  const shieldPowerRequirement = Object.values(updatedShield.components)
    .filter(Boolean)
    .reduce((sum, comp) => sum + (comp?.properties.energyConsumption || 0), 0);
  
  // Total power requirement
  const totalPowerRequirement = enginePowerRequirement + shieldPowerRequirement;
  
  // Power distribution factors
  const enginePowerFactor = totalPowerRequirement > 0 ? 
    Math.min(1, (availablePower * 0.6) / enginePowerRequirement) : 0;
  
  const shieldPowerFactor = totalPowerRequirement > 0 ? 
    Math.min(1, (availablePower * 0.4) / shieldPowerRequirement) : 0;
  
  // Calculate final ship metrics
  const performance: ShipPerformanceMetrics = {
    speed: (updatedEngine.performance.thrust || 0) * enginePowerFactor * (1 + engineSynergy/100),
    maneuverability: (updatedEngine.performance.maneuverability || 0) * enginePowerFactor * (1 + engineSynergy/100),
    shieldStrength: (updatedShield.performance.strength || 0) * shieldPowerFactor * (1 + shieldSynergy/100),
    powerOutput: availablePower * (1 + powerSynergy/100),
    heatManagement: 100 - ((updatedEngine.performance.heat + updatedPower.performance.heat + updatedShield.performance.heat) / 3),
    fuelEfficiency: updatedEngine.performance.efficiency * enginePowerFactor
  };
  
  // Ensure no negative values
  Object.keys(performance).forEach(key => {
    performance[key as keyof ShipPerformanceMetrics] = Math.max(0, performance[key as keyof ShipPerformanceMetrics]);
  });
  
  return performance;
}

/**
 * Update ship status effects based on performance
 */
export function calculateShipStatus(ship: ShipData): ShipData {
  const updatedShip = { ...ship };
  
  // Calculate heat-related issues
  updatedShip.status.overheating = ship.performance.heatManagement < 30;
  
  // Calculate power-related issues
  updatedShip.status.powerFluctuations = ship.modules.power.performance.stability < 40;
  updatedShip.status.powerSurge = ship.modules.power.performance.stability < 20 && ship.modules.power.performance.output > 70;
  
  // Calculate shield-related issues
  updatedShip.status.shieldHarmonicsDestabilized = ship.modules.shield.performance.stability < 35;
  
  // Calculate coolant-related issues
  const coolantSystem = Object.values(ship.modules.engine.components)
    .find(comp => comp?.subtype === 'coolantSystem');
  
  updatedShip.status.coolantLeak = coolantSystem ? 
    coolantSystem.properties.durability < 40 : false;
  
  return updatedShip;
}

/**
 * Calculate whether a ship meets the performance requirements for a mission objective
 */
export function checkPerformanceRequirements(
  shipPerformance: ShipPerformanceMetrics, 
  requiredPerformance?: Partial<ShipPerformanceMetrics>
): boolean {
  if (!requiredPerformance) return true;
  
  const keys = Object.keys(requiredPerformance) as Array<keyof ShipPerformanceMetrics>;
  
  for (const key of keys) {
    const requiredValue = requiredPerformance[key];
    const actualValue = shipPerformance[key];
    
    if (requiredValue !== undefined && (actualValue === undefined || actualValue < requiredValue)) {
      return false;
    }
  }
  
  return true;
} 