import { Request, Response } from 'express';
import { StripeService, stripe } from '../services/stripe.service';
import { ENV } from '../config/env';

export class StripeController {
  /**
   * Create Checkout Session for monthly subscription
   * POST /api/stripe/create-checkout-session
   */
  public static async createCheckoutSession(_req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, url } = await StripeService.createCheckoutSession(
        ENV.DEMO_USER_ID,
        ENV.DEMO_USER_EMAIL
      );

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          url,
        },
      });
    } catch (error: any) {
      console.error('Stripe Checkout Session creation error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to initiate Stripe Checkout',
          code: 'STRIPE_CHECKOUT_FAILED',
        },
      });
    }
  }

  /**
   * Process incoming Stripe webhooks
   * POST /api/stripe/webhook
   */
  public static async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      res.status(400).json({
        success: false,
        error: { message: 'Missing stripe-signature header', code: 'MISSING_SIGNATURE' },
      });
      return;
    }

    let event;
    try {
      const rawBody = (req as any).rawBody || req.body;
      event = stripe.webhooks.constructEvent(rawBody, sig, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).json({
        success: false,
        error: { message: `Webhook Error: ${err.message}`, code: 'INVALID_SIGNATURE' },
      });
      return;
    }

    try {
      await StripeService.handleWebhookEvent(event);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Error processing webhook event', code: 'WEBHOOK_PROCESS_FAILED' },
      });
    }
  }

  /**
   * Get subscription status of demo user
   * GET /api/stripe/status
   */
  public static async getStatus(_req: Request, res: Response): Promise<void> {
    try {
      const status = await StripeService.getDemoUserSubscription(ENV.DEMO_USER_ID);
      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message || 'Failed to fetch status', code: 'STATUS_FETCH_FAILED' },
      });
    }
  }

  /**
   * Helper endpoint for test evaluation: Toggles demo user subscription status
   * POST /api/stripe/toggle-demo-status
   */
  public static async toggleDemoStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body || {};
      const updated = await StripeService.toggleDemoSubscription(status, ENV.DEMO_USER_ID);
      res.status(200).json({
        success: true,
        data: updated,
        message: `Demo user subscription successfully set to ${updated.subscriptionStatus}`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message || 'Failed to toggle status', code: 'TOGGLE_FAILED' },
      });
    }
  }
}
