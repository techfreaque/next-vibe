import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "umiejętności",
  },
  patch: {
    title: "Opublikuj umiejętność",
    description:
      "Opublikuj lub cofnij publikację umiejętności. PUBLISHED czyni ją widoczną w sklepie społeczności.",
    dynamicTitle: "Publikuj: {{name}}",
    status: {
      label: "Status",
      description:
        "PUBLISHED dla widoczności w sklepie, DRAFT aby ukryć, UNLISTED dla dostępu przez link.",
    },
    changeNote: {
      label: "Notatka o zmianach",
      description: "Opcjonalna notatka opisująca zmiany w tej wersji.",
      placeholder: "np. Poprawiono jasność instrukcji systemowej",
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
        description: "Musisz być zalogowany aby opublikować",
      },
      forbidden: {
        title: "Zabronione",
        description: "Możesz publikować tylko własne umiejętności",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Umiejętność nie znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas publikacji",
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
      title: "Umiejętność opublikowana",
      description:
        "Twoja umiejętność jest teraz widoczna w sklepie społeczności",
    },
    response: {
      status: { content: "Status" },
      publishedAt: { content: "Opublikowano" },
    },
    backButton: {
      label: "Wstecz",
    },
    button: {
      submit: "Zapisz status",
      loading: "Zapisywanie...",
    },
  },
};
