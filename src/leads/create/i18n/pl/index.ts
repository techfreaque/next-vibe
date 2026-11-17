import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leady",
    create: "Utwórz",
  },

  enums: {
    leadSource: {
      website: "Strona WWW",
      socialMedia: "Media społecznościowe",
      emailCampaign: "Kampania e-mail",
      referral: "Polecenie",
      csvImport: "Import CSV",
    },
  },
  widget: {
    headerLeadCreated: "Lead stworzony",
    headerCreateLead: "Stwórz lead",
    subheaderFillDetails: "Wypełnij poniższe szczegóły",
    fallbackLeadName: "Lead",
    buttonCopyId: "Kopiuj ID",
    buttonViewLead: "Zobacz lead",
    buttonEditLead: "Edytuj lead",
    buttonBackToList: "Powrót do listy",
  },
  post: {
    title: "Stwórz lead",
    titleShort: "Nowy lead",
    description: "Stwórz nowy lead w systemie",
    backButton: {
      label: "Powrót do leadów",
    },
    submitButton: {
      label: "Stwórz leada",
      loadingText: "Tworzenie leada...",
    },
    form: {
      title: "Formularz nowego leada",
      description: "Wprowadź informacje o leadzie aby stworzyć nowy lead",
    },
    contactInfo: {
      title: "Informacje kontaktowe",
      description: "Główne dane kontaktowe dla leada",
    },
    email: {
      label: "Adres e-mail",
      description: "Główny adres e-mail do komunikacji",
      placeholder: "jan@przyklad.pl",
    },
    businessName: {
      label: "Nazwa firmy",
      description: "Nazwa firmy lub przedsiębiorstwa",
      placeholder: "Przykład Sp. z o.o.",
    },
    phone: {
      label: "Numer telefonu",
      description: "Numer telefonu kontaktowego z kodem kraju",
      placeholder: "+48123456789",
    },
    website: {
      label: "Strona internetowa",
      description: "Adres URL strony internetowej firmy",
      placeholder: "https://przyklad.pl",
    },
    locationPreferences: {
      title: "Lokalizacja i preferencje",
      description: "Preferencje geograficzne i językowe",
    },
    country: {
      label: "Kraj",
      description: "Lokalizacja firmy lub rynek docelowy",
      placeholder: "Wybierz kraj",
    },
    language: {
      label: "Język",
      description: "Preferowany język komunikacji",
      placeholder: "Wybierz język",
    },
    leadDetails: {
      title: "Szczegóły leada",
      description: "Dodatkowe informacje o leadzie",
    },
    source: {
      label: "Źródło leada",
      description: "Jak lead został pozyskany",
      placeholder: "Wybierz źródło",
    },
    notes: {
      label: "Notatki",
      description: "Dodatkowe notatki lub komentarze",
      placeholder: "Wprowadź dodatkowe informacje...",
    },
    response: {
      title: "Stworzony lead",
      description: "Szczegóły nowo stworzonego leada",
      summary: {
        title: "Podsumowanie leada",
        id: "ID leada",
        businessName: "Nazwa firmy",
        email: "Adres e-mail",
        status: "Status leada",
      },
      contactDetails: {
        title: "Szczegóły kontaktowe",
        phone: "Numer telefonu",
        website: "URL strony",
        country: "Kraj",
        language: "Język",
      },
      trackingInfo: {
        title: "Informacje śledzenia",
        source: "Źródło leada",
        emailsSent: "Liczba e-maili",
        currentCampaignStage: "Etap kampanii",
      },
      metadata: {
        title: "Metadane",
        notes: "Notatki",
        createdAt: "Data utworzenia",
        updatedAt: "Ostatnia aktualizacja",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Autoryzacja wymagana do tworzenia leadów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe informacje o leadzie",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas tworzenia leada",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas tworzenia leada",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas tworzenia leada",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla tworzenia leadów",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wymagany zasób nie został znaleziony do tworzenia leada",
      },
      conflict: {
        title: "Konflikt",
        description: "Lead już istnieje lub wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w formularzu leada",
      },
    },
    success: {
      title: "Lead stworzony",
      description: "Lead stworzony pomyślnie",
    },
  },
  email: {
    welcome: {
      subject: "Witamy w {{companyName}}",
      title: "Witamy w {{companyName}}, {{businessName}}!",
      preview: "Witamy. Tak zaczniesz.",
      greeting:
        "Witamy w {{companyName}}, {{businessName}}! Dobrze, że jesteś.",
      defaultName: "tam",
      introduction:
        "Dzięki za zainteresowanie. Twoje dane do nas dotarły i przeczyta je człowiek.",
      nextSteps: {
        title: "Co dalej?",
        step1Number: "1.",
        step1: "Zacznij czatować od razu. Bez konfiguracji, bez karty.",
        step2Number: "2.",
        step2: "Masz pytanie? Odpowiedz na ten e-mail. Czyta go człowiek.",
        step3Number: "3.",
        step3: "Odpowiemy najszybciej, jak się da.",
      },
      cta: {
        getStarted: "Zacznij czatować",
      },
      support:
        "Masz pytania? Odpowiedz na ten e-mail lub skontaktuj się z nami pod adresem {{supportEmail}}",
      error: {
        noEmail:
          "Nie można wysłać e-maila powitalnego - nie podano adresu e-mail",
      },
    },
    admin: {
      newLead: {
        subject: "Nowy lead: {{businessName}}",
        title: "Stworzono nowy lead",
        preview: "Nowy lead od {{businessName}} wymaga działania",
        message:
          "Nowy lead został stworzony w systemie od {{businessName}} i wymaga Twojej uwagi.",
        leadDetails: "Szczegóły leada",
        businessName: "Nazwa firmy",
        email: "E-mail",
        phone: "Telefon",
        website: "Strona internetowa",
        source: "Źródło",
        status: "Status",
        notes: "Notatki",
        notProvided: "Nie podano",
        viewLead: "Zobacz szczegóły leada",
        viewAllLeads: "Zobacz wszystkie leady",
        error: {
          noData:
            "Nie można wysłać powiadomienia administracyjnego - nie podano danych leada",
        },
        defaultName: "Nowy lead",
      },
    },
    error: {
      general: {
        internal_server_error: "Wystąpił wewnętrzny błąd serwera",
      },
    },
  },
  countries: {
    global: "Globalny",
    de: "Niemcy",
    pl: "Polska",
    fr: "Francja",
    us: "Stany Zjednoczone",
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
    fr: "Francuski",
  },
};
