export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: PantryCategory;
  cost?: number; // cost per unit
  dateAdded: string;
  expirationDate?: string;
  barcode?: string;
  storeProductId?: string; // link to store product
}

export type PantryCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'grains'
  | 'canned'
  | 'frozen'
  | 'condiments'
  | 'spices'
  | 'staples'
  | 'beverages'
  | 'snacks'
  | 'other';

// Store types
export interface Store {
  id: string;
  name: string;
  logo: string;
  address?: string;
  deliveryAvailable: boolean;
  deliveryFee?: number;
  deliveryMinimum?: number;
}

export interface StoreProduct {
  id: string;
  storeId: string;
  name: string;
  barcode?: string;
  price: number;
  unit: string;
  category: PantryCategory;
  inStock: boolean;
  aisle?: string;
  imageUrl?: string;
}

export interface Spice {
  id: string;
  name: string;
  have: boolean;
  essential: boolean; // commonly used
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietaryTags: DietaryTag[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  estimatedCost: number;
  sourceUrl?: string;
  spoonacularId?: number;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
}

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'keto'
  | 'paleo'
  | 'low-carb'
  | 'nut-free';

export interface UserPreferences {
  dietaryRestrictions: DietaryTag[];
  cuisinePreferences: string[];
  maxCookTime: number; // minutes
  maxBudgetPerMeal: number;
  servingSize: number;
}

export interface BudgetSettings {
  weeklyBudget: number;
  currentWeekSpent: number;
  weekStartDate: string;
}

export interface CookSession {
  recipeId: string;
  recipeName: string;
  date: string;
  ingredientsUsed: { name: string; quantity: number; unit: string; cost: number }[];
  totalCost: number;
}

// New types for saved recipes and grocery lists
export interface SavedRecipe {
  recipeId: string;
  servings: number;
  addedDate: string;
}

export interface GroceryListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: PantryCategory;
  checked: boolean;
  fromRecipe?: string; // recipe name that added this
  estimatedCost?: number;
}

export interface GroceryList {
  id: string;
  name: string;
  createdDate: string;
  items: GroceryListItem[];
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  extendedIngredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }[];
  analyzedInstructions: {
    steps: {
      number: number;
      step: string;
    }[];
  }[];
}
