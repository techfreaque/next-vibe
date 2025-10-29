# Credits System - Implementation Plan
**Developer Guide for Credits Contributors**

## 🎯 Mission

Provide a robust, scalable credit management system that:
- Tracks user credits across free, paid, and subscription tiers
- Integrates seamlessly with all endpoints via `credits` field
- Provides transparent cost tracking and audit logs
- Supports lead-based credits for non-authenticated users

## 📊 Current Status

### ✅ COMPLETE
- ✅ Database schema (user_credits, credit_transactions)
- ✅ Core repository functions (check, deduct, add credits)
- ✅ API endpoints (balance, purchase, history)
- ✅ React hooks (useCredits, useCreditHistory)
- ✅ Lead-based credits (20 free per lead)
- ✅ Credit expiry system
- ✅ Migration from agent/chat/credits to core/credits

### 🚧 IN PROGRESS
- 🚧 Stripe payment integration
- 🚧 Subscription credit allocation
- 🚧 Low-balance notifications
- 🚧 Usage analytics dashboard

### ❌ TODO
- ❌ Credit gifting system
- ❌ Referral credit bonuses
- ❌ Enterprise credit pools
- ❌ Credit rollover for subscriptions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Endpoint Definition                       │
│  credits: 5  // Cost in credits                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Unified UI System (Executor)                    │
│  1. Check if user has enough credits                        │
│  2. Execute endpoint                                        │
│  3. Deduct credits on success                               │
│  4. Log transaction                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Credits Repository                          │
│  • getUserCredits() - Get current balance                   │
│  • deductCredits() - Deduct and log                         │
│  • addCredits() - Add and log                               │
│  • getTransactionHistory() - Audit log                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                                │
│  • user_credits - Current balances                          │
│  • credit_transactions - Full audit log                     │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Implementation Phases

### Phase 1: Stripe Integration (CURRENT PRIORITY)

**Goal**: Enable credit purchases via Stripe

#### 1.1 Stripe Checkout Session ❌ TODO
**File**: `src/app/api/[locale]/v1/core/credits/purchase/repository.ts`

**Tasks**:
1. Create Stripe checkout session
2. Handle success/cancel webhooks
3. Add credits on successful payment
4. Send confirmation email

**Implementation**:
```typescript
export async function createCheckoutSession(
  userId: string,
  packSize: number,
  locale: CountryLanguage
): Promise<{ sessionId: string; url: string }> {
  // Create Stripe session
  // Return checkout URL
}
```

#### 1.2 Webhook Handler ❌ TODO
**File**: `src/app/api/[locale]/v1/core/credits/purchase/webhook/route.ts`

**Tasks**:
1. Verify Stripe signature
2. Handle checkout.session.completed
3. Add credits to user account
4. Log transaction

#### 1.3 Purchase UI ❌ TODO
**File**: `src/app/[locale]/credits/purchase/page.tsx`

**Tasks**:
1. Display credit pack options
2. Show current balance
3. Redirect to Stripe checkout
4. Handle success/cancel returns

### Phase 2: Subscription Credits (NEXT)

**Goal**: Allocate monthly credits for subscription users

#### 2.1 Subscription Credit Allocation ❌ TODO
**File**: `src/app/api/[locale]/v1/core/credits/subscription/allocate.ts`

**Tasks**:
1. Detect subscription tier
2. Allocate monthly credits
3. Set expiry date (end of billing period)
4. Log allocation transaction

#### 2.2 Subscription Renewal ❌ TODO
**File**: `src/app/api/[locale]/v1/core/credits/subscription/renew.ts`

**Tasks**:
1. Expire old subscription credits
2. Allocate new credits
3. Handle tier changes
4. Send renewal notification

#### 2.3 Subscription Cancellation ❌ TODO
**File**: `src/app/api/[locale]/v1/core/credits/subscription/cancel.ts`

**Tasks**:
1. Stop future allocations
2. Keep current credits until expiry
3. Log cancellation
4. Send confirmation

### Phase 3: Notifications & Analytics (FUTURE)

**Goal**: Keep users informed and provide usage insights

#### 3.1 Low-Balance Notifications ❌ TODO
**Tasks**:
1. Check balance after each deduction
2. Send notification at 20%, 10%, 5%
3. Suggest purchasing more credits
4. Email + in-app notification

#### 3.2 Usage Analytics Dashboard ❌ TODO
**Tasks**:
1. Aggregate credit usage by feature
2. Show spending trends
3. Compare to previous periods
4. Export usage reports

#### 3.3 Cost Optimization Suggestions ❌ TODO
**Tasks**:
1. Analyze usage patterns
2. Suggest cheaper alternatives
3. Recommend subscription if cost-effective
4. Highlight free features

### Phase 4: Advanced Features (FUTURE)

