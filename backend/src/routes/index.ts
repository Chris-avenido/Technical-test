import { Router, Request, Response } from 'express';
import { ProductController } from '../controllers/product.controller';
import { StripeController } from '../controllers/stripe.controller';
import { UserController } from '../controllers/user.controller';

const router = Router();

// Health Check
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Products & Search
router.get('/products/search', ProductController.search);
router.get('/products/:code', ProductController.getByCode);

// Stripe & Subscriptions
router.post('/stripe/create-checkout-session', StripeController.createCheckoutSession);
router.post('/stripe/webhook', StripeController.handleWebhook);
router.get('/stripe/status', StripeController.getStatus);
router.post('/stripe/toggle-demo-status', StripeController.toggleDemoStatus);

// User & History
router.get('/user/searches', UserController.getRecentSearches);
router.get('/user/profile', UserController.getProfile);

export default router;
