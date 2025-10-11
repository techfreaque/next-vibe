import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Dane Biznesowe",
  tags: {
    profile: "Profil",
    personal: "Osobiste",
    update: "Aktualizuj",
  },

  // Completion status field translations
  isComplete: "Profil kompletny",
  completedFields: "Wypełnione pola",
  totalFields: "Wszystkie pola",
  completionPercentage: "Procent ukończenia",
  missingRequiredFields: "Brakujące pola wymagane",

  // Enum translations
  enums: {
    jobTitleCategory: {
      executive: "Dyrektor",
      management: "Zarządzanie",
      marketing: "Marketing",
      sales: "Sprzedaż",
      operations: "Operacje",
      technology: "Technologia",
      finance: "Finanse",
      humanResources: "Zasoby Ludzkie",
      customerService: "Obsługa Klienta",
      product: "Produkt",
      design: "Design",
      consulting: "Doradztwo",
      freelancer: "Freelancer",
      entrepreneur: "Przedsiębiorca",
      other: "Inne",
    },
    companySize: {
      solo: "Solo (1 osoba)",
      small: "Mała (2-10 pracowników)",
      medium: "Średnia (11-50 pracowników)",
      large: "Duża (51-200 pracowników)",
      enterprise: "Przedsiębiorstwo (200+ pracowników)",
    },
    experienceLevel: {
      entry: "Początkujący (0-2 lata)",
      junior: "Junior (2-5 lat)",
      mid: "Średniozaawansowany (5-10 lat)",
      senior: "Senior (10-15 lat)",
      expert: "Ekspert (15+ lat)",
    },
  },

  // GET endpoint translations
  get: {
    title: "Pobierz Profil",
    description: "Pobierz informacje o profilu użytkownika",
    form: {
      title: "Żądanie Profilu",
      description: "Żądanie pobrania informacji o profilu",
    },
    response: {
      title: "Profil Użytkownika",
      description: "Twoje osobiste informacje profilowe",
      firstName: {
        title: "Imię",
      },
      lastName: {
        title: "Nazwisko",
      },
      bio: {
        title: "Biografia",
      },
      phone: {
        title: "Numer telefonu",
      },
      jobTitle: {
        title: "Stanowisko",
      },
      completionStatus: {
        title: "Status ukończenia profilu",
        description: "Informacje o statusie ukończenia profilu",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany Dostęp",
        description: "Nie masz uprawnień do dostępu do tego profilu",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania dla profilu",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas pobierania profilu",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się w celu pobrania profilu",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description: "Nie masz uprawnień do wyświetlenia tego profilu",
      },
      notFound: {
        title: "Profil Nie Znaleziony",
        description: "Nie znaleziono profilu dla tego użytkownika",
      },
      conflict: {
        title: "Konflikt Danych",
        description: "Dane profilu są w konflikcie z istniejącymi informacjami",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w swoim profilu",
      },
    },
    success: {
      title: "Profil Pobrany",
      description: "Pomyślnie pobrano informacje o profilu",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj Profil",
    description: "Aktualizuj informacje o profilu użytkownika",
    form: {
      title: "Aktualizuj Profil",
      description: "Zaktualizuj swoje osobiste informacje profilowe",
    },
    response: {
      title: "Zaktualizowany Profil",
      description: "Twój profil został pomyślnie zaktualizowany",
      message: "Wiadomość aktualizacji profilu",
      firstName: "Imię zaktualizowane",
      lastName: "Nazwisko zaktualizowane",
      bio: "Biografia zaktualizowana",
      phone: "Numer telefonu zaktualizowany",
      jobTitle: "Stanowisko zaktualizowane",
      completionStatus: {
        title: "Status ukończenia zaktualizowany",
        description: "Status ukończenia profilu został zaktualizowany",
      },
    },
    fullName: {
      label: "Pełne Imię i Nazwisko",
      description: "Twoje pełne imię i nazwisko",
      placeholder: "Wprowadź swoje pełne imię i nazwisko",
    },
    firstName: {
      label: "Imię",
      description: "Twoje imię",
      placeholder: "Wprowadź swoje imię",
    },
    lastName: {
      label: "Nazwisko",
      description: "Twoje nazwisko",
      placeholder: "Wprowadź swoje nazwisko",
    },
    bio: {
      label: "Biografia",
      description: "Krótki opis o tobie",
      placeholder: "Opowiedz nam o sobie...",
    },
    phone: {
      label: "Numer Telefonu",
      description: "Twój numer kontaktowy",
      placeholder: "+48-555-0123",
    },
    jobTitle: {
      label: "Stanowisko",
      description: "Twoje obecne stanowisko lub pozycja",
      placeholder: "np. Menedżer Marketingu",
    },
    expertise: {
      label: "Ekspertyza",
      description: "Twoje umiejętności zawodowe i obszary specjalizacji",
      placeholder: "Opisz swoje kluczowe umiejętności i specjalizację...",
    },
    professionalBackground: {
      label: "Doświadczenie Zawodowe",
      description: "Twoje doświadczenie zawodowe i ścieżka kariery",
      placeholder: "Opisz swoje doświadczenie zawodowe...",
    },
    additionalNotes: {
      label: "Dodatkowe Uwagi",
      description: "Wszelkie dodatkowe informacje o Tobie",
      placeholder: "Dodaj inne istotne informacje...",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do aktualizacji tego profilu",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Sprawdź swoje dane i spróbuj ponownie",
      },
      server: {
        title: "Błąd Serwera",
        description: "Nie udało się zaktualizować profilu",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się w celu aktualizacji profilu",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description: "Nie masz uprawnień do aktualizacji tego profilu",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Rekord profilu nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Aktualizacja profilu jest w konflikcie z istniejącymi danymi",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w swoim profilu",
      },
    },
    success: {
      title: "Profil Zaktualizowany",
      description: "Twój profil został pomyślnie zaktualizowany",
      message: "Profil zapisany",
    },
  },
};