**Goal**: Enterprise and power-user features

#### 4.1 Credit Gifting ❌ TODO
**Tasks**:
1. Transfer credits between users
2. Gift codes for credits
3. Bulk gifting for teams
4. Audit log for gifts

#### 4.2 Referral Bonuses ❌ TODO
**Tasks**:
1. Generate referral codes
2. Track referrals
3. Award credits to referrer
4. Award credits to referee

#### 4.3 Enterprise Credit Pools ❌ TODO
**Tasks**:
1. Shared credit pool for organization
2. Per-user limits within pool
3. Admin dashboard for pool management
4. Usage reports per user

#### 4.4 Credit Rollover ❌ TODO
**Tasks**:
1. Roll over unused subscription credits
2. Set maximum rollover limit
3. Expire rolled-over credits after N months
4. Display rollover balance separately

## 🔧 Technical Debt & Improvements

### High Priority
1. **Add Transaction Idempotency** ❌ TODO
   - Prevent duplicate deductions
   - Use idempotency keys
   - Handle retries gracefully

2. **Optimize Balance Queries** ❌ TODO
   - Cache current balance
   - Invalidate on transaction
   - Use database triggers

3. **Add Credit Holds** ❌ TODO
   - Reserve credits before execution
   - Release on failure
   - Deduct on success

### Medium Priority
4. **Add Credit Bundles** ❌ TODO
   - Package multiple features
   - Discounted pricing
   - Time-limited offers

5. **Add Credit Expiry Warnings** ❌ TODO
   - Warn before subscription credits expire
   - Suggest using before expiry
   - Auto-apply to pending operations

6. **Add Refund System** ❌ TODO
   - Refund credits for failed operations
   - Partial refunds for poor results
   - Admin refund interface

### Low Priority
7. **Add Credit Leaderboard** ❌ TODO
   - Show top users by credits earned
   - Gamification elements
   - Achievement badges

8. **Add Credit Forecasting** ❌ TODO
   - Predict when credits will run out
   - Suggest purchase timing
   - Optimize for cost savings

## 📁 Files to Work On

### Phase 1: Stripe Integration
```
Priority 1 (This Week):
- src/app/api/[locale]/v1/core/credits/purchase/repository.ts
- src/app/api/[locale]/v1/core/credits/purchase/webhook/route.ts (NEW)
- src/app/[locale]/credits/purchase/page.tsx (NEW)
- src/app/[locale]/credits/components/CreditPackSelector.tsx (NEW)

Priority 2 (Next Week):
- src/app/api/[locale]/v1/core/credits/purchase/definition.ts
- src/app/api/[locale]/v1/core/credits/hooks.ts
```

### Phase 2: Subscription Credits
```
Priority 1 (Week 3):
- src/app/api/[locale]/v1/core/credits/subscription/allocate.ts (NEW)
- src/app/api/[locale]/v1/core/credits/subscription/renew.ts (NEW)
- src/app/api/[locale]/v1/core/credits/subscription/cancel.ts (NEW)

Priority 2 (Week 4):
- src/app/api/[locale]/v1/core/credits/expire/task.ts
- src/app/api/[locale]/v1/core/credits/repository.ts
```

## 🎯 Success Criteria

### Phase 1 Complete When:
- ✅ Users can purchase credits via Stripe
- ✅ Credits added automatically after payment
- ✅ Webhook handling is reliable
- ✅ Purchase UI is intuitive
- ✅ Email confirmations sent

### Phase 2 Complete When:
- ✅ Subscription users get monthly credits
- ✅ Credits expire at end of billing period
- ✅ Tier changes handled correctly
- ✅ Renewal process is automatic
- ✅ Cancellation preserves current credits

### Phase 3 Complete When:
- ✅ Users notified of low balance
- ✅ Usage analytics available
- ✅ Cost optimization suggestions shown
- ✅ Export functionality works

### Phase 4 Complete When:
- ✅ Credit gifting works
- ✅ Referral system active
- ✅ Enterprise pools functional
- ✅ Credit rollover implemented

## 🚀 Getting Started (For New Contributors)

### 1. Understand the Schema
Review `db.ts` to understand the data model

### 2. Test Locally
```bash
# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Test credit operations
npm run test:credits
```

### 3. Follow the Pattern
Look at existing endpoints:
- `repository.ts` - Database operations
- `definition.ts` - API endpoint definition
- `route.ts` - Route handler
- `hooks.ts` - React hooks

### 4. Test Your Changes
```bash
npx vibe check src/app/api/[locale]/v1/core/credits/**/*.ts
```

---

**Status**: Phase 1 In Progress (Stripe Integration)
**Last Updated**: 2025-10-25
**Next Milestone**: Complete Stripe integration by end of week

