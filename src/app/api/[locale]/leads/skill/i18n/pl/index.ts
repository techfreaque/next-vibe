export const translations = {
  category: "Leady",
  tags: {
    leads: "Leady",
    skill: "Skill",
  },

  patch: {
    title: "Ustaw skill leada",
    description: "Zapisz atrybucję skillu dla tego leada (first-touch)",
    skillId: {
      label: "ID Skillu",
      description: "UUID niestandardowego skillu do przypisania temu leadowi",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe ID skillu",
        description: "Musi być prawidłowym UUID niestandardowego skillu",
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
  },
};
