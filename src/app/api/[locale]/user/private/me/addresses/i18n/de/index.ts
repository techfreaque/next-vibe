import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Adressen",
  tag: "addresses",

  list: {
    title: "Meine Adressen",
    description: "Gespeicherte Adressen anzeigen",
    response: {
      addresses: "Adressen",
    },
    widget: {
      addAddress: "Adresse hinzufügen",
      edit: "Bearbeiten",
      delete: "Löschen",
      billing: "Rechnung",
      delivery: "Lieferung",
      empty: "Keine gespeicherten Adressen",
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
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Adressen gefunden",
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
      internal: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
    success: { title: "Erfolgreich", description: "Adressen abgerufen" },
  },

  create: {
    title: "Adresse hinzufügen",
    description: "Neue Adresse speichern",
    fields: {
      label: {
        label: "Bezeichnung",
        description: "Name für diese Adresse (z.B. Zuhause, Büro)",
        placeholder: "Zuhause",
      },
      fullName: {
        label: "Vollständiger Name",
        description: "Kontaktname für diese Adresse",
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
      id: "Adress-ID",
      label: "Bezeichnung",
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
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Benutzer nicht gefunden",
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
      internal: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "Adresse gespeichert",
      description: "Adresse wurde Ihrem Konto hinzugefügt",
    },
    widget: {
      saved: "Adresse gespeichert.",
      backToAddresses: "Zurück zu Adressen",
    },
  },
};
