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
  apiUtils: {
    errors: {
      http_error: {
        title: "Błąd HTTP",
        description: "Nie udało się skomunikować z serwerem",
      },
      validation_error: {
        title: "Błąd walidacji",
        description: "Odpowiedź serwera nie mogła zostać zwalidowana",
      },
      internal_error: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił nieoczekiwany błąd",
      },
      auth_required: {
        title: "Wymagana autentykacja",
        description: "Musisz być zalogowany, aby wykonać tę akcję",
      },
    },
  },
};
