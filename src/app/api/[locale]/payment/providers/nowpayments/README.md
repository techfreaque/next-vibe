# NOWPayments Provider Implementation

Production-ready cryptocurrency payment provider with **full subscription support** and Stripe-compatible interface for seamless drop-in integration.

## Overview

NOWPayments is a crypto payment gateway that supports Bitcoin, Ethereum, and 150+ other cryptocurrencies. This implementation provides a unified interface compatible with Stripe, allowing you to easily switch between payment providers or offer both options to users.

## Features

### ✅ Fully Implemented

- **Stripe-Compatible Interface**: Implements the same `PaymentProvider` interface as Stripe
- **✨ Recurring Subscriptions**: Full support for monthly and yearly crypto subscriptions
- **One-Time Payments**: Invoice creation for one-time crypto payments
- **Subscription Management**: Create, retrieve, cancel, and list subscriptions
- **Webhook Verification**: Secure HMAC-SHA512 signature verification
- **Payment Status Tracking**: Real-time payment status updates via IPN webhooks
- **Multi-Currency Support**: Accepts payments in USD, EUR, PLN
- **Email-Based Subscriptions**: Customers receive payment links via email
- **Constant-Time Signature Comparison**: Prevents timing attacks
- **Error Handling**: Comprehensive error handling with i18n support
- **Multi-Language Support**: English, German, and Polish translations

### 📝 Implementation Notes

- **Email Subscriptions**: NOWPayments uses an email-based recurring payment system
- **Payment Links**: Users receive payment links via email before each billing cycle
- **No Customer Portal**: Unlike Stripe, NOWPayments handles payments via email links

## Architecture

### File Structure

```
src/app/api/[locale]/payment/providers/nowpayments/
├── repository.ts           # Main provider implementation
├── webhook/
│   └── route.ts           # Webhook endpoint handler
└── i18n/
    ├── en/
    │   └── index.ts       # English translations
    ├── de/
    │   └── index.ts       # German translations
    └── pl/
        └── index.ts       # Polish translations
```

### Provider Interface

The `NOWPaymentsProvider` class implements the `PaymentProvider` interface with the following methods:

```typescript
interface PaymentProvider {
  name: string;
  ensureCustomer(userId, email, name, logger): Promise<CustomerResult>;
  createCheckoutSession(params, customerId, logger): Promise<CheckoutSessionResult>;
  verifyWebhook(body, signature, logger): Promise<WebhookEvent>;
  retrieveSubscription(subscriptionId, logger): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId, logger): Promise<void>;
}
```

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# NOWPayments Configuration
NOWPAYMENTS_API_KEY="your_api_key_here"
NOWPAYMENTS_IPN_SECRET="your_ipn_secret_here"
```

### Getting API Credentials

1. Sign up at [NOWPayments.io](https://nowpayments.io)
2. Go to Settings → API Keys
3. Generate a new API key
4. Copy the API key to `NOWPAYMENTS_API_KEY`
5. Copy the IPN secret to `NOWPAYMENTS_IPN_SECRET`

### Webhook Configuration

Configure your IPN webhook URL in NOWPayments dashboard:

```
Production: https://yourdomain.com/api/en-GLOBAL/payment/providers/nowpayments/webhook
Development: http://localhost:3000/api/en-GLOBAL/payment/providers/nowpayments/webhook
```

**Note**: For local development, use a tunneling service like ngrok to expose your localhost.

## Usage

### Creating a One-Time Payment

```typescript
import { getPaymentProvider } from "@/app/api/[locale]/payment/providers";

// Get NOWPayments provider
const provider = getPaymentProvider("nowpayments");

// Create one-time payment invoice
const result = await provider.createCheckoutSession(
  {
    userId: "user_123",
    productId: "credit_pack",
    interval: "one_time",
    country: "GLOBAL",
    locale: "en-GLOBAL",
    successUrl: "https://example.com/success",
    cancelUrl: "https://example.com/cancel",
    metadata: {
      type: "credit_pack",
      credits: "100",
    },
  },
  customerId,
  logger,
);

if (result.success) {
  // Redirect user to checkout URL
  console.log("Checkout URL:", result.data.checkoutUrl);
}
```

### Creating a Subscription

```typescript
// Create monthly subscription
const subscriptionResult = await provider.createCheckoutSession(
  {
    userId: "user_123",
    productId: "subscription",
    interval: "month", // or "year" for annual
    country: "GLOBAL",
    locale: "en-GLOBAL",
    successUrl: "https://example.com/subscription/success",
    cancelUrl: "https://example.com/subscription/cancel",
    metadata: {
      type: "subscription",
      plan: "premium",
    },
  },
  customerId,
  logger,
);

