import { translations as componentsTranslations } from "../../_components/i18n/pl";
import { translations as notFoundTranslations } from "../../[...notFound]/i18n/pl";
import { translations as adminTranslations } from "../../admin/i18n/pl";
import { translations as chatTranslations } from "../../chat/i18n/pl";
import { translations as helpTranslations } from "../../help/i18n/pl";
import { translations as siteTranslations } from "../../story/i18n/pl";
import { translations as subscriptionTranslations } from "../../subscription/i18n/pl";
import { translations as trackTranslations } from "../../track/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  _components: componentsTranslations,
  story: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  help: helpTranslations,
  subscription: subscriptionTranslations,
  track: trackTranslations,
  user: userTranslations,
  currency: {
    usd: "USD",
    eur: "EUR",
    gbp: "GBP",
    jpy: "JPY",
    chf: "CHF",
    cad: "CAD",
    aud: "AUD",
    cny: "CNY",
    inr: "INR",
    brl: "BRL",
  },
  language: {
    english: "Angielski",
    german: "Niemiecki",
    french: "Francuski",
    spanish: "Hiszpański",
    italian: "Włoski",
    portuguese: "Portugalski",
    dutch: "Holenderski",
    russian: "Rosyjski",
    chinese: "Chiński",
    japanese: "Japoński",
    korean: "Koreański",
    arabic: "Arabski",
    hindi: "Hindi",
  },
  country: {
    united_states: "Stany Zjednoczone",
    canada: "Kanada",
    united_kingdom: "Wielka Brytania",
    germany: "Niemcy",
    france: "Francja",
    italy: "Włochy",
    spain: "Hiszpania",
    netherlands: "Holandia",
    switzerland: "Szwajcaria",
    austria: "Austria",
    belgium: "Belgia",
    sweden: "Szwecja",
    norway: "Norwegia",
    denmark: "Dania",
    finland: "Finlandia",
    australia: "Australia",
    new_zealand: "Nowa Zelandia",
    japan: "Japonia",
    south_korea: "Korea Południowa",
    china: "Chiny",
    india: "Indie",
    brazil: "Brazylia",
    mexico: "Meksyk",
    argentina: "Argentyna",
  },
  timezone: {
    utc: "UTC",
    eastern: "Eastern Time (ET)",
    central: "Central Time (CT)",
    mountain: "Mountain Time (MT)",
    pacific: "Pacific Time (PT)",
    london: "Londyn (GMT)",
    paris: "Paryż (CET)",
    berlin: "Berlin (CET)",
    rome: "Rzym (CET)",
    madrid: "Madryt (CET)",
    amsterdam: "Amsterdam (CET)",
    zurich: "Zurych (CET)",
    tokyo: "Tokio (JST)",
    shanghai: "Szanghaj (CST)",
    seoul: "Seul (KST)",
    sydney: "Sydney (AEDT)",
    auckland: "Auckland (NZDT)",
    mumbai: "Mumbai (IST)",
  },
  newsletter: {
    title: "Bądź na bieżąco",
    description:
      "Zapisz się do naszego newslettera, aby otrzymywać najnowsze aktualizacje i informacje.",
    emailPlaceholder: "Wprowadź adres e-mail",
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
        "niecenzurowana AI, czat AI, GPT-4, Claude, Gemini, modele AI, bez filtrów, szczera AI, rozmowy z AI",
    },
    aboutUs: {
      title: "O nas - {{appName}}",
      category: "O nas",
      description:
        "Poznaj misję {{appName}} dostarczania niecenzurowanych rozmów z AI",
      imageAlt: "O {{appName}}",
      keywords: "o {{appName}}, niecenzurowana AI, misja AI, wartości AI",
      ogTitle: "O {{appName}} - Niecenzurowana platforma AI",
      ogDescription:
        "Odkryj naszą misję demokratyzacji dostępu do niecenzurowanej AI",
      twitterTitle: "O {{appName}}",
      twitterDescription: "Poznaj naszą misję niecenzurowanych rozmów z AI",
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
      title: "Warunki korzystania - {{appName}}",
      category: "Prawne",
      description: "Przeczytaj warunki korzystania z {{appName}}",
      imageAlt: "Warunki korzystania",
      keywords:
        "warunki korzystania, warunki, umowa użytkownika, {{appName}} warunki",
    },
    imprint: {
      title: "Informacje prawne - {{appName}}",
      category: "Prawne",
      description: "Informacje prawne i szczegóły firmy dla {{appName}}",
      imageAlt: "Informacje prawne",
      keywords:
        "imprint, informacje prawne, informacje o firmie, {{appName}} prawne",
    },
    careers: {
      title: "Kariera - {{appName}}",
      category: "Kariera",
      description:
        "Dołącz do naszego zespołu i pomóż budować przyszłość niecenzurowanej AI",
      imageAlt: "Kariera w {{appName}}",
      keywords: "kariera, praca, praca AI, praca zdalna, {{appName}} kariera",
    },
    pricing: {
      title: "Cennik - {{appName}}",
      category: "Cennik",
      description:
        "Przystępne plany czatu AI dla każdego. Zacznij za darmo z 10 codziennymi wiadomościami.",
      imageAlt: "Plany cenowe",
      keywords:
        "cennik, plany, subskrypcja, cennik czatu AI, {{appName}} cennik",
      ogTitle: "Plany cenowe - {{appName}}",
      ogDescription: "Prosty, przejrzysty cennik dla niecenzurowanego czatu AI",
      twitterTitle: "Cennik - {{appName}}",
      twitterDescription: "Zacznij za darmo z 10 codziennymi wiadomościami",
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
  native: {
    page: {
      welcome: "Witamy w {{appName}}",
      description: "Zunifikowana aplikacja Next.js i React Native",
      locale: {
        title: "Aktualny język",
        description: "Twoje obecne ustawienia języka i regionu",
      },
      features: {
        title: "Funkcje platformy",
        description:
          "Ta strona działa zarówno w internecie, jak i na urządzeniach mobilnych",
        unified: {
          title: "✅ Zunifikowane komponenty",
          description:
            "Używanie komponentów next-vibe-ui, które działają płynnie na wszystkich platformach",
        },
        types: {
          title: "✅ Bezpieczeństwo typów",
          description:
            "Pełne wsparcie TypeScript z prawidłową inferencją typów",
        },
        async: {
          title: "✅ Asynchroniczne komponenty serwera",
          description:
            "Asynchroniczne komponenty stron Next.js 15 działają w React Native",
        },
      },
      links: {
        chat: "Przejdź do czatu",
        help: "Przejdź do pomocy",
        about: "O nas",
        story: "Nasza Historia",
        designTest: "Test Projektu",
      },
      status: {
        title: "Status systemu",
        platform: "Platforma",
        universal: "Uniwersalna",
        routing: "Routing",
        filebased: "Oparty na plikach",
        styling: "Stylizacja",
        nativewind: "NativeWind",
      },
    },
  },
  common: {
    active: "Aktywny",
    filter: "Filtruj",
    refresh: "Odśwież",
    notAvailable: "N/D",
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
        previousPage: "Poprzednia strona",
        nextPage: "Następna strona",
        more: "Więcej",
        close: "Zamknij",
      },
    },
    actions: {
      previous: "Poprzedni",
      next: "Następny",
    },
    searchCountries: "Szukaj krajów",
    noCountryFound: "Nie znaleziono kraju",
    preferred: "Preferowane",
    allCountries: "Wszystkie kraje",
    enterPhoneNumber: "Wprowadź numer telefonu",
    selectDate: "Wybierz datę",
    unknownFieldType: "Nieznany typ pola",
    required: "Wymagane",
    addTags: "Dodaj tagi",
    addCustomValue: "Dodaj '{{value}}'",
    selectOption: "Wybierz opcję",
    searchOptions: "Szukaj opcji",
    customValue: "Wartość niestandardowa",
    noOptionsFound: "Nie znaleziono opcji",
    useCustomValue: "Użyj wartości niestandardowej",
    cancel: "Anuluj",
    countries: {
      global: "Globalny",
      de: "Niemcy",
      pl: "Polska",
      us: "Stany Zjednoczone",
    },
    languages: {
      en: "Angielski",
      de: "Niemiecki",
      pl: "Polski",
    },
    error: {
      title: "Błąd",
      message: "Coś poszło nie tak",
      description: "Wystąpił błąd. Spróbuj ponownie.",
      tryAgain: "Spróbuj ponownie",
      sending_sms: "Nie udało się wysłać SMS",
      boundary: {
        stackTrace: "Ślad stosu",
        componentStack: "Stos komponentów",
        errorDetails: "Szczegóły błędu",
        name: "Nazwa:",
        errorMessage: "Wiadomość:",
        cause: "Przyczyna:",
      },
    },
    errors: {
      unknown: "Wystąpił nieznany błąd",
    },
    api: {
      notifications: {
        welcome: {
          title: "Witaj!",
          description: "Dziękujemy za dołączenie. Zaczynajmy!",
        },
      },
    },
  },
  shared: {
    error: {
      title: "Błąd",
      userError: "Wystąpił błąd użytkownika",
      invalidToken: "Nieprawidłowy lub wygasły token",
    },
  },
  ui: {
    iconPicker: {
      title: "Wybierz ikonę",
      selectIcon: "Wybierz ikonę",
      searchPlaceholder: "Szukaj ikon...",
      showing: "Pokazuje {{count}} z {{total}} ikon",
      categories: {
        all: "Wszystkie",
        general: "Ogólne",
        ai: "AI i Technologia",
        education: "Edukacja",
        communication: "Komunikacja",
        science: "Nauka",
        arts: "Sztuka",
        finance: "Finanse",
        lifestyle: "Styl życia",
        security: "Bezpieczeństwo",
        programming: "Programowanie",
        platforms: "Platformy",
        aiProviders: "Dostawcy AI",
        media: "Media",
        special: "Specjalne",
        navigation: "Nawigacja",
        ui: "UI i Sterowanie",
      },
    },
    countries: {
      global: "Globalny",
      de: "Niemcy",
      pl: "Polska",
      us: "Stany Zjednoczone",
    },
    languages: {
      en: "Angielski",
      de: "Niemiecki",
      pl: "Polski",
    },
    error: {
      title: "Błąd",
      message: "Coś poszło nie tak",
      description: "Wystąpił błąd. Spróbuj ponownie.",
      tryAgain: "Spróbuj ponownie",
      sending_sms: "Nie udało się wysłać SMS-a",
      boundary: {
        stackTrace: "Ślad stosu",
        componentStack: "Stos komponentów",
        errorDetails: "Szczegóły błędu",
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
};
