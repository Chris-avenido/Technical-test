import { Request, Response } from 'express';
import { SearchHistoryService } from '../services/searchHistory.service';
import { StripeService } from '../services/stripe.service';
import { ENV } from '../config/env';

export class UserController {
  /**
   * Get recent searches for the demo user
   * GET /api/user/searches
   */
  public static async getRecentSearches(req: Request, res: Response): Promise<void> {
    try {
      const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
      const searches = await SearchHistoryService.getRecentSearches(ENV.DEMO_USER_ID, limit);

      res.status(200).json({
        success: true,
        data: searches,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to fetch recent searches',
          code: 'FETCH_SEARCHES_FAILED',
        },
      });
    }
  }

  /**
   * Get demo user profile
   * GET /api/user/profile
   */
  public static async getProfile(_req: Request, res: Response): Promise<void> {
    try {
      const profile = await StripeService.getDemoUserSubscription(ENV.DEMO_USER_ID);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to fetch user profile',
          code: 'FETCH_PROFILE_FAILED',
        },
      });
    }
  }
}
