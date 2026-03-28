import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Warunki korzystania z usługi - unbottled.ai",
    category: "Prawne",
    description: "Przeczytaj warunki i zasady korzystania z unbottled.ai",
    imageAlt: "Warunki korzystania z usługi",
    keywords:
      "warunki korzystania z usługi, regulamin, umowa użytkownika, warunki unbottled.ai",
    ogTitle: "Warunki korzystania z usługi - unbottled.ai",
    ogDescription: "Przeczytaj warunki i zasady korzystania z unbottled.ai",
    twitterTitle: "Warunki korzystania z usługi - unbottled.ai",
    twitterDescription:
      "Przeczytaj warunki i zasady korzystania z unbottled.ai",
  },
  printAriaLabel: "Drukuj warunki korzystania z usługi",
  printButton: "Drukuj",
  title: "Warunki korzystania z usługi",
  lastUpdated: "Ostatnia aktualizacja: styczeń 2025",
  introduction:
    "Witamy w {{appName}}. Korzystając z naszej platformy czatu AI, zgadzasz się na niniejsze Warunki korzystania z usługi. Przeczytaj je uważnie.",
  sections: {
    agreement: {
      title: "Zgoda na warunki",
      content:
        "Uzyskując dostęp do {{appName}} lub korzystając z niego, zgadzasz się przestrzegać niniejszych Warunków korzystania z usługi.",
    },
    description: {
      title: "Opis usługi",
      content:
        "{{appName}} zapewnia dostęp do modeli czatu AI różnych dostawców. Oferujemy bezpłatne i płatne poziomy z różnymi funkcjami.",
    },
    subscriptions: {
      title: "Subskrypcje i rozliczenia",
      plans: {
        title: "Plany subskrypcji",
        content:
          "Oferujemy plan subskrypcji i pakiety kredytów. Pakiety kredytów nigdy nie wygasają, nawet po zakończeniu subskrypcji.",
      },
      billing: {
        title: "Rozliczenia",
        content:
          "Subskrypcje są rozliczane miesięcznie. Pakiety kredytów to jednorazowe zakupy, które nigdy nie wygasają. Akceptujemy karty kredytowe przez Stripe i kryptowaluty przez NowPayments.",
      },
      cancellation: {
        title: "Anulowanie",
        content:
          "Możesz anulować subskrypcję w dowolnym momencie. Anulowanie wchodzi w życie na koniec bieżącego okresu rozliczeniowego. Pakiety kredytów nie podlegają zwrotowi.",
      },
    },
    userAccounts: {
      title: "Konta użytkowników",
      creation: {
        title: "Tworzenie konta",
        content:
          "Musisz podać dokładne informacje podczas tworzenia konta. Jesteś odpowiedzialny za bezpieczeństwo swoich danych logowania.",
      },
      responsibilities: {
        title: "Obowiązki użytkownika",
        content:
          "Jesteś odpowiedzialny za wszystkie działania na swoim koncie. Nie możesz udostępniać konta innym osobom.",
      },
    },
    userContent: {
      title: "Treści użytkownika",
      ownership: {
        title: "Własność treści",
        content:
          "Zachowujesz wszystkie prawa do swoich rozmów i danych. Twoje prywatne foldery są dostępne tylko dla Ciebie.",
      },
      guidelines: {
        title: "Wytyczne dotyczące treści",
        intro:
          "Chociaż zapewniamy niescenzurowany dostęp do AI, nie możesz korzystać z usługi, aby:",
        items: {
          item1: "Angażować się w nielegalne działania",
          item2: "Nękać, grozić lub krzywdzić innych",
          item3: "Naruszać praw własności intelektualnej",
          item4: "Próbować hakować lub kompromitować platformę",
        },
      },
    },
    intellectualProperty: {
      title: "Własność intelektualna",
      content:
        "Platforma {{appName}}, w tym jej projekt, funkcje i kod, jest chroniona przepisami o własności intelektualnej.",
    },
    limitation: {
      title: "Ograniczenie odpowiedzialności",
      content:
        "{{appName}} nie ponosi odpowiedzialności za jakiekolwiek pośrednie, przypadkowe, specjalne lub wynikowe szkody wynikające z korzystania z usługi.",
    },
    indemnification: {
      title: "Odszkodowanie",
      content:
        "Zgadzasz się zabezpieczyć {{appName}} i jego podmioty powiązane przed wszelkimi roszczeniami, szkodami lub wydatkami wynikającymi z korzystania z usługi.",
    },
    termination: {
      title: "Rozwiązanie umowy",
      content:
        "Zastrzegamy sobie prawo do rozwiązania lub zawieszenia Twojego konta za naruszenie niniejszych warunków.",
    },
    changes: {
      title: "Zmiany warunków",
      content:
        "Możemy od czasu do czasu aktualizować niniejsze Warunki korzystania z usługi. Dalsze korzystanie z usługi po zmianach stanowi akceptację nowych warunków.",
    },
    governingLaw: {
      title: "Prawo właściwe",
      content:
        "Niniejsze Warunki korzystania z usługi podlegają przepisom prawa {{jurisdictionCountry}}. Wszelkie spory będą rozstrzygane w sądach {{jurisdictionCity}}, {{jurisdictionCountry}}.",
    },
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
