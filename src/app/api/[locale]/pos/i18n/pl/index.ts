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

  dashboard: {
    get: {
      title: "Panel POS",
      titleShort: "Pulpit POS",
      description:
        "Przegląd terminali, otwartych sesji i dzisiejszej sprzedaży.",
      widget: {
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
      title: "Utwórz terminal",
      titleShort: "Utwórz terminal",
      description: "Zarejestruj nowy terminal POS dla firmy.",
      widget: {
        backToList: "Wróć do listy terminali",
        active: "Aktywny",
        inactive: "Nieaktywny",
        openSession: "Otwórz sesję",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, do której należy terminal",
      },
      name: {
        label: "Nazwa terminala",
        description: "Nazwa tego terminala",
        placeholder: "Główna kasa",
      },
      location: {
        label: "Lokalizacja",
        description: "Fizyczna lokalizacja terminala",
        placeholder: "Recepcja",
      },
      currency: {
        label: "Waluta",
        description: "Domyślna waluta (ISO 4217)",
        placeholder: "EUR",
      },
      cashAccountNodeId: {
        label: "Konto gotówkowe",
        description: "Węzeł konta dla kasy",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby tworzyć terminale",
        },
        forbidden: {
          title: "Wymagane uprawnienia admina",
          description: "Tylko admini mogą tworzyć terminale",
        },
        conflict: {
          title: "Konflikt",
          description: "Terminal o tej nazwie już istnieje",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć terminala — spróbuj ponownie",
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
          description: "Zasób nie został znaleziony",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Terminal utworzony",
        description: "Terminal został zarejestrowany",
      },
      response: {
        id: "ID terminala",
        name: "Nazwa terminala",
        companyId: "ID firmy",
        currency: "Waluta",
        isActive: "Aktywny",
      },
    },
  },

  terminalList: {
    get: {
      title: "Terminale",
      titleShort: "Terminale",
      description: "Wyświetl wszystkie terminale firmy.",
      widget: {
        active: "Aktywny",
        inactive: "Nieaktywny",
        total: "terminali",
        createTerminal: "Nowy terminal",
        empty: "Brak skonfigurowanych terminali.",
        emptyHint:
          "Terminale to fizyczne kasy w Twoim sklepie. Skontaktuj się z administratorem.",
        emptyContact: "Skontaktuj się z administratorem",
        openSession: "Otwórz sesję",
        selectCompany: "Ładowanie terminali...",
        selectCompanyHint: "Pobieranie twoich terminali.",
        loading: "Ładowanie terminali...",
        loadingHint: "Pobieranie twoich terminali.",
        refresh: "Odśwież",
        back: "Wróć",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, której terminale mają być wyświetlone",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić terminale",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować terminali",
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
          description: "Firma nie została znaleziona",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Terminale załadowane",
        description: "Lista terminali pobrana",
      },
      response: {
        id: "ID terminala",
        name: "Nazwa terminala",
        location: "Lokalizacja",
        currency: "Waluta",
        isActive: "Aktywny",
        createdAt: "Utworzono",
      },
    },
  },

  sessionOpen: {
    post: {
      title: "Otwórz sesję",
      titleShort: "Otwórz sesję",
      description: "Rozpocznij sesję kasjera na terminalu.",
      widget: {
        viewOrders: "Zobacz zamówienia",
        backToTerminals: "Wróć do terminali",
        selectTerminal: "Terminal gotowy",
        selectTerminalHint: "Ustaw kwotę otwarcia i otwórz sesję.",
        terminal: "Terminal",
        readyToOpen: "Gotowy",
        floatHint: "Policz gotówkę w kasie przed otwarciem.",
        startOrders: "Zacznij przyjmować zamówienia",
      },
      terminalId: {
        label: "ID terminala",
        description: "Terminal, na którym otwierana jest sesja",
      },
      openingFloat: {
        label: "Stan otwarcia",
        description: "Gotówka w kasie na początku sesji",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby otworzyć sesję",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego terminala",
        },
        conflict: {
          title: "Sesja już otwarta",
          description: "Ten terminal ma już otwartą sesję",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się otworzyć sesji",
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
          title: "Terminal nie znaleziony",
          description: "Terminal nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Sesja otwarta",
        description: "Sesja została pomyślnie rozpoczęta",
      },
      response: {
        id: "ID sesji",
        terminalId: "ID terminala",
        openedAt: "Otwarto o",
        status: "Status",
        openingFloat: "Stan otwarcia",
      },
    },
  },

  sessionClose: {
    post: {
      title: "Zamknij sesję",
      titleShort: "Zamknij sesję",
      description: "Zamknij sesję kasjera i zarejestruj stan końcowy kasy.",
      widget: {
        backToTerminals: "Wróć do terminali",
        sessionSummary: "Podsumowanie sesji",
        terminal: "Terminal",
        openedAt: "Otwarto o",
        orderCount: "Zamówienia",
        sessionRevenue: "Przychód",
        floatHint: "Policz gotówkę w kasie przed zamknięciem.",
        reconciliation: "Zamknięcie dnia",
        sessionReady: "Sesja",
        active: "Aktywna",
        openingFloat: "Stan otwarcia",
        cashSales: "Sprzedaż gotówkowa",
        expectedClosingFloat: "Oczekiwany stan zamknięcia",
        actualClosingFloat: "Faktyczny stan zamknięcia",
        variance: "Różnica",
        reconciliationTitle: "Rozliczenie kasy",
      },
      sessionId: { label: "ID sesji", description: "Sesja do zamknięcia" },
      closingFloat: {
        label: "Stan zamknięcia",
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
        variance: "Różnica",
        orderCount: "Liczba zamówień",
      },
    },
  },

  sessionGet: {
    get: {
      title: "Pobierz sesję",
      titleShort: "Szczegóły sesji",
      description: "Pobierz szczegóły konkretnej sesji.",
      widget: {
        viewOrders: "Zobacz zamówienia",
        closeSession: "Zamknij sesję",
        newOrder: "Nowe zamówienie",
        sessionDetails: "Szczegóły sesji",
        loading: "Ładowanie sesji...",
        back: "Wróć",
      },
      sessionId: { label: "ID sesji", description: "Sesja do pobrania" },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID sesji",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić sesje",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej sesji",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować sesji",
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
        title: "Sesja załadowana",
        description: "Szczegóły sesji pobrane",
      },
      response: {
        id: "ID sesji",
        terminalId: "ID terminala",
        cashierUserId: "Kasjer",
        status: "Status",
        openedAt: "Otwarto o",
        closedAt: "Zamknięto o",
        openingFloat: "Stan otwarcia",
        closingFloat: "Stan zamknięcia",
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
        noProductResults: "Brak wyników — wpisz ręcznie poniżej.",
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
        backToOrder: "Wróć do zamówienia",
      },
      orderId: {
        label: "ID zamówienia",
        description: "Zamówienie, z którego usuwana jest pozycja",
      },
      itemId: { label: "ID pozycji", description: "Pozycja do usunięcia" },
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
        backToList: "Wróć do listy zamówień",
      },
      orderId: {
        label: "ID zamówienia",
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
        addItem: "Dodaj pozycję",
        addPayment: "Dodaj płatność",
        complete: "Zakończ zamówienie",
        void: "Anuluj zamówienie",
        back: "Wróć",
        outstanding: "Pozostało",
        fullyPaid: "W pełni opłacone",
        qtyTimesPrice: "×",
        loading: "Ładowanie zamówienia...",
        noItems: "Brak pozycji — dodaj pierwszą.",
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
        newOrder: "Nowe zamówienie",
        empty: "Brak zamówień w tej sesji.",
        emptyHint: "Utwórz nowe zamówienie, aby zacząć sprzedawać.",
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
      titleShort: "Szukaj produktów",
      description: "Szukaj produktów w katalogu po nazwie lub SKU dla kasy.",
      widget: {
        noResults: "Brak produktów — spróbuj innego wyszukiwania.",
        tax: "VAT",
        back: "Wróć",
      },
      companyId: {
        label: "ID firmy",
        description: "Ogranicz wyszukiwanie do konkretnej firmy",
      },
      query: {
        label: "Szukaj",
        description: "Szukaj po nazwie produktu lub SKU",
        placeholder: "Kawa, BEV-001…",
      },
      page: { label: "Strona", description: "Numer strony (zaczyna się od 1)" },
      pageSize: {
        label: "Na stronie",
        description: "Wyniki na stronie (max 50)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Wpisz co najmniej jeden znak, aby wyszukać",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby szukać produktów",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się wyszukać produktów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: { title: "Nie znaleziono", description: "Brak produktów" },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Produkty znalezione",
        description: "Pasujące produkty pobrane",
      },
      response: {
        id: "ID produktu",
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
