import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Konserwacja",
  },
  post: {
    title: "Czyszczenie mediów gości",
    titleShort: "Czyszczenie mediów gości",
    description:
      "Usuwa media wygenerowane przez gości w czatach incognito i samodzielnych uruchomieniach narzędzi po upływie okresu przechowywania. Tylko goście, którzy nigdy się nie zarejestrowali ani nie zalogowali. Zapisane wątki i pliki kont zostają nietknięte.",
    container: {
      title: "Czyszczenie mediów gości",
      description: "Uruchom lub sprawdź czyszczenie",
    },
    fields: {
      retentionDays: {
        label: "Przechowywanie (dni)",
        description: "Usuń media gości starsze niż ta liczba dni",
      },
      batchSize: {
        label: "Maks. usunięć",
        description:
          "Górny limit plików usuwanych w jednym przebiegu. Reszta poczeka na kolejny.",
      },
      dryRun: {
        label: "Próba na sucho",
        description:
          "Policz i zapisz w logu, co zostałoby usunięte, nic nie usuwaj",
      },
    },
    response: {
      cutoff: "Data graniczna",
      namespacesScanned: "Sprawdzone przestrzenie",
      storedThreadNamespaces: "Pominięte zapisane wątki",
      filesScanned: "Sprawdzone pliki",
      filesDeleted: "Usunięte pliki",
      bytesDeleted: "Usunięte bajty",
      skippedTooNew: "Zachowane: w okresie przechowywania",
      skippedUserOwned: "Zachowane: przypisane do konta",
      skippedUnowned: "Zachowane: bez właściciela",
      skippedAccountLead: "Zachowane: lead powiązany z kontem",
      deferred: "Przeniesione na kolejny przebieg",
      failed: "Nieudane",
      executionTimeMs: "Czas wykonania (ms)",
    },
    success: {
      title: "Czyszczenie zakończone",
      description: "Wygasłe media gości usunięte",
    },
  },
  errors: {
    failed: "Czyszczenie mediów gości nie powiodło się: {{error}}",
    server: {
      title: "Błąd czyszczenia",
      description: "Czyszczenie mediów gości nie powiodło się",
    },
  },
  task: {
    name: "Czyszczenie mediów gości",
    description:
      "Codzienne usuwanie wygasłych mediów gości z czatów incognito i samodzielnych uruchomień narzędzi",
  },
};
