export const translations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    skill: "Skill",
  },

  patch: {
    title: "Lead-Skill setzen",
    description: "Skill-Attribution für diesen Lead erfassen (First-Touch)",
    skillId: {
      label: "Skill-ID",
      description:
        "UUID des Custom-Skills, der diesem Lead zugeordnet werden soll",
    },
    errors: {
      validation: {
        title: "Ungültige Skill-ID",
        description: "Muss eine gültige UUID eines Custom-Skills sein",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar. Bitte erneut versuchen.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Du musst angemeldet sein.",
      },
      forbidden: {
        title: "Keine Berechtigung",
        description:
          "Du hast keine Berechtigung, diesen Lead zu aktualisieren.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der Lead wurde nicht gefunden.",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein interner Fehler ist aufgetreten. Bitte erneut versuchen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Du hast nicht gespeicherte Änderungen.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten.",
      },
    },
    success: {
      title: "Skill zugeordnet",
      description: "Der Skill wurde für diesen Lead gespeichert.",
    },
  },
};
