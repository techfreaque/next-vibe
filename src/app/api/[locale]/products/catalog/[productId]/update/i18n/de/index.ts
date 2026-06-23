import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    productType: {
      service: "Dienstleistung",
      physical: "Physisches Produkt",
      digital: "Digitales Produkt",
    },
  },
  tags: {
    products: "Produkte",
    catalog: "Katalog",
    update: "Aktualisieren",
  },
  patch: {
    title: "Produkt aktualisieren",
    titleShort: "Produkt aktualisieren",
    description: "Felder eines bestehenden Katalogprodukts aktualisieren.",
    productId: {
      label: "Produkt-ID",
      description: "ID des zu aktualisierenden Produkts",
    },
    name: {
      label: "Produktname",
      description: "Neuer Name des Produkts",
      placeholder: "Webdesign-Paket",
    },
    productDescription: {
      label: "Beschreibung",
      description: "Aktualisierte Produktbeschreibung",
      placeholder: "Vollständiges Webdesign inklusive bis zu 5 Seiten",
    },
    sku: {
      label: "Artikelnummer",
      description: "Aktualisierte interne Produktnummer",
      placeholder: "WD-001",
    },
    type: {
      label: "Produkttyp",
      description: "Aktualisierter Produkttyp",
      placeholder: "Typ wählen",
    },
    unit: {
      label: "Einheit",
      description: "Aktualisierte Abrechnungseinheit",
      placeholder: "Stunde",
    },
    basePrice: {
      label: "Grundpreis",
      description: "Aktualisierter Grundpreis",
      placeholder: "150,00",
    },
    currency: {
      label: "Währung",
      description: "Aktualisierter 3-stelliger ISO-Währungscode",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Standard-Steuersatz",
      description: "Aktualisierter Standard-MwSt-Satz als Dezimalzahl",
      placeholder: "0,19",
    },
    categoryId: {
      label: "Kategorie",
      description: "Aktualisierte Produktkategorie",
    },
    imageUrl: {
      label: "Bild-URL",
      description: "Aktualisierte Produktbild-URL",
      placeholder: "https://example.com/produkt.jpg",
    },
    isActive: {
      label: "Aktiv",
      description: "Ob das Produkt im Katalog verfügbar ist",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Felder prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melden Sie sich an, um ein Produkt zu aktualisieren",
      },
      forbidden: {
        title: "Kein Zugriff",
        description:
          "Sie haben keine Berechtigung, dieses Produkt zu aktualisieren",
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
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Produkt aktualisiert",
      description: "Produktdetails wurden gespeichert.",
    },
    response: {
      id: "Produkt-ID",
      name: "Produktname",
    },
    widget: {
      backToList: "Zurück zu Produkten",
      back: "Zurück",
    },
  },
};
