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
    create: "Erstellen",
  },
  post: {
    title: "Produkt erstellen",
    titleShort: "Produkt erstellen",
    description:
      "Fügen Sie ein Produkt oder eine Dienstleistung zu Ihrem Katalog hinzu.",
    name: {
      label: "Produktname",
      description: "Name des Produkts oder der Dienstleistung",
      placeholder: "Webdesign-Paket",
    },
    productDescription: {
      label: "Beschreibung",
      description:
        "Kurze Beschreibung des Produkt- oder Dienstleistungsumfangs",
      placeholder: "Vollständiges Webdesign inklusive bis zu 5 Seiten",
    },
    sku: {
      label: "Artikelnummer",
      description: "Interne Produktnummer",
      placeholder: "WD-001",
    },
    type: {
      label: "Produkttyp",
      description: "Dienstleistung, physisches Produkt oder digitales Gut",
      placeholder: "Typ wählen",
    },
    unit: {
      label: "Einheit",
      description: "Abrechnungseinheit (z.B. Stunde, Stück, Lizenz)",
      placeholder: "Stunde",
    },
    basePrice: {
      label: "Grundpreis",
      description: "Standardpreis in der gewählten Währung",
      placeholder: "150,00",
    },
    currency: {
      label: "Währung",
      description: "3-stelliger ISO-Währungscode",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Standard-Steuersatz",
      description: "Standard-MwSt-Satz als Dezimalzahl (z.B. 0,19 für 19%)",
      placeholder: "0,19",
    },
    companyId: {
      label: "Unternehmen",
      description: "Dieses Produkt einem Unternehmen zuordnen",
    },
    categoryId: {
      label: "Kategorie",
      description: "Produktkategorie",
    },
    imageUrl: {
      label: "Bild-URL",
      description: "URL zu einem Produktbild",
      placeholder: "https://example.com/produkt.jpg",
    },
    isSubscription: {
      label: "Abonnement-Produkt",
      description: "Kunden werden regelmäßig abgerechnet",
    },
    billingInterval: {
      label: "Abrechnungsrhythmus",
      description: "Wie oft Kunden belastet werden",
      placeholder: "Rhythmus wählen",
      monthly: "Monatlich",
      yearly: "Jährlich",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Prüfen Sie die Felder und versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melden Sie sich an, um ein Produkt zu erstellen",
      },
      forbidden: {
        title: "Kein Zugriff",
        description:
          "Sie haben keine Berechtigung, dieses Produkt zu erstellen",
      },
      conflict: {
        title: "Bereits vorhanden",
        description: "Ein Produkt mit dieser Artikelnummer existiert bereits",
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
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Produkt erstellt",
      description: "Ihr Produkt ist jetzt im Katalog.",
    },
    response: {
      id: "Produkt-ID",
      name: "Produktname",
    },
    widget: {
      viewProduct: "Produkt anzeigen",
      backToList: "Zurück zu Produkten",
      back: "Zurück",
    },
  },
};
