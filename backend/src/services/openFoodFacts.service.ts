import axios from 'axios';
import { ProductSummary, ProductDetail, SupportedLanguage, NutrimentsData } from '../types';

const SEARCH_API_URL = 'https://search.openfoodfacts.org/search';
const PRODUCT_V2_API_URL = 'https://world.openfoodfacts.org/api/v2/product';
const USER_AGENT = 'FoodFinderExam/1.0 (student-exam@test.org)';

// In-memory cache to respect Open Food Facts rate-limits and ensure fast responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

export class OpenFoodFactsService {
  /**
   * Safe getter for cached data
   */
  private static getFromCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  /**
   * Safe setter for cache
   */
  private static setInCache<T>(key: string, data: T): void {
    if (cache.size > 500) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
    cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Resolves localized product name with graceful fallback chain:
   * 1. product_name_{lang}
   * 2. product_name_en
   * 3. product_name
   * 4. generic_name_{lang}
   * 5. generic_name
   * 6. "Unknown Product"
   */
  public static resolveLocalizedName(item: any, lang: SupportedLanguage): string {
    if (!item) return 'Unknown Product';
    const langKey = `product_name_${lang}`;
    if (item[langKey] && typeof item[langKey] === 'string' && item[langKey].trim()) {
      return item[langKey].trim();
    }
    if (item.product_name_en && typeof item.product_name_en === 'string' && item.product_name_en.trim()) {
      return item.product_name_en.trim();
    }
    if (item.product_name && typeof item.product_name === 'string' && item.product_name.trim()) {
      return item.product_name.trim();
    }
    const genericKey = `generic_name_${lang}`;
    if (item[genericKey] && typeof item[genericKey] === 'string' && item[genericKey].trim()) {
      return item[genericKey].trim();
    }
    if (item.generic_name && typeof item.generic_name === 'string' && item.generic_name.trim()) {
      return item.generic_name.trim();
    }
    return 'Unknown Product';
  }

  /**
   * Resolves localized ingredients text with fallback:
   * 1. ingredients_text_{lang}
   * 2. ingredients_text_en
   * 3. ingredients_text
   */
  public static resolveLocalizedIngredients(item: any, lang: SupportedLanguage): string | null {
    if (!item) return null;
    const langKey = `ingredients_text_${lang}`;
    if (item[langKey] && typeof item[langKey] === 'string' && item[langKey].trim()) {
      return item[langKey].trim();
    }
    if (item.ingredients_text_en && typeof item.ingredients_text_en === 'string' && item.ingredients_text_en.trim()) {
      return item.ingredients_text_en.trim();
    }
    if (item.ingredients_text && typeof item.ingredients_text === 'string' && item.ingredients_text.trim()) {
      return item.ingredients_text.trim();
    }
    return null;
  }

  /**
   * Normalizes brand names (handles arrays, comma-separated strings, missing values)
   */
  public static resolveBrand(item: any): string {
    if (!item) return 'Unknown Brand';
    if (Array.isArray(item.brands) && item.brands.length > 0) {
      return item.brands.filter(Boolean).join(', ');
    }
    if (typeof item.brands === 'string' && item.brands.trim()) {
      return item.brands.trim();
    }
    if (typeof item.brand === 'string' && item.brand.trim()) {
      return item.brand.trim();
    }
    return 'Unknown Brand';
  }

  /**
   * Resolves categories as an array of trimmed strings
   */
  public static resolveCategories(item: any): string[] {
    if (!item) return [];
    if (Array.isArray(item.categories_tags)) {
      return item.categories_tags
        .map((tag: string) => tag.replace(/^[a-z]{2}:/, '').replace(/-/g, ' '))
        .filter(Boolean)
        .slice(0, 5);
    }
    if (typeof item.categories === 'string' && item.categories.trim()) {
      return item.categories
        .split(',')
        .map((c: string) => c.trim())
        .filter(Boolean)
        .slice(0, 5);
    }
    return [];
  }

  /**
   * Parses and sanitizes nutriments from raw Open Food Facts payload
   */
  public static parseNutriments(rawNutriments: any): NutrimentsData | null {
    if (!rawNutriments || typeof rawNutriments !== 'object') {
      return null;
    }

    const parseNum = (val: any): number | null => {
      if (val === null || val === undefined || val === '') return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : Number(parsed.toFixed(2));
    };

    return {
      energyKcal100g: parseNum(rawNutriments['energy-kcal_100g'] ?? rawNutriments['energy-kcal_value'] ?? rawNutriments['energy-kcal']),
      energyKj100g: parseNum(rawNutriments['energy_100g'] ?? rawNutriments['energy_value'] ?? rawNutriments['energy']),
      fat100g: parseNum(rawNutriments.fat_100g ?? rawNutriments.fat_value ?? rawNutriments.fat),
      saturatedFat100g: parseNum(rawNutriments['saturated-fat_100g'] ?? rawNutriments['saturated-fat_value'] ?? rawNutriments['saturated-fat']),
      carbohydrates100g: parseNum(rawNutriments.carbohydrates_100g ?? rawNutriments.carbohydrates_value ?? rawNutriments.carbohydrates),
      sugars100g: parseNum(rawNutriments.sugars_100g ?? rawNutriments.sugars_value ?? rawNutriments.sugars),
      fiber100g: parseNum(rawNutriments.fiber_100g ?? rawNutriments.fiber_value ?? rawNutriments.fiber),
      proteins100g: parseNum(rawNutriments.proteins_100g ?? rawNutriments.proteins_value ?? rawNutriments.proteins),
      salt100g: parseNum(rawNutriments.salt_100g ?? rawNutriments.salt_value ?? rawNutriments.salt),
      sodium100g: parseNum(rawNutriments.sodium_100g ?? rawNutriments.sodium_value ?? rawNutriments.sodium),
    };
  }

  /**
   * Search for products by search term using Open Food Facts Search-a-licious API
   */
  public static async searchProducts(
    query: string,
    lang: SupportedLanguage = 'en',
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ products: ProductSummary[]; totalCount: number }> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return { products: [], totalCount: 0 };
    }

