import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkte",
    category: "Kategorie",
    list: "Liste",
  },
  get: {
    title: "Kategorien",
    titleShort: "Kategorien",
    description:
      "Produktkategorien für ein Unternehmen oder einen Besitzer abrufen.",
    companyId: {
      label: "Unternehmens-ID",
      description: "Kategorien dieses Unternehmens filtern",
    },
    page: {
      label: "Seite",
      description: "Seitennummer (beginnt bei 1)",
    },
    pageSize: {
      label: "Pro Seite",
      description: "Ergebnisse pro Seite (max. 100)",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Filterparameter prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melden Sie sich an, um Kategorien anzuzeigen",
      },
      forbidden: {
        title: "Kein Zugriff",
        description:
          "Sie haben keine Berechtigung, diese Kategorien anzuzeigen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen — bitte erneut versuchen",
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
        description: "Keine Kategorien gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Kategorien abgerufen",
      description: "Produktkategorien sind unten aufgelistet.",
    },
    response: {
      id: "Kategorie-ID",
      name: "Kategoriename",
      parentId: "Übergeordnete Kategorie",
      sortOrder: "Sortierreihenfolge",
      isActive: "Aktiv",
      createdAt: "Erstellt",
      total: "Gesamt",
    },
    widget: {
      addCategory: "Kategorie hinzufügen",
      active: "Aktiv",
      inactive: "Inaktiv",
      empty: "Keine Kategorien gefunden. Legen Sie Ihre erste Kategorie an.",
      viewProducts: "Produkte anzeigen →",
      backToCatalog: "← Produkte",
      back: "Zurück",
    },
  },
};
