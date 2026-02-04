'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Search, Trash2, Edit2, X, Check, Barcode } from 'lucide-react';
import Link from 'next/link';
import { PantryItem, PantryCategory } from '@/types';
import { categoryOptions, unitOptions } from '@/data/recipes';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { StandardIngredient, findIngredientMatch } from '@/data/ingredients';
import { formatQuantityUnit, normalizeUnit } from '@/utils/unitUtils';

export default function PantryPage() {
  const { pantryItems, addPantryItem, updatePantryItem, deletePantryItem, spices } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  const spicesOwned = spices.filter(s => s.have).length;

  // Filter items
  const filteredItems = pantryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);

  // Count items by category
  const stapleCount = pantryItems.filter(i => i.category === 'staples').length;

  return (
    <div className="px-4 py-6 animate-fade-in pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-800">
            Pantry
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {pantryItems.length} items
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/barcode"
            className="btn-secondary flex items-center gap-2"
          >
            <Barcode className="w-4 h-4" />
            Scan
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </header>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/spices"
          className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 border border-amber-200 hover:shadow-md transition-shadow"
        >
          <div className="text-2xl mb-1">🧂</div>
          <h3 className="font-semibold text-amber-800">Spice Rack</h3>
          <p className="text-xs text-amber-600">{spicesOwned} spices in stock</p>
        </Link>
        <Link
          href="/pantry?category=staples"
          onClick={(e) => {
            e.preventDefault();
            setSelectedCategory('staples');
          }}
          className="bg-gradient-to-br from-stone-100 to-stone-50 rounded-xl p-4 border border-stone-200 hover:shadow-md transition-shadow"
        >
          <div className="text-2xl mb-1">📦</div>
          <h3 className="font-semibold text-stone-800">Staples</h3>
          <p className="text-xs text-stone-600">{stapleCount} items</p>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-sage-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.value
                  ? 'bg-sage-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      {Object.keys(groupedItems).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => {
            const catInfo = categoryOptions.find((c) => c.value === category);
            return (
              <section key={category}>
                <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>{catInfo?.emoji}</span>
                  {catInfo?.label || category}
                </h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="card flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-stone-800">{item.name}</p>
                        <p className="text-sm text-stone-500">
                          {formatQuantityUnit(item.quantity, item.unit)}
                          {item.cost && (
                            <span className="ml-2 text-sage-600">
                              ${item.cost.toFixed(2)}/{normalizeUnit(item.unit)}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-stone-400 hover:text-sage-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePantryItem(item.id)}
                          className="p-2 text-stone-400 hover:text-terracotta-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-stone-600 font-medium">No items found</p>
          <p className="text-stone-400 text-sm mt-1">
            {searchQuery ? 'Try a different search' : 'Add items to get started'}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <ItemModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={(data) => {
            if (editingItem) {
              updatePantryItem(editingItem.id, data);
            } else {
              addPantryItem(data);
            }
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface ItemModalProps {
  item: PantryItem | null;
  onClose: () => void;
  onSave: (data: Omit<PantryItem, 'id' | 'dateAdded'>) => void;
}

function ItemModal({ item, onClose, onSave }: ItemModalProps) {
  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState(item?.quantity?.toString() || '1');
  const [unit, setUnit] = useState(item?.unit || 'whole');
  const [category, setCategory] = useState<PantryCategory>(item?.category || 'other');
  const [cost, setCost] = useState(item?.cost?.toString() || '');

  const handleIngredientSelect = (ingredient: StandardIngredient) => {
    setName(ingredient.canonicalName);
    setUnit(ingredient.defaultUnit);
    setCategory(ingredient.category);
    if (ingredient.avgPrice) {
      setCost(ingredient.avgPrice.toString());
    }
    if (!item) {
      setQuantity(ingredient.defaultQuantity.toString());
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-detect category if user types manually
    if (value.length >= 3) {
      const match = findIngredientMatch(value);
      if (match) {
        setCategory(match.category);
        if (!unit || unit === 'whole') {
          setUnit(match.defaultUnit);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      unit,
      category,
      cost: cost ? parseFloat(cost) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md animate-slide-up max-h-[85vh] overflow-y-auto mb-20 sm:mb-0 sm:mx-4">
        <div className="flex items-center justify-between p-4 border-b border-stone-100 sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="font-display text-xl font-semibold text-stone-800">
            {item ? 'Edit Item' : 'Add Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">Name</label>
            <AutocompleteInput
              value={name}
              onChange={handleNameChange}
              onSelect={handleIngredientSelect}
              placeholder="Start typing... (e.g., chicken, milk, tomato)"
              autoFocus={!item}
            />
            <p className="text-xs text-stone-400 mt-1">
              Smart suggestions will appear as you type
            </p>
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

          <div>
            <label className="label">Cost per unit (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                $
              </span>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="input pl-7"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              {item ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
