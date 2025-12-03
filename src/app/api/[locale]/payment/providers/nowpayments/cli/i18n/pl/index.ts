import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    description: "Zarządzaj tunelowaniem webhooków NOWPayments za pomocą ngrok",
    category: "Płatność",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    operations: {
      check: "Sprawdź",
      install: "Zainstaluj",
      tunnel: "Tunel",
      status: "Status",
    },
    form: {
      title: "Operacje NOWPayments CLI",
      description:
        "Konfiguruj i zarządzaj tunelem ngrok dla webhooków NOWPayments",
      fields: {
        operation: {
          label: "Operacja",
          description: "Wybierz operację do wykonania",
          placeholder: "Wybierz operację",
        },
        port: {
          label: "Port",
          description: "Lokalny port do tunelowania (domyślnie: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      validationFailed: {
        title: "Błąd walidacji",
        description: "Nieprawidłowa operacja lub parametry",
      },
      networkError: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      unauthorized: {
        title: "Nieautoryzowany",
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
        description: "Nie udało się wykonać operacji",
      },
      unknownError: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt zasobów",
      },
    },
    response: {
      title: "Odpowiedź",
      description: "Wynik operacji",
      fields: {
        success: "Sukces",
        installed: "Zainstalowane",
        version: "Wersja",
        status: "Status",
        output: "Wyjście",
        instructions: "Instrukcje",
        tunnelUrl: "URL tunelu",
        webhookUrl: "URL webhooka",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
