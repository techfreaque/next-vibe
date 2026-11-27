import type { ChatModelOption } from "next-vibe/agent/ai-stream/models";
import {
  CHAT_MESSAGE_PRICE_REFERENCE,
  estimateReferenceChatTurnCredits,
  getEstimatedImageOutputTokens,
} from "next-vibe/agent/models/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { toIntlLocale } from "next-vibe/core/i18n/core/language-utils";

import { formatCreditAmount } from "@/products/credit-money";

export interface SkillMessagePrice {
  credits: number;
  creditLabel: string;
  basis: { input: string; output: string; includesImage: boolean } | null;
}

export function getSkillMessagePrice(
  model: ChatModelOption,
  locale: CountryLanguage,
): SkillMessagePrice {
  const credits = estimateReferenceChatTurnCredits(model);
  const creditLabel = formatCreditAmount(credits, locale);
  if (typeof model.creditCost === "number") {
    return { credits, creditLabel, basis: null };
  }

  const formatter = new Intl.NumberFormat(toIntlLocale(locale));
  return {
    credits,
    creditLabel,
    basis: {
      input: formatter.format(CHAT_MESSAGE_PRICE_REFERENCE.inputTokens),
      output: formatter.format(CHAT_MESSAGE_PRICE_REFERENCE.outputTokens),
      includesImage: getEstimatedImageOutputTokens(model) > 0,
    },
  };
}
