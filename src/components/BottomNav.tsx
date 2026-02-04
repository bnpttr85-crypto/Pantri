'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ChefHat, ScanLine, ShoppingCart } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/pantry', icon: Package, label: 'Pantry' },
  { href: '/scan', icon: ScanLine, label: 'Scan', isCenter: true },
  { href: '/recipes', icon: ChefHat, label: 'Recipes' },
  { href: '/lists', icon: ShoppingCart, label: 'Lists' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, icon: Icon, label, isCenter }) => {
          const isActive = pathname === href;
          
          if (isCenter) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-sage-600 scale-110'
                    : 'bg-sage-500 hover:bg-sage-600'
                }`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <span className={`text-[10px] font-medium mt-1 ${
                  isActive ? 'text-sage-600' : 'text-stone-500'
                }`}>
                  {label}
                </span>
              </Link>
            );
          }
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-14 h-full transition-all duration-200 ${
                isActive
                  ? 'text-sage-600'
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-0.5 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
