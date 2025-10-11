import type { translations as enTranslations } from "../en";

import { translations as retryTranslations  } from "../../retry/i18n/pl";
import { translations as stopTranslations  } from "../../stop/i18n/pl";

export const translations: typeof enTranslations = {
  retry: retryTranslations,
  stop: stopTranslations
} ;