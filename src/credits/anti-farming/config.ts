/**
 * Anti-farming thresholds for the free credit tiers.
 * Single source of truth: pool linking, subnet budgets, signup carry-over.
 */

/** Lead-linking thresholds live with the framework lead code; listed here too */
export {
  GUEST_IP_POOL_WINDOW_HOURS,
  IP_POOL_PREFIX,
  IP_SUBNET_PREFIX,
} from "next-vibe/identity/lead/ip-key";

/** Guest free spend from the signup IP in this window counts against the new account once */
export const SIGNUP_GUEST_SPEND_LOOKBACK_HOURS = 24;

/** New free ACCOUNT pools per subnet (IPv4 /24, IPv6 /64) per calendar month */
export const ACCOUNT_POOLS_PER_SUBNET_PER_MONTH = 3;

/**
 * New ACCOUNTS (not just free pools) per subnet (IPv4 /24, IPv6 /64) in a
 * rolling SIGNUP_SUBNET_WINDOW_HOURS window; signups beyond it are refused.
 * Loopback/private IPs are exempt (signup-limit.ts).
 */
export const SIGNUPS_PER_SUBNET_PER_DAY = 5;
export const SIGNUP_SUBNET_WINDOW_HOURS = 24;

/** New free GUEST pools per subnet (IPv4 /24, IPv6 /64) per day (UTC) */
export const GUEST_POOLS_PER_SUBNET_PER_DAY = 5;

/**
 * Deploy cutoff of the account rules. Accounts created before it never use a
 * subnet budget. Email verification applies to every account: older ones that
 * are still unverified keep only what they were already granted in the period
 * the rule started (until its next monthly refill).
 */
export const FREE_POOL_CLAIMS_START = new Date("2026-11-14T00:00:00Z");

/**
 * Hosting / VPN networks (src/leads/geo/asn): NEW free account pools per ASN
 * per day (UTC), on top of the per-subnet monthly budget. One farm rotating
 * /24s inside one provider (OVH, Mullvad, ...) hits this; a privacy user on a
 * VPN still signs up, buys and normally falls inside it.
 */
export const ACCOUNT_POOLS_PER_HOSTING_ASN_PER_DAY = 3;

/**
 * Accounts created within this many days after an already-granted account,
 * sharing an exact IP (IPv4 /32, IPv6 /64) AND the same user agent with it,
 * share that account's one free pool (the later account gets none).
 * Households on one IP with different devices/browsers are not linked and
 * keep the per-subnet allowance (ACCOUNT_POOLS_PER_SUBNET_PER_MONTH).
 * Loopback/private IPs are exempt.
 */
export const IP_LINK_WINDOW_DAYS = 7;

/**
 * Newsletter bonus: NEW bonuses per network (subnet, or the ASN for
 * hosting/VPN networks) per calendar month. Bonuses already granted stay.
 */
export const NEWSLETTER_BONUSES_PER_NETWORK_PER_MONTH = 1;

/**
 * Newsletter subscriptions confirmed before this keep their bonus without a
 * network claim (signup used to auto-confirm them; rule start 2026-11-28).
 */
export const NEWSLETTER_BONUS_CLAIMS_START = new Date("2026-11-28T00:00:00Z");

/**
 * Burst alert (alerts.ts): when this many enforced subnet/ASN limit events
 * land within BURST_ALERT_WINDOW_MINUTES, mail the ops inboxes. At most one
 * alert per BURST_ALERT_COOLDOWN_HOURS. The 2026-11-27 farm would have
 * alerted at 21:12 UTC (5 events between 20:17 and 21:12).
 */
export const BURST_ALERT_THRESHOLD = 5;
export const BURST_ALERT_WINDOW_MINUTES = 60;
export const BURST_ALERT_COOLDOWN_HOURS = 6;

/**
 * Log-only signup signals (signup-signals.ts), no denial yet:
 * - a random plus-tag of RANDOM_ALIAS_MIN_LENGTH+ chars mixing letters and
 *   digits on a big mail provider
 * - SIGNUP_CLUSTER_MIN_SIGNUPS+ accounts with the same private name and user
 *   agent within SIGNUP_CLUSTER_WINDOW_HOURS across 2+ subnets
 */
export const RANDOM_ALIAS_MIN_LENGTH = 8;
export const SIGNUP_CLUSTER_MIN_SIGNUPS = 3;
export const SIGNUP_CLUSTER_WINDOW_HOURS = 24;
