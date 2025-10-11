import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie konsultacjami",
  tag: "konsultacja",

  // Form enum translations for the enum.ts file
  form: {
    selectionType: {
      new: "Utwórz nowego leada",
      user: "Istniejący użytkownik",
      lead: "Istniejący lead",
    },
    priority: {
      options: {
        low: "Niski",
        normal: "Normalny",
        high: "Wysoki",
      },
    },
  },

  post: {
    title: "Utwórz nową konsultację",
    description: "Utwórz nową konsultację z panelu administracyjnego",
    category: "Zarządzanie konsultacjami",
    tag: "konsultacja",

    container: {
      title: "Utwórz nową konsultację",
      description:
        "Utwórz nową rezerwację konsultacji ze wszystkimi wymaganymi szczegółami",
    },

    selectionType: {
      label: "Typ wyboru",
      description: "Wybierz sposób wyboru uczestnika konsultacji",
      placeholder: "Wybierz typ wyboru",
    },

    userId: {
      label: "ID użytkownika",
      description: "ID istniejącego użytkownika do powiązania z konsultacją",
      placeholder: "Wprowadź ID użytkownika",
    },

    leadId: {
      label: "ID leada",
      description: "ID istniejącego leada do powiązania z konsultacją",
      placeholder: "Wprowadź ID leada",
    },

    name: {
      label: "Pełna nazwa",
      description: "Pełne imię i nazwisko uczestnika konsultacji",
      placeholder: "Wprowadź pełne imię i nazwisko",
    },

    email: {
      label: "Adres e-mail",
      description: "Adres e-mail uczestnika konsultacji",
      placeholder: "Wprowadź adres e-mail",
    },

    phone: {
      label: "Numer telefonu",
      description: "Numer telefonu do kontaktu w sprawie konsultacji",
      placeholder: "Wprowadź numer telefonu",
    },

    businessType: {
      label: "Rodzaj działalności",
      description: "Rodzaj działalności prowadzonej przez uczestnika",
      placeholder: "Wprowadź rodzaj działalności",
    },

    businessName: {
      label: "Nazwa firmy",
      description: "Nazwa firmy uczestnika",
      placeholder: "Wprowadź nazwę firmy",
    },

    website: {
      label: "URL strony internetowej",
      description: "URL strony internetowej firmy",
      placeholder: "https://example.com",
    },

    country: {
      label: "Kraj",
      description: "Kraj, w którym znajduje się firma",
      placeholder: "Wybierz kraj",
      options: {
        global: "Globalny",
        de: "Niemcy",
        pl: "Polska",
      },
    },

    language: {
      label: "Język",
      description: "Preferowany język konsultacji",
      placeholder: "Wybierz język",
      options: {
        en: "Angielski",
        de: "Niemiecki",
        pl: "Polski",
      },
    },

    city: {
      label: "Miasto",
      description: "Miasto, w którym znajduje się firma",
      placeholder: "Wprowadź miasto",
    },

    currentChallenges: {
      label: "Aktualne wyzwania",
      description: "Aktualne wyzwania biznesowe do rozwiązania",
      placeholder: "Opisz aktualne wyzwania biznesowe",
    },

    goals: {
      label: "Cele",
      description: "Cele i zadania biznesowe",
      placeholder: "Opisz cele biznesowe",
    },

    targetAudience: {
      label: "Grupa docelowa",
      description: "Opis grupy docelowej",
      placeholder: "Opisz grupę docelową",
    },

    existingAccounts: {
      label: "Istniejące konta w mediach społecznościowych",
      description: "Lista istniejących kont w mediach społecznościowych",
      placeholder: "Wymień istniejące konta w mediach społecznościowych",
    },

    competitors: {
      label: "Konkurenci",
      description: "Główni konkurenci biznesowi",
      placeholder: "Wymień głównych konkurentów",
    },

    preferredDate: {
      label: "Preferowana data",
      description: "Preferowana data konsultacji uczestnika",
      placeholder: "Wybierz preferowaną datę",
    },

    preferredTime: {
      label: "Preferowana godzina",
      description: "Preferowana godzina konsultacji uczestnika",
      placeholder: "Wybierz preferowaną godzinę",
    },

    message: {
      label: "Dodatkowa wiadomość",
      description: "Dodatkowe informacje lub specjalne żądania",
      placeholder: "Wprowadź dodatkowe informacje",
    },

    status: {
      label: "Status",
      description: "Aktualny status konsultacji",
      placeholder: "Wybierz status konsultacji",
    },

    priority: {
      label: "Priorytet",
      description: "Poziom priorytetu konsultacji",
      placeholder: "Wybierz poziom priorytetu",
    },

    internalNotes: {
      label: "Notatki wewnętrzne",
      description:
        "Wewnętrzne notatki administratora (niewidoczne dla klienta)",
      placeholder:
        "Wewnętrzne notatki administratora (niewidoczne dla klienta)",
    },

    // Response fields
    id: {
      label: "ID konsultacji",
      description: "Unikalny identyfikator utworzonej konsultacji",
    },

    createdAt: {
      label: "Utworzono",
      description: "Data i godzina utworzenia konsultacji",
    },

    updatedAt: {
      label: "Zaktualizowano",
      description: "Data i godzina ostatniej aktualizacji konsultacji",
    },

    userEmail: {
      label: "E-mail użytkownika",
      description: "Adres e-mail uczestnika konsultacji",
    },

    userName: {
      label: "Nazwa użytkownika",
      description: "Imię uczestnika konsultacji",
    },

    userBusinessType: {
      label: "Rodzaj działalności użytkownika",
      description: "Rodzaj działalności prowadzonej przez użytkownika",
    },

    userContactPhone: {
      label: "Telefon kontaktowy użytkownika",
      description: "Numer telefonu do kontaktu w sprawie konsultacji",
    },

    isNotified: {
      label: "Powiadomienie wysłane",
      description: "Czy powiadomienie zostało wysłane do uczestnika",
    },

    scheduledDate: {
      label: "Zaplanowana data",
      description: "Rzeczywista zaplanowana data konsultacji",
    },

    scheduledTime: {
      label: "Zaplanowana godzina",
      description: "Rzeczywista zaplanowana godzina konsultacji",
    },

    calendarEventId: {
      label: "ID wydarzenia kalendarza",
      description: "Identyfikator wydarzenia w systemie kalendarza",
    },

    meetingLink: {
      label: "Link do spotkania",
      description: "URL spotkania online dla konsultacji",
    },

    icsAttachment: {
      label: "Załącznik ICS",
      description: "Dane załącznika pliku kalendarza",
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
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      email_send_failed: {
        title: "Wysyłanie e-maila nie powiodło się",
        description: "Nie udało się wysłać e-maila konsultacyjnego",
      },
      missing_contact_info: {
        title: "Brakujące informacje kontaktowe",
        description: "Brakuje wymaganych informacji kontaktowych",
      },
      partner_notification_failed: {
        title: "Powiadomienie partnera nie powiodło się",
        description: "Nie udało się wysłać powiadomienia do partnera",
      },
      internal_notification_failed: {
        title: "Powiadomienie wewnętrzne nie powiodło się",
        description: "Nie udało się wysłać powiadomienia wewnętrznego",
      },
      invalid_phone: {
        title: "Nieprawidłowy numer telefonu",
        description: "Podany numer telefonu jest nieprawidłowy",
      },
      sms_send_failed: {
        title: "Wysyłanie SMS nie powiodło się",
        description: "Nie udało się wysłać SMS-a konsultacyjnego",
      },
      no_phone_number: {
        title: "Brak numeru telefonu",
        description: "Numer telefonu jest wymagany do powiadomień SMS",
      },
      partner_confirmation_failed: {
        title: "Potwierdzenie partnera nie powiodło się",
        description: "Nie udało się wysłać SMS-a potwierdzającego do partnera",
      },
      status_update_failed: {
        title: "Aktualizacja statusu nie powiodła się",
        description: "Nie udało się zaktualizować statusu konsultacji",
      },
    },
    success: {
      title: "Sukces",
      description: "Konsultacja została utworzona pomyślnie",
    },

    // Email templates
    emailTemplates: {
      partner: {
        subject: "Twoja prośba o konsultację - {{businessName}}",
        title: "Dziękujemy za prośbę o konsultację, {{name}}!",
        preview: "Otrzymaliśmy Twoją prośbę o konsultację dla {{businessName}}",
        greeting: "Cześć {{name}},",
        message:
          "Dziękujemy za prośbę o konsultację z naszym zespołem. Cieszymy się, że możemy pomóc w rozwoju Twojego biznesu!",
        details: "Szczegóły konsultacji:",
        preferredDate: "Preferowana data",
        additionalMessage: "Twoja wiadomość",
        nextSteps:
          "Wkrótce się z Tobą skontaktujemy, aby potwierdzić czas konsultacji i przedstawić kolejne kroki.",
      },
      internal: {
        subject: "Nowa prośba o konsultację - {{businessName}}",
        title: "Otrzymano nową prośbę o konsultację",
        preview: "Nowa prośba o konsultację od {{businessName}}",
        greeting: "Cześć zespół,",
        message:
          "Została złożona nowa prośba o konsultację, która wymaga uwagi.",
        details: "Dane kontaktowe:",
        contactName: "Imię i nazwisko",
        contactEmail: "Adres e-mail",
        contactPhone: "Numer telefonu",
        businessName: "Nazwa firmy",
        businessType: "Typ biznesu",
        preferredDate: "Preferowana data",
        priority: "Poziom priorytetu",
        messageContent: "Wiadomość klienta",
        internalNotes: "Notatki wewnętrzne",
        closing: "Proszę przejrzeć i zaplanować konsultację odpowiednio.",
        viewConsultation: "Zobacz pełne szczegóły konsultacji",
      },
    },
  },
};
