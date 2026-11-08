import { FREE_CREDIT_ALLOWANCE } from "../products/constants";

/** Baseline (guest) monthly free allowance. Tiered caps live in credits/free-allowance.ts. */
export const FREE_CREDIT_POOL = FREE_CREDIT_ALLOWANCE.guest;
export const FEEDBACK_REWARD_CREDITS = 800;
export const CREDITS_ALIAS = "credits-balance" as const;
