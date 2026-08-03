import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Adressen",
  tag: "addresses",

  update: {
    title: "Adresse bearbeiten",
    titleShort: "Adresse ändern",
    description: "Gespeicherte Adresse ändern",
    fields: {
      addressId: { label: "Adress-ID", description: "Zu bearbeitende Adresse" },
      label: {
        label: "Bezeichnung",
        description: "Name für diese Adresse",
        placeholder: "Zuhause",
      },
      fullName: {
        label: "Vollständiger Name",
        description: "Kontaktname",
        placeholder: "Maria Muster",
      },
      company: {
        label: "Unternehmen",
        description: "Firmenname (optional)",
        placeholder: "Beispiel GmbH",
      },
      phone: {
        label: "Telefon",
        description: "Kontakttelefonnummer",
        placeholder: "+49 30 00000000",
      },
      vatNumber: {
        label: "USt-IdNr.",
        description: "Umsatzsteuer-Identifikationsnummer",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Steuernummer",
        description: "Nationale Steuerkennung",
        placeholder: "123/456/78901",
      },
      addressLine1: {
        label: "Adresszeile 1",
        description: "Straße und Hausnummer",
        placeholder: "Musterstraße 1",
      },
      addressLine2: {
        label: "Adresszeile 2",
        description: "Wohnung, Etage (optional)",
        placeholder: "3. OG",
      },
      city: { label: "Stadt", description: "Stadt", placeholder: "Berlin" },
      region: {
        label: "Bundesland / Region",
        description: "Bundesland oder Region (optional)",
        placeholder: "Bayern",
      },
      postalCode: {
        label: "Postleitzahl",
        description: "PLZ",
        placeholder: "10115",
      },
      country: {
        label: "Land",
        description: "ISO-3166-1-Alpha-2-Ländercode",
        placeholder: "DE",
      },
      isDefaultBilling: {
        label: "Standard-Rechnungsadresse",
        description: "Als Standard-Rechnungsadresse verwenden",
      },
      isDefaultDelivery: {
        label: "Standard-Lieferadresse",
        description: "Als Standard-Lieferadresse verwenden",
      },
    },
    response: {
      updated: "Aktualisiert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Pflichtfelder prüfen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Diese Adresse gehört Ihnen nicht",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Adresse nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      internal: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
        detail: "Adresse konnte nicht aktualisiert werden: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "Adresse aktualisiert",
      description: "Adresse erfolgreich gespeichert",
    },
    widget: {
      updated: "Adresse aktualisiert.",
      backToAddresses: "Zurück zu Adressen",
    },
  },

  delete: {
    title: "Adresse löschen",
    titleShort: "Adresse löschen",
    description: "Gespeicherte Adresse entfernen",
    fields: {
      addressId: { label: "Adress-ID", description: "Zu löschende Adresse" },
    },
    response: {
      deleted: "Gelöscht",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Diese Adresse gehört Ihnen nicht",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Adresse nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      internal: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
        detail: "Adresse konnte nicht gelöscht werden: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "Adresse gelöscht",
      description: "Adresse wurde entfernt",
    },
    widget: {
      deleted: "Adresse gelöscht.",
      backToAddresses: "Zurück zu Adressen",
    },
  },
};
