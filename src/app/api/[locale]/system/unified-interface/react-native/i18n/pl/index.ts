import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam: "Brak parametru URL",
    urlConstructionFailed: "Konstrukcja URL nie powiodła się",
    validationFailed: "Walidacja nie powiodła się",
    htmlResponseReceived: "Otrzymano odpowiedź HTML zamiast JSON",
    networkError: "Wystąpił błąd sieci",
    failedToLoadPage: "Nie udało się załadować strony",
  },
  generate: {
    post: {
      title: "Generuj indeksy Expo",
      description:
        "Generuj wrappery kompatybilności Expo Router dla stron Next.js",
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
          description: "Wystąpił błąd podczas generowania indeksów",
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
