/**
 * Whop catalog: one Whop product per internal product (subscription tiers,
 * credit packs) and one variant (Whop's "plan", id plan_...) per interval,
 * currency and amount, mirroring src/products/repository-client.ts.
 *
 * Whop has no lookup by external id, so every object carries our key in its
 * metadata (`ubProductId` on products, `ubKey` on variants) and is found by
 * listing the account's catalog. Creates send an Idempotency-Key derived from
 * the same key, so two concurrent checkouts never create a duplicate.
 * Checkout creates a missing variant on first use (like Stripe lookup keys);
 * the admin sync tool pre-creates the full catalog.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { z } from "zod";

import { scopedTranslation as productsScopedTranslation } from "../../../products/i18n";
import {
  CREDIT_PACK_PRODUCT_IDS,
  type ProductIds,
  productsRepository,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
} from "../../../products/repository-client";
import type { PaymentInterval } from "../types";
import {
  getWhopAccountId,
  whopListSchema,
  whopMoneyToMinor,
  type WhopProduct,
  whopProductSchema,
  whopRequest,
  type WhopResult,
  type WhopVariant,
  whopVariantSchema,
} from "./api";

/** Variants are bought through our checkout only, not from the Whop store. */
export const WHOP_VARIANT_VISIBILITY = "hidden";
const WHOP_PRODUCT_VISIBILITY = "hidden";

const MONTH_DAYS = 30;
const YEAR_DAYS = 365;

/** Stable key of one sellable variant (same shape as the Stripe lookup key). */
export function whopVariantKey(params: {
  productId: ProductIds;
  interval: PaymentInterval;
  currency: string;
  unitAmountMinor: number;
}): string {
  return [
    "ub",
    params.productId,
    params.interval,
    params.currency.toLowerCase(),
    String(params.unitAmountMinor),
  ].join("_");
}

export interface WhopVariantSpec {
  key: string;
  productId: ProductIds;
  interval: PaymentInterval;
  currency: string;
  /** Major units, what Whop's initial_price / renewal_price take. */
  amount: number;
}

/** Variant spec for a product + interval in the locale's currency and price. */
export function whopVariantSpec(params: {
  productId: ProductIds;
  interval: PaymentInterval;
  price: number;
  currency: string;
}): WhopVariantSpec {
  const amount = Math.round(params.price * 100) / 100;
  return {
    key: whopVariantKey({
      productId: params.productId,
      interval: params.interval,
      currency: params.currency,
      unitAmountMinor: Math.round(amount * 100),
    }),
    productId: params.productId,
    interval: params.interval,
    currency: params.currency.toLowerCase(),
    amount,
  };
}

/** Every variant the shop sells: tiers x intervals x currencies, packs x currencies. */
export function allWhopVariantSpecs(): WhopVariantSpec[] {
  const definitions = productsRepository.getProductDefinitions();
  const specs = new Map<string, WhopVariantSpec>();
  const add = (
    productId: ProductIds,
    interval: PaymentInterval,
    prices: { price: number; currency: string }[],
  ): void => {
    for (const price of prices) {
      if (price.price <= 0) {
        continue;
      }
      const spec = whopVariantSpec({
        productId,
        interval,
        price: price.price,
        currency: price.currency,
      });
      specs.set(spec.key, spec);
    }
  };
  for (const productId of SUBSCRIPTION_TIER_PRODUCT_IDS) {
    const definition = definitions[productId];
    if (!productsRepository.canPurchase(productId)) {
      continue;
    }
    if (definition.allowedIntervals.includes("month")) {
      add(productId, "month", Object.values(definition.priceByCountry));
    }
    if (
      definition.allowedIntervals.includes("year") &&
      definition.yearlyPriceByCountry
    ) {
      add(productId, "year", Object.values(definition.yearlyPriceByCountry));
    }
  }
  for (const productId of CREDIT_PACK_PRODUCT_IDS) {
    const definition = definitions[productId];
    add(
      productId,
      "one_time",
      Object.values(
        definition.oneTimePriceByCountry ?? definition.priceByCountry,
      ),
    );
  }
  return [...specs.values()];
}

