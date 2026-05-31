import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Buchhaltungsperiode eröffnen",
    description: "Neue Buchhaltungsperiode für ein Unternehmen anlegen",
    companyId: {
      label: "Unternehmens-ID",
      description: "Unternehmen, für das die Periode eröffnet wird",
      placeholder: "Unternehmens-UUID",
    },
    name: {
      label: "Periodenname",
      description: "z.B. Januar 2026",
      placeholder: "Januar 2026",
    },
    startDate: {
      label: "Startdatum",
      description: "Beginn der Periode",
      placeholder: "",
    },
    endDate: {
      label: "Enddatum",
      description: "Ende der Periode",
      placeholder: "",
    },
    response: { id: "Perioden-ID", name: "Name" },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Start-/Enddaten prüfen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Unzureichende Berechtigungen",
      },
      server: {
        title: "Serverfehler",
        description: "Periode konnte nicht erstellt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Überschneidung",
        description: "Datumsbereich überschneidet sich mit bestehender Periode",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Unternehmen nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Periode erstellt",
      description: "Buchhaltungsperiode eröffnet",
    },
    widget: {
      viewButton: "Periode anzeigen",
      back: "Zurück",
    },
  },
  title: "Periode erstellen",
  description: "Neue Buchhaltungsperiode eröffnen",
  category: "Kontenplan",
  tag: "Periode",
};
