/**
 * Whop REST client (raw fetch, no SDK).
 *
 * Docs (read 2026-11-27): https://docs.whop.com/llms.txt, spec
 * https://api.whop.com/api/v1/openapi.json (x-api-version-date 2026-11-25).
 * Every call pins Api-Version-Date so field names stay stable: variants
 * (plan_ ids) instead of plans, account_id instead of company_id, money
 * objects instead of bare numbers.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import { z } from "zod";

import { getWhopCredentials } from "./config";

export const WHOP_API_VERSION_DATE = "2026-11-25";

/** Money object since 2026-09-02-1; older pins and some fields send numbers. */
export const whopMoneySchema = z.union([
  z.number(),
  z.string(),
  z.object({
    amount: z.union([z.string(), z.number()]),
    currency: z.string().optional(),
    decimals: z.number().optional(),
  }),
]);
export type WhopMoney = z.infer<typeof whopMoneySchema>;

/** Major units (string/number/money object) to minor units (cents). */
export function whopMoneyToMinor(
  value: WhopMoney | null | undefined,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const raw = typeof value === "object" ? value.amount : value;
  const amount = typeof raw === "number" ? raw : Number.parseFloat(raw);
  if (!Number.isFinite(amount)) {
    return null;
  }
  return Math.round(amount * 100);
}

const metadataSchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
  .nullable()
  .optional();

export const whopPaymentSchema = z.object({
  id: z.string(),
  status: z.string().nullable().optional(),
  substatus: z.string().nullable().optional(),
  billing_reason: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  total: whopMoneySchema.nullable().optional(),
  subtotal: whopMoneySchema.nullable().optional(),
  refunded_amount: whopMoneySchema.nullable().optional(),
  paid_at: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  membership_id: z.string().nullable().optional(),
  variant_id: z.string().nullable().optional(),
  product_id: z.string().nullable().optional(),
  checkout_configuration_id: z.string().nullable().optional(),
  metadata: metadataSchema,
});
export type WhopPayment = z.infer<typeof whopPaymentSchema>;

export const whopMembershipSchema = z.object({
  id: z.string(),
  status: z.string(),
  cancel_at_period_end: z.boolean().nullable().optional(),
  current_period_start: z.string().nullable().optional(),
  current_period_end: z.string().nullable().optional(),
  canceled_at: z.string().nullable().optional(),
  billing_period_days: z.number().nullable().optional(),
  manage_url: z.string().nullable().optional(),
  metadata: metadataSchema,
});
export type WhopMembership = z.infer<typeof whopMembershipSchema>;

export const whopRefundSchema = z.object({
  id: z.string(),
  status: z.string().nullable().optional(),
  payment_id: z.string().nullable().optional(),
  payment: z.object({ id: z.string() }).nullable().optional(),
  amount: whopMoneySchema.nullable().optional(),
  created_at: z.string().nullable().optional(),
});

export const whopDisputeSchema = z.object({
  id: z.string(),
  status: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  amount: whopMoneySchema.nullable().optional(),
  created_at: z.string().nullable().optional(),
  payment: z
    .object({ id: z.string(), amount: z.number().nullable().optional() })
    .nullable()
    .optional(),
});

export const whopCheckoutConfigurationSchema = z.object({
  id: z.string(),
  purchase_url: z.string(),
  metadata: metadataSchema,
  variant: z.object({ id: z.string() }).nullable().optional(),
});

export const whopProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  metadata: metadataSchema,
});
export type WhopProduct = z.infer<typeof whopProductSchema>;

export const whopVariantSchema = z.object({
  id: z.string(),
  product: z.object({ id: z.string() }).nullable().optional(),
  billing_type: z.string().nullable().optional(),
  billing_period: z.number().nullable().optional(),
  initial_price: whopMoneySchema.nullable().optional(),
  renewal_price: whopMoneySchema.nullable().optional(),
  currency: z.string().nullable().optional(),
  visibility: z.string().nullable().optional(),
  purchase_url: z.string().nullable().optional(),
  metadata: metadataSchema,
});
export type WhopVariant = z.infer<typeof whopVariantSchema>;

export function whopListSchema<T extends z.ZodType>(
  item: T,
): z.ZodObject<{
  data: z.ZodArray<T>;
  page_info: z.ZodOptional<
    z.ZodObject<{
      end_cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      has_next_page: z.ZodOptional<z.ZodBoolean>;
    }>
  >;
}> {
  return z.object({
    data: z.array(item),
    page_info: z
      .object({
        end_cursor: z.string().nullable().optional(),
        has_next_page: z.boolean().optional(),
      })
      .optional(),
  });
}

export type WhopResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * One Whop API call, parsed with `schema`. Never throws. POSTs carry an
 * Idempotency-Key when given (Whop replays the stored response for 24 h).
 */
export async function whopRequest<T extends z.ZodType>(params: {
  method: "GET" | "POST" | "PATCH";
  path: string;
  schema: T;
  body?: { [key: string]: JsonValue };
  query?: Record<string, string>;
  idempotencyKey?: string;
}): Promise<WhopResult<z.infer<T>>> {
  const { apiKey, baseUrl: base } = getWhopCredentials();
  if (!apiKey) {
    return { ok: false, status: 0, message: "Whop API key missing" };
  }
  const search = params.query
    ? `?${new URLSearchParams(params.query).toString()}`
    : "";
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(`${base}${params.path}${search}`, {
      method: params.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Api-Version-Date": WHOP_API_VERSION_DATE,
        ...(params.body ? { "Content-Type": "application/json" } : {}),
        ...(params.idempotencyKey
          ? { "Idempotency-Key": params.idempotencyKey }
          : {}),
      },
      body: params.body ? JSON.stringify(params.body) : undefined,
    });
    const text = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: text.slice(0, 500),
      };
    }
    const parsed = params.schema.safeParse(text ? JSON.parse(text) : {});
    if (!parsed.success) {
      return {
        ok: false,
        status: response.status,
        message: `Unexpected Whop response: ${parsed.error.message.slice(0, 300)}`,
      };
    }
    return { ok: true, data: parsed.data };
  } catch (error) {
    return { ok: false, status: 0, message: parseError(error).message };
  }
}

export function getWhopMembership(
  membershipId: string,
): Promise<WhopResult<WhopMembership>> {
  return whopRequest({
    method: "GET",
    path: `/memberships/${encodeURIComponent(membershipId)}`,
    schema: whopMembershipSchema,
  });
}

export function getWhopPayment(
  paymentId: string,
): Promise<WhopResult<WhopPayment>> {
  return whopRequest({
    method: "GET",
    path: `/payments/${encodeURIComponent(paymentId)}`,
    schema: whopPaymentSchema,
  });
}

const accountSchema = z.object({ id: z.string() });
let cachedAccountId: { key: string; id: string } | null = null;

/** Account id (biz_...) of the active key: env value, else GET /accounts/me. */
export async function getWhopAccountId(): Promise<WhopResult<string>> {
  const credentials = getWhopCredentials();
  if (credentials.accountId) {
    return { ok: true, data: credentials.accountId };
  }
  const cacheKey = `${credentials.environment}:${credentials.apiKey ?? ""}`;
  if (cachedAccountId?.key === cacheKey) {
    return { ok: true, data: cachedAccountId.id };
  }
  const account = await whopRequest({
    method: "GET",
    path: "/accounts/me",
    schema: accountSchema,
  });
  if (!account.ok) {
    return account;
  }
  cachedAccountId = { key: cacheKey, id: account.data.id };
  return { ok: true, data: account.data.id };
}
