'use client';

import { useState, useMemo } from 'react';
import { Check, Plus, Search, X } from 'lucide-react';
import { Spice } from '@/types';
import { defaultSpices, getSpiceColor, getSpiceEmoji } from '@/data/spices';

interface SpiceRackProps {
  spices: Spice[];
  onToggleSpice: (spiceId: string) => void;
  onAddCustomSpice: (name: string) => void;
}

export default function SpiceRack({ spices, onToggleSpice, onAddCustomSpice }: SpiceRackProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpiceName, setNewSpiceName] = useState('');
  const [filter, setFilter] = useState<'all' | 'have' | 'need' | 'essential'>('all');

  // Merge default spices with user's spice state
  const allSpices = useMemo(() => {
    const spiceMap = new Map(spices.map(s => [s.name, s]));
    
    // Start with default spices
    const merged = defaultSpices.map(ds => ({
      id: spiceMap.get(ds.name)?.id || ds.name.toLowerCase().replace(/\s+/g, '-'),
      name: ds.name,
      have: spiceMap.get(ds.name)?.have || false,
      essential: ds.essential,
    }));
    
    // Add any custom spices the user has added
    spices.forEach(s => {
      if (!merged.find(m => m.name === s.name)) {
        merged.push(s);
      }
    });
    
    return merged;
  }, [spices]);

  // Filter spices
  const filteredSpices = useMemo(() => {
    let result = allSpices;
    
    if (searchQuery) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (filter) {
      case 'have':
        result = result.filter(s => s.have);
        break;
      case 'need':
        result = result.filter(s => !s.have);
        break;
      case 'essential':
        result = result.filter(s => s.essential);
        break;
    }
    
    return result;
  }, [allSpices, searchQuery, filter]);

  // Stats
  const stats = useMemo(() => {
    const total = allSpices.length;
    const owned = allSpices.filter(s => s.have).length;
    const essentialTotal = allSpices.filter(s => s.essential).length;
    const essentialOwned = allSpices.filter(s => s.essential && s.have).length;
    return { total, owned, essentialTotal, essentialOwned };
  }, [allSpices]);

  const handleAddSpice = () => {
    if (newSpiceName.trim()) {
      onAddCustomSpice(newSpiceName.trim());
      setNewSpiceName('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-stone-800">Your Spice Collection</h3>
          <span className="text-2xl">🫙</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.owned}/{stats.total}</p>
            <p className="text-xs text-stone-500">Spices Owned</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.essentialOwned}/{stats.essentialTotal}</p>
            <p className="text-xs text-stone-500">Essentials</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search spices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-stone-400" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'have', 'need', 'essential'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f === 'all' && 'All'}
              {f === 'have' && `Have (${stats.owned})`}
              {f === 'need' && `Need (${stats.total - stats.owned})`}
              {f === 'essential' && 'Essential'}
            </button>
          ))}
        </div>
      </div>

      {/* Spice Grid - Visual Jars */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {filteredSpices.map((spice) => {
          const color = getSpiceColor(spice.name);
          const emoji = getSpiceEmoji(spice.name);
          
          return (
            <button
              key={spice.id}
              onClick={() => onToggleSpice(spice.id)}
              className={`relative group aspect-square rounded-xl transition-all duration-200 ${
                spice.have
                  ? 'ring-2 ring-amber-400 shadow-md scale-[1.02]'
                  : 'opacity-40 hover:opacity-70 grayscale hover:grayscale-0'
              }`}
              title={spice.name}
            >
              {/* Jar shape */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                {/* Lid */}
                <div className="w-3/4 h-2 bg-stone-400 rounded-t-sm" />
                {/* Jar body */}
                <div 
                  className="w-full flex-1 rounded-b-lg flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: color }}
                >
                  {/* Spice texture overlay */}
                  <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-white to-transparent" />
                  
                  {/* Emoji */}
                  <span className="text-lg relative z-10">{emoji}</span>
                  
                  {/* Check mark for owned */}
                  {spice.have && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  
                  {/* Essential star */}
                  {spice.essential && !spice.have && (
                    <div className="absolute top-1 right-1 text-[10px]">⭐</div>
                  )}
                </div>
              </div>
              
              {/* Hover label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-10">
                {spice.name}
              </div>
            </button>
          );
        })}
        
        {/* Add Custom Spice Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-400 hover:bg-amber-50 transition-colors flex flex-col items-center justify-center gap-1"
        >
          <Plus className="w-5 h-5 text-stone-400" />
          <span className="text-[10px] text-stone-400">Add</span>
        </button>
      </div>

      {/* Spice names list for reference */}
      {filter === 'all' && !searchQuery && (
        <div className="mt-4 p-3 bg-stone-50 rounded-xl">
          <p className="text-xs text-stone-500 mb-2">Tap a jar to mark as owned. Your collection:</p>
          <div className="flex flex-wrap gap-1">
            {filteredSpices.filter(s => s.have).map(s => (
              <span key={s.id} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {s.name}
              </span>
            ))}
            {filteredSpices.filter(s => s.have).length === 0 && (
              <span className="text-xs text-stone-400 italic">No spices marked yet</span>
            )}
          </div>
        </div>
      )}

      {/* Add Custom Spice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <h3 className="font-display font-semibold text-lg text-stone-800 mb-4">
              Add Custom Spice
            </h3>
            <input
              type="text"
              placeholder="Spice name..."
              value={newSpiceName}
              onChange={(e) => setNewSpiceName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSpice()}
              className="input-field mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
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
