import { PantryCategory } from '@/types';

export interface ParsedReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  category: PantryCategory;
  selected: boolean;
}

// Common grocery item keywords mapped to categories
const categoryKeywords: Record<PantryCategory, string[]> = {
  produce: [
    'apple', 'banana', 'orange', 'lemon', 'lime', 'avocado', 'tomato', 'potato',
    'onion', 'garlic', 'carrot', 'celery', 'lettuce', 'spinach', 'kale', 'broccoli',
    'pepper', 'cucumber', 'zucchini', 'squash', 'mushroom', 'corn', 'beans', 'peas',
    'berries', 'strawberry', 'blueberry', 'grape', 'melon', 'mango', 'pineapple',
    'peach', 'pear', 'plum', 'cherry', 'ginger', 'herb', 'cilantro', 'parsley',
    'basil', 'mint', 'produce', 'organic', 'fresh', 'fruit', 'vegetable', 'veg'
  ],
  dairy: [
    'milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'eggs', 'sour cream',
    'cottage', 'mozzarella', 'cheddar', 'parmesan', 'feta', 'swiss', 'brie',
    'cream cheese', 'half & half', 'whipping', 'dairy', 'lactose'
  ],
  meat: [
    'chicken', 'beef', 'pork', 'turkey', 'lamb', 'bacon', 'sausage', 'ham',
    'steak', 'ground', 'breast', 'thigh', 'wing', 'drumstick', 'roast', 'chop',
    'ribs', 'tenderloin', 'sirloin', 'meat', 'poultry', 'deli'
  ],
  seafood: [
    'salmon', 'tuna', 'shrimp', 'fish', 'cod', 'tilapia', 'crab', 'lobster',
    'scallop', 'oyster', 'mussel', 'clam', 'squid', 'seafood', 'fillet', 'filet'
  ],
  grains: [
    'bread', 'rice', 'pasta', 'noodle', 'cereal', 'oat', 'flour', 'wheat',
    'tortilla', 'bagel', 'muffin', 'roll', 'bun', 'cracker', 'quinoa', 'barley',
    'grain', 'loaf', 'slice', 'wrap'
  ],
  canned: [
    'canned', 'can ', 'soup', 'beans', 'tomato sauce', 'broth', 'stock',
    'tuna can', 'corn can', 'diced', 'crushed', 'paste', 'puree'
  ],
  frozen: [
    'frozen', 'ice cream', 'pizza', 'fries', 'freezer', 'popsicle', 'froze'
  ],
  condiments: [
    'ketchup', 'mustard', 'mayo', 'mayonnaise', 'sauce', 'dressing', 'vinegar',
    'oil', 'olive oil', 'soy sauce', 'hot sauce', 'bbq', 'salsa', 'spread'
  ],
  spices: [
    'salt', 'pepper', 'spice', 'seasoning', 'cumin', 'paprika', 'oregano',
    'thyme', 'rosemary', 'cinnamon', 'nutmeg', 'vanilla', 'extract', 'powder'
  ],
  staples: [
    'sugar', 'flour', 'baking soda', 'baking powder', 'honey', 'syrup', 'maple',
    'peanut butter', 'jam', 'jelly', 'cornstarch', 'yeast', 'cooking spray'
  ],
  beverages: [
    'water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'wine', 'drink',
    'beverage', 'sparkling', 'energy', 'sport', 'cola', 'sprite', 'gatorade'
  ],
  snacks: [
    'chip', 'chips', 'cookie', 'cracker', 'pretzel', 'popcorn', 'candy',
    'chocolate', 'snack', 'bar', 'nuts', 'almond', 'cashew', 'peanut', 'trail mix'
  ],
  other: []
};

