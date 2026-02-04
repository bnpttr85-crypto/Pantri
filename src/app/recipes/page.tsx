'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Clock, DollarSign, Filter, ChevronDown, Users, Bookmark, BookmarkCheck, Globe, Loader2, Key, Link2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cuisineOptions } from '@/data/recipes';
import { DietaryTag, Recipe } from '@/types';

const dietaryOptions: { value: DietaryTag; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'keto', label: 'Keto' },
  { value: 'low-carb', label: 'Low-Carb' },
];

type SortOption = 'match' | 'time' | 'cost';
type ViewMode = 'pantry' | 'search' | 'saved';

export default function RecipesPage() {
  const { 
    getMatchingRecipes, 
    preferences, 
    updatePreferences,
    savedRecipes,
    saveRecipe,
    removeSavedRecipe,
    spoonacularApiKey,
    setSpoonacularApiKey,
    searchSpoonacularRecipes,
    isSearching,
    customRecipes,
    importRecipeFromUrl,
    recipes,
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [minMatch, setMinMatch] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('pantry');
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [apiResults, setApiResults] = useState<Recipe[]>([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  
  // URL Import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<Recipe | null>(null);

  const matchingRecipes = getMatchingRecipes();

  // Apply local filters and sorting
  const filteredRecipes = useMemo(() => {
    const results = matchingRecipes.filter((r) => {
      const matchesSearch = r.recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMin = r.matchPercentage >= minMatch;
      return matchesSearch && matchesMin;
    });

    // Sort
    switch (sortBy) {
      case 'time':
        results.sort((a, b) => a.recipe.cookTime - b.recipe.cookTime);
        break;
      case 'cost':
        results.sort((a, b) => a.recipe.estimatedCost - b.recipe.estimatedCost);
        break;
      case 'match':
      default:
        // Already sorted by match from context
        break;
    }

    return results;
  }, [matchingRecipes, searchQuery, sortBy, minMatch]);

  const toggleDietaryFilter = (tag: DietaryTag) => {
    const current = preferences.dietaryRestrictions;
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    updatePreferences({ dietaryRestrictions: updated });
  };

  const toggleCuisine = (cuisine: string) => {
    const current = preferences.cuisinePreferences;
    const updated = current.includes(cuisine)
      ? current.filter((c) => c !== cuisine)
      : [...current, cuisine];
    updatePreferences({ cuisinePreferences: updated });
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some(r => r.recipeId === recipeId);
  };

  const toggleSaveRecipe = (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRecipeSaved(recipeId)) {
      removeSavedRecipe(recipeId);
    } else {
      saveRecipe(recipeId);
    }
  };

  const handleApiSearch = async () => {
    if (!apiSearchQuery.trim()) return;
    
    if (!spoonacularApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    const results = await searchSpoonacularRecipes(apiSearchQuery);
    setApiResults(results);
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setSpoonacularApiKey(tempApiKey.trim());
      setShowApiKeyModal(false);
      // Retry search
      handleApiSearch();
    }
  };

  const handleImportRecipe = async () => {
    if (!importUrl.trim()) return;
    
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);
    
    try {
      const result = await importRecipeFromUrl(importUrl);
      
      if (result.success && result.recipe) {
        setImportSuccess(result.recipe);
        setImportUrl('');
      } else {
        setImportError(result.error || 'Failed to import recipe');
      }
    } catch {
      setImportError('An unexpected error occurred');
    } finally {
      setIsImporting(false);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportUrl('');
    setImportError(null);
    setImportSuccess(null);
  };

  return (
    <div className="px-4 py-6 animate-fade-in">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-800">
              Recipes
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {savedRecipes.length} saved · {customRecipes.length} imported
            </p>
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-sage-100 text-sage-700 rounded-xl text-sm font-medium hover:bg-sage-200 transition-colors"
          >
            <Link2 className="w-4 h-4" />
            Import URL
          </button>
        </div>
      </header>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('pantry')}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
            viewMode === 'pantry'
              ? 'bg-sage-600 text-white'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          From Pantry
        </button>
        <button
          onClick={() => setViewMode('saved')}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            viewMode === 'saved'
              ? 'bg-sage-600 text-white'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          Saved
          {savedRecipes.length > 0 && (
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
              viewMode === 'saved' ? 'bg-white/20' : 'bg-sage-100 text-sage-700'
            }`}>
              {savedRecipes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setViewMode('search')}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            viewMode === 'search'
              ? 'bg-sage-600 text-white'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          <Globe className="w-4 h-4" />
          Online
        </button>
      </div>

      {viewMode === 'pantry' ? (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Sort & Filter Toggle */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                showFilters || preferences.dietaryRestrictions.length > 0 || preferences.cuisinePreferences.length > 0
                  ? 'bg-sage-100 text-sage-700'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(preferences.dietaryRestrictions.length > 0 || preferences.cuisinePreferences.length > 0) && (
                <span className="w-5 h-5 rounded-full bg-sage-600 text-white text-xs flex items-center justify-center">
                  {preferences.dietaryRestrictions.length + preferences.cuisinePreferences.length}
                </span>
              )}
            </button>

            <div className="flex-1" />

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-stone-100 text-stone-600 px-3 py-2 pr-8 rounded-xl text-sm font-medium cursor-pointer"
              >
                <option value="match">Best Match</option>
                <option value="time">Quickest</option>
                <option value="cost">Cheapest</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="card mb-4 space-y-4 animate-scale-in">
              {/* Min Match */}
              <div>
                <label className="label">Minimum Match: {minMatch}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={minMatch}
                  onChange={(e) => setMinMatch(parseInt(e.target.value))}
                  className="w-full accent-sage-600"
                />
              </div>

              {/* Max Cook Time */}
              <div>
                <label className="label">Max Cook Time: {preferences.maxCookTime} min</label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={preferences.maxCookTime}
                  onChange={(e) => updatePreferences({ maxCookTime: parseInt(e.target.value) })}
                  className="w-full accent-sage-600"
                />
              </div>

              {/* Max Budget */}
              <div>
                <label className="label">Max Budget: ${preferences.maxBudgetPerMeal}</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={preferences.maxBudgetPerMeal}
                  onChange={(e) => updatePreferences({ maxBudgetPerMeal: parseInt(e.target.value) })}
                  className="w-full accent-sage-600"
                />
              </div>

              {/* Dietary */}
              <div>
                <label className="label">Dietary</label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleDietaryFilter(opt.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        preferences.dietaryRestrictions.includes(opt.value)
                          ? 'bg-sage-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <label className="label">Cuisine</label>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => toggleCuisine(cuisine)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        preferences.cuisinePreferences.includes(cuisine)
                          ? 'bg-terracotta-500 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(preferences.dietaryRestrictions.length > 0 || preferences.cuisinePreferences.length > 0) && (
                <button
                  onClick={() => updatePreferences({ dietaryRestrictions: [], cuisinePreferences: [] })}
                  className="text-sm text-terracotta-600 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Recipe Grid */}
          {filteredRecipes.length > 0 ? (
            <div className="space-y-3">
              {filteredRecipes.map(({ recipe, matchPercentage, missingIngredients }) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="card flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {/* Match badge overlay */}
                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      matchPercentage >= 80
                        ? 'bg-sage-600 text-white'
                        : matchPercentage >= 50
                        ? 'bg-yellow-500 text-white'
                        : 'bg-stone-600 text-white'
                    }`}>
                      {matchPercentage}%
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-stone-800 leading-tight">
                        {recipe.title}
                      </h3>
                      <button
                        onClick={(e) => toggleSaveRecipe(e, recipe.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          isRecipeSaved(recipe.id)
                            ? 'text-sage-600'
                            : 'text-stone-300 hover:text-sage-500'
                        }`}
                      >
                        {isRecipeSaved(recipe.id) ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                      {recipe.description}
                    </p>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.cookTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${recipe.estimatedCost}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {recipe.servings}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge-stone text-[10px]">
                        {recipe.cuisine}
                      </span>
                      {missingIngredients.length > 0 && (
                        <span className="text-[10px] text-terracotta-600">
                          Need {missingIngredients.length} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-stone-600 font-medium">No recipes found</p>
              <p className="text-stone-400 text-sm mt-1">
                Try adjusting your filters or add more items to your pantry
              </p>
            </div>
          )}
        </>
      ) : viewMode === 'saved' ? (
        /* Saved Recipes View */
        <div className="pb-24">
          {savedRecipes.length > 0 ? (
            <div className="space-y-3">
              {savedRecipes.map((saved) => {
                const recipe = recipes.find(r => r.id === saved.recipeId);
                if (!recipe) return null;
                
                return (
                  <div
                    key={recipe.id}
                    className="card hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      {recipe.image && (
                        <Link href={`/recipes/${recipe.id}`} className="flex-shrink-0">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100">
                            <Image
                              src={recipe.image}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/recipes/${recipe.id}`} className="flex-1 min-w-0">
                            <h3 className="font-semibold text-stone-800 leading-tight line-clamp-2">
                              {recipe.title}
                            </h3>
                          </Link>
                          <button
                            onClick={() => removeSavedRecipe(recipe.id)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors flex-shrink-0"
                          >
                            <BookmarkCheck className="w-5 h-5 text-sage-600" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-stone-500 line-clamp-1 mt-1">
                          {recipe.description}
                        </p>
                        
                        {/* Recipe meta */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {recipe.cookTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {saved.servings || recipe.servings}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            ${recipe.estimatedCost.toFixed(0)}
                          </span>
                          {recipe.id.startsWith('custom-') && (
                            <span className="flex items-center gap-1 text-sage-600">
                              <Link2 className="w-3.5 h-3.5" />
                              Imported
                            </span>
                          )}
                        </div>
                        
                        {/* Tags */}
                        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {recipe.dietaryTags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-sage-50 text-sage-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-stone-600 font-medium">No saved recipes yet</p>
              <p className="text-stone-400 text-sm mt-1">
                Tap the bookmark icon on any recipe to save it here
              </p>
              <button
                onClick={() => setViewMode('pantry')}
                className="btn-primary mt-4"
              >
                Browse Recipes
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Online Search View */
        <div>
          {/* API Key Setup */}
          {!spoonacularApiKey && (
            <div className="bg-cream-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-terracotta-600 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-700">API Key Required</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Get a free API key from{' '}
                    <a 
                      href="https://spoonacular.com/food-api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sage-600 underline"
                    >
                      Spoonacular
                    </a>
                    {' '}(150 free requests/day)
                  </p>
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="btn-secondary mt-3"
                  >
                    Set API Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search any recipe (e.g., chicken tikka masala)"
                value={apiSearchQuery}
                onChange={(e) => setApiSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApiSearch()}
                className="input pl-10"
              />
            </div>
            <button
              onClick={handleApiSearch}
              disabled={isSearching || !apiSearchQuery.trim()}
              className="btn-primary px-4 disabled:opacity-50"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* API Results */}
          {apiResults.length > 0 ? (
            <div className="space-y-3">
              {apiResults.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="card flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-600 text-white">
                      API
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-stone-800 leading-tight">
                        {recipe.title}
                      </h3>
                      <button
                        onClick={(e) => toggleSaveRecipe(e, recipe.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          isRecipeSaved(recipe.id)
                            ? 'text-sage-600'
                            : 'text-stone-300 hover:text-sage-500'
                        }`}
                      >
                        {isRecipeSaved(recipe.id) ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.cookTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {recipe.servings}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {recipe.dietaryTags.slice(0, 2).map((tag) => (
                        <span key={tag} className="badge-sage text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : isSearching ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-sage-600 animate-spin mx-auto mb-3" />
              <p className="text-stone-600">Searching recipes...</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-600 font-medium">Search for any recipe</p>
              <p className="text-stone-400 text-sm mt-1">
                Enter a dish name to find recipes from around the web
              </p>
            </div>
          )}
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-24 sm:pb-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale-in">
            <h2 className="font-display text-xl font-semibold text-stone-800 mb-2">
              Spoonacular API Key
            </h2>
            <p className="text-sm text-stone-500 mb-4">
              Get your free API key at{' '}
              <a 
                href="https://spoonacular.com/food-api/console" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sage-600 underline"
              >
                spoonacular.com
              </a>
            </p>
            
            <input
              type="text"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Paste your API key here"
              className="input mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="btn-primary flex-1"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Recipe Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-24 sm:pb-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-stone-800">
                Import Recipe from URL
              </h2>
              <button
                onClick={closeImportModal}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {importSuccess ? (
              // Success state
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">Recipe Imported!</h3>
                <p className="text-stone-600 mb-4">{importSuccess.title}</p>
                {importSuccess.image && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={importSuccess.image}
                      alt={importSuccess.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setImportSuccess(null);
                      setImportUrl('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Import Another
                  </button>
                  <Link
                    href={`/recipes/${importSuccess.id}`}
                    className="btn-primary flex-1 text-center"
                    onClick={closeImportModal}
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ) : (
              // Input state
              <>
                <p className="text-sm text-stone-500 mb-4">
                  Paste a recipe URL from your favorite cooking site. We&apos;ll extract the ingredients and instructions automatically.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">Recipe URL</label>
                    <input
                      type="url"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      placeholder="https://example.com/delicious-recipe"
                      className="input"
                      disabled={isImporting}
                    />
                  </div>
                  
                  {importError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-sm text-red-700">{importError}</p>
                      <p className="text-xs text-red-500 mt-1">
                        Try a different URL or check that the page contains recipe data.
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs text-stone-500">
                      <strong>Supported sites:</strong> Most recipe blogs and cooking sites that use structured recipe data (Schema.org Recipe format)
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeImportModal}
                    className="btn-secondary flex-1"
                    disabled={isImporting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportRecipe}
                    disabled={isImporting || !importUrl.trim()}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" />
                        Import Recipe
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
