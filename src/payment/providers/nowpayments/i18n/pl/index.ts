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
      title: "Użytkownik nie znaleziony",
      description: "Nie można znaleźć określonego użytkownika",
    },
    customerCreationFailed: {
      title: "Tworzenie klienta nie powiodło się",
      description: "Nie udało się utworzyć klienta NOWPayments: {error}",
    },
    productNotFound: {
      title: "Produkt nie znaleziony",
      description: "Nie można znaleźć określonego produktu: {productId}",
    },
    userEmailRequired: {
      title: "Wymagany e-mail użytkownika",
      description: "E-mail użytkownika jest wymagany dla subskrypcji: {userId}",
    },
    checkoutCreationFailed: {
      title: "Tworzenie checkout nie powiodło się",
      description: "Nie udało się utworzyć sesji checkout NOWPayments: {error}",
    },
    invoiceCreationFailed: {
      title: "Tworzenie faktury nie powiodło się",
      description: "Nie udało się utworzyć faktury NOWPayments: {error}",
    },
    invalidApiKey: {
      title: "Nieprawidłowy klucz API",
      description:
        "Nieprawidłowy klucz API NOWPayments. Sprawdź swoją konfigurację i upewnij się, że masz prawidłowy klucz API z https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Tworzenie planu nie powiodło się",
      description:
        "Nie udało się utworzyć planu subskrypcji NOWPayments: {error}",
    },
    subscriptionCreationFailed: {
      title: "Tworzenie subskrypcji nie powiodło się",
      description: "Nie udało się utworzyć subskrypcji NOWPayments: {error}",
    },
    subscriptionRetrievalFailed: {
      title: "Pobieranie subskrypcji nie powiodło się",
      description: "Nie udało się pobrać subskrypcji NOWPayments: {error}",
    },
    subscriptionCancellationFailed: {
      title: "Anulowanie subskrypcji nie powiodło się",
      description: "Nie udało się anulować subskrypcji NOWPayments: {error}",
    },
    subscriptionListFailed: {
      title: "Pobieranie listy subskrypcji nie powiodło się",
      description:
        "Nie udało się pobrać listy subskrypcji NOWPayments: {error}",
    },
    notConfigured: {
      title: "NOWPayments nie jest skonfigurowany",
      description:
        "NOWPayments nie jest skonfigurowany - ustaw NOWPAYMENTS_API_KEY i NOWPAYMENTS_IPN_SECRET w pliku .env",
    },
    webhookVerificationFailed: {
      title: "Weryfikacja webhooka nie powiodła się",
      description:
        "Nie udało się zweryfikować podpisu webhooka NOWPayments: {error}",
    },
    paymentStatusFailed: {
      title: "Pobieranie statusu płatności nie powiodło się",
      description:
        "Nie udało się pobrać statusu płatności z NOWPayments: {error}",
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
