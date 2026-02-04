import { PantryCategory } from '@/types';

export interface StandardIngredient {
  id: string;
  canonicalName: string;
  aliases: string[];
  category: PantryCategory;
  defaultUnit: string;
  defaultQuantity: number;
  avgPrice?: number; // average price per unit
}

// Comprehensive standardized ingredient database
export const ingredientDatabase: StandardIngredient[] = [
  // PRODUCE - Fruits
  { id: 'apple', canonicalName: 'Apples', aliases: ['apple', 'apples', 'fuji apple', 'gala apple', 'honeycrisp', 'granny smith'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 4, avgPrice: 0.75 },
  { id: 'banana', canonicalName: 'Bananas', aliases: ['banana', 'bananas', 'organic banana', 'organic bananas'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 6, avgPrice: 0.25 },
  { id: 'orange', canonicalName: 'Oranges', aliases: ['orange', 'oranges', 'navel orange', 'naval orange', 'cara cara'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 4, avgPrice: 0.80 },
  { id: 'lemon', canonicalName: 'Lemons', aliases: ['lemon', 'lemons', 'meyer lemon'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 3, avgPrice: 0.50 },
  { id: 'lime', canonicalName: 'Limes', aliases: ['lime', 'limes', 'key lime'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 3, avgPrice: 0.33 },
  { id: 'avocado', canonicalName: 'Avocados', aliases: ['avocado', 'avocados', 'hass avocado', 'avo'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 3, avgPrice: 1.50 },
  { id: 'strawberry', canonicalName: 'Strawberries', aliases: ['strawberry', 'strawberries', 'strwbry'], category: 'produce', defaultUnit: 'cup', defaultQuantity: 2, avgPrice: 2.50 },
  { id: 'blueberry', canonicalName: 'Blueberries', aliases: ['blueberry', 'blueberries', 'blubry'], category: 'produce', defaultUnit: 'cup', defaultQuantity: 1, avgPrice: 3.00 },
  { id: 'grape', canonicalName: 'Grapes', aliases: ['grape', 'grapes', 'red grapes', 'green grapes'], category: 'produce', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 3.00 },
  { id: 'mango', canonicalName: 'Mango', aliases: ['mango', 'mangoes', 'mangos'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 2, avgPrice: 1.50 },
  { id: 'pineapple', canonicalName: 'Pineapple', aliases: ['pineapple', 'pineapples'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 1, avgPrice: 3.50 },
  
  // PRODUCE - Vegetables
  { id: 'tomato', canonicalName: 'Tomatoes', aliases: ['tomato', 'tomatoes', 'roma tomato', 'roma tomatoes', 'cherry tomato', 'cherry tomatoes', 'grape tomato', 'beefsteak'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 4, avgPrice: 0.75 },
  { id: 'onion', canonicalName: 'Onions', aliases: ['onion', 'onions', 'yellow onion', 'yellow onions', 'white onion', 'sweet onion'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 3, avgPrice: 0.75 },
  { id: 'red_onion', canonicalName: 'Red Onion', aliases: ['red onion', 'red onions', 'purple onion'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 2, avgPrice: 1.00 },
  { id: 'garlic', canonicalName: 'Garlic', aliases: ['garlic', 'garlic bulb', 'garlic clove', 'garlic cloves', 'fresh garlic'], category: 'produce', defaultUnit: 'cloves', defaultQuantity: 6, avgPrice: 0.50 },
  { id: 'ginger', canonicalName: 'Fresh Ginger', aliases: ['ginger', 'fresh ginger', 'ginger root'], category: 'produce', defaultUnit: 'inch', defaultQuantity: 2, avgPrice: 0.50 },
  { id: 'potato', canonicalName: 'Potatoes', aliases: ['potato', 'potatoes', 'russet potato', 'russet potatoes', 'yukon gold', 'red potato'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 5, avgPrice: 0.50 },
  { id: 'carrot', canonicalName: 'Carrots', aliases: ['carrot', 'carrots', 'baby carrot', 'baby carrots'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 6, avgPrice: 0.25 },
  { id: 'celery', canonicalName: 'Celery', aliases: ['celery', 'celery stalk', 'celery stalks', 'celery bunch'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 2.50 },
  { id: 'broccoli', canonicalName: 'Broccoli', aliases: ['broccoli', 'broccoli crown', 'broccoli florets'], category: 'produce', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 2.00 },
  { id: 'bell_pepper', canonicalName: 'Bell Pepper', aliases: ['bell pepper', 'bell peppers', 'red bell pepper', 'green bell pepper', 'yellow bell pepper', 'orange pepper', 'sweet pepper'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 2, avgPrice: 1.25 },
  { id: 'cucumber', canonicalName: 'Cucumber', aliases: ['cucumber', 'cucumbers', 'english cucumber', 'cuke'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 2, avgPrice: 1.00 },
  { id: 'zucchini', canonicalName: 'Zucchini', aliases: ['zucchini', 'zucchinis', 'courgette', 'green squash'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 2, avgPrice: 1.25 },
  { id: 'spinach', canonicalName: 'Spinach', aliases: ['spinach', 'baby spinach', 'fresh spinach', 'spinach leaves'], category: 'produce', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 3.00 },
  { id: 'lettuce', canonicalName: 'Lettuce', aliases: ['lettuce', 'romaine', 'romaine lettuce', 'iceberg', 'butter lettuce', 'mixed greens'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 2.50 },
  { id: 'kale', canonicalName: 'Kale', aliases: ['kale', 'kale bunch', 'lacinato kale', 'curly kale'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 2.50 },
  { id: 'mushroom', canonicalName: 'Mushrooms', aliases: ['mushroom', 'mushrooms', 'button mushroom', 'cremini', 'baby bella', 'portobello', 'shiitake'], category: 'produce', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 3.00 },
  { id: 'corn', canonicalName: 'Corn', aliases: ['corn', 'corn on cob', 'sweet corn', 'corn ear'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 4, avgPrice: 0.75 },
  { id: 'asparagus', canonicalName: 'Asparagus', aliases: ['asparagus', 'asparagus bunch', 'asparagus spears'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 4.00 },
  { id: 'green_beans', canonicalName: 'Green Beans', aliases: ['green bean', 'green beans', 'string beans', 'snap beans'], category: 'produce', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 2.50 },
  { id: 'cabbage', canonicalName: 'Cabbage', aliases: ['cabbage', 'green cabbage', 'red cabbage', 'napa cabbage'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 1, avgPrice: 2.00 },
  { id: 'cauliflower', canonicalName: 'Cauliflower', aliases: ['cauliflower', 'cauliflower head', 'cauliflower florets'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 1, avgPrice: 3.50 },
  
  // Fresh Herbs
  { id: 'cilantro', canonicalName: 'Fresh Cilantro', aliases: ['cilantro', 'fresh cilantro', 'coriander leaves'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 1.50 },
  { id: 'parsley', canonicalName: 'Fresh Parsley', aliases: ['parsley', 'fresh parsley', 'italian parsley', 'flat leaf parsley'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 1.50 },
  { id: 'basil', canonicalName: 'Fresh Basil', aliases: ['basil', 'fresh basil', 'thai basil', 'sweet basil'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 2.50 },
  { id: 'mint', canonicalName: 'Fresh Mint', aliases: ['mint', 'fresh mint', 'mint leaves'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 2.00 },
  { id: 'rosemary', canonicalName: 'Fresh Rosemary', aliases: ['rosemary', 'fresh rosemary'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 2.50 },
  { id: 'thyme', canonicalName: 'Fresh Thyme', aliases: ['thyme', 'fresh thyme'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 2.50 },
  { id: 'green_onion', canonicalName: 'Green Onions', aliases: ['green onion', 'green onions', 'scallion', 'scallions', 'spring onion'], category: 'produce', defaultUnit: 'bunch', defaultQuantity: 1, avgPrice: 1.00 },
  
  // DAIRY
  { id: 'milk', canonicalName: 'Milk', aliases: ['milk', 'whole milk', '2% milk', '2 percent milk', 'skim milk', '1% milk', 'dairy milk'], category: 'dairy', defaultUnit: 'gal', defaultQuantity: 1, avgPrice: 4.50 },
  { id: 'eggs', canonicalName: 'Eggs', aliases: ['egg', 'eggs', 'large eggs', 'dozen eggs', 'organic eggs'], category: 'dairy', defaultUnit: 'whole', defaultQuantity: 12, avgPrice: 0.40 },
  { id: 'butter', canonicalName: 'Butter', aliases: ['butter', 'unsalted butter', 'salted butter', 'stick butter'], category: 'dairy', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.50 },
  { id: 'cheddar', canonicalName: 'Cheddar Cheese', aliases: ['cheddar', 'cheddar cheese', 'sharp cheddar', 'mild cheddar', 'shredded cheddar'], category: 'dairy', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 2.50 },
  { id: 'mozzarella', canonicalName: 'Mozzarella', aliases: ['mozzarella', 'mozzarella cheese', 'fresh mozzarella', 'shredded mozzarella', 'mozz'], category: 'dairy', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 3.00 },
  { id: 'parmesan', canonicalName: 'Parmesan', aliases: ['parmesan', 'parmesan cheese', 'parmigiano', 'parmigiano reggiano', 'grated parmesan', 'parm'], category: 'dairy', defaultUnit: 'g', defaultQuantity: 100, avgPrice: 0.08 },
  { id: 'feta', canonicalName: 'Feta Cheese', aliases: ['feta', 'feta cheese', 'crumbled feta'], category: 'dairy', defaultUnit: 'g', defaultQuantity: 100, avgPrice: 0.06 },
  { id: 'cream_cheese', canonicalName: 'Cream Cheese', aliases: ['cream cheese', 'philadelphia', 'philly cream cheese'], category: 'dairy', defaultUnit: 'oz', defaultQuantity: 8, avgPrice: 0.50 },
  { id: 'sour_cream', canonicalName: 'Sour Cream', aliases: ['sour cream', 'sourcream'], category: 'dairy', defaultUnit: 'cups', defaultQuantity: 1, avgPrice: 2.50 },
  { id: 'yogurt', canonicalName: 'Greek Yogurt', aliases: ['yogurt', 'greek yogurt', 'plain yogurt', 'vanilla yogurt'], category: 'dairy', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 1.50 },
  { id: 'heavy_cream', canonicalName: 'Heavy Cream', aliases: ['heavy cream', 'whipping cream', 'heavy whipping cream', 'cream'], category: 'dairy', defaultUnit: 'cups', defaultQuantity: 1, avgPrice: 3.00 },
  { id: 'half_half', canonicalName: 'Half & Half', aliases: ['half and half', 'half & half', 'half n half'], category: 'dairy', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 2.00 },
  
  // MEAT
  { id: 'chicken_breast', canonicalName: 'Chicken Breast', aliases: ['chicken breast', 'chicken breasts', 'boneless chicken', 'bnls chkn brst', 'skinless chicken breast', 'chkn brst'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 2, avgPrice: 5.00 },
  { id: 'chicken_thigh', canonicalName: 'Chicken Thighs', aliases: ['chicken thigh', 'chicken thighs', 'bone in thighs', 'boneless thighs'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 2, avgPrice: 4.00 },
  { id: 'ground_beef', canonicalName: 'Ground Beef', aliases: ['ground beef', 'beef mince', 'minced beef', 'hamburger meat', '80/20 beef', '90/10 beef', 'lean ground beef'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 6.00 },
  { id: 'ground_turkey', canonicalName: 'Ground Turkey', aliases: ['ground turkey', 'turkey mince', 'lean turkey'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 5.50 },
  { id: 'steak', canonicalName: 'Steak', aliases: ['steak', 'beef steak', 'ribeye', 'sirloin', 'ny strip', 'filet mignon', 'flank steak'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 12.00 },
  { id: 'pork_chop', canonicalName: 'Pork Chops', aliases: ['pork chop', 'pork chops', 'bone in pork chop', 'boneless pork chop'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 5.00 },
  { id: 'bacon', canonicalName: 'Bacon', aliases: ['bacon', 'thick cut bacon', 'turkey bacon', 'center cut bacon'], category: 'meat', defaultUnit: 'slices', defaultQuantity: 8, avgPrice: 0.75 },
  { id: 'sausage', canonicalName: 'Sausage', aliases: ['sausage', 'italian sausage', 'breakfast sausage', 'pork sausage', 'chicken sausage'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 5.00 },
  { id: 'ham', canonicalName: 'Ham', aliases: ['ham', 'deli ham', 'sliced ham', 'honey ham'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 0.5, avgPrice: 7.00 },
  { id: 'turkey_breast', canonicalName: 'Turkey Breast', aliases: ['turkey breast', 'deli turkey', 'sliced turkey'], category: 'meat', defaultUnit: 'lb', defaultQuantity: 0.5, avgPrice: 8.00 },
  { id: 'pancetta', canonicalName: 'Pancetta', aliases: ['pancetta', 'italian bacon'], category: 'meat', defaultUnit: 'g', defaultQuantity: 200, avgPrice: 0.05 },
  
  // SEAFOOD
  { id: 'salmon', canonicalName: 'Salmon', aliases: ['salmon', 'salmon fillet', 'salmon filet', 'atlantic salmon', 'wild salmon'], category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 12.00 },
  { id: 'shrimp', canonicalName: 'Shrimp', aliases: ['shrimp', 'prawns', 'jumbo shrimp', 'large shrimp', 'raw shrimp', 'cooked shrimp'], category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 10.00 },
  { id: 'tuna', canonicalName: 'Tuna', aliases: ['tuna', 'tuna steak', 'ahi tuna', 'fresh tuna'], category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 15.00 },
  { id: 'cod', canonicalName: 'Cod', aliases: ['cod', 'cod fillet', 'atlantic cod', 'pacific cod'], category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 10.00 },
  { id: 'tilapia', canonicalName: 'Tilapia', aliases: ['tilapia', 'tilapia fillet'], category: 'seafood', defaultUnit: 'lb', defaultQuantity: 1, avgPrice: 7.00 },
  { id: 'crab', canonicalName: 'Crab Meat', aliases: ['crab', 'crab meat', 'lump crab'], category: 'seafood', defaultUnit: 'lb', defaultQuantity: 0.5, avgPrice: 20.00 },
  { id: 'scallops', canonicalName: 'Scallops', aliases: ['scallop', 'scallops', 'sea scallops', 'bay scallops'], category: 'seafood', defaultUnit: 'lb', defaultQuantity: 0.5, avgPrice: 18.00 },
  
  // GRAINS & BREAD
  { id: 'bread', canonicalName: 'Bread', aliases: ['bread', 'sliced bread', 'white bread', 'wheat bread', 'whole wheat bread', 'sandwich bread', 'loaf'], category: 'grains', defaultUnit: 'slices', defaultQuantity: 20, avgPrice: 0.20 },
  { id: 'rice', canonicalName: 'Rice', aliases: ['rice', 'white rice', 'jasmine rice', 'basmati rice', 'long grain rice'], category: 'grains', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 0.50 },
  { id: 'brown_rice', canonicalName: 'Brown Rice', aliases: ['brown rice', 'whole grain rice'], category: 'grains', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 0.60 },
  { id: 'pasta', canonicalName: 'Pasta', aliases: ['pasta', 'spaghetti', 'penne', 'fettuccine', 'linguine', 'rigatoni', 'noodles'], category: 'grains', defaultUnit: 'g', defaultQuantity: 400, avgPrice: 0.005 },
  { id: 'quinoa', canonicalName: 'Quinoa', aliases: ['quinoa', 'white quinoa', 'red quinoa'], category: 'grains', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 1.50 },
  { id: 'oats', canonicalName: 'Oats', aliases: ['oat', 'oats', 'rolled oats', 'old fashioned oats', 'oatmeal', 'quick oats'], category: 'grains', defaultUnit: 'cups', defaultQuantity: 3, avgPrice: 0.50 },
  { id: 'flour', canonicalName: 'All-Purpose Flour', aliases: ['flour', 'all purpose flour', 'ap flour', 'white flour'], category: 'grains', defaultUnit: 'cups', defaultQuantity: 5, avgPrice: 0.30 },
  { id: 'tortilla', canonicalName: 'Tortillas', aliases: ['tortilla', 'tortillas', 'flour tortilla', 'flour tortillas', 'corn tortilla', 'corn tortillas', 'wrap'], category: 'grains', defaultUnit: 'whole', defaultQuantity: 10, avgPrice: 0.25 },
  { id: 'bagel', canonicalName: 'Bagels', aliases: ['bagel', 'bagels', 'plain bagel', 'everything bagel'], category: 'grains', defaultUnit: 'whole', defaultQuantity: 6, avgPrice: 0.75 },
  { id: 'arborio_rice', canonicalName: 'Arborio Rice', aliases: ['arborio', 'arborio rice', 'risotto rice'], category: 'grains', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 1.00 },
  { id: 'breadcrumbs', canonicalName: 'Breadcrumbs', aliases: ['breadcrumb', 'breadcrumbs', 'panko', 'panko breadcrumbs'], category: 'grains', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 1.00 },
  
  // CANNED GOODS
  { id: 'canned_tomatoes', canonicalName: 'Canned Tomatoes', aliases: ['canned tomatoes', 'diced tomatoes', 'crushed tomatoes', 'tomato can', 'canned diced tomatoes', 'san marzano'], category: 'canned', defaultUnit: 'cans', defaultQuantity: 2, avgPrice: 2.00 },
  { id: 'tomato_paste', canonicalName: 'Tomato Paste', aliases: ['tomato paste', 'tomato puree'], category: 'canned', defaultUnit: 'tbsp', defaultQuantity: 6, avgPrice: 0.30 },
  { id: 'tomato_sauce', canonicalName: 'Tomato Sauce', aliases: ['tomato sauce', 'marinara', 'pasta sauce'], category: 'canned', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 1.50 },
  { id: 'black_beans', canonicalName: 'Black Beans', aliases: ['black beans', 'canned black beans', 'black bean'], category: 'canned', defaultUnit: 'cans', defaultQuantity: 2, avgPrice: 1.50 },
  { id: 'chickpeas', canonicalName: 'Chickpeas', aliases: ['chickpea', 'chickpeas', 'garbanzo', 'garbanzo beans', 'canned chickpeas'], category: 'canned', defaultUnit: 'cans', defaultQuantity: 2, avgPrice: 1.50 },
  { id: 'kidney_beans', canonicalName: 'Kidney Beans', aliases: ['kidney beans', 'red kidney beans', 'canned kidney beans'], category: 'canned', defaultUnit: 'cans', defaultQuantity: 1, avgPrice: 1.50 },
  { id: 'canned_corn', canonicalName: 'Canned Corn', aliases: ['canned corn', 'corn can', 'sweet corn can'], category: 'canned', defaultUnit: 'cans', defaultQuantity: 2, avgPrice: 1.25 },
  { id: 'chicken_broth', canonicalName: 'Chicken Broth', aliases: ['chicken broth', 'chicken stock', 'broth'], category: 'canned', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 0.75 },
  { id: 'vegetable_broth', canonicalName: 'Vegetable Broth', aliases: ['vegetable broth', 'veggie broth', 'vegetable stock'], category: 'canned', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 0.75 },
  { id: 'beef_broth', canonicalName: 'Beef Broth', aliases: ['beef broth', 'beef stock'], category: 'canned', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 0.80 },
  { id: 'coconut_milk', canonicalName: 'Coconut Milk', aliases: ['coconut milk', 'canned coconut milk', 'coconut cream'], category: 'canned', defaultUnit: 'ml', defaultQuantity: 400, avgPrice: 0.01 },
  { id: 'canned_tuna', canonicalName: 'Canned Tuna', aliases: ['canned tuna', 'tuna can', 'chunk light tuna', 'albacore tuna'], category: 'canned', defaultUnit: 'cans', defaultQuantity: 2, avgPrice: 2.50 },
  { id: 'bamboo_shoots', canonicalName: 'Bamboo Shoots', aliases: ['bamboo shoots', 'canned bamboo'], category: 'canned', defaultUnit: 'g', defaultQuantity: 200, avgPrice: 0.01 },
  
  // CONDIMENTS & SAUCES
  { id: 'olive_oil', canonicalName: 'Olive Oil', aliases: ['olive oil', 'evoo', 'extra virgin olive oil', 'light olive oil'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 16, avgPrice: 0.40 },
  { id: 'vegetable_oil', canonicalName: 'Vegetable Oil', aliases: ['vegetable oil', 'canola oil', 'cooking oil'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 16, avgPrice: 0.15 },
  { id: 'sesame_oil', canonicalName: 'Sesame Oil', aliases: ['sesame oil', 'toasted sesame oil'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.50 },
  { id: 'soy_sauce', canonicalName: 'Soy Sauce', aliases: ['soy sauce', 'soya sauce', 'shoyu', 'low sodium soy sauce'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 12, avgPrice: 0.25 },
  { id: 'fish_sauce', canonicalName: 'Fish Sauce', aliases: ['fish sauce', 'nam pla'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.30 },
  { id: 'vinegar', canonicalName: 'Vinegar', aliases: ['vinegar', 'white vinegar', 'distilled vinegar'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.10 },
  { id: 'balsamic', canonicalName: 'Balsamic Vinegar', aliases: ['balsamic', 'balsamic vinegar', 'balsamic glaze'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.50 },
  { id: 'rice_vinegar', canonicalName: 'Rice Vinegar', aliases: ['rice vinegar', 'rice wine vinegar'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.30 },
  { id: 'honey', canonicalName: 'Honey', aliases: ['honey', 'raw honey', 'pure honey'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 12, avgPrice: 0.50 },
  { id: 'maple_syrup', canonicalName: 'Maple Syrup', aliases: ['maple syrup', 'pure maple syrup'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.75 },
  { id: 'ketchup', canonicalName: 'Ketchup', aliases: ['ketchup', 'catsup', 'tomato ketchup'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 16, avgPrice: 0.15 },
  { id: 'mustard', canonicalName: 'Mustard', aliases: ['mustard', 'yellow mustard', 'dijon', 'dijon mustard'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 10, avgPrice: 0.20 },
  { id: 'mayo', canonicalName: 'Mayonnaise', aliases: ['mayo', 'mayonnaise', 'hellmanns'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 16, avgPrice: 0.25 },
  { id: 'hot_sauce', canonicalName: 'Hot Sauce', aliases: ['hot sauce', 'sriracha', 'tabasco', 'franks', 'franks hot sauce'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 10, avgPrice: 0.20 },
  { id: 'worcestershire', canonicalName: 'Worcestershire Sauce', aliases: ['worcestershire', 'worcestershire sauce', 'lea perrins'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.30 },
  { id: 'peanut_butter', canonicalName: 'Peanut Butter', aliases: ['peanut butter', 'pb', 'creamy peanut butter', 'crunchy peanut butter'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 16, avgPrice: 0.30 },
  { id: 'salsa', canonicalName: 'Salsa', aliases: ['salsa', 'pico de gallo', 'mild salsa', 'medium salsa', 'hot salsa'], category: 'condiments', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 2.00 },
  { id: 'curry_paste', canonicalName: 'Curry Paste', aliases: ['curry paste', 'green curry paste', 'red curry paste', 'thai curry paste'], category: 'condiments', defaultUnit: 'tbsp', defaultQuantity: 6, avgPrice: 0.75 },
  
  // SPICES
  { id: 'salt', canonicalName: 'Salt', aliases: ['salt', 'table salt', 'sea salt', 'kosher salt'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 20, avgPrice: 0.05 },
  { id: 'black_pepper', canonicalName: 'Black Pepper', aliases: ['pepper', 'black pepper', 'ground pepper', 'cracked pepper'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 10, avgPrice: 0.10 },
  { id: 'garlic_powder', canonicalName: 'Garlic Powder', aliases: ['garlic powder', 'granulated garlic'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 8, avgPrice: 0.15 },
  { id: 'onion_powder', canonicalName: 'Onion Powder', aliases: ['onion powder', 'granulated onion'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 8, avgPrice: 0.15 },
  { id: 'paprika', canonicalName: 'Paprika', aliases: ['paprika', 'smoked paprika', 'sweet paprika', 'hungarian paprika'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 8, avgPrice: 0.20 },
  { id: 'cumin', canonicalName: 'Cumin', aliases: ['cumin', 'ground cumin', 'cumin powder'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 8, avgPrice: 0.20 },
  { id: 'chili_powder', canonicalName: 'Chili Powder', aliases: ['chili powder', 'chile powder'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 8, avgPrice: 0.20 },
  { id: 'oregano', canonicalName: 'Oregano', aliases: ['oregano', 'dried oregano'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.15 },
  { id: 'basil_dried', canonicalName: 'Dried Basil', aliases: ['dried basil', 'basil dried'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.15 },
  { id: 'thyme_dried', canonicalName: 'Dried Thyme', aliases: ['dried thyme', 'thyme dried'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.15 },
  { id: 'rosemary_dried', canonicalName: 'Dried Rosemary', aliases: ['dried rosemary', 'rosemary dried'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.15 },
  { id: 'cinnamon', canonicalName: 'Cinnamon', aliases: ['cinnamon', 'ground cinnamon', 'cinnamon powder'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.20 },
  { id: 'nutmeg', canonicalName: 'Nutmeg', aliases: ['nutmeg', 'ground nutmeg'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 4, avgPrice: 0.25 },
  { id: 'ginger_ground', canonicalName: 'Ground Ginger', aliases: ['ground ginger', 'ginger powder', 'dried ginger'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.20 },
  { id: 'turmeric', canonicalName: 'Turmeric', aliases: ['turmeric', 'ground turmeric', 'turmeric powder'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.25 },
  { id: 'cayenne', canonicalName: 'Cayenne Pepper', aliases: ['cayenne', 'cayenne pepper', 'red pepper flakes', 'crushed red pepper'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 4, avgPrice: 0.20 },
  { id: 'italian_seasoning', canonicalName: 'Italian Seasoning', aliases: ['italian seasoning', 'italian herbs'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.20 },
  { id: 'garam_masala', canonicalName: 'Garam Masala', aliases: ['garam masala', 'indian spice'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 6, avgPrice: 0.30 },
  { id: 'bay_leaves', canonicalName: 'Bay Leaves', aliases: ['bay leaf', 'bay leaves'], category: 'spices', defaultUnit: 'whole', defaultQuantity: 10, avgPrice: 0.10 },
  { id: 'vanilla', canonicalName: 'Vanilla Extract', aliases: ['vanilla', 'vanilla extract', 'pure vanilla'], category: 'spices', defaultUnit: 'tsp', defaultQuantity: 8, avgPrice: 0.75 },
  
  // FROZEN
  { id: 'frozen_peas', canonicalName: 'Frozen Peas', aliases: ['frozen peas', 'peas frozen', 'green peas frozen'], category: 'frozen', defaultUnit: 'cups', defaultQuantity: 3, avgPrice: 1.00 },
  { id: 'frozen_corn', canonicalName: 'Frozen Corn', aliases: ['frozen corn', 'corn frozen'], category: 'frozen', defaultUnit: 'cups', defaultQuantity: 3, avgPrice: 1.00 },
  { id: 'frozen_spinach', canonicalName: 'Frozen Spinach', aliases: ['frozen spinach', 'spinach frozen'], category: 'frozen', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 1.50 },
  { id: 'frozen_broccoli', canonicalName: 'Frozen Broccoli', aliases: ['frozen broccoli', 'broccoli frozen'], category: 'frozen', defaultUnit: 'cups', defaultQuantity: 3, avgPrice: 1.50 },
  { id: 'frozen_berries', canonicalName: 'Frozen Mixed Berries', aliases: ['frozen berries', 'mixed berries frozen', 'frozen fruit'], category: 'frozen', defaultUnit: 'cups', defaultQuantity: 3, avgPrice: 2.50 },
  { id: 'ice_cream', canonicalName: 'Ice Cream', aliases: ['ice cream', 'icecream', 'vanilla ice cream'], category: 'frozen', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 1.50 },
  
  // BEVERAGES
  { id: 'coffee', canonicalName: 'Coffee', aliases: ['coffee', 'ground coffee', 'coffee beans', 'whole bean coffee'], category: 'beverages', defaultUnit: 'cups', defaultQuantity: 10, avgPrice: 0.50 },
  { id: 'tea', canonicalName: 'Tea', aliases: ['tea', 'tea bags', 'green tea', 'black tea'], category: 'beverages', defaultUnit: 'whole', defaultQuantity: 20, avgPrice: 0.15 },
  { id: 'orange_juice', canonicalName: 'Orange Juice', aliases: ['orange juice', 'oj', 'fresh squeezed oj'], category: 'beverages', defaultUnit: 'cups', defaultQuantity: 8, avgPrice: 0.50 },
  { id: 'apple_juice', canonicalName: 'Apple Juice', aliases: ['apple juice', 'apple cider'], category: 'beverages', defaultUnit: 'cups', defaultQuantity: 8, avgPrice: 0.40 },
  
  // SNACKS & BAKING
  { id: 'sugar', canonicalName: 'Sugar', aliases: ['sugar', 'white sugar', 'granulated sugar', 'cane sugar'], category: 'snacks', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 0.50 },
  { id: 'brown_sugar', canonicalName: 'Brown Sugar', aliases: ['brown sugar', 'light brown sugar', 'dark brown sugar'], category: 'snacks', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 0.75 },
  { id: 'baking_powder', canonicalName: 'Baking Powder', aliases: ['baking powder'], category: 'snacks', defaultUnit: 'tsp', defaultQuantity: 12, avgPrice: 0.10 },
  { id: 'baking_soda', canonicalName: 'Baking Soda', aliases: ['baking soda', 'bicarbonate'], category: 'snacks', defaultUnit: 'tsp', defaultQuantity: 12, avgPrice: 0.05 },
  { id: 'chocolate_chips', canonicalName: 'Chocolate Chips', aliases: ['chocolate chips', 'semi sweet chips', 'chocolate morsels'], category: 'snacks', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 2.00 },
  { id: 'almonds', canonicalName: 'Almonds', aliases: ['almond', 'almonds', 'raw almonds', 'sliced almonds'], category: 'snacks', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 4.00 },
  { id: 'walnuts', canonicalName: 'Walnuts', aliases: ['walnut', 'walnuts', 'chopped walnuts'], category: 'snacks', defaultUnit: 'cups', defaultQuantity: 2, avgPrice: 4.00 },
  { id: 'chips', canonicalName: 'Potato Chips', aliases: ['chips', 'potato chips', 'tortilla chips', 'corn chips'], category: 'snacks', defaultUnit: 'cups', defaultQuantity: 4, avgPrice: 1.00 },
  { id: 'crackers', canonicalName: 'Crackers', aliases: ['cracker', 'crackers', 'saltines', 'ritz'], category: 'snacks', defaultUnit: 'whole', defaultQuantity: 30, avgPrice: 0.10 },
  { id: 'popcorn', canonicalName: 'Popcorn', aliases: ['popcorn', 'popcorn kernels', 'microwave popcorn'], category: 'snacks', defaultUnit: 'cups', defaultQuantity: 8, avgPrice: 0.25 },
  
  // OTHER
  { id: 'kalamata_olives', canonicalName: 'Kalamata Olives', aliases: ['kalamata olives', 'kalamata', 'greek olives', 'black olives'], category: 'other', defaultUnit: 'cups', defaultQuantity: 1, avgPrice: 4.00 },
  { id: 'capers', canonicalName: 'Capers', aliases: ['capers', 'caper'], category: 'other', defaultUnit: 'tbsp', defaultQuantity: 4, avgPrice: 1.00 },
  { id: 'sun_dried_tomatoes', canonicalName: 'Sun-Dried Tomatoes', aliases: ['sun dried tomatoes', 'sundried tomatoes'], category: 'other', defaultUnit: 'cups', defaultQuantity: 1, avgPrice: 5.00 },
  { id: 'sesame_seeds', canonicalName: 'Sesame Seeds', aliases: ['sesame seeds', 'sesame', 'white sesame'], category: 'other', defaultUnit: 'tbsp', defaultQuantity: 8, avgPrice: 0.25 },
  { id: 'wine_white', canonicalName: 'White Wine', aliases: ['white wine', 'cooking wine', 'dry white wine'], category: 'other', defaultUnit: 'ml', defaultQuantity: 200, avgPrice: 0.02 },
  { id: 'wine_red', canonicalName: 'Red Wine', aliases: ['red wine', 'cooking red wine'], category: 'other', defaultUnit: 'ml', defaultQuantity: 200, avgPrice: 0.02 },
  { id: 'shallots', canonicalName: 'Shallots', aliases: ['shallot', 'shallots'], category: 'produce', defaultUnit: 'whole', defaultQuantity: 3, avgPrice: 0.75 },
  { id: 'chives', canonicalName: 'Chives', aliases: ['chive', 'chives', 'fresh chives'], category: 'produce', defaultUnit: 'tbsp', defaultQuantity: 4, avgPrice: 0.50 },
];

// Create a searchable index
const searchIndex = new Map<string, StandardIngredient>();

ingredientDatabase.forEach(ingredient => {
  // Index by canonical name
  searchIndex.set(ingredient.canonicalName.toLowerCase(), ingredient);
  
  // Index by all aliases
  ingredient.aliases.forEach(alias => {
    searchIndex.set(alias.toLowerCase(), ingredient);
  });
});

/**
 * Find an exact or close match for an ingredient name
 */
export function findIngredientMatch(input: string): StandardIngredient | undefined {
  const normalized = input.toLowerCase().trim();
  
  // Direct match
  if (searchIndex.has(normalized)) {
    return searchIndex.get(normalized);
  }
  
  // Try without common suffixes/prefixes
  const withoutPlural = normalized.replace(/s$/, '');
  if (searchIndex.has(withoutPlural)) {
    return searchIndex.get(withoutPlural);
  }
  
  // Try partial match
  const entries = Array.from(searchIndex.entries());
  for (const [key, ingredient] of entries) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return ingredient;
    }
  }
  
  return undefined;
}

/**
 * Get autocomplete suggestions for partial input
 */
export function getAutocompleteSuggestions(input: string, limit: number = 8): StandardIngredient[] {
  if (!input || input.length < 2) return [];
  
  const normalized = input.toLowerCase().trim();
  const matches: { ingredient: StandardIngredient; score: number }[] = [];
  const seen = new Set<string>();
  
  ingredientDatabase.forEach(ingredient => {
    if (seen.has(ingredient.id)) return;
    
    // Check canonical name
    const canonicalLower = ingredient.canonicalName.toLowerCase();
    if (canonicalLower.startsWith(normalized)) {
      matches.push({ ingredient, score: 100 });
      seen.add(ingredient.id);
      return;
    }
    
    if (canonicalLower.includes(normalized)) {
      matches.push({ ingredient, score: 80 });
      seen.add(ingredient.id);
      return;
    }
    
    // Check aliases
    for (const alias of ingredient.aliases) {
      if (alias.startsWith(normalized)) {
        matches.push({ ingredient, score: 90 });
        seen.add(ingredient.id);
        return;
      }
      if (alias.includes(normalized)) {
        matches.push({ ingredient, score: 70 });
        seen.add(ingredient.id);
        return;
      }
    }
  });
  
  // Sort by score and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(m => m.ingredient);
}

/**
 * Standardize an ingredient name to its canonical form
 */
export function standardizeIngredientName(input: string): string {
  const match = findIngredientMatch(input);
  return match ? match.canonicalName : input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
