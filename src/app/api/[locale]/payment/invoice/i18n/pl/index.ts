import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  defaultItem: "Pozycja faktury",
  success: {
    created: "Faktura utworzona pomyślnie",
  },
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      success: "Faktura utworzona pomyślnie",
      message: "Wiadomość o statusie",
      invoice: {
        title: "Szczegóły faktury",
        description: "Informacje o wygenerowanej fakturze",
        id: "ID faktury",
        userId: "ID użytkownika",
        stripeInvoiceId: "ID faktury Stripe",
        invoiceNumber: "Numer faktury",
        amount: "Kwota",
        currency: "Waluta",
        status: "Status",
        invoiceUrl: "URL faktury",
        invoicePdf: "PDF faktury",
        dueDate: "Termin płatności",
        paidAt: "Opłacono dnia",
        createdAt: "Utworzono dnia",
        updatedAt: "Zaktualizowano dnia",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  customerId: {
    label: "ID klienta",
    description: "Identyfikator klienta Stripe",
    placeholder: "Wprowadź ID klienta",
  },
  amount: {
    label: "Kwota",
    description: "Kwota faktury",
    placeholder: "Wprowadź kwotę",
  },
  currency: {
    label: "Waluta",
    description: "Kod waluty",
    placeholder: "Wybierz walutę",
  },
  description: {
    label: "Opis",
    description: "Opis faktury",
    placeholder: "Wprowadź opis",
  },
  dueDate: {
    label: "Termin płatności",
    description: "Termin zapłaty",
    placeholder: "Wybierz termin płatności",
  },
  metadata: {
    label: "Metadane",
    description: "Dodatkowe metadane",
    placeholder: "Wprowadź metadane jako JSON",
  },
};
