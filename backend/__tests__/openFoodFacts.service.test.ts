import { OpenFoodFactsService } from '../src/services/openFoodFacts.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenFoodFactsService Unit & Fallback Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveLocalizedName', () => {
    it('returns requested language name when available', () => {
      const item = {
        product_name_fr: 'Chocolat au lait',
        product_name_en: 'Milk chocolate',
        product_name: 'Chocolate',
      };
      expect(OpenFoodFactsService.resolveLocalizedName(item, 'fr')).toBe('Chocolat au lait');
    });

    it('falls back to English when requested language is absent', () => {
      const item = {
        product_name_en: 'Organic Peanut Butter',
        product_name: 'Peanut Butter',
      };
      expect(OpenFoodFactsService.resolveLocalizedName(item, 'nl')).toBe('Organic Peanut Butter');
    });

    it('falls back to default product_name when English is absent', () => {
      const item = {
        product_name: 'Stroopwafel Original',
      };
      expect(OpenFoodFactsService.resolveLocalizedName(item, 'de')).toBe('Stroopwafel Original');
    });

    it('falls back to generic_name when product_name is absent', () => {
      const item = {
        generic_name_de: 'Käse Cracker',
      };
      expect(OpenFoodFactsService.resolveLocalizedName(item, 'de')).toBe('Käse Cracker');
    });

    it('returns "Unknown Product" when item or names are completely missing', () => {
      expect(OpenFoodFactsService.resolveLocalizedName({}, 'en')).toBe('Unknown Product');
      expect(OpenFoodFactsService.resolveLocalizedName(null, 'en')).toBe('Unknown Product');
    });
  });

  describe('resolveLocalizedIngredients', () => {
    it('returns localized ingredients when available', () => {
      const item = {
        ingredients_text_de: 'Zucker, Kakaomasse, Milchpulver',
        ingredients_text_en: 'Sugar, cocoa mass, milk powder',
      };
      expect(OpenFoodFactsService.resolveLocalizedIngredients(item, 'de')).toBe('Zucker, Kakaomasse, Milchpulver');
    });

    it('falls back to English ingredients when target language is missing', () => {
      const item = {
        ingredients_text_en: 'Wheat flour, water, yeast, salt',
      };
      expect(OpenFoodFactsService.resolveLocalizedIngredients(item, 'fr')).toBe('Wheat flour, water, yeast, salt');
    });

    it('returns null when no ingredients text is present', () => {
      expect(OpenFoodFactsService.resolveLocalizedIngredients({}, 'en')).toBeNull();
    });
  });

  describe('resolveBrand', () => {
    it('handles brand array', () => {
      const item = { brands: ['Nestle', 'KitKat'] };
      expect(OpenFoodFactsService.resolveBrand(item)).toBe('Nestle, KitKat');
    });

    it('handles brand string', () => {
      const item = { brands: 'Nutella' };
      expect(OpenFoodFactsService.resolveBrand(item)).toBe('Nutella');
    });

    it('falls back to "Unknown Brand" if missing', () => {
      expect(OpenFoodFactsService.resolveBrand({})).toBe('Unknown Brand');
    });
  });

  describe('parseNutriments', () => {
    it('accurately parses valid nutritional numeric values', () => {
      const raw = {
        'energy-kcal_100g': 540,
        'fat_100g': '29.7',
        'saturated-fat_100g': 10.8,
        'carbohydrates_100g': 59.4,
        'sugars_100g': 56.7,
        'fiber_100g': 3.2,
        'proteins_100g': 5.4,
        'salt_100g': 0.1,
        'sodium_100g': 0.04,
      };

      const parsed = OpenFoodFactsService.parseNutriments(raw);
      expect(parsed).toEqual({
        energyKcal100g: 540,
        energyKj100g: null,
        fat100g: 29.7,
        saturatedFat100g: 10.8,
        carbohydrates100g: 59.4,
        sugars100g: 56.7,
        fiber100g: 3.2,
        proteins100g: 5.4,
        salt100g: 0.1,
        sodium100g: 0.04,
      });
    });

    it('handles null, undefined, or malformed nutriments object', () => {
      expect(OpenFoodFactsService.parseNutriments(null)).toBeNull();
      expect(OpenFoodFactsService.parseNutriments(undefined)).toBeNull();
      expect(OpenFoodFactsService.parseNutriments('invalid' as any)).toBeNull();
    });
  });

  describe('searchProducts API', () => {
    it('returns empty array when query is empty string', async () => {
      const result = await OpenFoodFactsService.searchProducts('   ');
      expect(result).toEqual({ products: [], totalCount: 0 });
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('formats search results from Open Food Facts API response', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          count: 1,
          hits: [
            {
              code: '12345678',
              product_name_en: 'Test Cereal',
              brands: 'Healthy Foods',
              image_front_url: 'https://images.example.com/front.jpg',
              image_front_thumb_url: 'https://images.example.com/thumb.jpg',
              categories_tags: ['en:cereals-and-potatoes', 'en:breakfast-cereals'],
              nutriscore_grade: 'a',
            },
          ],
        },
      });

      const result = await OpenFoodFactsService.searchProducts('cereal', 'en');
      expect(result.totalCount).toBe(1);
      expect(result.products).toHaveLength(1);
      expect(result.products[0]).toEqual({
        code: '12345678',
        name: 'Test Cereal',
        brand: 'Healthy Foods',
        imageUrl: 'https://images.example.com/front.jpg',
        thumbnailUrl: 'https://images.example.com/thumb.jpg',
        categories: ['cereals and potatoes', 'breakfast cereals'],
        nutriscoreGrade: 'A',
      });
    });

    it('catches and recovers gracefully from external API failures', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network timeout'));
      const result = await OpenFoodFactsService.searchProducts('error-query', 'en');
      expect(result).toEqual({ products: [], totalCount: 0 });
    });
  });
});