if (subscriptionResult.success) {
  // Subscription created successfully
  // User will receive payment links via email
  console.log("Subscription ID:", subscriptionResult.data.sessionId);
}
```

**How Subscriptions Work**:

1. System creates a subscription plan with billing interval (30 or 365 days)
2. System creates an email subscription for the user
3. User receives initial payment link via email
4. Before each billing cycle, user receives a new payment link
5. Payment links expire after a set period

### Managing Subscriptions

```typescript
// Retrieve subscription details
const subscription = await provider.retrieveSubscription(subscriptionId, logger);

if (subscription.success) {
  console.log("Current Period:", {
    start: new Date(subscription.data.currentPeriodStart!),
    end: new Date(subscription.data.currentPeriodEnd!),
  });
}

// Cancel subscription
const cancelResult = await provider.cancelSubscription(subscriptionId, logger);

// List all subscriptions
const subscriptions = await provider.listSubscriptions(
  {
    status: "ACTIVE",
    is_active: true,
    limit: 10,
  },
  logger,
);
```

### Webhook Handling

Webhooks are automatically processed through the unified payment repository:

```typescript
// Webhook route automatically calls paymentRepository.handleWebhook()
POST / api / [locale] / payment / providers / nowpayments / webhook;
```

The webhook handler:

1. Verifies HMAC-SHA512 signature
2. Checks for duplicate events (idempotency)
3. Maps NOWPayments status to generic event types
4. Delegates to credit/subscription modules
5. Updates payment transaction status

### Payment Status Mapping

| NOWPayments Status | One-Time Payment Event          | Subscription Payment Event      | Description                  |
| ------------------ | ------------------------------- | ------------------------------- | ---------------------------- |
| `waiting`          | `payment_intent.created`        | `payment_intent.created`        | Waiting for crypto payment   |
| `confirming`       | `payment_intent.processing`     | `payment_intent.processing`     | Confirming blockchain tx     |
| `confirmed`        | `payment_intent.processing`     | `payment_intent.processing`     | Blockchain confirmed         |
| `sending`          | `payment_intent.processing`     | `payment_intent.processing`     | Sending funds to merchant    |
| `finished`         | `checkout.session.completed`    | `invoice.payment_succeeded`     | Payment complete             |
| `partially_paid`   | `payment_intent.processing`     | `payment_intent.processing`     | Underpaid (waiting for more) |
| `failed`           | `payment_intent.payment_failed` | `payment_intent.payment_failed` | Payment failed               |
| `refunded`         | `charge.refunded`               | `charge.refunded`               | Payment refunded             |
| `expired`          | `payment_intent.canceled`       | `payment_intent.canceled`       | Payment session expired      |

## API Reference

### NOWPaymentsProvider Methods

#### `ensureCustomer(userId, email, name, logger)`

Ensures customer exists. Since NOWPayments doesn't have customer objects, this returns the userId as customerId.

**Returns**: `ResponseType<CustomerResult>`

#### `createCheckoutSession(params, customerId, logger)`

Creates a crypto payment invoice or subscription via NOWPayments API.

**Parameters**:

- `params.userId`: User ID
- `params.productId`: Product identifier
- `params.interval`: "one_time", "month", or "year"
- `params.country`: Country code for pricing
- `params.locale`: Locale for translations
- `params.successUrl`: Redirect URL after success
- `params.cancelUrl`: Redirect URL if cancelled
- `params.metadata`: Additional metadata

**Returns**: `ResponseType<CheckoutSessionResult>`

**For One-Time Payments**:

- Gets product pricing from products repository
- Creates invoice with NOWPayments API
- Returns checkout URL for user redirection
- Stores metadata for webhook processing

**For Subscriptions**:

- Creates a subscription plan with the specified interval
- Creates an email subscription for the user
- User receives payment links via email before each billing cycle
- Returns subscription ID as sessionId

#### `verifyWebhook(body, signature, logger)`

Verifies webhook signature using HMAC-SHA512.

**Parameters**:

- `body`: Raw request body (string)
- `signature`: `x-nowpayments-sig` header value
- `logger`: Endpoint logger

**Returns**: `ResponseType<WebhookEvent>`

**Security Features**:

- HMAC-SHA512 signature verification
- Constant-time string comparison
- Prevents timing attacks

#### `retrieveSubscription(subscriptionId, logger)`

Retrieves subscription information from NOWPayments.

**Parameters**:

- `subscriptionId`: NOWPayments subscription ID
- `logger`: Endpoint logger

**Returns**: `ResponseType<{ userId, currentPeriodStart?, currentPeriodEnd? }>`

**Features**:

- Fetches subscription details and plan information
- Calculates current billing period dates
- Returns subscription status and next payment date

#### `cancelSubscription(subscriptionId, logger)`

Cancels a NOWPayments subscription (deletes recurring payment).

**Parameters**:

- `subscriptionId`: NOWPayments subscription ID
- `logger`: Endpoint logger

**Returns**: `ResponseType<void>`

**Note**: Once canceled, the user will no longer receive payment links.

#### `listSubscriptions(filters, logger)`

Lists all subscriptions with optional filtering.

**Parameters**:

- `filters.status`: Filter by status ("PAID", "UNPAID", "ACTIVE", "INACTIVE", "CANCELLED")
- `filters.subscription_plan_id`: Filter by plan ID
- `filters.is_active`: Filter by active status
- `filters.limit`: Maximum results
- `filters.offset`: Pagination offset
- `logger`: Endpoint logger

**Returns**: `ResponseType<NOWPaymentsSubscription[]>`

**Use Cases**:

- Monitoring active subscriptions
- Finding subscriptions by status
- Administrative subscription management

#### `getPaymentStatus(paymentId, logger)`

Gets current payment status from NOWPayments API.

**Parameters**:

- `paymentId`: NOWPayments payment ID
- `logger`: Endpoint logger

**Returns**: `ResponseType<NOWPaymentsPaymentStatus>`

**Use Cases**:

- Manual status checks
- Debugging payment issues
- Status polling (if webhooks fail)

## Database Schema

The existing payment schema supports NOWPayments through the `provider` field:

```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  provider_session_id TEXT,           -- NOWPayments invoice ID
  provider_payment_intent_id TEXT,    -- NOWPayments payment ID
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,               -- PENDING, SUCCEEDED, FAILED, etc.
  provider TEXT NOT NULL,             -- "nowpayments"
  mode TEXT NOT NULL,                 -- "payment" (always for NOWPayments)
  metadata JSONB,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

