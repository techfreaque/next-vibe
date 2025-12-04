import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    active: "Aktywny",
    filter: "Filtruj",
    refresh: "Odśwież",
    weekday: {
      monday: "Poniedziałek",
      tuesday: "Wtorek",
      wednesday: "Środa",
      thursday: "Czwartek",
      friday: "Piątek",
      saturday: "Sobota",
      sunday: "Niedziela",
    },

    selector: {
      country: "Kraj",
      language: "Język",
    },
    accessibility: {
      srOnly: {
        enableLightMode: "Włącz tryb jasny",
        enableDarkMode: "Włącz tryb ciemny",
        toggleMenu: "Przełącz menu",
      },
    },
    error: {
      title: "Błąd",
      message: "Coś poszło nie tak",
      description: "Wystąpił błąd. Spróbuj ponownie.",
      tryAgain: "Spróbuj ponownie",
      sending_sms: "Nie udało się wysłać SMS-a",
      boundary: {
        stackTrace: "📋 Ślad stosu",
        componentStack: "🔍 Stos komponentów",
        errorDetails: "ℹ️ Szczegóły błędu",
        name: "Nazwa:",
        errorMessage: "Wiadomość:",
        cause: "Przyczyna:",
      },
    },
    errors: {
      unknown: "Wystąpił nieznany błąd",
    },
    success: {
      title: "Sukces",
      message: "Operacja zakończona pomyślnie",
      description: "Twoja akcja została pomyślnie zakończona.",
    },
    info: {
      title: "Informacja",
      message: "Proszę zauważyć",
      description: "Oto kilka informacji dla Ciebie.",
    },
    api: {
      notifications: {
        welcome: {
          title: "Witamy!",
          description: "Dziękujemy za dołączenie do nas. Zaczynajmy!",
        },
      },
    },
    footer: {
      description:
        "Przekształć swoją obecność w mediach społecznościowych dzięki profesjonalnemu tworzeniu treści i strategicznemu zarządzaniu.",
      copyright: "© {{year}} {{appName}}. Wszelkie prawa zastrzeżone.",
      tagline: "Podnieś poziom swojej gry w mediach społecznościowych",
      social: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
        linkedin: "LinkedIn",
      },
      services: {
        title: "Usługi",
        socialAccountSetup: "Konfiguracja konta społecznościowego",
        contentCreation: "Tworzenie treści",
        strategyDevelopment: "Rozwój strategii",
        performanceAnalytics: "Analiza wydajności",
        communityManagement: "Zarządzanie społecznością",
        audienceBuilding: "Budowanie publiczności",
        adCampaigns: "Kampanie reklamowe",
      },
      company: {
        title: "Firma",
        aboutUs: "O nas",
        contactUs: "Kontakt",
        careers: "Kariera",
        privacyPolicy: "Polityka prywatności",
        termsOfService: "Warunki korzystania z usługi",
        imprint: "Stopka redakcyjna",
      },
    },
  },
  newsletter: {
    title: "Bądź na bieżąco",
    description:
      "Zapisz się do naszego newslettera, aby otrzymywać najnowsze aktualizacje i spostrzeżenia.",
    emailPlaceholder: "Wprowadź swój e-mail",
    subscribe: "Subskrybuj",
    subscription: {
      unsubscribe: {
        title: "Wypisz się",
        confirmButton: "Potwierdź wypisanie",
      },
    },
  },
  pages: {
    error: {
      title: "Coś poszło nie tak!",
      message: "Przepraszamy, ale coś nieoczekiwanego się wydarzyło.",
      errorId: "ID błędu: {{id}}",
      error_message: "Błąd: {{message}}",
      stackTrace: "Ślad stosu: {{stack}}",
      tryAgain: "Spróbuj ponownie",
      backToHome: "Powrót do strony głównej",
    },
    notFound: {
      title: "Strona nie znaleziona",
      description:
        "Strona, której szukasz, nie istnieje lub została przeniesiona.",
      goBack: "Wróć",
      goHome: "Przejdź do strony głównej",
    },
  },
  meta: {
    home: {
      title: "{{appName}} - Niecenzurowany czat AI",
      category: "Platforma czatu AI",
      description:
        "Doświadcz prawdziwie niecenzurowanych rozmów z AI z ponad {{modelCount}} modelami. Bez filtrów, bez ograniczeń, tylko szczera AI.",
      imageAlt: "{{appName}} - Niecenzurowana platforma czatu AI",
      keywords:
        "niecenzurowana AI, czat AI, GPT-4, Claude, Gemini, modele AI, bez filtrów, szczera AI, rozmowy AI",
    },
    aboutUs: {
      title: "O nas - {{appName}}",
      category: "O nas",
      description:
        "Dowiedz się o misji {{appName}}, aby zapewnić niecenzurowane rozmowy AI",
      imageAlt: "O {{appName}}",
      keywords: "o {{appName}}, niecenzurowana AI, misja AI, wartości AI",
      ogTitle: "O {{appName}} - Niecenzurowana platforma AI",
      ogDescription:
        "Odkryj naszą misję demokratyzacji dostępu do niecenzurowanej AI",
      twitterTitle: "O {{appName}}",
      twitterDescription:
        "Dowiedz się o naszej misji niecenzurowanych rozmów AI",
    },
    privacyPolicy: {
      title: "Polityka prywatności - {{appName}}",
      category: "Prawne",
      description:
        "Dowiedz się, jak {{appName}} chroni Twoją prywatność i obsługuje Twoje dane",
      imageAlt: "Polityka prywatności",
      keywords:
        "polityka prywatności, ochrona danych, prywatność użytkownika, {{appName}} prywatność",
    },
    termsOfService: {
      title: "Warunki korzystania z usługi - {{appName}}",
      category: "Prawne",
      description: "Przeczytaj warunki korzystania z {{appName}}",
      imageAlt: "Warunki korzystania z usługi",
      keywords:
        "warunki korzystania z usługi, regulamin, umowa użytkownika, {{appName}} warunki",
    },
    imprint: {
      title: "Informacje prawne - {{appName}}",
      category: "Prawne",
      description: "Informacje prawne i dane firmy dla {{appName}}",
      imageAlt: "Informacje prawne",
      keywords: "informacje prawne, dane firmy, {{appName}} prawne",
    },
    careers: {
      title: "Kariera - {{appName}}",
      category: "Kariera",
      description:
        "Dołącz do naszego zespołu i pomóż budować przyszłość niecenzurowanej AI",
      imageAlt: "Kariera w {{appName}}",
      keywords: "kariera, praca, praca AI, praca zdalna, kariera {{appName}}",
    },
    pricing: {
      title: "Cennik - {{appName}}",
      category: "Cennik",
      description:
        "Przystępne plany czatu AI dla wszystkich. Zacznij za darmo z 10 dziennymi wiadomościami.",
      imageAlt: "Plany cenowe",
      keywords:
        "cennik, plany, subskrypcja, cennik czatu AI, cennik {{appName}}",
      ogTitle: "Plany cenowe - {{appName}}",
      ogDescription: "Proste, przejrzyste ceny dla niecenzurowanego czatu AI",
      twitterTitle: "Cennik - {{appName}}",
      twitterDescription: "Zacznij za darmo z 10 dziennymi wiadomościami",
    },
    billing: {
      category: "Rozliczenia",
    },
    notFound: {
      title: "404 - Strona nie znaleziona",
      category: "Błąd",
      description: "Strona, której szukasz, nie istnieje",
      imageAlt: "404 Nie znaleziono",
      keywords: "404, nie znaleziono, błąd",
    },
  },
  socialMedia: {
    platforms: {
      facebook: "Facebook",
      twitter: "Twitter",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      threads: "Threads",
      mastodon: "Mastodon",
      tiktok: "TikTok",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      whatsapp: "WhatsApp",
    },
  },
  layout: {
    metadata: {
      defaultTitle: "{{appName}} - Niecenzurowany czat AI",
      category: "Platforma czatu AI",
      description:
        "Doświadcz prawdziwie niecenzurowanych rozmów z AI z ponad {{modelCount}} modelami. Bez filtrów, bez ograniczeń, tylko szczera AI.",
    },
    openGraph: {
      imageAlt: "{{appName}} - Niecenzurowana platforma czatu AI",
    },
    structuredData: {
      organization: {
        types: {
          organization: "Organizacja",
          contactPoint: "Punkt kontaktowy",
        },

        contactPoint: {
          telephone: "{{config.group.contact.telephone}}",
          contactType: "Obsługa klienta",
        },
      },
    },
  },
  constants: {
    languages: {
      en: "English",
      de: "Deutsch",
      pl: "Polski",
    },
  },
};
