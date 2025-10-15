export const translations = {
  category: "Użytkownicy",
  tags: {
    create: "Utwórz",
    admin: "Administrator",
  },
  post: {
    title: "Utwórz użytkownika",
    description: "Utwórz nowe konto użytkownika",
    form: {
      title: "Formularz tworzenia użytkownika",
      description: "Wypełnij szczegóły, aby utworzyć nowego użytkownika",
    },
    email: {
      label: "Adres e-mail",
      description: "Adres e-mail użytkownika do logowania i komunikacji",
    },
    password: {
      label: "Hasło",
      description: "Bezpieczne hasło dla konta użytkownika",
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
    },
    lastName: {
      label: "Nazwisko",
      description: "Nazwisko użytkownika",
    },
    company: {
      label: "Firma",
      description: "Firma lub organizacja użytkownika",
    },
    phone: {
      label: "Numer telefonu",
      description: "Numer telefonu kontaktowego użytkownika",
    },
    preferredContactMethod: {
      label: "Preferowana metoda kontaktu",
      description: "Jak użytkownik woli być kontaktowany",
    },
    roles: {
      label: "Role użytkownika",
      description: "Przypisz role użytkownikowi",
    },
    imageUrl: {
      label: "URL zdjęcia profilowego",
      description: "URL do zdjęcia profilowego użytkownika",
    },
    bio: {
      label: "Biografia",
      description: "Krótki opis użytkownika",
    },
    website: {
      label: "Strona internetowa",
      description: "Osobista lub firmowa strona internetowa użytkownika",
    },
    jobTitle: {
      label: "Stanowisko",
      description: "Stanowisko lub pozycja użytkownika",
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
      description: "Powiązany identyfikator leada",
    },
    response: {
      title: "Użytkownik utworzony",
      description: "Szczegóły nowo utworzonego użytkownika",
      id: {
        content: "ID użytkownika",
      },
      leadId: {
        content: "Powiązane ID leada",
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
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby tworzyć użytkowników",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Sprawdź dane formularza i spróbuj ponownie",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie można utworzyć użytkownika z powodu błędu serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieoczekiwany błąd podczas tworzenia użytkownika",
      },
      network: {
        title: "Błąd sieci",
        description:
          "Połączenie sieciowe nie powiodło się podczas tworzenia użytkownika",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do tworzenia użytkowników",
      },
      notFound: {
        title: "Zasób nie znaleziony",
        description:
          "Wymagany zasób do tworzenia użytkownika nie został znaleziony",
      },
      conflict: {
        title: "Użytkownik już istnieje",
        description: "Użytkownik z tym adresem e-mail już istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd wewnętrzny podczas tworzenia użytkownika",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "SMS powitalny nie powiódł się",
          description: "Nie udało się wysłać SMS-a powitalnego do użytkownika",
        },
        verification_failed: {
          title: "SMS weryfikacyjny nie powiódł się",
          description:
            "Nie udało się wysłać SMS-a weryfikacyjnego do użytkownika",
        },
      },
    },
    success: {
      title: "Użytkownik utworzony pomyślnie",
      description: "Nowe konto użytkownika zostało utworzone",
      message: {
        content: "Użytkownik utworzony pomyślnie",
      },
      created: {
        content: "Utworzony",
      },
    },
  },
  email: {
    users: {
      welcome: {
        greeting: "Witamy na naszej platformie, {{firstName}}!",
        preview: "Twoje konto zostało pomyślnie utworzone",
        subject: "Witamy w {{companyName}} - Twoje konto jest gotowe!",
        introduction:
          "Cześć {{firstName}}, cieszymy się, że jesteś z nami! Twoje konto zostało pomyślnie utworzone i możesz teraz korzystać ze wszystkich naszych funkcji.",
        accountDetails: "Szczegóły konta",
        email: "E-mail",
        name: "Nazwa",
        publicName: "Nazwa wyświetlana",
        company: "Firma",
        phone: "Telefon",
        nextSteps: "Następne kroki",
        loginButton: "Zaloguj się do swojego konta",
        support:
          "Jeśli masz jakieś pytania, nasz zespół wsparcia jest tutaj, aby pomóc. Skontaktuj się z nami w każdej chwili!",
      },
      admin: {
        newUser: "Nowy użytkownik utworzony",
        preview: "Nowy użytkownik {{firstName}} {{lastName}} został utworzony",
        subject:
          "Nowe konto użytkownika utworzone - {{firstName}} {{lastName}}",
        notification:
          "Nowe konto użytkownika zostało utworzone w systemie. Oto szczegóły:",
        userDetails: "Szczegóły użytkownika",
        viewUser: "Zobacz profil użytkownika",
      },
      errors: {
        missing_data:
          "Brakuje wymaganych danych użytkownika dla szablonu e-mail",
      },
      labels: {
        id: "ID:",
        email: "E-mail:",
        name: "Nazwa:",
        privateName: "Pełna nazwa:",
        publicName: "Nazwa wyświetlana:",
        company: "Firma:",
        created: "Utworzono:",
        leadId: "ID leada:",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "Witamy {{firstName}}! Twoje konto zostało pomyślnie utworzone. Odwiedź nas pod adresem {{appUrl}}",
    },
    verification: {
      message:
        "{{firstName}}, Twój kod weryfikacyjny to: {{code}}. Wprowadź kod w ciągu 10 minut.",
    },
    errors: {
      welcome_failed: {
        title: "Nieudane SMS powitalne",
        description: "Nie udało się wysłać SMS powitalnego do użytkownika",
      },
      verification_failed: {
        title: "Nieudane SMS weryfikacyjne",
        description: "Nie udało się wysłać SMS weryfikacyjnego do użytkownika",
      },
    },
  },
};
