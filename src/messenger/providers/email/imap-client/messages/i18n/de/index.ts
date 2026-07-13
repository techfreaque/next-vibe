import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Nachrichten",
  id: {
    widget: {
      markRead: "Als gelesen markieren",
      markUnread: "Als ungelesen markieren",
      flag: "Markieren",
      unflag: "Markierung entfernen",
    },
  },
  errors: {
    server: { title: "Serverfehler" },
    notFound: { title: "Nachricht nicht gefunden" },
    accountNotFound: { title: "Konto nicht gefunden" },
    syncFailed: { title: "Synchronisierung fehlgeschlagen" },
    syncSuccess: { message: "Nachrichten erfolgreich synchronisiert" },
    list: {
      get: {
        errors: {
          server: { title: "Serverfehler beim Auflisten von Nachrichten" },
        },
      },
    },
  },
};
