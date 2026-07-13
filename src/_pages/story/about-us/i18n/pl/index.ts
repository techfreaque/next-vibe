import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "O nas - {{appName}}",
    category: "O nas",
    description:
      "Dowiedz się o misji {{appName}} w zakresie niecenzurowanych rozmów z AI",
    imageAlt: "O {{appName}}",
    keywords: "o {{appName}}, niecenzurowana AI, misja AI, wartości AI",
    ogTitle: "O {{appName}} - Niecenzurowana platforma AI",
    ogDescription:
      "Odkryj naszą misję demokratyzacji dostępu do niecenzurowanej AI",
    twitterTitle: "O {{appName}}",
    twitterDescription:
      "Dowiedz się o naszej misji dotyczącej niecenzurowanych rozmów z AI",
  },
  hero: {
    subtitle:
      "{{modelCount}} modeli. {{skillCount}} umiejętności. ~{{toolCount}} narzędzi. SSH, e-mail, automatyzacja przeglądarki, zaplanowane zadania. Uruchom bezpłatnie na {{appName}} - lub hostuj samodzielnie.",
  },
  backToHome: "Powrót do strony głównej",
  title: "O {{appName}}",
  subtitle: "Pionierujemy niecenzurowane rozmowy z AI",
  description:
    "Mamy misję demokratyzacji dostępu do niecenzurowanej AI. Założona w {{foundedYear}}, {{appName}} zapewnia platformę, na której użytkownicy mogą prowadzić szczere, niefiltrowane rozmowy z najbardziej zaawansowanymi modelami AI na świecie.",
  values: {
    title: "Nasze wartości",
    description: "Zasady, które kierują wszystkim, co robimy w {{appName}}",
    excellence: {
      title: "Doskonałość",
      description:
        "Dążymy do doskonałości we wszystkim, co robimy, od wydajności naszej platformy po obsługę klienta.",
    },
    innovation: {
      title: "Innowacja",
      description:
        "Ciągle innowujemy, aby zapewnić Ci najnowsze modele AI i funkcje.",
    },
    integrity: {
      title: "Integralność",
      description:
        "Działamy z przejrzystością i uczciwością, szanując Twoją prywatność i dane.",
    },
    collaboration: {
      title: "Współpraca",
      description:
        "Współpracujemy z naszą społecznością, aby zbudować najlepszą platformę do czatu AI.",
    },
  },
  mission: {
    title: "Nasza misja",
    subtitle: "Demokratyzacja dostępu do niecenzurowanej AI",
    description:
      "Wierzymy, że AI powinno być dostępne dla każdego, bez cenzury ani ograniczeń. Naszą misją jest zapewnienie platformy, na której użytkownicy mogą prowadzić szczere rozmowy z AI.",
    vision: {
      title: "Nasza wizja",
      description:
        "Zostanie wiodącą na świecie platformą dla niecenzurowanych rozmów z AI, umożliwiając użytkownikom dostęp do najbardziej zaawansowanych modeli AI.",
    },
    approach: {
      title: "Nasze podejście",
      description:
        "Łączymy najnowocześniejszą technologię AI z filozofią zorientowaną na użytkownika, zapewniając prywatność, bezpieczeństwo i wolność słowa.",
    },
    commitment: {
      title: "Nasze zobowiązanie",
      description:
        "Zobowiązujemy się do utrzymania platformy, która szanuje prywatność użytkowników, zapewnia przejrzystą wycenę i oferuje wyjątkowe doświadczenia AI.",
    },
  },
  contact: {
    title: "Skontaktuj się",
    description: "Masz pytania lub opinie? Chętnie od Ciebie usłyszymy.",
    cta: "Skontaktuj się z nami",
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
