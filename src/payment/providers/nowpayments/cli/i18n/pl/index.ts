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
        instructions:
          "Jak zainstalować ngrok:\n\n1. Wejdź na https://ngrok.com/download\n2. Pobierz ngrok dla swojej platformy\n3. Rozpakuj go i przenieś do swojego PATH\n4. Uruchom: ngrok authtoken TWOJ_AUTH_TOKEN (token znajdziesz na https://dashboard.ngrok.com/get-started/your-authtoken)\n\nAlbo zainstaluj menedżerem pakietów:\n- macOS: brew install ngrok/ngrok/ngrok\n- Linux: snap install ngrok\n- Windows: choco install ngrok",
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
        noTunnelUrl: "Nie udało się odczytać adresu tunelu ngrok",
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
