import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "umiejętności",
  },
  post: {
    title: "Głosuj na umiejętność",
    titleShort: "Zagłosuj",
    description:
      "Głosuj za lub przeciw umiejętności społeczności. Ten sam kierunek usuwa głos; przeciwny go odwraca.",
    dynamicTitle: "Głosowanie: {{name}}",
    direction: {
      label: "Kierunek",
      description: "Kierunek głosu: w górę (pomocne) lub w dół.",
      up: "Głos za",
      down: "Głos przeciw",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany aby głosować",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie możesz głosować na tę umiejętność",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Umiejętność nie znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas przetwarzania głosu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
    },
    success: {
      title: "Głos zapisany",
      description: "Twój głos został zaktualizowany",
    },
    response: {
      userVote: { content: "Twój głos" },
      voteCount: { content: "Wynik" },
      upCount: { content: "Głosy za" },
      downCount: { content: "Głosy przeciw" },
      trustLevel: { content: "Poziom zaufania" },
    },
    backButton: {
      label: "Wstecz",
    },
    button: {
      vote: "Głosuj za",
      unvote: "Usuń głos",
      loading: "Zapisywanie...",
    },
    badge: {
      verified: "Zweryfikowano",
    },
  },
};
