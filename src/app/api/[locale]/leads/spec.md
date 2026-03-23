# Lead & User System Specification

> next-vibe - censorship-resistant AI chat (mainstream + uncensored models) with a public forum layer, credit-based monetization, and full lead-to-revenue tracking.

---

## Core concepts

**Lead** - a device-level identity created silently on first visit, before any account exists. Has a credit wallet, active campaigns, and engagement history. First-class citizen even without a user.

**User** - an authenticated identity. Has exactly one primary lead (the one used to sign up). Inherits that lead's free credits on creation.

**Lead group** - a set of leads identified as the same real person across devices/sessions. Shares a single free-credit pool (max 20/month).

**Credit wallet** - every lead and user has one. Immutable transaction log. Lead wallets hold only free credits; user wallets hold paid credits.

---

## Lead status state machine

Source is set at creation and never changes. Status only moves forward (except SUBSCRIPTION_CONFIRMED → SIGNED_UP on churn).

| Status                   | Meaning                              | Can transition to                                                            |
| ------------------------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| `NEW`                    | CSV import lead, not yet queued      | PENDING, SIGNED_UP, BOUNCED, INVALID                                         |
| `PENDING`                | Queued for first campaign email      | CAMPAIGN_RUNNING, SIGNED_UP, BOUNCED, UNSUBSCRIBED, INVALID                  |
| `CAMPAIGN_RUNNING`       | In cold email sequence               | SIGNED_UP, NEWSLETTER_SUBSCRIBER, IN_CONTACT, UNSUBSCRIBED, BOUNCED, INVALID |
| `WEBSITE_USER`           | Identified via site visit            | NEWSLETTER_SUBSCRIBER, IN_CONTACT, SIGNED_UP, BOUNCED, INVALID               |
| `NEWSLETTER_SUBSCRIBER`  | Gave email, subscribed to newsletter | IN_CONTACT, SIGNED_UP, UNSUBSCRIBED, BOUNCED, INVALID                        |
| `IN_CONTACT`             | Submitted contact form               | SIGNED_UP, SUBSCRIPTION_CONFIRMED, UNSUBSCRIBED, BOUNCED, INVALID            |
| `SIGNED_UP`              | Has user account, not paying         | SUBSCRIPTION_CONFIRMED, UNSUBSCRIBED, BOUNCED, INVALID                       |
| `SUBSCRIPTION_CONFIRMED` | Active paying subscriber             | SIGNED_UP (churn), UNSUBSCRIBED, BOUNCED, INVALID                            |
| `UNSUBSCRIBED`           | Opted out of all email (terminal)    | BOUNCED, INVALID                                                             |
| `BOUNCED`                | Email undeliverable (terminal)       | INVALID                                                                      |
| `INVALID`                | Junk / banned (terminal)             | -                                                                            |

---

## Lead sources & lifecycles

### CSV Import (`CSV_IMPORT`)

Cold leads from external lists. The only source that enters the cold email campaign automatically.

```
Upload → leads created: NEW, source CSV_IMPORT
Campaign Starter cron: NEW → PENDING (within weekly quota, past minAgeHours, has email)
  → creates lead_campaign row: type COLD, stage NOT_STARTED
Email Campaigns cron: NOT_STARTED → INITIAL (sends email, status → CAMPAIGN_RUNNING)
  → advances: INITIAL → FOLLOWUP_1 → FOLLOWUP_2 → FOLLOWUP_3 → NURTURE → REACTIVATION
  → opens/clicks logged; engagement may accelerate next stage delay
On exit event → halt COLD campaign immediately:
  signs up       → SIGNED_UP   → enqueue SIGNUP_NURTURE
  subscribes     → NEWSLETTER_SUBSCRIBER → enqueue NEWSLETTER_NURTURE
  unsubscribes   → UNSUBSCRIBED → global suppression
  bounces        → BOUNCED
  banned         → INVALID
```

A/B journey variant assigned once at first send (UNCENSORED_CONVERT / SIDE_HUSTLE / QUIET_RECOMMENDATION), never changed.

### Website Visitor (`WEBSITE`)

```
First request → middleware creates lead: WEBSITE_USER, source WEBSITE
  → lead cookie set, IP/UA/country/language captured
Subsequent visits → engagement events on same lead
Lead gives email:
  newsletter form → WEBSITE_USER → NEWSLETTER_SUBSCRIBER → enqueue NEWSLETTER_NURTURE
  signup          → WEBSITE_USER → SIGNED_UP → user created → enqueue SIGNUP_NURTURE
  contact form    → WEBSITE_USER → IN_CONTACT
```

### Referral (`REFERRAL`)

Same as website visitor. Referral code captured from link and stored on lead at first touch - immutable. On signup, referrer is credited.

### API (`API`)

Lead created programmatically. Status defaults to NEW. No campaign auto-started; admin triggers manually.

---

## Lead-to-lead linking

Links are created when two leads are identified as the same person.

