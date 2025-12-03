import type { translations as enTranslations } from "../en";
import { translations as componentsTranslations } from "../../_components/i18n/pl";

/**
*

* Contact API translations (Polish)
*/

export const translations: typeof enTranslations = {
  _components: componentsTranslations,
  title: "Przesłanie formularza kontaktowego",
  description: "Prześlij formularz kontaktowy i obsługuj powiadomienia e-mail",
  category: "Podstawowe API",
  summary: "Przetwarzaj przesłania formularzy kontaktowych z śledzeniem leadów",
  tags: {
    contactForm: "Formularz kontaktowy",
    contactUs: "Skontaktuj się z nami",
    contactSubmission: "Przesłanie kontaktu",
    helpSupport: "Pomoc i wsparcie",
  },

  form: {
    label: "Formularz kontaktowy",
    description: "Wypełnij formularz, aby skontaktować się z naszym zespołem",
    fields: {
      name: {
        label: "Pełne imię i nazwisko",
        description: "Wprowadź swoje pełne imię i nazwisko",
        placeholder: "Jan Kowalski",
      },
      email: {
        label: "Adres e-mail",
        description: "Wprowadź swój adres e-mail",
        placeholder: "jan.kowalski@przyklad.pl",
      },
      company: {
        label: "Firma",
        description: "Wprowadź nazwę swojej firmy (opcjonalne)",
        placeholder: "Przykładowa Sp. z o.o.",
      },
      subject: {
        label: "Temat",
        description: "Krótki opis Twojego zapytania",
        placeholder: "Ogólne zapytanie o usługi",
      },
      message: {
        label: "Wiadomość",
        description: "Szczegółowy opis Twojego zapytania",
        placeholder:
          "Proszę podać więcej szczegółów dotyczących Twoich potrzeb...",
      },
      priority: {
        label: "Priorytet",
        description: "Wybierz poziom pilności Twojego zapytania",
        placeholder: "Wybierz poziom priorytetu",
      },
      leadId: {
        label: "ID leada",
        description: "Wewnętrzne ID śledzenia leada (wypełniane automatycznie)",
        placeholder: "lead_123",
      },
    },
  },

  subject: {
    helpSupport: "Pomoc i wsparcie",
    generalInquiry: "Ogólne zapytanie",
    technicalSupport: "Wsparcie techniczne",
    accountQuestion: "Pytanie o konto",
    billingQuestion: "Pytanie o rozliczenia",
    salesInquiry: "Zapytanie sprzedażowe",
    featureRequest: "Prośba o funkcję",
    bugReport: "Zgłoszenie błędu",
    feedback: "Opinia",
    complaint: "Skarga",
    partnership: "Partnerstwo",
    other: "Inne",
  },

  priority: {
    low: "Niski",
    medium: "Średni",
    high: "Wysoki",
    urgent: "Pilne",
  },

  status: {
    new: "Nowy",
    inProgress: "W trakcie",
    resolved: "Rozwiązany",
    closed: "Zamknięty",
  },

  response: {
    label: "Odpowiedź na przesłanie kontaktu",
    description: "Wynik przesłania formularza kontaktowego",
    success: "Formularz kontaktowy przesłany pomyślnie",
    messageId: "ID wiadomości do śledzenia",
    status: "Aktualny status kontaktu",
  },

  examples: {
    requests: {
      general: {
        title: "Ogólne zapytanie kontaktowe",
        description: "Przykład ogólnego przesłania formularza kontaktowego",
      },
    },
    responses: {
      success: {
        title: "Pomyślne przesłanie",
        description: "Przykład pomyślnej odpowiedzi formularza kontaktowego",
      },
    },
  },

  errors: {
    createFailed: {
      title: "Przesłanie kontaktu nie powiodło się",
      description:
        "Nie można obecnie przetworzyć Twojego formularza kontaktowego. Spróbuj ponownie później.",
    },
    repositoryCreateFailed: "Nie udało się utworzyć żądania kontaktu",
    repositoryCreateDetails:
      "Nie można obecnie przetworzyć Twojego formularza kontaktowego. Spróbuj ponownie później.",
    noContactReturned: "Po utworzeniu nie zwrócono rekordu kontaktu",
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane i spróbuj ponownie",
      nameMinLength: "Imię i nazwisko musi mieć co najmniej 2 znaki",
      emailInvalid: "Wprowadź prawidłowy adres e-mail",
      subjectRequired: "Temat jest wymagany",
      messageMinLength: "Wiadomość musi mieć co najmniej 10 znaków",
      priorityInvalid: "Wybierz prawidłowy poziom priorytetu",
      statusInvalid: "Nieprawidłowa wartość statusu",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas przetwarzania Twojego żądania",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie jesteś uprawniony do wykonania tej akcji",
    },
    forbidden: {
      title: "Zabronione",
      description: "Ta akcja jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas przetwarzania Twojego żądania",
    },
  },

  sms: {
    admin: {
      notification: "Nowe zapytanie kontaktowe: {name} ({email}) - {subject}",
      phone: {
        missing:
          "Brak skonfigurowanego numeru telefonu administratora dla powiadomień kontaktowych",
      },
      send: {
        start:
          "Wysyłanie SMS z powiadomieniem administratora o przesłaniu kontaktu",
        error:
          "Błąd wysyłania SMS z powiadomieniem administratora dla kontaktu",
      },
    },
    confirmation: {
      message: "{name}, dziękujemy za wiadomość! Skontaktujemy się wkrótce.",
      phone: {
        missing:
          "Brak numeru telefonu użytkownika dla SMS z potwierdzeniem kontaktu",
      },
      send: {
        start:
          "Wysyłanie SMS z potwierdzeniem do osoby przesyłającej formularz",
        error: "Błąd wysyłania SMS z potwierdzeniem dla kontaktu",
      },
    },
  },

  repository: {
    create: {
      start: "Rozpoczynanie przesyłania formularza kontaktowego",
      success: "Formularz kontaktowy przesłany pomyślnie",
      error: "Błąd tworzenia przesłania formularza kontaktowego",
    },
    lead: {
      conversion: {
        start: "Rozpoczynanie konwersji leada dla kontaktu",
        error: "Błąd podczas konwersji leada dla kontaktu",
      },
      provided: "ID leada dostarczone dla przesłania kontaktu",
    },
    seed: {
      create: {
        start: "Rozpoczynanie tworzenia seed-a kontaktu",
        error: "Błąd tworzenia seed-a kontaktu",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed:
          "SMS z powiadomieniem administratora nie powiódł się dla przesłania kontaktu",
      },
      confirmation: {
        failed: "SMS z potwierdzeniem nie powiódł się dla przesłania kontaktu",
      },
    },
  },

  seeds: {
    dev: {
      start: "Rozpoczynanie seed-ów kontaktu dla środowiska deweloperskiego",
      submission: {
        created: "Przesłanie kontaktu utworzone w seed-ach deweloperskich",
        failed:
          "Nie udało się utworzyć przesłania kontaktu w seed-ach deweloperskich",
        error: "Błąd tworzenia przesłania kontaktu w seed-ach deweloperskich",
      },
      complete: "Seed-y deweloperskie kontaktu zakończone",
      error: "Błąd seed-owania danych deweloperskich kontaktu",
    },
    test: {
      start: "Rozpoczynanie seed-ów kontaktu dla środowiska testowego",
      submission: {
        created: "Przesłanie kontaktu utworzone w seed-ach testowych",
        failed:
          "Nie udało się utworzyć przesłania kontaktu w seed-ach testowych",
      },
      error: "Błąd seed-owania danych testowych kontaktu",
    },
    prod: {
      start: "Rozpoczynanie seed-ów kontaktu dla środowiska produkcyjnego",
      ready: "Środowisko produkcyjne kontaktu gotowe",
      error: "Błąd seed-owania danych produkcyjnych kontaktu",
    },
  },

  success: {
    title: "Sukces",
    description: "Twój formularz kontaktowy został pomyślnie przesłany",
  },

  email: {
    partner: {
      greeting: "Witaj",
      thankYou: "Dziękujemy za kontakt!",
      message: "Wiadomość",
      additionalInfo: "Dodatkowe informacje",
      subject: "Nowe zgłoszenie formularza kontaktowego",
    },
    company: {
      contactDetails: "Dane kontaktowe",
      name: "Imię i nazwisko",
      email: "E-mail",
      company: "Firma",
      contactSubject: "Temat",
      viewDetails: "Zobacz szczegóły",
    },
  },

  error: {
    general: {
      internal_server_error: "Wystąpił wewnętrzny błąd serwera",
    },
  },
};