    const cacheKey = `search:${lang}:${page}:${pageSize}:${trimmedQuery.toLowerCase()}`;
    const cached = this.getFromCache<{ products: ProductSummary[]; totalCount: number }>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          q: trimmedQuery,
          page_size: pageSize,
          page,
          lc: lang,
        },
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
        timeout: 8000,
      });

      const hits = response.data?.hits || [];
      const totalCount = response.data?.count || hits.length;

      const products: ProductSummary[] = hits.map((item: any) => ({
        code: String(item.code || item.id || ''),
        name: this.resolveLocalizedName(item, lang),
        brand: this.resolveBrand(item),
        imageUrl: item.image_front_url || item.image_url || null,
        thumbnailUrl: item.image_front_thumb_url || item.image_thumb_url || item.image_front_small_url || null,
        categories: this.resolveCategories(item),
        nutriscoreGrade: item.nutriscore_grade && item.nutriscore_grade !== 'unknown' ? item.nutriscore_grade.toUpperCase() : null,
      })).filter((p: ProductSummary) => Boolean(p.code));

      const result = { products, totalCount };
      this.setInCache(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error(`OpenFoodFacts search error for "${trimmedQuery}":`, error.message);
      // Fallback: return empty result without crashing
      return { products: [], totalCount: 0 };
    }
  }

  /**
   * Get single product detail by barcode (with localization and complete fields)
   */
  public static async getProductByCode(code: string, lang: SupportedLanguage = 'en'): Promise<Omit<ProductDetail, 'isSubscribed' | 'nutritionLocked' | 'nutriments'> & { rawNutriments: any } | null> {
    const trimmedCode = code.trim();
    if (!trimmedCode) return null;

    const cacheKey = `product:${trimmedCode}:${lang}`;
    const cached = this.getFromCache<any>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${PRODUCT_V2_API_URL}/${trimmedCode}.json`, {
        params: {
          lc: lang,
        },
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
        timeout: 8000,
      });

      if (!response.data || response.data.status !== 1 || !response.data.product) {
        return null;
      }

      const item = response.data.product;
      const result = {
        code: String(item.code || trimmedCode),
        name: this.resolveLocalizedName(item, lang),
        brand: this.resolveBrand(item),
        imageUrl: item.image_front_url || item.image_url || null,
        thumbnailUrl: item.image_front_thumb_url || item.image_thumb_url || item.image_front_small_url || null,
        categories: this.resolveCategories(item),
        nutriscoreGrade: item.nutriscore_grade && item.nutriscore_grade !== 'unknown' ? item.nutriscore_grade.toUpperCase() : null,
        ecoscoreGrade: item.ecoscore_grade && item.ecoscore_grade !== 'unknown' ? item.ecoscore_grade.toUpperCase() : null,
        novaGroup: item.nova_group ? Number(item.nova_group) : null,
        quantity: item.quantity || null,
        ingredientsText: this.resolveLocalizedIngredients(item, lang),
        rawNutriments: item.nutriments || null,
      };

      this.setInCache(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error(`OpenFoodFacts product error for "${trimmedCode}":`, error.message);
      return null;
    }
  }
}
