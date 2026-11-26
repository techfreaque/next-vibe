/**
 * Fiscal receipt policy: does a company need online fiscal receipts (eKasa),
 * and may its POS complete sales right now?
 *
 * Slovak companies (profile.fiscalReceipts === "EKASA") are blocked until an
 * enabled provider backed by a certified adapter with a valid certificate is
 * configured. Everyone else is never blocked; an enabled provider (e.g. the
 * dev sandbox) still gets receipts queued.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { db } from "next-vibe/database";

import { companies } from "@/companies/db";
import { getCountryProfile } from "@/tax/compliance/profiles";

import type { FiscalAdapterResolver } from "./adapter";
import { type PosFiscalProvider, posFiscalProviders } from "./db";
import { getFiscalAdapter } from "./registry";

export interface FiscalDecision {
  required: boolean;
  blocked: boolean;
  /** Queue a fiscal receipt for a completed sale. */
  enqueue: boolean;
  /** The provider can register real sales (certified and in date). */
  certified: boolean;
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Pure decision, unit tested. */
export function fiscalDecision(input: {
  country: string | null;
  provider: {
    adapter: string;
    isEnabled: boolean;
    certifiedUntil: string | null;
  } | null;
  resolveAdapter?: FiscalAdapterResolver;
  now?: Date;
}): FiscalDecision {
  const resolve = input.resolveAdapter ?? getFiscalAdapter;
  const required = getCountryProfile(input.country).fiscalReceipts === "EKASA";
  const provider = input.provider;
  const adapter = provider ? resolve(provider.adapter) : null;
  const inDate =
    !provider?.certifiedUntil ||
    provider.certifiedUntil >= isoDay(input.now ?? new Date());
  const certified = Boolean(adapter?.certified) && inDate;
  const active = Boolean(provider?.isEnabled && adapter);
  const blocked = required && !(active && certified);
  return {
    required,
    blocked,
    certified,
    enqueue: !blocked && active,
  };
}

interface PolicyOptions {
  resolveAdapter?: FiscalAdapterResolver;
  now?: Date;
}

async function loadFiscalState(
  reader: Pick<typeof db, "select">,
  companyId: string,
  options?: PolicyOptions,
): Promise<FiscalDecision & { provider: PosFiscalProvider | null }> {
  const [row] = await reader
    .select({ country: companies.country, provider: posFiscalProviders })
    .from(companies)
    .leftJoin(
      posFiscalProviders,
      eq(posFiscalProviders.companyId, companies.id),
    )
    .where(eq(companies.id, companyId))
    .limit(1);
  const provider = row?.provider ?? null;
  return {
    ...fiscalDecision({
      country: row?.country ?? null,
      provider,
      resolveAdapter: options?.resolveAdapter,
      now: options?.now,
    }),
    provider,
  };
}

/** Contract used by the tax compliance check (src/tax/compliance). */
export async function getFiscalRequirement(
  reader: Pick<typeof db, "select">,
  companyId: string,
  options?: PolicyOptions,
): Promise<{
  required: boolean;
  blocked: boolean;
  provider: PosFiscalProvider | null;
}> {
  const state = await loadFiscalState(reader, companyId, options);
  return {
    required: state.required,
    blocked: state.blocked,
    provider: state.provider,
  };
}

/** POS completion gate: requirement plus whether to queue a receipt. */
export async function requireFiscalProvider(
  reader: Pick<typeof db, "select">,
  companyId: string,
  options?: PolicyOptions,
): Promise<{
  required: boolean;
  blocked: boolean;
  enqueue: boolean;
  provider: PosFiscalProvider | null;
}> {
  const state = await loadFiscalState(reader, companyId, options);
  return {
    required: state.required,
    blocked: state.blocked,
    enqueue: state.enqueue,
    provider: state.provider,
  };
}
