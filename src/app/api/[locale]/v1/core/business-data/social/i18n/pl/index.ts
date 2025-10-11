import type { translations as enTranslations } from "../en";

/**
*

* Business Data Social subdomain translations for Polish
*/

export const translations: typeof enTranslations = {
  category: "Dane Biznesowe",
  tags: {
    social: "Media Społecznościowe",
    platforms: "Platformy",
    update: "Aktualizuj",
  },

  // GET endpoint translations
  get: {
    title: "Pobierz Dane Mediów Społecznościowych",
    description:
      "Pobierz informacje o platformach mediów społecznościowych dla firmy",
    form: {
      title: "Żądanie Danych Mediów Społecznościowych",
      description: "Formularz żądania pobrania danych mediów społecznościowych",
    },
    response: {
      title: "Odpowiedź Mediów Społecznościowych",
      description:
        "Dane platform mediów społecznościowych ze statusem ukończenia",
      platforms: "Platformy mediów społecznościowych",
      contentStrategy: "Strategia treści",
      postingFrequency: "Częstotliwość publikowania",
      goals: "Cele mediów społecznościowych",
      completionStatus: {
        title: "Status ukończenia sekcji",
        description:
          "Informacje o statusie ukończenia mediów społecznościowych",
      },
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podano nieprawidłowe dane żądania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Wymagane uwierzytelnienie aby uzyskać dostęp do danych mediów społecznościowych",
      },
      server: {
        title: "Błąd Serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania danych mediów społecznościowych",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description:
          "Wystąpił błąd sieci podczas pobierania danych mediów społecznościowych",
      },
      forbidden: {
        title: "Zabroniony",
        description:
          "Dostęp do tych danych mediów społecznościowych jest zabroniony",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Nie znaleziono danych mediów społecznościowych",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description:
          "Istnieją niezapisane zmiany, które należy najpierw zapisać",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Wystąpił konflikt danych podczas pobierania danych mediów społecznościowych",
      },
    },
    success: {
      title: "Sukces",
      description: "Dane mediów społecznościowych pobrane pomyślnie",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Aktualizuj Dane Mediów Społecznościowych",
    description:
      "Aktualizuj informacje o platformach mediów społecznościowych dla firmy",
    form: {
      title: "Formularz Aktualizacji Mediów Społecznościowych",
      description:
        "Formularz aktualizacji danych platform mediów społecznościowych",
    },
    platforms: {
      label: "Platformy Mediów Społecznościowych",
      description:
        "Lista platform mediów społecznościowych z nazwami użytkowników i ustawieniami",
      placeholder: "Dodaj swoje platformy mediów społecznościowych",
    },
    contentStrategy: {
      label: "Strategia Treści",
      description:
        "Strategia i podejście do treści w mediach społecznościowych",
      placeholder: "Opisz swoją strategię treści...",
    },
    postingFrequency: {
      label: "Częstotliwość Publikowania",
      description:
        "Jak często treści są publikowane w mediach społecznościowych",
      placeholder: "np. Codziennie, 3 razy w tygodniu, itp.",
    },
    goals: {
      label: "Cele Mediów Społecznościowych",
      description: "Cele biznesowe dla obecności w mediach społecznościowych",
      placeholder: "Opisz swoje cele w mediach społecznościowych...",
    },
    response: {
      title: "Odpowiedź Aktualizacji",
      description: "Wynik aktualizacji danych mediów społecznościowych",
      message: "Komunikat statusu aktualizacji",
      platforms: "Platformy mediów społecznościowych zaktualizowane",
      contentStrategy: "Strategia treści zaktualizowana",
      postingFrequency: "Częstotliwość publikowania zaktualizowana",
      goals: "Cele mediów społecznościowych zaktualizowane",
      completionStatus: {
        title: "Status ukończenia zaktualizowany",
        description:
          "Status ukończenia mediów społecznościowych został zaktualizowany",
        isComplete: "Aktualizacja social kompletna",
        completedFields: "Aktualizacja social zakończone pola",
        totalFields: "Aktualizacja social całkowite pola",
        completionPercentage: "Aktualizacja social procent ukończenia",
        missingRequiredFields: "Aktualizacja social brakujące wymagane pola",
      },
    },
    additionalNotes: {
      label: "Dodatkowe Uwagi",
      description:
        "Wszelkie dodatkowe informacje o Twojej strategii mediów społecznościowych",
      placeholder: "Dodaj inne istotne informacje...",
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Podano nieprawidłowe dane mediów społecznościowych",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Wymagane uwierzytelnienie aby zaktualizować dane mediów społecznościowych",
      },
      server: {
        title: "Błąd Serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas aktualizacji danych mediów społecznościowych",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description:
          "Wystąpił błąd sieci podczas aktualizacji danych mediów społecznościowych",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie możesz aktualizować danych mediów społecznościowych",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Nie znaleziono danych mediów społecznościowych",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description:
          "Istnieją niezapisane zmiany, które należy najpierw zapisać",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Wystąpił konflikt danych podczas aktualizacji danych mediów społecznościowych",
      },
    },
    success: {
      title: "Sukces",
      description: "Dane mediów społecznościowych zaktualizowane pomyślnie",
      message: "Dane mediów społecznościowych zaktualizowane pomyślnie",
    },
  },

  // Individual completion status field translations
  isComplete: "Social kompletne",
  completedFields: "Social zakończone pola",
  totalFields: "Social całkowite pola",
  completionPercentage: "Social procent ukończenia",
  missingRequiredFields: "Social brakujące wymagane pola",

  // Enum translations
  enums: {
    socialPlatform: {
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
      youtube: "YouTube",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      discord: "Discord",
      reddit: "Reddit",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      other: "Inne",
    },
    platformPriority: {
      high: "Wysoki",
      medium: "Średni",
      low: "Niski",
    },
  },
};
