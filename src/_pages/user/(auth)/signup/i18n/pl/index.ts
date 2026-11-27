import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    failedToLoadBrowserIdentity:
      "Nie udało się załadować tożsamości przeglądarki. Proszę odświeżyć stronę.",
  },
  meta: {
    title: "Zarejestruj się: {{appName}}",
    description:
      "Załóż konto w {{appName}} i rozmawiaj z głównonurtowymi i niecenzurowanymi modelami AI. Darmowe kredyty w zestawie",
    category: "Uwierzytelnianie",
    imageAlt: "Rejestracja {{appName}}",
    keywords: "rejestracja, zarejestruj się, utwórz konto, {{appName}}",
    ogTitle: "Zarejestruj się w {{appName}}",
    ogDescription:
      "Dołącz do {{appName}} i rozmawiaj z głównonurtowymi i niecenzurowanymi modelami AI już dziś",
    twitterTitle: "Zarejestruj się w {{appName}}",
    twitterDescription: "Załóż konto i zacznij rozmawiać w {{appName}}",
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
