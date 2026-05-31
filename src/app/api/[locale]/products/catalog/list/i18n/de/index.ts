import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkte",
    catalog: "Katalog",
    list: "Liste",
  },
  enums: {
    productType: {
      service: "Dienstleistung",
      physical: "Physisch",
      digital: "Digital",
    },
  },
  get: {
    title: "Katalogprodukte auflisten",
    description:
      "Alle Produkte in Ihrem Katalog abrufen. Nach Unternehmen, Kategorie, Typ oder Status filtern.",
    companyId: {
      label: "Unternehmens-ID",
      description: "Produkte dieses Unternehmens filtern",
    },
    categoryId: {
      label: "Kategorie-ID",
      description: "Produkte in dieser Kategorie filtern",
    },
    type: {
      label: "Produkttyp",
      description: "Nach Dienstleistung, physisch oder digital filtern",
      placeholder: "Alle Typen",
    },
    isActive: {
      label: "Nur aktive",
      description: "Nur aktive Produkte anzeigen",
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
        description: "Melden Sie sich an, um Ihren Katalog anzuzeigen",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Sie haben keine Berechtigung, diesen Katalog anzuzeigen",
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
        description: "Keine Produkte gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Produkte abgerufen",
      description: "Ihre Katalogprodukte sind unten aufgelistet.",
    },
    response: {
      id: "Produkt-ID",
      name: "Produktname",
      type: "Typ",
      sku: "Artikelnummer",
      basePrice: "Grundpreis",
      currency: "Währung",
      unit: "Einheit",
      isActive: "Aktiv",
      isSubscription: "Abonnement",
      billingInterval: "Abrechnungsrhythmus",
      categoryId: "Kategorie",
      createdAt: "Erstellt",
      total: "Gesamt",
    },
    widget: {
      addProduct: "Produkt hinzufügen",
      active: "Aktiv",
      inactive: "Inaktiv",
      empty:
        "Keine Produkte gefunden. Filter anpassen oder neues Produkt anlegen.",
      columnProduct: "Produkt",
      columnTypePrice: "Typ / Preis / Status",
      filterLoad: "Laden",
      filterAllTypes: "Alle Typen",
      filterActiveOnly: "Nur aktive",
      filterAllStatus: "Alle Status",
      recurring: "Wiederkehrend",
      billingMonthly: "Monatlich",
      billingYearly: "Jährlich",
      navCategories: "Kategorien",
      navTaxRates: "Steuersätze",
      back: "Zurück",
    },
  },
};
