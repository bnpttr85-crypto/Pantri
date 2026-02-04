'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { parseReceiptText, ParsedReceiptItem } from '@/utils/receiptParser';
import { categoryOptions, unitOptions } from '@/data/recipes';
import { PantryCategory } from '@/types';
import { formatQuantityUnit } from '@/utils/unitUtils';
import {
  Camera,
  Upload,
  X,
  Loader2,
  Check,
  Square,
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Edit2,
  RotateCcw,
  ScanLine,
  Receipt,
} from 'lucide-react';
import Image from 'next/image';
import Tesseract from 'tesseract.js';

type ScanStage = 'capture' | 'processing' | 'review' | 'complete';

export default function ScanPage() {
  const router = useRouter();
  const { addPantryItem } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<ScanStage>('capture');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedReceiptItem[]>([]);
  const [editingItem, setEditingItem] = useState<ParsedReceiptItem | null>(null);
  const [rawText, setRawText] = useState('');

  const handleFileSelect = useCallback(async (file: File) => {
    // Create preview URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setStage('processing');
    setProgress(0);
    setProgressText('Initializing...');

    try {
      // Run OCR
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setProgressText('Reading receipt...');
          } else if (m.status === 'loading language traineddata') {
            setProgressText('Loading language data...');
          } else if (m.status === 'initializing tesseract') {
            setProgressText('Initializing...');
          }
        },
      });

      setRawText(result.data.text);
      
      // Parse the receipt text
      const items = parseReceiptText(result.data.text);
      setParsedItems(items);
      setStage('review');
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process receipt. Please try again with a clearer image.');
      resetScanner();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const resetScanner = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setStage('capture');
    setProgress(0);
    setParsedItems([]);
    setRawText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const toggleItemSelection = (id: string) => {
    setParsedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setParsedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ParsedReceiptItem>) => {
    setParsedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAddToPantry = () => {
    const selectedItems = parsedItems.filter((item) => item.selected);
    
    selectedItems.forEach((item) => {
      addPantryItem({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        cost: item.price > 0 ? item.price / item.quantity : undefined,
      });
    });

    setStage('complete');
  };

  const selectedCount = parsedItems.filter((item) => item.selected).length;

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 bg-cream-50/80 backdrop-blur-lg border-b border-stone-100 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => (stage === 'capture' ? router.back() : resetScanner())}
            className="p-2 -ml-2 text-stone-600"
          >
            {stage === 'capture' ? (
              <ArrowLeft className="w-5 h-5" />
            ) : (
              <RotateCcw className="w-5 h-5" />
            )}
          </button>
          <h1 className="font-display text-lg font-semibold text-stone-800">
            {stage === 'capture' && 'Scan Receipt'}
            {stage === 'processing' && 'Processing...'}
            {stage === 'review' && 'Review Items'}
            {stage === 'complete' && 'Done!'}
          </h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Capture Stage */}
      {stage === 'capture' && (
        <div className="px-4 py-6 space-y-6">
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-10 h-10 text-sage-600" />
            </div>
            <h2 className="font-display text-xl font-semibold text-stone-800">
              Scan Your Receipt
            </h2>
            <p className="text-stone-500 mt-2 max-w-xs mx-auto">
              Take a photo or upload an image of your grocery receipt to automatically add items
            </p>
          </div>

          <div className="space-y-3">
            {/* Camera Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full card flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                <Camera className="w-6 h-6 text-sage-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-stone-800">Take Photo</p>
                <p className="text-sm text-stone-500">Use your camera</p>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400" />
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full card flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-terracotta-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-terracotta-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-stone-800">Upload Image</p>
                <p className="text-sm text-stone-500">Choose from gallery</p>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Tips */}
          <div className="bg-cream-200 rounded-2xl p-4">
            <p className="font-medium text-stone-700 mb-2">Tips for best results:</p>
            <ul className="text-sm text-stone-600 space-y-1">
              <li>• Flatten the receipt on a dark surface</li>
              <li>• Ensure good lighting, avoid shadows</li>
              <li>• Capture the entire receipt in frame</li>
              <li>• Hold steady to avoid blur</li>
            </ul>
          </div>
        </div>
      )}

      {/* Processing Stage */}
      {stage === 'processing' && (
        <div className="px-4 py-6 space-y-6">
          {imageUrl && (
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
              <Image
                src={imageUrl}
                alt="Receipt"
                fill
                className="object-contain"
              />
              {/* Scanning animation overlay */}
              <div className="absolute inset-0 bg-sage-600/10">
                <div
                  className="absolute left-0 right-0 h-1 bg-sage-500 animate-pulse"
                  style={{ top: `${progress}%`, transition: 'top 0.3s ease-out' }}
                />
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-sage-600 animate-spin" />
              <span className="font-medium text-stone-700">{progressText}</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-sage-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-stone-500 mt-2">{progress}% complete</p>
          </div>
        </div>
      )}

      {/* Review Stage */}
      {stage === 'review' && (
        <div className="px-4 py-6 pb-32">
          {/* Preview thumbnail */}
          {imageUrl && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl border border-stone-100">
              <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt="Receipt"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-700">
                  {parsedItems.length} items detected
                </p>
                <p className="text-xs text-stone-500">
                  {selectedCount} selected to add
                </p>
              </div>
              <button
                onClick={() => {
                  // Toggle show raw text
                  alert(rawText || 'No text detected');
                }}
                className="text-xs text-sage-600 font-medium"
              >
                View raw
              </button>
            </div>
          )}

          {/* Items List */}
          {parsedItems.length > 0 ? (
            <div className="space-y-2">
              {parsedItems.map((item) => (
                <div
                  key={item.id}
                  className={`card flex items-center gap-3 transition-colors ${
                    item.selected ? 'border-sage-200 bg-sage-50/50' : 'opacity-60'
                  }`}
                >
                  <button
                    onClick={() => toggleItemSelection(item.id)}
                    className="flex-shrink-0"
                  >
                    {item.selected ? (
                      <CheckSquare className="w-5 h-5 text-sage-600" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>
                        {formatQuantityUnit(item.quantity, item.unit)}
                      </span>
                      {item.price > 0 && (
                        <span className="text-sage-600">${item.price.toFixed(2)}</span>
                      )}
                      <span className="badge-stone text-[10px]">
                        {categoryOptions.find((c) => c.value === item.category)?.emoji}{' '}
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-stone-400 hover:text-sage-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-stone-400 hover:text-terracotta-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ScanLine className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600 font-medium">No items detected</p>
              <p className="text-stone-400 text-sm mt-1">
                Try scanning a clearer image
              </p>
              <button onClick={resetScanner} className="btn-secondary mt-4">
                Try Again
              </button>
            </div>
          )}

          {/* Bottom Action Bar */}
          {parsedItems.length > 0 && (
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-stone-200 p-4 z-40">
              <div className="max-w-lg mx-auto flex gap-3">
                <button onClick={resetScanner} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={handleAddToPantry}
                  disabled={selectedCount === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Add {selectedCount} Items
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Stage */}
      {stage === 'complete' && (
        <div className="px-4 py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-sage-600" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-stone-800">
            Items Added!
          </h2>
          <p className="text-stone-500 mt-2">
            {selectedCount} items have been added to your pantry
          </p>
          <div className="flex flex-col gap-3 mt-8 max-w-xs mx-auto">
            <button
              onClick={() => router.push('/pantry')}
              className="btn-primary"
            >
              View Pantry
            </button>
            <button onClick={resetScanner} className="btn-secondary">
              Scan Another Receipt
            </button>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => {
            updateItem(editingItem.id, updates);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface EditItemModalProps {
  item: ParsedReceiptItem;
  onClose: () => void;
  onSave: (updates: Partial<ParsedReceiptItem>) => void;
}

function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unit, setUnit] = useState(item.unit);
  const [category, setCategory] = useState(item.category);
  const [price, setPrice] = useState(item.price.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      quantity: parseFloat(quantity) || 1,
      unit,
      category,
      price: parseFloat(price) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 pb-24 sm:pb-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h2 className="font-display text-xl font-semibold text-stone-800">
            Edit Item
          </h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
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

          <div>
            <label className="label">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                $
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="input pl-7"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
