import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  email: {
    tagline: "Platforma AI wolnego słowa",
    footer: {
      needHelp: "Potrzebujesz pomocy?",
      helpText: "Potrzebujesz pomocy? Skontaktuj się z nami pod adresem",
      unsubscribeText: "Nie chcesz otrzymywać tych wiadomości?",
      unsubscribeLink: "Wypisz się",
      copyright: "© {{currentYear}} {{appName}}. Wszelkie prawa zastrzeżone.",
      visitWebsite: "Odwiedź stronę",
      allRightsReserved:
        "© {{currentYear}} {{appName}}. Wszelkie prawa zastrzeżone.",
      feedbackHook: "Masz coś do powiedzenia? Odpowiedz - naprawdę to czytamy.",
      feedbackBody:
        "Zgłoś błąd, poproś o funkcję albo napisz, czego brakuje. Za pomocne opinie darzymy 200 darmowych kredytów.",
      feedbackLink: "Wyślij opinię →",
      footerSeparator: " · ",
    },
  },
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
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
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
