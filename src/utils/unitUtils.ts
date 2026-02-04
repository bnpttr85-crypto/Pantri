// Unit display and conversion utilities

// Standard unit display names
export const unitDisplayNames: Record<string, string> = {
  'g': 'g',
  'gram': 'g',
  'grams': 'g',
  'kg': 'kg',
  'kilogram': 'kg',
  'kilograms': 'kg',
  'oz': 'oz',
  'ounce': 'oz',
  'ounces': 'oz',
  'lb': 'lb',
  'lbs': 'lb',
  'pound': 'lb',
  'pounds': 'lb',
  'ml': 'ml',
  'milliliter': 'ml',
  'milliliters': 'ml',
  'l': 'L',
  'L': 'L',
  'liter': 'L',
  'liters': 'L',
  'cup': 'cup',
  'cups': 'cups',
  'tbsp': 'tbsp',
  'tablespoon': 'tbsp',
  'tablespoons': 'tbsp',
  'tsp': 'tsp',
  'teaspoon': 'tsp',
  'teaspoons': 'tsp',
  'whole': 'whole',
  'piece': 'whole',
  'pieces': 'whole',
  'slice': 'slice',
  'slices': 'slices',
  'clove': 'clove',
  'cloves': 'cloves',
  'bunch': 'bunch',
  'bunches': 'bunches',
  'can': 'can',
  'cans': 'cans',
  'inch': 'inch',
  'inches': 'inches',
};

// Conversion factors to base units (grams for weight, ml for volume)
const weightToGrams: Record<string, number> = {
  'g': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'kilograms': 1000,
  'oz': 28.3495,
  'ounce': 28.3495,
  'ounces': 28.3495,
  'lb': 453.592,
  'lbs': 453.592,
  'pound': 453.592,
  'pounds': 453.592,
};

const volumeToMl: Record<string, number> = {
  'ml': 1,
  'milliliter': 1,
  'milliliters': 1,
  'l': 1000,
  'L': 1000,
  'liter': 1000,
  'liters': 1000,
  'cup': 236.588,
  'cups': 236.588,
  'tbsp': 14.787,
  'tablespoon': 14.787,
  'tablespoons': 14.787,
  'tsp': 4.929,
  'teaspoon': 4.929,
  'teaspoons': 4.929,
};

// Normalize unit to standard form
export function normalizeUnit(unit: string): string {
  const lower = unit.toLowerCase().trim();
  return unitDisplayNames[lower] || unit;
}

// Check if two units are compatible (same type)
export function areUnitsCompatible(unit1: string, unit2: string): boolean {
  const norm1 = unit1.toLowerCase().trim();
  const norm2 = unit2.toLowerCase().trim();
  
  // Same unit
  if (normalizeUnit(norm1) === normalizeUnit(norm2)) return true;
  
  // Both weight units
  if (weightToGrams[norm1] && weightToGrams[norm2]) return true;
  
  // Both volume units
  if (volumeToMl[norm1] && volumeToMl[norm2]) return true;
  
  return false;
}

// Convert quantity from one unit to another
export function convertUnits(
  quantity: number,
  fromUnit: string,
  toUnit: string
): number | null {
  const fromNorm = fromUnit.toLowerCase().trim();
  const toNorm = toUnit.toLowerCase().trim();
  
  // Same unit type
  if (normalizeUnit(fromNorm) === normalizeUnit(toNorm)) {
    return quantity;
  }
  
  // Weight conversion
  if (weightToGrams[fromNorm] && weightToGrams[toNorm]) {
    const grams = quantity * weightToGrams[fromNorm];
    return grams / weightToGrams[toNorm];
  }
  
  // Volume conversion
  if (volumeToMl[fromNorm] && volumeToMl[toNorm]) {
    const ml = quantity * volumeToMl[fromNorm];
    return ml / volumeToMl[toNorm];
  }
  
  // Cannot convert
  return null;
}

// Format quantity and unit for display
export function formatQuantityUnit(quantity: number, unit: string): string {
  const normalizedUnit = normalizeUnit(unit);
  
  // Handle pluralization
  let displayUnit = normalizedUnit;
  if (quantity !== 1) {
    if (normalizedUnit === 'cup') displayUnit = 'cups';
    if (normalizedUnit === 'slice') displayUnit = 'slices';
    if (normalizedUnit === 'clove') displayUnit = 'cloves';
    if (normalizedUnit === 'bunch') displayUnit = 'bunches';
    if (normalizedUnit === 'can') displayUnit = 'cans';
    if (normalizedUnit === 'inch') displayUnit = 'inches';
  }
  
  // Format quantity (remove trailing zeros)
  const formattedQty = quantity % 1 === 0 
    ? quantity.toString() 
    : quantity.toFixed(2).replace(/\.?0+$/, '');
  
  return `${formattedQty} ${displayUnit}`;
}

// Calculate price for a given quantity, considering unit conversion
export function calculatePrice(
  quantity: number,
  unit: string,
  pricePerUnit: number,
  priceUnit: string
): number {
  // If same unit, simple multiplication
  if (normalizeUnit(unit) === normalizeUnit(priceUnit)) {
    return quantity * pricePerUnit;
  }
  
  // Try to convert
  const convertedQty = convertUnits(quantity, unit, priceUnit);
  if (convertedQty !== null) {
    return convertedQty * pricePerUnit;
  }
  
  // Cannot convert, just multiply (may be inaccurate)
  return quantity * pricePerUnit;
}

// Get the best unit to use when combining pantry item with recipe need
export function getPreferredUnit(
  pantryUnit: string | undefined,
  recipeUnit: string
): string {
  // If pantry has a unit and it's compatible, use pantry unit
  if (pantryUnit && areUnitsCompatible(pantryUnit, recipeUnit)) {
    return normalizeUnit(pantryUnit);
  }
  
  // Otherwise use recipe unit
  return normalizeUnit(recipeUnit);
}