function variantTitle(spec: WhopVariantSpec): string {
  const interval =
    spec.interval === "month"
      ? "monthly"
      : spec.interval === "year"
        ? "yearly"
        : "pack";
  return `${interval} ${spec.amount} ${spec.currency.toUpperCase()}`.slice(
    0,
    30,
  );
}

function productTitle(productId: ProductIds): string {
  const definition = productsRepository.getProductDefinitions()[productId];
  const { t } = productsScopedTranslation.scopedT("en-GLOBAL");
  return `unbottled.ai ${t(definition.name)}`.slice(0, 80);
}

/**
 * A renewal variant charges `initial_price` ON TOP of the first renewal
 * (Whop shows it as "Initial fee" + "Renewal fee"), so plans carry
 * initial_price 0 and the plan price as renewal_price; packs carry the price
 * as initial_price. Variants built differently (early sandbox runs) are
 * ignored and rebuilt.
 */
function variantChargesAsSpecified(variant: WhopVariant): boolean {
  const initial = whopMoneyToMinor(variant.initial_price) ?? 0;
  const renewal = whopMoneyToMinor(variant.renewal_price) ?? 0;
  if (variant.billing_type === "renewal") {
    return initial === 0 && renewal > 0;
  }
  return initial > 0;
}

interface CatalogState {
  accountId: string;
  products: Map<string, WhopProduct>;
  variants: Map<string, WhopVariant>;
}

let catalogCache: CatalogState | null = null;

/** Drops the cached catalog (tests, after a manual dashboard edit). */
export function resetWhopCatalogCache(): void {
  catalogCache = null;
}

async function listAll<S extends z.ZodType>(
  path: "/products" | "/variants",
  schema: S,
  accountId: string,
): Promise<WhopResult<z.output<S>[]>> {
  const items: z.output<S>[] = [];
  let after: string | undefined;
  for (let page = 0; page < 20; page += 1) {
    const result = await whopRequest({
      method: "GET",
      path,
      schema: whopListSchema(schema),
      query: {
        account_id: accountId,
        first: "100",
        ...(after ? { after } : {}),
      },
    });
    if (!result.ok) {
      return result;
    }
    items.push(...result.data.data);
    const next = result.data.page_info;
    if (!next?.has_next_page || !next.end_cursor) {
      break;
    }
    after = next.end_cursor;
  }
  return { ok: true, data: items };
}

async function loadCatalog(): Promise<WhopResult<CatalogState>> {
  if (catalogCache) {
    return { ok: true, data: catalogCache };
  }
  const accountId = await getWhopAccountId();
  if (!accountId.ok) {
    return accountId;
  }
  const products = await listAll(
    "/products",
    whopProductSchema,
    accountId.data,
  );
  if (!products.ok) {
    return products;
  }
  const variants = await listAll(
    "/variants",
    whopVariantSchema,
    accountId.data,
  );
  if (!variants.ok) {
    return variants;
  }
  const state: CatalogState = {
    accountId: accountId.data,
    products: new Map(),
    variants: new Map(),
  };
  for (const product of products.data) {
    const key = product.metadata?.ubProductId;
    if (typeof key === "string") {
      state.products.set(key, product);
    }
  }
  for (const variant of variants.data) {
    const key = variant.metadata?.ubKey;
    if (
      typeof key === "string" &&
      variant.visibility !== "archived" &&
      variantChargesAsSpecified(variant)
    ) {
      state.variants.set(key, variant);
    }
  }
  catalogCache = state;
  return { ok: true, data: state };
}

export interface EnsuredWhopVariant {
  key: string;
  productId: ProductIds;
  whopProductId: string;
  variantId: string;
  interval: PaymentInterval;
  currency: string;
  amount: number;
  purchaseUrl: string | null;
  /** existing = found, created = made now, missing = dry run */
  status: "existing" | "created" | "missing";
}

