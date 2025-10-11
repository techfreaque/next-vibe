import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Dane Biznesowe",

  // GET endpoint translations
  get: {
    title: "Pobierz Informacje o Firmie",
    description: "Pobierz informacje o firmie i szczegóły przedsiębiorstwa",

    form: {
      title: "Żądanie Informacji o Firmie",
      description: "Formularz żądania pobrania informacji o firmie",
    },

    response: {
      title: "Informacje o Firmie",
      description: "Szczegóły przedsiębiorstwa i informacje o firmie",
      businessType: {
        title: "Typ działalności",
      },
      businessName: {
        title: "Nazwa firmy",
      },
      industry: {
        title: "Branża",
      },
      businessSize: {
        title: "Rozmiar firmy",
      },
      businessEmail: {
        title: "E-mail firmowy",
      },
      businessPhone: {
        title: "Telefon firmowy",
      },
      website: {
        title: "Strona internetowa",
      },
      country: {
        title: "Kraj",
      },
      city: {
        title: "Miasto",
      },
      foundedYear: {
        title: "Rok założenia",
      },
      completionStatus: {
        title: "Status ukończenia",
        description: "Status ukończenia informacji o firmie",
      },
    },

    errors: {
      unauthorized: {
        title: "Brak Autoryzacji",
        description:
          "Nie masz uprawnień do dostępu do tych informacji o firmie",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania dla informacji o firmie",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas pobierania informacji o firmie",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description:
          "Nie można połączyć się w celu pobrania informacji o firmie",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description:
          "Nie masz uprawnień do wyświetlania tych informacji o firmie",
      },
      notFound: {
        title: "Informacje o Firmie Nie Znaleziono",
        description: "Nie znaleziono informacji o firmie dla tego użytkownika",
      },
    },

    success: {
      title: "Informacje o Firmie Pobrane",
      description: "Pomyślnie pobrano informacje o firmie",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj Informacje o Firmie",
    description: "Aktualizuj szczegóły przedsiębiorstwa i informacje o firmie",

    form: {
      title: "Aktualizuj Informacje o Firmie",
      description:
        "Zaktualizuj szczegóły swojego przedsiębiorstwa i informacje o firmie",
    },

    response: {
      title: "Zaktualizowane Informacje o Firmie",
      description: "Twoje informacje o firmie zostały pomyślnie zaktualizowane",
      message: {
        content: "Informacje o firmie zostały pomyślnie zaktualizowane",
      },
      businessType: "Typ działalności zaktualizowany",
      businessName: "Nazwa firmy zaktualizowana",
      industry: "Branża zaktualizowana",
      businessSize: "Rozmiar firmy zaktualizowany",
      businessEmail: "E-mail firmowy zaktualizowany",
      businessPhone: "Telefon firmowy zaktualizowany",
      website: "Strona internetowa zaktualizowana",
      country: "Kraj zaktualizowany",
      city: "Miasto zaktualizowane",
      foundedYear: "Rok założenia zaktualizowany",
      businessDescription: "Opis firmy zaktualizowany",
      completionStatus: {
        isComplete: "Sekcja ukończona",
        completedFields: "Wypełnione pola",
        totalFields: "Wszystkie pola",
        completionPercentage: "Procent ukończenia",
        missingRequiredFields: "Brakujące wymagane pola",
      },
    },

    // Field labels and descriptions
    businessType: {
      label: "Typ Działalności",
      description: "Wybierz typ struktury biznesowej",
      placeholder: "Wybierz typ swojej działalności",
    },

    businessName: {
      label: "Nazwa Firmy",
      description: "Wprowadź zarejestrowaną nazwę swojej firmy",
      placeholder: "np. Acme Corporation",
    },

    industry: {
      label: "Branża",
      description: "Wybierz swoją główną branżę lub sektor",
      placeholder: "Wybierz swoją branżę",
    },

    businessSize: {
      label: "Wielkość Firmy",
      description: "Wybierz wielkość swojej firmy",
      placeholder: "Wybierz wielkość firmy",
    },

    businessEmail: {
      label: "E-mail Firmowy",
      description: "Główny adres e-mail do komunikacji biznesowej",
      placeholder: "kontakt@twojafirma.pl",
    },

    businessPhone: {
      label: "Telefon Firmowy",
      description: "Główny numer telefonu firmowego",
      placeholder: "+48-555-0123",
    },

    website: {
      label: "Strona Internetowa",
      description: "URL strony internetowej Twojej firmy",
      placeholder: "https://www.twojafirma.pl",
    },

    country: {
      label: "Kraj",
      description: "Kraj, w którym zarejestrowana jest Twoja firma",
      placeholder: "Wybierz kraj",
    },

    city: {
      label: "Miasto",
      description: "Miasto, w którym znajduje się Twoja firma",
      placeholder: "np. Warszawa",
    },

    foundedYear: {
      label: "Rok Założenia",
      description: "Rok, w którym założono Twoją firmę",
      placeholder: "np. 2020",
    },

    employeeCount: {
      label: "Liczba Pracowników",
      description: "Liczba pracowników w Twojej firmie",
      placeholder: "np. 25",
    },

    businessDescription: {
      label: "Opis Firmy",
      description: "Krótki opis Twojej firmy i tego, co robisz",
      placeholder: "Opisz swoją firmę w kilku zdaniach...",
    },

    location: {
      label: "Lokalizacja",
      description: "Główna lokalizacja lub adres firmy",
      placeholder: "Wprowadź lokalizację swojej firmy",
    },

    productsServices: {
      label: "Produkty i Usługi",
      description: "Opisz swoje główne produkty i usługi",
      placeholder: "Opisz, co oferuje Twoja firma...",
    },

    additionalNotes: {
      label: "Dodatkowe Uwagi",
      description: "Wszelkie dodatkowe informacje o Twojej firmie",
      placeholder: "Dodaj inne istotne informacje...",
    },

    errors: {
      unauthorized: {
        title: "Brak Autoryzacji",
        description:
          "Nie masz uprawnień do aktualizacji tych informacji o firmie",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Sprawdź swoje dane wejściowe i spróbuj ponownie",
      },
      server: {
        title: "Błąd Serwera",
        description: "Nie udało się zaktualizować informacji o firmie",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji",
      },
      network: {
        title: "Błąd Sieci",
        description:
          "Nie można połączyć się w celu aktualizacji informacji o firmie",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description: "Nie masz uprawnień do aktualizacji tych informacji",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Nie znaleziono rekordu informacji o firmie",
      },
      conflict: {
        title: "Konflikt",
        description: "Informacje o firmie kolidują z istniejącymi danymi",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w informacjach o firmie",
      },
    },

    success: {
      title: "Informacje o Firmie Zaktualizowane",
      description: "Twoje informacje o firmie zostały pomyślnie zaktualizowane",
      message: "Informacje o firmie zapisane",
    },
  },

  // Enum translations
  enums: {
    businessType: {
      SaaS: "Oprogramowanie jako Usługa",
      E_COMMERCE: "E-Commerce",
      CONSULTING: "Konsulting",
      AGENCY: "Agencja",
      FREELANCER: "Freelancer",
      STARTUP: "Startup",
      SMALL_BUSINESS: "Mała Firma",
      CORPORATION: "Korporacja",
      NON_PROFIT: "Organizacja Non-Profit",
      SOLE_PROPRIETORSHIP: "Jednoosobowa Działalność",
      PARTNERSHIP: "Spółka Partnerska",
      LLC: "Spółka z o.o.",
      OTHER: "Inne",
    },

    industry: {
      TECHNOLOGY: "Technologia",
      HEALTHCARE: "Opieka Zdrowotna",
      FINANCE: "Finanse",
      EDUCATION: "Edukacja",
      RETAIL: "Handel Detaliczny",
      MANUFACTURING: "Produkcja",
      REAL_ESTATE: "Nieruchomości",
      HOSPITALITY: "Hotelarstwo",
      ENTERTAINMENT: "Rozrywka",
      AUTOMOTIVE: "Motoryzacja",
      CONSTRUCTION: "Budownictwo",
      CONSULTING: "Doradztwo",
      FOOD_BEVERAGE: "Żywność i Napoje",
      FITNESS_WELLNESS: "Fitness i Wellness",
      BEAUTY_FASHION: "Uroda i Moda",
      HOME_GARDEN: "Dom i Ogród",
      SPORTS_RECREATION: "Sport i Rekreacja",
      TRAVEL_HOSPITALITY: "Podróże i Hotelarstwo",
      MARKETING_ADVERTISING: "Marketing i Reklama",
      LEGAL: "Prawnicze",
      GOVERNMENT: "Rząd",
      NON_PROFIT: "Non-Profit",
      NON_PROFIT_CHARITY: "Non-Profit i Charytatywne",
      TELECOMMUNICATIONS: "Telekomunikacja",
      OTHER: "Inne",
    },

    businessSize: {
      STARTUP: "Startup (1-10 pracowników)",
      SMALL: "Mała (11-50 pracowników)",
      MEDIUM: "Średnia (51-250 pracowników)",
      LARGE: "Duża (251-1000 pracowników)",
      ENTERPRISE: "Przedsiębiorstwo (1000+ pracowników)",
    },
  },

  // Tags
  tags: {
    businessInfo: "Informacje o Firmie",
    company: "Firma",
    update: "Aktualizacja",
  },

  // Individual completion status field translations
  isComplete: "Informacje o firmie ukończone",
  completedFields: "Ukończone pola informacji o firmie",
  totalFields: "Całkowite pola informacji o firmie",
  completionPercentage: "Procent ukończenia informacji o firmie",
  missingRequiredFields: "Brakujące wymagane pola informacji o firmie",
};
