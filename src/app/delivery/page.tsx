'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, Truck, Clock, Check, ShoppingCart, 
  Package, MapPin, CreditCard, ChevronRight,
  Plus, Minus, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

type DeliveryStatus = 'idle' | 'ordering' | 'confirmed' | 'preparing' | 'delivering' | 'delivered';

interface DeliveryService {
  id: string;
  name: string;
  logo: string;
  deliveryFee: number;
  deliveryTime: string;
  minimumOrder: number;
  promoCode?: string;
  promoDiscount?: number;
}

const deliveryServices: DeliveryService[] = [
  {
    id: 'instacart',
    name: 'Instacart',
    logo: '🥕',
    deliveryFee: 5.99,
    deliveryTime: '1-2 hours',
    minimumOrder: 10,
    promoCode: 'PANTRYPAL',
    promoDiscount: 10,
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    logo: '🔴',
    deliveryFee: 4.99,
    deliveryTime: '30-45 min',
    minimumOrder: 15,
  },
  {
    id: 'amazon-fresh',
    name: 'Amazon Fresh',
    logo: '📦',
    deliveryFee: 0,
    deliveryTime: '2-hour window',
    minimumOrder: 35,
  },
  {
    id: 'walmart',
    name: 'Walmart+',
    logo: '⭐',
    deliveryFee: 0,
    deliveryTime: 'Same day',
    minimumOrder: 35,
  },
];

