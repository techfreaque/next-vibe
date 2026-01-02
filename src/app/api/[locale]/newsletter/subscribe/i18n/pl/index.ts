import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    subscription: "Subskrypcja",
  },
  email: {
    label: "Adres e-mail",
    description: "Twój adres e-mail do subskrypcji newslettera",
    placeholder: "użytkownik@przykład.pl",
    helpText: "Użyjemy tego adresu do wysyłania aktualizacji newslettera",
  },
  name: {
    label: "Imię",
    description: "Twoje imię (opcjonalne)",
    placeholder: "Jan Kowalski",
    helpText: "Pomóż nam spersonalizować Twoje doświadczenie z newsletterem",
  },
  preferences: {
    label: "Preferencje newslettera",
    description: "Wybierz rodzaje newsletterów, które chcesz otrzymywać",
    placeholder: "Wybierz swoje preferencje",
    helpText: "Możesz zmienić te preferencje w dowolnym momencie",
  },
  leadId: {
    label: "ID Lead",
    description: "Opcjonalny identyfikator lead",
    placeholder: "123e4567-e89b-12d3-a456-426614174000",
    helpText: "Tylko do użytku wewnętrznego",
  },
  response: {
    success: "Pomyślnie zasubskrybowano newsletter",
    message: "Wiadomość o sukcesie",
    leadId: "Identyfikator Lead",
    subscriptionId: "ID subskrypcji",
    userId: "ID użytkownika",
    alreadySubscribed:
      "Ten adres e-mail jest już zapisany do naszego newslettera",
  },
  errors: {
    badRequest: {
      title: "Nieprawidłowe żądanie",
      description: "Podano nieprawidłowe parametry żądania",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd podczas przetwarzania Twojej subskrypcji",
    },
  },
  post: {
    title: "Subskrybuj newsletter",
    description: "Ustaw subskrypcję newslettera",
    form: {
      title: "Subskrypcja newslettera",
      description: "Skonfiguruj subskrypcję newslettera",
    },
    response: {
      title: "Odpowiedź subskrypcji",
      description: "Dane odpowiedzi subskrypcji newslettera",
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
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd podczas przetwarzania Twojej subskrypcji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      conflict: {
        title: "Już zasubskrybowany",
        description:
          "Ten adres e-mail jest już zapisany do naszego newslettera",
      },
      badRequest: {
        title: "Nieprawidłowe żądanie",
        description: "Podano nieprawidłowe parametry żądania",
      },
    },
    success: {
      title: "Pomyślnie zasubskrybowano",
      description: "Zostałeś pomyślnie zapisany do naszego newslettera",
    },
  },
  repository: {
    starting: "Rozpoczynanie subskrypcji newslettera",
    linking_to_lead: "Łączenie subskrypcji newslettera z leadem",
    lead_found: "Znaleziono lead dla subskrypcji newslettera",
    lead_updated: "Zaktualizowano lead z danymi subskrypcji newslettera",
    lead_update_failed:
      "Nie udało się zaktualizować leada z danymi newslettera",
    lead_not_found:
      "Lead nie znaleziony lub nie kwalifikuje się do aktualizacji",
    lead_linking_error: "Błąd podczas łączenia leada z newsletterem",
    missing_lead_id: "Próba subskrypcji newslettera bez leadId",
    already_subscribed: "Użytkownik już zasubskrybował newsletter",
    reactivating: "Reaktywacja subskrypcji newslettera",
    creating_new: "Tworzenie nowej subskrypcji newslettera",
    created_successfully: "Pomyślnie utworzono subskrypcję newslettera",
    subscription_failed: "Subskrypcja newslettera nie powiodła się",
  },
  sms: {
    no_phone_number: "Brak numeru telefonu dla powitalnego SMS newslettera",
    sending_welcome: "Wysyłanie powitalnego SMS do subskrybenta newslettera",
    welcome_error: "Błąd wysyłania powitalnego SMS newslettera",
    no_admin_phone:
      "Brak skonfigurowanego numeru telefonu administratora, pomijanie powiadomienia SMS",
    sending_admin_notification:
      "Wysyłanie powiadomienia SMS administratora dla subskrypcji newslettera",
    admin_notification_error: "Błąd wysyłania powiadomienia SMS administratora",
    welcome: {
      message:
        "Cześć {{name}}! Witamy w naszym newsletterze. Czekaj na aktualizacje!",
    },
    admin_notification: {
      message:
        "Nowa subskrypcja newslettera: {{displayName}} ({{email}}) zasubskrybował",
    },
  },
  route: {
    sms_failed_continuing: "Powiadomienia SMS nie powiodły się, kontynuowanie",
  },
  emailTemplate: {
    welcome: {
      title: "Witamy w newsletterze {{appName}}!",
      subject: "Witamy w {{appName}} - Bądź na bieżąco z niecenzurowaną AI",
      preview:
        "Jesteś zapisany! Otrzymuj najnowsze aktualizacje o niecenzurowanej AI, nowych modelach i ekskluzywnych wskazówkach.",
      greeting_with_name: "Cześć {{name}}!",
      greeting: "Witaj!",
      message:
        "Witamy w newsletterze {{appName}}! Jesteś teraz częścią naszej społeczności entuzjastów AI, którzy cenią szczere, niecenzurowane rozmowy z AI.",
      what_to_expect: "Oto, co będziesz otrzymywać:",
      benefit_1: "Ogłoszenia i aktualizacje dotyczące nowych modeli AI",
      benefit_2:
        "Wskazówki i triki, jak najlepiej wykorzystać niecenzurowane modele AI",
      benefit_3: "Ekskluzywne oferty i wczesny dostęp do nowych funkcji",
      benefit_4: "Najciekawsze momenty społeczności i historie sukcesu",
      frequency:
        "Będziemy wysyłać aktualizacje co kilka tygodni – nigdy spam, zawsze wartościowe treści.",
      unsubscribe_text: "Nie chcesz otrzymywać tych wiadomości?",
      unsubscribe_link: "Wypisz się",
    },
    admin_notification: {
      title: "Nowa subskrypcja newslettera",
      subject: "Nowa subskrypcja newslettera",
      preview: "Nowy użytkownik zasubskrybował newsletter",
      message: "Nowy użytkownik zasubskrybował newsletter.",
      subscriber_details: "Szczegóły subskrybenta",
      email: "E-mail",
      name: "Imię",
      preferences: "Preferencje",
      view_in_admin: "Zobacz w Panelu Admina",
    },
  },
};
