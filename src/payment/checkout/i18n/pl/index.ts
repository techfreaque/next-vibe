import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main checkout titles and descriptions
  title: "Utwórz płatność subskrypcji",
  titleShort: "Kasa",
  description: "Utwórz sesję płatności Stripe dla subskrypcji",
  category: "Subskrypcja",

  // Tags
  tags: {
    subscription: "subskrypcja",
    checkout: "płatność",
    stripe: "stripe",
  },

  // Form configuration
  form: {
    title: "Konfiguracja płatności",
    description: "Skonfiguruj parametry sesji płatności",
    fields: {
      planId: {
        label: "Plan subskrypcji",
        description: "Wybierz plan subskrypcji",
        placeholder: "Wybierz plan",
      },
      billingInterval: {
        label: "Okres rozliczeniowy",
        description: "Wybierz częstotliwość rozliczeń",
        placeholder: "Wybierz okres rozliczeniowy",
      },
      provider: {
        label: "Dostawca płatności",
        description: "Wybierz sposób płatności",
        placeholder: "Wybierz dostawcę płatności",
      },
      metadata: {
        label: "Metadane",
        description: "Dodatkowe metadane dla sesji płatności",
        placeholder: "Wprowadź metadane jako JSON",
      },
    },
  },

  // Response fields
  response: {
    success: "Sesja płatności utworzona pomyślnie",
    sessionId: "ID sesji Stripe",
    checkoutUrl: "URL płatności",
    message: "Wiadomość o statusie",
  },

  // Error types
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry żądania",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
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
      description: "Zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
  },

  // Success types
  success: {
    title: "Sukces",
    description: "Sesja płatności utworzona pomyślnie",
  },

  // POST endpoint specific translations
  post: {
    title: "Utwórz sesję płatności",
    description: "Utwórz nową sesję płatności subskrypcji",
    form: {
      title: "Konfiguracja sesji płatności",
      description: "Skonfiguruj parametry sesji płatności",
    },
    response: {
      title: "Odpowiedź płatności",
      description: "Dane odpowiedzi sesji płatności",
    },
    errors: {
      alreadySubscribed: {
        detail: "Masz już aktywną subskrypcję (użytkownik {{userId}})",
        title: "Już subskrybowany",
        description: "Masz już aktywną subskrypcję",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry płatności",
        reason: {
          enterpriseCustomPricing:
            "Plan ENTERPRISE wymaga indywidualnej wyceny",
        },
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
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
        detail: "Nie znaleziono konta dla użytkownika {{userId}}",
        title: "Nie znaleziono",
        description: "Sesja płatności nie została znaleziona",
      },
      server: {
        detail: "Nie udało się rozpocząć płatności: {{error}}",
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Sesja płatności utworzona pomyślnie",
    },
  },

  // General error message
  error: "Wystąpił błąd podczas płatności",
  errorDetail: "Płatność nie powiodła się: {{error}}",

  // Subscription plan labels
  plans: {
    starter: {
      title: "Starter",
    },
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },

  // Billing interval labels
  billing: {
    monthly: "Miesięcznie",
    yearly: "Rocznie",
  },
};
