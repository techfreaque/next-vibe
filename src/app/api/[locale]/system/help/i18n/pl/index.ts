import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pomoc i Dokumentacja",
  tag: "Pomoc",
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
