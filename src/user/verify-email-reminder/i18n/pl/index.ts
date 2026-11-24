import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",

  post: {
    title: "Przypomnienie o potwierdzeniu e-maila",
    titleShort: "Przypomnienie",
    description:
      "Wysyła jedno przypomnienie kontom, które 24 godziny po rejestracji nie potwierdziły e-maila. Darmowe kredyty wymagają potwierdzonego adresu.",
    tag: "Przypomnienie",
    container: {
      title: "Przypomnienie o potwierdzeniu e-maila",
      description: "Niepotwierdzone konta założone 24-25 godzin temu",
    },
    fields: {
      batchSize: {
        label: "Rozmiar partii",
        description: "Maksymalna liczba przypomnień na uruchomienie",
      },
      dryRun: {
        label: "Próba",
        description: "Tylko policz, kto dostałby przypomnienie, bez wysyłki",
      },
    },
    response: {
      candidates: "Niepotwierdzone konta w oknie",
      sent: "Wysłane przypomnienia",
      skipped: "Pominięte",
      failed: "Nieudane",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Tylko administrator może wysyłać przypomnienia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wysyłka przypomnień nie powiodła się",
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
      description: "Przypomnienia o potwierdzeniu e-maila przetworzone",
    },
  },
  task: {
    name: "Przypomnienie o potwierdzeniu adresu e-mail",
    description:
      "Co godzinę: jedno przypomnienie dla kont niepotwierdzonych 24 godziny po rejestracji",
  },
};
