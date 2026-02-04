'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  DollarSign, Clock, Leaf, Globe, RefreshCw, 
  ChevronRight, History, Trash2, Store, Key, Check, Truck
} from 'lucide-react';
import Link from 'next/link';
import { DietaryTag } from '@/types';
import { cuisineOptions } from '@/data/recipes';

const dietaryOptions: { value: DietaryTag; label: string; emoji: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { value: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { value: 'keto', label: 'Keto', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', emoji: '🍖' },
  { value: 'low-carb', label: 'Low-Carb', emoji: '🥗' },
  { value: 'nut-free', label: 'Nut-Free', emoji: '🥜' },
];

export default function SettingsPage() {
  const { 
    preferences, 
    updatePreferences, 
    budget, 
    updateBudget, 
    resetWeeklySpent,
    cookHistory,
    pantryItems,
    stores,
    selectedStore,
    setSelectedStore,
    spoonacularApiKey,
    setSpoonacularApiKey,
  } = useApp();

  const [showHistory, setShowHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(spoonacularApiKey);

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

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSaveApiKey = () => {
    setSpoonacularApiKey(tempApiKey);
  };

  const budgetPercentUsed = Math.min((budget.currentWeekSpent / budget.weeklyBudget) * 100, 100);
  const daysUntilReset = 7 - Math.floor(
    (Date.now() - new Date(budget.weekStartDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="px-4 py-6 animate-fade-in space-y-6 pb-24">
      {/* Header */}
      <header>
        <h1 className="font-display text-2xl font-semibold text-stone-800">
          Settings
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Customize your experience
        </p>
      </header>

      {/* My Store Section */}
      <section className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Store className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-stone-800">My Store</h2>
            <p className="text-sm text-stone-500">Set your preferred grocery store</p>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                selectedStore?.id === store.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-stone-200 hover:border-blue-300'
              }`}
            >
              <span className="text-2xl">{store.logo}</span>
              <div className="flex-1 text-left">
                <p className="font-medium text-stone-800">{store.name}</p>
                <p className="text-xs text-stone-500">
                  {store.deliveryAvailable ? (
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Delivery available
                    </span>
                  ) : 'In-store only'}
                </p>
              </div>
              {selectedStore?.id === store.id && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <Link href="/store" className="btn-secondary w-full flex items-center justify-center gap-2">
          <Store className="w-4 h-4" />
          Browse Store
        </Link>
      </section>

      {/* Spoonacular API Key */}
      <section className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Key className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-stone-800">Recipe API</h2>
            <p className="text-sm text-stone-500">Connect to Spoonacular for more recipes</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="label">Spoonacular API Key</label>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="input"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveApiKey}
              disabled={tempApiKey === spoonacularApiKey}
              className="btn-primary flex-1"
            >
              Save Key
            </button>
            <a
              href="https://spoonacular.com/food-api"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1 text-center"
            >
              Get Free Key
            </a>
          </div>
          {spoonacularApiKey && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> API key configured
            </p>
          )}
        </div>
      </section>

      {/* Budget Section */}
      <section className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-sage-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-stone-800">Weekly Budget</h2>
            <p className="text-sm text-stone-500">Track your food spending</p>
          </div>
        </div>

        {/* Budget Input */}
        <div className="mb-4">
          <label className="label">Budget Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
            <input
              type="number"
              value={budget.weeklyBudget}
              onChange={(e) => updateBudget({ weeklyBudget: parseFloat(e.target.value) || 0 })}
              min="0"
              step="10"
              className="input pl-7"
            />
          </div>
        </div>

        {/* Current Spending */}
        <div className="bg-cream-100 rounded-xl p-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm text-stone-500">This week</p>
              <p className="text-2xl font-semibold text-stone-800">
                ${budget.currentWeekSpent.toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-stone-500">
              {daysUntilReset > 0 ? `${daysUntilReset} days left` : 'Reset due'}
            </p>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPercentUsed > 90
                  ? 'bg-terracotta-500'
                  : budgetPercentUsed > 70
                  ? 'bg-yellow-500'
                  : 'bg-sage-500'
              }`}
              style={{ width: `${budgetPercentUsed}%` }}
            />
          </div>
          <button
            onClick={resetWeeklySpent}
            className="flex items-center gap-2 text-sm text-sage-600 font-medium mt-3"
          >
            <RefreshCw className="w-4 h-4" />
            Reset weekly spending
          </button>
        </div>
      </section>

      {/* Cooking Preferences */}
      <section className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-terracotta-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-stone-800">Cooking Preferences</h2>
            <p className="text-sm text-stone-500">Set your defaults</p>
          </div>
        </div>

        {/* Max Cook Time */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Max Cook Time</label>
            <span className="text-sm font-medium text-stone-700">
              {preferences.maxCookTime} min
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={preferences.maxCookTime}
            onChange={(e) => updatePreferences({ maxCookTime: parseInt(e.target.value) })}
            className="w-full accent-sage-600"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>10 min</span>
            <span>2 hours</span>
          </div>
        </div>

        {/* Max Budget per Meal */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Max Budget per Meal</label>
            <span className="text-sm font-medium text-stone-700">
              ${preferences.maxBudgetPerMeal}
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={preferences.maxBudgetPerMeal}
            onChange={(e) => updatePreferences({ maxBudgetPerMeal: parseInt(e.target.value) })}
            className="w-full accent-sage-600"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>$5</span>
            <span>$50</span>
          </div>
        </div>

        {/* Default Servings */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Default Servings</label>
            <span className="text-sm font-medium text-stone-700">
              {preferences.servingSize}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={preferences.servingSize}
            onChange={(e) => updatePreferences({ servingSize: parseInt(e.target.value) })}
            className="w-full accent-sage-600"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>1 person</span>
            <span>8 people</span>
          </div>
        </div>
      </section>

      {/* Dietary Restrictions */}
      <section className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-sage-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-stone-800">Dietary Restrictions</h2>
            <p className="text-sm text-stone-500">Filter recipes automatically</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleDietaryFilter(opt.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                preferences.dietaryRestrictions.includes(opt.value)
                  ? 'bg-sage-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Cuisine Preferences */}
      <section className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center">
            <Globe className="w-5 h-5 text-terracotta-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-stone-800">Favorite Cuisines</h2>
            <p className="text-sm text-stone-500">Prioritize these cuisines</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {cuisineOptions.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                preferences.cuisinePreferences.includes(cuisine)
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </section>

      {/* Cook History */}
      <section className="card">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-3 w-full"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
            <History className="w-5 h-5 text-stone-600" />
          </div>
          <div className="flex-1 text-left">
            <h2 className="font-medium text-stone-800">Cooking History</h2>
            <p className="text-sm text-stone-500">{cookHistory.length} meals cooked</p>
          </div>
          <ChevronRight className={`w-5 h-5 text-stone-400 transition-transform ${
            showHistory ? 'rotate-90' : ''
          }`} />
        </button>

        {showHistory && cookHistory.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-stone-100 pt-4">
            {cookHistory.slice(0, 10).map((session, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-stone-700">{session.recipeName}</p>
                  <p className="text-xs text-stone-400">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-stone-500">${session.totalCost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Data Management */}
      <section className="card border-terracotta-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-terracotta-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-stone-800">Data Management</h2>
            <p className="text-sm text-stone-500">
              {pantryItems.length} pantry items • {cookHistory.length} cook sessions
            </p>
          </div>
        </div>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="btn-danger w-full"
          >
            Clear All Data
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-terracotta-600 text-center">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button onClick={clearAllData} className="btn-danger flex-1">
                Yes, Clear All
              </button>
            </div>
          </div>
        )}
      </section>

      {/* App Info */}
      <div className="text-center py-4 text-stone-400 text-sm">
        <p>Pantry Pal v1.0</p>
        <p className="text-xs mt-1">Your personal kitchen assistant</p>
      </div>
    </div>
  );
}
