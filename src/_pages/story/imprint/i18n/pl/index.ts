import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Stopka redakcyjna - {{appName}}",
    category: "Prawne",
    description: "Nota prawna i dane usługodawcy {{appName}}",
    imageAlt: "Stopka redakcyjna",
    keywords:
      "stopka redakcyjna, nota prawna, informacje o usługodawcy, {{appName}} prawne",
    ogTitle: "Stopka redakcyjna - {{appName}}",
    ogDescription: "Nota prawna i dane usługodawcy {{appName}}",
    twitterTitle: "Stopka redakcyjna - {{appName}}",
    twitterDescription: "Nota prawna i dane usługodawcy {{appName}}",
  },
  printAriaLabel: "Drukuj stopkę",
  onThisPage: "Na tej stronie",
  printButton: "Drukuj",
  title: "Nota prawna",
  lastUpdated: "Ostatnia aktualizacja: listopad 2026",
  introduction:
    "Niniejsza stopka redakcyjna zawiera informacje wymagane przez prawo dotyczące {{appName}} zgodnie z obowiązującymi przepisami.",
  sections: {
    companyInfo: {
      title: "Usługodawca",
      description: "Serwis {{appName}} prowadzi:",
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
        "Nie jesteśmy zobowiązani ani gotowi do udziału w postępowaniu w sprawie pozasądowego rozwiązywania sporów przed konsumenckim organem polubownym.",
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
