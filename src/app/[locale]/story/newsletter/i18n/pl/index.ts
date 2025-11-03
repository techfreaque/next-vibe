import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Wprowadź swój e-mail",
  page: {
    title: "Bądź na bieżąco z {{appName}}",
    description: "Otrzymuj najnowsze wiadomości AI, aktualizacje i wskazówki",
    subtitle: "Otrzymuj najnowsze wiadomości i aktualizacje AI",
    heroDescription:
      "Dołącz do naszego newslettera, aby otrzymywać aktualizacje o nowych modelach AI, funkcjach i wskazówkach, jak najlepiej wykorzystać niecenzurowany czat AI.",
    invalidEmail: {
      title: "Nieprawidłowy e-mail",
      description:
        "Podany adres e-mail jest nieprawidłowy. Sprawdź i spróbuj ponownie.",
    },
    emailProvided: {
      title: "Zarządzaj swoją subskrypcją",
      description:
        "Zaktualizuj swoje preferencje newslettera lub wypisz się w dowolnym momencie.",
    },
    unsubscribeText: "Chcesz się wypisać?",
    unsubscribeLink: "Kliknij tutaj",
    cta: {
      title: "Gotowy, aby być na bieżąco?",
      description:
        "Dołącz do tysięcy entuzjastów AI otrzymujących najnowsze aktualizacje",
      subscribeButton: "Subskrybuj",
    },
    benefits: {
      title: "Co otrzymasz",
      subtitle: "Bądź na bieżąco z ekskluzywnymi informacjami o AI",
      benefit1: {
        title: "Ogłoszenia nowych modeli AI",
        description:
          "Bądź pierwszym, który dowie się, kiedy dodamy nowe modele AI do platformy.",
      },
      benefit2: {
        title: "Aktualizacje funkcji",
        description:
          "Otrzymuj powiadomienia o nowych funkcjach, ulepszeniach i aktualizacjach platformy.",
      },
      benefit3: {
        title: "Wskazówki i triki AI",
        description:
          "Dowiedz się, jak uzyskać lepsze wyniki z AI dzięki naszym eksperckim wskazówkom i przypadkom użycia.",
      },
      benefit4: {
        title: "Ekskluzywne oferty",
        description:
          "Otrzymuj specjalne zniżki i wczesny dostęp do nowych funkcji.",
      },
    },
    frequency: {
      title: "Częstotliwość e-maili",
      description:
        "Wysyłamy newslettery co tydzień. Możesz wypisać się w dowolnym momencie.",
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
