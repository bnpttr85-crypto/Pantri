import { PantryItem } from '@/types';

// Pre-populated pantry for testing
export const defaultPantryItems: Omit<PantryItem, 'id' | 'dateAdded'>[] = [
  // Produce
  { name: 'Bananas', quantity: 6, unit: 'whole', category: 'produce', cost: 0.25 },
  { name: 'Avocados', quantity: 3, unit: 'whole', category: 'produce', cost: 1.50 },
  { name: 'Spinach', quantity: 4, unit: 'cups', category: 'produce', cost: 0.75 },
  { name: 'Tomatoes', quantity: 5, unit: 'whole', category: 'produce', cost: 0.75 },
  { name: 'Onions', quantity: 4, unit: 'whole', category: 'produce', cost: 0.50 },
  { name: 'Garlic', quantity: 8, unit: 'cloves', category: 'produce', cost: 0.10 },
  { name: 'Broccoli', quantity: 3, unit: 'cups', category: 'produce', cost: 1.00 },
  { name: 'Carrots', quantity: 8, unit: 'whole', category: 'produce', cost: 0.20 },
  { name: 'Bell Pepper', quantity: 3, unit: 'whole', category: 'produce', cost: 1.25 },
  { name: 'Lemons', quantity: 4, unit: 'whole', category: 'produce', cost: 0.50 },
  { name: 'Limes', quantity: 3, unit: 'whole', category: 'produce', cost: 0.33 },
  { name: 'Fresh Ginger', quantity: 3, unit: 'inch', category: 'produce', cost: 0.50 },
  { name: 'Fresh Cilantro', quantity: 1, unit: 'bunch', category: 'produce', cost: 1.50 },
  { name: 'Fresh Basil', quantity: 1, unit: 'bunch', category: 'produce', cost: 2.50 },
  { name: 'Green Onions', quantity: 1, unit: 'bunch', category: 'produce', cost: 1.00 },
  { name: 'Cucumber', quantity: 2, unit: 'whole', category: 'produce', cost: 1.00 },
  { name: 'Mushrooms', quantity: 3, unit: 'cups', category: 'produce', cost: 1.50 },
  { name: 'Cherry Tomatoes', quantity: 2, unit: 'cups', category: 'produce', cost: 2.00 },
  { name: 'Red Onion', quantity: 2, unit: 'whole', category: 'produce', cost: 1.00 },
  { name: 'Shallots', quantity: 3, unit: 'whole', category: 'produce', cost: 0.75 },
  
  // Dairy
  { name: 'Milk', quantity: 1, unit: 'gal', category: 'dairy', cost: 4.50 },
  { name: 'Eggs', quantity: 12, unit: 'whole', category: 'dairy', cost: 0.40 },
  { name: 'Butter', quantity: 16, unit: 'tbsp', category: 'dairy', cost: 0.30 },
  { name: 'Cheddar Cheese', quantity: 3, unit: 'cups', category: 'dairy', cost: 2.00 },
  { name: 'Parmesan', quantity: 150, unit: 'g', category: 'dairy', cost: 0.08 },
  { name: 'Mozzarella', quantity: 2, unit: 'cups', category: 'dairy', cost: 3.00 },
  { name: 'Feta Cheese', quantity: 100, unit: 'g', category: 'dairy', cost: 0.06 },
  { name: 'Greek Yogurt', quantity: 3, unit: 'cups', category: 'dairy', cost: 1.50 },
  { name: 'Sour Cream', quantity: 1, unit: 'cups', category: 'dairy', cost: 2.50 },
  { name: 'Heavy Cream', quantity: 1, unit: 'cups', category: 'dairy', cost: 3.00 },
  
  // Meat
  { name: 'Chicken Breast', quantity: 2, unit: 'lb', category: 'meat', cost: 5.00 },
  { name: 'Ground Beef', quantity: 1.5, unit: 'lb', category: 'meat', cost: 6.00 },
  { name: 'Bacon', quantity: 10, unit: 'slices', category: 'meat', cost: 0.70 },
  { name: 'Pancetta', quantity: 200, unit: 'g', category: 'meat', cost: 0.05 },
  
  // Seafood
  { name: 'Salmon', quantity: 1, unit: 'lb', category: 'seafood', cost: 12.00 },
  { name: 'Shrimp', quantity: 0.5, unit: 'lb', category: 'seafood', cost: 10.00 },
  
  // Grains
  { name: 'Rice', quantity: 6, unit: 'cups', category: 'grains', cost: 0.40 },
  { name: 'Pasta', quantity: 800, unit: 'g', category: 'grains', cost: 0.004 },
  { name: 'Bread', quantity: 16, unit: 'slices', category: 'grains', cost: 0.20 },
  { name: 'Tortillas', quantity: 12, unit: 'whole', category: 'grains', cost: 0.25 },
  { name: 'Quinoa', quantity: 2, unit: 'cups', category: 'grains', cost: 1.50 },
  { name: 'Arborio Rice', quantity: 2, unit: 'cups', category: 'grains', cost: 1.00 },
  { name: 'All-Purpose Flour', quantity: 6, unit: 'cups', category: 'grains', cost: 0.25 },
  
  // Canned
  { name: 'Canned Tomatoes', quantity: 3, unit: 'cans', category: 'canned', cost: 1.50 },
  { name: 'Black Beans', quantity: 2, unit: 'cans', category: 'canned', cost: 1.25 },
  { name: 'Chickpeas', quantity: 2, unit: 'cans', category: 'canned', cost: 1.50 },
  { name: 'Coconut Milk', quantity: 800, unit: 'ml', category: 'canned', cost: 0.008 },
  { name: 'Chicken Broth', quantity: 8, unit: 'cups', category: 'canned', cost: 0.60 },
  { name: 'Vegetable Broth', quantity: 4, unit: 'cups', category: 'canned', cost: 0.60 },
  { name: 'Bamboo Shoots', quantity: 200, unit: 'g', category: 'canned', cost: 0.01 },
  
  // Condiments
  { name: 'Olive Oil', quantity: 24, unit: 'tbsp', category: 'condiments', cost: 0.35 },
  { name: 'Sesame Oil', quantity: 8, unit: 'tbsp', category: 'condiments', cost: 0.45 },
  { name: 'Soy Sauce', quantity: 16, unit: 'tbsp', category: 'condiments', cost: 0.20 },
  { name: 'Fish Sauce', quantity: 8, unit: 'tbsp', category: 'condiments', cost: 0.30 },
  { name: 'Balsamic Vinegar', quantity: 8, unit: 'tbsp', category: 'condiments', cost: 0.50 },
  { name: 'Honey', quantity: 12, unit: 'tbsp', category: 'condiments', cost: 0.50 },
  { name: 'Hot Sauce', quantity: 10, unit: 'tbsp', category: 'condiments', cost: 0.15 },
  { name: 'Curry Paste', quantity: 6, unit: 'tbsp', category: 'condiments', cost: 0.75 },
  { name: 'Ketchup', quantity: 12, unit: 'tbsp', category: 'condiments', cost: 0.12 },
  { name: 'Mayonnaise', quantity: 12, unit: 'tbsp', category: 'condiments', cost: 0.20 },
  
  // Spices
  { name: 'Salt', quantity: 30, unit: 'tsp', category: 'spices', cost: 0.02 },
  { name: 'Black Pepper', quantity: 15, unit: 'tsp', category: 'spices', cost: 0.08 },
  { name: 'Cumin', quantity: 10, unit: 'tsp', category: 'spices', cost: 0.15 },
  { name: 'Paprika', quantity: 10, unit: 'tsp', category: 'spices', cost: 0.18 },
  { name: 'Chili Powder', quantity: 8, unit: 'tsp', category: 'spices', cost: 0.18 },
  { name: 'Garlic Powder', quantity: 10, unit: 'tsp', category: 'spices', cost: 0.12 },
  { name: 'Oregano', quantity: 8, unit: 'tsp', category: 'spices', cost: 0.12 },
  { name: 'Dried Thyme', quantity: 6, unit: 'tsp', category: 'spices', cost: 0.15 },
  { name: 'Cinnamon', quantity: 8, unit: 'tsp', category: 'spices', cost: 0.18 },
  { name: 'Garam Masala', quantity: 6, unit: 'tsp', category: 'spices', cost: 0.30 },
  { name: 'Turmeric', quantity: 6, unit: 'tsp', category: 'spices', cost: 0.25 },
  { name: 'Italian Seasoning', quantity: 8, unit: 'tsp', category: 'spices', cost: 0.18 },
  
  // Other
  { name: 'Kalamata Olives', quantity: 1, unit: 'cups', category: 'other', cost: 4.00 },
  { name: 'White Wine', quantity: 200, unit: 'ml', category: 'other', cost: 0.02 },
  { name: 'Sugar', quantity: 4, unit: 'cups', category: 'snacks', cost: 0.40 },
  { name: 'Brown Sugar', quantity: 2, unit: 'cups', category: 'snacks', cost: 0.60 },
  { name: 'Sesame Seeds', quantity: 6, unit: 'tbsp', category: 'other', cost: 0.20 },
];
