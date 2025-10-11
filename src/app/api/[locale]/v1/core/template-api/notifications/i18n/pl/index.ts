import type { translations as enTranslations } from "../en";

/**
*

* Template API Notifications subdomain translations for Polish
*/

export const translations: typeof enTranslations = {
  enums: {
    notificationType: {
      created: "Utworzono",
      updated: "Zaktualizowano",
      published: "Opublikowano",
      deleted: "Usunięto",
    },
    channel: {
      email: "E-mail",
      sms: "SMS",
    },
  },
  notifications: {
    title: "Wyślij powiadomienia szablonu",
    description: "Wysyłaj powiadomienia szablonu przez e-mail i SMS",
    category: "API szablonów",
    tags: {
      notifications: "Powiadomienia",
      email: "E-mail",
      sms: "SMS",
    },
    form: {
      title: "Konfiguracja powiadomień",
      description: "Skonfiguruj ustawienia powiadomień szablonu",
    },

    // Field labels
    templateId: {
      label: "ID szablonu",
      description: "ID szablonu, dla którego mają być wysłane powiadomienia",
      placeholder: "Wprowadź ID szablonu",
    },
    notificationType: {
      label: "Typ powiadomienia",
      description: "Wybierz typy powiadomień do wysłania",
      placeholder: "Wybierz typy powiadomień",
    },
    channels: {
      label: "Kanały powiadomień",
      description: "Wybierz kanały, przez które mają być wysłane powiadomienia",
      placeholder: "Wybierz kanały",
    },
    recipients: {
      label: "Odbiorcy",
      description: "Opcjonalna lista ID odbiorców",
      placeholder: "Wybierz odbiorców",
    },
    customMessage: {
      label: "Wiadomość niestandardowa",
      description:
        "Opcjonalna wiadomość niestandardowa do dołączenia w powiadomieniu",
      placeholder: "Wprowadź swoją wiadomość niestandardową (maks. 500 znaków)",
    },

    // Response
    response: {
      title: "Wyniki powiadomień",
      description: "Wyniki procesu wysyłania powiadomień",
    },

    // Debug messages
    debug: {
      sending: "Wysyłanie powiadomień szablonu",
      emailSent: "Powiadomienia e-mail wysłane",
      smsSent: "Powiadomienia SMS wysłane",
      sent: "Wszystkie powiadomienia wysłane pomyślnie",
    },

    // Errors
    errors: {
      validation: {
        title: "Nieprawidłowe parametry",
        description: "Parametry powiadomienia są nieprawidłowe",
        message: "Sprawdź swoje parametry wejściowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do wysyłania powiadomień",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Dostęp do wysyłania powiadomień jest zabroniony",
      },
      notFound: {
        title: "Szablon nie znaleziony",
        description: "Nie można znaleźć określonego szablonu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas wysyłania powiadomień",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z usługą powiadomień",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
    },

    // Success
    success: {
      title: "Powiadomienia wysłane",
      description: "Powiadomienia szablonu wysłane pomyślnie",
    },
  },
};
