export const translations = {
  post: {
    title: "Generate Email Templates",
    description: "Generate email template registry with lazy loading",
    container: {
      title: "Email Template Generator Configuration",
    },
    success: {
      title: "Generation Complete",
      description: "Email templates generated successfully",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path to generated registry file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview changes without writing files",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Result Message",
      },
      templatesFound: {
        title: "Templates Found",
      },
      duration: {
        title: "Generation Duration (ms)",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry generatora szablonów e-mail",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas generowania szablonów",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do generowania szablonów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Generowanie szablonów jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono katalogu szablonów",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wygenerować szablonów e-mail",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas generowania",
      },
    },
  },
  success: {
    generated: "Email template registry generated successfully",
  },
};
