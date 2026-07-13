import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkte",
    catalog: "Katalog",
    deactivate: "Deaktivieren",
  },
  post: {
    title: "Produkt deaktivieren",
    titleShort: "Deaktivieren",
    description:
      "Katalogprodukt als inaktiv markieren. Die Produktdaten bleiben erhalten.",
    productId: {
      label: "Produkt-ID",
      description: "ID des zu deaktivierenden Produkts",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Produkt-ID prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melden Sie sich an, um ein Produkt zu deaktivieren",
      },
      forbidden: {
        title: "Kein Zugriff",
        description:
          "Sie haben keine Berechtigung, dieses Produkt zu deaktivieren",
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
      title: "Produkt deaktiviert",
      description: "Das Produkt wurde aus dem aktiven Katalog entfernt.",
    },
    response: {
      id: "Produkt-ID",
      isActive: "Aktivstatus",
    },
    widget: {
      backToList: "Zurück zu Produkten",
      back: "Zurück",
      warning:
        "Das Produkt wird deaktiviert und aus dem aktiven Katalog entfernt. Die Daten bleiben erhalten.",
    },
  },
};
