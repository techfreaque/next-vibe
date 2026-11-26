import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

const descriptionTranslations = createScopedTranslation({
  en: { reversal: "Reversal of {{entryNumber}}: {{description}}" },
  de: { reversal: "Storno zu {{entryNumber}}: {{description}}" },
  es: { reversal: "Reversión del asiento {{entryNumber}}: {{description}}" },
  fr: { reversal: "Contrepassation de {{entryNumber}} : {{description}}" },
  it: {
    reversal: "Storno della registrazione {{entryNumber}}: {{description}}",
  },
  pl: { reversal: "Storno zapisu {{entryNumber}}: {{description}}" },
  sk: { reversal: "Storno zápisu {{entryNumber}}: {{description}}" },
});

export function describeJournalReversal(
  locale: CountryLanguage,
  entryNumber: string,
  description: string,
): string {
  return descriptionTranslations.scopedT(locale).t("reversal", {
    entryNumber,
    description,
  });
}
