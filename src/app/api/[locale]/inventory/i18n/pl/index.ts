import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Magazyn",
  shared: {
    errors: {
      failedToRecordMovement: "Nie udało się zapisać ruchu magazynowego",
      failedToApplyMovement: "Nie udało się zastosować ruchu magazynowego",
    },
  },
  tags: {
    inventory: "Magazyn",
    warehouse: "Magazyn",
    stock: "Stan",
    transfer: "Przesunięcie",
    create: "Utwórz",
    list: "Lista",
    get: "Pobierz",
    update: "Aktualizuj",
    adjust: "Koryguj",
    receive: "Przyjmij",
    issue: "Wydaj",
    dispatch: "Wyślij",
  },
  endpointCategories: {
    inventory: "Magazyn",
    warehouses: "Magazyny",
    stock: "Stany magazynowe",
    transfers: "Przesunięcia",
  },
  enums: {
    movementType: {
      receipt: "Przyjęcie",
      issue: "Wydanie",
      transferIn: "Przesunięcie wewnętrzne IN",
      transferOut: "Przesunięcie wewnętrzne OUT",
      adjustment: "Korekta",
      sale: "Sprzedaż",
      return: "Zwrot",
    },
    transferStatus: {
      draft: "Szkic",
      inTransit: "W drodze",
      received: "Przyjęty",
      cancelled: "Anulowany",
    },
  },

  warehouseCreate: {
    post: {
      title: "Utwórz magazyn",
      description: "Zarejestruj nowy magazyn dla firmy.",
      widget: {
        backToList: "Wróć do listy magazynów",
        active: "Aktywny",
        inactive: "Nieaktywny",
        default: "Domyślny",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, do której należy magazyn",
      },
      name: {
        label: "Nazwa magazynu",
        description: "Pełna nazwa magazynu",
        placeholder: "Magazyn główny",
      },
      code: {
        label: "Kod",
        description: "Krótki identyfikator (np. WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "Adres",
        description: "Adres fizyczny magazynu",
        placeholder: "ul. Składowa 1",
      },
      isActive: {
        label: "Aktywny",
        description: "Czy magazyn jest operacyjny",
      },
      isDefault: {
        label: "Magazyn domyślny",
        description: "Ustaw jako domyślny magazyn dla tej firmy",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby tworzyć magazyny",
        },
        forbidden: {
          title: "Wymagane uprawnienia admina",
          description: "Tylko administratorzy mogą tworzyć magazyny",
        },
        conflict: {
          title: "Kod już istnieje",
          description: "Magazyn z tym kodem już istnieje",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć magazynu — spróbuj ponownie",
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
          description: "Firma nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Magazyn utworzony",
        description: "Magazyn zarejestrowany pomyślnie",
      },
      response: {
        id: "ID magazynu",
        name: "Nazwa magazynu",
        code: "Kod",
        companyId: "ID firmy",
        isActive: "Aktywny",
        isDefault: "Domyślny",
      },
    },
  },

  warehouseList: {
    get: {
      title: "Lista magazynów",
      description: "Wyświetl wszystkie magazyny firmy.",
      widget: {
        active: "Aktywny",
        inactive: "Nieaktywny",
        default: "Domyślny",
        total: "magazynów",
        createWarehouse: "Nowy magazyn",
        empty: "Brak magazynów.",
        emptyHint:
          "Utwórz pierwszy magazyn, aby zacząć śledzić stan magazynowy.",
        emptyIcon: "🏭",
        loading: "Ładowanie magazynów…",
        load: "Załaduj",
        viewStock: "Pokaż stan",
        selectCompany: "Podaj ID firmy, aby załadować magazyny.",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, której magazyny mają być wyświetlone",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlać magazyny",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować magazynów",
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
          description: "Firma nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Magazyny załadowane",
        description: "Lista magazynów pobrana",
      },
      response: {
        id: "ID magazynu",
        name: "Nazwa",
        code: "Kod",
        address: "Adres",
        isActive: "Aktywny",
        isDefault: "Domyślny",
        createdAt: "Utworzono",
      },
    },
  },

  warehouseGet: {
    get: {
      title: "Pobierz magazyn",
      description: "Pobierz szczegóły konkretnego magazynu.",
      widget: {
        edit: "Edytuj magazyn",
        viewStock: "Wyświetl stan",
      },
      warehouseId: { label: "ID magazynu", description: "Magazyn do pobrania" },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID magazynu",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlać magazyny",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego magazynu",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować magazynu",
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
          title: "Magazyn nie znaleziony",
          description: "Magazyn nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Magazyn załadowany",
        description: "Szczegóły magazynu pobrane",
      },
      response: {
        id: "ID magazynu",
        companyId: "ID firmy",
        name: "Nazwa",
        code: "Kod",
        address: "Adres",
        isActive: "Aktywny",
        isDefault: "Domyślny",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
  },

  warehouseUpdate: {
    patch: {
      title: "Aktualizuj magazyn",
      description: "Edytuj dane magazynu.",
      widget: {
        backToWarehouse: "Wróć do magazynu",
        active: "Aktywny",
        inactive: "Nieaktywny",
      },
      warehouseId: {
        label: "ID magazynu",
        description: "Magazyn do aktualizacji",
      },
      name: {
        label: "Nazwa magazynu",
        description: "Pełna nazwa magazynu",
        placeholder: "Magazyn główny",
      },
      code: {
        label: "Kod",
        description: "Krótki identyfikator",
        placeholder: "WH-01",
      },
      address: {
        label: "Adres",
        description: "Adres fizyczny",
        placeholder: "ul. Składowa 1",
      },
      isActive: {
        label: "Aktywny",
        description: "Czy magazyn jest operacyjny",
      },
      isDefault: {
        label: "Magazyn domyślny",
        description: "Ustaw jako magazyn domyślny",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby aktualizować magazyny",
        },
        forbidden: {
          title: "Wymagane uprawnienia admina",
          description: "Tylko administratorzy mogą edytować magazyny",
        },
        conflict: {
          title: "Konflikt kodu",
          description: "Ten kod magazynu jest już zajęty",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się zaktualizować magazynu",
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
          title: "Magazyn nie znaleziony",
          description: "Magazyn nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Magazyn zaktualizowany",
        description: "Magazyn zaktualizowany pomyślnie",
      },
      response: {
        id: "ID magazynu",
        name: "Nazwa",
        code: "Kod",
        isActive: "Aktywny",
        isDefault: "Domyślny",
      },
    },
  },

  stockList: {
    get: {
      title: "Stany magazynowe",
      description:
        "Wyświetl stany magazynowe dla wybranego magazynu wraz z dostępnością i wskaźnikami niskiego stanu.",
      widget: {
        lowStock: "Niski stan",
        available: "Dostępne",
        onHand: "Na stanie",
        reserved: "Zarezerwowane",
        onOrder: "W zamówieniu",
        reorderPoint: "Punkt zamawiania",
        empty: "Brak rekordów stanów.",
        emptyHint: "Przyjmij towar do magazynu, aby zobaczyć stany tutaj.",
        emptyIcon: "📦",
        loading: "Ładowanie stanów…",
        filterProduct: "Filtruj po produkcie",
        load: "Załaduj",
        selectWarehouse: "Podaj ID magazynu, aby wyświetlić stany.",
        total: "pozycji",
        adjust: "Koryguj",
        transfer: "Przesuń",
        outOfStock: "brak w magazynie",
        belowReorderPoint: "poniżej punktu zamówień",
        bulletSeparator: "·",
        statusOk: "OK",
      },
      warehouseId: {
        label: "ID magazynu",
        description: "Magazyn, dla którego sprawdzany jest stan",
      },
      productId: {
        label: "ID produktu",
        description: "Ogranicz do konkretnego produktu (opcjonalnie)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlać stany",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego magazynu",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować stanów magazynowych",
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
          title: "Magazyn nie znaleziony",
          description: "Magazyn nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Stany załadowane",
        description: "Stany magazynowe pobrane",
      },
      response: {
        id: "ID rekordu stanu",
        warehouseId: "ID magazynu",
        warehouseName: "Magazyn",
        productId: "ID produktu",
        productName: "Produkt",
        quantityOnHand: "Na stanie",
        quantityReserved: "Zarezerwowane",
        quantityOnOrder: "W zamówieniu",
        quantityAvailable: "Dostępne",
        reorderPoint: "Punkt zamawiania",
        reorderQuantity: "Ilość do zamówienia",
        unitCost: "Koszt jednostkowy",
        isLowStock: "Niski stan",
        updatedAt: "Zaktualizowano",
      },
    },
  },

  stockAdjust: {
    post: {
      title: "Korekta stanu",
      description:
        "Ręczna korekta stanu magazynowego. Użyj wartości ujemnych do odpisania.",
      widget: {
        backToStock: "Wróć do stanów",
        reserved: "Zarezerwowane",
        preview: "Podgląd",
        quantityChange: "Zmiana ilości",
        positiveHint: "Dodatnia wartość zwiększa stan",
        negativeHint: "Ujemna wartość zmniejsza stan",
      },
      warehouseId: {
        label: "ID magazynu",
        description: "Magazyn, w którym korygowany jest stan",
      },
      productId: { label: "ID produktu", description: "Produkt do korekty" },
      quantity: {
        label: "Ilość",
        description:
          "Zmiana ilości ze znakiem (dodatnia = dodaj, ujemna = odejmij)",
        placeholder: "10",
      },
      reason: {
        label: "Powód",
        description: "Dlaczego wykonywana jest ta korekta",
        placeholder: "Korekta po inwentaryzacji",
      },
      unitCost: {
        label: "Koszt jednostkowy",
        description: "Koszt na jednostkę (opcjonalnie)",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby korygować stan",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego magazynu",
        },
        conflict: {
          title: "Niewystarczający stan",
          description: "Zbyt mało towaru na stanie do wykonania korekty",
        },
        server: {
          title: "Błąd serwera",
          description: "Korekta stanu nie powiodła się",
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
          description: "Magazyn lub produkt nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Stan skorygowany",
        description: "Korekta stanu magazynowego zapisana",
      },
      response: {
        movementId: "ID ruchu",
        productId: "ID produktu",
        warehouseId: "ID magazynu",
        quantityOnHand: "Nowy stan",
        quantityAvailable: "Dostępne",
      },
    },
  },

  stockReceive: {
    post: {
      title: "Przyjęcie towaru",
      description:
        "Zarejestruj przyjęcie towaru — aktualizuje stan i średni ważony koszt.",
      widget: {
        backToStock: "Wróć do stanów",
      },
      warehouseId: {
        label: "ID magazynu",
        description: "Magazyn przyjmujący towar",
      },
      productId: { label: "ID produktu", description: "Przyjmowany produkt" },
      quantity: {
        label: "Ilość",
        description: "Liczba przyjętych jednostek",
        placeholder: "100",
      },
      unitCost: {
        label: "Koszt jednostkowy",
        description: "Koszt za przyjętą jednostkę",
        placeholder: "0,00",
      },
      reference: {
        label: "Referencja",
        description: "Numer zamówienia lub dowód dostawy",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby przyjmować towar",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego magazynu",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Przyjęcie towaru nie powiodło się",
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
          description: "Magazyn lub produkt nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Towar przyjęty",
        description: "Przyjęcie towaru zarejestrowane",
      },
      response: {
        movementId: "ID ruchu",
        productId: "ID produktu",
        warehouseId: "ID magazynu",
        quantityOnHand: "Nowy stan",
        unitCost: "Nowy koszt jednostkowy",
      },
    },
  },

  stockIssue: {
    post: {
      title: "Wydanie towaru",
      description:
        "Wydaj towar z magazynu. Sprawdza dostępność przed wydaniem.",
      widget: {
        backToStock: "Wróć do stanów",
      },
      warehouseId: {
        label: "ID magazynu",
        description: "Magazyn wydający towar",
      },
      productId: { label: "ID produktu", description: "Produkt do wydania" },
      quantity: {
        label: "Ilość",
        description: "Liczba jednostek do wydania",
        placeholder: "10",
      },
      reference: {
        label: "Referencja",
        description: "Zlecenie produkcji, numer pracy lub inna referencja",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "Koszt jednostkowy",
        description: "Koszt na jednostkę (domyślnie: aktualny średni ważony)",
        placeholder: "0,00",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wydawać towar",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego magazynu",
        },
        conflict: {
          title: "Niewystarczający stan",
          description: "Za mało towaru na stanie do wydania",
        },
        server: {
          title: "Błąd serwera",
          description: "Wydanie towaru nie powiodło się",
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
          description: "Magazyn lub produkt nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: { title: "Towar wydany", description: "Towar wydany pomyślnie" },
      response: {
        movementId: "ID ruchu",
        productId: "ID produktu",
        warehouseId: "ID magazynu",
        quantityOnHand: "Nowy stan",
        quantityAvailable: "Dostępne",
      },
    },
  },

  transferCreate: {
    post: {
      title: "Utwórz przesunięcie",
      description:
        "Utwórz zlecenie przesunięcia między magazynami. Status: Szkic.",
      widget: {
        backToList: "Wróć do przesunięć",
        viewTransfer: "Podgląd przesunięcia",
        browseWarehouses: "Przeglądaj magazyny",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, do której należy przesunięcie",
      },
      fromWarehouseId: {
        label: "Magazyn źródłowy",
        description: "Magazyn wysyłający towar",
      },
      toWarehouseId: {
        label: "Magazyn docelowy",
        description: "Magazyn przyjmujący towar",
      },
      reference: {
        label: "Referencja",
        description: "Numer referencyjny przesunięcia",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "Notatki",
        description: "Dodatkowe informacje o przesunięciu",
        placeholder: "Uzupełnienie sezonowe",
      },
      items: {
        label: "Pozycje",
        description: "Produkty i ilości do przesunięcia",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby tworzyć przesunięcia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: {
          title: "Ten sam magazyn",
          description: "Magazyn źródłowy i docelowy muszą być różne",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć przesunięcia",
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
          description: "Magazyn nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Przesunięcie utworzone",
        description: "Szkic przesunięcia zapisany",
      },
      response: {
        id: "ID przesunięcia",
        status: "Status",
        reference: "Referencja",
        fromWarehouseId: "Magazyn źródłowy",
        toWarehouseId: "Magazyn docelowy",
      },
    },
  },

  transferList: {
    get: {
      title: "Lista przesunięć",
      description: "Wyświetl przesunięcia magazynowe firmy.",
      widget: {
        newTransfer: "Nowe przesunięcie",
        empty: "Brak przesunięć.",
        emptyHint:
          "Utwórz przesunięcie, aby przemieścić towar między magazynami.",
        emptyIcon: "🔄",
        loading: "Ładowanie przesunięć…",
        load: "Załaduj",
        selectCompany: "Podaj ID firmy, aby załadować przesunięcia.",
        total: "przesunięć",
        view: "Podgląd",
        draft: "Szkic",
        inTransit: "W transporcie",
        viewTransfer: "Podgląd przesunięcia",
        tabAll: "Wszystkie",
        tabDraft: "Oczekujące",
        tabInTransit: "W transporcie",
        tabReceived: "Zakończone",
        tabCancelled: "Anulowane",
        arrowSeparator: "→",
      },
      companyId: {
        label: "ID firmy",
        description: "Firma, której przesunięcia mają być wyświetlone",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlać przesunięcia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować przesunięć",
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
          description: "Firma nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Przesunięcia załadowane",
        description: "Lista przesunięć pobrana",
      },
      response: {
        id: "ID przesunięcia",
        fromWarehouseId: "ID magazynu źródłowego",
        fromWarehouseName: "Z",
        toWarehouseId: "ID magazynu docelowego",
        toWarehouseName: "Do",
        status: "Status",
        reference: "Referencja",
        createdAt: "Utworzono",
        completedAt: "Zakończono",
      },
    },
  },

  transferGet: {
    get: {
      title: "Pobierz przesunięcie",
      description: "Pobierz przesunięcie ze wszystkimi pozycjami.",
      widget: {
        dispatch: "Wyślij przesunięcie",
        receive: "Oznacz jako przyjęte",
        status: "Status",
      },
      transferId: {
        label: "ID przesunięcia",
        description: "Przesunięcie do pobrania",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID przesunięcia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlać przesunięcia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego przesunięcia",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować przesunięcia",
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
          title: "Przesunięcie nie znalezione",
          description: "Przesunięcie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Przesunięcie załadowane",
        description: "Szczegóły przesunięcia pobrane",
      },
      response: {
        id: "ID przesunięcia",
        companyId: "ID firmy",
        fromWarehouseId: "Magazyn źródłowy",
        toWarehouseId: "Magazyn docelowy",
        status: "Status",
        reference: "Referencja",
        notes: "Notatki",
        createdAt: "Utworzono",
        completedAt: "Zakończono",
        items: "Pozycje",
        itemId: "ID pozycji",
        productId: "ID produktu",
        quantityRequested: "Ilość zlecona",
        quantityReceived: "Ilość przyjęta",
      },
    },
  },

  transferDispatch: {
    post: {
      title: "Wyślij przesunięcie",
      description:
        "Oznacz przesunięcie jako w drodze. Towar opuszcza magazyn źródłowy.",
      widget: {
        backToTransfer: "Wróć do przesunięcia",
      },
      transferId: {
        label: "ID przesunięcia",
        description: "Przesunięcie do wysłania",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID przesunięcia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wysyłać przesunięcia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego przesunięcia",
        },
        conflict: {
          title: "Nie szkic",
          description: "Tylko szkice mogą być wysłane",
        },
        server: {
          title: "Błąd serwera",
          description: "Wysłanie przesunięcia nie powiodło się",
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
          title: "Przesunięcie nie znalezione",
          description: "Przesunięcie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Przesunięcie wysłane",
        description: "Przesunięcie jest teraz w drodze",
      },
      response: {
        id: "ID przesunięcia",
        status: "Status",
      },
    },
  },

  transferReceive: {
    post: {
      title: "Przyjmij przesunięcie",
      description:
        "Oznacz przesunięcie jako przyjęte. Tworzy ruchy magazynowe i aktualizuje stany.",
      widget: {
        backToTransfer: "Wróć do przesunięcia",
      },
      transferId: {
        label: "ID przesunięcia",
        description: "Przesunięcie do przyjęcia",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID przesunięcia",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby przyjmować przesunięcia",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tego przesunięcia",
        },
        conflict: {
          title: "Nie w drodze",
          description: "Tylko przesunięcia w drodze mogą być przyjęte",
        },
        server: {
          title: "Błąd serwera",
          description: "Przyjęcie przesunięcia nie powiodło się",
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
          title: "Przesunięcie nie znalezione",
          description: "Przesunięcie nie istnieje",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Przesunięcie przyjęte",
        description: "Ruchy magazynowe utworzone, stany zaktualizowane",
      },
      response: {
        id: "ID przesunięcia",
        status: "Status",
        completedAt: "Zakończono",
      },
    },
  },

  dashboard: {
    get: {
      title: "Przegląd magazynu",
      description:
        "Aktualny stan zapasów, oczekujące transfery i liczba magazynów.",
      widget: {
        kpiInStock: "Na stanie",
        kpiOutOfStock: "Brak w magazynie",
        kpiLowStock: "Niski stan",
        kpiWarehouses: "Magazyny",
        alertOutOfStock: "{{count}} produkt niedostępny",
        alertOutOfStockPlural: "{{count}} produktów niedostępnych",
        navStockLevels: "Stany magazynowe",
        navTransfers: "Transfery",
        navWarehouses: "Magazyny",
        loading: "Ładowanie…",
        pendingTransfers: "{{count}} transfer w drodze",
        pendingTransfersPlural: "{{count}} transferów w drodze",
      },
      companyId: {
        label: "Firma",
        description:
          "Firma, której statystyki magazynowe mają być wyświetlone (opcjonalnie)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić przegląd magazynu",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować przeglądu magazynu",
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
        description: "Przegląd magazynu pobrany",
      },
      response: {
        inStockCount: "Na stanie",
        outOfStockCount: "Brak w magazynie",
        lowStockCount: "Niski stan",
        pendingTransferCount: "Oczekujące transfery",
        warehouseCount: "Magazyny",
      },
    },
  },
};
