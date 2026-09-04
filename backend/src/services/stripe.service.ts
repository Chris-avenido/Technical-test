import Stripe from 'stripe';
import prisma from '../lib/prisma';
import { ENV } from '../config/env';

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia' as any,
});

export class StripeService {
  /**
   * Check if the demo user has an active subscription in MySQL
   */
  public static async isDemoUserSubscribed(userId: string = ENV.DEMO_USER_ID): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionStatus: true },
      });
      return user?.subscriptionStatus === 'ACTIVE';
    } catch (error: any) {
      console.warn('Database error while checking subscription status:', error.message);
      return false;
    }
  }

  /**
   * Get complete demo user subscription details
   */
  public static async getDemoUserSubscription(userId: string = ENV.DEMO_USER_ID) {
    try {
      let user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            id: userId,
            email: ENV.DEMO_USER_EMAIL,
            name: 'Demo Reviewer',
            subscriptionStatus: 'INACTIVE',
          },
        });
      }

      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        isSubscribed: user.subscriptionStatus === 'ACTIVE',
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        currentPeriodEnd: user.currentPeriodEnd,
      };
    } catch (error: any) {
      console.warn('Database error while fetching demo user:', error.message);
      return {
        userId: ENV.DEMO_USER_ID,
        email: ENV.DEMO_USER_EMAIL,
        name: 'Demo Reviewer',
        isSubscribed: false,
        subscriptionStatus: 'INACTIVE',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        currentPeriodEnd: null,
      };
    }
  }

  /**
   * Create a monthly recurring Stripe Checkout Session
   */
  public static async createCheckoutSession(
    userId: string = ENV.DEMO_USER_ID,
    userEmail: string = ENV.DEMO_USER_EMAIL
  ): Promise<{ sessionId: string; url: string | null }> {
    if (ENV.STRIPE_SECRET_KEY.includes('mockKeyForExamTesting') || ENV.STRIPE_SECRET_KEY.includes('mockKey')) {
      throw new Error(
        'Placeholder STRIPE_SECRET_KEY detected in backend/.env. Please replace it with your real Stripe Test Secret Key (starts with sk_test_...) from https://dashboard.stripe.com/test/apikeys'
      );
    }

    // We provide either configured real price ID or dynamically configure recurring monthly subscription
    const hasValidRealPriceId =
      Boolean(ENV.STRIPE_MONTHLY_PRICE_ID) &&
      !ENV.STRIPE_MONTHLY_PRICE_ID.includes('mock') &&
      !ENV.STRIPE_MONTHLY_PRICE_ID.includes('exam') &&
      !ENV.STRIPE_MONTHLY_PRICE_ID.includes('placeholder') &&
      ENV.STRIPE_MONTHLY_PRICE_ID.startsWith('price_');

    const lineItem = hasValidRealPriceId
      ? { price: ENV.STRIPE_MONTHLY_PRICE_ID, quantity: 1 }
      : {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Food Finder Pro - Monthly Subscription',
              description: 'Unlimited access to comprehensive nutritional breakdown, Nutri-Score analysis, and micronutrients.',
            },
            unit_amount: 999, // $9.99 / month
            recurring: {
              interval: 'month' as const,
            },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [lineItem],
      success_url: `${ENV.CLIENT_URL}/?subscription_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.CLIENT_URL}/?subscription_status=canceled`,
      metadata: {
        userId,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Process and verify Stripe webhook events
   */
  public static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId || ENV.DEMO_USER_ID;
        const customerId = session.customer ? String(session.customer) : null;
        const subscriptionId = session.subscription ? String(session.subscription) : null;

        await prisma.user.upsert({
          where: { id: userId },
          update: {
            subscriptionStatus: 'ACTIVE',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          },
          create: {
            id: userId,
            email: session.customer_email || ENV.DEMO_USER_EMAIL,
            subscriptionStatus: 'ACTIVE',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          },
        });
        console.log(`[Stripe Webhook] Subscription activated for user ${userId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = subscription.status === 'active';
        const customerId = String(subscription.customer);

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: isActive ? 'ACTIVE' : 'INACTIVE',
            stripeSubscriptionId: subscription.id,
            currentPeriodEnd: (subscription as any).current_period_end
              ? new Date((subscription as any).current_period_end * 1000)
              : null,
          },
        });
        console.log(`[Stripe Webhook] Subscription updated for customer ${customerId}: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = String(subscription.customer);

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: 'INACTIVE',
            stripeSubscriptionId: null,
          },
        });
        console.log(`[Stripe Webhook] Subscription canceled for customer ${customerId}`);
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  }

  /**
   * Demo reviewer evaluation helper: toggles subscription status directly in DB
   */
  public static async toggleDemoSubscription(targetStatus?: 'ACTIVE' | 'INACTIVE', userId: string = ENV.DEMO_USER_ID) {
    let user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: ENV.DEMO_USER_EMAIL,
          name: 'Demo Reviewer',
          subscriptionStatus: 'INACTIVE',
        },
      });
    }

    const nextStatus = targetStatus ?? (user.subscriptionStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: nextStatus,
        updatedAt: new Date(),
      },
    });

    return {
      userId: updated.id,
      email: updated.email,
      isSubscribed: updated.subscriptionStatus === 'ACTIVE',
      subscriptionStatus: updated.subscriptionStatus,
    };
  }
}
