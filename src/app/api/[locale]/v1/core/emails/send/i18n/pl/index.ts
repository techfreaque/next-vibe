/**
 * Polish translations for Email Send endpoint
 */

export const translations = {
  title: "Wyślij e-mail",
  description: "Wysyłaj e-maile z opcjonalnymi powiadomieniami SMS",
  category: "Komunikacja e-mail",
  tag: "Wyślij",

  container: {
    title: "Konfiguracja wysyłania e-maili",
    description:
      "Skonfiguruj ustawienia e-maili i opcjonalnych powiadomień SMS",
  },

  // Email fields
  to: {
    label: "E-mail odbiorcy",
    description: "Adres e-mail odbiorcy",
    placeholder: "odbiorca@przyklad.pl",
  },
  toName: {
    label: "Nazwa odbiorcy",
    description: "Nazwa wyświetlana odbiorcy (opcjonalna)",
    placeholder: "Jan Kowalski",
  },
  subject: {
    label: "Temat e-maila",
    description: "Linia tematu dla e-maila",
    placeholder: "Twój temat tutaj...",
  },
  html: {
    label: "Treść HTML",
    description: "Treść HTML e-maila",
    placeholder: "Wprowadź treść HTML e-maila...",
  },
  text: {
    label: "Treść tekstowa",
    description: "Zapasowa treść tekstowa (opcjonalna)",
    placeholder: "Wprowadź wersję tekstową...",
  },
  senderName: {
    label: "Nazwa nadawcy",
    description: "Nazwa wyświetlana jako nadawca",
    placeholder: "Twoja firma",
  },
  replyTo: {
    label: "E-mail odpowiedzi",
    description: "Adres e-mail do odpowiedzi (opcjonalny)",
    placeholder: "noreply@przyklad.pl",
  },

  // SMS notification fields
  sendSmsNotification: {
    label: "Wyślij powiadomienie SMS",
    description: "Wyślij powiadomienie SMS oprócz e-maila",
  },
  smsPhoneNumber: {
    label: "Numer telefonu SMS",
    description: "Numer telefonu do wysłania powiadomienia SMS",
    placeholder: "+48123456789",
  },
  smsMessage: {
    label: "Wiadomość SMS",
    description: "Treść wiadomości dla powiadomienia SMS",
    placeholder: "E-mail został wysłany pomyślnie!",
  },

  campaignType: {
    label: "Typ kampanii",
    description: "Typ kampanii e-mailowej",
  },
  leadId: {
    label: "ID leada",
    description: "Powiązany identyfikator leada (opcjonalny)",
    placeholder: "lead-12345",
  },

  // Response fields
  response: {
    success: {
      label: "Sukces",
    },
    messageId: {
      label: "ID wiadomości",
    },
    accountId: {
      label: "ID konta",
    },
    accountName: {
      label: "Konto SMTP",
    },
    accepted: {
      label: "Zaakceptowani odbiorcy",
    },
    rejected: {
      label: "Odrzuceni odbiorcy",
    },
    response: {
      label: "Odpowiedź SMTP",
    },
    sentAt: {
      label: "Wysłano o",
    },
    smsResult: {
      title: "Wynik powiadomienia SMS",
      description: "Wynik wysyłania powiadomienia SMS",
      success: "Sukces SMS",
      messageId: "ID wiadomości SMS",
      provider: "Dostawca SMS",
      sentAt: "SMS wysłano o",
      error: "Błąd SMS",
    },
  },

  // Error messages
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane i spróbuj ponownie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do wysyłania e-maili",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas wysyłania e-maila",
    },
    email: {
      title: "Błąd wysyłania e-maila",
      description: "Nie udało się wysłać e-maila przez usługę SMTP",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do tego zasobu jest zabroniony",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas wysyłania e-maila",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Zasób e-mail nie został znaleziony",
    },
    conflict: {
      title: "Konflikt",
      description: "Żądanie e-maila koliduje z istniejącymi danymi",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
  },
  success: {
    title: "E-mail wysłany pomyślnie",
    description: "Twój e-mail został wysłany pomyślnie",
  },
};
