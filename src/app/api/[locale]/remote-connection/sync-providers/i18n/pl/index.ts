import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Zdalne połączenie",
  },
  providers: {
    memories: "Wspomnienia",
    documents: "Dokumenty",
    skills: "Umiejętności",
    favorites: "Ulubione",
    threads: "Wątki",
    chat: "Czat na żywo",
  },
  providerDescriptions: {
    memories: "Synchronizuj wspomnienia AI między instancjami",
    documents: "Synchronizuj bibliotekę dokumentów",
    skills: "Synchronizuj własne umiejętności i prompty",
    favorites: "Synchronizuj zapisane ulubione",
    threads: "Synchronizuj wątki rozmów",
    chat: "Przekazuj zdarzenia wiadomości na żywo w czasie rzeczywistym",
  },
  get: {
    title: "Dostawcy synchronizacji",
    titleShort: "Dostawcy sync",
    description: "Lista wszystkich zarejestrowanych dostawców synchronizacji",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: { title: "Błąd sieci", description: "Połączenie nieudane" },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak zarejestrowanych dostawców",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować dostawców",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
    },
    success: {
      title: "Dostawcy załadowani",
      description: "Lista dostawców synchronizacji pobrana pomyślnie",
    },
  },
};
