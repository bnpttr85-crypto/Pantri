'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, Check, Truck, MapPin, Search, 
  ShoppingCart, ChevronRight, Package
} from 'lucide-react';
import Link from 'next/link';
import { PantryCategory } from '@/types';

const categoryEmojis: Record<PantryCategory, string> = {
  produce: '🥬',
  dairy: '🥛',
  meat: '🥩',
  seafood: '🐟',
  grains: '🍞',
  canned: '🥫',
  frozen: '🧊',
  condiments: '🍶',
  spices: '🧂',
  staples: '📦',
  beverages: '🥤',
  snacks: '🍿',
  other: '🛒',
};

const categoryLabels: Record<PantryCategory, string> = {
  produce: 'Produce',
  dairy: 'Dairy & Eggs',
  meat: 'Meat',
  seafood: 'Seafood',
  grains: 'Grains & Bread',
  canned: 'Canned Goods',
  frozen: 'Frozen',
  condiments: 'Condiments',
  spices: 'Spices',
  staples: 'Staples',
  beverages: 'Beverages',
  snacks: 'Snacks',
  other: 'Other',
};

export default function MyStorePage() {
  const { stores, selectedStore, setSelectedStore, getStoreProducts, searchProducts, addSmartPantryItem } = useApp();
  
  const [view, setView] = useState<'select' | 'browse'>('select');
  const [selectedCategory, setSelectedCategory] = useState<PantryCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const products = useMemo(() => {
    if (searchQuery.trim()) {
      return searchProducts(searchQuery);
    }
    if (selectedCategory) {
      return getStoreProducts(selectedCategory);
    }
    return [];
  }, [searchQuery, selectedCategory, searchProducts, getStoreProducts]);
  
  const categories: PantryCategory[] = [
    'produce', 'dairy', 'meat', 'seafood', 'grains', 'canned', 
    'frozen', 'condiments', 'spices', 'staples', 'beverages', 'snacks'
  ];
  
  const handleSelectStore = (storeId: string) => {
    setSelectedStore(storeId);
    setView('browse');
  };
  
  const handleAddToList = (product: ReturnType<typeof getStoreProducts>[0]) => {
    addSmartPantryItem(product.name, 1, product.unit, product.price);
  };
  
  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4">
        <div className="flex items-center gap-3">
          {view === 'browse' && selectedStore ? (
            <button onClick={() => setView('select')} className="text-stone-600">
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/settings" className="text-stone-600">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          )}
          <div className="flex-1">
            <h1 className="font-display text-xl font-semibold text-stone-800">
              {view === 'browse' && selectedStore ? selectedStore.name : 'My Store'}
            </h1>
            <p className="text-sm text-stone-500">
              {view === 'browse' ? 'Browse products & prices' : 'Select your grocery store'}
            </p>
          </div>
          {selectedStore && view === 'select' && (
            <button
              onClick={() => setView('browse')}
              className="text-sage-600 font-medium text-sm"
            >
              Browse
            </button>
          )}
        </div>
      </div>
      
      {view === 'select' ? (
        // Store Selection View
        <div className="p-4 space-y-4">
          <p className="text-sm text-stone-600">
            Select a store to see product prices and availability. Your selected store will be used for price estimates throughout the app.
          </p>
          
          {/* Store Cards */}
          <div className="space-y-3">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleSelectStore(store.id)}
                className={`w-full bg-white rounded-2xl border-2 p-4 text-left transition-all ${
                  selectedStore?.id === store.id
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-stone-200 hover:border-sage-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-3xl">
                    {store.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-stone-800">{store.name}</h3>
                      {selectedStore?.id === store.id && (
                        <div className="w-5 h-5 rounded-full bg-sage-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {store.address && (
                      <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {store.address}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {store.deliveryAvailable ? (
                        <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          Delivery available
                        </span>
                      ) : (
                        <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                          In-store only
                        </span>
                      )}
                      {store.deliveryFee && (
                        <span className="text-xs text-stone-400">
                          ${store.deliveryFee} fee • ${store.deliveryMinimum} min
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-300" />
                </div>
              </button>
            ))}
          </div>
          
          {/* Coming Soon Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
            <h4 className="font-medium text-amber-800 mb-1">🚧 Demo Mode</h4>
            <p className="text-sm text-amber-700">
              This is a mockup with sample stores and prices. Real store integration would require partnerships with grocery chains to access their inventory APIs.
            </p>
          </div>
        </div>
      ) : (
        // Browse Store View
        <div>
          {/* Search Bar */}
          <div className="p-4 bg-white border-b border-stone-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setSelectedCategory(null);
                }}
                placeholder="Search products..."
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Category Grid or Products */}
          {!searchQuery && !selectedCategory ? (
            <div className="p-4">
              <h3 className="font-medium text-stone-700 mb-3">Shop by Category</h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="bg-white rounded-xl border border-stone-200 p-4 text-center hover:bg-sage-50 hover:border-sage-200 transition-colors"
                  >
                    <span className="text-3xl mb-2 block">{categoryEmojis[cat]}</span>
                    <span className="text-xs font-medium text-stone-600">{categoryLabels[cat]}</span>
                  </button>
                ))}
              </div>
              
              {/* Delivery Option */}
              {selectedStore?.deliveryAvailable && (
                <div className="mt-6 bg-gradient-to-r from-sage-500 to-sage-600 rounded-2xl p-4 text-white">
                  <div className="flex items-center gap-3">
                    <Truck className="w-8 h-8" />
                    <div className="flex-1">
                      <h4 className="font-semibold">Delivery Available</h4>
                      <p className="text-sm text-sage-100">
                        ${selectedStore.deliveryFee} delivery • ${selectedStore.deliveryMinimum} minimum
                      </p>
                    </div>
                    <button className="bg-white text-sage-600 px-4 py-2 rounded-lg font-medium text-sm">
                      Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              {/* Category Header */}
              {selectedCategory && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryEmojis[selectedCategory]}</span>
                    <h3 className="font-semibold text-stone-800">{categoryLabels[selectedCategory]}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-sage-600"
                  >
                    All categories
                  </button>
                </div>
              )}
              
              {/* Products List */}
              {products.length > 0 ? (
                <div className="space-y-2">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">
                        {categoryEmojis[product.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">{product.name}</p>
                        <p className="text-sm text-stone-500">
                          {product.aisle && <span className="mr-2">Aisle {product.aisle}</span>}
                          <span>{product.unit}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sage-600">${product.price.toFixed(2)}</p>
                        <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                          {product.inStock ? 'In stock' : 'Out'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToList(product)}
                        className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center hover:bg-sage-200 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500">No products found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
