/**
 * Shared matcher for token-billed chat providers whose public /models endpoint
 * returns per-1M-token USD prices (Venice.ai, NanoGPT). Each fetcher parses its
 * own API shape into TokenPriceEntry; this walks our chat definitions for that
 * ApiProvider and emits price, context-window and modality updates.
 */

import "server-only";

import { chatModelDefinitions, ChatModelId } from "../../../ai-stream/models";
import type { Modality } from "../../enum";
import type { ApiProvider } from "../../models";
import type { TokenTariff } from "../../token-tariffs";
import type {
  ModalityUpdate,
  PriceFailure,
  PriceUpdate,
  SettingsUpdate,
} from "./base";
import { roundUpPrice, tariffLiteral } from "./base";

export interface TokenPriceEntry {
  /** USD per 1M input tokens */
  input: number;
  /** USD per 1M output tokens */
  output: number;
  cacheRead?: number;
  cacheWrite?: number;
  cacheWrite1h?: number;
  pricingTiers?: readonly TokenTariff[];
  /** Context window we can bill at a flat rate (already capped by the caller) */
  contextWindow?: number;
  inputs: Modality[];
  outputs: Modality[];
}

export interface TokenPriceCollection {
  updates: PriceUpdate[];
  settingsUpdates: SettingsUpdate[];
  modalityUpdates: ModalityUpdate[];
  failures: PriceFailure[];
}

/** USD per 1M tokens, rounded UP (never undercharge). */
function roundUsd(value: number): number {
  return roundUpPrice(value, 5);
}

export function collectTokenPriceUpdates(params: {
  apiProvider: ApiProvider;
  source: string;
  label: string;
  lookup: (providerModel: string) => TokenPriceEntry | undefined;
}): TokenPriceCollection {
  const { apiProvider, source, label, lookup } = params;
  const updates: PriceUpdate[] = [];
  const settingsUpdates: SettingsUpdate[] = [];
  const modalityUpdates: ModalityUpdate[] = [];
  const failures: PriceFailure[] = [];

  for (const def of Object.values(chatModelDefinitions)) {
    for (const providerConfig of def.providers) {
      if (providerConfig.apiProvider !== apiProvider) {
        continue;
      }
      if (!("inputTokenCost" in providerConfig)) {
        continue;
      }

      const entry = lookup(providerConfig.providerModel);
      if (!entry) {
        failures.push({
          modelId: providerConfig.id,
          provider: apiProvider,
          reason: `Not found in ${label} API (${providerConfig.providerModel})`,
        });
        continue;
      }

      const base = {
        modelId: providerConfig.id,
        name: def.name,
        provider: apiProvider,
        source,
        providerModel: providerConfig.providerModel,
      };
      updates.push(
        { ...base, field: "inputTokenCost", value: roundUsd(entry.input) },
        { ...base, field: "outputTokenCost", value: roundUsd(entry.output) },
      );
      for (const [field, rate] of [
        ["cacheReadTokenCost", entry.cacheRead],
        ["cacheWriteTokenCost", entry.cacheWrite],
        ["cacheWrite1hTokenCost", entry.cacheWrite1h],
      ] as const) {
        if (rate !== undefined) {
          updates.push({ ...base, field, value: roundUsd(rate) });
        }
      }

      const enumKey = Object.entries(ChatModelId).find(
        // oxlint-disable-next-line no-unused-vars
        ([_, value]) => value === providerConfig.id,
      )?.[0];
      if (
        enumKey &&
        entry.pricingTiers &&
        typeof providerConfig.inputTokenCost === "number" &&
        tariffLiteral(entry.pricingTiers) !==
          tariffLiteral(providerConfig.pricingTiers ?? [])
      ) {
        settingsUpdates.push({
          enumKey,
          apiProvider,
          providerModel: providerConfig.providerModel,
          field: "pricingTiers",
          source,
          tsLiteral: tariffLiteral(entry.pricingTiers),
        });
      }
      // Context window + modality are model-level facts: only the primary
      // (first-listed) provider writes them, so two fetchers never fight.
      if (!enumKey || def.providers[0]?.apiProvider !== apiProvider) {
        continue;
      }
      if (entry.contextWindow !== undefined) {
        updates.push({
          modelId: providerConfig.id,
          name: def.name,
          provider: apiProvider,
          field: "contextWindow",
          value: entry.contextWindow,
          source,
          enumKey,
        });
      }
      modalityUpdates.push({
        modelId: providerConfig.id,
        name: def.name,
        provider: apiProvider,
        enumKey,
        inputs: entry.inputs,
        outputs: entry.outputs,
        source,
      });
    }
  }

  return { updates, modalityUpdates, settingsUpdates, failures };
}
