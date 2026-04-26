export const translations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "Abonnieren & Zugang erhalten",
    description:
      "Trage deine Daten ein, um der Liste des Erstellers beizutreten und Zugang zu diesem Skill zu erhalten",
    groups: {
      main: {
        title: "Zugang erhalten",
        description: "Trage deine Daten ein",
      },
    },
    fields: {
      skillId: {
        label: "Skill",
        description: "Das Skill, für das du dich anmeldest",
      },
      firstName: {
        label: "Vorname",
        description: "Dein Vorname",
        placeholder: "z.B. Alex",
      },
      email: {
        label: "E-Mail-Adresse",
        description: "Deine E-Mail-Adresse",
        placeholder: "du@example.com",
      },
    },
    response: {
      captured: "Eingetragen",
      nextStep: "Nächster Schritt",
      signupUrl: "Registrierungs-URL",
    },
    success: {
      title: "Du bist dabei!",
      description:
        "Schau in dein Postfach - und melde dich an, um das Skill zu nutzen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Bitte überprüfe deine Eingabe",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Nicht angemeldet",
      },
      forbidden: { title: "Kein Zugriff", description: "Kein Zugriff" },
      notFound: {
        title: "Nicht gefunden",
        description: "Skill nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen",
      },
      internal: {
        title: "Serverfehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
  },
};
