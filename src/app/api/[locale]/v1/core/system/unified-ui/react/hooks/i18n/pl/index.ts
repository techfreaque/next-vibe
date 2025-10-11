import { translations as endpointTranslations } from "../../endpoint/i18n/pl";
import { translations as mutationFormTranslations } from "../../mutation-form/i18n/pl";
import { translations as queryTranslations } from "../../query/i18n/pl";
import { translations as queryFormTranslations } from "../../query-form/i18n/pl";
import { translations as storeTranslations } from "../../store/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  endpoint: endpointTranslations,
  mutationForm: mutationFormTranslations,
  queryForm: queryFormTranslations,
  query: queryTranslations,
  store: storeTranslations,
};
