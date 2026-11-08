import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Skrzynka platformy",
  tag: "Skrzynka platformy",

  task: {
    description:
      "Przygotuj dzienny raport o stanie platformy i wyślij go ze skrzynki platformy",
  },

  send: {
    title: "Wyślij pocztę platformy",
    titleShort: "Wyślij maila",
    description:
      "Wyślij jednego maila transakcyjnego ze skrzynki platformy i zapisz go w folderze Wysłane",
    container: {
      title: "Wyślij pocztę platformy",
      description:
        "Jeden odbiorca, jedna wiadomość. Po dostarczeniu trafia do folderu Wysłane.",
    },
    fields: {
      to: {
        label: "Odbiorca",
        description: "Jeden adres e-mail",
        placeholder: "imie@przyklad.pl",
      },
      subject: {
        label: "Temat",
        description: "Temat wiadomości",
        placeholder: "O co chodzi?",
      },
      body: {
        label: "Wiadomość",
        description: "Treść tekstowa",
        placeholder: "Napisz wiadomość...",
      },
      html: {
        label: "Treść HTML",
        description: "Opcjonalna prosta wersja HTML",
        placeholder: "<p>Opcjonalny HTML</p>",
      },
    },
    response: {
      messageId: "ID wiadomości",
      from: "Od",
      to: "Do",
      storedInSent: "Zapisano w Wysłanych",
      sentFolder: "Folder Wysłane",
      sentLastHour: "Wysłano w ostatniej godzinie",
      rateLimitPerHour: "Limit godzinowy",
    },
    widget: {
      submit: "Wyślij maila",
      submitting: "Wysyłanie...",
      sent: "Mail wysłany",
      filed: "Zapisano w Wysłanych",
      notFiled: "Dostarczono, ale nie zapisano w Wysłanych",
      yes: "Tak",
      no: "Nie",
    },
    success: {
      title: "Mail wysłany",
      description: "Wiadomość trafiła do serwera pocztowego",
    },
  },

  inbox: {
    title: "Skrzynka odbiorcza platformy",
    titleShort: "Odbiorcza",
    description: "Pokaż najnowsze wiadomości INBOX ze skrzynki platformy",
    container: {
      title: "Skrzynka odbiorcza platformy",
      description:
        "Najnowsze na górze. Odczyt nie oznacza wiadomości jako przeczytanej.",
    },
    fields: {
      limit: {
        label: "Limit",
        description: "Ile wiadomości zwrócić (1-50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "Tylko nieprzeczytane",
        description: "Zwróć tylko nieprzeczytane wiadomości",
      },
    },
    response: {
      address: "Skrzynka",
      messages: {
        title: "Wiadomości",
        uid: "UID",
        from: "Od",
        subject: "Temat",
        date: "Data",
        snippet: "Podgląd",
        unread: "Nieprzeczytana",
      },
    },
    widget: {
      submit: "Odśwież skrzynkę",
      submitting: "Ładowanie...",
      empty: "Brak wiadomości",
      emptyDescription: "Nic nie pasuje do tych filtrów.",
      unread: "Nieprzeczytana",
      noSubject: "(bez tematu)",
      open: "Otwórz",
    },
    success: {
      title: "Skrzynka wczytana",
      description: "Pobrano wiadomości ze skrzynki platformy",
    },
  },

  message: {
    title: "Czytaj pocztę platformy",
    titleShort: "Czytaj maila",
    description: "Pobierz jedną wiadomość INBOX ze skrzynki platformy po UID",
    container: {
      title: "Czytaj pocztę platformy",
      description:
        "Pełna treść jednej wiadomości. Nie oznacza jej jako przeczytanej.",
    },
    fields: {
      uid: {
        label: "UID",
        description: "UID wiadomości z listy skrzynki",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "Od",
      to: "Do",
      subject: "Temat",
      date: "Data",
      messageId: "ID wiadomości",
      unread: "Nieprzeczytana",
      bodyText: "Treść",
    },
    widget: {
      submit: "Czytaj wiadomość",
      submitting: "Ładowanie...",
      unread: "Nieprzeczytana",
      noSubject: "(bez tematu)",
    },
    success: {
      title: "Wiadomość wczytana",
      description: "Pobrano wiadomość ze skrzynki platformy",
    },
  },

  report: {
    title: "Dzienny raport statusu",
    titleShort: "Dzienny raport",
    description:
      "Przygotuj raport platformy z ostatnich 24 godzin i wyślij go ze skrzynki platformy",
    container: {
      title: "Dzienny raport statusu",
      description:
        "Rejestracje, subskrypcje, zużycie kredytów, lejek, incydenty zadań i błędy. Czysty tekst.",
    },
    fields: {
      to: {
        label: "Odbiorca",
        description: "Zostaw puste, by użyć skonfigurowanego adresu raportów",
        placeholder: "imie@przyklad.pl",
      },
      dryRun: {
        label: "Tylko podgląd",
        description: "Przygotuj raport, ale go nie wysyłaj",
      },
    },
    response: {
      subject: "Temat",
      body: "Raport",
      recipient: "Odbiorca",
      sent: "Wysłano",
      sections: "Uwzględnione sekcje",
      skippedSections: "Pominięte sekcje",
    },
    widget: {
      submit: "Wyślij raport",
      submitting: "Przygotowywanie...",
      sent: "Raport wysłany",
      preview: "Podgląd",
    },
    success: {
      title: "Raport gotowy",
      description: "Dzienny raport statusu został przygotowany",
    },
  },

  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane uwierzytelnienie",
    },
    forbidden: {
      title: "Zabronione",
      description: "Ze skrzynki platformy mogą korzystać tylko admini",
    },
    server: {
      title: "Błąd serwera",
      description: "Żądanie do skrzynki platformy nie powiodło się",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry żądania",
    },
    notConfigured:
      "Skrzynka platformy nie jest skonfigurowana. Ustaw THEA_MAIL_ADDRESS, THEA_MAIL_HOST i THEA_MAIL_PASSWORD.",
    invalidRecipient: "Odbiorca musi być jednym poprawnym adresem e-mail",
    noRecipient: "Brak odbiorcy. Podaj go albo ustaw THEA_MAIL_REPORT_TO.",
    rateLimited:
      "Osiągnięto limit godzinowy ({{sent}} z {{limit}}). Spróbuj później.",
    smtpFailed: "Serwer pocztowy odrzucił wiadomość: {{error}}",
    imapFailed: "Nie można połączyć się ze skrzynką: {{error}}",
    messageNotFound: "Brak wiadomości o tym UID w skrzynce odbiorczej",
    reportFailed: "Nie udało się przygotować raportu: {{error}}",
  },
};
