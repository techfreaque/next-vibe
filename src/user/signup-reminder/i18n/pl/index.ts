import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",

  post: {
    title: "Przypomnienie o rejestracji",
    titleShort: "Przypomnienie o rejestracji",
    description:
      "Wysyła jedno przypomnienie osobom, które zaczęły rejestrację, ale nie potwierdziły adresu e-mail. Przypomnienie zawiera nowy kod i link ważny 24 godziny.",
    tag: "Przypomnienie o rejestracji",
    container: {
      title: "Przypomnienie o rejestracji",
      description:
        "Niepotwierdzone rejestracje, ostatni e-mail 2 do 24 godzin temu",
    },
    fields: {
      batchSize: {
        label: "Rozmiar partii",
        description: "Maksymalna liczba przypomnień na przebieg",
      },
      dryRun: {
        label: "Próba",
        description: "Policz, kto dostałby przypomnienie, bez wysyłania",
      },
    },
    response: {
      candidates: "Niepotwierdzone rejestracje w oknie",
      sent: "Wysłane przypomnienia",
      skipped: "Pominięte",
      failed: "Nieudane",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description:
          "Tylko administrator może wysyłać przypomnienia o rejestracji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak dostępu",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wysłać przypomnień o rejestracji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ustawienia",
      },
    },
    success: {
      title: "Przypomnienia przetworzone",
      description: "Przypomnienia o rejestracji przetworzone",
    },
  },
  task: {
    name: "signup-reminder",
    description:
      "Co 30 minut: jedno przypomnienie dla rejestracji niepotwierdzonych 2 godziny po ostatnim e-mailu",
  },
};
