import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    get: {
      title: "Einkaufsübersicht",
      description:
        "Aktueller Stand der Bestellungen und Lieferantenaktivitäten für Ihr Unternehmen.",
      widget: {
        kpiDraft: "Entwürfe",
        kpiConfirmed: "Bestätigt",
        kpiAwaitingReceipt: "Ausstehende Lieferungen",
        kpiActiveVendors: "Aktive Lieferanten",
        warningDueThisWeek:
          "{{count}} Bestellung fällig diese Woche — Liefertermine prüfen",
        warningDueThisWeekPlural:
          "{{count}} Bestellungen fällig diese Woche — Liefertermine prüfen",
        navNewPo: "Neue Bestellung",
        navAllPos: "Alle Bestellungen",
        navVendors: "Lieferanten",
        navNewVendor: "Neuer Lieferant",
        loading: "Laden…",
      },
      companyId: {
        label: "Unternehmen",
        description:
          "Unternehmen, dessen Einkaufsstatistiken angezeigt werden sollen (optional)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um die Einkaufsübersicht zu sehen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Einkaufsübersicht konnte nicht geladen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung prüfen und erneut versuchen",
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
        title: "Dashboard geladen",
        description: "Einkaufsübersicht abgerufen",
      },
      response: {
        draftCount: "Entwürfe",
        confirmedCount: "Bestätigte Bestellungen",
        awaitingReceiptCount: "Ausstehende Lieferungen",
        activeVendorCount: "Aktive Lieferanten",
        dueThisWeekCount: "Diese Woche fällig",
      },
    },
  },
};
