import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Buchhaltungsperioden",
    titleShort: "Perioden",
    description: "Alle Buchhaltungsperioden eines Unternehmens auflisten",
    companyId: {
      label: "Unternehmens-ID",
      description: "Unternehmen, dessen Perioden aufgelistet werden sollen",
      placeholder: "Unternehmens-UUID eingeben",
    },
    response: {
      periods: "Perioden",
      id: "ID",
      name: "Name",
      startDate: "Beginn",
      endDate: "Ende",
      status: "Status",
      closedAt: "Geschlossen am",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Unternehmens-ID",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Unzureichende Berechtigungen",
      },
      server: {
        title: "Serverfehler",
        description: "Perioden konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Perioden gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Perioden geladen",
      description: "Buchhaltungsperioden abgerufen",
    },
    widget: {
      loading: "Perioden werden geladen...",
      empty: "Keine Buchhaltungsperioden gefunden.",
      createButton: "Periode erstellen",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "Offen",
      CLOSED: "Geschlossen",
      LOCKED: "Gesperrt",
    },
  },
  title: "Periodenliste",
  description: "Buchhaltungsperioden auflisten",
  category: "Kontenplan",
  tag: "Periode",
};
