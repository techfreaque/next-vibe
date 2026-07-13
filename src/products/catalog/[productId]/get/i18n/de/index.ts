import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  tags: {
    products: "Produkte",
    catalog: "Katalog",
    get: "Abrufen",
  },
  get: {
    title: "Katalogprodukt abrufen",
    titleShort: "Produktdetails",
    description: "Ein einzelnes Katalogprodukt per ID abrufen.",
    productId: {
      label: "Produkt-ID",
      description: "Die ID des abzurufenden Produkts",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Produkt-ID prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden, um Produktdetails zu sehen",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Keine Berechtigung, dieses Produkt anzusehen",
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
        description: "Produkt nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Produkt abgerufen",
      description: "Produktdetails wurden geladen.",
    },
    response: {
      id: "Produkt-ID",
      companyId: "Unternehmen",
      name: "Produktname",
      description: "Beschreibung",
      sku: "Artikelnummer",
      type: "Typ",
      unit: "Einheit",
      basePrice: "Grundpreis",
      currency: "Währung",
      defaultTaxRate: "Standard-Steuersatz",
      categoryId: "Kategorie",
      imageUrl: "Bild-URL",
      isActive: "Aktiv",
      isSubscription: "Abonnement",
      billingInterval: "Abrechnungsrhythmus",
      createdAt: "Erstellt",
      updatedAt: "Aktualisiert",
    },
    widget: {
      edit: "Bearbeiten",
      deactivate: "Deaktivieren",
      activate: "Aktivieren",
      active: "Aktiv",
      inactive: "Inaktiv",
      back: "Zurück",
      loading: "Produkt wird geladen...",
      typeService: "Dienstleistung",
      typePhysical: "Physisch",
      typeDigital: "Digital",
      recurring: "Wiederkehrend",
      billingMonthly: "Monatlich",
      billingYearly: "Jährlich",
      addToInvoice: "Zur Rechnung hinzufügen",
      details: "Details",
      select: "Produkt auswählen",
    },
  },
};
