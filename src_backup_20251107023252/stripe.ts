import Stripe from 'stripe';
import * as functions from 'firebase-functions';
import { db } from './auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20'
});

const CLIENT_URL = process.env.CLIENT_URL as string;

export const createCheckoutSessionHandler = async (uid: string, priceId: string) => {
  if (!priceId) throw new Error('Missing priceId');

  // Get or create Stripe customer
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data() || {};

  let customerId = userData.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { firebaseUID: uid }
    });
    customerId = customer.id;
    await userRef.set({ stripeCustomerId: customerId }, { merge: true });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: `${CLIENT_URL}/account?session=success`,
    cancel_url: `${CLIENT_URL}/pricing?canceled=1`,
    metadata: { firebaseUID: uid }
  });

  return { url: session.url };
};

export const createBillingPortalSessionHandler = async (uid: string) => {
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  const data = userSnap.data();

  if (!data?.stripeCustomerId) {
    throw new Error('No Stripe customer found');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: data.stripeCustomerId,
    return_url: `${CLIENT_URL}/account`
  });

  return { url: portalSession.url };
};

// Webhook: updates Firestore isPro
export const stripeWebhookHandler = async (req: functions.https.Request, res: functions.Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;
  try {
    const rawBody = (req as any).rawBody;
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customers = await stripe.customers.list({
        id: customerId,
        limit: 1
      });

      const firebaseUID = customers.data[0]?.metadata?.firebaseUID;
      if (firebaseUID) {
        const isActive =
          subscription.status === 'active' || subscription.status === 'trialing';

        await db.collection('users').doc(firebaseUID).set(
          {
            stripeCustomerId: customerId,
            subscriptionStatus: subscription.status,
            isPro: isActive,
            plan: subscription.items.data[0]?.plan?.id || null,
            currentPeriodEnd: subscription.current_period_end
          },
          { merge: true }
        );
      }
      break;
    }
    default:
      break;
  }

  res.json({ received: true });
};
