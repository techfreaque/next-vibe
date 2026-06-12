import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    get: {
      title: "Lagerübersicht",
      description:
        "Aktueller Stand des Lagerbestands, ausstehende Transfers und Lageranzahl.",
      widget: {
        kpiInStock: "Auf Lager",
        kpiOutOfStock: "Nicht vorrätig",
        kpiLowStock: "Niedriger Bestand",
        kpiWarehouses: "Lagerhäuser",
        alertOutOfStock: "Nicht vorrätig",
        navStockLevels: "Lagerbestände",
        navTransfers: "Transfers",
        navWarehouses: "Lagerhäuser",
        loading: "Laden…",
        pendingTransfers: "Unterwegs",
      },
      companyId: {
        label: "Unternehmen",
        description:
          "Unternehmen, dessen Lagerstatistiken angezeigt werden sollen (optional)",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Anmelden um die Lagerübersicht zu sehen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Kein Zugriff auf dieses Unternehmen",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        server: {
          title: "Serverfehler",
          description: "Lagerübersicht konnte nicht geladen werden",
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
        description: "Lagerübersicht abgerufen",
      },
      response: {
        inStockCount: "Auf Lager",
        outOfStockCount: "Nicht vorrätig",
        lowStockCount: "Niedriger Bestand",
        pendingTransferCount: "Ausstehende Transfers",
        warehouseCount: "Lagerhäuser",
      },
    },
  },
};
