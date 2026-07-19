import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pomoc i Dokumentacja",
  tag: "Pomoc",
  uncategorized: "Inne",
  get: {
    title: "Pomoc narzędzi - odkryj dostępne narzędzia",
    titleShort: "Pomoc narzędzia",
    description:
      "Wyszukuj i odkrywaj wszystkie dostępne narzędzia. Użyj query do wyszukiwania, category do filtrowania.",
    tags: {
      tools: "narzędzia",
    },
    fields: {
      interactive: {
        label: "Interaktywny",
        description: "Otwórz pełną interaktywną przeglądarkę narzędzi",
      },
      query: {
        label: "Zapytanie wyszukiwania (opcjonalne)",
        description:
          "Filtruj narzędzia po słowie kluczowym. Słowa oddzielone spacją są wszystkie wymagane. Wyszukuje po nazwie, aliasach, opisie, tagach - dopasowania nazwy/aliasu mają wyższy priorytet. Dokładne dopasowanie nazwy/aliasu automatycznie pokazuje pełne szczegóły. Pozostaw puste aby wyświetlić wszystkie.",
        placeholder: "np. pobierz url, generowanie obrazów...",
      },
      category: {
        label: "Filtr kategorii",
        description:
          "Filtruj narzędzia według kategorii lub podkategorii (bez rozróżniania wielkości liter). Przyjmuje klucz kategorii głównej (np. 'ai') lub nazwę podkategorii (np. 'Search'). Puste pole pokazuje przegląd kategorii.",
      },
      toolName: {
        label: "Nazwa narzędzia (szczegóły)",
        description: "Pobierz pełne szczegóły dla konkretnego narzędzia.",
      },
      page: {
        label: "Strona",
        description: "Numer strony dla wyników stronicowanych (domyślnie: 1)",
        title: "Bieżący numer strony",
      },
      pageSize: {
        label: "Rozmiar strony",
        description:
          "Liczba wyników na stronie. AI/MCP domyślnie: 25. Web/CLI: 200.",
        title: "Efektywny rozmiar strony",
      },
      tools: {
        title: "Dostępne narzędzia",
      },
      totalCount: {
        title: "Łączna liczba narzędzi",
      },
      matchedCount: {
        title: "Liczba dopasowanych narzędzi",
      },
      categories: {
        title: "Kategorie narzędzi",
      },
      hint: {
        title: "Wskazówka użycia",
      },
      pinnedCount: {
        title: "Przypięte narzędzia",
      },
      allowedCount: {
        title: "Dozwolone narzędzia",
      },
      webPinnedCount: {
        title: "Przypięte w sieci",
      },
      currentPage: {
        title: "Bieżąca strona",
      },
      effectivePageSize: {
        title: "Efektywny rozmiar strony",
      },
      totalPages: {
        title: "Łączna liczba stron",
      },
      parameters: {
        title: "Parametry",
      },
      aliases: {
        title: "Aliasy",
      },
      openTool: {
        label: "Otwórz narzędzie",
      },
      includeProdOnly: {
        label: "Uwzględnij narzędzia produkcyjne",
        description:
          "Gdy true, uwzględnia narzędzia oznaczone jako tylko-produkcyjne (tylko admin).",
      },
      platform: {
        label: "Platforma",
        description:
          "Filtruj narzędzia według platformy (tylko admin). Pokazuje narzędzia dostępne na wybranej platformie.",
      },
      platforms: {
        title: "Dostępne platformy",
      },
      viewAsRole: {
        label: "Widok jako rola",
        description:
          "Zobacz jakie narzędzia są widoczne dla danej roli użytkownika (tylko admin)",
        options: {
          admin: "Admin",
          customer: "Klient",
          public: "Publiczny",
        },
      },
      instanceId: {
        label: "ID instancji",
        description:
          "Filtruj do narzędzi z określonej zdalnej instancji. Zwraca narzędzia z przechowywanego snapshotu możliwości.",
      },
      pinnedToolIds: {
        label: "ID przypiętych narzędzi",
        description:
          "Opcjonalna lista ID narzędzi przypiętych przez użytkownika. Serwer filtruje do tych narzędzi, ale zwraca pełną łączną liczbę.",
      },
      statsFilter: {
        label: "Filtr narzędzi",
        description:
          "Pokaż wszystkie, tylko przypięte lub tylko dozwolone narzędzia",
      },
    },
    hints: {
      noCapabilitySnapshot:
        'Brak snapshotu możliwości dla instancji "{{instanceId}}". Połącz instancję i poczekaj na puls synchronizacji.',
      remoteFullSchema:
        'Pełny schemat dla {{count}} narzędzi z "{{instanceId}}". Wywołaj: execute-tool toolName="{{instanceId}}__<name>" input={...}.',
      remoteList:
        '{{matched}} z {{total}} narzędzi zdalnej instancji "{{instanceId}}". Ogranicz do ≤{{detailThreshold}} wyników dla pełnych schematów lub podaj toolName=.{{pagination}}',
      toolNotFound:
        'Narzędzie "{{name}}" nie znalezione. Użyj query do wyszukiwania po słowach kluczowych.',
      detailMode:
        'Wywołaj: execute-tool toolName="{{name}}"{{aliases}}. CLI: vibe {{name}} [--pole=wartość].',
      detailModeAliases: " (aliasy: {{aliases}})",
      noToolsMatched:
        "Brak wyników. Spróbuj szerszego zapytania lub wywołaj bez parametrów.",
      compactFullSchema:
        'Pełny schemat dla {{count}} narzędzi. Wywołaj: execute-tool toolName="<name>" input={...}.',
      compactCategoryOnly:
        '{{matched}} narzędzi w {{categories}} kategoriach. Użyj category="<name>" lub subCategory="<name>". Poniżej {{listThreshold}} wyników pokazuje nazwy; poniżej {{detailThreshold}} pełne schematy.',
      compactList:
        '{{matched}} narzędzi. Ogranicz do ≤{{detailThreshold}} dla schematów lub podaj toolName="<name>" dla szczegółów. Wywołaj: execute-tool toolName="<name>".{{pagination}}',
      cliFullDetail:
        "Pełne szczegóły dla {{count}} narzędzi. CLI: vibe <name> [--pole=wartość].",
      cliList:
        "Strona {{page}}/{{total}} – {{matched}} narzędzi. Szczegóły: vibe help <name>.",
      cliListSingle: "{{matched}} narzędzi. Szczegóły: vibe help <name>.",
      pagination:
        " Strona {{page}}/{{total}} – podaj page={{next}} aby kontynuować.",
      paginationCli: " – vibe help --page={{next}}",
    },
    success: {
      title: "Narzędzia pobrane pomyślnie",
      description: "Dostępne narzędzia zostały pobrane",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony dostęp",
        description: "Brak uprawnień do narzędzi",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Punkt końcowy narzędzi nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać narzędzi",
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
        description: "Wystąpił konflikt podczas pobierania narzędzi",
      },
    },
  },
  interactive: {
    post: {
      title: "Tryb interaktywny",
      description:
        "Uruchom interaktywny tryb eksploratora plików do nawigacji i wykonywania tras",
      category: "Pomoc systemowa",
      tags: {
        system: "system",
        help: "pomoc",
      },
      summary: "Uruchom tryb interaktywny",
    },
    ui: {
      title: "Interaktywny Eksplorator API",
      description: "Przeglądaj i wykonuj wszystkie",
      availableEndpoints: "dostępne punkty końcowe",
      endpointsLabel: "Punkty końcowe",
      aliasesLabel: "Aliasy:",
      selectEndpoint: "Wybierz punkt końcowy z listy, aby rozpocząć",
    },
    response: {
      started: "Tryb interaktywny uruchomiony pomyślnie",
    },
    errors: {
      cliOnly: {
        title: "Tylko CLI",
        description: "Tryb interaktywny jest dostępny tylko z CLI",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autentykacja dla trybu interaktywnego",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się uruchomić trybu interaktywnego",
      },
    },
    success: {
      title: "Sukces",
      description: "Tryb interaktywny uruchomiony pomyślnie",
    },
    grouping: {
      category: "Kategoria",
      tags: "Tagi",
      path: "Ścieżka",
    },
  },
  post: {
    title: "Pokaż informacje pomocy",
    description: "Wyświetl informacje pomocy dotyczące poleceń CLI",
    form: {
      title: "Opcje pomocy",
      description: "Uzyskaj pomoc dla konkretnych poleceń lub ogólne użycie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry pomocy",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się pobrać informacji pomocy",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do wyświetlania pomocy",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlania pomocy",
      },
      notFound: {
        title: "Polecenie nie znalezione",
        description: "Określone polecenie nie zostało znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wygenerować informacji pomocy",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas generowania pomocy",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt generowania pomocy",
      },
    },
    success: {
      title: "Pomoc wygenerowana",
      description: "Pomyślnie wygenerowano informacje pomocy",
    },
  },
  fields: {
    command: {
      label: "Polecenie",
      description:
        "Konkretne polecenie, dla którego uzyskać pomoc (pozostaw puste dla ogólnej pomocy)",
      placeholder: "np. check, list, db:ping",
    },
    header: {
      title: "Nagłówek",
      description: "Opis nagłówka",
    },
    title: {
      label: "Tytuł",
    },
    description: {
      label: "Opis",
    },
    usage: {
      title: "Użycie",
      patterns: {
        item: "Wzorzec",
      },
    },
    commonCommands: {
      title: "Popularne polecenia",
      items: "Polecenia",
      command: "Polecenie",
      description: "Opis",
    },
    options: {
      title: "Opcje",
      items: "Opcje",
      flag: "Flaga",
      description: "Opis",
    },
    examples: {
      title: "Przykłady",
      items: "Przykłady",
      command: "Polecenie",
      description: "Opis",
    },
    details: {
      title: "Szczegóły",
      category: {
        content: "Kategoria",
      },
      path: {
        content: "Ścieżka",
      },
      method: {
        content: "Metoda",
      },
      aliases: {
        content: "Aliasy",
      },
    },
  },
  aiTools: {
    modal: {
      webPinnedLabel: "web-piny",
      webPinnedTooltip: "Narzędzia przypięte na pasku bocznym",
      pinnedLabel: "przypięte",
      pinnedTooltip:
        "Przypięte narzędzia są zawsze w kontekście - AI widzi je przy każdym kroku",
      enabledLabel: "AI dozwolone",
      enabledTooltip:
        "Narzędzia dozwolone przez AI mogą być wywoływane na żądanie, gdy pomoc jest włączona",
      totalLabel: "łącznie",
      totalTooltip: "Pokaż wszystkie narzędzia - kliknij aby wyczyścić filtr",
      searchPlaceholder: "Szukaj narzędzi...",
      expandAll: "Rozwiń wszystkie",
      collapseAll: "Zwiń wszystkie",
      deselectAll: "Odznacz wszystkie",
      selectAll: "Zaznacz wszystkie",
      resetToDefault: "Przywróć domyślne",
      loading: "Ładowanie...",
      noToolsFound: "Nie znaleziono narzędzi",
      noToolsAvailable: "Brak dostępnych narzędzi AI",
      legendActive: "Zawsze w kontekście (przypięte)",
      legendConfirm: "Pyta przed uruchomieniem",
      legendWebPin: "Przypięte na pasku bocznym",
      stats: "{{pinned}} z {{total}} narzędzi przypiętych",
      activeOn:
        "Zawsze w kontekście AI — odepnij, żeby wywoływać tylko na żądanie",
      activeOff:
        "Poza kontekstem — przypnij, żeby AI widziało to przy każdej turze",
      confirmOn: "AI pyta przed uruchomieniem — kliknij żeby auto-zatwierdzać",
      confirmOff: "Działa bez pytania — kliknij żeby wymagać twojej zgody",
      closeSidebar: "Zamknij panel narzędzi",
      selectTool: "Wybierz narzędzie",
      selectToolHint: "Wybierz narzędzie z paska bocznego",
      allPlatforms: "Wszystkie platformy",
      prodOnly: "Tylko prod",
      adminFilters: "Filtry admina",
      resetPins: "Resetuj piny",
      aiPinsTitle: "Przypięte narzędzia AI",
      aiPinsDescription:
        "Te narzędzia są aktywne w każdej rozmowie z AI. AI może je wywoływać automatycznie — bez żadnych poleceń.",
      resetToDefaults: "Przywróć domyślne",
      noPinnedTools: "Brak przypiętych narzędzi",
      noPinnedToolsHint:
        "Przeglądaj wszystkie narzędzia i przypnij te, których chcesz używać z AI",
      webPinsDescription:
        "Skróty w sidebarze. Szybki dostęp do przypiętych narzędzi w panelu admina.",
      aiAllowedDescription:
        "Narzędzia, które AI może wywoływać na żądanie. Wszystko tutaj może być użyte, gdy AI uzna to za potrzebne.",
      noAllowedTools: "Brak dozwolonych narzędzi",
    },

    platformFilter: {
      all: "Wszystkie platformy",
      cli: "CLI",
      cliPackage: "CLI Pkg",
      mcp: "MCP",
      ai: "AI",
      web: "Web",
      cron: "Cron",
      electron: "Desktop",
      frame: "Frame",
      skill: "Skill",
      nextPage: "Next Page",
      nextApi: "Next API",
    },
    envFilter: {
      development: "Rozwojowe",
      production: "Produkcyjne",
    },
  },
  list: {
    post: {
      title: "Lista dostępnych poleceń",
      description:
        "Pokaż wszystkie dostępne polecenia CLI z opisami i aliasami",
      form: {
        title: "Opcje listy poleceń",
        description: "Skonfiguruj sposób wyświetlania poleceń",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry polecenia listy",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się pobrać listy poleceń",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do wyświetlania poleceń",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wyświetlania poleceń",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Lista poleceń nie została znaleziona",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się wygenerować listy poleceń",
          errorLoading: "Błąd podczas ładowania poleceń: {{error}}",
        },
        unknown: {
          title: "Nieznany błąd",
          description:
            "Wystąpił nieoczekiwany błąd podczas wyświetlania poleceń",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt listy poleceń",
        },
      },
      success: {
        title: "Polecenia wyświetlone",
        description: "Pomyślnie pobrano listę poleceń",
      },
    },
    tag: "Pomoc",
    fields: {
      category: {
        label: "Filtruj według kategorii",
        description: "Pokaż tylko polecenia z tej kategorii",
        placeholder: "np. system, database, user",
      },
      format: {
        label: "Format wyjściowy",
        description: "Sposób wyświetlania listy poleceń",
        options: {
          tree: "Widok drzewa (zagnieżdżona hierarchia)",
          flat: "Lista płaska (proste wyświetlanie)",
          json: "Format JSON (do parsowania)",
        },
      },
      showAliases: {
        label: "Pokaż aliasy",
        description: "Wyświetl wszystkie dostępne aliasy poleceń",
      },
      showDescriptions: {
        label: "Pokaż opisy",
        description: "Uwzględnij opisy poleceń w wyniku",
      },
      success: {
        label: "Sukces",
      },
      totalCommands: {
        label: "Łączna liczba poleceń",
        description: "Liczba dostępnych poleceń",
      },
      commandsText: {
        label: "Dostępne polecenia",
        description: "Sformatowana lista wszystkich dostępnych poleceń",
      },
      commands: {
        alias: "Alias polecenia",
        message: "Komunikat polecenia",
        description: "Opis polecenia",
        category: "Kategoria polecenia",
        aliases: "Aliasy polecenia",
        rule: "Reguła polecenia",
      },
    },
    response: {
      commands: {
        title: "Dostępne polecenia",
        emptyState: {
          description: "Nie znaleziono poleceń",
        },
        alias: "Polecenie",
        path: "Ścieżka API",
        method: "Metoda HTTP",
        category: "Kategoria",
        description: "Opis",
        aliases: "Aliasy",
      },
    },
  },
};
