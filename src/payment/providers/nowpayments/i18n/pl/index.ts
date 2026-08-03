import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description: "Dostawca płatności kryptowalutowych z obsługą subskrypcji",

  cli: {
    post: {
      title: "NOWPayments CLI",
      description:
        "Zarządzaj tunelowaniem webhooków NOWPayments za pomocą ngrok",
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
  },

  errors: {
    userNotFound: {
      detail: "Nie znaleziono konta dla użytkownika {{userId}}",
      title: "Użytkownik nie znaleziony",
      description: "Nie można znaleźć określonego użytkownika",
    },
    customerCreationFailed: {
      detail:
        "Nie udało się utworzyć konta klienta NOWPayments: {{error}} (użytkownik {{userId}})",
      title: "Tworzenie klienta nie powiodło się",
      description: "Nie udało się utworzyć klienta NOWPayments: {{error}}",
    },
    productNotFound: {
      detail: "Produkt {{productId}} nie istnieje",
      title: "Produkt nie znaleziony",
      description: "Nie można znaleźć określonego produktu: {{productId}}",
    },
    userEmailRequired: {
      title: "Wymagany e-mail użytkownika",
      description:
        "E-mail użytkownika jest wymagany dla subskrypcji: {{userId}}",
    },
    checkoutCreationFailed: {
      detail: "Nie udało się rozpocząć płatności kryptowalutą: {{error}}",
      title: "Tworzenie checkout nie powiodło się",
      description:
        "Nie udało się utworzyć sesji checkout NOWPayments: {{error}}",
    },
    invoiceCreationFailed: {
      detail: "Nie udało się utworzyć faktury NOWPayments: {{error}}",
      title: "Tworzenie faktury nie powiodło się",
      description: "Nie udało się utworzyć faktury NOWPayments: {{error}}",
    },
    invalidApiKey: {
      detail:
        "Nieprawidłowy klucz API NOWPayments. Sprawdź NOWPAYMENTS_API_KEY w swoim środowisku i potwierdź klucz na https://nowpayments.io/app/dashboard",
      title: "Nieprawidłowy klucz API",
      description:
        "Nieprawidłowy klucz API NOWPayments. Sprawdź swoją konfigurację i upewnij się, że masz prawidłowy klucz API z https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Tworzenie planu nie powiodło się",
      description:
        "Nie udało się utworzyć planu subskrypcji NOWPayments: {{error}}",
    },
    subscriptionCreationFailed: {
      title: "Tworzenie subskrypcji nie powiodło się",
      description: "Nie udało się utworzyć subskrypcji NOWPayments: {{error}}",
    },
    subscriptionRetrievalFailed: {
      detail: "Nie udało się pobrać subskrypcji NOWPayments: {{error}}",
      title: "Pobieranie subskrypcji nie powiodło się",
      description: "Nie udało się pobrać subskrypcji NOWPayments: {{error}}",
    },
    subscriptionCancellationFailed: {
      detail: "Nie udało się anulować subskrypcji NOWPayments: {{error}}",
      title: "Anulowanie subskrypcji nie powiodło się",
      description: "Nie udało się anulować subskrypcji NOWPayments: {{error}}",
    },
    subscriptionListFailed: {
      detail: "Nie udało się pobrać listy subskrypcji NOWPayments: {{error}}",
      title: "Pobieranie listy subskrypcji nie powiodło się",
      description:
        "Nie udało się pobrać listy subskrypcji NOWPayments: {{error}}",
    },
    notConfigured: {
      title: "NOWPayments nie jest skonfigurowany",
      description:
        "NOWPayments nie jest skonfigurowany - ustaw NOWPAYMENTS_API_KEY i NOWPAYMENTS_IPN_SECRET w pliku .env",
    },
    webhookVerificationFailed: {
      detail: "Nie udało się zweryfikować webhooka NOWPayments: {{error}}",
      invalidSignature: "Podpis webhooka nie zgadza się",
      title: "Weryfikacja webhooka nie powiodła się",
      description:
        "Nie udało się zweryfikować podpisu webhooka NOWPayments: {{error}}",
    },
    paymentStatusFailed: {
      detail: "Nie udało się pobrać statusu płatności z NOWPayments: {{error}}",
      title: "Pobieranie statusu płatności nie powiodło się",
      description:
        "Nie udało się pobrać statusu płatności z NOWPayments: {{error}}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Faktura utworzona",
      description: "Faktura NOWPayments utworzona pomyślnie",
    },
    webhookVerified: {
      title: "Webhook zweryfikowany",
      description: "Webhook NOWPayments zweryfikowany pomyślnie",
    },
    paymentStatusRetrieved: {
      title: "Status płatności pobrany",
      description: "Status płatności NOWPayments pobrany pomyślnie",
    },
  },
};
