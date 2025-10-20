import { translations as checkoutTranslations } from "../../checkout/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
  checkout: checkoutTranslations,

  // Main subscription domain
  category: "Subskrypcja",

  // Tags
  tags: {
    subscription: "subskrypcja",
    billing: "rozliczenia",
    get: "pobierz",
    create: "utwórz",
    update: "aktualizuj",
    cancel: "anuluj",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Plan Starter",
    },
    professional: {
      title: "Plan Professional",
    },
    premium: {
      title: "Plan Premium",
    },
    enterprise: {
      title: "Plan Enterprise",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Miesięcznie",
    yearly: "Rocznie",
  },

  // GET endpoint
  get: {
    title: "Pobierz subskrypcję",
    description: "Pobierz szczegóły bieżącej subskrypcji",
    form: {
      title: "Szczegóły subskrypcji",
      description: "Zobacz informacje o Twojej bieżącej subskrypcji",
    },
  },

  // POST endpoint
  post: {
    title: "Utwórz subskrypcję",
    description: "Utwórz nową subskrypcję",
    form: {
      title: "Tworzenie subskrypcji",
      description: "Utwórz nową subskrypcję z wybranym planem",
    },
  },

  // PUT endpoint
  put: {
    title: "Aktualizuj subskrypcję",
    description: "Aktualizuj istniejącą subskrypcję",
    form: {
      title: "Aktualizacja subskrypcji",
      description: "Zaktualizuj swój plan subskrypcji lub okres rozliczeniowy",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Anuluj subskrypcję",
    description: "Anuluj swoją subskrypcję",
    form: {
      title: "Anulowanie subskrypcji",
      description: "Anuluj swoją subskrypcję z opcjonalnymi ustawieniami",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Plan subskrypcji",
        description: "Wybierz swój plan subskrypcji",
        placeholder: "Wybierz plan",
      },
      billingInterval: {
        label: "Okres rozliczeniowy",
        description: "Wybierz częstotliwość rozliczeń",
        placeholder: "Wybierz okres rozliczeniowy",
      },
      cancelAtPeriodEnd: {
        label: "Anuluj na koniec okresu",
        description: "Anuluj subskrypcję na koniec bieżącego okresu",
      },
      reason: {
        label: "Powód anulowania",
        description: "Podaj powód anulowania",
        placeholder: "Wprowadź powód anulowania",
      },
    },
  },

  // Response fields
  response: {
    id: "ID subskrypcji",
    userId: "ID użytkownika",
    status: "Status subskrypcji",
    planId: "ID planu",
    billingInterval: "Okres rozliczeniowy",
    currentPeriodStart: "Początek bieżącego okresu",
    currentPeriodEnd: "Koniec bieżącego okresu",
    cancelAtPeriodEnd: "Anuluj na koniec okresu",
    trialStart: "Początek okresu próbnego",
    trialEnd: "Koniec okresu próbnego",
    success: "Operacja pomyślna",
    message: "Wiadomość o statusie",
    subscriptionId: "ID subskrypcji",
    stripeCustomerId: "ID klienta Stripe",
    updatedFields: "Zaktualizowane pola",
    canceledAt: "Anulowano o",
    endsAt: "Kończy się o",
  },

  // Error types
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry subskrypcji",
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
      description: "Subskrypcja nie została znaleziona",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
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
    user_not_found: "Nie znaleziono użytkownika",
    stripe_customer_creation_failed: "Nie udało się utworzyć klienta Stripe",
  },

  // Success types
  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
  },

  // Status translations
  status: {
    incomplete: "Niekompletny",
    incomplete_expired: "Niekompletny wygasły",
    trialing: "Okres próbny",
    active: "Aktywny",
    pastDue: "Zaległy",
    canceled: "Anulowany",
    unpaid: "Nieopłacony",
    paused: "Wstrzymany",
  },

  // Email translations
  email: {
    success: {
      title: "Subskrypcja pomyślna!",
      previewText: "Witamy w nowej subskrypcji",
      welcomeMessage: "Witamy w subskrypcji!",
      description: "Dziękujemy za subskrypcję {{appName}}",
      nextSteps: {
        title: "Następne kroki",
        description: "Oto co możesz zrobić dalej",
        cta: "Rozpocznij",
      },
      support: {
        title: "Potrzebujesz pomocy?",
        description: "Nasz zespół wsparcia jest tutaj, aby Ci pomóc",
      },
    },
  },

  // Enum translations
  enums: {
    plan: {
      starter: "Starter",
      professional: "Professional",
      premium: "Premium",
      enterprise: "Enterprise",
    },
    status: {
      incomplete: "Niekompletny",
      incompleteExpired: "Niekompletny wygasły",
      trialing: "Okres próbny",
      active: "Aktywny",
      pastDue: "Przeterminowany",
      canceled: "Anulowany",
      unpaid: "Nieopłacony",
      paused: "Wstrzymany",
    },
    billing: {
      monthly: "Miesięczny",
      yearly: "Roczny",
    },
    cancellation: {
      tooExpensive: "Za drogi",
      missingFeatures: "Brakujące funkcje",
      switchingService: "Zmiana usługi",
      temporaryPause: "Tymczasowa przerwa",
      other: "Inne",
    },
  },
};
