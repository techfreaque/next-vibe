import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "płatność",
    bill: "faktura",
    ap: "zobowiązania",
  },
  post: {
    title: "Zarejestruj fakturę zakupową",
    titleShort: "Utwórz rachunek",
    description: "Zarejestruj fakturę otrzymaną od dostawcy",
    form: {
      title: "Nowa faktura dostawcy",
      description: "Wprowadź dane faktury otrzymanej od dostawcy",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wszystkie pola i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby rejestrować faktury",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Księgowy lub Administrator",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      server: {
        title: "Błąd serwera",
        description: "Nie można utworzyć faktury — spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Sprawdź połączenie i spróbuj ponownie",
      },
      notFound: { title: "Nie znaleziono", description: "Zasób nie istnieje" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Faktura zarejestrowana",
      description: "Faktura dostawcy zapisana pomyślnie",
    },
    widget: {
      back: "Wróć",
      submit: "Zapisz fakturę",
      viewButton: "Pokaż fakturę",
      addAnotherButton: "Dodaj kolejną",
    },
    response: {
      id: "ID faktury",
      companyId: "ID firmy",
      supplierName: "Dostawca",
      billNumber: "Numer faktury",
      billDate: "Data faktury",
      dueDate: "Termin płatności",
      currency: "Waluta",
      subtotal: "Wartość netto",
      taxAmount: "VAT",
      total: "Wartość brutto",
      status: "Status",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },
  companyId: {
    label: "Firma",
    description: "Firma otrzymująca tę fakturę",
    placeholder: "UUID firmy",
  },
  supplierName: {
    label: "Nazwa dostawcy",
    description: "Nazwa dostawcy, który wystawił fakturę",
    placeholder: "Kowalski Sp. z o.o.",
  },
  supplierVatNumber: {
    label: "NIP dostawcy",
    description: "Numer NIP dostawcy",
    placeholder: "PL1234567890",
  },
  billNumber: {
    label: "Numer faktury",
    description: "Numer referencyjny faktury dostawcy",
    placeholder: "FV/2024/001",
  },
  billDate: {
    label: "Data faktury",
    description: "Data wystawienia faktury",
    placeholder: "2024-01-01",
  },
  dueDate: {
    label: "Termin płatności",
    description: "Data wymagalności płatności",
    placeholder: "2024-01-31",
  },
  currency: {
    label: "Waluta",
    description: "Waluta faktury",
    placeholder: "EUR",
  },
  notes: {
    label: "Uwagi",
    description: "Wewnętrzne uwagi do faktury",
    placeholder: "Opcjonalne uwagi",
  },
};
