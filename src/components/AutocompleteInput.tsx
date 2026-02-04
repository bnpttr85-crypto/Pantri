'use client';

import { useState, useRef, useEffect } from 'react';
import { getAutocompleteSuggestions, StandardIngredient } from '@/data/ingredients';
import { categoryOptions } from '@/data/recipes';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (ingredient: StandardIngredient) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function AutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Type ingredient name...',
  className = '',
  autoFocus = false,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<StandardIngredient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const matches = getAutocompleteSuggestions(value);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSelect = (ingredient: StandardIngredient) => {
    onChange(ingredient.canonicalName);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(ingredient);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={`input ${className}`}
        autoFocus={autoFocus}
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-stone-200 max-h-64 overflow-y-auto"
        >
          {suggestions.map((ingredient, index) => {
            const categoryInfo = categoryOptions.find(
              (c) => c.value === ingredient.category
            );
            return (
              <button
                key={ingredient.id}
                type="button"
                onClick={() => handleSelect(ingredient)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-cream-100 transition-colors ${
                  index === selectedIndex ? 'bg-cream-100' : ''
                } ${index === 0 ? 'rounded-t-xl' : ''} ${
                  index === suggestions.length - 1 ? 'rounded-b-xl' : ''
                }`}
              >
                <span className="text-lg">{categoryInfo?.emoji || '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 truncate">
                    {ingredient.canonicalName}
                  </p>
                  <p className="text-xs text-stone-500">
                    {categoryInfo?.label} • {ingredient.defaultQuantity}{' '}
                    {ingredient.defaultUnit}
                  </p>
                </div>
                {ingredient.avgPrice && (
                  <span className="text-xs text-sage-600">
                    ~${ingredient.avgPrice.toFixed(2)}/{ingredient.defaultUnit}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
