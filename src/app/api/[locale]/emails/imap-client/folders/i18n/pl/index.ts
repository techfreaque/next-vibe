import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as syncTranslations } from "../../sync/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Foldery",
  list: listTranslations,
  sync: syncTranslations,
  errors: {
    server: { title: "Błąd serwera" },
    notFound: { title: "Folder nie znaleziony" },
    accountNotFound: { title: "Konto nie znalezione" },
    syncFailed: { title: "Synchronizacja nie powiodła się" },
    missingAccount: { title: "Wymagane ID konta" },
  },
};
