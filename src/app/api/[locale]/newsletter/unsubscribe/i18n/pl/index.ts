import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      support_message: "Jeśli masz jakieś pytania, skontaktuj się z naszym zespołem wsparcia",
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
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd podczas przetwarzania Twojego żądania wypisania",
    },
  },
  post: {
    title: "Wypisz z newslettera",
    description: "Wypisz się z aktualizacji newslettera",
    form: {
      title: "Wypisz się z newslettera",
      description: "Wprowadź swój adres e-mail, aby wypisać się z naszego newslettera",
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
        description: "Wystąpił błąd podczas przetwarzania Twojego żądania wypisania",
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
        description: "Nie udało się wysłać SMS z powiadomieniem dla administratora",
      },
    },
  },
};
