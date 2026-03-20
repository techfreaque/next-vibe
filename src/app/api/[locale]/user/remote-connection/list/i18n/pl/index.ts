import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  get: {
    title: "Połączenia zdalne",
    description: "Wylistuj wszystkie połączenia zdalne dla swojego konta",
    fields: {
      activeOnly: {
        label: "Tylko aktywne",
        description: "Zwróć tylko aktywne połączenia",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany, aby zobaczyć połączenia",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wylistować połączeń",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono połączeń",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
    },
    success: {
      title: "Połączenia wylistowane",
      description: "Połączenia zdalne pobrane",
    },
  },
  widget: {
    title: "Połączenia zdalne",
    addButton: "Dodaj połączenie",
    emptyState: "Brak połączeń zdalnych.",
    emptyStateCloud:
      "Połącz swoją lokalną instalację tutaj, gdy będzie gotowa. Wspomnienia i narzędzia synchronizują się automatycznie.",
    connectedBadge: "Połączono",
    registeredBadge: "Zarejestrowano",
    selfBadge: "Własne",
    lastSynced: "Ostatnia synchronizacja",
    never: "Nigdy",
    connectButton: "Połącz lokalną instancję",
    connectButtonLocal: "Połącz z chmurą",
    inactiveBadge: "Nieaktywna",
    instanceId: "ID instancji",
    remoteUrl: "Zdalny URL",
    viewButton: "Podgląd",
    editButton: "Zmień nazwę",
    deleteButton: "Rozłącz",
    cloud: {
      heroTitle: "Twoja AI. Wszędzie.",
      heroSubtitle:
        "unbottled.ai to twój mózg w chmurze. Dodaj lokalną instancję, a twoja AI działa na obu — wspomnienia synchronizują się, narzędzia działają na twoim komputerze.",
      benefit1: "Wspomnienia synchronizują się dwukierunkowo, automatycznie",
      benefit2: "AI w chmurze odkrywa i uruchamia twoje lokalne narzędzia",
      benefit3: "Deleguj zadania z chmury do swojego komputera",
      feature1Title: "Twoje narzędzia, twój komputer",
      feature1Body:
        "SSH, lokalne pliki, wykonywanie kodu — AI w chmurze automatycznie odkrywa i uruchamia twoje lokalne narzędzia. Bez przekierowania portów. Bez VPN.",
      feature2Title: "Wspólna pamięć",
      feature2Body:
        "Wszystko, co mówisz AI tutaj, synchronizuje się z twoją lokalną instancją. Kontekst podróżuje razem z tobą.",
      feature3Title: "Zero uzależnienia od dostawcy",
      feature3Body:
        "To jest open source. Zforkuj, hostuj sam, posiadaj każdą linię. Brak czarnej skrzynki.",
      feature4Title: "Jedno polecenie do startu",
      feature4Body:
        "Sklonuj repozytorium, dodaj klucz API, uruchom vibe dev. Twój osobisty stos AI działa w mniej niż minutę.",
      githubCta: "Zobacz na GitHub →",
      quickstartCta: "Przewodnik Quickstart",
      alreadyHaveLocal: "Masz już lokalną instancję?",
      alreadyHaveLocalSub:
        "Połącz się ze swojego lokalnego komputera — otwórz tam Połączenia zdalne i połącz z tą instancją w chmurze.",
      connectSectionTitle: "Połącz lokalną instancję",
    },
    local: {
      cloudTitle: "Połącz z chmurą",
      cloudSubtitle:
        "Połącz tę lokalną instancję z unbottled.ai (lub inną instancją w chmurze). Wspomnienia synchronizują się co 60 sekund, a Thea może odkrywać i uruchamiać twoje lokalne narzędzia.",
      benefit1: "Wspomnienia synchronizują się dwukierunkowo, automatycznie",
      benefit2: "AI w chmurze odkrywa i uruchamia twoje lokalne narzędzia",
      benefit3: "Deleguj zadania z chmury do tego komputera",
      noConnectionsYet: "Brak połączeń.",
      connectionsTitle: "Połączone instancje",
    },
    selfIdentity: {
      title: "Twoje ID instancji",
      description:
        "Inne instancje widzą ten serwer pod tym ID. Musi być unikalne wśród wszystkich połączonych instancji.",
    },
    syncSettings: {
      title: "Auto-synchronizacja",
      description:
        "Synchronizuj zadania i wspomnienia co minutę ze wszystkimi połączonymi instancjami",
      enabledBadge: "Aktywna",
      disabledBadge: "Nieaktywna",
      toggleLabel: "Przełącz auto-synchronizację",
    },
  },
};