**Triggers:**

- Device fingerprint match on a new visit
- Email match when a lead submits an address (newsletter/signup) and another lead with that email exists
- User logs in from a device whose lead cookie is not in their known leads
- Admin manual merge

**What happens:**

- Row inserted in `lead_lead_links` (leadId, linkedLeadId, reason, createdAt)
- Both leads join the same lead group → free-credit pool is now shared and checked atomically across all group wallets
- Campaign stages remain independent per lead
- If any lead in the group is already linked to a user → newly linked lead immediately binds to that user too

---

## Lead-to-user linking

**Triggers:**

- Signup - converting lead becomes the primary lead (reason: `signup`)
- Login on new device - device lead linked to user (reason: `login`)
- Admin merge (reason: `merge`)

**What happens:**

1. Row inserted in `user_lead_links` (userId, leadId, isPrimary, reason, createdAt)
2. All other leads in the same lead group also linked to the user (reason: `group`)
3. Converting lead's free credits transferred to user wallet via TRANSFER transaction
4. All linked lead wallets frozen (freeCreditsRemaining → 0, no further deductions)
5. COLD and NEWSLETTER_NURTURE campaigns halted on all linked leads
6. User enters SIGNUP_NURTURE campaign if no payment history

**Primary lead mirrors the user:**

- User updates email/name/country → primary lead fields updated
- User subscription changes → primary lead status updated (SUBSCRIPTION_CONFIRMED or SIGNED_UP on churn)
- User banned → all linked leads → INVALID

---

## Email campaigns

Campaign state lives in `lead_campaigns` (one row per lead+campaignType): campaignType, stage, journeyVariant, startedAt, lastSentAt, haltedAt, haltReason, status (active/halted/completed).

### Campaign types

**COLD** - CSV_IMPORT leads. Entry: Campaign Starter cron. Stages: NOT_STARTED → INITIAL → FOLLOWUP_1 → FOLLOWUP_2 → FOLLOWUP_3 → NURTURE → REACTIVATION.

**NEWSLETTER_NURTURE** - NEWSLETTER_SUBSCRIBER leads with no user. Entry: status → NEWSLETTER_SUBSCRIBER.

- INITIAL (24h): welcome, free credits
- FOLLOWUP_1 (day 3): forum highlight
- FOLLOWUP_2 (day 7): uncensored models angle
- FOLLOWUP_3 (day 14): social proof
- NURTURE (day 30): credits waiting
- REACTIVATION (day 60): last chance

**SIGNUP_NURTURE** - SIGNED_UP leads with no payment. Entry: user created.

- INITIAL (2h): welcome, platform overview
- FOLLOWUP_1 (day 2): feature highlights
- FOLLOWUP_2 (day 5): credits running low (conditional)
- FOLLOWUP_3 (day 10): pricing explainer
- NURTURE (day 20): testimonial
- REACTIVATION (day 45): discounted first subscription offer

**RETENTION** - SUBSCRIPTION_CONFIRMED leads. Entry: status → SUBSCRIPTION_CONFIRMED. Monthly touches: tips, referral push, anniversary.

**WINBACK** - churned subscribers (SUBSCRIPTION_CONFIRMED → SIGNED_UP). Entry: churn event.

- CHURN_1 (day 3): we miss you
- CHURN_2 (day 7): limited credit offer
- CHURN_3 (day 21): what's new
- CHURN_4 (day 45): final re-engagement + survey → campaign ends, no further emails

### Campaign halting

Halt is synchronous on status update. Cron skips halted rows.

| Status change            | Campaigns halted         | Next action                    |
| ------------------------ | ------------------------ | ------------------------------ |
| → NEWSLETTER_SUBSCRIBER  | COLD                     | enqueue NEWSLETTER_NURTURE     |
| → SIGNED_UP              | COLD, NEWSLETTER_NURTURE | enqueue SIGNUP_NURTURE         |
| → SUBSCRIPTION_CONFIRMED | SIGNUP_NURTURE           | enqueue RETENTION              |
| → SIGNED_UP (from churn) | RETENTION                | enqueue WINBACK                |
| → UNSUBSCRIBED           | all                      | add to global suppression list |
| → BOUNCED                | all                      | -                              |
| → INVALID                | all                      | -                              |

### SMTP routing

Multiple accounts with selection criteria: campaign type, journey variant, country, language. Failover to next matching account on failure. Per-account rate limits. Auto-deactivation on sustained failures.

### Email tracking

- Open pixel: 1×1 GIF with encoded leadId + campaignId
- Click tracking: all links redirected through tracking endpoint
- Unsubscribe: one-click header + footer link, processed immediately → UNSUBSCRIBED + halt all
- Bounce: provider webhook → BOUNCED + halt all

---

## Credit system

### Free tier

- 20 credits/month per lead group, shared atomically across all group wallets
- Period key: YYYY-MM, resets 1st of month
- Not transferable or purchasable

