/**
 * Whop configuration (no network): credentials of the active environment.
 * WHOP_ENVIRONMENT=sandbox switches base URL, key, secret and account id to
 * the separate Whop sandbox (https://docs.whop.com/developer/guides/sandbox.md).
 */

import "server-only";

import { paymentEnv } from "../../env";

export interface WhopCredentials {
  environment: "production" | "sandbox";
  baseUrl: string;
  apiKey: string | undefined;
  webhookSecret: string | undefined;
  /** Configured account id; looked up from the key when undefined. */
  accountId: string | undefined;
}

export function getWhopCredentials(): WhopCredentials {
  if (paymentEnv.WHOP_ENVIRONMENT === "sandbox") {
    return {
      environment: "sandbox",
      baseUrl: "https://sandbox-api.whop.com/api/v1",
      apiKey: paymentEnv.WHOP_SANDBOX_API_KEY,
      webhookSecret: paymentEnv.WHOP_SANDBOX_WEBHOOK_SECRET,
      accountId: paymentEnv.WHOP_SANDBOX_COMPANY_ID,
    };
  }
  return {
    environment: "production",
    baseUrl: "https://api.whop.com/api/v1",
    apiKey: paymentEnv.WHOP_API_KEY,
    webhookSecret: paymentEnv.WHOP_WEBHOOK_SECRET,
    accountId: paymentEnv.WHOP_COMPANY_ID,
  };
}

/** Key and webhook secret of the active environment are present. */
export function isWhopConfigured(): boolean {
  const credentials = getWhopCredentials();
  return Boolean(credentials.apiKey && credentials.webhookSecret);
}
