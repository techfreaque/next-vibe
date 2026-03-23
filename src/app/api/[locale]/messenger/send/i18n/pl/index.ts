/**
 * Polish translations for unified Messenger Send endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wyślij wiadomość",
  description:
    "Wyślij wiadomość przez dowolny kanał (E-mail, SMS, WhatsApp, Telegram)",
  category: "Komunikacja",
  tag: "Wyślij",

  container: {
    title: "Wyślij wiadomość",
    description: "Wyślij przez skonfigurowane konto messenger",
  },

  accountId: {
    label: "Konto messenger",
    description: "Konto do wysyłania",
    placeholder: "Wybierz UUID konta",
  },
  to: {
    label: "Odbiorca",
    description: "Adres e-mail, numer telefonu lub ID czatu",
    placeholder: "uzytkownik@przyklad.pl lub +48123456789",
  },
  toName: {
    label: "Nazwa odbiorcy",
    description: "Nazwa wyświetlana odbiorcy (opcjonalna)",
    placeholder: "Jan Kowalski",
  },
  subject: {
    label: "Temat",
    description: "Linia tematu (tylko e-mail, opcjonalna dla innych kanałów)",
    placeholder: "Twój temat tutaj...",
  },
  text: {
    label: "Wiadomość",
    description:
      "Treść tekstowa - dla SMS/WhatsApp/Telegram; zapasowa dla e-mail",
    placeholder: "Wprowadź wiadomość...",
  },
  html: {
    label: "Treść HTML",
    description: "Treść HTML (tylko e-mail, opcjonalna - zapasowa tekst)",
    placeholder: "<p>Wprowadź treść HTML e-maila...</p>",
  },
  senderName: {
    label: "Nazwa nadawcy",
    description: "Nazwa wyświetlana jako nadawca (tylko e-mail, opcjonalna)",
    placeholder: "Twoja firma",
  },
  replyTo: {
    label: "Odpowiedź do",
    description: "Adres odpowiedzi (tylko e-mail, opcjonalny)",
    placeholder: "support@przyklad.pl",
  },
  leadId: {
    label: "ID leada",
    description: "Powiązany lead do śledzenia (opcjonalny)",
    placeholder: "UUID",
  },
  campaignId: {
    label: "ID kampanii",
    description: "Powiązana kampania do śledzenia (opcjonalna)",
    placeholder: "UUID",
  },

  response: {
    title: "Wynik wysyłania",
    description: "Wynik operacji wysyłania",
    messageId: { label: "ID wiadomości" },
    accountName: { label: "Konto" },
    channel: { label: "Kanał" },
    provider: { label: "Dostawca" },
    sentAt: { label: "Wysłano o" },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane i spróbuj ponownie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do wysyłania wiadomości",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas wysyłania",
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
      description: "Wystąpił błąd sieci podczas wysyłania",
    },
    notFound: {
      title: "Konto nie znalezione",
      description: "Podane konto messenger nie zostało znalezione",
    },
    conflict: {
      title: "Konflikt",
      description: "Żądanie koliduje z istniejącymi danymi",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
  },

  success: {
    title: "Wiadomość wysłana",
    description: "Twoja wiadomość została wysłana pomyślnie",
  },
};
