import { translations as endpointTranslations } from "../../endpoint/i18n/de";
import { translations as mutationFormTranslations } from "../../mutation-form/i18n/de";
import { translations as queryTranslations } from "../../query/i18n/de";
import { translations as queryFormTranslations } from "../../query-form/i18n/de";
import { translations as storeTranslations } from "../../store/i18n/de";
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
        title: "HTTP-Fehler",
        description: "Kommunikation mit dem Server fehlgeschlagen",
      },
      validation_error: {
        title: "Validierungsfehler",
        description: "Die Serverantwort konnte nicht validiert werden",
      },
      internal_error: {
        title: "Interner Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      auth_required: {
        title: "Authentifizierung erforderlich",
        description: "Sie müssen angemeldet sein, um diese Aktion auszuführen",
      },
    },
  },
};
