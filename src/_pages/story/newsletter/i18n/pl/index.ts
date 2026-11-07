import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Wpisz swój e-mail",
  page: {
    eyebrow: "Newsletter {{appName}}",
    title: "Jeden mail w miesiącu. Tylko konkrety.",
    description:
      "Nowe modele, nowe funkcje, prompty, które działają - co miesiąc.",
    subtitle: "Nowe modele, nowe funkcje, prompty, które działają.",
    heroDescription:
      "Nowe modele w dniu premiery, funkcje warte uwagi, ustawienia, które dają wyniki. Raz w miesiącu. Wypis jednym kliknięciem.",
    invalidEmail: {
      title: "Nieprawidłowy e-mail",
      description:
        "Ten adres wygląda na błędny. Sprawdź go i spróbuj jeszcze raz.",
    },
    emailProvided: {
      title: "Zarządzaj subskrypcją",
      description:
        "Zmień ustawienia newslettera albo wypisz się w każdej chwili.",
    },
    unsubscribeText: "Masz dość?",
    unsubscribeLink: "Wypisz się tutaj",
    privacyNote: "Zero spamu. Nikomu nie przekazujemy Twojego adresu. Nigdy.",
    cta: {
      title: "Odbierz kolejne wydanie.",
      description: "Jeden mail w miesiącu. Zero lania wody.",
      subscribeButton: "Zapisz się",
    },
    benefits: {
      title: "Co trafi do Twojej skrzynki",
      subtitle: "Cztery rzeczy. Nic więcej.",
      benefit1: {
        title: "Nowe modele jako pierwszy",
        description:
          "Każdy nowy model - w czym jest dobry, ile kosztuje, kiedy go wybrać.",
      },
      benefit2: {
        title: "Wdrożone funkcje",
        description:
          "Co się zmieniło, dlaczego to ważne, jak użyć tego od dziś.",
      },
      benefit3: {
        title: "Prompty, które działają",
        description:
          "Prawdziwe ustawienia i skille, które dają wyniki - kopiuj, dopasuj, działaj.",
      },
      benefit4: {
        title: "Oferty dla subskrybentów",
        description: "Zniżki i wcześniejszy dostęp przed wszystkimi.",
      },
    },
    frequency: {
      title: "Co miesiąc. Tyle.",
      description:
        "Jeden mail w miesiącu. Wypis w każdej chwili - jedno kliknięcie, bez pytań.",
    },
  },
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
      title: "Wypisz się z newslettera",
      description: "Przykro nam, że odchodzisz",
      subtitle: "Zarządzaj swoją subskrypcją newslettera",
      emailProvided: {
        title: "Potwierdź wypisanie",
        description: "Czy na pewno chcesz wypisać się z naszego newslettera?",
      },
      unsubscribeButton: "Wypisz się",
      subscribeText: "Zmieniłeś zdanie?",
      subscribeLink: "Subskrybuj ponownie",
      info: {
        title: "Co się stanie dalej",
        description: "Oto, co musisz wiedzieć o wypisywaniu się:",
        immediate: {
          title: "Natychmiastowy efekt",
          description:
            "Przestaniesz otrzymywać nasze e-maile z newsletterem natychmiast.",
        },
        resubscribe: {
          title: "Łatwo ponownie subskrybować",
          description:
            "Zawsze możesz ponownie subskrybować, jeśli zmienisz zdanie.",
        },
      },
      alternatives: {
        title: "Zanim odejdziesz",
        description: "Rozważ te alternatywy:",
        subscribe: "Dostosuj częstotliwość e-maili",
        contact: "Skontaktuj się z nami z opiniami",
      },
    },
  },
};
