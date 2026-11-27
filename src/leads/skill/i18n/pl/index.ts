import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "Leady",
  tags: {
    leads: "Leady",
    skill: "Skill",
  },

  patch: {
    title: "Ustaw skill leada",
    titleShort: "Skill leada",
    description: "Zapisz atrybucję skillu dla tego leada (first-touch)",
    skillId: {
      label: "Umiejętność",
      description: "Wybierz opublikowaną umiejętność społeczności.",
    },
    errors: {
      validation: {
        title: "Wybierz umiejętność",
        description: "Wybierz opublikowaną umiejętność społeczności.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem. Spróbuj ponownie.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany.",
      },
      forbidden: {
        title: "Brak uprawnień",
        description: "Nie masz uprawnień do aktualizacji tego leada.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Lead nie został znaleziony.",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny. Spróbuj ponownie.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt.",
      },
    },
    success: {
      title: "Skill przypisany",
      description: "Skill został zapisany dla tego leada.",
    },
    skipped: {
      title: "Nie zapisano",
      description:
        "Pierwsza umiejętność tego użytkownika pozostaje zapisana. Sprawdź inną w nowej sesji.",
    },
    submit: "Przypisz skill",
  },
};
