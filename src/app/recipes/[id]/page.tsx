'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Recipe } from '@/types';
import { 
  ArrowLeft, Clock, DollarSign, Users, ChefHat, 
  Check, Square, CheckSquare, Flame, Minus, Plus, Loader2 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatQuantityUnit } from '@/utils/unitUtils';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    recipes, 
    findPantryMatch, 
    deductIngredients, 
    addCookSession, 
    addToSpent,
    fetchRecipeById
  } = useApp();

  const [recipe, setRecipe] = useState<Recipe | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [cookMode, setCookMode] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Load recipe - check local first, then fetch if needed
  useEffect(() => {
    const loadRecipe = async () => {
      const id = params.id as string;
      
      // First check if it's already in our recipes array
      const localRecipe = recipes.find((r) => r.id === id);
      if (localRecipe) {
        setRecipe(localRecipe);
        return;
      }
      
      // If it's an API recipe, fetch it
      if (id.startsWith('spoon-')) {
        setIsLoading(true);
        const fetched = await fetchRecipeById(id);
        setRecipe(fetched);
        setIsLoading(false);
      } else {
        // Not found
        setRecipe(null);
      }
    };
    
    loadRecipe();
  }, [params.id, recipes, fetchRecipeById]);

  // Calculate which ingredients we have
  const ingredientStatus = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((ing) => {
      const pantryItem = findPantryMatch(ing);
      const adjustedQty = ing.quantity * servingMultiplier;
      const hasEnough = pantryItem ? pantryItem.quantity >= adjustedQty : false;
      return {
        ...ing,
        adjustedQuantity: adjustedQty,
        pantryItem,
        hasEnough,
        inPantry: !!pantryItem,
      };
    });
  }, [recipe, findPantryMatch, servingMultiplier]);

  const matchPercentage = useMemo(() => {
    const required = ingredientStatus.filter((i) => !i.optional);
    const matched = required.filter((i) => i.inPantry);
    return required.length > 0 ? Math.round((matched.length / required.length) * 100) : 0;
  }, [ingredientStatus]);

  if (isLoading || recipe === undefined) {
    return (
      <div className="px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 text-sage-600 animate-spin mx-auto" />
        <p className="text-stone-500 mt-2">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-stone-500">Recipe not found</p>
        <Link href="/recipes" className="text-sage-600 font-medium mt-2 inline-block">
          Back to recipes
        </Link>
      </div>
    );
  }

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleFinishCooking = () => {
    // Collect used ingredients
    const usedIngredients = ingredientStatus
      .filter((ing) => checkedIngredients.has(ing.name))
      .map((ing) => ({
        name: ing.name,
        quantity: ing.adjustedQuantity,
        unit: ing.unit,
        cost: ing.pantryItem?.cost ? ing.pantryItem.cost * ing.adjustedQuantity : 0,
      }));

    // Calculate total cost
    const totalCost = usedIngredients.reduce((sum, ing) => sum + ing.cost, 0);

    // Deduct from pantry
    deductIngredients(usedIngredients);

    // Add to cook history
    addCookSession({
      recipeId: recipe.id,
      recipeName: recipe.title,
      ingredientsUsed: usedIngredients,
      totalCost,
    });

    // Add to weekly spent
    addToSpent(totalCost);

    // Navigate back
    router.push('/');
  };

  const adjustedServings = recipe.servings * servingMultiplier;
  const adjustedCost = recipe.estimatedCost * servingMultiplier;

  return (
    <div className="animate-fade-in pb-24">
      {/* Hero Image */}
      <div className="relative h-64 bg-stone-200">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/recipes"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-stone-700" />
        </Link>

        {/* Match Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-medium text-sm ${
          matchPercentage >= 80
            ? 'bg-sage-600 text-white'
            : matchPercentage >= 50
            ? 'bg-yellow-500 text-white'
            : 'bg-stone-600 text-white'
        }`}>
          {matchPercentage}% match
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-display text-2xl font-semibold text-white leading-tight">
            {recipe.title}
          </h1>
          <p className="text-white/80 text-sm mt-1">{recipe.description}</p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="px-4 py-4 bg-white border-b border-stone-100">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <Clock className="w-5 h-5 text-stone-400 mx-auto" />
            <p className="text-sm font-medium text-stone-700 mt-1">{recipe.cookTime}m</p>
            <p className="text-xs text-stone-400">Cook time</p>
          </div>
          <div className="text-center">
            <DollarSign className="w-5 h-5 text-stone-400 mx-auto" />
            <p className="text-sm font-medium text-stone-700 mt-1">${adjustedCost.toFixed(0)}</p>
            <p className="text-xs text-stone-400">Est. cost</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 text-stone-400 mx-auto" />
            <p className="text-sm font-medium text-stone-700 mt-1">{adjustedServings}</p>
            <p className="text-xs text-stone-400">Servings</p>
          </div>
          <div className="text-center">
            <ChefHat className="w-5 h-5 text-stone-400 mx-auto" />
            <p className="text-sm font-medium text-stone-700 mt-1 capitalize">{recipe.difficulty}</p>
            <p className="text-xs text-stone-400">Difficulty</p>
          </div>
        </div>
      </div>

      {/* Serving Adjuster */}
      <div className="px-4 py-3 bg-cream-100 flex items-center justify-between">
        <span className="text-sm text-stone-600">Adjust servings</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center"
          >
            <Minus className="w-4 h-4 text-stone-600" />
          </button>
          <span className="font-medium text-stone-800 w-8 text-center">
            {servingMultiplier}x
          </span>
          <button
            onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Tags */}
        {recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.dietaryTags.map((tag) => (
              <span key={tag} className="badge-sage capitalize">
                {tag}
              </span>
            ))}
            <span className="badge-stone">{recipe.cuisine}</span>
          </div>
        )}

        {/* Ingredients */}
        <section>
          <h2 className="font-display text-lg font-semibold text-stone-800 mb-3">
            Ingredients
          </h2>
          <div className="space-y-2">
            {ingredientStatus.map((ing, idx) => (
              <div
                key={idx}
                onClick={cookMode ? () => toggleIngredient(ing.name) : undefined}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  cookMode ? 'cursor-pointer' : ''
                } ${
                  cookMode && checkedIngredients.has(ing.name)
                    ? 'bg-sage-50 border border-sage-200'
                    : 'bg-white border border-stone-100'
                }`}
              >
                {cookMode ? (
                  checkedIngredients.has(ing.name) ? (
                    <CheckSquare className="w-5 h-5 text-sage-600 flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-300 flex-shrink-0" />
                  )
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      ing.hasEnough
                        ? 'bg-sage-500'
                        : ing.inPantry
                        ? 'bg-yellow-500'
                        : 'bg-stone-300'
                    }`}
                  />
                )}
                <span
                  className={`flex-1 ${
                    cookMode && checkedIngredients.has(ing.name)
                      ? 'line-through text-stone-400'
                      : 'text-stone-700'
                  }`}
                >
                  <span className="font-medium">
                    {formatQuantityUnit(ing.adjustedQuantity, ing.unit)}
                  </span>{' '}
                  {ing.name}
                  {ing.optional && (
                    <span className="text-stone-400 text-sm ml-1">(optional)</span>
                  )}
                </span>
                {!cookMode && (
                  <span
                    className={`text-xs ${
                      ing.hasEnough
                        ? 'text-sage-600'
                        : ing.inPantry
                        ? 'text-yellow-600'
                        : 'text-stone-400'
                    }`}
                  >
                    {ing.hasEnough
                      ? '✓ Have'
                      : ing.inPantry
                      ? 'Low'
                      : 'Need'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section>
          <h2 className="font-display text-lg font-semibold text-stone-800 mb-3">
            Instructions
          </h2>
          <div className="space-y-3">
            {recipe.instructions.map((step, idx) => (
              <div
                key={idx}
                onClick={cookMode ? () => toggleStep(idx) : undefined}
                className={`flex gap-3 p-3 rounded-xl transition-colors ${
                  cookMode ? 'cursor-pointer' : ''
                } ${
                  cookMode && completedSteps.has(idx)
                    ? 'bg-sage-50 border border-sage-200'
                    : 'bg-white border border-stone-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium ${
                    cookMode && completedSteps.has(idx)
                      ? 'bg-sage-600 text-white'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cookMode && completedSteps.has(idx) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    cookMode && completedSteps.has(idx)
                      ? 'text-stone-400'
                      : 'text-stone-700'
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-stone-200 p-4 z-40">
        <div className="max-w-lg mx-auto">
          {!cookMode ? (
            <button
              onClick={() => setCookMode(true)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5" />
              Start Cooking
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCookMode(false);
                  setCheckedIngredients(new Set());
                  setCompletedSteps(new Set());
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishCooking}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Finish & Update Pantry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
