/**
 * @file translations.test.ts
 * @description Pure TypeScript tests (no DOM rendering) that verify the i18n translation system
 * is complete and consistent across all 4 supported languages (EN, NL, DE, FR).
 *
 * These tests ensure:
 * - All 4 languages are present in the translations object.
 * - Every language has all required translation keys (no missing keys).
 * - No translation values are empty strings.
 * - All language codes match the SupportedLanguage type.
 */

import { translations, TranslationDictionary } from '../src/i18n/translations';
import type { SupportedLanguage } from '../src/lib/types';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'nl', 'de', 'fr'];

describe('i18n Translation Coverage', () => {
  test('contains exactly 4 supported languages', () => {
    const keys = Object.keys(translations);
    expect(keys).toHaveLength(4);
    expect(keys).toEqual(expect.arrayContaining(['en', 'nl', 'de', 'fr']));
  });

  test('every language code matches the SupportedLanguage type', () => {
    const validCodes: SupportedLanguage[] = ['en', 'nl', 'de', 'fr'];
    Object.keys(translations).forEach((code) => {
      expect(validCodes).toContain(code as SupportedLanguage);
    });
  });

  // English is the canonical reference — all other languages must match its key set
  const enKeys = Object.keys(translations.en) as (keyof TranslationDictionary)[];

  describe('English (EN) — canonical reference locale', () => {
    test('has at least 20 translation keys', () => {
      expect(enKeys.length).toBeGreaterThanOrEqual(20);
    });

    test('all values are non-empty strings', () => {
      Object.entries(translations.en).forEach(([_key, value]) => {
        expect(typeof value).toBe('string');
        expect(value.trim()).not.toBe('');
      });
    });
  });

  SUPPORTED_LANGUAGES.filter((l) => l !== 'en').forEach((lang) => {
    describe(`${lang.toUpperCase()} locale`, () => {
      test('has every key that English has (no missing translations)', () => {
        const langKeys = Object.keys(translations[lang]);
        enKeys.forEach((key) => {
          expect(langKeys).toContain(key);
        });
      });

      test('has same number of keys as English', () => {
        expect(Object.keys(translations[lang])).toHaveLength(enKeys.length);
      });

      test('all values are non-empty strings', () => {
        Object.entries(translations[lang]).forEach(([_key, value]) => {
          expect(typeof value).toBe('string');
          expect(value.trim()).not.toBe('');
        });
      });

      test('does not share identical values with English for localized keys', () => {
        // At least half of the non-universal keys should differ from English
        const universalKeys = ['nutriscoreGrade', 'ecoscoreGrade', 'per100g', 'barcode'];
        let diffCount = 0;
        enKeys.forEach((key) => {
          if (!universalKeys.includes(key) && translations[lang][key] !== translations.en[key]) {
            diffCount++;
          }
        });
        // At least 30% of keys should be localized (different from English)
        expect(diffCount).toBeGreaterThan(enKeys.length * 0.3);
      });
    });
  });

  describe('Translation key completeness by feature area', () => {
    test('contains all required search UI keys', () => {
      const searchKeys: (keyof TranslationDictionary)[] = [
        'searchPlaceholder', 'searchButton', 'searching', 'recentSearches',
        'noResultsTitle', 'noResultsDesc', 'resultsFound',
      ];
      SUPPORTED_LANGUAGES.forEach((lang) => {
        searchKeys.forEach((key) => {
          expect(translations[lang][key]).toBeTruthy();
        });
      });
    });

    test('contains all required product detail keys', () => {
      const productKeys: (keyof TranslationDictionary)[] = [
        'brand', 'barcode', 'quantity', 'categories', 'ingredients',
        'nutritionalValues', 'per100g', 'energy', 'fat', 'proteins', 'salt',
      ];
      SUPPORTED_LANGUAGES.forEach((lang) => {
        productKeys.forEach((key) => {
          expect(translations[lang][key]).toBeTruthy();
        });
      });
    });

    test('contains all required subscription gatekeeping keys', () => {
      const subscriptionKeys: (keyof TranslationDictionary)[] = [
        'proSubscriber', 'freeTier', 'lockedNutritionTitle', 'lockedNutritionDesc',
        'subscribeButton', 'togglePro', 'toggleFree', 'evaluatorMode',
      ];
      SUPPORTED_LANGUAGES.forEach((lang) => {
        subscriptionKeys.forEach((key) => {
          expect(translations[lang][key]).toBeTruthy();
        });
      });
    });
  });
});
