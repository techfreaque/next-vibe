import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "płatność",
    bill: "faktura",
    ap: "zobowiązania",
  },
  enums: {
    billStatus: {
      DRAFT: "Szkic",
      RECEIVED: "Otrzymana",
      APPROVED: "Zatwierdzona",
      PAID: "Opłacona",
      DISPUTED: "Sporna",
    },
  },
  post: {
    title: "Nowa faktura od dostawcy",
    titleShort: "Nowa faktura od dostawcy",
    description: "Wpisz dostawcę i pozycje, a następnie zapisz szkic.",
    form: {
      title: "Nowa faktura dostawcy",
      description: "Wprowadź dane faktury otrzymanej od dostawcy",
    },
    errors: {
      vendor: "Wybierz aktywnego dostawcę tej firmy.",
      supplier: "Wpisz nazwę lub wybierz dostawcę.",
      dates: "Wpisz prawidłowe daty wystawienia i płatności.",
      amounts: "Sprawdź pozycje i dopuszczalną sumę faktury.",
      expenseAccount: "Wybierz aktywne konto kosztów tej firmy.",

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
        description: "Nie można utworzyć faktury. Spróbuj ponownie.",
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
      supplier: "Dostawca",
      dates: "Daty i waluta",
      items: "Pozycje faktury",
      itemsDescription:
        "Pozycje opcjonalne. Podaj stawkę VAT jako ułamek od 0 do 1.",
      itemsHint: "Dodaj towary lub usługi z tej faktury.",
      item: "Opis",
      quantity: "Ilość",
      unitPrice: "Cena jednostkowa",
      manualTaxRate: "Inna stawka",
      taxRate: "VAT %",
      lineTotal: "Suma pozycji",
      addItem: "Dodaj pozycję",
      removeItem: "Usuń pozycję",
      itemError: "Sprawdź opis, ilość, cenę i stawkę VAT.",
      summary: "Podsumowanie faktury",
      net: "Netto",
      tax: "VAT",
      total: "Razem",
      chooseVendor: "Wybierz dostawcę",
      vendorSource: "Z katalogu dostawców",
      terms: "Użyj terminu dostawcy",
      manualVendor: "Wpisz dostawcę ręcznie",
      selectCompanyFirst: "Najpierw wybierz firmę.",

      back: "Wróć",
      submit: "Zapisz szkic",
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
  vendorId: { label: "Wybierz dostawcę", description: "Z katalogu dostawców" },
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
    placeholder: "Wybierz datę faktury",
  },
  dueDate: {
    label: "Termin płatności",
    description: "Data wymagalności płatności",
    placeholder: "Wybierz termin płatności",
  },
  currency: {
    code: "{{code}}",
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
