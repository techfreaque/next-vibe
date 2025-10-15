import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  tag: "Zarządzanie użytkownikami",

  id: {
    get: {
      title: "Pobierz użytkownika",
      description: "Pobierz szczegółowe informacje o konkretnym użytkowniku",
      container: {
        title: "Szczegóły użytkownika",
        description: "Wyświetl szczegółowe informacje o użytkowniku",
      },
      id: {
        label: "ID użytkownika",
        description: "Unikalny identyfikator użytkownika",
        placeholder: "Wprowadź ID użytkownika...",
      },
      response: {
        userProfile: {
          title: "Profil użytkownika",
          description: "Szczegółowe informacje o profilu użytkownika",
          basicInfo: {
            title: "Informacje podstawowe",
            description: "Główne informacje o użytkowniku",
            id: {
              content: "ID użytkownika",
            },
            email: {
              content: "Adres e-mail",
            },
            privateName: {
              content: "Nazwa prywatna",
            },
            publicName: {
              content: "Nazwa publiczna",
            },
            firstName: {
              content: "Imię",
            },
            lastName: {
              content: "Nazwisko",
            },
            company: {
              content: "Firma",
            },
          },
          contactDetails: {
            title: "Dane kontaktowe",
            description: "Informacje kontaktowe użytkownika",
            phone: {
              content: "Numer telefonu",
            },
            preferredContactMethod: {
              content: "Preferowana metoda kontaktu",
            },
            website: {
              content: "Strona internetowa",
            },
          },
        },
        profileDetails: {
          title: "Szczegóły profilu",
          description: "Dodatkowe informacje o profilu",
          imageUrl: {
            content: "Zdjęcie profilowe",
          },
          bio: {
            content: "Biografia",
          },
          jobTitle: {
            content: "Stanowisko",
          },
          leadId: {
            content: "ID powiązanego leada",
          },
        },
        accountStatus: {
          title: "Status konta",
          description: "Informacje o statusie konta użytkownika",
          isActive: {
            content: "Status aktywności",
          },
          emailVerified: {
            content: "E-mail zweryfikowany",
          },
          stripeCustomerId: {
            content: "ID klienta Stripe",
          },
          userRoles: {
            content: "Role użytkownika",
          },
        },
        timestamps: {
          title: "Znaczniki czasu",
          description: "Znaczniki czasu utworzenia i aktualizacji",
          createdAt: {
            content: "Utworzono",
          },
          updatedAt: {
            content: "Zaktualizowano",
          },
        },
        leadId: {
          content: "ID powiązanego leada",
        },
        email: {
          content: "Adres e-mail",
        },
        privateName: {
          content: "Nazwa prywatna",
        },
        publicName: {
          content: "Nazwa publiczna",
        },
        firstName: {
          content: "Imię",
        },
        lastName: {
          content: "Nazwisko",
        },
        company: {
          content: "Firma",
        },
        phone: {
          content: "Numer telefonu",
        },
        preferredContactMethod: {
          content: "Preferowana metoda kontaktu",
        },
        imageUrl: {
          content: "Zdjęcie profilowe",
        },
        bio: {
          content: "Biografia",
        },
        website: {
          content: "Strona internetowa",
        },
        jobTitle: {
          content: "Stanowisko",
        },
        emailVerified: {
          content: "E-mail zweryfikowany",
        },
        isActive: {
          content: "Status aktywności",
        },
        stripeCustomerId: {
          content: "ID klienta Stripe",
        },
        userRoles: {
          content: "Role użytkownika",
        },
        createdAt: {
          content: "Utworzono",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description:
            "Musisz być zalogowany, aby wyświetlić szczegóły użytkownika",
        },
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Podano nieprawidłowy ID użytkownika",
        },
        forbidden: {
          title: "Dostęp zabroniony",
          description: "Nie masz uprawnień do wyświetlenia tego użytkownika",
        },
        notFound: {
          title: "Użytkownik nie znaleziony",
          description: "Żądany użytkownik nie został znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można pobrać użytkownika z powodu błędu serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description:
            "Wystąpił nieoczekiwany błąd podczas pobierania użytkownika",
        },
        conflict: {
          title: "Błąd konfliktu",
          description:
            "Nie można pobrać użytkownika z powodu istniejących konfliktów",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany, które zostaną utracone",
        },
      },
      success: {
        title: "Użytkownik pobrany pomyślnie",
        description: "Informacje o użytkowniku zostały pobrane pomyślnie",
      },
    },
    put: {
      title: "Aktualizuj użytkownika",
      description: "Aktualizuj informacje o użytkowniku i szczegóły profilu",
      container: {
        title: "Aktualizuj użytkownika",
        description: "Modyfikuj informacje o użytkowniku i ustawienia",
      },
      id: {
        label: "ID użytkownika",
        description: "Unikalny identyfikator użytkownika do aktualizacji",
        placeholder: "Wprowadź ID użytkownika...",
      },
      sections: {
        basicInfo: {
          title: "Informacje podstawowe",
          description: "Aktualizuj podstawowe informacje o użytkowniku",
        },
        contactInfo: {
          title: "Informacje kontaktowe",
          description: "Aktualizuj dane kontaktowe",
        },
        profileDetails: {
          title: "Szczegóły profilu",
          description: "Aktualizuj dodatkowe informacje o profilu",
        },
        adminSettings: {
          title: "Ustawienia administracyjne",
          description: "Aktualizuj ustawienia administracyjne",
        },
      },
      email: {
        label: "Adres e-mail",
        description: "Adres e-mail użytkownika do logowania i komunikacji",
        placeholder: "Wprowadź adres e-mail...",
      },
      privateName: {
        label: "Nazwa prywatna",
        description:
          "Pełne imię i nazwisko użytkownika (widoczne tylko dla administratorów)",
      },
      publicName: {
        label: "Nazwa publiczna",
        description:
          "Nazwa wyświetlana użytkownika (widoczna dla wszystkich użytkowników)",
      },
      firstName: {
        label: "Imię",
        description: "Imię użytkownika",
        placeholder: "Wprowadź imię...",
      },
      lastName: {
        label: "Nazwisko",
        description: "Nazwisko użytkownika",
        placeholder: "Wprowadź nazwisko...",
      },
      company: {
        label: "Firma",
        description: "Firma lub organizacja użytkownika",
        placeholder: "Wprowadź nazwę firmy...",
      },
      phone: {
        label: "Numer telefonu",
        description: "Numer telefonu kontaktowego użytkownika",
        placeholder: "Wprowadź numer telefonu...",
      },
      preferredContactMethod: {
        label: "Preferowana metoda kontaktu",
        description: "W jaki sposób użytkownik preferuje być kontaktowany",
      },
      bio: {
        label: "Biografia",
        description: "Krótki opis użytkownika",
        placeholder: "Wprowadź biografię...",
      },
      website: {
        label: "Strona internetowa",
        description: "Osobista lub firmowa strona internetowa użytkownika",
        placeholder: "Wprowadź URL strony...",
      },
      jobTitle: {
        label: "Stanowisko",
        description: "Stanowisko lub pozycja użytkownika",
        placeholder: "Wprowadź stanowisko...",
      },
      emailVerified: {
        label: "E-mail zweryfikowany",
        description: "Czy e-mail użytkownika jest zweryfikowany",
      },
      isActive: {
        label: "Status aktywności",
        description: "Czy konto użytkownika jest aktywne",
      },
      leadId: {
        label: "ID leada",
        description: "Identyfikator powiązanego leada",
        placeholder: "Wprowadź ID leada...",
      },
      response: {
        leadId: {
          content: "ID powiązanego leada",
        },
        email: {
          content: "Adres e-mail",
        },
        privateName: {
          content: "Nazwa prywatna",
        },
        publicName: {
          content: "Nazwa publiczna",
        },
        firstName: {
          content: "Imię",
        },
        lastName: {
          content: "Nazwisko",
        },
        company: {
          content: "Firma",
        },
        phone: {
          content: "Numer telefonu",
        },
        preferredContactMethod: {
          content: "Preferowana metoda kontaktu",
        },
        imageUrl: {
          content: "Zdjęcie profilowe",
        },
        bio: {
          content: "Biografia",
        },
        website: {
          content: "Strona internetowa",
        },
        jobTitle: {
          content: "Stanowisko",
        },
        emailVerified: {
          content: "E-mail zweryfikowany",
        },
        isActive: {
          content: "Status aktywności",
        },
        stripeCustomerId: {
          content: "ID klienta Stripe",
        },
        userRoles: {
          content: "Role użytkownika",
        },
        createdAt: {
          content: "Utworzono",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany, aby aktualizować użytkowników",
        },
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Sprawdź dane formularza i spróbuj ponownie",
        },
        forbidden: {
          title: "Dostęp zabroniony",
          description: "Nie masz uprawnień do aktualizacji tego użytkownika",
        },
        notFound: {
          title: "Użytkownik nie znaleziony",
          description: "Użytkownik do aktualizacji nie został znaleziony",
        },
        conflict: {
          title: "Konflikt aktualizacji",
          description:
            "Dane użytkownika są w konflikcie z istniejącymi rekordami",
        },
        server: {
          title: "Błąd serwera",
          description:
            "Nie można zaktualizować użytkownika z powodu błędu serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description:
            "Wystąpił nieoczekiwany błąd podczas aktualizacji użytkownika",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany, które zostaną utracone",
        },
      },
      success: {
        title: "Użytkownik zaktualizowany pomyślnie",
        description:
          "Informacje o użytkowniku zostały pomyślnie zaktualizowane",
      },
    },
    delete: {
      title: "Usuń użytkownika",
      description: "Trwale usuń konto użytkownika",
      container: {
        title: "Usuń użytkownika",
        description: "Trwale usuń użytkownika z systemu",
      },
      id: {
        label: "ID użytkownika",
        description: "Unikalny identyfikator użytkownika do usunięcia",
        placeholder: "Wprowadź ID użytkownika...",
        helpText: "OSTRZEŻENIE: Ta akcja nie może być cofnięta",
      },
      response: {
        deletionResult: {
          title: "Wynik usunięcia",
          description: "Wynik operacji usunięcia",
          success: {
            content: "Sukces usunięcia",
          },
          message: {
            content: "Wiadomość o usunięciu",
          },
          deletedAt: {
            content: "Usunięto o",
          },
        },
        success: {
          content: "Sukces usunięcia",
        },
        message: {
          content: "Wiadomość o usunięciu",
        },
      },
      errors: {
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Musisz być zalogowany, aby usuwać użytkowników",
        },
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Podano nieprawidłowy ID użytkownika do usunięcia",
        },
        forbidden: {
          title: "Dostęp zabroniony",
          description: "Nie masz uprawnień do usuwania użytkowników",
        },
        notFound: {
          title: "Użytkownik nie znaleziony",
          description: "Użytkownik do usunięcia nie został znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można usunąć użytkownika z powodu błędu serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description:
            "Wystąpił nieoczekiwany błąd podczas usuwania użytkownika",
        },
        conflict: {
          title: "Błąd konfliktu",
          description:
            "Nie można usunąć użytkownika z powodu istniejących zależności",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z serwerem",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany, które zostaną utracone",
        },
      },
      success: {
        title: "Użytkownik usunięty pomyślnie",
        description: "Użytkownik został pomyślnie usunięty",
      },
    },
  },
};
