import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  passwordStrength: {
    label: "Siła hasła",
    weak: "Słabe",
    fair: "Wystarczające",
    good: "Dobre",
    strong: "Silne",
    requirement: {
      minLength: {
        icon: "✗",
        text: "Co najmniej 8 znaków",
      },
      uppercase: {
        icon: "✗",
        text: "Co najmniej jedna wielka litera",
      },
      lowercase: {
        icon: "✗",
        text: "Co najmniej jedna mała litera",
      },
      number: {
        icon: "✗",
        text: "Co najmniej jedna cyfra",
      },
      special: {
        icon: "!",
        text: "Znak specjalny (opcjonalny, poprawia siłę)",
      },
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
