import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt sprzedaży",
  tags: {
    pos: "POS",
    terminal: "Terminal",
    session: "Sesja",
    order: "Zamówienie",
    payment: "Płatność",
    create: "Utwórz",
    list: "Lista",
    get: "Pobierz",
    open: "Otwórz",
    close: "Zamknij",
    complete: "Zakończ",
    void: "Anuluj",
    addItem: "Dodaj pozycję",
    removeItem: "Usuń pozycję",
    addPayment: "Dodaj płatność",
  },
  endpointCategories: {
    pos: "Punkt sprzedaży",
    terminals: "Terminale",
    sessions: "Sesje",
    orders: "Zamówienia",
  },
  enums: {
    sessionStatus: {
      open: "Otwarta",
      closed: "Zamknięta",
    },
    orderStatus: {
      open: "Otwarte",
      completed: "Zakończone",
      voided: "Anulowane",
    },
    paymentMethod: {
      cash: "Gotówka",
      card: "Karta",
      transfer: "Przelew",
      other: "Inne",
    },
  },

  workflow: {
    backToSessionOrders: "Wróć do zamówień sesji",
    receiptTitle: "Paragon",
    amountDue: "Do zapłaty",
    ledgerCurrencyMismatch:
      "Waluta zamówienia różni się od waluty ksiąg. Przed przyjęciem płatności użyj kasy lub zamówienia w walucie ksiąg.",
    postingUnavailable:
      "Nie udało się zaksięgować sprzedaży. Sprawdź walutę firmy, otwarty okres i konta księgowe.",
    cashCurrencyMismatch:
      "Gotówkę przyjmuj w walucie kasy. Wybierz inną metodę płatności dla tego zamówienia.",
    tenderMinorUnits: "Wpisz kwotę z dokładnością do pełnych groszy.",
    legacyTenderReview:
      "Wcześniejsza płatność zawiera ułamek grosza. Sprawdź zapisaną płatność przed przyjęciem kolejnej.",
    legacyTenderRecorded:
      "To zamówienie zachowuje pierwotne kwoty z czterema miejscami po przecinku.",
    legacyPostingReview:
      "Nie można zaksięgować kwot zawierających ułamki grosza. Sprawdź pierwotną płatność przed zamknięciem sprzedaży.",
    viewReceipt: "Zobacz paragon",
    openDrawer: "Otwórz kasę",
    warehouse: "Magazyn sprzedaży",
    noWarehouse: "Nie przypisano magazynu",
    chooseCompanyFirst: "Najpierw wybierz firmę.",
    warehouseInstruction: "Wybierz aktywny magazyn wybranej firmy.",
    stockUnavailable:
      "W magazynie tej kasy brakuje dostępnych towarów. Przed zakończeniem sprzedaży sprawdź stan.",
  },
  dashboard: {
    get: {
      title: "Panel POS",
      titleShort: "Pulpit POS",
      description:
        "Przegląd terminali, otwartych sesji i dzisiejszej sprzedaży.",
      widget: {
        title: "Punkt sprzedaży",
        subtitle:
          "Otwórz kasę, sprzedawaj, zamknij zmianę z liczeniem gotówki.",
        salesHistory: "Historia sprzedaży",
        newTill: "Nowa kasa",
        kpiSalesToday: "Sprzedaż dziś",
        kpiSalesCount: "Sprzedaże: {{count}}",
        kpiOpenTills: "Otwarte kasy",
        kpiTillsTotal: "Aktywne: {{active}} z {{total}}",
        kpiAverage: "Średni paragon",
        kpiRefunds: "Zwroty dziś",
        kpiRefundsCount: "Zwroty: {{count}}",
        tillsTitle: "Kasy",
        manageTills: "Zarządzaj kasami",
        emptyTitle: "Brak kas",
        emptyMessage: "Dodaj kasę, aby sprzedawać przy ladzie.",
        createTill: "Dodaj kasę",
        tillSelling: "Sprzedaje",
        tillReady: "Gotowa",
        tillInactive: "Nieaktywna",
        openRegister: "Otwórz ekran kasy",
        openTill: "Otwórz kasę",
        closeTill: "Zamknij kasę",
        loading: "Ładowanie panelu...",
        loadingHint: "Pobieranie danych kasy.",
        kpiTerminals: "Terminale (aktywne / łącznie)",
        kpiOpenSessions: "Otwarte sesje",
        kpiTodayOrders: "Dzisiejsze zamówienia",
        kpiTodaySales: "Dzisiejszy przychód",
        terminalsHeading: "Terminale",
        refresh: "Odśwież",
        openSession: "Otwórz sesję",
        viewOrders: "Zamówienia",
        viewSession: "Zobacz sesję",
        allTerminals: "Wszystkie terminale",
        statusActive: "Aktywny",
        statusInactive: "Nieaktywny",
        statusSessionOpen: "Sesja otwarta",
        emptyTerminals: "Brak skonfigurowanych terminali.",
        emptyTerminalsHint:
          "Skontaktuj się z administratorem, aby skonfigurować terminale POS.",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić panel POS",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do danych kasy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować panelu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Brak danych kasy",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Panel załadowany",
        description: "Przegląd POS pobrany",
      },
      response: {
        terminalsTotal: "Łącznie terminali",
        terminalsActive: "Aktywne terminale",
        openSessionsCount: "Otwarte sesje",
        todayOrderCount: "Dzisiejsze zamówienia",
        todaySalesTotal: "Dzisiejszy przychód",
        refundsToday: "Zwroty dzisiaj",
        currency: "Waluta",
        terminalId: "ID terminala",
        terminalName: "Nazwa terminala",
        terminalLocation: "Lokalizacja",
        terminalCurrency: "Waluta",
        terminalIsActive: "Aktywny",
        terminalHasOpenSession: "Sesja otwarta",
        terminalOpenSessionId: "ID otwartej sesji",
      },
    },
  },

  terminalCreate: {
    post: {
      title: "Nowa kasa",
      titleShort: "Nowa kasa",
      description:
        "Dodaj kasę do firmy: nazwa, waluta, konto gotówkowe i magazyn.",
      widget: {
        title: "Nowa kasa",
        subtitle:
          "Kasa sprzedaje w jednej walucie, księguje gotówkę na jedno konto i wydaje towar z jednego magazynu.",
        subtitleCompany:
          "Dodajesz kasę do {{company}}. Sprzedaje w jednej walucie i księguje gotówkę na jedno konto.",
        back: "Wróć",
        backToList: "Wszystkie kasy",
        openTill: "Otwórz kasę",
        cancel: "Anuluj",
        submit: "Utwórz kasę",
        none: "Brak",
        sectionTill: "Kasa",
        sectionMoney: "Pieniądze",
        sectionMoneyHint:
          "W jakiej walucie sprzedaje kasa i gdzie trafia gotówka.",
        sectionStock: "Magazyn",
        sectionStockHint:
          "Zakończone sprzedaże zdejmują towar z tego magazynu. Pomiń, jeśli sprzedajesz tylko usługi.",
        defaultCashAccount: "Domyślne konto kasowe firmy",
        noWarehouse: "Bez ewidencji magazynowej",
        chooseCompanyFirst: "Najpierw wybierz firmę.",
      },
      companyId: {
        label: "Firma",
        description: "Firma, do której należy kasa",
      },
      name: {
        label: "Nazwa",
        description: "Widoczna na karcie kasy i na paragonach",
        placeholder: "Lada przy wejściu",
      },
      location: {
        label: "Lokalizacja",
        description: "Gdzie stoi kasa. Opcjonalnie.",
        placeholder: "Parter",
      },
      currency: {
        label: "Waluta",
        description: "Każda sprzedaż na tej kasie idzie w tej walucie",
        placeholder: "Wybierz walutę",
      },
      cashAccountNodeId: {
        label: "Konto gotówkowe",
        description: "Gotówka z tej kasy jest księgowana na to konto.",
        invalid: "Wybierz księgowalne konto kasowe lub bankowe tej firmy.",
      },
      warehouseId: {
        label: "Magazyn",
        description: "Po zakończeniu sprzedaży towar schodzi z tego magazynu.",
      },
      errors: {
        validation: {
          title: "Sprawdź kasę",
          description: "Podaj nazwę i wybierz walutę.",
        },
        unauthorized: {
          title: "Zaloguj się",
          description: "Zaloguj się, aby dodawać kasy.",
        },
        forbidden: {
          title: "Tylko dla adminów",
          description: "Kasy dodają tylko administratorzy firmy.",
        },
        conflict: {
          title: "Nazwa zajęta",
          description: "Kasa o tej nazwie już istnieje.",
        },
        server: {
          title: "Nie utworzono kasy",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        unknown: {
          title: "Nie utworzono kasy",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        network: {
          title: "Brak połączenia",
          description: "Sprawdź połączenie i spróbuj ponownie.",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Firma lub magazyn nie istnieje.",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zakończ lub odrzuć zmiany.",
        },
      },
      success: {
        title: "Kasa utworzona",
        description: "Przelicz gotówkę i otwórz kasę, aby zacząć sprzedaż.",
      },
      response: {
        id: "Kasa",
        name: "Nazwa",
        companyId: "Firma",
        currency: "Waluta",
        isActive: "Aktywna",
      },
    },
  },

  terminalList: {
    get: {
      title: "Kasy",
      titleShort: "Kasy",
      description:
        "Wszystkie kasy twoich firm i informacja, czy właśnie sprzedają.",
      widget: {
        title: "Kasy",
        pickTitle: "Wybierz kasę",
        subtitle:
          "Każda kasa przy twojej ladzie i informacja, czy właśnie sprzedaje.",
        summary: "Kasy: {{total}} · Sprzedają teraz: {{selling}}",
        newTill: "Nowa kasa",
        createTill: "Dodaj kasę",
        emptyTitle: "Brak kas",
        emptyMessage: "Dodaj kasę, aby sprzedawać przy ladzie.",
        selling: "Sprzedaje",
        ready: "Gotowa",
        inactive: "Nieaktywna",
        openRegister: "Otwórz ekran kasy",
        openTill: "Otwórz kasę",
        loading: "Ładowanie kas",
        back: "Wróć",
      },
      companyId: {
        label: "Firma",
        description: "Tylko kasy tej firmy",
      },
      terminalId: {
        label: "Kasa",
        description: "Tylko ta kasa",
      },
      errors: {
        validation: {
          title: "Sprawdź filtr",
          description: "Firma lub kasa jest nieprawidłowa.",
        },
        unauthorized: {
          title: "Zaloguj się",
          description: "Zaloguj się, aby zobaczyć kasy.",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie należysz do tej firmy.",
        },
        conflict: {
          title: "Konflikt",
          description: "Dane się zmieniły. Odśwież i spróbuj ponownie.",
        },
        server: {
          title: "Nie wczytano kas",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        unknown: {
          title: "Nie wczytano kas",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        network: {
          title: "Brak połączenia",
          description: "Sprawdź połączenie i spróbuj ponownie.",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Ta firma nie istnieje.",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zakończ lub odrzuć zmiany.",
        },
      },
      success: {
        title: "Kasy wczytane",
        description: "Lista kas jest aktualna.",
      },
      response: {
        id: "Kasa",
        name: "Nazwa",
        location: "Lokalizacja",
        currency: "Waluta",
        isActive: "Aktywna",
        companyName: "Firma",
        openSessionId: "Otwarta zmiana",
        createdAt: "Utworzono",
      },
    },
  },

  sessionOpen: {
    post: {
      title: "Otwórz kasę",
      titleShort: "Otwórz kasę",
      description:
        "Rozpocznij zmianę na kasie z przeliczoną gotówką w szufladzie.",
      widget: {
        title: "Otwórz kasę",
        subtitle: "Przelicz gotówkę w szufladzie i rozpocznij zmianę.",
        back: "Wróć",
        cancel: "Anuluj",
        loadingTill: "Ładowanie kasy",
        selling: "Sprzedaje",
        ready: "Gotowa",
        inactive: "Nieaktywna",
        alreadyOpen: "Ta kasa jest już otwarta. Sprzedawaj dalej.",
        openRegister: "Otwórz ekran kasy",
        floatHint:
          "Stan początkowy to twoje drobne. Przy zamknięciu kasy porównujemy z nim przeliczenie.",
      },
      terminalId: {
        label: "Kasa",
        description: "Kasa do otwarcia",
      },
      openingFloat: {
        label: "Stan początkowy",
        description: "Gotówka w szufladzie na start zmiany",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Sprawdź stan początkowy",
          description: "Podaj gotówkę w szufladzie, zero lub więcej.",
        },
        unauthorized: {
          title: "Zaloguj się",
          description: "Zaloguj się, aby otworzyć kasę.",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie należysz do firmy tej kasy.",
        },
        conflict: {
          title: "Kasa już otwarta",
          description: "Ta kasa ma już otwartą zmianę.",
        },
        server: {
          title: "Nie otwarto kasy",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        unknown: {
          title: "Nie otwarto kasy",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        network: {
          title: "Brak połączenia",
          description: "Sprawdź połączenie i spróbuj ponownie.",
        },
        notFound: {
          title: "Nie znaleziono kasy",
          description: "Ta kasa nie istnieje.",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zakończ lub odrzuć zmiany.",
        },
      },
      success: {
        title: "Kasa otwarta",
        description: "Zmiana trwa. Nabij pierwszą sprzedaż.",
      },
      response: {
        id: "Zmiana",
        terminalId: "Kasa",
        openedAt: "Otwarto",
        status: "Status",
        openingFloat: "Stan początkowy",
      },
    },
  },

  sessionClose: {
    post: {
      mixedCash:
        "Przed zamknięciem kasy rozlicz płatności gotówkowe w innej walucie.",
      title: "Zamknij sesję",
      titleShort: "Zamknij sesję",
      description: "Zamknij sesję kasjera i zarejestruj stan końcowy kasy.",
      widget: {
        backToTerminals: "Wróć",
        sessionSummary: "Podsumowanie sesji",
        terminal: "Terminal",
        openedAt: "Otwarto o",
        orderCount: "Zamówienia: {{count}}",
        sessionRevenue: "Przychód",
        floatHint: "Policz wszystkie banknoty i monety w szufladzie.",
        reconciliation: "Zamknięcie dnia",
        sessionReady: "Sesja",
        active: "Aktywna",
        openingFloat: "Stan początkowy",
        cashSales: "Sprzedaż gotówkowa",
        expectedClosingFloat: "Powinno być w kasie",
        actualClosingFloat: "Policzona gotówka",
        variance: "Różnica",
        reconciliationTitle: "Liczenie gotówki",
        title: "Zamknij kasę",
        subtitle: "{{terminal}} · otwarta od {{time}}",
        cashRefunds: "Zwroty gotówkowe",
        balanced: "Kasa się zgadza",
        over: "Nadwyżka {{amount}}",
        short: "Brakuje {{amount}}",
        openSaleBlocks:
          "Na tej kasie jest jeszcze otwarta sprzedaż. Zakończ ją lub anuluj na ekranie kasy, potem zamknij kasę.",
        backToPos: "Wróć do POS",
      },
      sessionId: { label: "ID sesji", description: "Sesja do zamknięcia" },
      closingFloat: {
        label: "Policzona gotówka",
        description: "Policzona gotówka przy zamknięciu",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby zamknąć sesję",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Możesz zamknąć tylko własną sesję",
        },
        conflict: {
          title: "Sesja już zamknięta",
          description: "Ta sesja jest już zamknięta",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zamknąć sesji",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Sesja nie znaleziona",
          description: "Sesja nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Sesja zamknięta",
        description: "Sesja została pomyślnie zamknięta",
      },
      response: {
        id: "ID sesji",
        status: "Status",
        closedAt: "Zamknięto o",
        closingFloat: "Stan zamknięcia",
        expectedFloat: "Oczekiwany stan",
        cashSalesTotal: "Sprzedaż gotówkowa",
        cashRefundsTotal: "Zwroty gotówki",
        openingFloat: "Stan otwarcia",
        variance: "Różnica",
        orderCount: "Liczba zamówień",
      },
    },
  },

  sessionGet: {
    get: {
      title: "Podsumowanie zmiany",
      titleShort: "Zmiana",
      description:
        "Jedna zmiana na kasie: kiedy się zaczęła, kto sprzedawał i ile powinno być w szufladzie.",
      widget: {
        title: "Zmiana",
        back: "Wróć",
        loading: "Ładowanie zmiany",
        selling: "Sprzedaje",
        closed: "Zamknięta",
        subtitleOpen: "Otwarta od {{time}}",
        subtitleClosed: "Zamknięta {{time}}",
        sales: "Sprzedaż",
        closeTill: "Zamknij kasę",
        openRegister: "Otwórz ekran kasy",
        drawerTitle: "Szuflada kasowa",
        variance: "Różnica",
        closeSession: "Zamknij kasę",
        newOrder: "Nowe zamówienie",
      },
      sessionId: {
        label: "Zmiana",
        description: "Zmiana do wyświetlenia",
      },
      errors: {
        validation: {
          title: "Sprawdź zmianę",
          description: "Ten link do zmiany jest nieprawidłowy.",
        },
        unauthorized: {
          title: "Zaloguj się",
          description: "Zaloguj się, aby zobaczyć zmiany.",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie należysz do firmy tej kasy.",
        },
        conflict: {
          title: "Konflikt",
          description: "Dane się zmieniły. Odśwież i spróbuj ponownie.",
        },
        server: {
          title: "Nie wczytano zmiany",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        unknown: {
          title: "Nie wczytano zmiany",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        network: {
          title: "Brak połączenia",
          description: "Sprawdź połączenie i spróbuj ponownie.",
        },
        notFound: {
          title: "Nie znaleziono zmiany",
          description: "Ta zmiana nie istnieje.",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zakończ lub odrzuć zmiany.",
        },
      },
      success: {
        title: "Zmiana wczytana",
        description: "Stan szuflady jest aktualny.",
      },
      response: {
        id: "Zmiana",
        terminalId: "Kasa",
        terminalName: "Kasa",
        companyName: "Firma",
        cashierUserId: "Kasjer",
        cashierName: "Kasjer",
        status: "Status",
        openedAt: "Otwarto",
        closedAt: "Zamknięto",
        openingFloat: "Stan początkowy",
        closingFloat: "Przeliczono przy zamknięciu",
        cashSalesTotal: "Sprzedaż gotówkowa",
        cashRefundsTotal: "Zwroty gotówkowe",
        expectedCash: "Oczekiwane w szufladzie",
      },
    },
  },

  orderCreate: {
    post: {
      title: "Utwórz zamówienie",
      titleShort: "Utwórz zamówienie",
      description: "Utwórz nowe zamówienie w otwartej sesji.",
      widget: {
        addItem: "Dodaj pozycję",
        viewOrder: "Zobacz zamówienie",
        creating: "Otwieranie zamówienia...",
        back: "Wróć",
      },
      sessionId: {
        label: "ID sesji",
        description: "Sesja, w której tworzone jest zamówienie",
      },
      customerId: {
        label: "ID klienta",
        description: "Opcjonalna referencja klienta",
      },
      currency: {
        label: "Waluta",
        description: "Waluta zamówienia",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby tworzyć zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej sesji",
        },
        conflict: {
          title: "Sesja zamknięta",
          description: "Nie można tworzyć zamówień w zamkniętej sesji",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć zamówienia",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Sesja nie znaleziona",
          description: "Sesja nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie utworzone",
        description: "Zamówienie zostało pomyślnie utworzone",
      },
      response: {
        id: "ID zamówienia",
        orderNumber: "Numer zamówienia",
        sessionId: "ID sesji",
        status: "Status",
        currency: "Waluta",
        total: "Razem",
      },
    },
  },

  orderAddItem: {
    post: {
      title: "Dodaj pozycję",
      titleShort: "Dodaj pozycję",
      description: "Dodaj pozycję do otwartego zamówienia.",
      widget: {
        backToOrder: "Wróć do zamówienia",
        linePreview: "Suma wiersza",
        taxNote: "z VAT",
        multiplier: "×",
        addAnother: "Dodaj kolejną pozycję",
        searchProduct: "Szukaj w katalogu produktów",
        searchPlaceholder: "Nazwa lub SKU…",
        orManual: "Lub wpisz ręcznie",
        selectedProduct: "Wybrany produkt",
        clearProduct: "Wyczyść",
        searchButton: "Szukaj",
        noProductResults: "Brak wyników. Wprowadź dane poniżej.",
      },
      orderId: {
        label: "ID zamówienia",
        description: "Zamówienie, do którego dodawana jest pozycja",
      },
      productId: {
        label: "ID produktu",
        description: "Opcjonalna referencja produktu",
      },
      itemDescription: {
        label: "Opis",
        description: "Opis pozycji",
        placeholder: "Kawa",
      },
      quantity: { label: "Ilość", description: "Ilość", placeholder: "1" },
      unitPrice: {
        label: "Cena jednostkowa",
        description: "Cena za jednostkę",
        placeholder: "3,50",
      },
      mergeWithLine: {
        label: "Dodaj do pasującej pozycji",
        description: "Zwiększa ilość istniejącej pozycji tego produktu",
      },
      taxRate: {
        label: "Stawka podatku",
        description: "Stawka podatku jako ułamek dziesiętny (np. 0,23 dla 23%)",
        placeholder: "0,23",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby dodawać pozycje",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Zamówienie nie jest otwarte",
          description: "Pozycje można dodawać tylko do otwartych zamówień",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się dodać pozycji",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Zamówienie nie znalezione",
          description: "Zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Pozycja dodana",
        description: "Pozycja dodana do zamówienia",
      },
      response: {
        id: "ID pozycji",
        description: "Opis",
        quantity: "Ilość",
        unitPrice: "Cena jednostkowa",
        taxAmount: "Kwota podatku",
        lineTotal: "Suma wiersza",
        orderTotal: "Suma zamówienia",
      },
    },
  },

  orderRemoveItem: {
    post: {
      title: "Usuń pozycję",
      titleShort: "Usuń pozycję",
      description: "Usuń pozycję z otwartego zamówienia.",
      widget: {
        chooseLine: "Wybierz pozycję",
        backToOrder: "Wróć do zamówienia",
      },
      orderId: {
        label: "Zamówienie",
        description: "Zamówienie, z którego usuwana jest pozycja",
      },
      quantity: {
        label: "Ilość do usunięcia",
        description: "Zostaw puste, aby usunąć całą pozycję",
      },
      itemId: { label: "Pozycja", description: "Pozycja do usunięcia" },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby usuwać pozycje",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Zamówienie nie jest otwarte",
          description: "Pozycje można usuwać tylko z otwartych zamówień",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się usunąć pozycji",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zamówienie lub pozycja nie zostały znalezione",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Pozycja usunięta",
        description: "Pozycja usunięta z zamówienia",
      },
      response: {
        orderId: "ID zamówienia",
        orderTotal: "Zaktualizowana suma",
      },
    },
  },

  orderComplete: {
    post: {
      title: "Zakończ zamówienie",
      titleShort: "Zakończ zamówienie",
      description:
        "Zakończ zamówienie. Weryfikuje pełną płatność i księguje wpis.",
      widget: {
        backToList: "Wróć do listy zamówień",
        confirmTitle: "Zakończyć to zamówienie?",
        confirmHint:
          "Tej operacji nie można cofnąć. Wszystkie płatności muszą być zebrane.",
        orderNumber: "Zamówienie",
        cancel: "Anuluj",
      },
      orderId: {
        label: "ID zamówienia",
        description: "Zamówienie do zakończenia",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zamówienia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby kończyć zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Niepełna płatność",
          description: "Suma płatności nie pokrywa wartości zamówienia",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zakończyć zamówienia",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Zamówienie nie znalezione",
          description: "Zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie zakończone",
        description: "Zamówienie zakończone i wpis zaksięgowany",
      },
      response: {
        id: "ID zamówienia",
        status: "Status",
        total: "Razem",
        journalEntryId: "ID wpisu księgowego",
      },
    },
  },

  orderVoid: {
    post: {
      title: "Anuluj zamówienie",
      titleShort: "Anuluj zamówienie",
      description: "Anuluj otwarte zamówienie. Tej operacji nie można cofnąć.",
      widget: {
        tendered:
          "Zarejestrowano już płatność. Zamówienie i jego pozycje są zablokowane do edycji.",
        closed: "To zamówienie jest zamknięte.",
        backToList: "Wróć do listy zamówień",
      },
      orderId: {
        label: "Zamówienie",
        description: "Zamówienie do anulowania",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zamówienia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby anulować zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Zamówienie nie jest otwarte",
          description: "Anulować można tylko otwarte zamówienia",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się anulować zamówienia",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Zamówienie nie znalezione",
          description: "Zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie anulowane",
        description: "Zamówienie zostało anulowane",
      },
      response: {
        id: "ID zamówienia",
        status: "Status",
      },
    },
  },

  orderGet: {
    get: {
      title: "Pobierz zamówienie",
      titleShort: "Szczegóły zamówienia",
      description: "Pobierz pojedyncze zamówienie z pozycjami i płatnościami.",
      widget: {
        refund: "Zwrot",
        addItem: "Dodaj pozycję",
        addPayment: "Dodaj płatność",
        complete: "Zakończ zamówienie",
        void: "Anuluj zamówienie",
        back: "Wróć",
        outstanding: "Pozostało",
        fullyPaid: "W pełni opłacone",
        qtyTimesPrice: "×",
        loading: "Ładowanie zamówienia...",
        noItems: "Dodaj pierwszą pozycję.",
        viewJournalEntry: "Pokaż wpis księgowy",
        voidedStamp: "ANULOWANE",
        completedReadOnly:
          "To zamówienie jest zakończone i nie można go modyfikować.",
        select: "Wybierz zamówienie",
      },
      orderId: {
        label: "ID zamówienia",
        description: "Zamówienie do pobrania",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zamówienia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby przeglądać zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować zamówienia",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Zamówienie nie znalezione",
          description: "Zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie załadowane",
        description: "Szczegóły zamówienia pobrane",
      },
      response: {
        id: "ID zamówienia",
        orderNumber: "Numer zamówienia",
        sessionId: "ID sesji",
        customerId: "ID klienta",
        status: "Status",
        currency: "Waluta",
        subtotal: "Suma częściowa",
        taxAmount: "Podatek",
        total: "Łącznie",
        journalEntryId: "ID wpisu dziennika",
        createdAt: "Utworzono",
        items: "Pozycje",
        itemId: "ID pozycji",
        productId: "ID produktu",
        description: "Opis",
        quantity: "Ilość",
        unitPrice: "Cena jednostkowa",
        taxRate: "Stawka podatku",
        taxAmountItem: "Podatek",
        lineTotal: "Suma wiersza",
        payments: "Płatności",
        paymentId: "ID płatności",
        method: "Metoda",
        amount: "Kwota",
        change: "Reszta",
        reference: "Referencja",
      },
    },
  },

  orderList: {
    get: {
      title: "Zamówienia",
      titleShort: "Zamówienia",
      description: "Lista zamówień dla sesji z opcjonalnym filtrem statusu.",
      widget: {
        title: "Sprzedaże",
        subtitleAll: "Cała sprzedaż kasowa, od najnowszej.",
        subtitleSession: "Sprzedaż tej zmiany, od najnowszej.",
        openRegister: "Otwórz ekran kasy",
        colSale: "Sprzedaż",
        colTime: "Czas",
        colStatus: "Status",
        colTotal: "Razem",
        count: "Sprzedaże: {{count}}",
        newOrder: "Nowe zamówienie",
        empty: "Brak sprzedaży",
        emptyHint: "Sprzedaż z kasy pojawi się tutaj razem z paragonem.",
        back: "Wróć",
        backToTerminals: "Wróć do terminali",
        selectSession: "Wybierz sesję",
        selectSessionHint: "Wpisz ID sesji, aby zobaczyć jej zamówienia.",
        sessionTotal: "Suma sesji",
        filterAll: "Wszystkie",
        loading: "Ładowanie zamówień...",
        ordersTotal: "zamówień",
        tapToView: "dotknij, aby otworzyć",
      },
      companyId: {
        label: "Firma",
        description: "Firma, której sprzedaż kasową pokazać",
      },
      sessionId: {
        label: "ID sesji",
        description: "Sesja, której zamówienia mają być wylistowane",
      },
      status: {
        label: "Status",
        description: "Filtruj według statusu zamówienia",
        placeholder: "Wszystkie statusy",
      },
      page: { label: "Strona", description: "Numer strony (zaczyna się od 1)" },
      pageSize: {
        label: "Na stronie",
        description: "Wyniki na stronie (max 100)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wylistować zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej sesji",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się wylistować zamówień",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Sesja nie znaleziona",
          description: "Sesja nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienia załadowane",
        description: "Lista zamówień pobrana",
      },
      response: {
        terminalName: "Kasa",
        count: "Łącznie",
        id: "ID zamówienia",
        orderNumber: "Numer zamówienia",
        sessionId: "ID sesji",
        status: "Status",
        currency: "Waluta",
        total: "Łącznie",
        createdAt: "Utworzono",
      },
    },
  },

  productLookup: {
    get: {
      title: "Wyszukiwanie produktów",
      titleShort: "Produkty",
      description:
        "Znajdź produkty z katalogu po nazwie lub SKU, z ceną i VAT.",
      widget: {
        title: "Produkty",
        pickTitle: "Wybierz produkt",
        subtitle:
          "Szukaj po nazwie lub SKU. Zeskanowany kod kreskowy trafia dokładnie.",
        back: "Wróć",
        loading: "Ładowanie produktów",
        emptyTitle: "Brak produktów",
        emptyMessage: "Produkty z katalogu pojawią się tu razem z ceną.",
        noMatchTitle: "Brak wyników dla „{{query}}”",
        noMatchMessage: "Sprawdź pisownię albo szukaj po SKU.",
        vat: "VAT {{rate}}",
        noVat: "Bez VAT",
        perUnit: "za {{unit}}",
      },
      companyId: {
        label: "Firma",
        description: "Tylko produkty tej firmy",
      },
      query: {
        label: "Szukaj produktów",
        description: "Nazwa produktu lub SKU. Zostaw puste, aby przeglądać.",
        placeholder: "Nazwa lub SKU",
      },
      currency: {
        label: "Waluta",
        description: "Tylko produkty wycenione w tej walucie",
      },
      page: {
        label: "Strona",
        description: "Numer strony, od 1",
      },
      pageSize: {
        label: "Na stronę",
        description: "Wyników na stronę, maksymalnie 50",
      },
      errors: {
        validation: {
          title: "Sprawdź wyszukiwanie",
          description: "Maksymalnie 120 znaków.",
        },
        unauthorized: {
          title: "Zaloguj się",
          description: "Zaloguj się, aby szukać produktów.",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie należysz do tej firmy.",
        },
        conflict: {
          title: "Konflikt",
          description: "Dane się zmieniły. Odśwież i spróbuj ponownie.",
        },
        server: {
          title: "Wyszukiwanie nieudane",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        unknown: {
          title: "Wyszukiwanie nieudane",
          description: "Coś poszło nie tak. Spróbuj ponownie.",
        },
        network: {
          title: "Brak połączenia",
          description: "Sprawdź połączenie i spróbuj ponownie.",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono produktów.",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zakończ lub odrzuć zmiany.",
        },
      },
      success: {
        title: "Znaleziono produkty",
        description: "Wyniki są aktualne.",
      },
      response: {
        id: "Produkt",
        name: "Nazwa",
        sku: "SKU",
        type: "Typ",
        basePrice: "Cena",
        currency: "Waluta",
        defaultTaxRate: "Stawka VAT",
        unit: "Jednostka",
      },
    },
  },

  orderAddPayment: {
    post: {
      title: "Dodaj płatność",
      titleShort: "Dodaj płatność",
      description: "Zarejestruj płatność za otwarte zamówienie.",
      widget: {
        fullyPaid: "W pełni opłacone",
        backToOrder: "Wróć do zamówienia",
        amountDue: "Do zapłaty",
        changeLabel: "Reszta",
        changeHint: "Zwróć klientowi",
        addAnotherPayment: "Dodaj kolejną płatność",
      },
      orderId: {
        label: "ID zamówienia",
        description: "Zamówienie do opłacenia",
      },
      method: {
        label: "Metoda płatności",
        description: "Sposób płatności klienta",
        placeholder: "Wybierz metodę",
      },
      amount: {
        label: "Kwota",
        description: "Wpłacona kwota",
        placeholder: "0,00",
      },
      change: {
        label: "Reszta",
        description: "Reszta dla klienta",
        placeholder: "0,00",
      },
      reference: {
        label: "Referencja",
        description: "Kod autoryzacji karty lub referencja przelewu",
      },
      accountNodeId: {
        label: "Węzeł konta",
        description: "Konto odbiorcze (nadpisuje domyślne terminala)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby dodawać płatności",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Zamówienie nie jest otwarte",
          description: "Płatności można dodawać tylko do otwartych zamówień",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zarejestrować płatności",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Zamówienie nie znalezione",
          description: "Zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Płatność zarejestrowana",
        description: "Płatność zapisana dla zamówienia",
      },
      response: {
        id: "ID płatności",
        method: "Metoda",
        amount: "Kwota",
        change: "Reszta",
        totalPaid: "Łącznie zapłacono",
        outstanding: "Pozostało",
      },
    },
  },
};
