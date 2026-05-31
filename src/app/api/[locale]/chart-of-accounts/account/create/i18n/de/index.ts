import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Konto erstellen",
    description:
      "Benutzerdefiniertes Konto zum Kontenplan des Unternehmens hinzufügen",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das Unternehmen, zu dem das Konto hinzugefügt wird",
      placeholder: "Unternehmens-UUID eingeben",
    },
    code: {
      label: "Kontonummer",
      description: "Eindeutige numerische Kontonummer",
      placeholder: "z.B. 1150",
    },
    name: {
      label: "Kontobezeichnung",
      description: "Beschreibender Name des Kontos",
      placeholder: "z.B. Handkasse",
    },
    type: {
      label: "Kontotyp",
      description: "Übergeordnete Klassifizierung des Kontos",
      placeholder: "Typ auswählen",
    },
    subtype: {
      label: "Kontountertyp",
      description: "Detaillierte Klassifizierung innerhalb des Typs",
      placeholder: "Untertyp auswählen",
    },
    parentId: {
      label: "Übergeordnetes Konto",
      description: "Optionales übergeordnetes Konto für die Hierarchie",
      placeholder: "UUID des übergeordneten Kontos (optional)",
    },
    response: {
      id: "Konto-ID",
      code: "Kontonummer",
      name: "Bezeichnung",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Alle Pflichtfelder prüfen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Unzureichende Berechtigungen",
      },
      server: {
        title: "Serverfehler",
        description: "Konto konnte nicht erstellt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Nummer vergeben",
        description: "Ein Konto mit dieser Nummer existiert bereits",
      },
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
    success: {
      title: "Konto erstellt",
      description: "Das Konto wurde hinzugefügt",
    },
    widget: {
      viewButton: "Konto anzeigen",
      addAnotherButton: "Weiteres hinzufügen",
      back: "Zurück",
    },
  },
  title: "Konto erstellen",
  description: "Benutzerdefiniertes Konto hinzufügen",
  category: "Kontenplan",
  tag: "Konto",
};
