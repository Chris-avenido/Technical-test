import { Request, Response } from 'express';
import { OpenFoodFactsService } from '../services/openFoodFacts.service';
import { SearchHistoryService } from '../services/searchHistory.service';
import { StripeService } from '../services/stripe.service';
import { SupportedLanguage } from '../types';

const ALLOWED_LANGUAGES: SupportedLanguage[] = ['en', 'nl', 'de', 'fr'];

export class ProductController {
  /**
   * Search packaged food products
   * GET /api/products/search?q={query}&lang={lang}&page={page}&pageSize={pageSize}
   */
  public static async search(req: Request, res: Response): Promise<void> {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const langParam = typeof req.query.lang === 'string' ? req.query.lang.toLowerCase() : 'en';
    const lang: SupportedLanguage = ALLOWED_LANGUAGES.includes(langParam as SupportedLanguage)
      ? (langParam as SupportedLanguage)
      : 'en';

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string, 10) || 20));

    if (!query) {
      res.status(200).json({
        success: true,
        data: {
          query: '',
          language: lang,
          page,
          pageSize,
          totalCount: 0,
          products: [],
        },
      });
      return;
    }

    try {
      const { products, totalCount } = await OpenFoodFactsService.searchProducts(
        query,
        lang,
        page,
        pageSize
      );

      // Asynchronously record search history for demo user in MySQL
      SearchHistoryService.recordSearch(query, lang, totalCount).catch((err) =>
        console.warn('Failed to record search history:', err.message)
      );

      res.status(200).json({
        success: true,
        data: {
          query,
          language: lang,
          page,
          pageSize,
          totalCount,
          products,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to search products',
          code: 'SEARCH_FAILED',
        },
      });
    }
  }

  /**
   * Get single product details with subscription-gated nutrition
   * GET /api/products/:code?lang={lang}
   */
  public static async getByCode(req: Request, res: Response): Promise<void> {
    const rawCode = req.params.code;
    const code = typeof rawCode === 'string' ? rawCode.trim() : Array.isArray(rawCode) ? rawCode[0]?.trim() : '';
    const langParam = typeof req.query.lang === 'string' ? req.query.lang.toLowerCase() : 'en';
    const lang: SupportedLanguage = ALLOWED_LANGUAGES.includes(langParam as SupportedLanguage)
      ? (langParam as SupportedLanguage)
      : 'en';

    if (!code) {
      res.status(400).json({
        success: false,
        error: { message: 'Product barcode is required', code: 'INVALID_CODE' },
      });
      return;
    }

    try {
      const product = await OpenFoodFactsService.getProductByCode(code, lang);
      if (!product) {
        res.status(404).json({
          success: false,
          error: { message: 'Product not found', code: 'PRODUCT_NOT_FOUND' },
        });
        return;
      }

      // Check backend source of truth for demo user subscription status
      const isSubscribed = await StripeService.isDemoUserSubscribed();

      const { rawNutriments, ...basicProduct } = product;

      if (!isSubscribed) {
        // Unsubscribed / Free user: Lock detailed nutritional breakdown
        res.status(200).json({
          success: true,
          data: {
            ...basicProduct,
            isSubscribed: false,
            nutritionLocked: true,
            nutriments: null,
            subscriptionPrompt: 'Detailed nutritional values are reserved for active Pro subscribers.',
          },
        });
        return;
      }

      // Active subscriber: Unlock full nutrition data
      const nutriments = OpenFoodFactsService.parseNutriments(rawNutriments);

      res.status(200).json({
        success: true,
        data: {
          ...basicProduct,
          isSubscribed: true,
          nutritionLocked: false,
          nutriments,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to retrieve product',
          code: 'FETCH_PRODUCT_FAILED',
        },
      });
    }
  }
}
