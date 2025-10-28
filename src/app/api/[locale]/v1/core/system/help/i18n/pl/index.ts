export const translations = {
  category: "Pomoc i Dokumentacja",
  tag: "Pomoc",
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
    },
    title: {
      label: "Tytuł",
    },
    description: {
      label: "Opis",
    },
    usage: {
      title: "Użycie",
      patterns: "Wzorce użycia",
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
      category: "Kategoria",
      path: "Ścieżka",
      method: "Metoda",
      aliases: "Aliasy",
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
