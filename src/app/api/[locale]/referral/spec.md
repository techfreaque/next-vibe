# Referral System – High-Level Spec

## 1. Goals & Entry Points
- Allow **any authenticated user** to create **N referral codes**, each unique globally in the DB.
- Support **two main entry flows**:
  1. **Marketing links via `/[locale]/track`** – URL includes a referral code (e.g. `?ref=CODE`); track route validates + stores it against the existing `leadId` cookie so later signup can use it.
  2. **Signup form with prefilled referral code** – signup page reads referral code from track/URL/cookie and passes it to backend on signup.
- On **payment success** (subscription or credit pack purchase) we:
  - Compute a **referral payout pool** (20% of transaction amount).
  - Distribute this pool across the **referrer chain (multi‑level)** according to a geometric decay rule.
  - Persist per‑user earnings so referrers can see them immediately in the UI.

## 2. Data Model (New Tables)

**CRITICAL ARCHITECTURE DECISION**: Hybrid two-phase referral tracking.

**Why hybrid lead + user tracking?**
- **Phase 1 (Pre-signup)**: Track via leadId (device/session) - user doesn't exist yet
- **Phase 2 (Post-signup)**: Copy to userId - permanent, stable referral chain
- **Problem solved**: If leadId disappears (cleared cookies, new device), userId chain remains intact
- **Payment payout**: Always uses userId chain (stable, never breaks)

**Flow:**
1. User clicks referral link → leadId created (middleware)
2. Referral code stored → `lead_referrals` table (leadId → referralCodeId)
3. User signs up → `user_referrals` table created (userId → referrerUserId)
4. Referral chain now permanent via userId, independent of leadId

Exact schema and ORM will follow existing patterns (Drizzle), but conceptually we add:

1. **`referral_codes`** (unchanged)
   - `id` (UUID PK)
   - `code` (string, **unique**) – human‑friendly token used in URLs and forms
   - `ownerUserId` (FK → users)
   - `label` (optional, for user‑friendly naming)
   - `maxUses` (optional, nullable)
   - `currentUses` (int, default 0)
   - `expiresAt` (optional)
   - `isActive` (boolean)
   - `createdAt`, `updatedAt`

2. **`lead_referrals`** (temporary, pre-signup tracking)
   - `id` (UUID PK)
   - `referralCodeId` (FK → referral_codes) – which code was used
   - `leadId` (FK → leads) – which lead used the code
   - `createdAt`
   - Invariants:
     - A lead has **at most one referral code** (unique index on `leadId`).
     - Used only BEFORE signup for temporary tracking.
     - On signup, data is copied to `user_referrals` and becomes permanent.

3. **`user_referrals`** (permanent, post-signup tracking)
   - `id` (UUID PK)
   - `referrerUserId` (FK → users) – who referred this user (owner of referral code)
   - `referredUserId` (FK → users) – the user who was referred
   - `referralCodeId` (FK → referral_codes) – which code was used
   - `createdAt`
   - Invariants:
     - A user has **at most one referrer** (unique index on `referredUserId`).
     - Created during signup by copying from `lead_referrals`.
     - This is the **source of truth** for payment payout chain resolution.

4. **`referral_earnings`** (per‑transaction payouts per level)
   - `id` (UUID PK)
   - `earnerUserId` (FK → users) – who receives the money
   - `sourceUserId` (FK → users) – who made the purchase
   - `transactionId` (FK → payments/transactions table)
   - `referralCodeId` (FK → referral_codes) – which code was used
   - `level` (int, 0 = direct, 1 = second level, ...)
   - `amountCents` (int)
   - `currency` (string, aligned with payments)
   - `status` (enum: `pending`, `confirmed`, `voided`) – to handle refunds/chargebacks later
   - `createdAt`

Balances and aggregates (e.g. total earned) can be computed via queries or a later aggregation table if needed.

## 3. Payout Algorithm (Multi‑Level Marketing)

