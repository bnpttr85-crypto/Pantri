// Recipe URL Parser - extracts structured recipe data from URLs
// Uses JSON-LD schema, Open Graph tags, and page scraping

import { Recipe, DietaryTag } from '@/types';

export interface ParsedRecipe {
  title: string;
  description: string;
  image: string;
  cookTime: number;
  prepTime?: number;
  servings: number;
  ingredients: { name: string; quantity: number; unit: string }[];
  instructions: string[];
  cuisine?: string;
  dietaryTags?: DietaryTag[];
  sourceUrl: string;
}

export interface RecipeParseResult {
  success: boolean;
  recipe?: ParsedRecipe;
  error?: string;
}

// Parse a recipe URL and extract data
export async function parseRecipeUrl(url: string): Promise<RecipeParseResult> {
  try {
    // Validate URL
    new URL(url);
    
    // Use a CORS proxy for fetching external content
    // In production, you'd want your own backend endpoint
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch recipe page' };
    }
    
    const data = await response.json();
    const html = data.contents;
    
    if (!html) {
      return { success: false, error: 'No content returned from URL' };
    }
    
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try to extract JSON-LD structured data first (most reliable)
    const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    
    for (const script of jsonLdScripts) {
      try {
        const jsonData = JSON.parse(script.textContent || '');
        const recipeData = findRecipeInJsonLd(jsonData);
        
        if (recipeData) {
          return {
            success: true,
            recipe: {
              title: recipeData.name || 'Untitled Recipe',
              description: recipeData.description || '',
              image: recipeData.image?.url || recipeData.image?.[0] || recipeData.image || '',
              cookTime: parseDuration(recipeData.cookTime) || 30,
              prepTime: parseDuration(recipeData.prepTime),
              servings: parseInt(recipeData.recipeYield) || 4,
              ingredients: parseIngredients(recipeData.recipeIngredient || []),
              instructions: parseInstructions(recipeData.recipeInstructions || []),
              cuisine: recipeData.recipeCuisine?.[0] || recipeData.recipeCuisine,
              dietaryTags: extractDietaryTags(recipeData),
              sourceUrl: url,
            }
          };
        }
      } catch {
        // Continue to next script
      }
    }
    
    // Fallback: Try to extract from meta tags and page content
    const fallbackRecipe = extractFromMetaTags(doc, url);
    
    if (fallbackRecipe.title) {
      return { success: true, recipe: fallbackRecipe };
    }
    
    return { 
      success: false, 
      error: 'Could not find recipe data. Try entering recipe details manually.' 
    };
    
  } catch (error) {
    console.error('Recipe parse error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to parse recipe' 
    };
  }
}

// Find recipe data in JSON-LD (handles nested structures and @graph)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findRecipeInJsonLd(data: any): any {
  if (!data) return null;
  
  // Direct recipe object
  if (data['@type'] === 'Recipe' || data['@type']?.includes?.('Recipe')) {
    return data;
  }
  
  // Check @graph array
  if (data['@graph'] && Array.isArray(data['@graph'])) {
    for (const item of data['@graph']) {
      if (item['@type'] === 'Recipe' || item['@type']?.includes?.('Recipe')) {
        return item;
      }
    }
  }
  
  // Check if it's an array
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
  }
  
  return null;
}

// Parse ISO 8601 duration (PT30M, PT1H30M, etc.)
function parseDuration(duration: string | undefined): number | undefined {
  if (!duration) return undefined;
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return undefined;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  
  return hours * 60 + minutes;
}

// Parse ingredient strings into structured format
function parseIngredients(ingredients: string[]): { name: string; quantity: number; unit: string }[] {
  return ingredients.map(ing => {
    // Try to parse "1 cup flour" style strings
    const match = ing.match(/^([\d./\s]+)?\s*(\w+)?\s+(.+)$/);
    
    if (match) {
      const quantity = parseQuantity(match[1]?.trim());
      const unit = match[2]?.trim() || 'whole';
      const name = match[3]?.trim() || ing;
      
      return { name, quantity, unit };
    }
    
    return { name: ing, quantity: 1, unit: 'whole' };
  });
}

