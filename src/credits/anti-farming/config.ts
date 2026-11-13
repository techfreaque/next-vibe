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

/** New free GUEST pools per subnet (IPv4 /24, IPv6 /64) per day (UTC) */
export const GUEST_POOLS_PER_SUBNET_PER_DAY = 5;

/**
 * Deploy cutoff of the account rules. Accounts created before it are
 * grandfathered: no email verification needed for the account tiers and no
 * subnet budget. Newer accounts need both.
 */
export const FREE_POOL_CLAIMS_START = new Date("2026-11-14T00:00:00Z");
