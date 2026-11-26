"use client";

import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { useMemo, useState } from "react";
import { z } from "zod";

import { TaxType } from "@/tax/enum";
import taxRatesDefinition from "@/tax/rate/list/definition";

export interface VatRateChoice {
  rate: number;
  name: string;
}

export function useDocumentVatPolicy(
  companyId: string | undefined,
  enabled: boolean,
): { choices: readonly VatRateChoice[]; exemptionNotice: string | null } {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const readEnabled = enabled && z.uuid().safeParse(companyId).success;
  // New documents only offer rates that legally apply today (for example
  // Slovakia 23 / 19 / 5 % since 2025, never the old 20 / 10 %).
  const [validOn] = useState(() => new Date().toISOString().slice(0, 10));
  const options = useMemo(
    () => ({
      read: {
        initialState: { companyId, type: TaxType.VAT, pageSize: 100, validOn },
        queryOptions: {
          enabled: readEnabled,
          queryKey: `document-vat-rates:${companyId ?? ""}:${validOn}`,
        },
      },
    }),
    [companyId, readEnabled, validOn],
  );
  const { read } = useEndpoint(taxRatesDefinition, options, logger, user);
  if (!readEnabled || !read?.data || read.isLoadingFresh) {
    return { choices: [], exemptionNotice: null };
  }
  const choices = new Map<number, VatRateChoice>();
  for (const rate of read.data.rates) {
    if (
      rate.isActive &&
      !rate.isCompound &&
      rate.type === TaxType.VAT &&
      Number.isFinite(rate.rate) &&
      rate.rate >= 0 &&
      rate.rate <= 1 &&
      !choices.has(rate.rate)
    ) {
      choices.set(rate.rate, { rate: rate.rate, name: rate.name });
    }
  }
  return {
    choices: [...choices.values()].toSorted((a, b) => a.rate - b.rate),
    exemptionNotice: read.data.salesExemptionNotice ?? null,
  };
}

export function useDocumentVatRates(
  companyId: string | undefined,
  enabled: boolean,
): readonly VatRateChoice[] {
  return useDocumentVatPolicy(companyId, enabled).choices;
}
