import { translations as listTranslations } from "../../list/i18n/de";
import { translations as syncTranslations } from "../../sync/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Ordner",
  list: listTranslations,
  sync: syncTranslations,
  errors: {
    server: { title: "Serverfehler" },
    notFound: { title: "Ordner nicht gefunden" },
    accountNotFound: { title: "Konto nicht gefunden" },
    syncFailed: { title: "Synchronisierung fehlgeschlagen" },
    missingAccount: { title: "Konto-ID ist erforderlich" },
  },
};
