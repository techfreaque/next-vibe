import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Alle Kampagnen stoppen",
  description: "Alle aktiven E-Mail-Kampagnen stoppen",
  post: {
    title: "Alle Kampagnen stoppen",
    description:
      "Alle aktiven E-Mail-Kampagnen sofort stoppen und ausstehende Sendungen abbrechen",
    fields: {
      confirm: {
        label: "Stopp bestätigen",
        description:
          "Aktivieren Sie diese Option, um das Stoppen aller Kampagnen zu bestätigen",
      },
      reason: {
        label: "Grund",
        description: "Grund für das Stoppen (optional)",
      },
    },
    response: {
      halted: "Gestoppte Kampagnen",
      emailsCancelled: "Abgebrochene E-Mails",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Muss Administrator sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Kampagnen konnten nicht gestoppt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Bestätigung muss aktiviert sein",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Kampagnen gestoppt",
      description: "Alle Kampagnen wurden erfolgreich gestoppt",
    },
  },
};
