import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Wiadomości",
  id: {
    widget: {
      markRead: "Oznacz jako przeczytane",
      markUnread: "Oznacz jako nieprzeczytane",
      flag: "Oznacz",
      unflag: "Usuń oznaczenie",
    },
  },
  errors: {
    server: { title: "Błąd serwera" },
    notFound: { title: "Wiadomość nie znaleziona" },
    accountNotFound: { title: "Konto nie znalezione" },
    syncFailed: { title: "Synchronizacja nie powiodła się" },
    syncSuccess: { message: "Wiadomości zsynchronizowane pomyślnie" },
    list: {
      get: {
        errors: {
          server: { title: "Błąd serwera podczas wyświetlania wiadomości" },
        },
      },
    },
  },
};
