import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Kariera - {{appName}}",
    category: "Kariera",
    description:
      "Dołącz do naszego zespołu i pomóż budować przyszłość niecenzurowanej AI",
    imageAlt: "Kariera w {{appName}}",
    keywords: "kariera, praca, praca w AI, praca zdalna, kariera w {{appName}}",
    ogTitle: "Kariera - {{appName}}",
    ogDescription:
      "Dołącz do naszego zespołu i pomóż budować przyszłość niecenzurowanej AI",
    twitterTitle: "Kariera - {{appName}}",
    twitterDescription:
      "Dołącz do naszego zespołu i pomóż budować przyszłość niecenzurowanej AI",
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