export default function DeliveryPage() {
  const { 
    activeGroceryList, 
    groceryLists, 
    toggleGroceryItem, 
    updateGroceryItem,
    addSmartPantryItem,
  } = useApp();
  
  const [selectedService, setSelectedService] = useState<DeliveryService | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('idle');
  const [promoApplied, setPromoApplied] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, Anytown USA');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const currentList = activeGroceryList || (groceryLists.length > 0 ? groceryLists[0] : null);
  
  // Calculate totals
  const totals = useMemo(() => {
    if (!currentList) return { subtotal: 0, items: 0 };
    
    const uncheckedItems = currentList.items.filter(item => !item.checked);
    const subtotal = uncheckedItems.reduce((sum, item) => {
      return sum + (item.estimatedCost || 3.99) * item.quantity;
    }, 0);
    
    return {
      subtotal,
      items: uncheckedItems.length,
    };
  }, [currentList]);
  
  const deliveryFee = selectedService?.deliveryFee || 0;
  const promoDiscount = promoApplied && selectedService?.promoDiscount 
    ? (totals.subtotal * selectedService.promoDiscount / 100) 
    : 0;
  const total = totals.subtotal + deliveryFee - promoDiscount;
  
  const handleQuantityChange = (itemId: string, delta: number) => {
    if (!currentList) return;
    const item = currentList.items.find(i => i.id === itemId);
    if (!item) return;
    
    const newQty = Math.max(1, item.quantity + delta);
    updateGroceryItem(currentList.id, itemId, { quantity: newQty });
  };
  
  const handlePlaceOrder = () => {
    if (!selectedService || !currentList) return;
    
    setShowConfirmModal(true);
  };
  
  const confirmOrder = () => {
    setShowConfirmModal(false);
    setDeliveryStatus('ordering');
    
    // Simulate order processing
    setTimeout(() => {
      setDeliveryStatus('confirmed');
      
      setTimeout(() => {
        setDeliveryStatus('preparing');
        
        setTimeout(() => {
          setDeliveryStatus('delivering');
          
          setTimeout(() => {
            setDeliveryStatus('delivered');
            
            // Add all ordered items to pantry
            if (currentList) {
              currentList.items
                .filter(item => !item.checked)
                .forEach(item => {
                  addSmartPantryItem(
                    item.name,
                    item.quantity,
                    item.unit,
                    item.estimatedCost
                  );
                });
            }
          }, 3000);
        }, 2000);
      }, 2000);
    }, 1500);
  };
  
  // Delivery tracking view
  if (deliveryStatus !== 'idle') {
    return (
      <div className="animate-fade-in pb-24">
        <div className="bg-white border-b border-stone-100 px-4 py-4">
          <div className="flex items-center gap-3">
            {deliveryStatus === 'delivered' ? (
              <Link href="/pantry" className="text-stone-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
            ) : (
              <div className="text-stone-300">
                <ArrowLeft className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="font-display text-xl font-semibold text-stone-800">
                Order Status
              </h1>
              <p className="text-sm text-stone-500">
                {selectedService?.name} delivery
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Status Progress */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="space-y-4">
              {[
                { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
                { status: 'preparing', label: 'Preparing Order', icon: Package },
                { status: 'delivering', label: 'Out for Delivery', icon: Truck },
                { status: 'delivered', label: 'Delivered', icon: Check },
              ].map((step) => {
                const statusOrder = ['ordering', 'confirmed', 'preparing', 'delivering', 'delivered'];
                const currentIndex = statusOrder.indexOf(deliveryStatus);
                const stepIndex = statusOrder.indexOf(step.status);
                const isActive = stepIndex <= currentIndex;
                const isCurrent = step.status === deliveryStatus;
                
                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive 
                        ? isCurrent ? 'bg-sage-500 animate-pulse' : 'bg-sage-500'
                        : 'bg-stone-100'
                    }`}>
                      <step.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isActive ? 'text-stone-800' : 'text-stone-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && step.status !== 'delivered' && (
                        <p className="text-sm text-sage-600 animate-pulse">In progress...</p>
                      )}
                    </div>
                    {isActive && !isCurrent && (
                      <Check className="w-5 h-5 text-sage-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Delivery Info */}
          {deliveryStatus !== 'delivered' ? (
            <div className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl p-4 border border-sage-200">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="w-6 h-6 text-sage-600" />
                <div>
                  <p className="font-medium text-sage-800">Estimated Arrival</p>
                  <p className="text-sm text-sage-600">{selectedService?.deliveryTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sage-500 mt-0.5" />
                <div>
                  <p className="text-sm text-sage-700">{deliveryAddress}</p>
                  {deliveryInstructions && (
                    <p className="text-xs text-sage-500 mt-1">{deliveryInstructions}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-green-800 mb-2">
                Order Delivered!
              </h3>
              <p className="text-green-700 mb-4">
                Your groceries have been automatically added to your pantry.
              </p>
              <Link href="/pantry" className="btn-primary inline-flex items-center gap-2">
                View Pantry
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <h3 className="font-medium text-stone-800 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal ({totals.items} items)</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Delivery Fee</span>
                <span className="font-medium">${deliveryFee.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-stone-100 pt-2 flex justify-between">
                <span className="font-semibold text-stone-800">Total</span>
                <span className="font-semibold text-sage-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/lists" className="text-stone-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold text-stone-800">
              Delivery Order
            </h1>
            <p className="text-sm text-stone-500">Order your grocery list</p>
          </div>
        </div>
      </div>
      
      {!currentList || currentList.items.length === 0 ? (
        <div className="p-4 text-center py-12">
          <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-600 font-medium mb-2">No items in your list</p>
          <p className="text-sm text-stone-400 mb-4">
            Add items to your grocery list first
          </p>
          <Link href="/lists" className="btn-primary inline-flex items-center gap-2">
            Go to Lists
          </Link>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Delivery Service Selection */}
          <div>
            <h3 className="font-medium text-stone-800 mb-3">Select Delivery Service</h3>
            <div className="grid grid-cols-2 gap-3">
              {deliveryServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setPromoApplied(false);
                  }}
                  className={`bg-white rounded-xl border-2 p-4 text-left transition-all ${
                    selectedService?.id === service.id
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-stone-200 hover:border-sage-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{service.logo}</div>
                  <h4 className="font-semibold text-stone-800 text-sm">{service.name}</h4>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {service.deliveryTime}
                  </p>
                  <p className="text-xs text-sage-600 font-medium mt-1">
                    {service.deliveryFee === 0 ? 'Free delivery' : `$${service.deliveryFee} delivery`}
                  </p>
                  {service.promoCode && (
                    <p className="text-xs text-amber-600 mt-1">
                      🎁 {service.promoDiscount}% off available
                    </p>
                  )}
                </button>
              ))}
            </div>
            
            {/* Demo Notice */}
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  <span className="font-medium">Demo Mode:</span> This simulates a delivery order. 
                  Real integration would require partnerships with delivery services.
                </p>
              </div>
            </div>
          </div>
          
          {/* Promo Code */}
          {selectedService?.promoCode && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-amber-800">Promo Available!</p>
                  <p className="text-sm text-amber-600">
                    Use code <span className="font-mono font-bold">{selectedService.promoCode}</span> for {selectedService.promoDiscount}% off
                  </p>
                </div>
                <button
                  onClick={() => setPromoApplied(!promoApplied)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    promoApplied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {promoApplied ? '✓ Applied' : 'Apply'}
                </button>
              </div>
            </div>
          )}
          
          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400" />
              Delivery Address
            </h3>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="input w-full mb-3"
              placeholder="Enter delivery address"
            />
            <input
              type="text"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="input w-full"
              placeholder="Delivery instructions (optional)"
            />
          </div>
          
          {/* Order Items */}
          <div>
            <h3 className="font-medium text-stone-800 mb-3">
              Order Items ({currentList.items.filter(i => !i.checked).length})
            </h3>
            <div className="space-y-2">
              {currentList.items
                .filter(item => !item.checked)
                .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 p-3 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-sm text-stone-500">
                      ${(item.estimatedCost || 3.99).toFixed(2)} / {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleGroceryItem(currentList.id, item.id)}
                    className="p-2 text-stone-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-stone-400" />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Delivery Fee</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo ({selectedService?.promoDiscount}% off)</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-stone-100 pt-2 flex justify-between text-base">
                <span className="font-semibold text-stone-800">Total</span>
                <span className="font-semibold text-sage-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={!selectedService || totals.items === 0}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Truck className="w-5 h-5" />
            Place Order
          </button>
          
          {selectedService && totals.subtotal < selectedService.minimumOrder && (
            <p className="text-center text-sm text-amber-600">
              Minimum order: ${selectedService.minimumOrder}. Add ${(selectedService.minimumOrder - totals.subtotal).toFixed(2)} more.
            </p>
          )}
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-stone-800 mb-2">
                Confirm Order
              </h3>
              <p className="text-stone-600">
                Place order with {selectedService?.name} for ${total.toFixed(2)}?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="btn-primary flex-1"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
