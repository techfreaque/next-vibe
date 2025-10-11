import type { translations as enTranslations } from "../en";

/**
 * Consultation Create subdomain translations for Polish
 */

export const translations: typeof enTranslations = {
  title: "Utwórz konsultację",
  description: "Zarezerwuj konsultację z naszymi ekspertami",
  category: "Konsultacja",
  tag: "Konsultacja",
  container: {
    title: "Formularz rezerwacji konsultacji",
    description: "Wypełnij formularz, aby zaplanować konsultację",
  },
  consultationTypes: {
    label: "Typ konsultacji",
    description: "Wybierz jeden lub więcej typów konsultacji",
    placeholder: "Wybierz typy konsultacji",
  },
  preferredDate: {
    label: "Preferowana data",
    description: "Wybierz preferowaną datę konsultacji",
    placeholder: "Wybierz datę",
  },
  preferredTime: {
    label: "Preferowana godzina",
    description: "Wybierz preferowaną godzinę konsultacji",
    placeholder: "Wybierz godzinę (GG:MM)",
  },
  message: {
    label: "Wiadomość",
    description: "Dodatkowe informacje lub pytania (opcjonalne)",
    placeholder: "Powiedz nam więcej o tym, co chciałbyś omówić",
  },
  response: {
    title: "Konsultacja utworzona",
    description: "Twoja konsultacja została pomyślnie zaplanowana",
    consultationId: "Twój identyfikator konsultacji",
  },

  // Enum translations for consultation types
  enums: {
    consultationType: {
      initial: "Pierwsza konsultacja",
      followUp: "Konsultacja kontynuacyjna",
      technical: "Wsparcie techniczne",
      sales: "Rozmowa sprzedażowa",
      support: "Ogólne wsparcie",
      strategy: "Planowanie strategii",
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do utworzenia konsultacji",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Wymagana jest autentykacja, aby zarezerwować konsultację",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas tworzenia konsultacji",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie można połączyć się z serwerem. Spróbuj ponownie",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Wypełnij wszystkie wymagane pola",
    },
    conflict: {
      title: "Konflikt rezerwacji",
      description: "Wybrany termin nie jest już dostępny",
    },
    database: {
      title: "Błąd bazy danych",
      description: "Nie udało się zapisać danych konsultacji",
    },
    userNotFound: {
      title: "Użytkownik nie znaleziony",
      description: "Konto użytkownika nie zostało znalezione",
    },
    invalid_phone: {
      title: "Nieprawidłowy numer telefonu",
      description: "Podany numer telefonu jest nieprawidłowy",
    },
    sms_send_failed: {
      title: "Wysyłanie SMS nie powiodło się",
      description: "Nie udało się wysłać SMS-a konsultacyjnego",
    },
    user_not_found: {
      title: "Użytkownik nie znaleziony",
      description: "Konto użytkownika nie zostało znalezione",
    },
    no_phone_number: {
      title: "Brak numeru telefonu",
      description: "Numer telefonu jest wymagany do powiadomień SMS",
    },
    confirmation_sms_failed: {
      title: "SMS potwierdzający nie powiódł się",
      description: "Nie udało się wysłać SMS-a potwierdzającego",
    },
    update_sms_failed: {
      title: "SMS aktualizacyjny nie powiódł się",
      description: "Nie udało się wysłać SMS-a aktualizacyjnego",
    },
  },
  success: {
    title: "Konsultacja zarezerwowana",
    description: "Twoja konsultacja została pomyślnie zaplanowana",
    message: "Konsultacja utworzona pomyślnie",
  },

  // Debug translations for email rendering
  debug: {
    rendering_consultation_request_email:
      "Renderowanie e-maila z prośbą o konsultację",
    rendering_consultation_update_email:
      "Renderowanie e-maila z aktualizacją konsultacji",
    rendering_consultation_admin_notification_email:
      "Renderowanie e-maila z powiadomieniem administratora o konsultacji",
  },
};
