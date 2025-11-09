import * as functions from 'firebase-functions';
import * as cors from 'cors';
import { getUserFromRequest, db } from './auth';
import { createCheckoutSessionHandler, createBillingPortalSessionHandler, stripeWebhookHandler } from './stripe';
import { runFreeAnalysis, runProAnalysis } from './openaiClient';

const corsHandler = cors({ origin: true });

export const createCheckoutSession = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
    try {
      const decoded = await getUserFromRequest(req);
      const { priceId } = req.body || {};
      const result = await createCheckoutSessionHandler(decoded.uid, priceId);
      res.json(result);
    } catch (e: any) {
      console.error(e);
      res.status(400).send(e.message || 'Error creating checkout session');
    }
  });
});

export const createBillingPortalSession = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
    try {
      const decoded = await getUserFromRequest(req);
      const result = await createBillingPortalSessionHandler(decoded.uid);
      res.json(result);
    } catch (e: any) {
      console.error(e);
      res.status(400).send(e.message || 'Error creating billing portal session');
    }
  });
});

export const getSubscriptionStatus = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'GET') return res.status(405).send('Method not allowed');
    try {
      const decoded = await getUserFromRequest(req);
      const userRef = db.collection('users').doc(decoded.uid);
      const snap = await userRef.get();
      const data = snap.data() || {};
      res.json({
        isPro: !!data.isPro,
        plan: data.plan || null,
        status: data.subscriptionStatus || null
      });
    } catch (e: any) {
      console.error(e);
      res.status(400).send(e.message || 'Error fetching subscription');
    }
  });
});

// Basic free daily rate limiting via Firestore counter
export const auraFree = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
    try {
      const decoded = await getUserFromRequest(req);
      const { input } = req.body || {};
      if (!input || typeof input !== 'string') {
        return res.status(400).send('Invalid input');
      }

      const userRef = db.collection('users').doc(decoded.uid);
      await db.runTransaction(async (tx) => {
        const doc = await tx.get(userRef);
        const data = doc.data() || {};
        const today = new Date().toISOString().slice(0, 10);
        const lastDay = data.freeDay || '';
        let count = data.freeCount || 0;

        if (lastDay !== today) {
          count = 0;
        }
        if (count >= 5) {
          throw new Error('Free limit reached for today. Upgrade to Aura Pro.');
        }

        tx.set(
          userRef,
          { freeDay: today, freeCount: count + 1 },
          { merge: true }
        );
      });

      const output = await runFreeAnalysis(input);
      res.json({ output });
    } catch (e: any) {
      console.error(e);
      res.status(400).send(e.message || 'Error running free analysis');
    }
  });
});

// Pro-only
export const auraPro = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
    try {
      const decoded = await getUserFromRequest(req);
      const userRef = db.collection('users').doc(decoded.uid);
      const snap = await userRef.get();
      const data = snap.data() || {};
      if (!data.isPro) {
        return res.status(403).send('Requires Aura Pro subscription');
      }

      const { input } = req.body || {};
      if (!input || typeof input !== 'string') {
        return res.status(400).send('Invalid input');
      }

      const output = await runProAnalysis(input);
      res.json({ output });
    } catch (e: any) {
      console.error(e);
      res.status(400).send(e.message || 'Error running pro analysis');
    }
  });
});

// Stripe webhook (no CORS, raw body)
export const stripeWebhook = functions.https.onRequest((req, res) => {
  // rawBody is handled by Firebase; do not use cors here.
  stripeWebhookHandler(req, res);
});
