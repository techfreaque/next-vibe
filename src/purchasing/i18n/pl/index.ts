import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zakupy",
  tags: {
    purchasing: "Zakupy",
    vendor: "Dostawca",
    order: "Zamówienie zakupu",
    receipt: "Odbiór towaru",
    create: "Utwórz",
    list: "Lista",
    get: "Pobierz",
    update: "Aktualizuj",
    deactivate: "Dezaktywuj",
    send: "Wyślij",
    confirm: "Potwierdź",
    receive: "Odbierz",
    cancel: "Anuluj",
    convertToBill: "Konwertuj do faktury",
    addLine: "Dodaj pozycję",
    removeLine: "Usuń pozycję",
  },
  endpointCategories: {
    purchasing: "Zakupy",
    vendors: "Dostawcy",
    purchaseOrders: "Zamówienia zakupu",
    purchasingOrders: "Zamówienia zakupu",
    purchasingVendors: "Dostawcy",
  },
  enums: {
    poStatus: {
      draft: "Szkic",
      sent: "Wysłane",
      confirmed: "Potwierdzone",
      partiallyReceived: "Częściowo odebrane",
      received: "W pełni odebrane",
      billed: "Zafakturowane",
      cancelled: "Anulowane",
    },
  },

  vendorCreate: {
    post: {
      title: "Utwórz dostawcę",
      titleShort: "Utwórz dostawcę",
      description: "Zarejestruj nowego dostawcę dla swojej firmy.",
      widget: {
        back: "Wróć",
        viewVendor: "Otwórz dostawcę",
        createAnother: "Utwórz kolejnego",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wszystkie pola i spróbuj ponownie",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby dodać dostawcę",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Wymagana rola członka lub wyższa",
        },
        conflict: {
          title: "Kod już istnieje",
          description: "Dostawca z tym kodem już istnieje",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć dostawcy — spróbuj ponownie",
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
          description: "Firma nie znaleziona",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Dostawca utworzony",
        description: "Dostawca zarejestrowany pomyślnie",
      },
      response: {
        id: "ID dostawcy",
        name: "Nazwa",
        code: "Kod",
        email: "E-mail",
        isActive: "Aktywny",
        createdAt: "Utworzono",
      },
    },
    companyId: {
      label: "Firma",
      description: "Firma, do której należy dostawca",
      placeholder: "UUID firmy",
    },
    name: {
      label: "Nazwa dostawcy",
      description: "Oficjalna nazwa dostawcy",
      placeholder: "Acme Sp. z o.o.",
    },
    code: {
      label: "Kod",
      description: "Krótki identyfikator wewnętrzny (opcjonalnie)",
      placeholder: "ACM-001",
    },
    email: {
      label: "E-mail",
      description: "E-mail kontaktowy dostawcy",
      placeholder: "zamowienia@acme.pl",
    },
    phone: {
      label: "Telefon",
      description: "Numer telefonu dostawcy",
      placeholder: "+48 22 123 45 67",
    },
    website: {
      label: "Strona www",
      description: "Strona internetowa dostawcy",
      placeholder: "https://acme.pl",
    },
    vatNumber: {
      label: "NIP",
      description: "Numer identyfikacji podatkowej dostawcy",
      placeholder: "PL1234567890",
    },
    taxId: {
      label: "REGON",
      description: "Numer REGON dostawcy",
      placeholder: "123456789",
    },
    addressLine1: {
      label: "Adres — linia 1",
      description: "Ulica i numer",
      placeholder: "ul. Główna 1",
    },
    addressLine2: {
      label: "Adres — linia 2",
      description: "Piętro, biuro itp.",
      placeholder: "Piętro 2",
    },
    city: { label: "Miasto", description: "Miasto", placeholder: "Warszawa" },
    region: {
      label: "Województwo",
      description: "Województwo lub region",
      placeholder: "Mazowieckie",
    },
    postalCode: {
      label: "Kod pocztowy",
      description: "Kod pocztowy",
      placeholder: "00-001",
    },
    country: {
      label: "Kraj",
      description: "Kod kraju (ISO 3166-1 alpha-2)",
      placeholder: "PL",
    },
    defaultCurrency: {
      label: "Domyślna waluta",
      description: "Waluta zamówień do tego dostawcy",
      placeholder: "PLN",
    },
    defaultPaymentTermsDays: {
      label: "Termin płatności (dni)",
      description: "Domyślny termin płatności w dniach",
      placeholder: "30",
    },
    notes: {
      label: "Notatki",
      description: "Wewnętrzne notatki o dostawcy",
      placeholder: "Preferowany dostawca elektroniki",
    },
  },

  vendorList: {
    get: {
      title: "Dostawcy",
      titleShort: "Dostawcy",
      description: "Wyświetl wszystkich dostawców firmy.",
      widget: {
        back: "Wróć",
        active: "Aktywny",
        inactive: "Nieaktywny",
        total: "łącznie",
        createVendor: "Nowy dostawca",
        empty: "Brak dostawców. Dodaj pierwszego.",
        vatLabel: "NIP",
        vatPrefix: "NIP:",
        paymentTerms: "Net {{days}} dni",
        paymentTermsPrefix: "Net",
        paymentTermsSuffix: "d",
        loading: "Wczytywanie…",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić dostawców",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować dostawców",
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
          description: "Firma nie znaleziona",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Dostawcy załadowani",
        description: "Lista dostawców pobrana",
      },
      response: {
        id: "ID dostawcy",
        name: "Nazwa",
        code: "Kod",
        email: "E-mail",
        vatNumber: "NIP",
        defaultCurrency: "Waluta",
        defaultPaymentTermsDays: "Termin płatności",
        isActive: "Aktywny",
        createdAt: "Utworzono",
      },
    },
    companyId: {
      label: "Firma",
      description: "Firma, której dostawcy mają być wyświetleni",
    },
  },

  vendorGet: {
    get: {
      title: "Pobierz dostawcę",
      titleShort: "Szczegóły dostawcy",
      description: "Pobierz pełne dane dostawcy.",
      widget: {
        back: "Wróć",
        edit: "Edytuj dostawcę",
        createOrder: "Nowe zamówienie",
        viewOrders: "Pokaż zamówienia",
        deactivate: "Dezaktywuj",
        select: "Wybierz dostawcę",
      },
      vendorId: { label: "ID dostawcy", description: "Dostawca do pobrania" },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID dostawcy",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić dostawców",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego dostawcy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować dostawcy",
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
          title: "Dostawca nie znaleziony",
          description: "Ten dostawca nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Dostawca załadowany",
        description: "Dane dostawcy pobrane",
      },
      response: {
        id: "ID dostawcy",
        companyId: "ID firmy",
        name: "Nazwa",
        code: "Kod",
        email: "E-mail",
        phone: "Telefon",
        website: "Strona www",
        vatNumber: "NIP",
        taxId: "REGON",
        addressLine1: "Adres",
        addressLine2: "Adres — linia 2",
        city: "Miasto",
        region: "Województwo",
        postalCode: "Kod pocztowy",
        country: "Kraj",
        defaultCurrency: "Domyślna waluta",
        defaultPaymentTermsDays: "Termin płatności (dni)",
        isActive: "Aktywny",
        notes: "Notatki",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
  },

  vendorUpdate: {
    patch: {
      title: "Aktualizuj dostawcę",
      titleShort: "Zaktualizuj dostawcę",
      description: "Edytuj dane dostawcy.",
      widget: {
        backToVendor: "Powrót do dostawcy",
        viewVendor: "Wyświetl dostawcę",
      },
      vendorId: { label: "ID dostawcy", description: "Dostawca do edycji" },
      name: {
        label: "Nazwa dostawcy",
        description: "Oficjalna nazwa dostawcy",
        placeholder: "Acme Sp. z o.o.",
      },
      code: {
        label: "Kod",
        description: "Krótki identyfikator wewnętrzny",
        placeholder: "ACM-001",
      },
      email: {
        label: "E-mail",
        description: "E-mail kontaktowy",
        placeholder: "zamowienia@acme.pl",
      },
      phone: {
        label: "Telefon",
        description: "Numer telefonu",
        placeholder: "+48 22 123 45 67",
      },
      website: {
        label: "Strona www",
        description: "Strona internetowa dostawcy",
        placeholder: "https://acme.pl",
      },
      vatNumber: {
        label: "NIP",
        description: "Numer identyfikacji podatkowej",
        placeholder: "PL1234567890",
      },
      taxId: {
        label: "REGON",
        description: "Numer REGON",
        placeholder: "123456789",
      },
      addressLine1: {
        label: "Adres — linia 1",
        description: "Ulica i numer",
        placeholder: "ul. Główna 1",
      },
      addressLine2: {
        label: "Adres — linia 2",
        description: "Piętro, biuro itp.",
        placeholder: "Piętro 2",
      },
      city: { label: "Miasto", description: "Miasto", placeholder: "Warszawa" },
      region: {
        label: "Województwo",
        description: "Województwo lub region",
        placeholder: "Mazowieckie",
      },
      postalCode: {
        label: "Kod pocztowy",
        description: "Kod pocztowy",
        placeholder: "00-001",
      },
      country: { label: "Kraj", description: "Kod kraju", placeholder: "PL" },
      defaultCurrency: {
        label: "Domyślna waluta",
        description: "Waluta zamówień",
        placeholder: "PLN",
      },
      defaultPaymentTermsDays: {
        label: "Termin płatności (dni)",
        description: "Domyślny termin płatności",
        placeholder: "30",
      },
      notes: {
        label: "Notatki",
        description: "Wewnętrzne notatki",
        placeholder: "Preferowany dostawca",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby edytować dostawców",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego dostawcy",
        },
        conflict: {
          title: "Konflikt kodu",
          description: "Ten kod dostawcy jest już zajęty",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zaktualizować dostawcy",
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
          title: "Dostawca nie znaleziony",
          description: "Ten dostawca nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Dostawca zaktualizowany",
        description: "Dane dostawcy zapisane",
      },
      response: {
        id: "ID dostawcy",
        name: "Nazwa",
        isActive: "Aktywny",
        updatedAt: "Zaktualizowano",
      },
    },
  },

  vendorDeactivate: {
    post: {
      title: "Dezaktywuj dostawcę",
      titleShort: "Dezaktywuj",
      description:
        "Oznacz dostawcę jako nieaktywnego. Istniejące zamówienia nie zostaną zmienione.",
      vendorId: {
        label: "ID dostawcy",
        description: "Dostawca do dezaktywacji",
      },
      widget: {
        warning:
          "Dostawca zostanie dezaktywowany. Istniejące zamówienia nie zostaną zmienione.",
        backToList: "Powrót do dostawców",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID dostawcy",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby dezaktywować dostawców",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego dostawcy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się dezaktywować dostawcy",
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
          title: "Dostawca nie znaleziony",
          description: "Ten dostawca nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Dostawca dezaktywowany",
        description: "Dostawca jest teraz nieaktywny",
      },
      response: {
        id: "ID dostawcy",
        isActive: "Aktywny",
      },
    },
  },

  orderCreate: {
    post: {
      title: "Utwórz zamówienie zakupu",
      titleShort: "Utwórz zamówienie",
      description: "Nowe zamówienie zakupu w statusie Szkic.",
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wszystkie pola i spróbuj ponownie",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby tworzyć zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Wymagana rola członka lub wyższa",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć zamówienia — spróbuj ponownie",
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
          description: "Dostawca lub firma nie znaleziona",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie utworzone",
        description: "Zamówienie zakupu w statusie Szkic",
      },
      widget: {
        browseVendors: "Przeglądaj dostawców",
        browseWarehouses: "Przeglądaj magazyny",
        viewOrder: "Otwórz zamówienie",
        backToList: "Powrót do listy",
      },
      response: {
        id: "ID zamówienia",
        poNumber: "Numer zamówienia",
        status: "Status",
        subtotal: "Suma netto",
        taxAmount: "VAT",
        total: "Łącznie",
        createdAt: "Utworzono",
      },
    },
    companyId: {
      label: "Firma",
      description: "Firma składająca zamówienie",
      placeholder: "UUID firmy",
    },
    vendorId: {
      label: "Dostawca",
      description: "Dostawca odbierający zamówienie",
      placeholder: "UUID dostawcy",
    },
    currency: {
      label: "Waluta",
      description: "Waluta zamówienia",
      placeholder: "PLN",
    },
    expectedDeliveryDate: {
      label: "Oczekiwana dostawa",
      description: "Oczekiwana data dostawy (opcjonalnie)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "Magazyn dostawy",
      description: "Magazyn do przyjęcia towaru (opcjonalnie)",
      placeholder: "UUID magazynu",
    },
    notes: {
      label: "Notatki",
      description: "Notatki wewnętrzne do zamówienia",
      placeholder: "Pilne zamówienie",
    },
    lines: { label: "Pozycje", description: "Zamówione produkty i ilości" },
    lineDescription: {
      label: "Opis",
      description: "Opis artykułu",
      placeholder: "Krzesła biurowe",
    },
    lineProductId: {
      label: "ID produktu",
      description: "Produkt katalogowy (opcjonalnie)",
      placeholder: "UUID produktu",
    },
    lineQuantity: {
      label: "Ilość",
      description: "Liczba jednostek",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "Cena jednostkowa",
      description: "Cena za jednostkę",
      placeholder: "99,00",
    },
    lineTaxRate: {
      label: "Stawka VAT",
      description: "Stawka VAT jako ułamek dziesiętny (np. 0,23 = 23%)",
      placeholder: "0,23",
    },
    lineSortOrder: {
      label: "Kolejność",
      description: "Kolejność wyświetlania pozycji",
      placeholder: "0",
    },
  },

  orderList: {
    get: {
      title: "Zamówienia zakupu",
      titleShort: "Zamówienia",
      description: "Lista zamówień zakupu firmy z opcjonalnym filtrem statusu.",
      widget: {
        newOrder: "Nowe zamówienie",
        empty: "Brak zamówień zakupu.",
        statusAll: "Wszystkie",
        orders: "zamówień",
        order: "zamówienie",
        colPoVendor: "ZZ / Dostawca",
        colDate: "Data",
        colAmount: "Kwota",
        colStatus: "Status",
        deliveryArrow: "→",
        overdue: "po terminie",
        actionNeeded: "zamówień wymaga uwagi",
        back: "Wróć",
        loading: "Wczytywanie…",
      },
      companyId: {
        label: "Firma",
        description: "Firma, której zamówienia mają być wyświetlone",
      },
      status: {
        label: "Filtr statusu",
        description: "Filtruj wg statusu zamówienia (opcjonalnie)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować zamówień",
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
          description: "Firma nie znaleziona",
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
        id: "ID zamówienia",
        poNumber: "Numer zamówienia",
        vendorId: "Dostawca",
        vendorName: "Dostawca",
        status: "Status",
        currency: "Waluta",
        total: "Łącznie",
        expectedDeliveryDate: "Oczekiwana dostawa",
        createdAt: "Utworzono",
      },
    },
  },

  orderGet: {
    get: {
      title: "Pobierz zamówienie zakupu",
      titleShort: "Szczegóły zamówienia",
      description: "Pobierz zamówienie zakupu z pozycjami i historią odbioru.",
      widget: {
        back: "Wróć",
        send: "Wyślij do dostawcy",
        confirm: "Oznacz jako potwierdzone",
        receive: "Odbierz towar",
        convertToBill: "Konwertuj do faktury",
        viewBill: "Pokaż fakturę",
        addLine: "+ Dodaj pozycję",
        cancel: "Anuluj zamówienie",
        edit: "Edytuj",
        select: "Wybierz zamówienie zakupu",
        linesHeader: "Pozycje",
        receiptsHeader: "Historia odbiorów",
        noLines: "Brak pozycji.",
        noReceipts: "Brak odbiorów.",
        colDescription: "Opis",
        colQtyPrice: "Ilość × Cena",
        colLineTotal: "Łącznie",
        delivery: "Oczekiwana dostawa:",
        overdue: "(po terminie)",
        received: "odebrano",
        billCreated: "Faktura zakupu utworzona z tego zamówienia.",
        vendorLabel: "ID dostawcy:",
      },
      poId: { label: "ID zamówienia", description: "Zamówienie do pobrania" },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zamówienia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić zamówienia",
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
          description: "To zamówienie nie istnieje",
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
        companyId: "ID firmy",
        vendorId: "ID dostawcy",
        poNumber: "Numer zamówienia",
        status: "Status",
        currency: "Waluta",
        expectedDeliveryDate: "Oczekiwana dostawa",
        deliveryWarehouseId: "Magazyn dostawy",
        notes: "Notatki",
        subtotal: "Suma netto",
        taxAmount: "VAT",
        total: "Łącznie",
        billId: "ID faktury",
        confirmedAt: "Potwierdzone",
        receivedAt: "Odebrane",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
        lines: "Pozycje",
        lineId: "ID pozycji",
        lineProductId: "ID produktu",
        lineDescription: "Opis",
        lineQuantity: "Ilość",
        lineUnitPrice: "Cena jedn.",
        lineTaxRate: "Stawka VAT",
        lineTaxAmount: "VAT",
        lineTotal: "Łącznie",
        lineQuantityReceived: "Odebrano",
        receipts: "Odbiory",
        receiptId: "ID odbioru",
        receiptReceivedAt: "Odebrano",
        receiptNotes: "Notatki",
      },
    },
  },

  orderUpdate: {
    patch: {
      title: "Aktualizuj zamówienie",
      titleShort: "Zaktualizuj zamówienie",
      description: "Edytuj szkic zamówienia — pola i pozycje.",
      widget: { backToPO: "Powrót do zamówienia" },
      poId: { label: "ID zamówienia", description: "Zamówienie do edycji" },
      vendorId: {
        label: "Dostawca",
        description: "Zmień dostawcę (opcjonalnie)",
        placeholder: "UUID dostawcy",
      },
      currency: {
        label: "Waluta",
        description: "Waluta zamówienia",
        placeholder: "PLN",
      },
      expectedDeliveryDate: {
        label: "Oczekiwana dostawa",
        description: "Oczekiwana data dostawy",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "Magazyn dostawy",
        description: "Magazyn do przyjęcia towaru",
        placeholder: "UUID magazynu",
      },
      notes: {
        label: "Notatki",
        description: "Notatki wewnętrzne",
        placeholder: "Pilne zamówienie",
      },
      lines: {
        label: "Pozycje",
        description: "Zastąp wszystkie pozycje (opcjonalnie)",
      },
      lineDescription: {
        label: "Opis",
        description: "Opis artykułu",
        placeholder: "Krzesła biurowe",
      },
      lineProductId: {
        label: "ID produktu",
        description: "Produkt katalogowy (opcjonalnie)",
        placeholder: "UUID produktu",
      },
      lineQuantity: {
        label: "Ilość",
        description: "Liczba jednostek",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "Cena jednostkowa",
        description: "Cena za jednostkę",
        placeholder: "99,00",
      },
      lineTaxRate: {
        label: "Stawka VAT",
        description: "Stawka VAT jako ułamek dziesiętny",
        placeholder: "0,23",
      },
      lineSortOrder: {
        label: "Kolejność",
        description: "Kolejność wyświetlania pozycji",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby edytować zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Nie szkic",
          description: "Tylko szkice można edytować",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zaktualizować zamówienia",
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
          description: "To zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie zaktualizowane",
        description: "Zamówienie zapisane",
      },
      response: {
        id: "ID zamówienia",
        status: "Status",
        subtotal: "Suma netto",
        taxAmount: "VAT",
        total: "Łącznie",
        updatedAt: "Zaktualizowano",
      },
    },
  },

  orderSend: {
    post: {
      title: "Wyślij zamówienie",
      titleShort: "Wyślij zamówienie",
      description: "Oznacz zamówienie jako wysłane do dostawcy.",
      poId: { label: "ID zamówienia", description: "Zamówienie do wysłania" },
      widget: {
        back: "Wróć",
        backToPO: "Wróć do zamówienia",
        warning:
          "Wysłanie oznacza to zamówienie jako przekazane dostawcy. Status zmienia się ze Szkicu na Wysłane.",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zamówienia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wysyłać zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Nie szkic",
          description: "Tylko szkice można wysłać",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się wysłać zamówienia",
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
          description: "To zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie wysłane",
        description: "Zamówienie oznaczone jako Wysłane",
      },
      response: {
        id: "ID zamówienia",
        status: "Status",
      },
    },
  },

  orderConfirm: {
    post: {
      title: "Potwierdź zamówienie",
      titleShort: "Potwierdź zamówienie",
      description: "Dostawca potwierdził — oznacz jako Potwierdzone.",
      poId: {
        label: "ID zamówienia",
        description: "Zamówienie do potwierdzenia",
      },
      widget: {
        back: "Wróć",
        backToPO: "Wróć do zamówienia",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zamówienia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby potwierdzać zamówienia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Nieprawidłowy status",
          description: "Tylko wysłane zamówienia można potwierdzić",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się potwierdzić zamówienia",
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
          description: "To zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie potwierdzone",
        description: "Zamówienie oznaczone jako Potwierdzone",
      },
      response: {
        id: "ID zamówienia",
        status: "Status",
        confirmedAt: "Potwierdzone",
      },
    },
  },

  orderReceive: {
    post: {
      title: "Odbierz towar",
      titleShort: "Przyjmij towary",
      description:
        "Zarejestruj odbiór towaru do zamówienia. Tworzy ruchy magazynowe.",
      widget: { backToPO: "Powrót do zamówienia" },
      poId: {
        label: "ID zamówienia",
        description: "Zamówienie, do którego przypisano odbiór",
      },
      warehouseId: {
        label: "Magazyn",
        description: "Magazyn odbierający towar (opcjonalnie)",
        placeholder: "UUID magazynu",
      },
      notes: {
        label: "Notatki",
        description: "Notatki dotyczące tej dostawy",
        placeholder: "WZ #12345",
      },
      lines: {
        label: "Odebrane pozycje",
        description: "Odebrane ilości dla każdej pozycji",
      },
      linePoLineId: {
        label: "ID pozycji zamówienia",
        description: "Pozycja zamówienia",
      },
      lineQuantityReceived: {
        label: "Odebrana ilość",
        description: "Ilość odebrana dla tej pozycji",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wszystkie pola i ilości",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby odbierać towar",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Nieprawidłowy status",
          description: "Zamówienie musi być Potwierdzone lub Wysłane",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zarejestrować odbioru",
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
          description: "Zamówienie lub pozycja nie znaleziona",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Towar odebrany",
        description: "Odbiór zarejestrowany, magazyn zaktualizowany",
      },
      response: {
        receiptId: "ID odbioru",
        status: "Status zamówienia",
        receivedAt: "Odebrano",
      },
    },
  },

  orderConvertToBill: {
    post: {
      title: "Konwertuj do faktury",
      titleShort: "Konwertuj na rachunek",
      description: "Utwórz fakturę zakupu z tego zamówienia.",
      widget: {
        back: "Wróć",
        viewBill: "Pokaż fakturę",
      },
      poId: { label: "ID zamówienia", description: "Zamówienie do konwersji" },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID zamówienia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby tworzyć faktury",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego zamówienia",
        },
        conflict: {
          title: "Już skonwertowane",
          description: "To zamówienie zostało już przekonwertowane do faktury",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć faktury",
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
          description: "To zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Faktura utworzona",
        description: "Faktura zakupu utworzona z zamówienia",
      },
      response: {
        billId: "ID faktury",
        billNumber: "Numer faktury",
        poId: "ID zamówienia",
      },
    },
  },

  orderLineAdd: {
    post: {
      widget: {
        backToOrder: "Powrót do zamówienia",
        lineAdded: "Pozycja dodana",
      },
      title: "Dodaj pozycję",
      titleShort: "Dodaj linię",
      description: "Dodaj pozycję do zamówienia zakupu.",
      poId: {
        label: "ID zamówienia",
        description: "Zamówienie, do którego dodawana jest pozycja",
      },
      productId: {
        label: "Produkt",
        description: "Produkt katalogowy (opcjonalnie)",
        placeholder: "UUID produktu",
      },
      itemDescription: {
        label: "Opis",
        description: "Opis artykułu",
        placeholder: "Krzesła biurowe",
      },
      quantity: {
        label: "Ilość",
        description: "Liczba jednostek",
        placeholder: "10",
      },
      unitPrice: {
        label: "Cena jednostkowa",
        description: "Cena za jednostkę",
        placeholder: "99,00",
      },
      taxRate: {
        label: "Stawka VAT",
        description: "Stawka VAT jako ułamek dziesiętny (np. 0,23 = 23%)",
        placeholder: "0,23",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wszystkie pola i spróbuj ponownie",
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
          title: "Nie szkic",
          description: "Tylko szkice można modyfikować",
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
          description: "To zamówienie nie istnieje",
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
        lineId: "ID pozycji",
        subtotal: "Suma netto",
        taxAmount: "VAT",
        total: "Łącznie",
      },
    },
  },

  orderLineRemove: {
    post: {
      title: "Usuń pozycję",
      titleShort: "Usuń linię",
      description: "Usuń pozycję z zamówienia zakupu.",
      poId: {
        label: "ID zamówienia",
        description: "Zamówienie, z którego usuwana jest pozycja",
      },
      lineId: { label: "ID pozycji", description: "Pozycja do usunięcia" },
      widget: {
        backToOrder: "Powrót do zamówienia",
        warning: "Pozycja zostanie trwale usunięta z zamówienia zakupu.",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID",
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
          title: "Nie szkic",
          description: "Tylko szkice można modyfikować",
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
          description: "Zamówienie lub pozycja nie znaleziona",
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
      response: { subtotal: "Suma netto", taxAmount: "VAT", total: "Łącznie" },
    },
  },

  dashboard: {
    get: {
      title: "Przegląd zakupów",
      titleShort: "Przegląd",
      description:
        "Aktualny stan zamówień zakupu i aktywności dostawców dla Twojej firmy.",
      widget: {
        kpiDraft: "Szkice",
        kpiConfirmed: "Potwierdzone",
        kpiAwaitingReceipt: "Oczekuje na odbiór",
        kpiActiveVendors: "Aktywni dostawcy",
        warningDueThisWeek:
          "{{count}} zamówienie do realizacji w tym tygodniu — sprawdź daty dostawy",
        warningDueThisWeekPlural:
          "{{count}} zamówień do realizacji w tym tygodniu — sprawdź daty dostawy",
        navNewPo: "Nowe zamówienie",
        navAllPos: "Wszystkie ZZ",
        navVendors: "Dostawcy",
        navNewVendor: "Nowy dostawca",
        loading: "Ładowanie…",
      },
      companyId: {
        label: "Firma",
        description:
          "Firma, której statystyki zakupów mają być wyświetlone (opcjonalnie)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić przegląd zakupów",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować przeglądu zakupów",
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
          description: "Firma nie znaleziona",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Dashboard załadowany",
        description: "Przegląd zakupów pobrany",
      },
      response: {
        draftCount: "Szkice",
        confirmedCount: "Potwierdzone zamówienia",
        awaitingReceiptCount: "Oczekuje na odbiór",
        activeVendorCount: "Aktywni dostawcy",
        dueThisWeekCount: "Do realizacji w tym tygodniu",
      },
    },
  },

  orderCancel: {
    post: {
      title: "Anuluj zamówienie",
      titleShort: "Anuluj zamówienie",
      description: "Anuluj szkic lub wysłane zamówienie zakupu.",
      poId: { label: "ID zamówienia", description: "Zamówienie do anulowania" },
      widget: {
        back: "Wróć",
        warning:
          "Spowoduje to trwałe anulowanie zamówienia. Anulować można tylko szkice lub wysłane zamówienia.",
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
          title: "Nie można anulować",
          description: "Tylko szkice lub wysłane zamówienia można anulować",
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
          description: "To zamówienie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Zamówienie anulowane",
        description: "Zamówienie zakupu anulowane",
      },
      response: {
        id: "ID zamówienia",
        status: "Status",
      },
    },
  },
};
