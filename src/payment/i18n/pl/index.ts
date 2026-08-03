import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Utwórz płatność subskrypcji",
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
          title: "Nie znaleziono",
          description: "Sesja płatności nie została znaleziona",
        },
        server: {
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

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Miesięcznie",
      yearly: "Rocznie",
    },
  },
  invoice: {
    category: "Rozliczenia",
    tags: {
      payment: "płatność",
      invoice: "faktura",
      transactions: "transakcje",
    },
    defaultItem: "Pozycja faktury",
    success: {
      created: "Faktura utworzona pomyślnie",
    },
    post: {
      title: "Tytuł",
      description: "Opis endpointu",
      form: {
        title: "Konfiguracja",
        description: "Skonfiguruj parametry",
      },
      response: {
        success: "Faktura utworzona pomyślnie",
        message: "Wiadomość o statusie",
        invoice: {
          title: "Szczegóły faktury",
          description: "Informacje o wygenerowanej fakturze",
          id: "ID faktury",
          userId: "ID użytkownika",
          stripeInvoiceId: "ID faktury Stripe",
          invoiceNumber: "Numer faktury",
          amount: "Kwota",
          currency: "Waluta",
          status: "Status",
          invoiceUrl: "URL faktury",
          invoicePdf: "PDF faktury",
          dueDate: "Termin płatności",
          paidAt: "Opłacono dnia",
          createdAt: "Utworzono dnia",
          updatedAt: "Zaktualizowano dnia",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
      widget: {
        back: "Wstecz",
      },
    },
    customerId: {
      label: "ID klienta",
      description: "Identyfikator klienta Stripe",
      placeholder: "Wprowadź ID klienta",
    },
    amount: {
      label: "Kwota",
      description: "Kwota faktury",
      placeholder: "Wprowadź kwotę",
    },
    currency: {
      label: "Waluta",
      description: "Kod waluty",
      placeholder: "Wybierz walutę",
      usd: "Dolar amerykański (USD)",
      eur: "Euro (EUR)",
      pln: "Złoty polski (PLN)",
    },
    description: {
      label: "Opis",
      description: "Opis faktury",
      placeholder: "Wprowadź opis",
    },
    dueDate: {
      label: "Termin płatności",
      description: "Termin zapłaty",
      placeholder: "Wybierz termin płatności",
    },
    metadata: {
      label: "Metadane",
      description: "Dodatkowe metadane",
      placeholder: "Wprowadź metadane jako JSON",
    },
  },
  portal: {
    success: {
      created: "Sesja portalu klienta utworzona pomyślnie",
    },
    post: {
      title: "Tytuł",
      description: "Opis endpointu",
      form: {
        title: "Konfiguracja portalu",
        description: "Skonfiguruj parametry portalu klienta",
      },
      returnUrl: {
        label: "URL powrotu",
        description: "URL przekierowania po sesji portalu",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "Sesja portalu utworzona pomyślnie",
        message: "Wiadomość o statusie",
        customerPortalUrl: "URL portalu klienta",
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagana autoryzacja",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie został znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt danych",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
  refund: {
    title: "Przetwórz zwrot",
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
  },
  providers: {
    stripe: {
      title: "Integracja Stripe CLI",
      description:
        "Zarządzanie operacjami Stripe CLI i nasłuchiwaniem webhook-ów",
      category: "Integracja płatności",
      tags: {
        stripe: "Stripe",
        cli: "Linia poleceń",
        webhook: "Webhook",
      },

      operations: {
        check: "Sprawdź instalację",
        install: "Zainstaluj Stripe CLI",
        listen: "Uruchom nasłuchiwanie webhook-ów",
        login: "Zaloguj się do Stripe",
        status: "Sprawdź status",
      },

      form: {
        title: "Konfiguracja Stripe CLI",
        description: "Konfiguruj operacje Stripe CLI i ustawienia webhook-ów",
        fields: {
          operation: {
            label: "Typ operacji",
            description: "Wybierz operację Stripe CLI do wykonania",
            placeholder: "Wybierz operację...",
          },
          port: {
            label: "Numer portu",
            description: "Numer portu do przekazywania webhook-ów (1000-65535)",
            placeholder: "4242",
          },
          events: {
            label: "Zdarzenia webhook-ów",
            description: "Wybierz zdarzenia Stripe do nasłuchiwania",
            placeholder: "Wybierz zdarzenia do monitorowania...",
            paymentIntentSucceeded: "Płatność zakończona sukcesem",
            paymentIntentFailed: "Płatność nie powiodła się",
            subscriptionCreated: "Subskrypcja utworzona",
            subscriptionUpdated: "Subskrypcja zaktualizowana",
            invoicePaymentSucceeded: "Płatność faktury zakończona sukcesem",
            invoicePaymentFailed: "Płatność faktury nie powiodła się",
          },
          forwardTo: {
            label: "Przekaż do URL",
            description: "Lokalny endpoint do przekazywania zdarzeń webhook",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "Pomiń weryfikację SSL",
            description: "Pomiń weryfikację certyfikatu SSL w rozwoju",
          },
        },
      },

      response: {
        success: "Operacja zakończona pomyślnie",
        installed: "Status instalacji Stripe CLI",
        version: "Zainstalowana wersja Stripe CLI",
        status: "Aktualny status operacji",
        output: "Wyjście polecenia i logi",
        instructions: "Następne kroki i instrukcje",
        webhookEndpoint: "URL endpoint-u webhook",
      },

      login: {
        instructions:
          "Aby uwierzytelnić się w Stripe, uruchom 'stripe login' w terminalu i postępuj zgodnie z instrukcjami, aby połączyć swoje konto Stripe.",
      },

      status: {
        authenticated: "Uwierzytelniony i gotowy",
        not_authenticated: "Nieuwierzytelniony - uruchom 'stripe login'",
        not_installed: "Stripe CLI nie jest zainstalowany",
      },

      errors: {
        validation: {
          title: "Nieprawidłowa konfiguracja",
          description: "Sprawdź konfigurację Stripe CLI i spróbuj ponownie",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z usługami Stripe",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Nie masz uprawnień do wykonania tej operacji",
        },
        forbidden: {
          title: "Dostęp zabroniony",
          description: "Ta operacja nie jest dozwolona dla Twojego konta",
        },
        notFound: {
          title: "Zasób nie znaleziony",
          description: "Żądany zasób Stripe nie został znaleziony",
        },
        serverError: {
          title: "Błąd serwera",
          description: "Wystąpił błąd podczas przetwarzania operacji Stripe",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd z Stripe CLI",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany konfiguracji",
        },
        conflict: {
          title: "Konflikt operacji",
          description: "Inna operacja Stripe jest obecnie w toku",
        },
        execution_failed:
          "Operacja Stripe CLI nie mogła być prawidłowo wykonana",
        userNotFound: {
          title: "Nie znaleziono użytkownika",
          description: "Określony użytkownik nie został znaleziony",
        },
        customerCreationFailed: {
          title: "Tworzenie klienta nie powiodło się",
          description: "Nie udało się utworzyć klienta Stripe",
        },
        customerRetrievalFailed: {
          title: "Pobieranie klienta nie powiodło się",
          description: "Nie udało się pobrać informacji o kliencie Stripe",
        },
        checkoutCreationFailed: {
          title: "Tworzenie checkout nie powiodło się",
          description: "Nie udało się utworzyć sesji checkout Stripe",
        },
        webhookVerificationFailed: {
          title: "Weryfikacja webhooka nie powiodła się",
          description: "Nie udało się zweryfikować podpisu webhooka",
        },
        subscriptionRetrievalFailed: {
          title: "Pobieranie subskrypcji nie powiodło się",
          description: "Nie udało się pobrać subskrypcji ze Stripe",
        },
        subscriptionCancellationFailed: {
          title: "Anulowanie subskrypcji nie powiodło się",
          description: "Nie udało się anulować subskrypcji w Stripe",
        },
        priceCreationFailed: {
          title: "Tworzenie ceny nie powiodło się",
          description: "Nie udało się utworzyć ceny w Stripe",
        },
        notConfigured: {
          title: "Stripe nie jest skonfigurowany",
          description:
            "Stripe nie jest skonfigurowany - ustaw STRIPE_SECRET_KEY w pliku .env",
        },
        stripeCliNotInstalled: "Stripe CLI nie jest zainstalowany",
        listenerFailed: "Nie udało się uruchomić nasłuchiwacza webhooka Stripe",
      },

      success: {
        title: "Operacja pomyślna",
        description: "Operacja Stripe CLI zakończona pomyślnie",
      },

      installInstructions: {
        documentation:
          "Zainstaluj Stripe CLI zgodnie z oficjalną dokumentacją pod adresem: https://docs.stripe.com/stripe-cli",
        quickInstallation: "Szybkie opcje instalacji:",
        macOS: {
          title: "macOS (używając Homebrew):",
          command: "brew install stripe/stripe-cli/stripe",
        },
        linux: {
          title: "Linux (używając menedżera pakietów):",
          debian: {
            title: "Debian/Ubuntu",
          },
          fedora: {
            title: "CentOS/RHEL/Fedora",
          },
        },
        windows: {
          title: "Windows:",
          scoop: {
            title: "Używając Scoop",
          },
          github: {
            title: "Lub pobierz bezpośrednio z GitHub releases:",
            url: "https://github.com/stripe/stripe-cli/releases",
          },
        },
        authentication: {
          title: "Po instalacji uwierzytelnij się za pomocą:",
          command: "stripe login",
        },
      },
    },
    nowpayments: {
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
          description:
            "E-mail użytkownika jest wymagany dla subskrypcji: {userId}",
        },
        checkoutCreationFailed: {
          title: "Tworzenie checkout nie powiodło się",
          description:
            "Nie udało się utworzyć sesji checkout NOWPayments: {error}",
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
          description:
            "Nie udało się utworzyć subskrypcji NOWPayments: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Pobieranie subskrypcji nie powiodło się",
          description: "Nie udało się pobrać subskrypcji NOWPayments: {error}",
        },
        subscriptionCancellationFailed: {
          title: "Anulowanie subskrypcji nie powiodło się",
          description:
            "Nie udało się anulować subskrypcji NOWPayments: {error}",
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
    },
  },

  // Main payment domain
  category: "Rozliczenia",

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
    titleShort: "Utwórz sesję",
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
        detail: "Nie znaleziono konta dla użytkownika {{userId}}",
        title: "Nie znaleziono",
        description: "Sesja płatności nie została znaleziona",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień",
      },
      server: {
        detail: "Nie udało się utworzyć sesji płatności: {{error}}",
        stripeNotConfigured:
          "Stripe nie jest jeszcze skonfigurowany. Dodaj STRIPE_SECRET_KEY do swojego środowiska.",
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
    titleShort: "Płatności",
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
        detail: "Nie udało się pobrać informacji o płatnościach: {{error}}",
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
      signInRequired: "Zaloguj się, aby zarządzać płatnościami",
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Brak uprawnień",
    },
    server: {
      detail: "Nie udało się przetworzyć webhooka płatności: {{error}}",
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
    localMode: "Płatność jest wyłączona w lokalnym trybie deweloperskim.",
    webhookVerificationFailed:
      "Weryfikacja podpisu webhooka nie powiodła się: {{error}}",
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
    paymentInterval: {
      month: "Miesięcznie",
      year: "Rocznie",
      one_time: "Jednorazowo",
    },
    manualPaymentMethod: {
      cash: "Gotówka",
      bankTransfer: "Przelew bankowy",
      other: "Inne",
    },
    billStatus: {
      DRAFT: "Szkic",
      RECEIVED: "Otrzymana",
      APPROVED: "Zatwierdzona",
      PAID: "Opłacona",
      DISPUTED: "Sporna",
    },
    estimateStatus: {
      DRAFT: "Szkic",
      SENT: "Wysłana",
      ACCEPTED: "Zaakceptowana",
      DECLINED: "Odrzucona",
      EXPIRED: "Wygasła",
      CONVERTED: "Przekonwertowana",
    },
  },
};
