import request from 'supertest';
import app from '../src/app';
import { StripeService, stripe } from '../src/services/stripe.service';

jest.mock('../src/services/stripe.service');

describe('StripeController Endpoints & Webhooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/stripe/create-checkout-session', () => {
    it('generates a Stripe checkout session with URL and ID', async () => {
      (StripeService.createCheckoutSession as jest.Mock).mockResolvedValueOnce({
        sessionId: 'cs_test_mock_123',
        url: 'https://checkout.stripe.com/c/pay/cs_test_mock_123',
      });

      const res = await request(app).post('/api/stripe/create-checkout-session');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sessionId).toBe('cs_test_mock_123');
      expect(res.body.data.url).toContain('https://checkout.stripe.com');
    });

    it('handles checkout session failure gracefully', async () => {
      (StripeService.createCheckoutSession as jest.Mock).mockRejectedValueOnce(
        new Error('Stripe API rate limit')
      );

      const res = await request(app).post('/api/stripe/create-checkout-session');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('STRIPE_CHECKOUT_FAILED');
    });
  });

  describe('POST /api/stripe/webhook', () => {
    it('returns 400 if stripe-signature header is absent', async () => {
      const res = await request(app).post('/api/stripe/webhook').send({ id: 'evt_123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('MISSING_SIGNATURE');
    });

    it('returns 400 if stripe-signature is invalid', async () => {
      const constructEventSpy = jest
        .spyOn(stripe.webhooks, 'constructEvent')
        .mockImplementation(() => {
          throw new Error('Invalid signature signature');
        });

      const res = await request(app)
        .post('/api/stripe/webhook')
        .set('stripe-signature', 'bad_signature')
        .send({ type: 'checkout.session.completed' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_SIGNATURE');
      constructEventSpy.mockRestore();
    });

    it('processes valid webhook event and updates user state', async () => {
      const mockEvent = {
        id: 'evt_test_1',
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'demo-user-1',
            customer: 'cus_12345',
            subscription: 'sub_12345',
          },
        },
      };

      const constructEventSpy = jest
        .spyOn(stripe.webhooks, 'constructEvent')
        .mockReturnValue(mockEvent as any);

      (StripeService.handleWebhookEvent as jest.Mock).mockResolvedValueOnce(undefined);

      const res = await request(app)
        .post('/api/stripe/webhook')
        .set('stripe-signature', 'valid_signature')
        .send(mockEvent);

      expect(res.status).toBe(200);
      expect(res.body.received).toBe(true);
      expect(StripeService.handleWebhookEvent).toHaveBeenCalledWith(mockEvent);
      constructEventSpy.mockRestore();
    });
  });

  describe('POST /api/stripe/toggle-demo-status', () => {
    it('successfully toggles subscription status', async () => {
      (StripeService.toggleDemoSubscription as jest.Mock).mockResolvedValueOnce({
        userId: 'demo-user-1',
        email: 'demo@example.com',
        isSubscribed: true,
        subscriptionStatus: 'ACTIVE',
      });

      const res = await request(app)
        .post('/api/stripe/toggle-demo-status')
        .send({ status: 'ACTIVE' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isSubscribed).toBe(true);
      expect(res.body.data.subscriptionStatus).toBe('ACTIVE');
    });
  });
});