## Error Handling

All errors follow the i18n translation pattern:

```typescript
// English (en)
"app.api.payment.providers.nowpayments.errors.invoiceCreationFailed.title";

// German (de)
"app.api.payment.providers.nowpayments.errors.invoiceCreationFailed.title";

// Polish (pl)
"app.api.payment.providers.nowpayments.errors.invoiceCreationFailed.title";
```

### Common Error Types

| Error Type                  | Description                          |
| --------------------------- | ------------------------------------ |
| `userNotFound`              | User does not exist                  |
| `customerCreationFailed`    | Failed to ensure customer            |
| `productNotFound`           | Product not found in repository      |
| `subscriptionsNotSupported` | Attempted recurring subscription     |
| `invoiceCreationFailed`     | Failed to create NOWPayments invoice |
| `webhookVerificationFailed` | Invalid webhook signature            |
| `paymentStatusFailed`       | Failed to get payment status         |

## Testing

### Local Testing with Webhooks

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Use ngrok to expose your local server:

   ```bash
   ngrok http 3000
   ```

3. Configure webhook URL in NOWPayments dashboard:

   ```
   https://your-ngrok-url.ngrok.io/api/en-GLOBAL/payment/providers/nowpayments/webhook
   ```

4. Create a test payment and monitor webhook events

### Testing Payment Flow

```typescript
// 1. Create checkout session
const session = await provider.createCheckoutSession(params, customerId, logger);

// 2. User completes payment on NOWPayments checkout page
// 3. Webhook is triggered
// 4. Payment status updated in database
// 5. Credits added to user account (via credits module)
```

## Production Checklist

- [ ] Add `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET` to production environment
- [ ] Configure production webhook URL in NOWPayments dashboard
- [ ] Test webhook delivery and signature verification
- [ ] Monitor payment transactions in database
- [ ] Set up error alerting for failed webhooks
- [ ] Configure payout wallet in NOWPayments dashboard
- [ ] Test with small amounts before going live

## Security Considerations

