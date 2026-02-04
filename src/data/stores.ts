import { Store, StoreProduct } from '@/types';

export const mockStores: Store[] = [
  {
    id: 'freshmart',
    name: 'FreshMart',
    logo: '🏪',
    address: '123 Main St, Anytown USA',
    deliveryAvailable: true,
    deliveryFee: 5.99,
    deliveryMinimum: 35,
  },
  {
    id: 'organic-oasis',
    name: 'Organic Oasis',
    logo: '🌿',
    address: '456 Green Ave, Anytown USA',
    deliveryAvailable: true,
    deliveryFee: 7.99,
    deliveryMinimum: 50,
  },
  {
    id: 'budget-basket',
    name: 'Budget Basket',
    logo: '🛒',
    address: '789 Value Blvd, Anytown USA',
    deliveryAvailable: false,
  },
];

export const mockStoreProducts: StoreProduct[] = [
  // FreshMart Products
  // Dairy
  { id: 'fm-milk-whole', storeId: 'freshmart', name: 'Whole Milk', barcode: '0041130001234', price: 4.29, unit: 'gallon', category: 'dairy', inStock: true, aisle: 'A1' },
  { id: 'fm-milk-2pct', storeId: 'freshmart', name: '2% Milk', barcode: '0041130001235', price: 4.09, unit: 'gallon', category: 'dairy', inStock: true, aisle: 'A1' },
  { id: 'fm-eggs-large', storeId: 'freshmart', name: 'Large Eggs', barcode: '0041130002345', price: 4.99, unit: 'dozen', category: 'dairy', inStock: true, aisle: 'A1' },
  { id: 'fm-butter', storeId: 'freshmart', name: 'Unsalted Butter', barcode: '0041130003456', price: 5.49, unit: 'lb', category: 'dairy', inStock: true, aisle: 'A1' },
  { id: 'fm-cheese-cheddar', storeId: 'freshmart', name: 'Sharp Cheddar', barcode: '0041130004567', price: 6.99, unit: 'lb', category: 'dairy', inStock: true, aisle: 'A2' },
  { id: 'fm-yogurt-greek', storeId: 'freshmart', name: 'Greek Yogurt', barcode: '0041130005678', price: 5.99, unit: '32oz', category: 'dairy', inStock: true, aisle: 'A2' },
  { id: 'fm-cream-cheese', storeId: 'freshmart', name: 'Cream Cheese', barcode: '0041130006789', price: 3.49, unit: '8oz', category: 'dairy', inStock: true, aisle: 'A2' },
  { id: 'fm-sour-cream', storeId: 'freshmart', name: 'Sour Cream', barcode: '0041130007890', price: 2.99, unit: '16oz', category: 'dairy', inStock: true, aisle: 'A2' },
  
  // Produce
  { id: 'fm-bananas', storeId: 'freshmart', name: 'Bananas', barcode: '4011', price: 0.59, unit: 'lb', category: 'produce', inStock: true, aisle: 'P1' },
  { id: 'fm-apples', storeId: 'freshmart', name: 'Honeycrisp Apples', barcode: '3283', price: 2.99, unit: 'lb', category: 'produce', inStock: true, aisle: 'P1' },
  { id: 'fm-oranges', storeId: 'freshmart', name: 'Navel Oranges', barcode: '3107', price: 1.49, unit: 'lb', category: 'produce', inStock: true, aisle: 'P1' },
  { id: 'fm-lemons', storeId: 'freshmart', name: 'Lemons', barcode: '4053', price: 0.69, unit: 'each', category: 'produce', inStock: true, aisle: 'P1' },
  { id: 'fm-onions', storeId: 'freshmart', name: 'Yellow Onions', barcode: '4093', price: 1.29, unit: 'lb', category: 'produce', inStock: true, aisle: 'P2' },
  { id: 'fm-garlic', storeId: 'freshmart', name: 'Garlic', barcode: '4608', price: 0.79, unit: 'head', category: 'produce', inStock: true, aisle: 'P2' },
  { id: 'fm-potatoes', storeId: 'freshmart', name: 'Russet Potatoes', barcode: '4072', price: 3.99, unit: '5lb bag', category: 'produce', inStock: true, aisle: 'P2' },
  { id: 'fm-carrots', storeId: 'freshmart', name: 'Carrots', barcode: '4562', price: 1.99, unit: 'lb', category: 'produce', inStock: true, aisle: 'P2' },
  { id: 'fm-celery', storeId: 'freshmart', name: 'Celery', barcode: '4070', price: 2.49, unit: 'bunch', category: 'produce', inStock: true, aisle: 'P2' },
  { id: 'fm-spinach', storeId: 'freshmart', name: 'Baby Spinach', barcode: '0041130010001', price: 4.99, unit: '5oz', category: 'produce', inStock: true, aisle: 'P3' },
  { id: 'fm-lettuce', storeId: 'freshmart', name: 'Romaine Hearts', barcode: '0041130010002', price: 3.99, unit: '3pk', category: 'produce', inStock: true, aisle: 'P3' },
  { id: 'fm-tomatoes', storeId: 'freshmart', name: 'Roma Tomatoes', barcode: '4087', price: 1.99, unit: 'lb', category: 'produce', inStock: true, aisle: 'P3' },
  { id: 'fm-avocados', storeId: 'freshmart', name: 'Avocados', barcode: '4046', price: 1.49, unit: 'each', category: 'produce', inStock: true, aisle: 'P3' },
  
  // Meat
  { id: 'fm-chicken-breast', storeId: 'freshmart', name: 'Chicken Breast', barcode: '0041130020001', price: 6.99, unit: 'lb', category: 'meat', inStock: true, aisle: 'M1' },
  { id: 'fm-chicken-thighs', storeId: 'freshmart', name: 'Chicken Thighs', barcode: '0041130020002', price: 4.99, unit: 'lb', category: 'meat', inStock: true, aisle: 'M1' },
  { id: 'fm-ground-beef', storeId: 'freshmart', name: 'Ground Beef 80/20', barcode: '0041130020003', price: 5.99, unit: 'lb', category: 'meat', inStock: true, aisle: 'M1' },
  { id: 'fm-ground-turkey', storeId: 'freshmart', name: 'Ground Turkey', barcode: '0041130020004', price: 6.49, unit: 'lb', category: 'meat', inStock: true, aisle: 'M1' },
  { id: 'fm-bacon', storeId: 'freshmart', name: 'Bacon', barcode: '0041130020005', price: 7.99, unit: '16oz', category: 'meat', inStock: true, aisle: 'M2' },
  { id: 'fm-pork-chops', storeId: 'freshmart', name: 'Pork Chops', barcode: '0041130020006', price: 4.99, unit: 'lb', category: 'meat', inStock: true, aisle: 'M2' },
  { id: 'fm-steak-ribeye', storeId: 'freshmart', name: 'Ribeye Steak', barcode: '0041130020007', price: 14.99, unit: 'lb', category: 'meat', inStock: true, aisle: 'M2' },
  
  // Seafood
  { id: 'fm-salmon', storeId: 'freshmart', name: 'Atlantic Salmon', barcode: '0041130030001', price: 12.99, unit: 'lb', category: 'seafood', inStock: true, aisle: 'S1' },
  { id: 'fm-shrimp', storeId: 'freshmart', name: 'Large Shrimp', barcode: '0041130030002', price: 10.99, unit: 'lb', category: 'seafood', inStock: true, aisle: 'S1' },
  { id: 'fm-tilapia', storeId: 'freshmart', name: 'Tilapia Fillets', barcode: '0041130030003', price: 7.99, unit: 'lb', category: 'seafood', inStock: true, aisle: 'S1' },
  
  // Grains & Pasta
  { id: 'fm-rice-white', storeId: 'freshmart', name: 'Long Grain Rice', barcode: '0041130040001', price: 3.99, unit: '2lb', category: 'grains', inStock: true, aisle: 'G1' },
  { id: 'fm-rice-brown', storeId: 'freshmart', name: 'Brown Rice', barcode: '0041130040002', price: 4.49, unit: '2lb', category: 'grains', inStock: true, aisle: 'G1' },
  { id: 'fm-pasta-spaghetti', storeId: 'freshmart', name: 'Spaghetti', barcode: '0041130040003', price: 1.99, unit: '16oz', category: 'grains', inStock: true, aisle: 'G1' },
  { id: 'fm-pasta-penne', storeId: 'freshmart', name: 'Penne Pasta', barcode: '0041130040004', price: 1.99, unit: '16oz', category: 'grains', inStock: true, aisle: 'G1' },
  { id: 'fm-bread-white', storeId: 'freshmart', name: 'White Bread', barcode: '0041130040005', price: 2.99, unit: 'loaf', category: 'grains', inStock: true, aisle: 'G2' },
  { id: 'fm-bread-wheat', storeId: 'freshmart', name: 'Whole Wheat Bread', barcode: '0041130040006', price: 3.49, unit: 'loaf', category: 'grains', inStock: true, aisle: 'G2' },
  { id: 'fm-oats', storeId: 'freshmart', name: 'Rolled Oats', barcode: '0041130040007', price: 4.99, unit: '42oz', category: 'grains', inStock: true, aisle: 'G2' },
  { id: 'fm-flour-ap', storeId: 'freshmart', name: 'All-Purpose Flour', barcode: '0041130040008', price: 3.99, unit: '5lb', category: 'grains', inStock: true, aisle: 'G3' },
  
  // Canned Goods
  { id: 'fm-tomatoes-diced', storeId: 'freshmart', name: 'Diced Tomatoes', barcode: '0041130050001', price: 1.49, unit: '14.5oz', category: 'canned', inStock: true, aisle: 'C1' },
  { id: 'fm-tomato-paste', storeId: 'freshmart', name: 'Tomato Paste', barcode: '0041130050002', price: 0.99, unit: '6oz', category: 'canned', inStock: true, aisle: 'C1' },
  { id: 'fm-beans-black', storeId: 'freshmart', name: 'Black Beans', barcode: '0041130050003', price: 1.29, unit: '15oz', category: 'canned', inStock: true, aisle: 'C1' },
  { id: 'fm-beans-kidney', storeId: 'freshmart', name: 'Kidney Beans', barcode: '0041130050004', price: 1.29, unit: '15oz', category: 'canned', inStock: true, aisle: 'C1' },
  { id: 'fm-chickpeas', storeId: 'freshmart', name: 'Chickpeas', barcode: '0041130050005', price: 1.49, unit: '15oz', category: 'canned', inStock: true, aisle: 'C1' },
  { id: 'fm-tuna', storeId: 'freshmart', name: 'Chunk Light Tuna', barcode: '0041130050006', price: 1.99, unit: '5oz', category: 'canned', inStock: true, aisle: 'C2' },
  { id: 'fm-chicken-broth', storeId: 'freshmart', name: 'Chicken Broth', barcode: '0041130050007', price: 2.99, unit: '32oz', category: 'canned', inStock: true, aisle: 'C2' },
  { id: 'fm-coconut-milk', storeId: 'freshmart', name: 'Coconut Milk', barcode: '0041130050008', price: 2.49, unit: '13.5oz', category: 'canned', inStock: true, aisle: 'C2' },
  
  // Condiments & Sauces
  { id: 'fm-olive-oil', storeId: 'freshmart', name: 'Extra Virgin Olive Oil', barcode: '0041130060001', price: 8.99, unit: '16oz', category: 'condiments', inStock: true, aisle: 'D1' },
  { id: 'fm-vegetable-oil', storeId: 'freshmart', name: 'Vegetable Oil', barcode: '0041130060002', price: 4.99, unit: '48oz', category: 'condiments', inStock: true, aisle: 'D1' },
  { id: 'fm-soy-sauce', storeId: 'freshmart', name: 'Soy Sauce', barcode: '0041130060003', price: 3.49, unit: '15oz', category: 'condiments', inStock: true, aisle: 'D1' },
  { id: 'fm-vinegar', storeId: 'freshmart', name: 'Apple Cider Vinegar', barcode: '0041130060004', price: 3.99, unit: '16oz', category: 'condiments', inStock: true, aisle: 'D1' },
  { id: 'fm-ketchup', storeId: 'freshmart', name: 'Ketchup', barcode: '0041130060005', price: 3.49, unit: '32oz', category: 'condiments', inStock: true, aisle: 'D2' },
  { id: 'fm-mustard', storeId: 'freshmart', name: 'Yellow Mustard', barcode: '0041130060006', price: 2.49, unit: '14oz', category: 'condiments', inStock: true, aisle: 'D2' },
  { id: 'fm-mayo', storeId: 'freshmart', name: 'Mayonnaise', barcode: '0041130060007', price: 4.99, unit: '30oz', category: 'condiments', inStock: true, aisle: 'D2' },
  { id: 'fm-hot-sauce', storeId: 'freshmart', name: 'Hot Sauce', barcode: '0041130060008', price: 2.99, unit: '12oz', category: 'condiments', inStock: true, aisle: 'D2' },
  { id: 'fm-marinara', storeId: 'freshmart', name: 'Marinara Sauce', barcode: '0041130060009', price: 3.99, unit: '24oz', category: 'condiments', inStock: true, aisle: 'D3' },
  { id: 'fm-salsa', storeId: 'freshmart', name: 'Medium Salsa', barcode: '0041130060010', price: 3.49, unit: '16oz', category: 'condiments', inStock: true, aisle: 'D3' },
  
  // Staples
  { id: 'fm-sugar', storeId: 'freshmart', name: 'Granulated Sugar', barcode: '0041130070001', price: 3.49, unit: '4lb', category: 'staples', inStock: true, aisle: 'E1' },
  { id: 'fm-brown-sugar', storeId: 'freshmart', name: 'Brown Sugar', barcode: '0041130070002', price: 3.99, unit: '2lb', category: 'staples', inStock: true, aisle: 'E1' },
  { id: 'fm-salt', storeId: 'freshmart', name: 'Table Salt', barcode: '0041130070003', price: 1.49, unit: '26oz', category: 'staples', inStock: true, aisle: 'E1' },
  { id: 'fm-baking-soda', storeId: 'freshmart', name: 'Baking Soda', barcode: '0041130070004', price: 1.29, unit: '16oz', category: 'staples', inStock: true, aisle: 'E1' },
  { id: 'fm-baking-powder', storeId: 'freshmart', name: 'Baking Powder', barcode: '0041130070005', price: 2.99, unit: '10oz', category: 'staples', inStock: true, aisle: 'E1' },
  { id: 'fm-vanilla', storeId: 'freshmart', name: 'Vanilla Extract', barcode: '0041130070006', price: 6.99, unit: '4oz', category: 'staples', inStock: true, aisle: 'E1' },
  { id: 'fm-honey', storeId: 'freshmart', name: 'Honey', barcode: '0041130070007', price: 7.99, unit: '16oz', category: 'staples', inStock: true, aisle: 'E2' },
  { id: 'fm-maple-syrup', storeId: 'freshmart', name: 'Maple Syrup', barcode: '0041130070008', price: 9.99, unit: '12oz', category: 'staples', inStock: true, aisle: 'E2' },
  { id: 'fm-peanut-butter', storeId: 'freshmart', name: 'Peanut Butter', barcode: '0041130070009', price: 4.99, unit: '16oz', category: 'staples', inStock: true, aisle: 'E2' },
  { id: 'fm-cornstarch', storeId: 'freshmart', name: 'Cornstarch', barcode: '0041130070010', price: 2.49, unit: '16oz', category: 'staples', inStock: true, aisle: 'E1' },
  
  // Spices
  { id: 'fm-black-pepper', storeId: 'freshmart', name: 'Black Pepper', barcode: '0041130080001', price: 4.99, unit: '3oz', category: 'spices', inStock: true, aisle: 'F1' },
  { id: 'fm-paprika', storeId: 'freshmart', name: 'Paprika', barcode: '0041130080002', price: 3.99, unit: '2.5oz', category: 'spices', inStock: true, aisle: 'F1' },
  { id: 'fm-cumin', storeId: 'freshmart', name: 'Ground Cumin', barcode: '0041130080003', price: 3.99, unit: '2oz', category: 'spices', inStock: true, aisle: 'F1' },
  { id: 'fm-oregano', storeId: 'freshmart', name: 'Dried Oregano', barcode: '0041130080004', price: 3.49, unit: '1.5oz', category: 'spices', inStock: true, aisle: 'F1' },
  { id: 'fm-cinnamon', storeId: 'freshmart', name: 'Ground Cinnamon', barcode: '0041130080005', price: 4.49, unit: '2.5oz', category: 'spices', inStock: true, aisle: 'F1' },
  { id: 'fm-garlic-powder', storeId: 'freshmart', name: 'Garlic Powder', barcode: '0041130080006', price: 3.99, unit: '3oz', category: 'spices', inStock: true, aisle: 'F1' },
  { id: 'fm-onion-powder', storeId: 'freshmart', name: 'Onion Powder', barcode: '0041130080007', price: 3.99, unit: '2.6oz', category: 'spices', inStock: true, aisle: 'F1' },
  { id: 'fm-chili-powder', storeId: 'freshmart', name: 'Chili Powder', barcode: '0041130080008', price: 3.99, unit: '2.5oz', category: 'spices', inStock: true, aisle: 'F1' },
  
  // Frozen
  { id: 'fm-frozen-peas', storeId: 'freshmart', name: 'Frozen Peas', barcode: '0041130090001', price: 2.49, unit: '16oz', category: 'frozen', inStock: true, aisle: 'Z1' },
  { id: 'fm-frozen-corn', storeId: 'freshmart', name: 'Frozen Corn', barcode: '0041130090002', price: 2.49, unit: '16oz', category: 'frozen', inStock: true, aisle: 'Z1' },
  { id: 'fm-frozen-broccoli', storeId: 'freshmart', name: 'Frozen Broccoli', barcode: '0041130090003', price: 2.99, unit: '16oz', category: 'frozen', inStock: true, aisle: 'Z1' },
  { id: 'fm-ice-cream', storeId: 'freshmart', name: 'Vanilla Ice Cream', barcode: '0041130090004', price: 5.99, unit: '48oz', category: 'frozen', inStock: true, aisle: 'Z2' },
  { id: 'fm-frozen-pizza', storeId: 'freshmart', name: 'Pepperoni Pizza', barcode: '0041130090005', price: 6.99, unit: 'each', category: 'frozen', inStock: true, aisle: 'Z2' },
  
  // Beverages
  { id: 'fm-coffee', storeId: 'freshmart', name: 'Ground Coffee', barcode: '0041130100001', price: 8.99, unit: '12oz', category: 'beverages', inStock: true, aisle: 'B1' },
  { id: 'fm-tea-black', storeId: 'freshmart', name: 'Black Tea Bags', barcode: '0041130100002', price: 4.99, unit: '20ct', category: 'beverages', inStock: true, aisle: 'B1' },
  { id: 'fm-orange-juice', storeId: 'freshmart', name: 'Orange Juice', barcode: '0041130100003', price: 4.49, unit: '52oz', category: 'beverages', inStock: true, aisle: 'B2' },
  { id: 'fm-apple-juice', storeId: 'freshmart', name: 'Apple Juice', barcode: '0041130100004', price: 3.99, unit: '64oz', category: 'beverages', inStock: true, aisle: 'B2' },
  
  // Snacks
  { id: 'fm-chips', storeId: 'freshmart', name: 'Potato Chips', barcode: '0041130110001', price: 4.49, unit: '10oz', category: 'snacks', inStock: true, aisle: 'N1' },
  { id: 'fm-crackers', storeId: 'freshmart', name: 'Saltine Crackers', barcode: '0041130110002', price: 3.49, unit: '16oz', category: 'snacks', inStock: true, aisle: 'N1' },
  { id: 'fm-pretzels', storeId: 'freshmart', name: 'Pretzels', barcode: '0041130110003', price: 3.99, unit: '16oz', category: 'snacks', inStock: true, aisle: 'N1' },
  { id: 'fm-almonds', storeId: 'freshmart', name: 'Roasted Almonds', barcode: '0041130110004', price: 7.99, unit: '16oz', category: 'snacks', inStock: true, aisle: 'N2' },
  
  // Organic Oasis Products (Higher prices, organic)
  { id: 'oo-milk-whole', storeId: 'organic-oasis', name: 'Organic Whole Milk', barcode: '0071230001234', price: 6.99, unit: 'gallon', category: 'dairy', inStock: true, aisle: 'A1' },
  { id: 'oo-eggs-large', storeId: 'organic-oasis', name: 'Organic Free-Range Eggs', barcode: '0071230002345', price: 7.99, unit: 'dozen', category: 'dairy', inStock: true, aisle: 'A1' },
  { id: 'oo-chicken-breast', storeId: 'organic-oasis', name: 'Organic Chicken Breast', barcode: '0071230020001', price: 12.99, unit: 'lb', category: 'meat', inStock: true, aisle: 'M1' },
  { id: 'oo-spinach', storeId: 'organic-oasis', name: 'Organic Baby Spinach', barcode: '0071230010001', price: 6.99, unit: '5oz', category: 'produce', inStock: true, aisle: 'P1' },
  { id: 'oo-bananas', storeId: 'organic-oasis', name: 'Organic Bananas', barcode: '94011', price: 0.89, unit: 'lb', category: 'produce', inStock: true, aisle: 'P1' },
  
  // Budget Basket Products (Lower prices)
  { id: 'bb-milk-whole', storeId: 'budget-basket', name: 'Whole Milk', barcode: '0031130001234', price: 3.49, unit: 'gallon', category: 'dairy', inStock: true, aisle: '1' },
  { id: 'bb-eggs-large', storeId: 'budget-basket', name: 'Large Eggs', barcode: '0031130002345', price: 3.49, unit: 'dozen', category: 'dairy', inStock: true, aisle: '1' },
  { id: 'bb-chicken-breast', storeId: 'budget-basket', name: 'Chicken Breast', barcode: '0031130020001', price: 4.99, unit: 'lb', category: 'meat', inStock: true, aisle: '5' },
  { id: 'bb-ground-beef', storeId: 'budget-basket', name: 'Ground Beef 73/27', barcode: '0031130020003', price: 4.49, unit: 'lb', category: 'meat', inStock: true, aisle: '5' },
  { id: 'bb-rice-white', storeId: 'budget-basket', name: 'Long Grain Rice', barcode: '0031130040001', price: 2.99, unit: '2lb', category: 'grains', inStock: true, aisle: '3' },
  { id: 'bb-bread-white', storeId: 'budget-basket', name: 'White Bread', barcode: '0031130040005', price: 1.99, unit: 'loaf', category: 'grains', inStock: true, aisle: '2' },
];

// Helper to get products for a specific store
export const getStoreProducts = (storeId: string): StoreProduct[] => {
  return mockStoreProducts.filter(p => p.storeId === storeId);
};

// Helper to find product by barcode across all stores
export const findProductByBarcode = (barcode: string, storeId?: string): StoreProduct | undefined => {
  if (storeId) {
    return mockStoreProducts.find(p => p.barcode === barcode && p.storeId === storeId);
  }
  return mockStoreProducts.find(p => p.barcode === barcode);
};

// Helper to search products
export const searchStoreProducts = (query: string, storeId?: string): StoreProduct[] => {
  const lowerQuery = query.toLowerCase();
  return mockStoreProducts.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(lowerQuery);
    const matchesStore = storeId ? p.storeId === storeId : true;
    return matchesQuery && matchesStore;
  });
};
