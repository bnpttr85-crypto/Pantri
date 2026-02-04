// Open Food Facts API - Free, open source product database
// https://world.openfoodfacts.org/

export interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  brands?: string;
  quantity?: string;
  categories?: string;
  image_url?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
}

export interface ProductLookupResult {
  found: boolean;
  product?: {
    barcode: string;
    name: string;
    brand?: string;
    quantity?: string;
    category?: string;
    imageUrl?: string;
  };
  source: 'open_food_facts' | 'local_store' | 'not_found';
}

export async function lookupBarcodeOpenFoodFacts(barcode: string): Promise<ProductLookupResult> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': 'PantryPal/1.0 (https://github.com/pantry-pal)',
        },
      }
    );
    
    if (!response.ok) {
      return { found: false, source: 'not_found' };
    }
    
    const data = await response.json();
    
    if (data.status !== 1 || !data.product) {
      return { found: false, source: 'not_found' };
    }
    
    const product = data.product as OpenFoodFactsProduct;
    
    return {
      found: true,
      source: 'open_food_facts',
      product: {
        barcode: barcode,
        name: product.product_name || 'Unknown Product',
        brand: product.brands,
        quantity: product.quantity,
        category: categorizeProduct(product.categories),
        imageUrl: product.image_url,
      },
    };
  } catch (error) {
    console.error('Open Food Facts API error:', error);
    return { found: false, source: 'not_found' };
  }
}

// Map Open Food Facts categories to our app categories
function categorizeProduct(categories?: string): string {
  if (!categories) return 'other';
  
  const cats = categories.toLowerCase();
  
  if (cats.includes('dairy') || cats.includes('milk') || cats.includes('cheese') || cats.includes('yogurt')) {
    return 'dairy';
  }
  if (cats.includes('meat') || cats.includes('beef') || cats.includes('pork') || cats.includes('chicken')) {
    return 'meat';
  }
  if (cats.includes('fish') || cats.includes('seafood') || cats.includes('shrimp')) {
    return 'seafood';
  }
  if (cats.includes('vegetable') || cats.includes('fruit') || cats.includes('produce')) {
    return 'produce';
  }
  if (cats.includes('bread') || cats.includes('pasta') || cats.includes('cereal') || cats.includes('grain') || cats.includes('rice')) {
    return 'grains';
  }
  if (cats.includes('canned') || cats.includes('soup')) {
    return 'canned';
  }
  if (cats.includes('frozen')) {
    return 'frozen';
  }
  if (cats.includes('sauce') || cats.includes('condiment') || cats.includes('dressing')) {
    return 'condiments';
  }
  if (cats.includes('spice') || cats.includes('herb') || cats.includes('seasoning')) {
    return 'spices';
  }
  if (cats.includes('beverage') || cats.includes('drink') || cats.includes('juice') || cats.includes('soda') || cats.includes('coffee') || cats.includes('tea')) {
    return 'beverages';
  }
  if (cats.includes('snack') || cats.includes('chip') || cats.includes('cracker') || cats.includes('cookie') || cats.includes('candy')) {
    return 'snacks';
  }
  if (cats.includes('baking') || cats.includes('flour') || cats.includes('sugar') || cats.includes('oil')) {
    return 'staples';
  }
  
  return 'other';
}

// Common UPC prefixes for different countries
export const UPC_COUNTRY_PREFIXES: Record<string, string> = {
  '000-019': 'USA/Canada',
  '020-029': 'In-store',
  '030-039': 'USA/Canada',
  '040-049': 'In-store',
  '050-059': 'Coupons',
  '060-099': 'USA/Canada',
  '100-139': 'USA',
  '300-379': 'France',
  '400-440': 'Germany',
  '450-459': 'Japan',
  '460-469': 'Russia',
  '471': 'Taiwan',
  '480-489': 'Philippines',
  '489': 'Hong Kong',
  '490-499': 'Japan',
  '500-509': 'UK',
  '520-521': 'Greece',
  '528': 'Lebanon',
  '529': 'Cyprus',
  '530': 'Albania',
  '531': 'Macedonia',
  '535': 'Malta',
  '539': 'Ireland',
  '540-549': 'Belgium/Luxembourg',
  '560': 'Portugal',
  '569': 'Iceland',
  '570-579': 'Denmark',
  '590': 'Poland',
  '594': 'Romania',
  '599': 'Hungary',
  '600-601': 'South Africa',
  '609': 'Mauritius',
  '611': 'Morocco',
  '613': 'Algeria',
  '616': 'Kenya',
  '619': 'Tunisia',
  '621': 'Syria',
  '622': 'Egypt',
  '625': 'Jordan',
  '626': 'Iran',
  '627': 'Kuwait',
  '628': 'Saudi Arabia',
  '629': 'UAE',
  '640-649': 'Finland',
  '690-699': 'China',
  '700-709': 'Norway',
  '729': 'Israel',
  '730-739': 'Sweden',
  '740': 'Guatemala',
  '741': 'El Salvador',
  '742': 'Honduras',
  '743': 'Nicaragua',
  '744': 'Costa Rica',
  '745': 'Panama',
  '746': 'Dominican Republic',
  '750': 'Mexico',
  '754-755': 'Canada',
  '759': 'Venezuela',
  '760-769': 'Switzerland',
  '770-771': 'Colombia',
  '773': 'Uruguay',
  '775': 'Peru',
  '777': 'Bolivia',
  '778-779': 'Argentina',
  '780': 'Chile',
  '784': 'Paraguay',
  '786': 'Ecuador',
  '789-790': 'Brazil',
  '800-839': 'Italy',
  '840-849': 'Spain',
  '850': 'Cuba',
  '858': 'Slovakia',
  '859': 'Czech Republic',
  '860': 'Serbia',
  '865': 'Mongolia',
  '867': 'North Korea',
  '868-869': 'Turkey',
  '870-879': 'Netherlands',
  '880': 'South Korea',
  '884': 'Cambodia',
  '885': 'Thailand',
  '888': 'Singapore',
  '890': 'India',
  '893': 'Vietnam',
  '896': 'Pakistan',
  '899': 'Indonesia',
  '900-919': 'Austria',
  '930-939': 'Australia',
  '940-949': 'New Zealand',
  '955': 'Malaysia',
  '958': 'Macau',
};
