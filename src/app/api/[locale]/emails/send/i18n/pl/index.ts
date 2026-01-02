/**
 * Polish translations for Email Send endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wyślij e-mail",
  description: "Wysyłaj e-maile z opcjonalnymi powiadomieniami SMS",
  category: "Komunikacja e-mail",
  tag: "Wyślij",

  container: {
    title: "Konfiguracja wysyłania e-maili",
    description: "Skonfiguruj ustawienia e-maili i opcjonalnych powiadomień SMS",
  },

  // Field groups
  recipient: {
    title: "Informacje o odbiorcy",
    description: "Skonfiguruj szczegóły odbiorcy e-maila",
  },
  emailContent: {
    title: "Treść e-maila",
    description: "Skonfiguruj temat i treść e-maila",
  },
  senderSettings: {
    title: "Ustawienia nadawcy",
    description: "Skonfiguruj nazwę nadawcy i adres odpowiedzi",
  },
  groups: {
    campaignTracking: {
      title: "Śledzenie kampanii",
      description: "Śledź ten e-mail jako część kampanii",
    },
    smsNotifications: {
      title: "Powiadomienia SMS",
      description: "Wysyłaj powiadomienia SMS oprócz e-maila",
    },
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
    placeholder: "Wybierz typ kampanii...",
    options: {
      leadCampaign: "Kampania leadowa",
      newsletter: "Newsletter",
      transactional: "Transakcyjny",
      notification: "Powiadomienie",
      system: "System",
    },
  },
  leadId: {
    label: "ID leada",
    description: "Powiązany identyfikator leada (opcjonalny)",
    placeholder: "lead-12345",
  },

  // Response fields
  response: {
    title: "Wynik wysyłania e-maila",
    description: "Wynik operacji wysyłania e-maila",
    deliveryStatus: {
      title: "Status dostawy",
    },
    accountInfo: {
      title: "Informacje o koncie",
    },
    deliveryResults: {
      title: "Wyniki dostawy",
    },
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
      messageId: {
        label: "ID wiadomości SMS",
      },
      provider: "Dostawca SMS",
      sentAt: {
        label: "SMS wysłano o",
      },
      error: {
        label: "Błąd SMS",
      },
    },
  },

  // SMS template
  sms: {
    emailNotificationTemplate: "Powiadomienie e-mail",
  },

  // Error messages
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane i spróbuj ponownie",
      smsFields: "Pola powiadomień SMS",
      smsRequired: "Numer telefonu i wiadomość są wymagane, gdy powiadomienie SMS jest włączone",
    },
    sms: {
      temporarilyUnavailable: "Usługa SMS jest tymczasowo niedostępna",
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
