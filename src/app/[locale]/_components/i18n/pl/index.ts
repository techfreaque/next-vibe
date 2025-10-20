import { translations as navTranslations } from "../../nav/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: navTranslations,
  common: {
    appName: "unbottled.ai",
    company: {
      name: "unbottled.ai",
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
      title: "unbottled.ai - Niecenzurowany czat AI",
      category: "Platforma czatu AI",
      description:
        "Doświadcz prawdziwie niecenzurowanych rozmów z AI z ponad 40 modelami. Bez filtrów, bez ograniczeń, tylko szczera AI.",
      imageAlt: "unbottled.ai - Niecenzurowana platforma czatu AI",
      keywords:
        "niecenzurowana AI, czat AI, GPT-4, Claude, Gemini, modele AI, bez filtrów, szczera AI, rozmowy AI",
    },
    aboutUs: {
      title: "O nas - Unbottled.ai",
      category: "O nas",
      description:
        "Dowiedz się o misji Unbottled.ai, aby zapewnić niecenzurowane rozmowy AI",
      imageAlt: "O Unbottled.ai",
      keywords: "o unbottled.ai, niecenzurowana AI, misja AI, wartości AI",
      ogTitle: "O Unbottled.ai - Niecenzurowana platforma AI",
      ogDescription:
        "Odkryj naszą misję demokratyzacji dostępu do niecenzurowanej AI",
      twitterTitle: "O Unbottled.ai",
      twitterDescription:
        "Dowiedz się o naszej misji niecenzurowanych rozmów AI",
    },
    privacyPolicy: {
      title: "Polityka prywatności - Unbottled.ai",
      category: "Prawne",
      description:
        "Dowiedz się, jak Unbottled.ai chroni Twoją prywatność i obsługuje Twoje dane",
      imageAlt: "Polityka prywatności",
      keywords:
        "polityka prywatności, ochrona danych, prywatność użytkownika, unbottled.ai prywatność",
    },
    termsOfService: {
      title: "Warunki korzystania z usługi - Unbottled.ai",
      category: "Prawne",
      description: "Przeczytaj warunki korzystania z Unbottled.ai",
      imageAlt: "Warunki korzystania z usługi",
      keywords:
        "warunki korzystania z usługi, regulamin, umowa użytkownika, unbottled.ai warunki",
    },
    imprint: {
      title: "Informacje prawne - Unbottled.ai",
      category: "Prawne",
      description: "Informacje prawne i dane firmy dla Unbottled.ai",
      imageAlt: "Informacje prawne",
      keywords: "informacje prawne, dane firmy, unbottled.ai prawne",
    },
    careers: {
      title: "Kariera - Unbottled.ai",
      category: "Kariera",
      description:
        "Dołącz do naszego zespołu i pomóż budować przyszłość niecenzurowanej AI",
      imageAlt: "Kariera w Unbottled.ai",
      keywords:
        "kariera, praca, praca AI, praca zdalna, kariera unbottled.ai",
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
      defaultTitle: "unbottled.ai - Niecenzurowany czat AI",
      category: "Platforma czatu AI",
      description:
        "Doświadcz prawdziwie niecenzurowanych rozmów z AI z ponad 40 modelami. Bez filtrów, bez ograniczeń, tylko szczera AI.",
    },
    openGraph: {
      imageAlt: "unbottled.ai - Niecenzurowana platforma czatu AI",
    },
    structuredData: {
      organization: {
        types: {
          organization: "Organizacja",
          contactPoint: "Punkt kontaktowy",
        },
        name: "unbottled.ai",
        contactPoint: {
          telephone: "+1-555-0123",
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
