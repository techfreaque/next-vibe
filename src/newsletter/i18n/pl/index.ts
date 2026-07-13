import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  status: {
    title: "Status newslettera",
    description: "Sprawdź status subskrypcji newslettera dla adresu e-mail",
    category: "Newsletter",
    tags: {
      status: "Status",
    },
    form: {
      title: "Sprawdź status newslettera",
      description:
        "Wprowadź adres e-mail, aby sprawdzić status subskrypcji newslettera",
    },
    email: {
      label: "Adres e-mail",
      description:
        "Adres e-mail, dla którego chcesz sprawdzić status subskrypcji",
      placeholder: "użytkownik@przykład.pl",
      helpText: "Wprowadź adres e-mail, który chcesz sprawdzić",
    },
    response: {
      subscribed: "Status subskrypcji",
      status: "Aktualny status",
    },
    errors: {
      validation: {
        title: "Nieprawidłowy e-mail",
        description: "Proszę podać prawidłowy adres e-mail",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd podczas sprawdzania statusu subskrypcji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnień do sprawdzenia tego statusu subskrypcji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak informacji o subskrypcji dla tego adresu e-mail",
      },
    },
    success: {
      title: "Status pobrany",
      description: "Pomyślnie pobrano status subskrypcji newslettera",
    },
  },
  subscribe: {
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
      email_generation_failed: "Nie udało się wygenerować e-maila",
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
      admin_notification_error:
        "Błąd wysyłania powiadomienia SMS administratora",
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
      sms_failed_continuing:
        "Powiadomienia SMS nie powiodły się, kontynuowanie",
    },
    emailTemplates: {
      welcome: {
        name: "Newsletter Welcome Email",
        description: "Welcome email sent to new newsletter subscribers",
        category: "newsletter",
        preview: {
          email: {
            label: "Adres e-mail",
            description: "Adres e-mail subskrybenta",
          },
          name: {
            label: "Imię subskrybenta",
            description: "Imię subskrybenta (opcjonalne)",
          },
          leadId: {
            label: "ID leada",
            description: "Identyfikator śledzenia leada dla analityki",
          },
          userId: {
            label: "ID użytkownika",
            description: "Identyfikator konta użytkownika (opcjonalne)",
          },
        },
      },
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
          "Będziemy wysyłać aktualizacje co kilka tygodni - nigdy spam, zawsze wartościowe treści.",
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
  },
  unsubscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
    },
    email: {
      label: "Adres e-mail",
      description: "Adres e-mail do wypisania z newslettera",
      placeholder: "użytkownik@przykład.pl",
      unsubscribe: {
        title: "Wypisz się z newslettera",
        preview: "Pomyślnie wypisałeś się z naszego newslettera",
        greeting: "Cześć",
        confirmation: "Pomyślnie wypisaliśmy {{email}} z naszego newslettera",
        resubscribe_info:
          "Jeśli zmienisz zdanie, zawsze możesz ponownie zapisać się odwiedzając naszą stronę",
        resubscribe_button: "Zapisz ponownie",
        support_message:
          "Jeśli masz jakieś pytania, skontaktuj się z naszym zespołem wsparcia",
        subject: "Potwierdzenie wypisania z newslettera",
        admin_unsubscribe_notification: {
          title: "Powiadomienie o wypisaniu z newslettera",
          preview: "Użytkownik wypisał się z newslettera",
          message: "Użytkownik wypisał się z newslettera",
          email: "E-mail",
          date: "Data",
          view_dashboard: "Zobacz pulpit",
          subject: "Wypisanie z newslettera - Powiadomienie administracyjne",
        },
      },
    },
    response: {
      success: "Pomyślnie wypisano z newslettera",
      message: "Wiadomość o sukcesie",
    },
    errors: {
      email_generation_failed: "Nie udało się wygenerować e-maila",
      internal: {
        title: "Błąd wewnętrzny",
        description:
          "Wystąpił błąd podczas przetwarzania Twojego żądania wypisania",
      },
    },
    post: {
      title: "Wypisz z newslettera",
      description: "Wypisz się z aktualizacji newslettera",
      form: {
        title: "Wypisz się z newslettera",
        description:
          "Wprowadź swój adres e-mail, aby wypisać się z naszego newslettera",
      },
      response: {
        title: "Odpowiedź wypisania",
        description: "Potwierdzenie wypisania z newslettera",
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
          description:
            "Wystąpił błąd podczas przetwarzania Twojego żądania wypisania",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp zabroniony",
        },
      },
      success: {
        title: "Pomyślnie wypisano",
        description: "Zostałeś wypisany z naszego newslettera",
      },
    },
    sync: {
      failed: "Synchronizacja wypisania z newslettera nie powiodła się",
      error: "Błąd synchronizacji wypisania z newslettera",
      tag: "Synchronizacja newslettera",
      post: {
        title: "Synchronizuj wypisania z newslettera",
        titleShort: "Sync wypisań",
        description: "Synchronizuj statusy leadów dla wypisań z newslettera",
        container: {
          title: "Konfiguracja synchronizacji",
          description: "Skonfiguruj parametry synchronizacji",
        },
        fields: {
          batchSize: {
            label: "Rozmiar partii",
            description: "Liczba rekordów do przetworzenia na partię",
          },
          dryRun: {
            label: "Próbny przebieg",
            description: "Uruchom bez wprowadzania zmian",
          },
        },
        response: {
          leadsProcessed: "Przetworzone leady",
          leadsUpdated: "Zaktualizowane leady",
          executionTimeMs: "Czas wykonania (ms)",
        },
        errors: {
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Dostęp zabroniony",
          },
          server: {
            title: "Błąd serwera",
            description: "Wystąpił błąd podczas synchronizacji",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieznany błąd",
          },
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry żądania",
          },
        },
        success: {
          title: "Synchronizacja zakończona",
          description:
            "Wypisania z newslettera zostały pomyślnie zsynchronizowane",
        },
      },
    },
    emailTemplates: {
      unsubscribe: {
        name: "E-mail potwierdzający wypisanie z newslettera",
        description: "E-mail potwierdzający wypisanie z newslettera",
        category: "newsletter",
        preview: {
          email: {
            label: "Adres e-mail",
            description: "Adres e-mail, który ma zostać wypisany",
          },
        },
      },
    },
    sms: {
      confirmation: {
        message:
          "Pomyślnie wypisałeś się z newslettera {{appName}}. Jeśli to pomyłka, odwiedź naszą stronę, aby ponownie się zapisać.",
      },
      admin_notification: {
        message:
          "Wypisanie z newslettera: {{email}} wypisał się z newslettera.",
      },
      errors: {
        confirmation_failed: {
          title: "Nieudane potwierdzenie SMS",
          description: "Nie udało się wysłać SMS potwierdzającego wypisanie",
        },
        admin_notification_failed: {
          title: "Nieudane powiadomienie SMS administratora",
          description:
            "Nie udało się wysłać SMS z powiadomieniem dla administratora",
        },
      },
    },
  },
  email: {
    welcome: {
      title: "Witamy w naszym newsletterze",
      preview: "Witamy w naszym newsletterze! Dziękujemy za subskrypcję",
      greeting: "Cześć",
      greeting_with_name: "Cześć {{name}}",
      message: "Witamy w newsletterze {{appName}}! Dziękujemy za subskrypcję.",
      what_to_expect: "Oto czego możesz oczekiwać od naszego newslettera:",
      benefit_1: "Najnowsze aktualizacje produktów i funkcji",
      benefit_2: "Wglądy branżowe i trendy",
      benefit_3: "Ekskluzywne treści i wskazówki",
      benefit_4: "Specjalne oferty i promocje",
      frequency:
        "Będziemy wysyłać Ci newslettery tygodniowo z najnowszymi aktualizacjami.",
      unsubscribe_text: "Możesz wypisać się w dowolnym momencie klikając",
      unsubscribe_link: "tutaj",
      subject: "Witamy w naszym newsletterze!",
    },
    admin_notification: {
      title: "Nowa subskrypcja newslettera",
      preview: "Nowy użytkownik zasubskrybował newsletter",
      message: "Nowy użytkownik zasubskrybował Twój newsletter.",
      subscriber_details: "Dane subskrybenta",
      email: "E-mail",
      name: "Imię",
      preferences: "Preferencje",
      view_in_admin: "Zobacz w panelu administracyjnym",
      subject: "Nowa subskrypcja newslettera - Powiadomienie administracyjne",
    },
    unsubscribe: {
      title: "Wypisz się z newslettera",
      preview: "Pomyślnie wypisałeś się z naszego newslettera",
      greeting: "Cześć",
      confirmation: "Pomyślnie wypisaliśmy {{email}} z naszego newslettera",
      resubscribe_info:
        "Jeśli zmienisz zdanie, zawsze możesz ponownie zapisać się odwiedzając naszą stronę",
      resubscribe_button: "Zapisz ponownie",
      support_message:
        "Jeśli masz jakieś pytania, skontaktuj się z naszym zespołem wsparcia",
      subject: "Potwierdzenie wypisania z newslettera",
      admin_unsubscribe_notification: {
        title: "Powiadomienie o wypisaniu z newslettera",
        preview: "Użytkownik wypisał się z newslettera",
        message: "Użytkownik wypisał się z newslettera",
        email: "E-mail",
        date: "Data",
        view_dashboard: "Zobacz pulpit",
        subject: "Wypisanie z newslettera - Powiadomienie administracyjne",
      },
    },
  },
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Nowości produktowe",
      companyUpdates: "Aktualności firmowe",
      industryInsights: "Wgląd w branżę",
      events: "Wydarzenia",
    },
    status: {
      subscribed: "Zasubskrybowany",
      unsubscribed: "Wypisany",
      pending: "Oczekujący",
      bounced: "Odrzucony",
      complained: "Skarga",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Subskrypcja newslettera: Brak leadId",
    },
  },
  errors: {
    email_generation_failed: "Nie udało się wygenerować e-maila",
  },
  error: {
    general: {
      internal_server_error: "Wewnętrzny błąd serwera",
    },
    default: "Wystąpił błąd",
  },
  subscription: {
    error: {
      description: "Nie udało się zasubskrybować newslettera",
    },
    unsubscribe: {
      error: "Nie udało się wypisać z newslettera",
      confirmQuestion: "Czy na pewno chcesz się wypisać?",
    },
  },
};
