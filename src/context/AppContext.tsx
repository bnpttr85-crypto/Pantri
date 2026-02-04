'use client';

import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PantryItem, UserPreferences, BudgetSettings, CookSession, Recipe, RecipeIngredient, SavedRecipe, GroceryList, GroceryListItem, PantryCategory, DietaryTag, Store, StoreProduct, Spice } from '@/types';
import { mockRecipes } from '@/data/recipes';
import { defaultPantryItems } from '@/data/defaultPantry';
import { findIngredientMatch, standardizeIngredientName } from '@/data/ingredients';
import { mockStores, mockStoreProducts, findProductByBarcode, searchStoreProducts } from '@/data/stores';
import { defaultSpices } from '@/data/spices';
import { parseRecipeUrl, convertToAppRecipe } from '@/utils/recipeParser';
import { normalizeUnit, areUnitsCompatible, convertUnits, calculatePrice } from '@/utils/unitUtils';

interface AppContextType {
  // Pantry
  pantryItems: PantryItem[];
  addPantryItem: (item: Omit<PantryItem, 'id' | 'dateAdded'>) => void;
  addSmartPantryItem: (name: string, quantity?: number, unit?: string, cost?: number) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  deletePantryItem: (id: string) => void;
  deductIngredients: (ingredients: { name: string; quantity: number; unit: string }[]) => void;
  initializeDefaultPantry: () => void;
  addItemFromBarcode: (barcode: string) => Promise<{ success: boolean; product?: StoreProduct; error?: string }>;
  
  // Preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  
  // Budget
  budget: BudgetSettings;
  updateBudget: (updates: Partial<BudgetSettings>) => void;
  addToSpent: (amount: number) => void;
  resetWeeklySpent: () => void;
  
  // Cook History
  cookHistory: CookSession[];
  addCookSession: (session: Omit<CookSession, 'date'>) => void;
  
  // Recipes
  recipes: Recipe[];
  getMatchingRecipes: () => { recipe: Recipe; matchPercentage: number; matchedIngredients: string[]; missingIngredients: string[] }[];
  findPantryMatch: (ingredient: RecipeIngredient) => PantryItem | undefined;
  
  // Saved Recipes (Meal Planning)
  savedRecipes: SavedRecipe[];
  saveRecipe: (recipeId: string, servings?: number) => void;
  removeSavedRecipe: (recipeId: string) => void;
  updateSavedRecipeServings: (recipeId: string, servings: number) => void;
  
  // Grocery Lists
  groceryLists: GroceryList[];
  activeGroceryList: GroceryList | null;
  createGroceryList: (name: string) => string;
  deleteGroceryList: (id: string) => void;
  setActiveGroceryList: (id: string | null) => void;
  addToGroceryList: (listId: string, item: Omit<GroceryListItem, 'id'>) => void;
  removeFromGroceryList: (listId: string, itemId: string) => void;
  toggleGroceryItem: (listId: string, itemId: string) => void;
  updateGroceryItem: (listId: string, itemId: string, updates: Partial<GroceryListItem>) => void;
  generateSmartGroceryList: (name: string) => string;
  addCheckedItemsToPantry: (listId: string) => void;
  
  // Store
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (storeId: string | null) => void;
  getStoreProducts: (category?: PantryCategory) => StoreProduct[];
  searchProducts: (query: string) => StoreProduct[];
  getProductPrice: (productName: string) => number | null;
  
  // Spice Rack
  spices: Spice[];
  toggleSpice: (spiceId: string) => void;
  addCustomSpice: (name: string) => void;
  removeSpice: (spiceId: string) => void;
  
  // API
  spoonacularApiKey: string;
  setSpoonacularApiKey: (key: string) => void;
  searchSpoonacularRecipes: (query: string) => Promise<Recipe[]>;
  fetchRecipeById: (id: string) => Promise<Recipe | null>;
  isSearching: boolean;
  
  // Custom recipes
  customRecipes: Recipe[];
  importRecipeFromUrl: (url: string) => Promise<{ success: boolean; recipe?: Recipe; error?: string }>;
  addCustomRecipe: (recipe: Omit<Recipe, 'id'>) => Recipe;
  deleteCustomRecipe: (id: string) => void;
}

const defaultPreferences: UserPreferences = {
  dietaryRestrictions: [],
  cuisinePreferences: [],
  maxCookTime: 60,
  maxBudgetPerMeal: 25,
  servingSize: 2,
};

