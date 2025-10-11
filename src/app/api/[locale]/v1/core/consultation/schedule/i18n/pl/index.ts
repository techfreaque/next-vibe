import type { translations as enTranslations } from "../en";

/**
 * Consultation Schedule subdomain translations for Polish
 */

export const translations: typeof enTranslations = {
  // Main endpoint metadata
  title: "Zaplanuj konsultację",
  description:
    "Zaplanuj dostępną konsultację ze szczegółowymi informacjami o czasie i spotkaniu",
  category: "Zarządzanie konsultacjami",
  tag: "konsultacja",

  // Flat field references (strings for labels)
  consultationId: "ID Konsultacji",
  selectTime: "Wybierz czas",
  meetingLink: "Link do spotkania",
  calendarEventId: "ID Wydarzenia w kalendarzu",
  icsAttachment: "Załącznik ICS",

  // Field details with nested structure (avoiding duplicate keys)
  consultationIdDetails: {
    description: "ID konsultacji do zaplanowania",
    placeholder: "Wprowadź ID konsultacji",
  },
  scheduledDate: {
    description: "Data i czas konsultacji",
    placeholder: "Wybierz zaplanowaną datę i czas",
  },
  scheduledTime: {
    description: "Opcjonalny konkretny czas dla konsultacji",
    placeholder: "Wprowadź czas (GG:MM)",
  },
  meetingLinkDetails: {
    description: "Link do rozmowy wideo dla konsultacji",
    placeholder: "Wprowadź link do spotkania (np. Zoom, Teams)",
  },
  calendarEventIdDetails: {
    description: "Zewnętrzne ID wydarzenia kalendarza do śledzenia",
    placeholder: "Wprowadź ID wydarzenia kalendarza",
  },
  icsAttachmentDetails: {
    description: "Załącznik pliku kalendarza dla spotkania",
    placeholder: "Wprowadź dane kalendarza ICS",
  },

  // Response field descriptions
  response: {
    id: "ID Konsultacji",
    status: "Status Konsultacji",
    isNotified: "Powiadomienie e-mail wysłane",
    updatedAt: "Ostatnio zaktualizowane",
  },

  // Success messages
  success: {
    title: "Konsultacja zaplanowana",
    description: "Konsultacja została pomyślnie zaplanowana",
  },

  // Error messages organized by type
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      consultationId: "Nieprawidłowy format ID konsultacji",
      scheduledDate: "Nieprawidłowy format daty lub czasu",
    },
    notFound: {
      title: "Konsultacja nie znaleziona",
      description: "Konsultacja o podanym ID nie została znaleziona",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do planowania tej konsultacji",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Wymagana jest autentykacja, aby planować konsultacje",
    },
    conflict: {
      title: "Konflikt planowania",
      description:
        "Ta konsultacja nie może być zaplanowana (już zakończona lub anulowana)",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas planowania konsultacji",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie można połączyć się z serwerem. Spróbuj ponownie",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Wypełnij wszystkie wymagane pola",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie",
    },
    email_send_failed: {
      title: "Wysyłanie e-maila nie powiodło się",
      description: "Nie udało się wysłać e-maila planującego",
    },
    user_not_found: {
      title: "Użytkownik nie znaleziony",
      description: "Konto użytkownika nie zostało znalezione",
    },
    scheduled_email_failed: {
      title: "Zaplanowany e-mail nie powiódł się",
      description: "Nie udało się wysłać zaplanowanego e-maila konsultacyjnego",
    },
    rescheduled_email_failed: {
      title: "Przełożony e-mail nie powiódł się",
      description: "Nie udało się wysłać przełożonego e-maila konsultacyjnego",
    },
    admin_notification_failed: {
      title: "Powiadomienie administratora nie powiodło się",
      description: "Nie udało się wysłać powiadomienia administratora",
    },
    invalid_phone: {
      title: "Nieprawidłowy numer telefonu",
      description: "Podany numer telefonu jest nieprawidłowy",
    },
    sms_send_failed: {
      title: "Wysyłanie SMS nie powiodło się",
      description: "Nie udało się wysłać SMS-a planującego",
    },
    no_phone_number: {
      title: "Brak numeru telefonu",
      description: "Numer telefonu jest wymagany do powiadomień SMS",
    },
    scheduled_sms_failed: {
      title: "Zaplanowany SMS nie powiódł się",
      description: "Nie udało się wysłać zaplanowanego SMS-a konsultacyjnego",
    },
    rescheduled_sms_failed: {
      title: "Przełożony SMS nie powiódł się",
      description: "Nie udało się wysłać przełożonego SMS-a konsultacyjnego",
    },
  },
};
