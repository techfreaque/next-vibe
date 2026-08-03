import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  tag: "Zarządzanie użytkownikami",

  id: {
    roles: {
      post: {
        title: "Dodaj rolę użytkownika",
        description: "Przyznaj rolę do określonego konta użytkownika",
        container: {
          title: "Dodaj rolę",
          description: "Wybierz rolę do przyznania temu użytkownikowi",
        },
        id: {
          label: "ID użytkownika",
          description:
            "Unikalny identyfikator użytkownika, któremu ma być przyznana rola",
          placeholder: "Wprowadź ID użytkownika...",
        },
        role: {
          label: "Rola",
          description: "Rola do przyznania użytkownikowi",
          placeholder: "Wybierz rolę...",
        },
        submit: {
          label: "Dodaj rolę",
        },
        response: {
          roleId: {
            content: "ID przypisania roli",
          },
          userId: {
            content: "ID użytkownika",
          },
          assignedRole: {
            content: "Przypisana rola",
          },
        },
        errors: {
          unauthorized: {
            title: "Brak autoryzacji",
            description:
              "Musisz być zalogowany, aby zarządzać rolami użytkowników",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Podaj prawidłowe ID użytkownika i rolę",
          },
          forbidden: {
            title: "Brak dostępu",
            description:
              "Tylko administratorzy mogą zarządzać rolami użytkowników",
          },
          notFound: {
            title: "Użytkownik nie znaleziony",
            description: "Nie można znaleźć podanego użytkownika",
          },
          conflict: {
            title: "Rola już przypisana",
            description: "Ten użytkownik ma już podaną rolę",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany, które zostaną utracone",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie można dodać roli z powodu błędu serwera",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd podczas dodawania roli",
          },
        },
        success: {
          title: "Rola dodana",
          description: "Rola została pomyślnie przyznana użytkownikowi",
        },
      },
      delete: {
        title: "Usuń rolę użytkownika",
        description: "Odwołaj rolę od określonego konta użytkownika",
        container: {
          title: "Usuń rolę",
          description: "Wybierz rolę do odwołania od tego użytkownika",
        },
        id: {
          label: "ID użytkownika",
          description:
            "Unikalny identyfikator użytkownika, któremu ma być odwołana rola",
          placeholder: "Wprowadź ID użytkownika...",
        },
        role: {
          label: "Rola",
          description: "Rola do odwołania od użytkownika",
          placeholder: "Wybierz rolę...",
        },
        submit: {
          label: "Usuń rolę",
        },
        response: {
          success: {
            content: "Rola usunięta",
          },
        },
        errors: {
          unauthorized: {
            title: "Brak autoryzacji",
            description:
              "Musisz być zalogowany, aby zarządzać rolami użytkowników",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Podaj prawidłowe ID użytkownika i rolę",
          },
          forbidden: {
            title: "Brak dostępu",
            description:
              "Tylko administratorzy mogą zarządzać rolami użytkowników",
          },
          notFound: {
            title: "Użytkownik nie znaleziony",
            description: "Nie można znaleźć podanego użytkownika",
          },
          conflict: {
            title: "Błąd konfliktu",
            description:
              "Nie można usunąć roli z powodu istniejących zależności",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z serwerem",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Masz niezapisane zmiany, które zostaną utracone",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie można usunąć roli z powodu błędu serwera",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd podczas usuwania roli",
          },
        },
        success: {
          title: "Rola usunięta",
          description: "Rola została pomyślnie odwołana od użytkownika",
        },
      },
    },
    get: {
      title: "Pobierz użytkownika",
      titleShort: "Szczegóły użytkownika",
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
        referralInfo: {
          title: "Info o poleceniach",
          description: "Łańcuch poleceń i zarobki",
          referredByUserId: {
            content: "Polecony przez (ID użytkownika)",
          },
          referredByCode: {
            content: "Użyty kod polecający",
          },
          totalReferrals: {
            content: "Poleceni użytkownicy",
          },
          totalEarnedCents: {
            content: "Łączne zarobki (centy)",
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
          detail: "Nie ma użytkownika o ID {{userId}}.",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można pobrać użytkownika z powodu błędu serwera",
          detail: "Nie udało się wczytać tego użytkownika: {{error}}",
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
      titleShort: "Zaktualizuj użytkownika",
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
      isBanned: {
        label: "Zablokowany",
        description: "Czy użytkownik jest zablokowany na platformie",
      },
      bannedReason: {
        label: "Powód blokady",
        description: "Powód zablokowania użytkownika",
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
          detail: "Nie ma użytkownika o ID {{userId}}.",
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
          detail: "Nie udało się zapisać zmian: {{error}}",
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
      titleShort: "Usuń użytkownika",
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
      submitButton: {
        label: "Usuń użytkownika",
        loadingText: "Usuwanie...",
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
          detail: "Nie ma użytkownika o ID {{userId}}.",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie można usunąć użytkownika z powodu błędu serwera",
          detail: "Nie udało się usunąć tego użytkownika: {{error}}",
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
    widget: {
      userProfile: "Profil użytkownika",
      active: "Aktywny",
      inactive: "Nieaktywny",
      leadId: "ID leada:",
      viewLead: "Zobacz leada",
      created: "Utworzono",
      lastUpdated: "Ostatnia aktualizacja",
      fullProfile: "Pełny profil",
      referrals: "Polecenia",
      subscription: "Subskrypcja",
      creditHistory: "Historia kredytów",
      deleteUser: "Usuń użytkownika",
      userDeletedSuccessfully: "Użytkownik usunięty pomyślnie",
      deletedAt: "Usunięto o",
      confirmDeletion: "Potwierdź usunięcie",
      confirmDeletionMessage:
        "Spowoduje to trwałe usunięcie użytkownika i wszystkich powiązanych danych. Tej akcji nie można cofnąć.",
      titleReferralCodes: "Kody polecenia i statystyki",
      titleSubscription: "Wyświetl subskrypcję",
      titleCopyUserId: "Kopiuj ID użytkownika",
    },
    getCrm: {
      get: {
        title: "Pobierz profil CRM użytkownika",
        titleShort: "Profil CRM",
        description: "Pobierz pola rozliczeniowe i liczbę notatek użytkownika",
        fields: {
          userId: {
            label: "ID użytkownika",
            description: "Użytkownik do pobrania",
            placeholder: "UUID użytkownika",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe ID użytkownika",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Musisz być zalogowany",
          },
          forbidden: {
            title: "Brak dostępu",
            description: "Nie masz dostępu do danych CRM tego użytkownika",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Użytkownik nie istnieje",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt",
          },
          network: {
            title: "Błąd sieci",
            description: "Żądanie sieciowe nie powiodło się",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
          internal: {
            title: "Błąd wewnętrzny",
            description: "Błąd serwera — spróbuj ponownie",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
        },
        success: {
          title: "Profil CRM załadowany",
          description: "Dane CRM użytkownika pobrane",
        },
        widget: {
          addNote: "Dodaj notatkę",
          viewNotes: "Zobacz notatki",
        },
        response: {
          id: "ID użytkownika",
          email: "E-mail",
          privateName: "Imię i nazwisko",
          companyBillingName: "Firma / nazwa rozliczeniowa",
          vatNumber: "Numer VAT",
          taxId: "NIP / REGON",
          phone: "Telefon",
          addressLine1: "Adres (wiersz 1)",
          addressLine2: "Adres (wiersz 2)",
          city: "Miasto",
          region: "Województwo / region",
          postalCode: "Kod pocztowy",
          billingCountry: "Kraj",
          defaultCurrency: "Domyślna waluta",
          paymentTermsDays: "Termin płatności (dni)",
          notesCount: "Łączna liczba notatek",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Utwórz notatkę użytkownika",
        titleShort: "Utwórz notatkę",
        description:
          "Dodaj notatkę CRM, log rozmowy, e-mail, spotkanie lub zadanie dla użytkownika",
        fields: {
          userId: {
            label: "Użytkownik",
            description: "Użytkownik, którego dotyczy ta notatka",
            placeholder: "Wybierz użytkownika",
          },
          type: {
            label: "Typ aktywności",
            description: "Rodzaj rejestrowanej interakcji",
            placeholder: "Wybierz typ",
          },
          content: {
            label: "Treść",
            description: "Szczegóły aktywności",
            placeholder: "Opisz co się stało...",
          },
          isPrivate: {
            label: "Prywatna",
            description: "Prywatne notatki widoczne są tylko dla Ciebie",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Sprawdź pola i spróbuj ponownie",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Musisz być zalogowany",
          },
          forbidden: {
            title: "Brak dostępu",
            description: "Nie masz dostępu do tego użytkownika",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Użytkownik nie istnieje",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt",
          },
          network: {
            title: "Błąd sieci",
            description: "Żądanie sieciowe nie powiodło się",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
          internal: {
            title: "Błąd wewnętrzny",
            description: "Błąd serwera — spróbuj ponownie",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
        },
        success: {
          title: "Notatka utworzona",
          description: "Notatka została zapisana",
        },
        widget: {
          created: "Notatka utworzona",
          noteId: "ID notatki",
          backToNotes: "Wróć do notatek",
        },
        response: {
          id: "ID notatki",
          userId: "ID użytkownika",
          authorUserId: "ID autora",
          type: "Typ",
          content: "Treść",
          isPrivate: "Prywatna",
          createdAt: "Utworzono",
          updatedAt: "Zaktualizowano",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "Lista notatek użytkownika",
        titleShort: "Notatki użytkownika",
        description:
          "Wyświetl notatki CRM dla użytkownika, z filtrowaniem po typie i widoczności",
        fields: {
          userId: {
            label: "ID użytkownika",
            description: "Czyje notatki wyświetlić",
            placeholder: "UUID użytkownika",
          },
          type: {
            label: "Typ",
            description: "Filtruj po typie aktywności",
            placeholder: "Wszystkie typy",
          },
          isPrivate: {
            label: "Tylko prywatne",
            description: "Pokaż tylko swoje prywatne notatki",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Sprawdź filtry i spróbuj ponownie",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Musisz być zalogowany",
          },
          forbidden: {
            title: "Brak dostępu",
            description: "Nie masz dostępu do tych notatek",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Użytkownik nie istnieje",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt",
          },
          network: {
            title: "Błąd sieci",
            description: "Żądanie sieciowe nie powiodło się",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
          internal: {
            title: "Błąd wewnętrzny",
            description: "Błąd serwera — spróbuj ponownie",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
        },
        success: {
          title: "Notatki załadowane",
          description: "Notatki pobrane pomyślnie",
        },
        widget: {
          addNote: "Dodaj notatkę",
          total: "Łącznie",
          empty: "Brak notatek",
          delete: "Usuń",
          private: "Prywatna",
          ago: "temu",
        },
        response: {
          notes: "Notatki",
          total: "Łącznie",
          note: {
            id: "ID notatki",
            userId: "ID użytkownika",
            authorUserId: "ID autora",
            type: "Typ",
            content: "Treść",
            isPrivate: "Prywatna",
            createdAt: "Utworzono",
            updatedAt: "Zaktualizowano",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Usuń notatkę użytkownika",
        titleShort: "Usuń notatkę",
        description:
          "Usuń notatkę CRM — tylko autor lub administrator może to zrobić",
        fields: {
          noteId: {
            label: "ID notatki",
            description: "Notatka do usunięcia",
            placeholder: "UUID notatki",
          },
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe ID notatki",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Musisz być zalogowany",
          },
          forbidden: {
            title: "Brak dostępu",
            description: "Tylko autor lub administrator może usunąć tę notatkę",
          },
          notFound: {
            title: "Nie znaleziono",
            description: "Notatka nie istnieje",
          },
          conflict: {
            title: "Konflikt",
            description: "Wystąpił konflikt",
          },
          network: {
            title: "Błąd sieci",
            description: "Żądanie sieciowe nie powiodło się",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Są niezapisane zmiany",
          },
          internal: {
            title: "Błąd wewnętrzny",
            description: "Błąd serwera — spróbuj ponownie",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
        },
        success: {
          title: "Notatka usunięta",
          description: "Notatka została trwale usunięta",
        },
        widget: {
          warning: "Ta notatka zostanie trwale usunięta.",
          deleted: "Notatka usunięta.",
          backToNotes: "Wróć do notatek",
        },
        response: {
          deleted: "Usunięta",
        },
      },
      tag: "CRM",
    },
  },
};
