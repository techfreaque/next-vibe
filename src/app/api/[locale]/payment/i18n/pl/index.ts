import { translations as checkoutTranslations } from "../../checkout/i18n/pl";
import { translations as invoiceTranslations } from "../../invoice/i18n/pl";
import { translations as portalTranslations } from "../../portal/i18n/pl";
import { translations as refundTranslations } from "../../refund/i18n/pl";
import { translations as stripeProviderTranslations } from "../../providers/stripe/i18n/pl";
import { translations as nowpaymentsProviderTranslations } from "../../providers/nowpayments/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  checkout: checkoutTranslations,
  invoice: invoiceTranslations,
  portal: portalTranslations,
  refund: refundTranslations,
  providers: {
    stripe: stripeProviderTranslations,
    nowpayments: nowpaymentsProviderTranslations,
  },

  // Main payment domain
  category: "Płatność",

  // Main form configuration
  form: {
    title: "Konfiguracja płatności",
    description: "Skonfiguruj parametry płatności",
  },

  // Tags
  tags: {
    payment: "płatność",
    stripe: "stripe",
    checkout: "płatność",
    list: "lista",
    transactions: "transakcje",
    info: "info",
  },

  // Create payment endpoint
  create: {
    title: "Utwórz sesję płatności",
    description: "Utwórz nową sesję płatności ze Stripe",
    form: {
      title: "Konfiguracja płatności",
      description: "Skonfiguruj parametry sesji płatności",
    },
    paymentMethodTypes: {
      label: "Metody płatności",
      description: "Wybierz akceptowane metody płatności",
    },
    successUrl: {
      label: "URL sukcesu",
      description: "URL przekierowania po udanej płatności",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "URL anulowania",
      description: "URL przekierowania w przypadku anulowania płatności",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "Email klienta",
      description: "Adres email klienta dla płatności",
      placeholder: "klient@example.com",
    },
    response: {
      success: "Sesja płatności utworzona pomyślnie",
      sessionId: "ID sesji Stripe",
      sessionUrl: "URL sesji Stripe",
      checkoutUrl: "URL płatności",
      message: "Wiadomość o statusie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry płatności",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd wewnętrzny",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Sesja płatności nie została znaleziona",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt płatności",
      },
    },
    success: {
      title: "Sukces",
      description: "Sesja płatności utworzona pomyślnie",
      message: "Sesja płatności utworzona pomyślnie",
    },
  },

  // Get payment endpoint
  get: {
    title: "Pobierz informacje o płatności",
    description: "Pobierz transakcje płatnicze i metody płatności",
    form: {
      title: "Zapytanie o płatność",
      description: "Zapytaj o informacje o płatności",
    },
    response: {
      success: "Dane płatności pobrane pomyślnie",
      sessionUrl: "URL sesji płatności",
      sessionId: "ID sesji płatności",
      message: "Wiadomość o statusie",
      transactions: "Transakcje płatnicze",
      paymentMethods: "Metody płatności",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry zapytania",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd wewnętrzny",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Informacje o płatności nie zostały znalezione",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd połączenia sieciowego",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt płatności",
      },
    },
    success: {
      title: "Sukces",
      description: "Informacje o płatności pobrane pomyślnie",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry płatności",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Płatność nie została znaleziona",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Brak uprawnień",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd wewnętrzny serwera",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Są niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wykryto konflikt płatności",
    },
    notImplemented: {
      title: "Nie zaimplementowano",
      description:
        "Ta funkcja dostawcy płatności nie została jeszcze zaimplementowana",
    },
    customerCreationFailed: "Nie udało się utworzyć klienta Stripe",
    customerNotFound: "Nie znaleziono klienta Stripe",
  },

  // Top-level success
  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
    sessionCreated: "Sesja płatności utworzona pomyślnie",
    infoRetrieved: "Informacje o płatności pobrane pomyślnie",
  },

  // Field labels and descriptions
  amount: {
    label: "Kwota",
    description: "Kwota płatności w określonej walucie",
    placeholder: "Wprowadź kwotę",
  },
  currency: {
    label: "Waluta",
    description: "Waluta płatności",
    placeholder: "Wybierz walutę",
    usd: "Dolar amerykański (USD)",
    eur: "Euro (EUR)",
    pln: "Złoty polski (PLN)",
  },
  mode: {
    label: "Tryb płatności",
    description: "Typ sesji płatności",
    placeholder: "Wybierz tryb płatności",
  },
  successUrl: {
    label: "URL sukcesu",
    description: "URL przekierowania po udanej płatności",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "URL anulowania",
    description: "URL przekierowania w przypadku anulowania płatności",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Metadane",
    description: "Dodatkowe metadane dla sesji płatności",
    placeholder: "Wprowadź metadane jako JSON",
  },
  paymentId: {
    label: "ID płatności",
    description: "Konkretny ID płatności do pobrania",
    placeholder: "Wprowadź ID płatności",
  },
  sessionId: {
    label: "ID sesji",
    description: "ID sesji Stripe do zapytania",
    placeholder: "Wprowadź ID sesji",
  },
  limit: {
    label: "Limit",
    description: "Maksymalna liczba wyników do zwrócenia",
    placeholder: "20",
  },
  offset: {
    label: "Przesunięcie",
    description: "Liczba wyników do pominięcia",
    placeholder: "0",
  },
  priceId: {
    label: "ID ceny",
    description: "Identyfikator ceny Stripe dla produktu",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "Dostawca płatności",
    description: "Wybierz metodę płatności",
    placeholder: "Wybierz dostawcę płatności",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "Oczekujące",
      processing: "W trakcie przetwarzania",
      succeeded: "Udało się",
      failed: "Nie udało się",
      canceled: "Anulowane",
      refunded: "Zwrócone",
    },
    paymentMethodType: {
      card: "Karta kredytowa/debetowa",
      bankTransfer: "Przelew bankowy",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "Polecenie zapłaty SEPA",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Wymaga metody płatności",
      requiresConfirmation: "Wymaga potwierdzenia",
      requiresAction: "Wymaga działania",
      processing: "W trakcie przetwarzania",
      requiresCapture: "Wymaga przechwycenia",
      canceled: "Anulowane",
      succeeded: "Udało się",
    },
    checkoutMode: {
      payment: "Płatność",
      subscription: "Subskrypcja",
      setup: "Konfiguracja",
    },
    refundStatus: {
      pending: "Oczekujące",
      succeeded: "Udało się",
      failed: "Nie udało się",
      canceled: "Anulowane",
    },
    disputeStatus: {
      warningNeedsResponse: "Ostrzeżenie - Wymaga odpowiedzi",
      warningUnderReview: "Ostrzeżenie - W trakcie przeglądu",
      warningClosed: "Ostrzeżenie - Zamknięte",
      needsResponse: "Wymaga odpowiedzi",
      underReview: "W trakcie przeglądu",
      chargeRefunded: "Opłata zwrócona",
      won: "Wygrane",
      lost: "Przegrane",
    },
    invoiceStatus: {
      draft: "Szkic",
      open: "Otwarte",
      paid: "Opłacone",
      void: "Nieważne",
      uncollectible: "Nieściągalne",
    },
    taxStatus: {
      complete: "Kompletne",
      failed: "Nie udało się",
      requiresLocation: "Wymaga lokalizacji",
    },
  },
};
