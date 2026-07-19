# Credits System

> **Part of NextVibe Framework** (GPL-3.0) - Located in `src/credits/`

**Pay-Per-Use Credit Management**

## What Is This?

The Credits System manages user credits for paid features like:

- AI model usage (GPT-4, Claude, etc.)
- Tool executions (web search, data processing)
- Premium features

## How It Works

### For Users

**Free Tier**:

- 20 one-time credits per lead (shared across devices)
- No account required
- Expires never

**Paid Credits**:

- Pay-as-you-go model but requires subscription
- Buy credit packs (€5 = 500 credits)
- Purchase multiple packs
- Permanent credits (never expire)

**Subscription Credits**:

- Monthly credit allocation
- Expires at end of billing period
- Auto-renews with subscription

### Credit Costs

Different features cost different amounts:

```typescript
// Example costs (calculated from centralized pricing)
AI Chat (GPT-4): 10 credits per message
AI Chat (GPT-3.5): 1 credit per message
Web Search: 0.65 credits per search
Text-to-Speech: 0.52 credits per 1000 characters
Speech-to-Text: 0.78 credits per minute (0.013 per second)
```

## For Developers

### Adding Credits to Endpoints

```typescript
// In your definition.ts
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["my-feature"],
  credits: 5, // Cost 5 credits per use
  // ... rest of definition
});
```

### Credit Tracking

Credits are automatically:

1. **Checked** before execution (user must have enough)
2. **Deducted** after successful execution
3. **Logged** in credit_transactions table
4. **Displayed** in UI (before and after)

### Database Schema

Three tables: a **wallet** per owner holds the balance, **packs** hold the actual
purchased/granted credits (so expiry can be tracked per source), and
**transactions** are the immutable audit log.

**credit_wallets** - one wallet per user OR lead (exactly one owner set)

```typescript
{
  id: uuid,
  userId: uuid | null,      // exactly one of userId/leadId set
  leadId: uuid | null,
  balance: number,          // total paid balance (sum of pack remainders)
  freeCreditsRemaining: number,  // free tier; default 20, lead wallets share the pool
  freePeriodStart: timestamp,
  freePeriodId: string,     // e.g. "2026-06" — month bucket for the free reset
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**credit_packs** - purchased/subscription/granted credits, deducted expiring-soonest-first

```typescript
{
  id: uuid,
  walletId: uuid,
  originalAmount: number,
  remaining: number,
  type: CreditPackType,     // subscription | permanent | bonus | earned
  expiresAt: timestamp | null,  // null = never expires
  source: string | null,    // 'stripe_subscription' | 'stripe_purchase' | 'admin_grant' | …
  metadata: jsonb,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**credit_transactions** - Full audit log

```typescript
{
  id: uuid,
  walletId: uuid,
  amount: number,           // Negative for deductions
  balanceAfter: number,
  type: CreditTransactionType,  // purchase | subscription | usage | expiry | free_grant | refund | transfer | referral_earning | referral_payout | …
  modelId: string | null,
  feature: string | null,
  messageId: uuid | null,
  packId: uuid | null,      // which pack the movement hit
  createdAt: timestamp
}
```

## API Endpoints

### Get Credit Balance

```bash
GET /api/credits
```

Returns current credit balance and breakdown by type.

### Purchase Credits

```bash
POST /api/credits/purchase
{
  "packSize": 500,
  "paymentMethod": "stripe"
}
```

### Credit History

```bash
GET /api/credits/history?limit=50&offset=0
```

Returns transaction history with filters.

## React Hooks

`useCredits(user, logger, initialData)` returns the standard endpoint object
(`EndpointReturn`) — read the balance off its `read` query, or `null` when
`initialData` is `null` (the hook is disabled for unauthenticated users). The GET
response fields are `total, expiring, permanent, earned, free, expiresAt, capacity`
(there is no `balance`/`freeCreditsRemaining` field on the response — `total` is the
spendable balance, `free` the remaining free-tier credits).

```typescript
import { useCredits } from '@/credits/hooks';

function MyComponent({ user, logger, initialData }) {
  const credits = useCredits(user, logger, initialData);
  const data = credits?.read.data;

  return <p>Balance: {data?.total} credits (free: {data?.free})</p>;
}
```

## Credit Expiry

**Free Credits**: Never expire
**Paid Credits**: Never expire
**Subscription Credits**: Expire at end of billing period

Expired credits are automatically removed by a background task.

## Lead-Based Credits

For non-authenticated users:

- Credits tied to `leadId` (device fingerprint)
- Multiple users on same device share credits
- 20 free credits per lead
- Can purchase credits without account