const defaultBudget: BudgetSettings = {
  weeklyBudget: 150,
  currentWeekSpent: 0,
  weekStartDate: new Date().toISOString(),
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('pantry-items', []);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('user-preferences', defaultPreferences);
  const [budget, setBudget] = useLocalStorage<BudgetSettings>('budget-settings', defaultBudget);
  const [cookHistory, setCookHistory] = useLocalStorage<CookSession[]>('cook-history', []);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<SavedRecipe[]>('saved-recipes', []);
  const [groceryLists, setGroceryLists] = useLocalStorage<GroceryList[]>('grocery-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>('active-grocery-list', null);
  const [spoonacularApiKey, setSpoonacularApiKey] = useLocalStorage<string>('spoonacular-api-key', '');
  const [isSearching, setIsSearching] = useState(false);
  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);
  const [hasInitialized, setHasInitialized] = useLocalStorage<boolean>('pantry-initialized', false);
  const [selectedStoreId, setSelectedStoreId] = useLocalStorage<string | null>('selected-store', null);
  
  // Initialize default spices
  const defaultSpiceList: Spice[] = defaultSpices.map((s, i) => ({ 
    ...s, 
    id: `spice-${i}`, 
    have: false 
  }));
  const [spices, setSpices] = useLocalStorage<Spice[]>('spice-rack', defaultSpiceList);
  
  // Custom recipes (imported from URLs or manually added)
  const [customRecipes, setCustomRecipes] = useLocalStorage<Recipe[]>('custom-recipes', []);

  // Generate a simple unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Initialize default pantry on first load
  const initializeDefaultPantry = useCallback(() => {
    if (pantryItems.length === 0) {
      const items: PantryItem[] = defaultPantryItems.map(item => ({
        ...item,
        id: generateId(),
        dateAdded: new Date().toISOString(),
      }));
      setPantryItems(items);
      setHasInitialized(true);
    }
  }, [pantryItems.length, setPantryItems, setHasInitialized]);

  // Auto-initialize on first load
  useEffect(() => {
    if (!hasInitialized && pantryItems.length === 0) {
      initializeDefaultPantry();
    }
  }, [hasInitialized, pantryItems.length, initializeDefaultPantry]);

  // Sync spice rack with pantry spices on load (one-time sync)
  useEffect(() => {
    const pantrySpices = pantryItems.filter(p => p.category === 'spices');
    if (pantrySpices.length > 0) {
      setSpices(prevSpices => {
        let hasChanges = false;
        const updated = prevSpices.map(spice => {
          const spiceName = spice.name.toLowerCase();
          const inPantry = pantrySpices.some(p => {
            const pantryName = p.name.toLowerCase();
            return pantryName === spiceName || 
                   pantryName.includes(spiceName) ||
                   spiceName.includes(pantryName);
          });
          // Only update if spice is in pantry but marked as not having it
          if (inPantry && !spice.have) {
            hasChanges = true;
            return { ...spice, have: true };
          }
          return spice;
        });
        // Only return new array if there were actual changes
        return hasChanges ? updated : prevSpices;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Pantry functions
  const addPantryItem = useCallback((item: Omit<PantryItem, 'id' | 'dateAdded'>) => {
    const newItem: PantryItem = {
      ...item,
      name: standardizeIngredientName(item.name),
      id: generateId(),
      dateAdded: new Date().toISOString(),
    };
    setPantryItems((prev) => [...prev, newItem]);
  }, [setPantryItems]);

  // Smart add - auto-categorize and set defaults
  const addSmartPantryItem = useCallback((name: string, quantity?: number, unit?: string, cost?: number) => {
    const match = findIngredientMatch(name);
    
    const newItem: PantryItem = {
      id: generateId(),
      name: match?.canonicalName || standardizeIngredientName(name),
      quantity: quantity ?? match?.defaultQuantity ?? 1,
      unit: unit ?? match?.defaultUnit ?? 'whole',
      category: match?.category ?? 'other',
      cost: cost ?? match?.avgPrice,
      dateAdded: new Date().toISOString(),
    };
    
    setPantryItems((prev) => [...prev, newItem]);
    
    // Sync with spice rack if this is a spice
    if (newItem.category === 'spices') {
      setSpices(prevSpices => {
        const spiceName = newItem.name.toLowerCase();
        return prevSpices.map(s => {
          if (s.name.toLowerCase() === spiceName || 
              s.name.toLowerCase().includes(spiceName) ||
              spiceName.includes(s.name.toLowerCase())) {
            return { ...s, have: true };
          }
          return s;
        });
      });
    }
  }, [setPantryItems, setSpices]);

  const updatePantryItem = useCallback((id: string, updates: Partial<PantryItem>) => {
    setPantryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, [setPantryItems]);

  const deletePantryItem = useCallback((id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  }, [setPantryItems]);

  // Find a matching pantry item for a recipe ingredient
  const findPantryMatch = useCallback((ingredient: RecipeIngredient): PantryItem | undefined => {
    const ingredientName = ingredient.name.toLowerCase();
    
    // Try exact match first
    let match = pantryItems.find((item) => 
      item.name.toLowerCase() === ingredientName
    );
    if (match) return match;
    
    // Try standardized match
    const standardized = standardizeIngredientName(ingredient.name).toLowerCase();
    match = pantryItems.find((item) => 
      item.name.toLowerCase() === standardized
    );
    if (match) return match;
    
    // Try partial match
    return pantryItems.find((item) => {
      const itemName = item.name.toLowerCase();
      return itemName.includes(ingredientName) || ingredientName.includes(itemName);
    });
  }, [pantryItems]);

  const deductIngredients = useCallback((ingredients: { name: string; quantity: number; unit: string }[]) => {
    setPantryItems((prev) => {
      const updated = [...prev];
      ingredients.forEach((ing) => {
        const idx = updated.findIndex(
          (item) => item.name.toLowerCase() === ing.name.toLowerCase() ||
                    item.name.toLowerCase() === standardizeIngredientName(ing.name).toLowerCase()
        );
        if (idx !== -1) {
          const newQty = updated[idx].quantity - ing.quantity;
          if (newQty <= 0) {
            updated.splice(idx, 1);
          } else {
            updated[idx] = { ...updated[idx], quantity: newQty };
          }
        }
      });
      return updated;
    });
  }, [setPantryItems]);

  // Preferences functions
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, [setPreferences]);

  // Budget functions
  const updateBudget = useCallback((updates: Partial<BudgetSettings>) => {
    setBudget((prev) => ({ ...prev, ...updates }));
  }, [setBudget]);

  const addToSpent = useCallback((amount: number) => {
    setBudget((prev) => ({ ...prev, currentWeekSpent: prev.currentWeekSpent + amount }));
  }, [setBudget]);

  const resetWeeklySpent = useCallback(() => {
    setBudget((prev) => ({
      ...prev,
      currentWeekSpent: 0,
      weekStartDate: new Date().toISOString(),
    }));
  }, [setBudget]);

  // Cook history functions
  const addCookSession = useCallback((session: Omit<CookSession, 'date'>) => {
    const newSession: CookSession = {
      ...session,
      date: new Date().toISOString(),
    };
    setCookHistory((prev) => [newSession, ...prev]);
  }, [setCookHistory]);

  // Saved Recipes functions
  const saveRecipe = useCallback((recipeId: string, servings?: number) => {
    setSavedRecipes((prev) => {
      if (prev.find(r => r.recipeId === recipeId)) return prev;
      return [...prev, {
        recipeId,
        servings: servings ?? preferences.servingSize,
        addedDate: new Date().toISOString(),
      }];
    });
  }, [setSavedRecipes, preferences.servingSize]);

  const removeSavedRecipe = useCallback((recipeId: string) => {
    setSavedRecipes((prev) => prev.filter(r => r.recipeId !== recipeId));
  }, [setSavedRecipes]);

  const updateSavedRecipeServings = useCallback((recipeId: string, servings: number) => {
    setSavedRecipes((prev) =>
      prev.map((r) => (r.recipeId === recipeId ? { ...r, servings } : r))
    );
  }, [setSavedRecipes]);

  // Grocery List functions
  const activeGroceryList = useMemo(() => {
    return groceryLists.find(l => l.id === activeListId) || null;
  }, [groceryLists, activeListId]);

  const createGroceryList = useCallback((name: string): string => {
    const id = generateId();
    const newList: GroceryList = {
      id,
      name,
      createdDate: new Date().toISOString(),
      items: [],
    };
    setGroceryLists((prev) => [...prev, newList]);
    setActiveListId(id);
    return id;
  }, [setGroceryLists, setActiveListId]);

  const deleteGroceryList = useCallback((id: string) => {
    setGroceryLists((prev) => prev.filter(l => l.id !== id));
    if (activeListId === id) {
      setActiveListId(null);
    }
  }, [setGroceryLists, activeListId, setActiveListId]);

  const setActiveGroceryList = useCallback((id: string | null) => {
    setActiveListId(id);
  }, [setActiveListId]);

  const addToGroceryList = useCallback((listId: string, item: Omit<GroceryListItem, 'id'>) => {
    setGroceryLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        
        // Check if item already exists, if so add to quantity
        const existingIndex = list.items.findIndex(
          i => i.name.toLowerCase() === item.name.toLowerCase()
        );
        
        if (existingIndex >= 0) {
          const updatedItems = [...list.items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + item.quantity,
          };
          return { ...list, items: updatedItems };
        }
        
        return {
          ...list,
          items: [...list.items, { ...item, id: generateId() }],
        };
      })
    );
  }, [setGroceryLists]);

  const removeFromGroceryList = useCallback((listId: string, itemId: string) => {
    setGroceryLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter(i => i.id !== itemId) }
          : list
      )
    );
  }, [setGroceryLists]);

  const toggleGroceryItem = useCallback((listId: string, itemId: string) => {
    setGroceryLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(i =>
                i.id === itemId ? { ...i, checked: !i.checked } : i
              ),
            }
          : list
      )
    );
  }, [setGroceryLists]);

  const updateGroceryItem = useCallback((listId: string, itemId: string, updates: Partial<GroceryListItem>) => {
    setGroceryLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(i =>
                i.id === itemId ? { ...i, ...updates } : i
              ),
            }
          : list
      )
    );
  }, [setGroceryLists]);

  // Generate smart grocery list from saved recipes
  const generateSmartGroceryList = useCallback((name: string): string => {
    const listId = createGroceryList(name);
    
    // Collect all ingredients needed from saved recipes
    const neededIngredients: Map<string, { 
      quantity: number; 
      unit: string; 
      category: PantryCategory; 
      fromRecipes: string[];
      pantryUnit?: string;
      pantryPricePerUnit?: number;
    }> = new Map();
    
    savedRecipes.forEach((saved) => {
      const recipe = mockRecipes.find(r => r.id === saved.recipeId);
      if (!recipe) return;
      
      const multiplier = saved.servings / recipe.servings;
      
      recipe.ingredients.forEach((ing) => {
        if (ing.optional) return;
        
        const standardName = standardizeIngredientName(ing.name);
        const existing = neededIngredients.get(standardName);
        const adjustedQty = ing.quantity * multiplier;
        
        // Get category from our database
        const match = findIngredientMatch(ing.name);
        const category = match?.category ?? 'other';
        
        // Check if this ingredient exists in pantry (to get preferred unit and price)
        const pantryItem = pantryItems.find(
          p => p.name.toLowerCase() === standardName.toLowerCase()
        );
        
        if (existing) {
          // If units are compatible, add quantities
          if (areUnitsCompatible(existing.unit, ing.unit)) {
            // Convert to the existing unit if different
            const convertedQty = convertUnits(adjustedQty, ing.unit, existing.unit);
            existing.quantity += convertedQty ?? adjustedQty;
          } else {
            // Different unit types, just add (might be inaccurate)
            existing.quantity += adjustedQty;
          }
          if (!existing.fromRecipes.includes(recipe.title)) {
            existing.fromRecipes.push(recipe.title);
          }
        } else {
          // Determine which unit to use - prefer pantry unit if compatible
          let finalUnit = ing.unit;
          let finalQty = adjustedQty;
          
          if (pantryItem && areUnitsCompatible(pantryItem.unit, ing.unit)) {
            finalUnit = pantryItem.unit;
            const converted = convertUnits(adjustedQty, ing.unit, pantryItem.unit);
            if (converted !== null) {
              finalQty = converted;
            }
          }
          
          neededIngredients.set(standardName, {
            quantity: finalQty,
            unit: finalUnit,
            category,
            fromRecipes: [recipe.title],
            pantryUnit: pantryItem?.unit,
            pantryPricePerUnit: pantryItem?.cost,
          });
        }
      });
    });
    
    // Subtract what we already have in pantry
    neededIngredients.forEach((needed, name) => {
      const pantryItem = pantryItems.find(
        p => p.name.toLowerCase() === name.toLowerCase()
      );
      
      if (pantryItem) {
        // Convert pantry quantity to needed unit if necessary
        let pantryQtyInNeededUnit = pantryItem.quantity;
        if (areUnitsCompatible(pantryItem.unit, needed.unit)) {
          const converted = convertUnits(pantryItem.quantity, pantryItem.unit, needed.unit);
          if (converted !== null) {
            pantryQtyInNeededUnit = converted;
          }
        }
        
        const remainingNeeded = needed.quantity - pantryQtyInNeededUnit;
        if (remainingNeeded <= 0) {
          neededIngredients.delete(name);
        } else {
          needed.quantity = remainingNeeded;
        }
      }
    });
    
    // Add items to the grocery list
    neededIngredients.forEach((needed, name) => {
      const match = findIngredientMatch(name);
      
      // Calculate estimated cost
      let estimatedCost: number | undefined;
      if (needed.pantryPricePerUnit && needed.pantryUnit) {
        // Use pantry price with proper unit conversion
        estimatedCost = calculatePrice(
          needed.quantity,
          needed.unit,
          needed.pantryPricePerUnit,
          needed.pantryUnit
        );
      } else if (match?.avgPrice) {
        // Use average price from database
        estimatedCost = match.avgPrice * needed.quantity;
      }
      
      addToGroceryList(listId, {
        name,
        quantity: Math.ceil(needed.quantity * 10) / 10, // Round up to 1 decimal
        unit: normalizeUnit(needed.unit),
        category: needed.category,
        checked: false,
        fromRecipe: needed.fromRecipes.join(', '),
        estimatedCost,
      });
    });
    
    return listId;
  }, [createGroceryList, savedRecipes, pantryItems, addToGroceryList]);

  // Add checked grocery items to pantry
  const addCheckedItemsToPantry = useCallback((listId: string) => {
    const list = groceryLists.find(l => l.id === listId);
    if (!list) return;
    
    const checkedItems = list.items.filter(i => i.checked);
    
    checkedItems.forEach((item) => {
      addPantryItem({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        cost: item.estimatedCost ? item.estimatedCost / item.quantity : undefined,
      });
    });
    
    // Remove checked items from the list
    setGroceryLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, items: l.items.filter(i => !i.checked) }
          : l
      )
    );
  }, [groceryLists, addPantryItem, setGroceryLists]);

  // Recipe matching with scoring
  const getMatchingRecipes = useCallback(() => {
    const results = mockRecipes
      .filter((recipe) => {
        // Filter by dietary restrictions
        if (preferences.dietaryRestrictions.length > 0) {
          const hasAllRestrictions = preferences.dietaryRestrictions.every((tag) =>
            recipe.dietaryTags.includes(tag)
          );
          if (!hasAllRestrictions) return false;
        }

        // Filter by cuisine preferences
        if (preferences.cuisinePreferences.length > 0) {
          if (!preferences.cuisinePreferences.includes(recipe.cuisine)) return false;
        }

        // Filter by cook time
        if (recipe.cookTime > preferences.maxCookTime) return false;

        // Filter by budget
        if (recipe.estimatedCost > preferences.maxBudgetPerMeal) return false;

        return true;
      })
      .map((recipe) => {
        const requiredIngredients = recipe.ingredients.filter((i) => !i.optional);
        const matchedIngredients: string[] = [];
        const missingIngredients: string[] = [];

        requiredIngredients.forEach((ingredient) => {
          const pantryMatch = findPantryMatch(ingredient);
          if (pantryMatch) {
            matchedIngredients.push(ingredient.name);
          } else {
            missingIngredients.push(ingredient.name);
          }
        });

        const matchPercentage = requiredIngredients.length > 0
          ? Math.round((matchedIngredients.length / requiredIngredients.length) * 100)
          : 0;

        return {
          recipe,
          matchPercentage,
          matchedIngredients,
          missingIngredients,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return results;
  }, [preferences, findPantryMatch]);

  // Store functions
  const selectedStore = useMemo(() => {
    return selectedStoreId ? mockStores.find(s => s.id === selectedStoreId) || null : null;
  }, [selectedStoreId]);

  const setSelectedStore = useCallback((storeId: string | null) => {
    setSelectedStoreId(storeId);
  }, [setSelectedStoreId]);

  const getStoreProducts = useCallback((category?: PantryCategory): StoreProduct[] => {
    if (!selectedStoreId) return [];
    let products = mockStoreProducts.filter(p => p.storeId === selectedStoreId);
    if (category) {
      products = products.filter(p => p.category === category);
    }
    return products;
  }, [selectedStoreId]);

  const searchProducts = useCallback((query: string): StoreProduct[] => {
    return searchStoreProducts(query, selectedStoreId || undefined);
  }, [selectedStoreId]);

  const getProductPrice = useCallback((productName: string): number | null => {
    if (!selectedStoreId) return null;
    const product = mockStoreProducts.find(
      p => p.storeId === selectedStoreId && p.name.toLowerCase().includes(productName.toLowerCase())
    );
    return product?.price || null;
  }, [selectedStoreId]);

  // Barcode lookup
  const addItemFromBarcode = useCallback(async (barcode: string): Promise<{ success: boolean; product?: StoreProduct; error?: string }> => {
    // First check our store database
    const storeProduct = findProductByBarcode(barcode, selectedStoreId || undefined);
    
    if (storeProduct) {
      // Add to pantry
      const newItem: PantryItem = {
        id: generateId(),
        name: storeProduct.name,
        quantity: 1,
        unit: storeProduct.unit,
        category: storeProduct.category,
        cost: storeProduct.price,
        dateAdded: new Date().toISOString(),
        barcode: barcode,
        storeProductId: storeProduct.id,
      };
      setPantryItems(prev => [...prev, newItem]);
      return { success: true, product: storeProduct };
    }
    
    // Try Open Food Facts API
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        const category = inferCategory(product.categories_tags || []);
        
        const newItem: PantryItem = {
          id: generateId(),
          name: product.product_name || 'Unknown Product',
          quantity: 1,
          unit: 'item',
          category,
          dateAdded: new Date().toISOString(),
          barcode: barcode,
        };
        setPantryItems(prev => [...prev, newItem]);
        return { 
          success: true, 
          product: {
            id: barcode,
            storeId: 'openfoodfacts',
            name: product.product_name || 'Unknown Product',
            barcode,
            price: 0,
            unit: 'item',
            category,
            inStock: true,
          }
        };
      }
      
      return { success: false, error: 'Product not found' };
    } catch (error) {
      console.error('Barcode lookup error:', error);
      return { success: false, error: 'Failed to lookup barcode' };
    }
  }, [selectedStoreId, setPantryItems]);

  // Helper to infer category from Open Food Facts tags
  const inferCategory = (tags: string[]): PantryCategory => {
    const tagString = tags.join(' ').toLowerCase();
    if (tagString.includes('dairy') || tagString.includes('milk') || tagString.includes('cheese')) return 'dairy';
    if (tagString.includes('meat') || tagString.includes('beef') || tagString.includes('chicken') || tagString.includes('pork')) return 'meat';
    if (tagString.includes('seafood') || tagString.includes('fish')) return 'seafood';
    if (tagString.includes('vegetable') || tagString.includes('fruit')) return 'produce';
    if (tagString.includes('grain') || tagString.includes('bread') || tagString.includes('pasta') || tagString.includes('cereal')) return 'grains';
    if (tagString.includes('canned')) return 'canned';
    if (tagString.includes('frozen')) return 'frozen';
    if (tagString.includes('spice') || tagString.includes('herb')) return 'spices';
    if (tagString.includes('beverage') || tagString.includes('drink') || tagString.includes('juice')) return 'beverages';
    if (tagString.includes('snack') || tagString.includes('chip') || tagString.includes('cookie')) return 'snacks';
    if (tagString.includes('condiment') || tagString.includes('sauce')) return 'condiments';
    return 'other';
  };

  // Spice rack functions - synced with pantry
  const toggleSpice = useCallback((spiceId: string) => {
    const spice = spices.find(s => s.id === spiceId);
    if (!spice) return;
    
    const newHaveState = !spice.have;
    
    // Update spice rack
    setSpices(prev => prev.map(s => s.id === spiceId ? { ...s, have: newHaveState } : s));
    
    // Sync with pantry
    if (newHaveState) {
      // Adding spice - add to pantry if not already there
      const spiceName = spice.name.toLowerCase();
      const existsInPantry = pantryItems.some(p => 
        p.category === 'spices' && 
        (p.name.toLowerCase() === spiceName || 
         p.name.toLowerCase().includes(spiceName) ||
         spiceName.includes(p.name.toLowerCase()))
      );
      
      if (!existsInPantry) {
        const newPantryItem: PantryItem = {
          id: generateId(),
          name: spice.name,
          quantity: 1,
          unit: 'jar',
          category: 'spices',
          dateAdded: new Date().toISOString(),
        };
        setPantryItems(prev => [...prev, newPantryItem]);
      }
    } else {
      // Removing spice - remove from pantry
      const spiceName = spice.name.toLowerCase();
      setPantryItems(prev => prev.filter(p => 
        !(p.category === 'spices' && 
          (p.name.toLowerCase() === spiceName || 
           p.name.toLowerCase().includes(spiceName) ||
           spiceName.includes(p.name.toLowerCase())))
      ));
    }
  }, [spices, pantryItems, setSpices, setPantryItems]);

  const addCustomSpice = useCallback((name: string) => {
    const newSpice: Spice = {
      id: generateId(),
      name,
      have: true,
      essential: false,
    };
    setSpices(prev => [...prev, newSpice]);
    
    // Also add to pantry
    const newPantryItem: PantryItem = {
      id: generateId(),
      name,
      quantity: 1,
      unit: 'jar',
      category: 'spices',
      dateAdded: new Date().toISOString(),
    };
    setPantryItems(prev => [...prev, newPantryItem]);
  }, [setSpices, setPantryItems]);

  const removeSpice = useCallback((spiceId: string) => {
    setSpices(prev => prev.filter(s => s.id !== spiceId));
  }, [setSpices]);

  // Spoonacular API search
  const searchSpoonacularRecipes = useCallback(async (query: string): Promise<Recipe[]> => {
    if (!spoonacularApiKey) {
      console.warn('No Spoonacular API key set');
      return [];
    }
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularApiKey}&query=${encodeURIComponent(query)}&addRecipeInformation=true&fillIngredients=true&number=10`
      );
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recipes: Recipe[] = data.results.map((item: Record<string, unknown>) => ({
        id: `spoon-${item.id}`,
        title: item.title,
        description: typeof item.summary === 'string' ? item.summary.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : '',
        image: item.image || `https://spoonacular.com/recipeImages/${item.id}-312x231.jpg`,
        cookTime: (item.readyInMinutes as number) || 30,
        servings: (item.servings as number) || 4,
        difficulty: ((item.readyInMinutes as number) || 30) > 45 ? 'hard' : ((item.readyInMinutes as number) || 30) > 25 ? 'medium' : 'easy',
        cuisine: Array.isArray(item.cuisines) && item.cuisines[0] ? String(item.cuisines[0]) : 'International',
        dietaryTags: [
          ...(item.vegetarian ? ['vegetarian'] : []),
          ...(item.vegan ? ['vegan'] : []),
          ...(item.glutenFree ? ['gluten-free'] : []),
          ...(item.dairyFree ? ['dairy-free'] : []),
        ] as DietaryTag[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ingredients: Array.isArray(item.extendedIngredients) ? item.extendedIngredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.amount,
          unit: ing.unit || 'whole',
        })) : [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        instructions: Array.isArray((item.analyzedInstructions as any)?.[0]?.steps) 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? (item.analyzedInstructions as any)[0].steps.map((s: any) => s.step) 
          : ['See source for instructions'],
        estimatedCost: Math.round(((item.pricePerServing as number) || 300) * ((item.servings as number) || 4) / 100),
        sourceUrl: item.sourceUrl as string,
        spoonacularId: item.id as number,
      }));
      
      // Store API recipes for later access
      setApiRecipes(prev => {
        const newRecipes = recipes.filter(r => !prev.some(p => p.id === r.id));
        return [...prev, ...newRecipes];
      });
      
      return recipes;
    } catch (error) {
      console.error('Spoonacular search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [spoonacularApiKey]);

  // Fetch single recipe by ID
  const fetchRecipeById = useCallback(async (id: string): Promise<Recipe | null> => {
    // Check if it's an API recipe
    if (!id.startsWith('spoon-')) {
      return mockRecipes.find(r => r.id === id) || null;
    }
    
    // Check if we already have it cached
    const cached = apiRecipes.find(r => r.id === id);
    if (cached) return cached;
    
    if (!spoonacularApiKey) {
      console.warn('No Spoonacular API key set');
      return null;
    }
    
    const spoonId = id.replace('spoon-', '');
    
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${spoonId}/information?apiKey=${spoonacularApiKey}&includeNutrition=false`
      );
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const item = await response.json();
      
      const recipe: Recipe = {
        id: `spoon-${item.id}`,
        title: item.title,
        description: typeof item.summary === 'string' ? item.summary.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : '',
        image: item.image || `https://spoonacular.com/recipeImages/${item.id}-312x231.jpg`,
        cookTime: item.readyInMinutes || 30,
        servings: item.servings || 4,
        difficulty: (item.readyInMinutes || 30) > 45 ? 'hard' : (item.readyInMinutes || 30) > 25 ? 'medium' : 'easy',
        cuisine: Array.isArray(item.cuisines) && item.cuisines[0] ? String(item.cuisines[0]) : 'International',
        dietaryTags: [
          ...(item.vegetarian ? ['vegetarian'] : []),
          ...(item.vegan ? ['vegan'] : []),
          ...(item.glutenFree ? ['gluten-free'] : []),
          ...(item.dairyFree ? ['dairy-free'] : []),
        ] as DietaryTag[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ingredients: Array.isArray(item.extendedIngredients) ? item.extendedIngredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.amount,
          unit: ing.unit || 'whole',
        })) : [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        instructions: Array.isArray(item.analyzedInstructions?.[0]?.steps) 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? item.analyzedInstructions[0].steps.map((s: any) => s.step) 
          : ['See source for instructions'],
        estimatedCost: Math.round((item.pricePerServing || 300) * (item.servings || 4) / 100),
        sourceUrl: item.sourceUrl,
        spoonacularId: item.id,
      };
      
      // Cache it
      setApiRecipes(prev => [...prev, recipe]);
      
      return recipe;
    } catch (error) {
      console.error('Spoonacular fetch error:', error);
      return null;
    }
  }, [spoonacularApiKey, apiRecipes]);

  // Custom recipe functions
  const importRecipeFromUrl = useCallback(async (url: string): Promise<{ success: boolean; recipe?: Recipe; error?: string }> => {
    try {
      const result = await parseRecipeUrl(url);
      
      if (!result.success || !result.recipe) {
        return { success: false, error: result.error };
      }
      
      const recipeData = convertToAppRecipe(result.recipe);
      const newRecipe: Recipe = {
        ...recipeData,
        id: `custom-${generateId()}`,
      };
      
      setCustomRecipes(prev => [...prev, newRecipe]);
      
      return { success: true, recipe: newRecipe };
    } catch (error) {
      console.error('Recipe import error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to import recipe' 
      };
    }
  }, [setCustomRecipes]);

  const addCustomRecipe = useCallback((recipe: Omit<Recipe, 'id'>): Recipe => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `custom-${generateId()}`,
    };
    setCustomRecipes(prev => [...prev, newRecipe]);
    return newRecipe;
  }, [setCustomRecipes]);

  const deleteCustomRecipe = useCallback((id: string) => {
    setCustomRecipes(prev => prev.filter(r => r.id !== id));
  }, [setCustomRecipes]);

  const value = useMemo(
    () => ({
      pantryItems,
      addPantryItem,
      addSmartPantryItem,
      updatePantryItem,
      deletePantryItem,
      deductIngredients,
      initializeDefaultPantry,
      addItemFromBarcode,
      preferences,
      updatePreferences,
      budget,
      updateBudget,
      addToSpent,
      resetWeeklySpent,
      cookHistory,
      addCookSession,
      recipes: [...mockRecipes, ...apiRecipes, ...customRecipes],
      getMatchingRecipes,
      findPantryMatch,
      savedRecipes,
      saveRecipe,
      removeSavedRecipe,
      updateSavedRecipeServings,
      groceryLists,
      activeGroceryList,
      createGroceryList,
      deleteGroceryList,
      setActiveGroceryList,
      addToGroceryList,
      removeFromGroceryList,
      toggleGroceryItem,
      updateGroceryItem,
      generateSmartGroceryList,
      addCheckedItemsToPantry,
      // Store
      stores: mockStores,
      selectedStore,
      setSelectedStore,
      getStoreProducts,
      searchProducts,
      getProductPrice,
      // Spice Rack
      spices,
      toggleSpice,
      addCustomSpice,
      removeSpice,
      // API
      spoonacularApiKey,
      setSpoonacularApiKey,
      searchSpoonacularRecipes,
      fetchRecipeById,
      isSearching,
      // Custom recipes
      customRecipes,
      importRecipeFromUrl,
      addCustomRecipe,
      deleteCustomRecipe,
    }),
    [
      pantryItems,
      addPantryItem,
      addSmartPantryItem,
      updatePantryItem,
      deletePantryItem,
      deductIngredients,
      initializeDefaultPantry,
      addItemFromBarcode,
      preferences,
      updatePreferences,
      budget,
      updateBudget,
      addToSpent,
      resetWeeklySpent,
      cookHistory,
      addCookSession,
      apiRecipes,
      customRecipes,
      getMatchingRecipes,
      findPantryMatch,
      savedRecipes,
      saveRecipe,
      removeSavedRecipe,
      updateSavedRecipeServings,
      groceryLists,
      activeGroceryList,
      createGroceryList,
      deleteGroceryList,
      setActiveGroceryList,
      addToGroceryList,
      removeFromGroceryList,
      toggleGroceryItem,
      updateGroceryItem,
      generateSmartGroceryList,
      addCheckedItemsToPantry,
      selectedStore,
      setSelectedStore,
      getStoreProducts,
      searchProducts,
      getProductPrice,
      spices,
      toggleSpice,
      addCustomSpice,
      removeSpice,
      spoonacularApiKey,
      setSpoonacularApiKey,
      searchSpoonacularRecipes,
      fetchRecipeById,
      isSearching,
      importRecipeFromUrl,
      addCustomRecipe,
      deleteCustomRecipe,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
