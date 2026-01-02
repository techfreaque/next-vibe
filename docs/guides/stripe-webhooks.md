# Stripe Webhook Setup Guide

Complete guide for setting up and testing Stripe webhooks in NextVibe applications.

---

## Overview

Stripe webhooks notify your application about events that happen in your Stripe account (payments, subscriptions, refunds, etc.). NextVibe provides built-in CLI support for local webhook testing.

---

## Local Development Setup

### 1. Install Stripe CLI

The `vibe` CLI includes automatic Stripe CLI management:

```bash
# Check if Stripe CLI is installed
vibe stripe check

# Install Stripe CLI (if needed)
vibe stripe install

# Login to Stripe
vibe stripe login
```

### 2. Start Webhook Forwarding

```bash
# Start listening for webhooks (auto-updates .env)
vibe stripe listen

# Or specify custom port
vibe stripe listen --port=3001

# Listen for specific events only
vibe stripe listen --events=payment_intent.succeeded,customer.subscription.updated
```

This command:

- ✅ Forwards Stripe webhooks to your local server
- ✅ Automatically updates `STRIPE_WEBHOOK_SECRET` in your `.env` file
- ✅ Displays webhook events in real-time
- ✅ No manual ngrok setup required

### 3. Test Webhooks Locally

With `vibe stripe listen` running, trigger test events:

```bash
# In another terminal
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

Your local server receives the webhook events automatically.

---

## Production Deployment

### 1. Configure Webhook Endpoint

In the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):

1. Click **"Add endpoint"**
2. Enter your production URL: `https://yourdomain.com/api/en-GLOBAL/payment/providers/stripe/webhooks`
3. Select events to listen for (or select "Send all events")
4. Click **"Add endpoint"**

### 2. Set Environment Variable

Copy the webhook signing secret from the Stripe Dashboard:

```bash
# In your production environment
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Never commit webhook secrets to version control.**

### 3. Verify Setup

1. Go to Stripe Dashboard → Webhooks
2. Click on your endpoint
3. Click **"Send test webhook"**
4. Check your application logs for successful receipt

---

## Webhook Endpoint Implementation

NextVibe automatically handles Stripe webhooks at:

```
POST /api/en-GLOBAL/payment/providers/stripe/webhooks
```

The endpoint:

- ✅ Verifies webhook signatures
- ✅ Handles event processing
- ✅ Returns proper HTTP status codes
- ✅ Logs all webhook events

**See implementation:**

- `src/app/api/[locale]/payment/providers/stripe/webhooks/route.ts`

---

## Troubleshooting

### Webhook Secret Not Found

```bash
# Error: STRIPE_WEBHOOK_SECRET not set

# Solution 1: Run stripe listen (local dev)
vibe stripe listen

# Solution 2: Set manually in .env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhook Signature Verification Failed

```bash
# Error: Webhook signature verification failed

# Solution: Ensure correct secret is set
# Local: Should start with "whsec_test_"
# Production: Should start with "whsec_"
```

### Webhooks Not Received

**Local Development:**

```bash
# 1. Ensure stripe listen is running
vibe stripe listen

# 2. Check server is running
vibe dev

# 3. Verify port matches
# stripe listen forwards to http://localhost:3000 by default
```

**Production:**

```bash
# 1. Check endpoint URL in Stripe Dashboard
# Should be: https://yourdomain.com/api/en-GLOBAL/payment/providers/stripe/webhooks

# 2. Verify HTTPS is enabled
# Stripe requires HTTPS for production webhooks

# 3. Check application logs for errors
```

---

## Best Practices

### 1. Event Handling

```typescript
// Handle events idempotently
// Stripe may send the same event multiple times
if (await isEventProcessed(event.id)) {
  return success({ message: "Event already processed" });
}

await processEvent(event);
await markEventAsProcessed(event.id);
```

### 2. Security

- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Never expose webhook secrets
- ✅ Log all webhook events for debugging
- ✅ Handle webhook failures gracefully

### 3. Event Types

Common Stripe webhook events:

```typescript
// Payment events
payment_intent.succeeded;
payment_intent.payment_failed;

// Subscription events
customer.subscription.created;
customer.subscription.updated;
customer.subscription.deleted;

// Invoice events
invoice.payment_succeeded;
invoice.payment_failed;

// Refund events
charge.refunded;
```

---

## CLI Reference

```bash
# Check Stripe CLI status
vibe stripe check

# Install Stripe CLI
vibe stripe install

# Login to Stripe
vibe stripe login

# Start webhook forwarding
vibe stripe listen

# Custom port
vibe stripe listen --port=3001

# Specific events
vibe stripe listen --events=payment_intent.succeeded

# Get CLI status
vibe stripe status

# Skip SSL verification (local dev only)
vibe stripe listen --skip-ssl-verify
```

---

## Additional Resources

- **[Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)** - Official Stripe webhook guide
- **[Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)** - Stripe CLI reference
- **[Payment Patterns](../patterns/payment.md)** - NextVibe payment integration patterns (if available)
- **[Debugging Guide](./debugging.md)** - General debugging techniques

---

## Quick Checklist

**Local Development:**

- [ ] Stripe CLI installed (`vibe stripe check`)
- [ ] Logged in to Stripe (`vibe stripe login`)
- [ ] Webhook forwarding active (`vibe stripe listen`)
- [ ] Dev server running (`vibe dev`)
- [ ] `.env` has `STRIPE_WEBHOOK_SECRET`

**Production:**

- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Production URL is HTTPS
- [ ] Environment variable `STRIPE_WEBHOOK_SECRET` set
- [ ] Webhook events selected
- [ ] Test webhook sent successfully
- [ ] Application logs show webhook receipt

---

**Need help?** See [Debugging Guide](./debugging.md) or check [GitHub Issues](https://github.com/techfreaque/next-vibe/issues).
