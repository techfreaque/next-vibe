import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "CRM-Profil des Benutzers abrufen",
    description: "Rechnungsfelder und Notizanzahl eines Benutzers abrufen",
    fields: {
      userId: {
        label: "Benutzer-ID",
        description: "Der abzufragende Benutzer",
        placeholder: "Benutzer-UUID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Benutzer-ID",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keinen Zugriff auf CRM-Daten dieses Benutzers",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benutzer nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
      internal: {
        title: "Interner Fehler",
        description: "Serverfehler — erneut versuchen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "CRM-Profil geladen",
      description: "Benutzer-CRM-Daten abgerufen",
    },
    widget: {
      addNote: "Notiz hinzufügen",
      viewNotes: "Notizen ansehen",
    },
    response: {
      id: "Benutzer-ID",
      email: "E-Mail",
      privateName: "Name",
      companyBillingName: "Unternehmen / Rechnungsname",
      vatNumber: "USt-IdNr.",
      taxId: "Steuer-ID",
      phone: "Telefon",
      addressLine1: "Adresszeile 1",
      addressLine2: "Adresszeile 2",
      city: "Stadt",
      region: "Region",
      postalCode: "Postleitzahl",
      billingCountry: "Land",
      defaultCurrency: "Standardwährung",
      paymentTermsDays: "Zahlungsziel (Tage)",
      notesCount: "Gesamtnotizen",
    },
  },
  tag: "CRM",
};