async function ensureProduct(
  state: CatalogState,
  productId: ProductIds,
  create: boolean,
): Promise<WhopResult<WhopProduct | null>> {
  const existing = state.products.get(productId);
  if (existing) {
    return { ok: true, data: existing };
  }
  if (!create) {
    return { ok: true, data: null };
  }
  const definition = productsRepository.getProductDefinitions()[productId];
  const created = await whopRequest({
    method: "POST",
    path: "/products",
    schema: whopProductSchema,
    idempotencyKey: `ub-product-${state.accountId}-${productId}`,
    body: {
      account_id: state.accountId,
      title: productTitle(productId),
      description: `${definition.credits} credits${
        definition.isSubscription ? " per month" : ""
      } on unbottled.ai`,
      visibility: WHOP_PRODUCT_VISIBILITY,
      metadata: { ubProductId: productId },
    },
  });
  if (!created.ok) {
    return created;
  }
  state.products.set(productId, created.data);
  return { ok: true, data: created.data };
}

/** Find (or create, unless create=false) the Whop variant for a spec. */
export async function ensureWhopVariant(
  spec: WhopVariantSpec,
  logger: EndpointLogger,
  options: { create: boolean } = { create: true },
): Promise<WhopResult<EnsuredWhopVariant>> {
  try {
    const catalog = await loadCatalog();
    if (!catalog.ok) {
      return catalog;
    }
    const state = catalog.data;
    const product = await ensureProduct(state, spec.productId, options.create);
    if (!product.ok) {
      return product;
    }
    const base = {
      key: spec.key,
      productId: spec.productId,
      interval: spec.interval,
      currency: spec.currency,
      amount: spec.amount,
    };
    const existing = state.variants.get(spec.key);
    if (existing) {
      return {
        ok: true,
        data: {
          ...base,
          whopProductId: product.data?.id ?? existing.product?.id ?? "",
          variantId: existing.id,
          purchaseUrl: existing.purchase_url ?? null,
          status: "existing",
        },
      };
    }
    if (!options.create || !product.data) {
      return {
        ok: true,
        data: {
          ...base,
          whopProductId: product.data?.id ?? "",
          variantId: "",
          purchaseUrl: null,
          status: "missing",
        },
      };
    }
    const recurring = spec.interval !== "one_time";
    const created = await whopRequest({
      method: "POST",
      path: "/variants",
      schema: whopVariantSchema,
      idempotencyKey: `ub-variant-v2-${state.accountId}-${spec.key}`,
      body: {
        account_id: state.accountId,
        product_id: product.data.id,
        title: variantTitle(spec),
        billing_type: recurring ? "renewal" : "one_time",
        ...(recurring
          ? {
              billing_period: spec.interval === "year" ? YEAR_DAYS : MONTH_DAYS,
              initial_price: 0,
              renewal_price: spec.amount,
            }
          : { initial_price: spec.amount }),
        currency: spec.currency,
        visibility: WHOP_VARIANT_VISIBILITY,
        unlimited_stock: true,
        metadata: { ubKey: spec.key, ubProductId: spec.productId },
      },
    });
    if (!created.ok) {
      return created;
    }
    state.variants.set(spec.key, created.data);
    logger.info("Created Whop variant", {
      key: spec.key,
      variantId: created.data.id,
    });
    return {
      ok: true,
      data: {
        ...base,
        whopProductId: product.data.id,
        variantId: created.data.id,
        purchaseUrl: created.data.purchase_url ?? null,
        status: "created",
      },
    };
  } catch (error) {
    return { ok: false, status: 0, message: parseError(error).message };
  }
}

/** Ensure (or with create=false list) the whole catalog. Idempotent. */
export async function ensureAllWhopVariants(
  logger: EndpointLogger,
  options: { create: boolean },
): Promise<WhopResult<EnsuredWhopVariant[]>> {
  // A dry run must see the live catalog, not a stale cache.
  resetWhopCatalogCache();
  const rows: EnsuredWhopVariant[] = [];
  for (const spec of allWhopVariantSpecs()) {
    const result = await ensureWhopVariant(spec, logger, options);
    if (!result.ok) {
      return result;
    }
    rows.push(result.data);
  }
  return { ok: true, data: rows };
}
