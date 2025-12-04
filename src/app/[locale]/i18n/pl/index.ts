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
  ...componentsTranslations,
  story: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  help: helpTranslations,
  subscription: subscriptionTranslations,
  track: trackTranslations,
  user: userTranslations,
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