**Chain Resolution (User-Based - Stable)**:
1. User makes payment → get userId (sourceUserId)
2. Get referrerUserId from `user_referrals` WHERE referredUserId = sourceUserId (level 0)
3. Get referrerUserId from `user_referrals` WHERE referredUserId = previous referrerUserId (level 1)
4. Repeat step 3 to build chain (level 2, 3, 4...)
5. Cap at `L_max` levels (configurable, e.g. 5–10)

**Why user-based chain?**
- `user_referrals` is permanent (doesn't depend on leadId/cookies)
- Simple recursive query: userId → referrerUserId → referrerUserId...
- No need to traverse leads or userLeadLinks
- Chain never breaks even if user clears cookies or uses new device

**Payout Distribution**:
- For each qualifying transaction with total amount `T` (e.g. `$10`):
  - **Pool**: `P = 0.2 × T` (20%) → e.g. `$2`.
  - Fetch the **upline chain** using user-based resolution above.
- Use **geometric decay** with ratio `q` where `0 < q < 1`, e.g. `q = 0.5`:
  - For level `k` (0‑based), base weight `w_k = q^k`.
  - For finite `N = min(chainLength, L_max)` levels:
    - `S = Σ_{k=0..N-1} q^k = (1 − q^N) / (1 − q)`.
    - Level `k` share: `share_k = P × (w_k / S)`.
  - Handle rounding to cents with a deterministic rule (e.g. floor each share and distribute remainder to highest levels first).
- If there are fewer uplines than `L_max`, we only use existing levels and renormalize over those levels so their shares still sum to `P`.

## 4. API Surface: `/api/[locale]/referral`
Mirror the **login** feature structure (`definition.ts`, `repository.ts`, `hooks.ts`, `_components`, `i18n`, `route.ts`, tests):

1. **Endpoints (initial set)**
   - `POST /core/referral/codes` – Authenticated
     - Input: `label?`, optional constraints (maxUses, expiresAt).
     - Logic: generate unique code, insert into `referral_codes` with `ownerUserId` = current user.
     - Output: created code + basic stats.
   - `GET /core/referral/codes` – Authenticated
     - Lists current user’s codes with usage stats (signups, revenue, earnings).
   - `GET /core/referral/stats` – Authenticated
     - Aggregated stats for the user: total referred users, active subscribers, total earnings, per‑level breakdown.
   - Internal/service entrypoint (can be same route or shared service):
     - `validateReferralCode(code)` – used by `/[locale]/track` and signup.
     - `linkReferralToLead({ leadId, referralCode })` – creates `lead_referrals` entry (happens BEFORE signup).
     - `convertLeadReferralToUser({ userId, leadId })` – called during signup, copies `lead_referrals` → `user_referrals`.
     - `applyReferralPayoutOnPayment({ transactionId })` – called on payment success, uses user-based chain resolution.

2. **Repository layer (`repository.ts`)**
   - Encapsulate all DB access: CRUD for `referral_codes`, `user_referrals`, `referral_earnings`, and tree traversal of upline chain.
   - Follow patterns from `core/user/public/login/repository.ts` for dependency injection, error types, and transaction handling.

3. **Definition & hooks (`definition.ts`, `hooks.ts`)**
   - Use unified‑ui definition pattern (same as login) to generate:
     - CLI + web + native + AI tool interfaces in one schema.
   - Hooks such as `useReferralCodes`, `useCreateReferralCode`, `useReferralStats` for UI consumption.

4. **Tests**
   - `route.test.ts` for route‑level behavior, mirroring login tests.
   - Unit tests for payout math (decay, finite levels, rounding) and repository methods.

## 5. Frontend Integration

### 5.1 `/[locale]/track` route
- Extend existing `track` page to understand referral codes, without breaking current lead tracking:
  - Accept `ref` query param (e.g., `/track?ref=FRIEND2024&url=/signup`).
  - Store referral code in **localStorage** (key: `referralCode`).
  - Redirect to destination URL (typically `/signup`).
  - No server-side call needed at this point - just store for later use.

### 5.2 Signup flow (CRITICAL: Two-phase conversion)
- **Phase 1: Pre-signup (Lead-based)**
  - On page load (before form submission):
    1. Check localStorage for `referralCode`.
    2. If found: validate code via API, then call `linkReferralToLead(leadId, referralCode)`.
    3. If valid: hide referral input field, show "Using referral code: FRIEND2024".
    4. If not found or invalid: show optional referral input field.

  - On form submission (if user manually entered code):
    1. Validate and link to leadId via `linkReferralToLead()`.
    2. Creates entry in `lead_referrals` table.

- **Phase 2: During signup (User-based conversion)**
  - After user account created:
    1. Call `convertLeadReferralToUser(userId, leadId)`.
    2. Looks up `lead_referrals` WHERE leadId.
    3. Gets referralCodeId and ownerUserId (referrer).
    4. Creates entry in `user_referrals`: referredUserId=userId, referrerUserId=ownerUserId.
    5. Referral chain now permanent via userId (independent of leadId).

- **Key insight**: Two-phase conversion ensures referral chain survives even if leadId disappears.

### 5.3 Referral dashboard UI
- New user‑facing UI (page + components), reusing the API hooks:
  - List of codes with create button.
  - For each code: signups count, active subscribers, total revenue, total earnings.
  - Overall stats per user: balance, lifetime earnings, per‑level distribution.
- Implemented with the same patterns as login:
  - `_components/*` for layout and forms.
  - `i18n/*` for translations.

## 6. Payment Success Integration
- Identify central **payment success handlers** (subscriptions, credit packs).
- After a successful transaction:
  1. Resolve buyer’s referral chain using **user-based resolution** (see section 3).
  2. Compute payout pool `P` and per‑level shares using the algorithm above.
  3. Insert one `referral_earnings` row per eligible upline level.
  4. Make sure referrals are visible **immediately** to the receiver via `GET /core/referral/stats` and codes listing.
- For refunds/chargebacks (later phase), add logic to mark relevant `referral_earnings` as `voided` and exclude them from available balances.

## 7. Constraints, Security & Edge Cases
- **Uniqueness**: DB unique index on `referral_codes.code` ensures no collisions; retries on conflict when generating codes.
- **Limits per user**: allow unbounded initially but design repository so we can plug in per‑plan limits later.
- **No loops**:
  - One referral code per lead (unique index on `leadId` in `lead_referrals`).
  - One referrer per user (unique index on `referredUserId` in `user_referrals`).
  - Ancestry traversal prevents cycles in user chain.
- **Idempotency**:
  - Lead referral link: creating `lead_referrals` must be idempotent per `(leadId)` - unique constraint handles this.
  - User referral conversion: creating `user_referrals` must be idempotent per `(referredUserId)` - unique constraint handles this.
  - Payment handler: ensure each transaction is processed exactly once (use existing payment idempotency approach and/or unique index on `(transactionId, earnerUserId, level)`).
- **Performance**: upline depth is small and capped; tree traversal for each payment is cheap and fully server‑side.
- **Self-referrals**: Prevented during conversion - check if referral code ownerUserId == new userId.
- **Lead disappearance**: Not a problem - `user_referrals` is permanent and independent of leadId.

## 8. Implementation Strategy
- Use **`core/user/public/login`** as the architectural template for:
  - Folder layout, `route.ts`, `definition.ts`, `hooks.ts`, `repository.ts`, `_components`, `i18n`, and tests.
- Phase 1 (this spec): define data model, APIs, and integration points.
- Phase 2: implement DB models + repository + core services (validation, signup linking, payout math).
- Phase 3: wire into `/[locale]/track`, signup flow, and payment success handlers.
- Phase 4: build referral dashboard UI and finalize tests across backend + frontend.