// Common receipt abbreviations
const abbreviations: Record<string, string> = {
  'bnls': 'boneless',
  'chkn': 'chicken',
  'brst': 'breast',
  'org': 'organic',
  'whl': 'whole',
  'grn': 'green',
  'rd': 'red',
  'yel': 'yellow',
  'frz': 'frozen',
  'frsh': 'fresh',
  'lg': 'large',
  'sm': 'small',
  'med': 'medium',
  'pk': 'pack',
  'lb': 'pound',
  'oz': 'ounce',
  'ct': 'count',
  'ea': 'each',
  'gal': 'gallon',
  'qt': 'quart',
  'pt': 'pint',
};

function expandAbbreviations(text: string): string {
  let expanded = text.toLowerCase();
  for (const [abbr, full] of Object.entries(abbreviations)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    expanded = expanded.replace(regex, full);
  }
  return expanded;
}

function detectCategory(itemName: string): PantryCategory {
  const lowerName = itemName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return category as PantryCategory;
      }
    }
  }
  
  return 'other';
}

function cleanItemName(raw: string): string {
  // Remove common non-item patterns
  let cleaned = raw
    .replace(/\d+\s*(lb|oz|ct|pk|ea|gal|qt|pt)\.?\s*/gi, '') // Remove quantity indicators
    .replace(/\$[\d.]+/g, '') // Remove prices
    .replace(/[\d]{5,}/g, '') // Remove long numbers (likely barcodes/SKUs)
    .replace(/[#*@]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Expand abbreviations
  cleaned = expandAbbreviations(cleaned);
  
  // Title case
  cleaned = cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return cleaned;
}

// Lines to skip (headers, totals, etc.)
const skipPatterns = [
  /^total/i,
  /^subtotal/i,
  /^tax/i,
  /^change/i,
  /^cash/i,
  /^credit/i,
  /^debit/i,
  /^visa/i,
  /^mastercard/i,
  /^balance/i,
  /^savings/i,
  /^you saved/i,
  /^thank you/i,
  /^welcome/i,
  /^store/i,
  /^receipt/i,
  /^date/i,
  /^time/i,
  /^cashier/i,
  /^register/i,
  /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/, // Dates
  /^\d{1,2}:\d{2}/, // Times
  /^[\d\s\-\(\)]+$/, // Just numbers (phone numbers, etc.)
  /^\s*$/, // Empty lines
];

function shouldSkipLine(line: string): boolean {
  return skipPatterns.some(pattern => pattern.test(line.trim()));
}

// Extract price from a line
function extractPrice(line: string): number | null {
  // Look for price patterns like $1.99, 1.99, $10.00
  const priceMatch = line.match(/\$?\s*(\d+\.\d{2})\s*[A-Z]?\s*$/);
  if (priceMatch) {
    return parseFloat(priceMatch[1]);
  }
  
  // Also try to find prices elsewhere in the line
  const anyPriceMatch = line.match(/\$\s*(\d+\.\d{2})/);
  if (anyPriceMatch) {
    return parseFloat(anyPriceMatch[1]);
  }
  
  return null;
}

export function parseReceiptText(text: string): ParsedReceiptItem[] {
  const lines = text.split('\n');
  const items: ParsedReceiptItem[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip non-item lines
    if (shouldSkipLine(trimmed)) continue;
    if (trimmed.length < 3) continue;
    
    // Try to extract a price
    const price = extractPrice(trimmed);
    
    // Clean up the item name
    const itemName = cleanItemName(trimmed);
    
    // Skip if the cleaned name is too short or looks like junk
    if (itemName.length < 2) continue;
    if (/^\d+$/.test(itemName)) continue; // Just numbers
    
    // Detect category
    const category = detectCategory(itemName);
    
    items.push({
      id: Math.random().toString(36).substr(2, 9),
      name: itemName,
      price: price || 0,
      quantity: 1,
      unit: 'whole',
      category,
      selected: true,
    });
  }
  
  // Filter out likely duplicates or very similar items
  const uniqueItems = items.filter((item, index, self) => {
    const isDupe = self.findIndex(other => 
      other.name.toLowerCase() === item.name.toLowerCase()
    ) !== index;
    return !isDupe;
  });
  
  return uniqueItems;
}
