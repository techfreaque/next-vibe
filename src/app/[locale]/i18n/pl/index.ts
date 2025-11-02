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
  common: {
    logoPart1: "Unbottled",
    logoPart2: ".ai",
    appName: "Unbottled.ai",
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
    company: {
      name: "Unbottled.ai",
      legalForm: "Spółka z ograniczoną odpowiedzialnością (Sp. z o.o.)",
      registrationNumber: "REG-2024-UNBOTTLED-AI",
      address: {
        title: "Adres",
        street: "123 AI Innovation Drive",
        city: "San Francisco, CA 94105",
        country: "Stany Zjednoczone",
        addressIn1Line:
          "123 AI Innovation Drive, San Francisco, CA 94105, Stany Zjednoczone",
      },
      responsiblePerson: {
        name: "Dyrektor Generalny",
      },
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
