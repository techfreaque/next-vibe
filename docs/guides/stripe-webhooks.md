# Stripe Webhook Setup Guide

## Steps to Fix Webhook Issues

### 1. For Local Development

For local testing, you can use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
vibe stripe listen

# This will automatically update your .env file with the webhook secret
```

### 2. Production Deployment

1. Set the real webhook secret in your production environment variables
2. Ensure your webhook endpoint is publicly accessible
3. Test webhook delivery in Stripe Dashboard
