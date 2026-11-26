import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Nieprawidłowe zapytanie",
      description: "Sprawdź zapytanie.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby otworzyć przegląd publikacji.",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Potrzebujesz roli admina",
    },
    notFound: {
      title: "Brak danych",
      description: "Brak danych o publikacjach w tej instancji.",
    },
    server: {
      title: "Przegląd publikacji",
      description: "Nie udało się wczytać przeglądu publikacji.",
    },
    network: {
      title: "Błąd sieci",
      description: "Brak połączenia z serwerem",
    },
    unknown: {
      title: "Przegląd publikacji",
      description: "Nie udało się wczytać przeglądu publikacji.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Żądanie koliduje z bieżącymi danymi",
    },
  },
  title: "Przegląd publikacji",
  description: "Publiczne forum i zapisane zgłoszenia IndexNow.",
  threads: "Publiczne wątki forum",
  savedUrls: "Zapisane adresy w IndexNow",
  snapshotOn: "Stan na {{date}} (UTC)",
  newestThread: "Najnowszy publiczny wątek",
  indexingSnapshot: "Stan IndexNow",
  newestOn: "Najnowszy publiczny wątek z {{date}}.",
  noThreads: "Na forum nie ma jeszcze publicznych wątków.",
  indexingSavedOn:
    "Ostatni zapis IndexNow: {{date}}. Wyszukiwarki osobno informują o indeksowaniu.",
  noIndexingSnapshot: "W tej instancji nie ma zapisanych zgłoszeń IndexNow.",
  noIndexingRecordsYet: "Brak zapisów",
  loading: "Wczytywanie przeglądu publikacji…",
};
