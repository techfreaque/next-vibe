import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Przetwórz zwrot",
  titleShort: "Zwrot",
  description: "Przetwórz zwrot płatności",
  category: "Zwroty płatności",

  tags: {
    refund: "zwrot",
    transaction: "transakcja",
  },

  success: {
    created: "Zwrot przetworzony pomyślnie",
  },

  reason: {
    requestedByCustomer: "Na żądanie klienta",
  },

  form: {
    title: "Formularz zwrotu",
    description: "Wprowadź szczegóły zwrotu",
    fields: {
      transactionId: {
        label: "ID transakcji",
        description: "ID transakcji do zwrotu",
        placeholder: "Wprowadź ID transakcji",
      },
      amount: {
        label: "Kwota zwrotu",
        description: "Opcjonalny zwrot częściowy w walucie transakcji",
        placeholder: "Wprowadź kwotę",
      },
      reason: {
        label: "Powód zwrotu",
        description: "Powód zwrotu",
        placeholder: "Wprowadź powód",
      },
      metadata: {
        label: "Metadane",
        description: "Dodatkowe metadane zwrotu",
        placeholder: "Wprowadź metadane jako JSON",
      },
    },
  },

  widget: {
    transactionDetails: "Zapisana transakcja",
    customerEmail: "E-mail klienta",
    customerId: "Identyfikator klienta",
    originalAmount: "Pierwotna kwota",
    enterTransaction:
      "Wpisz identyfikator transakcji, aby wczytać dane płatności.",
    lookupLoading: "Wczytywanie zapisanej transakcji",
    transactionMissing: "Nie znaleziono transakcji",
    lookupFailed: "Nie udało się wczytać transakcji",
    retryLookup: "Ponów wyszukiwanie",
    amountExceedsCharge: "Wpisz kwotę nie większą od pierwotnej płatności.",
    confirmRemaining: "Stripe zwróci całą pozostałą kwotę w {{currency}}.",
    confirmAmount: "Zwrot częściowy: {{amount}} ({{currency}}).",
    title: "Sprawdź zwrot przez Stripe",
    amountHelp:
      "Wpisz część kwoty w {{currency}}. Pozostaw pole puste, aby zwrócić całą pozostałą kwotę.",
    review: "Sprawdź kwotę",
    confirmTitle: "Potwierdź zwrot przez Stripe",
    confirmDescription:
      "Stripe zwróci klientowi {{email}} środki z transakcji {{transactionId}}. Ta operacja zwraca pieniądze klientowi.",
    confirm: "Zleć zwrot",
    cancel: "Anuluj",
  },

  post: {
    title: "Przetwórz zwrot",
    description: "Przetwórz zwrot płatności",
    response: {
      success: "Zwrot przetworzony pomyślnie",
      message: "Wiadomość o statusie",
      refund: {
        title: "Szczegóły zwrotu",
        description: "Informacje o przetworzonym zwrocie",
        id: "ID zwrotu",
        userId: "ID użytkownika",
        transactionId: "ID transakcji",
        stripeRefundId: "ID zwrotu Stripe",
        amount: "Kwota zwrotu",
        currency: "Waluta",
        status: "Status zwrotu",
        reason: "Powód zwrotu",
        createdAt: "Utworzono dnia",
        updatedAt: "Zaktualizowano dnia",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry zwrotu",
        ineligible: "Tej transakcji nie można zwrócić przez Stripe.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        detail: "Nie znaleziono transakcji o identyfikatorze {{transactionId}}",
        title: "Nie znaleziono",
        description: "Transakcja nie została znaleziona",
      },
      server: {
        detail: "Nie udało się przetworzyć zwrotu: {{error}}",
        noPaymentIntent:
          "Ta transakcja nie ma powiązanej płatności Stripe, więc nie można jej zwrócić",
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt zwrotu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Zwrot przetworzony pomyślnie",
    },
  },
};
