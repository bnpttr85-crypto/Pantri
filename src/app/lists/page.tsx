'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Plus,
  Trash2,
  Check,
  Square,
  CheckSquare,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  X,
  Package,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { GroceryListItem, PantryCategory } from '@/types';
import { categoryOptions, unitOptions } from '@/data/recipes';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { StandardIngredient, findIngredientMatch } from '@/data/ingredients';
import { formatQuantityUnit } from '@/utils/unitUtils';

export default function GroceryListPage() {
  const {
    groceryLists,
    activeGroceryList,
    createGroceryList,
    deleteGroceryList,
    setActiveGroceryList,
    addToGroceryList,
    removeFromGroceryList,
    toggleGroceryItem,
    generateSmartGroceryList,
    addCheckedItemsToPantry,
    savedRecipes,
    recipes,
  } = useApp();

  const [showNewListModal, setShowNewListModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showSmartListModal, setShowSmartListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [smartListName, setSmartListName] = useState('');

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createGroceryList(newListName.trim());
    setNewListName('');
    setShowNewListModal(false);
  };

  const handleGenerateSmartList = () => {
    if (savedRecipes.length === 0) {
      alert('Save some recipes first to generate a smart list!');
      return;
    }
    const name = smartListName.trim() || `Shopping ${new Date().toLocaleDateString()}`;
    generateSmartGroceryList(name);
    setSmartListName('');
    setShowSmartListModal(false);
  };

  const handleAddCheckedToPantry = () => {
    if (!activeGroceryList) return;
    const checkedCount = activeGroceryList.items.filter(i => i.checked).length;
    if (checkedCount === 0) {
      alert('Check off items you\'ve purchased first!');
      return;
    }
    addCheckedItemsToPantry(activeGroceryList.id);
  };

  // Group items by category
  const groupedItems = activeGroceryList?.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryListItem[]>) || {};

  const checkedCount = activeGroceryList?.items.filter(i => i.checked).length || 0;
  const totalCount = activeGroceryList?.items.length || 0;
  const totalEstimatedCost = activeGroceryList?.items.reduce(
    (sum, item) => sum + (item.estimatedCost || 0),
    0
  ) || 0;

  return (
    <div className="px-4 py-6 animate-fade-in pb-32">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-stone-800">
          Grocery Lists
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {groceryLists.length} lists • {savedRecipes.length} saved recipes
        </p>
      </header>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowNewListModal(true)}
          className="flex-1 card flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
            <Plus className="w-5 h-5 text-sage-600" />
          </div>
          <span className="font-medium text-stone-700">New List</span>
        </button>

        <button
          onClick={() => setShowSmartListModal(true)}
          className="flex-1 card flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-terracotta-600" />
          </div>
          <span className="font-medium text-stone-700">Smart List</span>
        </button>
      </div>

      {/* Saved Recipes Indicator */}
      {savedRecipes.length > 0 && (
        <div className="bg-cream-200 rounded-xl p-3 mb-6">
          <p className="text-sm text-stone-700">
            <span className="font-medium">{savedRecipes.length} recipes saved</span> for meal planning.
            Generate a smart list to get ingredients you need!
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {savedRecipes.slice(0, 3).map((saved) => {
              const recipe = recipes.find(r => r.id === saved.recipeId);
              return recipe ? (
                <span key={saved.recipeId} className="badge-stone text-[10px]">
                  {recipe.title}
                </span>
              ) : null;
            })}
            {savedRecipes.length > 3 && (
              <span className="text-xs text-stone-500">+{savedRecipes.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* List Selector */}
      {groceryLists.length > 0 && (
        <div className="mb-6">
          <label className="label">Select List</label>
          <div className="space-y-2">
            {groceryLists.map((list) => (
              <button
                key={list.id}
                onClick={() => setActiveGroceryList(list.id)}
                className={`w-full card flex items-center justify-between transition-all ${
                  activeGroceryList?.id === list.id
                    ? 'border-sage-500 bg-sage-50'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className={`w-5 h-5 ${
                    activeGroceryList?.id === list.id ? 'text-sage-600' : 'text-stone-400'
                  }`} />
                  <div className="text-left">
                    <p className="font-medium text-stone-800">{list.name}</p>
                    <p className="text-xs text-stone-500">
                      {list.items.length} items • {new Date(list.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this list?')) {
                        deleteGroceryList(list.id);
                      }
                    }}
                    className="p-2 text-stone-400 hover:text-terracotta-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active List Content */}
      {activeGroceryList ? (
        <div>
          {/* List Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-stone-800">
                {activeGroceryList.name}
              </h2>
              <p className="text-sm text-stone-500">
                {checkedCount}/{totalCount} items checked
                {totalEstimatedCost > 0 && (
                  <span className="ml-2 text-sage-600">
                    ~${totalEstimatedCost.toFixed(2)} est.
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-sage-500 rounded-full transition-all duration-300"
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </div>
          )}

          {/* Items by Category */}
          {Object.keys(groupedItems).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => {
                const catInfo = categoryOptions.find((c) => c.value === category);
                return (
                  <section key={category}>
                    <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span>{catInfo?.emoji || '📦'}</span>
                      {catInfo?.label || category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleGroceryItem(activeGroceryList.id, item.id)}
                          className={`card flex items-center gap-3 cursor-pointer transition-all ${
                            item.checked ? 'bg-sage-50 border-sage-200' : ''
                          }`}
                        >
                          {item.checked ? (
                            <CheckSquare className="w-5 h-5 text-sage-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-stone-300 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${
                              item.checked ? 'line-through text-stone-400' : 'text-stone-800'
                            }`}>
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-stone-500">
                              <span>{formatQuantityUnit(item.quantity, item.unit)}</span>
                              {item.estimatedCost && (
                                <span className="text-sage-600">
                                  ~${item.estimatedCost.toFixed(2)}
                                </span>
                              )}
                              {item.fromRecipe && (
                                <span className="text-stone-400 truncate">
                                  for {item.fromRecipe}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromGroceryList(activeGroceryList.id, item.id);
                            }}
                            className="p-2 text-stone-400 hover:text-terracotta-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600 font-medium">List is empty</p>
              <p className="text-stone-400 text-sm mt-1">
                Add items or generate a smart list
              </p>
            </div>
          )}

          {/* Bottom Actions */}
          {totalCount > 0 && (
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-stone-200 p-4 z-40">
              <div className="max-w-lg mx-auto flex gap-3">
                <Link
                  href="/delivery"
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Truck className="w-5 h-5" />
                  Order Delivery
                </Link>
                {checkedCount > 0 && (
                  <button
                    onClick={handleAddCheckedToPantry}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Package className="w-5 h-5" />
                    Add {checkedCount} to Pantry
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : groceryLists.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-600 font-medium">No grocery lists yet</p>
          <p className="text-stone-400 text-sm mt-1">
            Create a new list or generate a smart list from saved recipes
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-stone-500">Select a list above to view items</p>
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 pb-24 sm:pb-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h2 className="font-display text-xl font-semibold text-stone-800">
                New Grocery List
              </h2>
              <button
                onClick={() => setShowNewListModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="label">List Name</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Weekly groceries"
                  className="input"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewListModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button onClick={handleCreateList} className="btn-primary flex-1">
                  Create List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart List Modal */}
      {showSmartListModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 pb-24 sm:pb-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h2 className="font-display text-xl font-semibold text-stone-800">
                Generate Smart List
              </h2>
              <button
                onClick={() => setShowSmartListModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-stone-600">
                This will create a grocery list based on your {savedRecipes.length} saved recipes,
                minus what you already have in your pantry.
              </p>
              <div>
                <label className="label">List Name (optional)</label>
                <input
                  type="text"
                  value={smartListName}
                  onChange={(e) => setSmartListName(e.target.value)}
                  placeholder={`Shopping ${new Date().toLocaleDateString()}`}
                  className="input"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSmartListModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateSmartList}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && activeGroceryList && (
        <AddItemModal
          listId={activeGroceryList.id}
          onClose={() => setShowAddItemModal(false)}
          onAdd={(item) => {
            addToGroceryList(activeGroceryList.id, item);
            setShowAddItemModal(false);
          }}
        />
      )}
    </div>
  );
}

interface AddItemModalProps {
  listId: string;
  onClose: () => void;
  onAdd: (item: Omit<GroceryListItem, 'id'>) => void;
}

function AddItemModal({ onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('whole');
  const [category, setCategory] = useState<PantryCategory>('other');

  const handleIngredientSelect = (ingredient: StandardIngredient) => {
    setName(ingredient.canonicalName);
    setUnit(ingredient.defaultUnit);
    setCategory(ingredient.category);
    setQuantity(ingredient.defaultQuantity.toString());
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.length >= 3) {
      const match = findIngredientMatch(value);
      if (match) {
        setCategory(match.category);
        if (unit === 'whole') {
          setUnit(match.defaultUnit);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const match = findIngredientMatch(name);

    onAdd({
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      unit,
      category,
      checked: false,
      estimatedCost: match?.avgPrice ? match.avgPrice * (parseFloat(quantity) || 1) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 pb-24 sm:pb-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h2 className="font-display text-xl font-semibold text-stone-800">
            Add Item
          </h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">Item Name</label>
            <AutocompleteInput
              value={name}
              onChange={handleNameChange}
              onSelect={handleIngredientSelect}
              placeholder="Start typing..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.1"
                className="input"
              />
            </div>
            <div>
              <label className="label">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="input"
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PantryCategory)}
              className="input"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}