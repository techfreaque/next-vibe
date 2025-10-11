import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main checkout titles and descriptions
  title: "Abonnement-Checkout erstellen",
  description: "Eine Stripe-Checkout-Sitzung für Abonnements erstellen",
  category: "Abonnement",

  // Tags
  tags: {
    subscription: "abonnement",
    checkout: "checkout",
    stripe: "stripe",
  },

  // Form configuration
  form: {
    title: "Checkout-Konfiguration",
    description: "Checkout-Sitzungsparameter konfigurieren",
    fields: {
      planId: {
        label: "Abonnement-Plan",
        description: "Abonnement-Plan auswählen",
        placeholder: "Plan auswählen",
      },
      billingInterval: {
        label: "Abrechnungsintervall",
        description: "Abrechnungshäufigkeit auswählen",
        placeholder: "Abrechnungsintervall auswählen",
      },
      metadata: {
        label: "Metadaten",
        description: "Zusätzliche Metadaten für die Checkout-Sitzung",
        placeholder: "Metadaten als JSON eingeben",
      },
    },
  },

  // Response fields
  response: {
    success: "Checkout-Sitzung erfolgreich erstellt",
    sessionId: "Stripe-Sitzungs-ID",
    checkoutUrl: "Checkout-URL",
    message: "Statusmeldung",
  },

  // Error types
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
  },

  // Success types
  success: {
    title: "Erfolg",
    description: "Checkout-Sitzung erfolgreich erstellt",
  },

  // POST endpoint specific translations
  post: {
    title: "Checkout-Sitzung erstellen",
    description: "Eine neue Abonnement-Checkout-Sitzung erstellen",
    form: {
      title: "Checkout-Sitzungs-Konfiguration",
      description: "Checkout-Sitzungsparameter konfigurieren",
    },
    response: {
      title: "Checkout-Antwort",
      description: "Checkout-Sitzungsantwortdaten",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Checkout-Parameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Checkout-Sitzung nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Checkout-Sitzung erfolgreich erstellt",
    },
  },
};
