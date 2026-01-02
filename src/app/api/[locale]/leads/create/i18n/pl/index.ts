import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Stwórz lead",
    description: "Stwórz nowy lead w systemie",
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
      preview: "Witamy w naszym serwisie - zaczynajmy",
      greeting:
        "Witamy w {{companyName}}, {{businessName}}! Cieszymy się, że możemy pomóc w rozwoju Twojej firmy.",
      defaultName: "tam",
      introduction:
        "Dziękujemy za zainteresowanie naszymi usługami. Otrzymaliśmy Twoje informacje i nasz zespół jest gotowy pomóc Ci osiągnąć cele biznesowe.",
      nextSteps: {
        title: "Co dalej?",
        step1Number: "1.",
        step1: "Nasz zespół przejrzy profil i cele Twojej firmy",
        step2Number: "2.",
        step2: "Otrzymasz spersonalizowaną propozycję konsultacji w ciągu 24 godzin",
        step3Number: "3.",
        step3: "Umówimy rozmowę, aby omówić Twoje konkretne potrzeby i cele",
      },
      cta: {
        getStarted: "Zaplanuj konsultację",
      },
      support:
        "Masz pytania? Odpowiedz na ten e-mail lub skontaktuj się z nami pod adresem {{supportEmail}}",
      error: {
        noEmail: "Nie można wysłać e-maila powitalnego - nie podano adresu e-mail",
      },
    },
    admin: {
      newLead: {
        subject: "Nowy lead: {{businessName}}",
        title: "Stworzono nowy lead",
        preview: "Nowy lead od {{businessName}} wymaga działania",
        message: "Nowy lead został stworzony w systemie od {{businessName}} i wymaga Twojej uwagi.",
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
          noData: "Nie można wysłać powiadomienia administracyjnego - nie podano danych leada",
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
};
