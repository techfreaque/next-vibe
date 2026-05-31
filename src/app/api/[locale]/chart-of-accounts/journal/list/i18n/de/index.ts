import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Buchungsjournal",
    description:
      "Buchungen nach Unternehmen, Periode, Status, Quelle und Datum filtern",
    companyId: {
      label: "Unternehmens-ID",
      description: "Nach Unternehmen filtern",
      placeholder: "Unternehmens-UUID",
    },
    periodId: {
      label: "Perioden-ID",
      description: "Nach Buchhaltungsperiode filtern",
      placeholder: "Perioden-UUID (optional)",
    },
    status: {
      label: "Status",
      description: "Nach Buchungsstatus filtern",
      placeholder: "Beliebiger Status",
    },
    sourceType: {
      label: "Quellentyp",
      description: "Nach Ursprungsquelle filtern",
      placeholder: "Beliebige Quelle",
    },
    dateFrom: {
      label: "Von",
      description: "Beginn des Datumsbereichs",
      placeholder: "",
    },
    dateTo: {
      label: "Bis",
      description: "Ende des Datumsbereichs",
      placeholder: "",
    },
    response: {
      entries: "Buchungen",
      id: "ID",
      entryNumber: "Buchungsnr.",
      date: "Datum",
      description: "Beschreibung",
      status: "Status",
      sourceType: "Quelle",
      postedAt: "Gebucht am",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Filterparameter prüfen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Unzureichende Berechtigungen",
      },
      server: {
        title: "Serverfehler",
        description: "Buchungen konnten nicht geladen werden",
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
        description: "Keine Buchungen gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: { title: "Buchungen geladen", description: "Buchungen abgerufen" },
  },
  title: "Buchungsliste",
  description: "Buchungen auflisten",
  category: "Kontenplan",
  tag: "Journal",
};
