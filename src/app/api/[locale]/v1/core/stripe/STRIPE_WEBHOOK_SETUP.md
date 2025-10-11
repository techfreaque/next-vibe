# Stripe Webhook Setup Guide

## Critical Issue: Webhook Secret Configuration

The payment flow is currently failing because the Stripe webhook secret in `.env` is a placeholder value. This guide will help you set up proper webhook handling for production.

## Steps to Fix Webhook Issues

### 1. Get Real Webhook Secret from Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint** or select existing endpoint
4. Set the endpoint URL to: `https://yourdomain.com/api/en-GLOBAL/v1/payment/webhook/stripe`
5. Select the following events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.created`
   - `customer.updated`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `checkout.session.completed`
6. Click **Add endpoint**
7. Click on the webhook endpoint you just created
8. In the **Signing secret** section, click **Reveal** and copy the secret (starts with `whsec_`)

### 2. Update Environment Variables

Replace the placeholder webhook secret in your `.env` file:

```bash
# Replace this placeholder:
STRIPE_WEBHOOK_SECRET="whsec_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

# With your real webhook secret:
STRIPE_WEBHOOK_SECRET="whsec_your_real_webhook_secret_here"
```

### 3. For Local Development

For local testing, you can use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/en-GLOBAL/v1/payment/webhook/stripe

# This will output a webhook secret like: whsec_1234...
# Use this secret in your local .env file
```

### 4. Production Deployment

1. Set the real webhook secret in your production environment variables
2. Ensure your webhook endpoint is publicly accessible
3. Test webhook delivery in Stripe Dashboard

## Current Issues Fixed

✅ **Schema Import Error**: Fixed missing `selectOnboardingSchema` import
✅ **Webhook Handler**: Improved error handling and logging
✅ **TypeScript Errors**: Fixed subscription property access
✅ **Production Readiness**: Added proper validation and error responses

## Remaining Tasks

🔄 **Webhook Secret**: Replace placeholder with real secret from Stripe Dashboard
🔄 **Test Webhooks**: Verify webhook delivery after secret update
🔄 **Monitor Logs**: Check application logs for successful webhook processing

## Testing the Fix

After updating the webhook secret:

1. Create a test subscription in your application
2. Check Stripe Dashboard → Webhooks → [Your Endpoint] → Recent deliveries
3. Verify webhooks are being delivered successfully (200 status)
4. Check your application logs for successful webhook processing

## Security Notes

- Never commit real webhook secrets to version control
- Use environment variables for all sensitive configuration
- Regularly rotate webhook secrets for security
- Monitor webhook delivery for any failures

## Support

If you continue to experience issues:

1. Check Stripe Dashboard webhook logs
2. Review application server logs
3. Verify webhook endpoint is publicly accessible
4. Ensure webhook secret matches exactly (no extra spaces/characters)
