import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Podatki",
  endpointCategories: {
    tax: "Podatki",
    taxRates: "Stawki podatkowe",
    taxReports: "Raporty podatkowe",
  },

  rate: {
    create: {
      title: "Utwórz stawkę podatkową",
      description: "Dodaj stawkę podatkową dla swojej firmy",
      widget: {
        backToList: "Powrót do stawek podatkowych",
      },
      companyId: {
        label: "Firma",
        description: "Firma, do której należy ta stawka podatkowa",
        placeholder: "ID firmy",
      },
      name: {
        label: "Nazwa",
        description: "Opisowa nazwa stawki podatkowej",
        placeholder: "np. VAT 23%",
      },
      code: {
        label: "Kod",
        description: "Krótki identyfikator tej stawki podatkowej",
        placeholder: "np. PL-VAT23",
      },
      type: {
        label: "Typ podatku",
        description: "Kategoria podatku",
        placeholder: "Wybierz typ podatku",
      },
      rate: {
        label: "Stawka",
        description: "Stawka podatkowa jako ułamek dziesiętny (0,23 = 23%)",
        placeholder: "0.2300",
      },
      country: {
        label: "Kraj",
        description: "Kraj, w którym obowiązuje ta stawka (opcjonalnie)",
        placeholder: "np. PL",
      },
      region: {
        label: "Region",
        description: "Województwo lub region (opcjonalnie)",
        placeholder: "np. Mazowieckie",
      },
      isDefault: {
        label: "Stawka domyślna",
        description: "Użyj tej stawki jako domyślnej dla nowych pozycji",
      },
      response: {
        id: "ID stawki podatkowej",
        code: "Kod stawki podatkowej",
        name: "Nazwa stawki podatkowej",
      },
      success: {
        title: "Stawka podatkowa utworzona",
        description: "Stawka podatkowa została dodana do Twojej firmy",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź swoje dane i spróbuj ponownie",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie masz uprawnień do zarządzania stawkami podatkowymi",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Firma nie została znaleziona",
        },
        conflict: {
          title: "Duplikat kodu",
          description: "Stawka podatkowa o takim kodzie już istnieje",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd wewnętrzny",
        },
        network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
    },
    list: {
      title: "Stawki podatkowe",
      description: "Wszystkie stawki podatkowe skonfigurowane dla Twojej firmy",
      widget: {
        addRate: "Dodaj stawkę",
        labelDefault: "Domyślna",
        labelActive: "Aktywna",
        labelInactive: "Nieaktywna",
        labelEdit: "Edytuj",
        labelDelete: "Usuń",
        labelCompound: "Złożona",
        empty:
          "Brak skonfigurowanych stawek podatkowych. Dodaj pierwszą stawkę.",
        emptySetup:
          "Brak stawek podatkowych. Każda faktura wymaga stawki podatkowej — skonfiguruj teraz.",
        columnRate: "Stawka podatkowa",
        columnTypeRateActions: "Typ / Stawka / Status",
        backToCatalog: "← Produkty",
      },
      companyId: {
        label: "Firma",
        description: "Firma, której stawki podatkowe mają być wyświetlone",
        placeholder: "ID firmy",
      },
      country: {
        label: "Filtr kraju",
        description: "Filtruj według kodu kraju (opcjonalnie)",
        placeholder: "np. PL",
      },
      type: {
        label: "Filtr typu",
        description: "Filtruj według typu podatku (opcjonalnie)",
        placeholder: "Wybierz typ podatku",
      },
      page: {
        label: "Strona",
        description: "Numer strony (zaczyna się od 1)",
      },
      pageSize: {
        label: "Na stronie",
        description: "Wyniki na stronie (max 100)",
      },
      response: {
        total: "Łącznie",
        rates: "Stawki podatkowe",
        rate: {
          id: "ID",
          name: "Nazwa",
          code: "Kod",
          type: "Typ",
          rate: "Stawka",
          country: "Kraj",
          region: "Region",
          isDefault: "Domyślna",
          isActive: "Aktywna",
          isCompound: "Złożona",
          createdAt: "Utworzona",
          updatedAt: "Zaktualizowana",
        },
      },
      success: {
        title: "Stawki podatkowe załadowane",
        description: "Stawki podatkowe pobrane pomyślnie",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź swoje dane i spróbuj ponownie",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie masz uprawnień do przeglądania stawek podatkowych",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Firma nie została znaleziona",
        },
        conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd wewnętrzny",
        },
        network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
    },
    update: {
      title: "Aktualizuj stawkę podatkową",
      description: "Zmodyfikuj istniejącą stawkę podatkową",
      widget: {
        backToList: "Powrót do stawek podatkowych",
        failed: "Nie udało się",
      },
      rateId: {
        label: "ID stawki podatkowej",
        description: "ID stawki podatkowej do zaktualizowania",
        placeholder: "UUID stawki podatkowej",
      },
      name: {
        label: "Nazwa",
        description: "Zaktualizowana nazwa stawki podatkowej",
        placeholder: "np. VAT 23%",
      },
      rate: {
        label: "Stawka",
        description: "Zaktualizowana stawka podatkowa jako ułamek (0,23 = 23%)",
        placeholder: "0.2300",
      },
      isDefault: {
        label: "Stawka domyślna",
        description: "Użyj tej stawki jako domyślnej dla nowych pozycji",
      },
      isActive: {
        label: "Aktywna",
        description: "Czy ta stawka podatkowa jest obecnie aktywna",
      },
      response: {
        updated: "Zaktualizowano",
      },
      success: {
        title: "Stawka podatkowa zaktualizowana",
        description: "Stawka podatkowa została pomyślnie zaktualizowana",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź swoje dane i spróbuj ponownie",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie masz uprawnień do zarządzania stawkami podatkowymi",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Stawka podatkowa nie została znaleziona",
        },
        conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd wewnętrzny",
        },
        network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
    },
    delete: {
      title: "Usuń stawkę podatkową",
      description: "Dezaktywuj stawkę podatkową",
      widget: {
        backToList: "Powrót do stawek podatkowych",
        warning:
          "Stawka podatkowa zostanie dezaktywowana. Tej operacji nie można cofnąć.",
        confirmTitle: "Dezaktywować tę stawkę podatkową?",
        confirmDescription:
          "Dezaktywowane stawki nie mogą być stosowane do nowych faktur. Istniejące pozycje faktur pozostają bez zmian.",
        confirmButton: "Tak, dezaktywuj",
        cancelButton: "Anuluj",
      },
      rateId: {
        label: "ID stawki podatkowej",
        description: "ID stawki podatkowej do dezaktywacji",
        placeholder: "UUID stawki podatkowej",
      },
      response: {
        deleted: "Dezaktywowano",
      },
      success: {
        title: "Stawka podatkowa dezaktywowana",
        description: "Stawka podatkowa została dezaktywowana",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź swoje dane i spróbuj ponownie",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie masz uprawnień do zarządzania stawkami podatkowymi",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Stawka podatkowa nie została znaleziona",
        },
        conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd wewnętrzny",
        },
        network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
    },
  },

  report: {
    title: "Raport podatkowy",
    description: "Podatki zestawione według stawki i okresu",
    widget: {
      columnRate: "Stawka",
      total: "Łącznie",
      empty: "Brak danych podatkowych dla tego okresu.",
    },
    companyId: {
      label: "Firma",
      description: "Firma, dla której ma zostać wygenerowany raport",
      placeholder: "ID firmy",
    },
    dateFrom: {
      label: "Od",
      description: "Data początkowa okresu raportu",
      placeholder: "2024-01-01",
    },
    dateTo: {
      label: "Do",
      description: "Data końcowa okresu raportu",
      placeholder: "2024-12-31",
    },
    response: {
      rows: "Wiersze raportu",
      row: {
        taxRateCode: "Kod stawki podatkowej",
        taxRateName: "Nazwa stawki podatkowej",
        taxableAmount: "Podstawa opodatkowania",
        taxAmount: "Kwota podatku",
        period: "Okres",
      },
    },
    success: {
      title: "Raport podatkowy wygenerowany",
      description: "Raport podatkowy pobrany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź swoje dane i spróbuj ponownie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do przeglądania raportów podatkowych",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Firma nie została znaleziona",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
  },

  enums: {
    taxType: {
      vat: "VAT",
      gst: "GST",
      sales: "Podatek od sprzedaży",
      withholding: "Podatek u źródła",
      none: "Bez podatku / Zwolniony",
    },
  },

  tags: {
    tax: "podatek",
    rate: "stawka",
    create: "utwórz",
    list: "lista",
    update: "aktualizuj",
    delete: "dezaktywuj",
    report: "raport",
  },
};
