# Credits System

> **Part of NextVibe Framework** (GPL-3.0) - Located in `src/app/api/[locale]/v1/core/credits/`

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
// Example costs
AI Chat (GPT-4): 10 credits per message
AI Chat (GPT-3.5): 1 credit per message
Web Search: 1 credit per search
Text-to-Speech: 5 credits per minute
Speech-to-Text: 3 credits per minute
```

## For Developers

### Adding Credits to Endpoints

```typescript
// In your definition.ts
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "my-feature"],
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

**user_credits** - Current credit balance per user

```typescript
{
  id: uuid,
  userId: uuid,
  amount: number,
  type: "subscription" | "permanent" | "free",
  expiresAt: timestamp | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**credit_transactions** - Full audit log

```typescript
{
  id: uuid,
  userId: uuid | null,
  leadId: uuid | null,
  amount: number, // Negative for deductions
  balanceAfter: number,
  type: "purchase" | "subscription" | "usage" | "expiry" | "free_tier",
  modelId: string | null,
  messageId: uuid | null,
  createdAt: timestamp
}
```

## API Endpoints

### Get Credit Balance

```bash
GET /api/v1/core/credits
```

Returns current credit balance and breakdown by type.

### Purchase Credits

```bash
POST /api/v1/core/credits/purchase
{
  "packSize": 500,
  "paymentMethod": "stripe"
}
```

### Credit History

```bash
GET /api/v1/core/credits/history?limit=50&offset=0
```

Returns transaction history with filters.

## React Hooks

```typescript
import { useCredits } from '@/app/api/[locale]/v1/core/credits/hooks';

function MyComponent() {
  const { data: credits, isLoading } = useCredits();
  
  return (
    <div>
      <p>Balance: {credits?.total} credits</p>
      <p>Free: {credits?.free}</p>
      <p>Paid: {credits?.paid}</p>
      <p>Subscription: {credits?.subscription}</p>
    </div>
  );
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

## Best Practices

### For Developers

1. **Set Appropriate Costs**
   - Free features: `credits: 0`
   - Cheap features: `credits: 1-5`
   - Expensive features: `credits: 10+`

2. **Display Costs Upfront**
   - Show credit cost before execution
   - Warn if user doesn't have enough
   - Suggest purchasing more credits

3. **Handle Insufficient Credits**
   - Check balance before execution
   - Return clear error message
   - Provide purchase link

4. **Track Usage**
   - Log all credit transactions
   - Include context (modelId, messageId)
   - Enable usage analytics

### For Users

1. **Monitor Your Balance**
   - Check credits regularly
   - Set up low-balance alerts
   - Purchase before running out

2. **Optimize Usage**
   - Use cheaper models when possible
   - Batch operations to save credits
   - Use free features when available

3. **Purchase Strategy**
   - Buy larger packs for better value
   - Consider subscription for heavy usage
   - Free tier good for testing

## Troubleshooting

**"Insufficient credits" error**:

- Check your balance
- Purchase more credits
- Wait for subscription renewal

**Credits not deducted**:

- Check transaction log
- Verify operation completed
- Contact support if issue persists

**Credits expired**:

- Only subscription credits expire
- Check expiry date in balance
- Renew subscription to restore
