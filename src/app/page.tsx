'use client';

import { useApp } from '@/context/AppContext';
import { Package, ChefHat, DollarSign, Clock, TrendingUp, Flame, Store, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { pantryItems, budget, getMatchingRecipes, cookHistory } = useApp();
  
  const matchingRecipes = getMatchingRecipes();
  const topRecipes = matchingRecipes.slice(0, 3);
  const budgetRemaining = budget.weeklyBudget - budget.currentWeekSpent;
  const budgetPercentUsed = Math.min((budget.currentWeekSpent / budget.weeklyBudget) * 100, 100);
  
  // Group pantry items by category
  const categoryCount = pantryItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const recentCooks = cookHistory.slice(0, 3);

  return (
    <div className="px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <header className="pt-2">
        <p className="text-stone-500 text-sm font-medium">Welcome back</p>
        <h1 className="font-display text-3xl font-semibold text-stone-800 mt-1">
          Pantry Pal
        </h1>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/pantry" className="card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-stone-500 text-sm">Pantry Items</p>
              <p className="text-2xl font-semibold text-stone-800 mt-1">
                {pantryItems.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-sage-600" />
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            {Object.keys(categoryCount).length} categories
          </p>
        </Link>

        <Link href="/recipes" className="card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-stone-500 text-sm">Can Make</p>
              <p className="text-2xl font-semibold text-stone-800 mt-1">
                {matchingRecipes.filter(r => r.matchPercentage >= 80).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-terracotta-600" />
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            recipes with 80%+ match
          </p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/store" className="card hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-stone-800">My Store</p>
              <p className="text-xs text-stone-500">Browse & prices</p>
            </div>
          </div>
        </Link>

        <Link href="/delivery" className="card hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-stone-800">Order Delivery</p>
              <p className="text-xs text-stone-500">Get groceries delivered</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Budget Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-sage-600" />
            </div>
            <span className="font-medium text-stone-700">Weekly Budget</span>
          </div>
          <Link href="/settings" className="text-xs text-sage-600 font-medium">
            Edit
          </Link>
        </div>
        
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-3xl font-semibold text-stone-800">
              ${budgetRemaining.toFixed(0)}
            </span>
            <span className="text-stone-400 text-sm ml-1">remaining</span>
          </div>
          <span className="text-stone-500 text-sm">
            ${budget.currentWeekSpent.toFixed(0)} / ${budget.weeklyBudget}
          </span>
        </div>
        
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
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
      </div>

      {/* Top Recipe Matches */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold text-stone-800">
            Ready to Cook
          </h2>
          <Link href="/recipes" className="text-sm text-sage-600 font-medium">
            View all
          </Link>
        </div>

        {topRecipes.length > 0 ? (
          <div className="space-y-3">
            {topRecipes.map(({ recipe, matchPercentage, missingIngredients }) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="card flex gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-800 truncate">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.cookTime}m
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ~${recipe.estimatedCost}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`badge ${
                      matchPercentage >= 80 ? 'badge-sage' : 'badge-stone'
                    }`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {matchPercentage}% match
                    </div>
                    {missingIngredients.length > 0 && (
                      <span className="text-xs text-stone-400">
                        Need {missingIngredients.length} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">Add items to your pantry</p>
            <p className="text-stone-400 text-sm mt-1">
              to see recipe matches
            </p>
            <Link href="/pantry" className="btn-primary inline-block mt-4">
              Add Items
            </Link>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      {recentCooks.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-stone-800 mb-3">
            Recent Cooks
          </h2>
          <div className="space-y-2">
            {recentCooks.map((session, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-100"
              >
                <div className="w-8 h-8 rounded-lg bg-terracotta-100 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-terracotta-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-700">
                    {session.recipeName}
                  </p>
                  <p className="text-xs text-stone-400">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-stone-500">
                  ${session.totalCost.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
