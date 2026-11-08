import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  emailPlaceholder: "Wprowadź swój e-mail",
  subscription: {
    unsubscribe: {
      title: "Wypisz się",
      confirmButton: "Potwierdź wypisanie",
      success: "Zostałeś wypisany",
      error: "Nie udało się wypisać",
    },
  },
  unsubscribe: {
    page: {
      title: "Wypisz się",
      description: "Wpisz adres, kliknij, gotowe. Bez wyrzutów sumienia.",
      subtitle: "Zarządzaj swoją subskrypcją newslettera",
      emailProvided: {
        title: "Potwierdź wypisanie",
        description:
          "Ten adres przestanie dostawać newsletter. Jedno kliknięcie.",
      },
      unsubscribeButton: "Wypisz się",
      unsubscribing: "Wypisywanie...",
      status: {
        subscribed: "Ten adres dostaje nasz newsletter.",
        notSubscribed: "Tego adresu nie ma na naszej liście.",
      },
      subscribeText: "Zmieniłeś zdanie?",
      subscribeLink: "Subskrybuj ponownie",
      info: {
        title: "Co się stanie dalej",
        description: "Oto, co musisz wiedzieć o wypisywaniu się:",
        immediate: {
          title: "Od razu.",
          description:
            "Przestaniesz otrzymywać nasze e-maile z newsletterem natychmiast.",
        },
        resubscribe: {
          title: "Odwracalne.",
          description:
            "Zawsze możesz ponownie subskrybować, jeśli zmienisz zdanie.",
        },
      },
      alternatives: {
        title: "Zanim odejdziesz",
        description: "Rozważ te alternatywy:",
        subscribe: "Dostosuj częstotliwość e-maili",
        contact: "Powiedz nam, co poprawić",
      },
    },
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
      detail: "Nie udało się wypisać z newslettera: {{error}}",
    },
  },
  post: {
    title: "Wypisz z newslettera",
    titleShort: "Wypisz się",
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
  oneClick: {
    tag: "Wypisanie jednym kliknięciem",
    post: {
      title: "Wypisanie jednym kliknięciem",
      titleShort: "Wypisz",
      description:
        "Wypisanie przez podpisany link one-click z nagłówka e-maila (RFC 8058)",
      container: {
        title: "Wypisanie jednym kliknięciem",
        description:
          "Wywoływane przez dostawców poczty. Podpisany token autoryzuje wypisanie.",
      },
      token: {
        label: "Token",
        description: "Podpisany token wypisania z e-maila",
      },
      errors: {
        invalidToken: {
          title: "Nieprawidłowy link",
          description: "Ten link do wypisania jest nieprawidłowy.",
        },
        server: {
          title: "Błąd serwera",
          description: "Wypisanie nie powiodło się. Spróbuj ponownie.",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowy format tokenu",
        },
      },
      success: {
        title: "Wypisano",
        description: "Nie ma Cię już na liście.",
      },
    },
  },
  sync: {
    failed: "Synchronizacja wypisania z newslettera nie powiodła się",
    error: "Błąd synchronizacji wypisania z newslettera",
    tag: "Synchronizacja newslettera",
    post: {
      title: "Synchronizuj wypisania z newslettera",
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
      message: "Wypisanie z newslettera: {{email}} wypisał się z newslettera.",
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
};
