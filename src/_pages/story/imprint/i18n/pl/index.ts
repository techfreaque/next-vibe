import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Stopka redakcyjna - {{appName}}",
    category: "Prawne",
    description: "Informacje prawne i dane firmy {{appName}}",
    imageAlt: "Stopka redakcyjna",
    keywords:
      "stopka redakcyjna, nota prawna, informacje o firmie, {{appName}} prawne",
    ogTitle: "Stopka redakcyjna - {{appName}}",
    ogDescription: "Informacje prawne i dane firmy {{appName}}",
    twitterTitle: "Stopka redakcyjna - {{appName}}",
    twitterDescription: "Informacje prawne i dane firmy {{appName}}",
  },
  printAriaLabel: "Drukuj stopkę",
  printButton: "Drukuj",
  title: "Nota prawna",
  lastUpdated: "Ostatnia aktualizacja: styczeń 2025",
  introduction:
    "Niniejsza stopka redakcyjna zawiera informacje wymagane przez prawo dotyczące {{appName}} zgodnie z obowiązującymi przepisami.",
  sections: {
    partnerships: {
      title: "Partnerstwa i stowarzyszenia",
      description:
        "Informacje o naszych partnerstwach i stowarzyszeniach biznesowych.",
      content:
        "{{appName}} utrzymuje partnerstwa z wiodącymi dostawcami AI, aby zapewnić naszym użytkownikom najlepszą możliwą usługę.",
    },
    companyInfo: {
      title: "Informacje o firmie",
      description:
        "Informacje prawne o {{appName}} i naszej zarejestrowanej jednostce biznesowej.",
    },
    responsiblePerson: {
      title: "Osoba odpowiedzialna",
      description:
        "Informacje o osobie odpowiedzialnej za treść tej strony internetowej.",
    },
    contactInfo: {
      title: "Informacje kontaktowe",
      description:
        "Jak się z nami skontaktować w sprawach prawnych i biznesowych.",
    },
    disclaimer: {
      title: "Zastrzeżenie",
      copyright: {
        title: "Prawa autorskie",
        content:
          "Wszystkie treści na tej stronie są chronione prawem autorskim. Nieautoryzowane użycie jest zabronione.",
      },
      liability: {
        title: "Odpowiedzialność",
        content:
          "Nie składamy żadnych oświadczeń ani gwarancji dotyczących kompletności, dokładności ani wiarygodności informacji na tej stronie.",
      },
      links: {
        title: "Linki zewnętrzne",
        content:
          "Nasza strona może zawierać linki do zewnętrznych witryn. Nie ponosimy odpowiedzialności za treść zewnętrznych stron internetowych.",
      },
    },
    disputeResolution: {
      title: "Rozwiązywanie sporów",
      description:
        "Informacje o sposobie rozpatrywania i rozwiązywania sporów.",
      content:
        "Wszelkie spory wynikające z korzystania z tej strony będą rozstrzygane zgodnie z obowiązującym prawem.",
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
