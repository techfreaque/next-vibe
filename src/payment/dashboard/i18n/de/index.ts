import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "zahlung",
    dashboard: "übersicht",
  },
  get: {
    title: "Zahlungsübersicht",
    titleShort: "Übersicht",
    description: "Überblick über Rechnungen, Verbindlichkeiten und Zahlungen",
    form: {
      title: "Übersicht",
      description: "Zahlungsübersicht für Ihr Unternehmen",
    },
    response: {
      openInvoices: "Offene Rechnungen",
      overdueInvoices: "Überfällig",
      unpaidBills: "Unbezahlte Verbindlichkeiten",
      draftInvoices: "Entwürfe",
      currency: "Währung",
      recentInvoices: "Letzte Rechnungen",
      openCount: "Anzahl offen",
      openTotal: "Gesamtbetrag offen",
      overdueCount: "Anzahl überfällig",
      overdueTotal: "Gesamtbetrag überfällig",
      unpaidCount: "Anzahl unbezahlt",
      unpaidTotal: "Gesamtbetrag unbezahlt",
      draftCount: "Anzahl Entwürfe",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Muss Mitglied dieser Firma sein",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Firma nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Übersichtsdaten geladen",
    },
  },
  companyId: {
    label: "Firmen-ID",
    description: "Unternehmen für die Übersicht",
    placeholder: "Firmen-ID eingeben",
  },
  widget: {
    loading: "Übersicht wird geladen...",
    noData: "Kein Unternehmen ausgewählt.",
    noDataHint:
      "Wählen Sie ein Unternehmen, um die Zahlungsübersicht zu sehen.",
    openInvoices: "Offene Rechnungen",
    overdue: "Überfällig",
    unpaidBills: "Offene Verbindlichkeiten",
    draftInvoices: "Entwürfe",
    quickActions: "Schnellzugriff",
    newInvoice: "Neue Rechnung",
    allInvoices: "Alle Rechnungen",
    newEstimate: "Neues Angebot",
    allEstimates: "Angebote",
    allBills: "Verbindlichkeiten",
    recentInvoices: "Letzte Rechnungen",
    noRecentInvoices: "Keine aktuellen Rechnungen.",
    view: "Ansehen",
    due: "Fällig",
    status: {
      draft: "Entwurf",
      open: "Offen",
      paid: "Bezahlt",
      void: "Storniert",
      uncollectible: "Uneinbringlich",
    },
  },
};
