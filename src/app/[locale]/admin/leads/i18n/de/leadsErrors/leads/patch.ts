import type { translations as EnglishPatchTranslations } from "../../../en/leadsErrors/leads/patch";

export const translations: typeof EnglishPatchTranslations = {
  error: {
    validation: {
      title: "Lead-Update-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Lead-Updates und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Lead-Update nicht autorisiert",
      description: "Sie haben keine Berechtigung, Leads zu aktualisieren",
    },
    server: {
      title: "Lead-Update Serverfehler",
      description:
        "Lead konnte aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Lead-Update fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Aktualisieren des Leads ist aufgetreten",
    },
    not_found: {
      title: "Lead nicht gefunden",
      description: "Der zu aktualisierende Lead konnte nicht gefunden werden",
    },
    forbidden: {
      title: "Lead-Update verboten",
      description: "Sie haben keine Berechtigung, diesen Lead zu aktualisieren",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Lead konnte aufgrund eines Netzwerkfehlers nicht aktualisiert werden",
    },
    unsaved_changes: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen werden",
    },
    conflict: {
      title: "Datenkonflikt",
      description: "Die Lead-Daten wurden von einem anderen Benutzer geändert",
    },
  },
  success: {
    title: "Lead aktualisiert",
    description: "Lead-Informationen erfolgreich aktualisiert",
  },
};
