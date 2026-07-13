import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    error: {
      title: "Coś poszło nie tak!",
      message: "Przepraszamy, ale coś nieoczekiwanego się wydarzyło.",
      errorId: "ID błędu: {{id}}",
      error_message: "Błąd: {{message}}",
      stackTrace: "Ślad stosu: {{stack}}",
      tryAgain: "Spróbuj ponownie",
      backToHome: "Powrót do strony głównej",
    },
    notFound: {
      title: "Strona nie znaleziona",
      description: "Szukana strona nie istnieje lub została przeniesiona.",
      goBack: "Wróć",
      goHome: "Strona główna",
    },
  },
  meta: {
    title: "404 - Strona nie znaleziona",
    category: "Błąd",
    description: "Szukana strona nie istnieje",
    imageAlt: "404 Nie znaleziono",
    keywords: "404, nie znaleziono, błąd",
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
