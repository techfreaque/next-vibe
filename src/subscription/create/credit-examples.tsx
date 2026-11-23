"use client";

/**
 * "What your credits buy": the picked plan's monthly credits turned into
 * messages for a few real models (the default model, the cheapest and the
 * most used uncensored ones, a premium mainstream one). Per-message costs come
 * from the model config through the same estimate the model pages use, so a
 * price change there shows up here without touching copy.
 */

import { DEFAULT_CHAT_MODEL_ID } from "next-vibe/agent/ai-stream/constants";
import {
  ChatModelId,
  chatModelOptionsIndex,
} from "next-vibe/agent/ai-stream/models";
import {
  CHAT_MESSAGE_PRICE_REFERENCE,
  estimateReferenceChatTurnCredits,
} from "next-vibe/agent/models/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { formatCreditAmount } from "@/products/credit-money";

import { scopedTranslation } from "../i18n";

/** Shown in this order; a model missing from the config is skipped. */
const EXAMPLE_MODEL_IDS = [
  DEFAULT_CHAT_MODEL_ID,
  ChatModelId.GLM_5_3_FLASH_UNCENSORED,
  ChatModelId.UNCENSORED_LM_V1_2,
  ChatModelId.CLAUDE_SONNET_5_5,
] as const;

export interface CreditExample {
  modelId: string;
  name: string;
  creditsPerMessage: number;
  messages: number;
}

/** Messages per month for each example model at a monthly credit budget. */
export function getCreditExamples(monthlyCredits: number): CreditExample[] {
  const seen = new Set<string>();
  const examples: CreditExample[] = [];
  for (const modelId of EXAMPLE_MODEL_IDS) {
    const model = chatModelOptionsIndex[modelId];
    if (!model || seen.has(modelId)) {
      continue;
    }
    seen.add(modelId);
    const creditsPerMessage = estimateReferenceChatTurnCredits(model);
    if (creditsPerMessage <= 0) {
      continue;
    }
    examples.push({
      modelId,
      name: model.name,
      creditsPerMessage,
      messages: Math.floor(monthlyCredits / creditsPerMessage),
    });
  }
  return examples;
}

export function CreditExamples({
  locale,
  monthlyCredits,
  creditsLabel,
}: {
  locale: CountryLanguage;
  monthlyCredits: number;
  creditsLabel: string;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const examples = getCreditExamples(monthlyCredits);
  if (examples.length === 0) {
    return null;
  }
  const numbers = new Intl.NumberFormat(getLanguageFromLocale(locale));

  return (
    <Div
      data-testid="credit-examples"
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:p-5"
    >
      <Div className="flex flex-col gap-0.5">
        <Span className="text-base font-semibold leading-tight">
          {t("tiers.examples.heading", { credits: creditsLabel })}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("tiers.examples.subheading")}
        </Span>
      </Div>
      <Div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {examples.map((example) => (
          <Div
            key={example.modelId}
            className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2.5"
          >
            <Div className="flex min-w-0 flex-col">
              <Span className="text-sm font-medium leading-snug">
                {example.name}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("tiers.examples.perMessage", {
                  credits: formatCreditAmount(
                    example.creditsPerMessage,
                    locale,
                  ),
                })}
              </Span>
            </Div>
            <Span className="shrink-0 text-right text-sm font-semibold tabular-nums">
              {t("tiers.examples.messages", {
                amount: numbers.format(example.messages),
              })}
            </Span>
          </Div>
        ))}
      </Div>
      <P className="m-0 text-xs text-muted-foreground">
        {t("tiers.examples.note", {
          input: numbers.format(CHAT_MESSAGE_PRICE_REFERENCE.inputTokens),
          output: numbers.format(CHAT_MESSAGE_PRICE_REFERENCE.outputTokens),
        })}
      </P>
    </Div>
  );
}
