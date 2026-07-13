import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

import { translations as enTranslations } from "./en";

export const scopedTranslation = createScopedTranslation({
  en: enTranslations,
  de: () =>
    require("next-vibe/dataflow/graphs/[id]/versions/i18n/de").translations,
  pl: () =>
    require("next-vibe/dataflow/graphs/[id]/versions/i18n/pl").translations,
});
