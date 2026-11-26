/**
 * Fiscal adapter registry. Register certified provider adapters here.
 */

import type { FiscalProviderAdapter } from "./adapter";
import { sandboxFiscalAdapter } from "./adapters/sandbox";

const ADAPTERS: readonly FiscalProviderAdapter[] = [sandboxFiscalAdapter];

export function getFiscalAdapter(id: string): FiscalProviderAdapter | null {
  return ADAPTERS.find((adapter) => adapter.id === id) ?? null;
}

export function listFiscalAdapters(): readonly FiscalProviderAdapter[] {
  return ADAPTERS;
}
