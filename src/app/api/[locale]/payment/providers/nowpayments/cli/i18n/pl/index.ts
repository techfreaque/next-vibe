import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description: "Uruchom tunel ngrok dla webhooków NOWPayments",
    category: "Płatność",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    form: {
      title: "Tunel NOWPayments",
      description:
        "Uruchom tunel ngrok do lokalnego odbioru webhooków NOWPayments",
      fields: {
        port: {
          label: "Port",
          description: "Lokalny port do tunelowania (domyślnie: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        title: "ngrok nie jest zainstalowany",
        description:
          "ngrok jest wymagany do uruchomienia tunelu. Zainstaluj go i spróbuj ponownie.",
      },
      validationFailed: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
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
        description: "Nie udało się uruchomić tunelu",
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
    success: {
      title: "Tunel uruchomiony",
      description: "Tunel ngrok działa",
    },
  },
};
