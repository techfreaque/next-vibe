import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  generate: {
    post: {
      title: "Generuj trasy TanStack",
      description:
        "Generuj wrappery kompatybilności TanStack Router dla stron Next.js",
      response: {
        fields: {
          success: "Sukces",
          created: "Utworzone pliki",
          skipped: "Pominięte pliki",
          errors: "Błędy",
          message: "Wiadomość",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do wykonania tej akcji",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd podczas generowania tras",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wykonania tej akcji",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono katalogu źródłowego",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt",
        },
      },
      success: {
        title: "Sukces",
        description:
          "Wygenerowano {{created}} plików, pominięto {{skipped}} plików, {{errors}} błędów",
      },
    },
  },
};
