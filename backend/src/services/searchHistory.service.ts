import prisma from '../lib/prisma';
import { ENV } from '../config/env';
import { SupportedLanguage } from '../types';

export class SearchHistoryService {
  /**
   * Log a search query for the demo user into MySQL
   */
  public static async recordSearch(
    query: string,
    language: SupportedLanguage,
    resultCount: number,
    userId: string = ENV.DEMO_USER_ID
  ): Promise<void> {
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      // Ensure demo user exists first (in case seeding hasn't run yet)
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: ENV.DEMO_USER_EMAIL,
          name: 'Demo Reviewer',
          subscriptionStatus: 'INACTIVE',
        },
      });

      await prisma.searchHistory.create({
        data: {
          userId,
          query: trimmed,
          language,
          resultCount,
        },
      });
    } catch (error: any) {
      console.warn('Could not record search history into database:', error.message);
    }
  }

  /**
   * Fetch recent unique searches for the demo user
   */
  public static async getRecentSearches(
    userId: string = ENV.DEMO_USER_ID,
    limit: number = 10
  ): Promise<Array<{ id: string; query: string; language: string; createdAt: Date }>> {
    try {
      const records = await prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit * 2, // Fetch more to deduplicate by query
        select: {
          id: true,
          query: true,
          language: true,
          createdAt: true,
        },
      });

      // Deduplicate consecutive or identical queries
      const seen = new Set<string>();
      const deduplicated = [];
      for (const item of records) {
        const key = item.query.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          deduplicated.push(item);
          if (deduplicated.length >= limit) break;
        }
      }

      return deduplicated;
    } catch (error: any) {
      console.warn('Could not retrieve recent searches from database:', error.message);
      return [];
    }
  }
}
