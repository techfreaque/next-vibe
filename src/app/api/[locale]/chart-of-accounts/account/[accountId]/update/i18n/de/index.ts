import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Konto bearbeiten",
    description:
      "Name, Beschreibung oder Anzeigereihenfolge des Kontos ändern. Typ und Untertyp können bei Systemkonten nicht geändert werden.",
    accountId: {
      label: "Konto",
      description: "Das zu bearbeitende Konto",
      placeholder: "Konto-UUID",
    },
    code: {
      label: "Code",
      description: "Kontonummer",
    },
    type: {
      label: "Typ",
      description: "Kontotyp",
    },
    subtype: {
      label: "Untertyp",
      description: "Kontenuntertyp",
    },
    isSystem: {
      label: "Systemkonto",
      description: "Ob es sich um ein Systemkonto handelt",
    },
    isActive: {
      label: "Aktiv",
      description: "Ob dieses Konto aktiv ist",
    },
    name: {
      label: "Kontobezeichnung",
      description: "Anzeigename dieses Kontos",
      placeholder: "z. B. Forderungen aus Lieferungen",
    },
    accountDescription: {
      label: "Beschreibung",
      description: "Optionale Hinweise zum Zweck dieses Kontos",
      placeholder: "z. B. Offene Forderungen gegenüber Kunden",
    },
    sortOrder: {
      label: "Reihenfolge",
      description:
        "Anzeigereihenfolge innerhalb der übergeordneten Gruppe — kleinere Zahlen erscheinen zuerst",
      placeholder: "z. B. 10",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Alle Felder prüfen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Systemkonto-Felder können nicht geändert werden",
      },
      server: {
        title: "Serverfehler",
        description: "Konto konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Konto nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Konto aktualisiert",
      description: "Änderungen gespeichert",
    },
    widget: {
      savedLabel: "Gespeichert",
      failedLabel: "Fehlgeschlagen",
      back: "Zurück",
      submit: "Änderungen speichern",
      viewAccount: "Konto anzeigen",
      successTitle: "Änderungen gespeichert",
      successDesc: "Das Konto wurde aktualisiert.",
      systemNotice: "Systemkonto — Typ und Untertyp sind gesperrt.",
      inactiveNotice: "Dieses Konto ist inaktiv.",
      selectPrompt: "Konto zum Bearbeiten wählen",
    },
  },
  title: "Konto bearbeiten",
  description: "Kontodetails bearbeiten",
  category: "Kontenplan",
  tag: "Konto",
};
