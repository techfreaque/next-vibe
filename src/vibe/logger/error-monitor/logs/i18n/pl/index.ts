import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "System",

  errors: {
    repositoryInternalError: "Wystąpił błąd wewnętrzny",
    fetchErrorLogs: "Nie udało się pobrać logów błędów: {{error}}",
    updateErrorLog: "Nie udało się zaktualizować statusu logu błędu: {{error}}",
    missingTarget: "Podaj fingerprint albo id.",
    idNotUnique:
      "Prefiks id {{id}} pasuje do {{count}} wierszy. Użyj fingerprintu albo pełnego id.",
  },

  statusFilter: {
    all: "Wszystkie",
    active: "Nierozwiązane",
    resolved: "Rozwiązane",
  },
  levelFilter: {
    all: "Wszystkie poziomy",
    error: "Błędy",
    warn: "Ostrzeżenia",
  },
  sourceFilter: {
    all: "Wszystkie źródła",
    client: "Przeglądarka",
    server: "Serwer",
  },
  trendSplit: {
    newVsRecurring: "Nowe vs powracające",
    level: "Poziom",
    source: "Źródło",
  },
  sort: {
    windowOccurrences: "Najwięcej trafień w okresie",
    lastSeen: "Ostatnio widziane",
    firstSeen: "Najnowsze",
    totalOccurrences: "Najwięcej trafień łącznie",
  },

  get: {
    title: "Logi błędów",
    titleShort: "Logi błędów",
    description:
      "Klasy błędów z dokładną liczbą otwartych, wystąpieniami w czasie, największymi winowajcami i dotkniętymi użytkownikami. Filtruj po okresie, statusie, poziomie, źródle, endpoincie lub tekście; rozwiązuj jednym kliknięciem.",
    tags: {
      monitoring: "Monitorowanie",
    },
    fields: {
      group: {
        label: "Grupuj podobne",
        description:
          "Jeden wiersz na komunikat: warianty na różnych trasach liczą się razem",
      },
      status: {
        label: "Status",
        description: "Filtruj według statusu rozwiązania",
      },
      search: {
        label: "Szukaj błędów",
        description: "Szukaj po komunikacie, odcisku lub ID wpisu",
        placeholder: "Szukaj po komunikacie, odcisku lub ID wpisu",
      },
      errorType: {
        label: "Typ błędu",
        description: "Filtruj według klasyfikacji typu błędu",
        placeholder: "np. INTERNAL_ERROR",
      },
      level: {
        label: "Poziom",
        description: "Błędy lub ostrzeżenia",
      },
      source: {
        label: "Źródło",
        description: "Zgłoszone w przeglądarce (client log) lub na serwerze",
      },
      endpoint: {
        label: "Endpoint lub trasa",
        description:
          "Ścieżka endpointu, alias lub trasa strony zawiera ten tekst",
        placeholder: "np. payment/providers",
      },
      fingerprint: {
        label: "Fingerprint",
        description: "Pokaż tylko jedną klasę błędu",
        placeholder: "Fingerprint",
      },
      split: {
        label: "Podział wykresu",
        description: "Jak wykres wystąpień układa słupki",
      },
      sort: {
        label: "Sortowanie",
        description: "Kolejność listy",
      },
      limit: {
        label: "Limit",
        description: "Liczba wyników do zwrócenia",
        placeholder: "50",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba wyników do pominięcia",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Wpisy logów błędów",
      },
      totalCount: {
        title: "Łączna liczba",
      },
      hasMore: {
        title: "Jest więcej",
      },
      unresolvedCount: {
        title: "Nierozwiązane błędy",
      },
      window: {
        title: "Okres",
      },
      kpis: {
        title: "Kluczowe liczby",
      },
      trend: {
        title: "Wystąpienia w czasie",
      },
      byEndpoint: {
        title: "Według endpointu",
      },
      historySince: {
        title: "Historia od",
      },
    },
    success: {
      title: "Logi pobrane",
      description: "Logi błędów pobrane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Dostęp odmówiony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono logów",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać logów błędów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        titleChanges: "Niezapisane zmiany",
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },

  patch: {
    title: "Aktualizuj log błędu",
    titleShort: "Aktualizuj log",
    description: "Rozwiąż lub otwórz ponownie log błędu według odcisku palca",
    tags: {
      monitoring: "Monitorowanie",
    },
    fields: {
      similarTo: {
        label: "Ten sam komunikat co",
        description:
          "Rozwiąż lub otwórz ponownie każdą klasę z tym samym komunikatem co ten fingerprint",
      },
      fingerprints: {
        label: "Fingerprinty",
        description:
          "Kilka fingerprintów naraz (zbiorcze rozwiązanie lub ponowne otwarcie, maks. 200)",
      },
      fingerprint: {
        label: "Odcisk palca",
        description:
          "Odcisk palca logu błędu (kolumna `fingerprint` na liście). Podaj go albo id.",
        placeholder: "Wprowadź odcisk palca",
      },
      id: {
        label: "ID logu",
        description:
          "ID wiersza z listy (pełny uuid albo jego pierwsze 8+ znaków). Zamiast odcisku palca.",
        placeholder: "np. c21bd4c7",
      },
      resolved: {
        label: "Rozwiązane",
        description:
          "Ustaw na prawda aby rozwiązać, fałsz aby otworzyć ponownie",
      },
    },
    response: {
      fingerprint: {
        title: "Odcisk palca",
      },
      resolved: {
        title: "Rozwiązane",
      },
      affectedRows: {
        title: "Zmienione wiersze",
      },
    },
    success: {
      title: "Log zaktualizowany",
      description: "Status logu błędu zaktualizowany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Odmowa dostępu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono logu błędu",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować logu błędu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        titleChanges: "Niezapisane zmiany",
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },

  post: {
    title: "Uruchom skan monitora błędów",
    description:
      "Skanuj wiadomości czatu i logi backendu w poszukiwaniu wzorców błędów",
    tags: {
      monitoring: "Monitorowanie",
    },
    response: {
      errorsFound: "Znalezione błędy",
      threadsScanned: "Zeskanowane wątki",
      scanWindowFrom: "Okno skanu od",
      scanWindowTo: "Okno skanu do",
      patterns: "Wzorce błędów",
    },
    success: {
      title: "Skan zakończony",
      description: "Skan monitora błędów zakończony pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Dostęp odmówiony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się uruchomić skanu monitora błędów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },

  errorMonitor: {
    name: "Monitor błędów",
    description: "Skanuje w poszukiwaniu wzorców błędów co 3 godziny",
  },

  widget: {
    subtitle:
      "Wszystkie błędy i ostrzeżenia pogrupowane w klasy. Oznacz naprawione jako rozwiązane; ponowne wystąpienie otwiera je znowu.",
    kpi: {
      unresolvedInScope: "Otwarte w tym widoku",
      unresolvedAllTimeLink:
        "Wszystkie otwarte klasy, błędy i ostrzeżenia, od początku: {{count}}",
      unresolvedMessages:
        "Komunikaty: {{messages}} · trafienia: {{occurrences}}",
      unresolvedMatching: "Nierozwiązane pasujące do filtrów: {{count}}",
      unresolved: "Nierozwiązane klasy (łącznie)",
      unresolvedHint: "{{occurrences}} trafień łącznie",
      unresolvedOutside: "{{count}} niewidzianych w tym okresie",
      occurrences: "Wystąpienia",
      newClasses: "Nowe klasy",
      activeClasses: "Trafione klasy",
      affectedUsers: "Dotknięci użytkownicy",
      affectedLeads: "Dotknięci odwiedzający",
    },
    chart: {
      noEndpoint: "Brak zapisanego endpointu",
      emptyFiltered: "Brak wystąpień pasujących do filtrów w tym okresie.",
      trendTitle: "Wystąpienia",
      trendSubtitle: "Kliknij słupek, aby zawęzić okres",
      endpointTitle: "Gdzie się sypie",
      endpointSubtitle:
        "Endpointy i trasy wg wystąpień. Kliknij wiersz, aby filtrować.",
      endpoint: "Endpoint / trasa",
      occurrences: "Wystąpienia",
      classes: "Klasy",
      unresolved: "Otwarte",
      historyNote:
        "Historia dzienna od {{date}}. Wcześniejsze trafienia liczą się tylko w sumach łącznych.",
      historyNone:
        "Brak historii dziennej. Sumy dla każdej klasy są nadal dokładne.",
    },
    series: {
      new: "Nowe",
      recurring: "Powracające",
      error: "Błędy",
      warn: "Ostrzeżenia",
      client: "Przeglądarka",
      server: "Serwer",
    },
    list: {
      viewGroup: "Pokaż {{count}}",
      noSession: "Brak kontekstu sesji",
      cliAct:
        "akcja: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "Status: {{status}}",
      groupSize: "Klasy: {{count}}",
      resolveGroup: "Rozwiąż wszystkie ({{count}})",
      reopenGroup: "Otwórz wszystkie ({{count}})",
      groupHint: "Zgrupowane wg komunikatu",
      subtitleGrouped: "Komunikaty w tym okresie: {{count}}",
      bulkResolveOf: "Rozwiąż {{shown}} z {{total}} pasujących",
      cliGroup:
        'Klasy: {{count}}. Lista: vibe error-logs --group=false --search="{{search}}" · Wszystkie: vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "Nic otwartego nie pasuje do filtrów.",
      allClearHint: "Wyczyść filtry, aby zobaczyć resztę.",
      similar: "+{{count}} podobne",
      cliFilters:
        "Filtry (wartości to pokazane klucze enum): --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<tekst> --search=<tekst>. Zbiorczo: vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "+{{count}} więcej",
      doneResolved: "Rozwiązano: {{label}}",
      doneReopened: "Otwarto ponownie: {{label}}",
      doneResolvedMany: "Rozwiązano klasy: {{count}}",
      doneReopenedMany: "Otwarto ponownie klasy: {{count}}",
      undo: "Cofnij",
      dismiss: "Zamknij",
      bulkResolve: "Rozwiąż wszystkie {{count}} widoczne",
      bulkConfirm: "Potwierdź: rozwiąż {{count}}",
      cliHits: "{{period}} w okresie / {{total}} łącznie",
      resolveFailed: "Nie zapisano. Spróbuj ponownie.",
      cliResolve:
        "Akcja: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "Rozwiąż: vibe update-error-log --fingerprint=<fingerprint> --resolved=true. Szczegóły: --fingerprint=<fingerprint>. Następna strona: --offset={{next}}",
      title: "Klasy błędów",
      subtitle: "{{count}} widzianych w tym okresie",
      hitsPeriod: "{{count}} w okresie",
      hitsTotal: "{{count}} łącznie",
      users: "Użytkownicy {{count}}",
      leads: "Odwiedzający {{count}}",
      firstSeen: "pierwszy {{date}}",
      lastSeen: "ostatni {{date}}",
      open: "Szczegóły",
      close: "Ukryj",
      focus: "Tylko ta",
      affected: "Dotknięci użytkownicy",
      affectedLeads: "Dotknięci odwiedzający",
      resolving: "Zapisywanie...",
    },
    filter: {
      apply: "Zastosuj filtry",
      more: "Filtry",
      moreCount: "Filtry ({{count}})",
      moreDescription: "Filtruj według stanu, ważności lub źródła.",
      fingerprint: "Klasa",
      endpoint: "Endpoint",
      search: "Szukaj",
      errorType: "Typ",
      status: "Status",
      level: "Poziom",
      source: "Źródło",
    },
    emptyFiltered: "Żadna grupa nie pasuje. Zmień lub wyczyść filtry.",
    emptyActive:
      "Brak aktywnych grup. Wybierz „Wszystkie”, aby przejrzeć rozwiązane błędy.",
    severity: {
      error: "Błąd",
      warning: "Ostrzeżenie",
    },
    title: "Logi błędów",
    loading: "Ładowanie logów...",
    empty: "Nie znaleziono logów błędów",
    header: {
      refresh: "Odśwież",
      runScan: "Uruchom skan",
      back: "Wstecz",
      activeCount: "Łącznie otwarte: {{count}}",
    },
    col: {
      message: "Wiadomość",
      errorType: "Typ błędu",
      occurrences: "Wystąpienia",
      firstSeen: "Pierwsze wystąpienie",
      createdAt: "Ostatnie wystąpienie",
    },
    status: {
      active: "Nierozwiązane",
      resolved: "Rozwiązany",
    },
    action: {
      confirm: "Zapisz stan",
      clear: "Wyczyść filtry",
      resolve: "Rozwiąż",
      reopen: "Otwórz ponownie",
    },
    detail: {
      context: "Szczegóły błędu",
      stackTrace: "Stack Trace",
      metadata: "Metadane",
      collapse: "Zwiń",
      resolved: "Rozwiązany",
    },
    source: {
      client: "Przeglądarka",
      server: "Serwer",
    },
    pagination: {
      matches: "Pasujące grupy: {{count}}",
      info: "Strona {{page}} z {{totalPages}} ({{total}} łącznie)",
      prev: "Poprzednia",
      next: "Następna",
    },
  },
};
