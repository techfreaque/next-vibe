import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Przetwórz zwrot",
  description: "Przetwórz zwrot płatności",
  category: "Zwroty płatności",

  tags: {
    refund: "zwrot",
    transaction: "transakcja",
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
        description: "Kwota do zwrotu (opcjonalna, domyślnie pełna kwota)",
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
        title: "Nie znaleziono",
        description: "Transakcja nie została znaleziona",
      },
      server: {
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
