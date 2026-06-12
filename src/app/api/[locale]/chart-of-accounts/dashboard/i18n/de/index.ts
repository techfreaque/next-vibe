import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Buchhaltungs-Übersicht",
    titleShort: "Übersicht",
    description:
      "Aktueller Status der Buchhaltung — offene Periode, Buchungszahlen und schnelle Navigation zu allen Buchhaltungsfunktionen.",
    companyId: {
      label: "Unternehmens-ID",
      description: "Unternehmen, für das die Übersicht geladen wird",
      placeholder: "Unternehmens-UUID",
    },
    response: {
      currentPeriod: "Aktuelle Periode",
      accountCount: "Konten",
      draftEntryCount: "Entwürfe",
      postedThisMonthCount: "Buchungen diesen Monat",
      hasSetup: "Einrichtung",
      currency: "Währung",
    },
    success: {
      title: "Übersicht geladen",
      description: "Buchhaltungsübersicht abgerufen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Eingaben prüfen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Kein Zugriff auf dieses Unternehmen",
      },
      server: {
        title: "Serverfehler",
        description: "Übersicht konnte nicht geladen werden",
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
        description: "Unternehmen nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    widget: {
      currentPeriod: "Aktuelle Periode",
      noPeriod: "Keine offene Periode",
      createPeriod: "Periode erstellen",
      totalAccounts: "Konten",
      viewAccounts: "Anzeigen",
      draftEntries: "Entwürfe",
      viewDrafts: "Anzeigen",
      postedThisMonth: "Buchungen diesen Monat",
      setupStatus: "Einrichtung",
      loading: "Dashboard wird geladen…",
      noData: "Keine Buchhaltungsdaten verfügbar.",
      configured: "Eingerichtet",
      notSetUp: "Nicht eingerichtet",
      runSetup: "Einrichten",
      navTitle: "Buchhaltung",
      chartOfAccounts: "Kontenplan",
      journalEntries: "Buchungsjournal",
      periods: "Perioden",
      balanceSheet: "Bilanz",
      profitLoss: "GuV",
      trialBalance: "Probebilanz",
      taxReport: "Steuerauswertung",
      companies: "Unternehmen",
      invoices: "Rechnungen",
      bills: "Eingangsrechnungen",
      selectCompany:
        "Unternehmens-ID eingeben, um die Buchhaltungsübersicht zu laden.",
    },
  },
  category: "Buchhaltung",
  tag: "Dashboard",
};