// Parse quantity strings like "1/2", "1 1/2", "2"
function parseQuantity(str: string | undefined): number {
  if (!str) return 1;
  
  // Handle fractions
  if (str.includes('/')) {
    const parts = str.split(/\s+/);
    let total = 0;
    
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, denom] = part.split('/');
        total += parseInt(num) / parseInt(denom);
      } else {
        total += parseInt(part) || 0;
      }
    }
    
    return total || 1;
  }
  
  return parseFloat(str) || 1;
}

// Parse instructions from various formats
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInstructions(instructions: any[] | string): string[] {
  if (typeof instructions === 'string') {
    return instructions.split(/\n+/).filter(s => s.trim());
  }
  
  return instructions.map(inst => {
    if (typeof inst === 'string') return inst;
    if (inst.text) return inst.text;
    if (inst.name) return inst.name;
    return String(inst);
  }).filter(s => s.trim());
}

// Extract dietary tags from recipe data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDietaryTags(data: any): DietaryTag[] {
  const tags: DietaryTag[] = [];
  
  const keywords = [
    ...(data.keywords?.split?.(',') || []),
    ...(data.recipeCuisine || []),
    ...(data.recipeCategory || []),
  ].map(k => k?.toLowerCase?.() || '');
  
  if (keywords.some(k => k.includes('vegetarian'))) tags.push('vegetarian');
  if (keywords.some(k => k.includes('vegan'))) tags.push('vegan');
  if (keywords.some(k => k.includes('gluten-free') || k.includes('gluten free'))) tags.push('gluten-free');
  if (keywords.some(k => k.includes('dairy-free') || k.includes('dairy free'))) tags.push('dairy-free');
  if (keywords.some(k => k.includes('keto'))) tags.push('keto');
  if (keywords.some(k => k.includes('paleo'))) tags.push('paleo');
  if (keywords.some(k => k.includes('low-carb') || k.includes('low carb'))) tags.push('low-carb');
  
  return tags;
}

// Fallback extraction from meta tags
function extractFromMetaTags(doc: Document, url: string): ParsedRecipe {
  const getMetaContent = (name: string): string => {
    const meta = doc.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
    return meta?.getAttribute('content') || '';
  };
  
  const title = getMetaContent('og:title') || doc.querySelector('title')?.textContent || '';
  const description = getMetaContent('og:description') || getMetaContent('description') || '';
  const image = getMetaContent('og:image') || '';
  
  // Try to find ingredients list
  const ingredients: { name: string; quantity: number; unit: string }[] = [];
  const ingredientElements = doc.querySelectorAll('[class*="ingredient"], [itemprop="recipeIngredient"]');
  
  ingredientElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text) {
      ingredients.push({ name: text, quantity: 1, unit: 'whole' });
    }
  });
  
  // Try to find instructions
  const instructions: string[] = [];
  const instructionElements = doc.querySelectorAll('[class*="instruction"], [class*="direction"], [itemprop="recipeInstructions"]');
  
  instructionElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text) {
      instructions.push(text);
    }
  });
  
  return {
    title,
    description,
    image,
    cookTime: 30,
    servings: 4,
    ingredients: ingredients.length > 0 ? ingredients : [],
    instructions: instructions.length > 0 ? instructions : ['See original recipe for instructions'],
    sourceUrl: url,
  };
}

// Convert parsed recipe to app Recipe format
export function convertToAppRecipe(parsed: ParsedRecipe): Omit<Recipe, 'id'> {
  return {
    title: parsed.title,
    description: parsed.description.slice(0, 200),
    image: parsed.image || '/placeholder-recipe.jpg',
    cookTime: parsed.cookTime + (parsed.prepTime || 0),
    servings: parsed.servings,
    difficulty: parsed.cookTime > 45 ? 'hard' : parsed.cookTime > 25 ? 'medium' : 'easy',
    cuisine: parsed.cuisine || 'International',
    dietaryTags: parsed.dietaryTags || [],
    ingredients: parsed.ingredients,
    instructions: parsed.instructions,
    estimatedCost: Math.round(parsed.ingredients.length * 2), // Rough estimate
    sourceUrl: parsed.sourceUrl,
  };
}
