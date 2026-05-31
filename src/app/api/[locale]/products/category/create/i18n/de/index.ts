import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    products: "Produkte",
    category: "Kategorie",
    create: "Erstellen",
  },
  post: {
    title: "Produktkategorie erstellen",
    description:
      "Fügen Sie eine Kategorie zur Organisation Ihrer Katalogprodukte hinzu.",
    name: {
      label: "Kategoriename",
      description: "Name der Produktkategorie",
      placeholder: "Designdienstleistungen",
    },
    companyId: {
      label: "Unternehmen",
      description: "Diese Kategorie einem Unternehmen zuordnen",
    },
    parentId: {
      label: "Übergeordnete Kategorie",
      description:
        "Optionale übergeordnete Kategorie für hierarchische Organisation",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Anzeigereihenfolge — niedrigere Zahlen erscheinen zuerst",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Felder prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melden Sie sich an, um eine Kategorie zu erstellen",
      },
      forbidden: {
        title: "Kein Zugriff",
        description:
          "Sie haben keine Berechtigung, diese Kategorie zu erstellen",
      },
      conflict: {
        title: "Bereits vorhanden",
        description: "Eine Kategorie mit diesem Namen existiert bereits",
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
      title: "Kategorie erstellt",
      description: "Ihre Produktkategorie ist bereit.",
    },
    response: {
      id: "Kategorie-ID",
      name: "Kategoriename",
    },
    widget: {
      backToList: "Zurück zu Kategorien",
      back: "Zurück",
    },
  },
};
