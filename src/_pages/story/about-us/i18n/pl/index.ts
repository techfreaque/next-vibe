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
    eyebrow: "O {{appName}}",
    title: "AI, która słucha Ciebie.",
    subtitle:
      "{{modelCount}} modeli. {{skillCount}} skilli. ~{{toolCount}} narzędzi. SSH, e-mail, automatyzacja przeglądarki, zadania cykliczne. Za darmo na {{appName}} - albo na własnym serwerze.",
    ctaPrimary: "Zacznij rozmowę",
    ctaSecondary: "Czytaj build log",
  },
  stats: {
    models: "modeli AI",
    skills: "skilli",
    tools: "narzędzi",
    founded: "rok założenia",
  },
  backToHome: "Powrót do strony głównej",
  title: "O {{appName}}",
  subtitle: "Pionierzy nieocenzurowanych rozmów z AI",
  description:
    "Od {{foundedYear}} roku {{appName}} daje Ci najlepsze modele AI na świecie - bez działu polityk, który decyduje, o co wolno Ci zapytać. Ty wybierasz model. Ty ustawiasz filtr.",
  values: {
    title: "Tu nie idziemy na kompromisy",
    description: "Cztery zasady, które musi spełnić każda funkcja {{appName}}.",
    excellence: {
      title: "Ty wybierasz filtr",
      description:
        "Modele mainstreamowe, otwarte albo bez cenzury. Poziom ustawiasz dla każdej rozmowy. Nikt nie decyduje za Ciebie.",
    },
    innovation: {
      title: "W całości open source",
      description:
        "{{appName}} działa na next-vibe - open source na GitHubie. Czytaj kod, forkuj, uruchamiaj na własnym sprzęcie.",
    },
    integrity: {
      title: "Prywatność domyślnie",
      description:
        "Tryb incognito trzyma rozmowy na Twoim urządzeniu. Twoje dane są Twoje - nie są produktem na sprzedaż.",
    },
    collaboration: {
      title: "Budujemy publicznie",
      description:
        "Roadmapa, decyzje architektoniczne i ślepe zaułki - wszystko na blogu. Twój feedback staje się funkcjami.",
    },
  },
  mission: {
    title: "Twoje AI. Twoje zasady.",
    subtitle: "Nieocenzurowane AI dla każdego",
    description:
      "Każdy duży dostawca AI filtruje, o co możesz zapytać - a zasad nigdy nie widzisz. Uważamy, że dorośli potrafią decydować sami. Dlatego {{appName}} zbiera każdy model i każdy poziom filtra w jednym miejscu - i oddaje Ci przełącznik.",
    vision: {
      title: "Wizja",
      description:
        "Jeden dom dla każdego poważnego modelu AI - mainstreamowego, otwartego i bez cenzury - w którym to Ty ustalasz granice.",
    },
    approach: {
      title: "Podejście",
      description:
        "Szybko dostarczać najlepsze modele, dawać im prawdziwe narzędzia - wyszukiwanie, pamięć, automatyzację - i traktować prywatność jako standard, nie dopłatę.",
    },
    commitment: {
      title: "Zobowiązanie",
      description:
        "Przejrzyste ceny. Zero dark patterns. Platforma, którą możesz opuścić w każdej chwili - stawiając u siebie dokładnie ten sam kod.",
    },
  },
  contact: {
    title: "Pytania? Napisz do nas.",
    description:
      "Feedback, partnerstwa, prasa, bugi - każdą wiadomość czyta człowiek.",
    cta: "Napisz do nas",
    selfHost: "Postaw u siebie",
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
