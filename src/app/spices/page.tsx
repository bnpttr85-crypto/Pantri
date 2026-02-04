'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';
import Link from 'next/link';
import { getSpiceEmoji } from '@/data/spices';

export default function SpiceRackPage() {
  const { spices, toggleSpice, addCustomSpice, removeSpice } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpiceName, setNewSpiceName] = useState('');
  const [filter, setFilter] = useState<'all' | 'have' | 'need' | 'essential'>('all');
  
  const filteredSpices = spices.filter(spice => {
    switch (filter) {
      case 'have': return spice.have;
      case 'need': return !spice.have;
      case 'essential': return spice.essential;
      default: return true;
    }
  });
  
  const haveCount = spices.filter(s => s.have).length;
  const essentialCount = spices.filter(s => s.essential).length;
  const essentialHaveCount = spices.filter(s => s.essential && s.have).length;
  
  const handleAddSpice = () => {
    if (newSpiceName.trim()) {
      addCustomSpice(newSpiceName.trim());
      setNewSpiceName('');
      setShowAddModal(false);
    }
  };
  
  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-50 to-white border-b border-stone-100 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/pantry" className="text-stone-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-semibold text-stone-800">
              Spice Rack
            </h1>
            <p className="text-sm text-stone-500">Track your spices and seasonings</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-white rounded-xl p-3 border border-stone-100">
            <p className="text-2xl font-bold text-amber-600">{haveCount}</p>
            <p className="text-xs text-stone-500">Spices owned</p>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 border border-stone-100">
            <p className="text-2xl font-bold text-stone-600">{spices.length - haveCount}</p>
            <p className="text-xs text-stone-500">Need to buy</p>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 border border-stone-100">
            <p className="text-2xl font-bold text-sage-600">{essentialHaveCount}/{essentialCount}</p>
            <p className="text-xs text-stone-500">Essentials</p>
          </div>
        </div>
        
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'have', label: 'Have' },
            { key: 'need', label: 'Need' },
            { key: 'essential', label: 'Essential' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === key
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Spice Cabinet Grid */}
      <div className="p-4">
        <div className="bg-gradient-to-b from-amber-100 to-amber-50 rounded-2xl p-4 border-4 border-amber-200 shadow-inner">
          {/* Cabinet shelf effect */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {filteredSpices.map((spice) => (
              <button
                key={spice.id}
                onClick={() => toggleSpice(spice.id)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${
                  spice.have
                    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-md transform hover:scale-105'
                    : 'bg-white/60 text-stone-400 border-2 border-dashed border-stone-200 hover:border-amber-300'
                }`}
              >
                <span className="text-2xl mb-1">
                  {getSpiceEmoji(spice.name)}
                </span>
                <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">
                  {spice.name}
                </span>
                
                {/* Essential badge */}
                {spice.essential && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${
                    spice.have ? 'bg-white text-amber-500' : 'bg-amber-200 text-amber-600'
                  }`}>
                    ★
                  </div>
                )}
                
                {/* Have checkmark */}
                {spice.have && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                
                {/* Custom spice delete button */}
                {!spice.essential && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSpice(spice.id);
                    }}
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100"
                    style={{ opacity: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-amber-400" />
            <span>Have it</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-dashed border-stone-300" />
            <span>Need it</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500">★</span>
            <span>Essential</span>
          </div>
        </div>
        
        {/* Tip */}
        <div className="mt-6 bg-cream-50 rounded-xl p-4 text-center">
          <p className="text-sm text-stone-600">
            <span className="font-medium">Tip:</span> Tap a spice to toggle whether you have it.
            Essential spices are marked with a ★ — these are commonly used in most recipes.
          </p>
        </div>
      </div>
      
      {/* Add Spice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-display text-lg font-semibold text-stone-800 mb-4">
              Add Custom Spice
            </h3>
            
            <input
              type="text"
              value={newSpiceName}
              onChange={(e) => setNewSpiceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSpice()}
              placeholder="Spice name..."
              className="input w-full mb-4"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewSpiceName('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSpice}
                disabled={!newSpiceName.trim()}
                className="btn-primary flex-1"
              >
                Add Spice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