### Webhook Security

- **HMAC-SHA512 Verification**: All webhooks verified with cryptographic signature
- **Constant-Time Comparison**: Prevents timing attacks on signature verification
- **Idempotency**: Duplicate webhooks detected and ignored
- **Raw Body Required**: Signature verification requires raw request body

### API Key Security

- **Never commit API keys to version control**
- Store in environment variables only
- Use different keys for development and production
- Rotate keys periodically

## Comparison: NOWPayments vs Stripe

| Feature                 | Stripe                                | NOWPayments                 |
| ----------------------- | ------------------------------------- | --------------------------- |
| Payment Methods         | Cards, Bank Transfer, Digital Wallets | Cryptocurrency (150+ coins) |
| Recurring Subscriptions | ✅ Yes (Automatic)                    | ✅ Yes (Email-based)        |
| One-Time Payments       | ✅ Yes                                | ✅ Yes                      |
| Subscription Management | ✅ Full API                           | ✅ Full API                 |
| Customer Portal         | ✅ Yes                                | ❌ No (Email links)         |
| Refunds                 | ✅ Yes                                | ⚠️ Manual                   |
| Invoice Creation        | ✅ Yes                                | ✅ Yes                      |
| Webhook Support         | ✅ Yes                                | ✅ Yes (IPN)                |
| Multi-Currency          | ✅ Yes (Fiat)                         | ✅ Yes (Crypto + Fiat)      |
| Transaction Fees        | 2.9% + $0.30                          | 0.4% - 1.0%                 |
| Settlement Time         | 2-7 days                              | Same day (< 5 min avg)      |
| Payment Flow            | On-site checkout                      | Invoice URL or Email link   |

## Troubleshooting

### Webhook Not Received

1. Check webhook URL is correctly configured in NOWPayments dashboard
2. Verify IPN secret is correct
3. Check server logs for errors
4. Ensure endpoint is publicly accessible
5. Test with NOWPayments webhook testing tool

### Signature Verification Failed

1. Verify `NOWPAYMENTS_IPN_SECRET` matches dashboard
2. Ensure raw body is being passed (not parsed JSON)
3. Check for any middleware modifying request body
4. Verify header is `x-nowpayments-sig`

### Payment Status Not Updating

1. Check webhook is being received
2. Verify webhook signature passes
3. Check database for payment transaction record
4. Review logs for webhook processing errors
5. Manually fetch payment status using `getPaymentStatus()`

## Subscription Flow Details

### How Email Subscriptions Work

1. **Plan Creation**: System creates a subscription plan with:
   - Title (e.g., "subscription_month")
   - Billing interval (30 or 365 days)
   - Price and currency
   - Callback URLs

2. **Subscription Creation**: System creates email subscription with:
   - Plan ID
   - Customer email
   - Automatic email notifications enabled

3. **Payment Cycle**:
   - Initial payment link sent immediately to customer's email
   - Before each billing cycle (1 day prior), customer receives new payment link
   - Customer completes payment via the link
   - Webhook notification sent to your system
   - Subscription continues automatically

4. **Subscription Management**:
   - Retrieve subscription details and status
   - Cancel subscription to stop future payments
   - List all active subscriptions
   - Monitor subscription health

## Future Enhancements

### Potential Features

- [ ] Add support for partially paid invoices
- [ ] Implement payment status polling fallback
- [ ] Add currency conversion display
- [ ] Support for custom payment timeouts
- [ ] Add payment dispute handling
- [ ] Implement refund workflow (via NOWPayments support)
- [ ] Add subscription plan caching to avoid duplicate plans

## References

- [NOWPayments Official Documentation](https://documenter.getpostman.com/view/7907941/2s93JusNJt)
- [NOWPayments API Guide](https://nowpayments.io/blog/nowpayments-api-explained-customize-your-payment-gateway)
- [NOWPayments Integration Guide](https://nowpayments.io/blog/integration-guide)
- [Stripe Provider Implementation](../stripe/repository.ts)
- [Payment Provider Interface](../types.ts)

## Support

For issues specific to:

- **NOWPayments API**: Contact NOWPayments support
- **Implementation**: Check logs and webhook events
- **Integration**: Review this documentation and test with small amounts

## License

This implementation is part of the next-vibe project and follows the same license.

---

**Note**: Always test payment integrations thoroughly in a sandbox/test environment before deploying to production. Start with small amounts to verify the complete payment flow works as expected.