### Paid tier (users only)

- Credit packs: one-off, never expire
- Subscription: recurring, credits expire at period end
- Referral earnings: permanent credits
- Deduction order: soonest-expiring first, then permanent, then earned

### Cost model

- 1 credit = $0.01 USD
- Token models: (inputTokens × inputRate + outputTokens × outputRate) × (1 + markup)
- Fixed-credit models: e.g. 7 credits/message for uncensored models
- Tool calls: priced separately
- Refunds: admin-issued for failed requests

---

## Lead data model

**Identity** - email (unique), business name, contact name, phone, website, country, language, IP (latest), user agent (latest)

**Status & source** - status, source, referral code (first-touch, immutable)

**Linking** - primary user id, lead group id

**Engagement aggregates** - emails opened, emails clicked, last engagement at (any channel), website visits count, last website visit at, forum posts count, last forum post at

**Conversion** - signed up at, subscription confirmed at, converted user id

**Scoring** - lead score (0–100), last scored at

**Metadata** (JSONB) - industry, company size, budget range, custom tags

---

## Lead scoring

Recomputed nightly and on significant events (signup, payment, email open/click).

| Signal                                                                    | Pts    |
| ------------------------------------------------------------------------- | ------ |
| Email opened ≥1                                                           | 10     |
| Email clicked ≥1                                                          | 10     |
| Website visit                                                             | 5      |
| Forum post or chat message                                                | 10     |
| Campaign stage depth (INITIAL=5, FOLLOWUP=10, NURTURE=15, REACTIVATION=5) | max 15 |
| Source quality (referral=15, website=10, social=8, import=5)              | max 15 |
| Recency (active <7d=15, <30d=10, <90d=5, older=0)                         | max 15 |
| Has user account                                                          | 10     |
| Has active subscription                                                   | 10     |

---

## Forum / public chat

- Thread or message posted → `forum_posts_count` on lead, `lastForumPostAt` updated
- Upvotes received → reputation signal on lead profile
- Reading is anonymous; posting requires a user account
- Moderation action against user → flagged on primary lead

---

## Admin visibility

### Lead list

Columns: email, status, source, lead score, last active, group indicator, revenue from linked user.
Filters: status, source, campaign type, has user, has subscription, lead score range, last active range.

### Lead detail

- **Identity** - contact fields, source, referral code, created at, last active, lead score with breakdown
- **Lead group** - all linked leads with device/IP/last seen; shared credit pool usage; linked user
- **Campaigns** - per campaign type: stage, variant, email timeline (sent/opened/clicked/bounced), next scheduled
- **Engagement feed** - chronological across all channels, filterable
- **Credits & revenue** - wallet balance, all transactions, total consumed/paid, estimated LTV, subscription + payment history from linked user
- **Chat activity** - thread counts, models used, tokens, forum posts with votes, recent previews
- **Referrals** - code used to acquire this lead, code they generated, referrals made, earnings

### User detail

- **Profile** - name, email, avatar, locale, joined at, roles, ban status, Stripe id
- **Lead connections** - primary lead + all linked leads with source, campaign at conversion, days to convert
- **Credits & billing** - subscription status, wallet breakdown, consumption graph, payment history
- **Chat usage** - thread/message counts, top models, tokens, memories, token budget this month
- **Referrals** - referral code, referred users count, earnings
- **Security** - login history (last 10), 2FA status

### Stats dashboard

- **Acquisition** - new leads by source/day/week; lead→user conversion rate by source and variant; avg days to signup; referral %
- **Campaign** - open/click/unsubscribe rate per stage per campaign type; best variant; avg days per stage
- **Revenue** - MRR/ARR; new/expansion/churned MRR; ARPU; credits sold vs consumed; top models by consumption
- **Engagement** - DAU/MAU; messages/user/day; forum posts and votes/day; leads with ≥1 engagement this month
- **Lead scoring** - score histogram; high-score leads with no active campaign; leads stuck >30 days at same stage

---

## Build priority

1. `lead_campaigns` table - decouple campaign state from lead row; one row per lead+campaignType
2. Campaign halting - synchronous on status update; cron skips halted rows
3. Lead-to-lead linking - fingerprint match, email match, login-on-new-device, admin merge
4. Lead-to-user linking - group cascade, wallet freeze + transfer, campaign halt + re-enqueue
5. Newsletter ↔ lead sync - subscribe → NEWSLETTER_SUBSCRIBER + enqueue; unsubscribe → UNSUBSCRIBED + suppress
6. NEWSLETTER_NURTURE campaign
7. SIGNUP_NURTURE campaign
8. Cross-channel `lastEngagementAt` - updated by email, visit, chat, forum, payment
9. Atomic group credit pool check
10. Lead score computation - nightly batch + event-triggered
11. RETENTION campaign
12. WINBACK campaign
13. Engagement feed on lead detail
14. Revenue column on lead list
15. Stats dashboard
