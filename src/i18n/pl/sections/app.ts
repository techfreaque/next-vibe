import type { appTranslations as EnglishAppTranslations } from "../../en/sections/app";

export const appTranslations: typeof EnglishAppTranslations = {
  title: "Centrum Usług Social Media",
  nav: {
    dashboard: "Panel",
    onboarding: "Wdrożenie",
    incomplete: "Niekompletne",
    admin: "Admin",
    social: "Media społecznościowe",
    socialBadge: "{{count}} Połączonych",
    consultation: "Konsultacja",
    scheduled: "Zaplanowane",
    subscription: "Subskrypcja",
    active: "Aktywna",
    analytics: "Analiza",
    help: "Pomoc",
    logout: "Wyloguj",
    openMenu: "Otwórz Menu",
    theme: "Motyw",
    completeOnboardingFirst: "Najpierw ukończ wdrożenie",
    services: {
      title: "Usługi",
    },
    account: {
      title: "Konto",
    },
    descriptions: {
      social:
        "Zarządzaj swoimi kontami i treściami w mediach społecznościowych",
      consultation: "Planuj i zarządzaj konsultacjami",
      analytics: "Przeglądaj wskaźniki skuteczności i spostrzeżenia",
      subscription: "Zarządzaj swoją subskrypcją i rozliczeniami",
      help: "Uzyskaj pomoc i wsparcie",
    },
  },
  user: {
    anonymous: "Użytkownik Anonimowy",
  },
  logout: {
    success: "Pomyślnie Wylogowano",
    description: "Zostałeś pomyślnie wylogowany",
    error: "Wylogowanie Nie Powiodło Się",
    errorDescription: "Nie udało się wylogować. Spróbuj ponownie.",
  },
  status: {
    error: "Błąd",
    onboardingIncomplete:
      "Ukończ wdrożenie, aby uzyskać dostęp do wszystkich funkcji",
    completeOnboarding: "Ukończ Wdrożenie",
  },
};
