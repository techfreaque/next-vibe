import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  overview: {
    description: "Wyświetl i podgląd szablonów e-mail",
    template: "szablon",
    templates: "szablony",
    version: "Wersja",
    id: "ID",
    view_preview: "Wyświetl podgląd",
    total: "Wszystkie szablony",
  },
  preview: {
    back_to_templates: "Powrót do szablonów",
    previous: "Poprzedni szablon",
    next: "Następny szablon",
    id: "ID szablonu",
    version: "Wersja",
    category: "Kategoria",
    path: "Ścieżka szablonu",
    send_test: "Wyślij testową wiadomość e-mail",
    loading: "Ładowanie podglądu...",
    error_loading: "Nie udało się załadować podglądu wiadomości e-mail",
    locale: {
      title: "Język i Kraj Podglądu",
      description: "Wybierz język i kraj dla podglądu e-maila",
      language: "Język",
      country: "Kraj",
      languages: {
        en: "English",
        de: "Deutsch",
        pl: "Polski",
      },
      countries: {
        GLOBAL: "Globalny",
        DE: "Niemcy",
        PL: "Polska",
        US: "Stany Zjednoczone",
      },
    },
    form: {
      title: "Dostosuj Podgląd E-maila",
      description:
        "Dostosuj właściwości e-maila, aby podejrzeć różne scenariusze",
      reset: "Resetuj",
      select_option: "Wybierz opcję...",
    },
  },
  test: {
    title: "Test E-mail",
    description: "Wyślij testową wiadomość e-mail, aby zweryfikować szablon",
    recipient: "E-mail odbiorcy",
    template: "Szablon",
    success: "Testowa wiadomość e-mail została wysłana pomyślnie",
    send: "Wyślij testową wiadomość e-mail",
    sending: "Wysyłanie...",
  },
  templates: {
    signup: {
      welcome: {
        meta: {
          name: "Powitalna wiadomość e-mail rejestracji",
          description:
            "Powitalna wiadomość e-mail wysyłana do nowych użytkowników po rejestracji",
        },
        preview: {
          privateName: {
            label: "Nazwa użytkownika",
            description: "Imię użytkownika lub preferowana nazwa",
          },
          userId: {
            label: "ID użytkownika",
            description: "Unikalny identyfikator konta użytkownika",
          },
          leadId: {
            label: "ID potencjalnego klienta",
            description:
              "Identyfikator śledzenia potencjalnego klienta do analityki",
          },
        },
      },
    },
    newsletter: {
      welcome: {
        meta: {
          name: "Powitalna wiadomość e-mail biuletynu",
          description:
            "Powitalna wiadomość e-mail wysyłana do nowych subskrybentów biuletynu",
        },
        preview: {
          email: {
            label: "Adres e-mail",
            description: "Adres e-mail subskrybenta",
          },
          name: {
            label: "Nazwa subskrybenta",
            description: "Nazwa subskrybenta (opcjonalnie)",
          },
          leadId: {
            label: "ID Leada",
            description: "Identyfikator leada do analityki",
          },
          userId: {
            label: "ID Użytkownika",
            description: "Identyfikator konta użytkownika (opcjonalnie)",
          },
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Wiadomość e-mail potwierdzenia subskrypcji",
          description:
            "Potwierdzająca wiadomość e-mail wysyłana po udanej subskrypcji",
        },
        preview: {
          privateName: {
            label: "Imię",
            description: "Imię użytkownika",
          },
          userId: {
            label: "ID Użytkownika",
            description: "Unikalny identyfikator użytkownika",
          },
          leadId: {
            label: "ID Leada",
            description: "Identyfikator leada",
          },
          planName: {
            label: "Nazwa planu",
            description: "Nazwa planu subskrypcji",
          },
        },
      },
    },
    password: {
      reset: {
        request: {
          meta: {
            name: "Wiadomość e-mail żądania resetowania hasła",
            description: "Wiadomość e-mail z linkiem do resetowania hasła",
          },
          preview: {
            privateName: {
              label: "Nazwa użytkownika",
              description: "Publiczna nazwa użytkownika",
            },
            userId: {
              label: "ID Użytkownika",
              description: "Unikalny identyfikator użytkownika",
            },
            resetToken: {
              label: "URL resetowania hasła",
              description: "Pełny adres URL do zresetowania hasła",
            },
          },
        },
        confirm: {
          meta: {
            name: "Potwierdzająca wiadomość e-mail resetowania hasła",
            description: "Potwierdzająca wiadomość e-mail po resetowaniu hasła",
          },
          preview: {
            privateName: {
              label: "Nazwa użytkownika",
              description: "Publiczna nazwa użytkownika",
            },
            userId: {
              label: "ID Użytkownika",
              description: "Unikalny identyfikator użytkownika",
            },
          },
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Wiadomość e-mail formularza kontaktowego",
          description:
            "Wiadomość e-mail wysyłana po przesłaniu formularza kontaktowego",
        },
        preview: {
          name: {
            label: "Nazwa nadawcy",
            description: "Nazwa osoby przesyłającej formularz",
          },
          email: {
            label: "E-mail nadawcy",
            description: "Adres e-mail nadawcy",
          },
          subject: {
            label: "Temat",
            description: "Temat formularza kontaktowego",
          },
          message: {
            label: "Wiadomość",
            description: "Zawartość wiadomości formularza kontaktowego",
          },
          company: {
            label: "Firma",
            description: "Nazwa firmy (opcjonalnie)",
          },
          isForCompany: {
            label: "Dla konta firmowego",
            description: "Czy dotyczy firmy czy osoby prywatnej",
          },
          userId: {
            label: "ID użytkownika",
            description: "Identyfikator konta użytkownika (opcjonalnie)",
          },
          leadId: {
            label: "ID leada",
            description: "Identyfikator śledzenia leada",
          },
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: Nowa rejestracja użytkownika",
          description: "Powiadomienie admina o nowej rejestracji użytkownika",
        },
        preview: {
          privateName: {
            label: "Imię prywatne",
            description: "Prywatne imię użytkownika",
          },
          publicName: {
            label: "Nazwa publiczna",
            description: "Publiczna nazwa wyświetlana użytkownika",
          },
          email: {
            label: "E-mail",
            description: "Adres e-mail użytkownika",
          },
          userId: {
            label: "ID użytkownika",
            description: "Unikalny identyfikator użytkownika",
          },
          subscribeToNewsletter: {
            label: "Subskrypcja newslettera",
            description: "Czy użytkownik zasubskrybował newsletter",
          },
        },
      },
      subscription: {
        meta: {
          name: "Admin: Nowa subskrypcja",
          description: "Powiadomienie admina o nowej subskrypcji",
        },
        preview: {
          privateName: {
            label: "Imię prywatne",
            description: "Prywatne imię użytkownika",
          },
          publicName: {
            label: "Nazwa publiczna",
            description: "Publiczna nazwa wyświetlana użytkownika",
          },
          email: {
            label: "E-mail",
            description: "Adres e-mail użytkownika",
          },
          planName: {
            label: "Nazwa planu",
            description: "Nazwa planu subskrypcji",
          },
          statusName: {
            label: "Status",
            description: "Aktualny status subskrypcji",
          },
        },
      },
      user_create: {
        meta: {
          name: "Admin: Nowy użytkownik utworzony",
          description: "Powiadomienie admina o utworzeniu konta użytkownika",
        },
        preview: {
          privateName: {
            label: "Imię prywatne",
            description: "Prywatne imię użytkownika",
          },
          publicName: {
            label: "Nazwa publiczna",
            description: "Publiczna nazwa wyświetlana użytkownika",
          },
          email: {
            label: "E-mail",
            description: "Adres e-mail użytkownika",
          },
          userId: {
            label: "ID użytkownika",
            description: "Unikalny identyfikator użytkownika",
          },
          leadId: {
            label: "ID leada",
            description: "Identyfikator śledzenia leada (opcjonalnie)",
          },
        },
      },
      contact: {
        meta: {
          name: "Admin: Zgłoszenie formularza kontaktowego",
          description:
            "Powiadomienie admina o przesłaniu formularza kontaktowego",
        },
        preview: {
          name: {
            label: "Nazwa nadawcy",
            description: "Nazwa osoby, która przesłała formularz",
          },
          email: {
            label: "E-mail nadawcy",
            description: "Adres e-mail nadawcy",
          },
          subject: {
            label: "Temat",
            description: "Temat formularza kontaktowego",
          },
          message: {
            label: "Wiadomość",
            description: "Zawartość wiadomości formularza kontaktowego",
          },
          company: {
            label: "Firma",
            description: "Nazwa firmy (opcjonalnie)",
          },
          userId: {
            label: "ID użytkownika",
            description: "Identyfikator konta użytkownika (opcjonalnie)",
          },
          leadId: {
            label: "ID leada",
            description: "Identyfikator śledzenia leada",
          },
        },
      },
    },
  },
};
