import { translations as invoiceTranslations } from "../../invoice/i18n/de";
import { translations as portalTranslations } from "../../portal/i18n/de";
import { translations as refundTranslations } from "../../refund/i18n/de";
import { translations as stripeProviderTranslations } from "../../providers/stripe/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import sub-domain translations
  invoice: invoiceTranslations,
  portal: portalTranslations,
  refund: refundTranslations,
  providers: {
    stripe: stripeProviderTranslations,
    nowpayments: "NOWPayments",
  },

  // Main payment domain
  category: "Zahlung",

  // Main form configuration
  form: {
    title: "Zahlungskonfiguration",
    description: "Zahlungsparameter konfigurieren",
  },

  // Tags
  tags: {
    payment: "zahlung",
    stripe: "stripe",
    checkout: "checkout",
    list: "liste",
    transactions: "transaktionen",
    info: "info",
  },

  // Create payment endpoint
  create: {
    title: "Zahlungssitzung erstellen",
    description: "Eine neue Zahlungssitzung mit Stripe erstellen",
    form: {
      title: "Zahlungskonfiguration",
      description: "Zahlungssitzungsparameter konfigurieren",
    },
    paymentMethodTypes: {
      label: "Zahlungsmethoden",
      description: "Akzeptierte Zahlungsmethoden auswählen",
    },
    successUrl: {
      label: "Erfolgs-URL",
      description: "URL für Weiterleitung nach erfolgreicher Zahlung",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "Abbruch-URL",
      description: "URL für Weiterleitung bei Zahlungsabbruch",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "Kunden-E-Mail",
      description: "Kunden-E-Mail-Adresse für die Zahlung",
      placeholder: "kunde@example.com",
    },
    response: {
      success: "Zahlungssitzung erfolgreich erstellt",
      sessionId: "Stripe-Sitzungs-ID",
      sessionUrl: "Stripe-Sitzungs-URL",
      checkoutUrl: "Checkout-URL",
      message: "Statusmeldung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Zahlungsparameter",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Zahlungssitzung nicht gefunden",
      },
      forbidden: {
        title: "Verboten",
        description: "Berechtigung verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Zahlungskonflikt erkannt",
      },
    },
    success: {
      title: "Erfolg",
      description: "Zahlungssitzung erfolgreich erstellt",
      message: "Zahlungssitzung erfolgreich erstellt",
    },
  },

  // Get payment endpoint
  get: {
    title: "Zahlungsinformationen abrufen",
    description: "Zahlungstransaktionen und -methoden abrufen",
    form: {
      title: "Zahlungsabfrage",
      description: "Zahlungsinformationen abfragen",
    },
    response: {
      success: "Zahlungsdaten erfolgreich abgerufen",
      sessionUrl: "Zahlungssitzungs-URL",
      sessionId: "Zahlungssitzungs-ID",
      message: "Statusmeldung",
      transactions: "Zahlungstransaktionen",
      paymentMethods: "Zahlungsmethoden",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Abfrageparameter",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Zahlungsinformationen nicht gefunden",
      },
      forbidden: {
        title: "Verboten",
        description: "Berechtigung verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Zahlungskonflikt erkannt",
      },
    },
    success: {
      title: "Erfolg",
      description: "Zahlungsinformationen erfolgreich abgerufen",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Zahlungsparameter",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Zahlung nicht gefunden",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Berechtigung verweigert",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Zahlungskonflikt erkannt",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description: "Diese Zahlungsanbieter-Funktion ist noch nicht implementiert",
    },
    customerCreationFailed: "Fehler beim Erstellen des Stripe-Kunden",
    customerNotFound: "Stripe-Kunde nicht gefunden",
  },

  // Top-level success
  success: {
    title: "Erfolg",
    description: "Vorgang erfolgreich abgeschlossen",
    sessionCreated: "Zahlungssitzung erfolgreich erstellt",
    infoRetrieved: "Zahlungsinformationen erfolgreich abgerufen",
  },

  // Field labels and descriptions
  amount: {
    label: "Betrag",
    description: "Zahlungsbetrag in der angegebenen Währung",
    placeholder: "Betrag eingeben",
  },
  currency: {
    label: "Währung",
    description: "Zahlungswährung",
    placeholder: "Währung auswählen",
    usd: "US-Dollar (USD)",
    eur: "Euro (EUR)",
    pln: "Polnischer Zloty (PLN)",
  },
  mode: {
    label: "Zahlungsmodus",
    description: "Art der Zahlungssitzung",
    placeholder: "Zahlungsmodus auswählen",
  },
  successUrl: {
    label: "Erfolgs-URL",
    description: "URL für Weiterleitung nach erfolgreicher Zahlung",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "Abbruch-URL",
    description: "URL für Weiterleitung bei Zahlungsabbruch",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Metadaten",
    description: "Zusätzliche Metadaten für die Zahlungssitzung",
    placeholder: "Metadaten als JSON eingeben",
  },
  paymentId: {
    label: "Zahlungs-ID",
    description: "Spezifische Zahlungs-ID zum Abrufen",
    placeholder: "Zahlungs-ID eingeben",
  },
  sessionId: {
    label: "Sitzungs-ID",
    description: "Stripe-Sitzungs-ID zur Abfrage",
    placeholder: "Sitzungs-ID eingeben",
  },
  limit: {
    label: "Limit",
    description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
    placeholder: "20",
  },
  offset: {
    label: "Offset",
    description: "Anzahl der zu überspringenden Ergebnisse",
    placeholder: "0",
  },
  priceId: {
    label: "Preis-ID",
    description: "Stripe-Preiskennzeichnung für das Produkt",
    placeholder: "price_1234567890",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      succeeded: "Erfolgreich",
      failed: "Fehlgeschlagen",
      canceled: "Storniert",
      refunded: "Erstattet",
    },
    paymentMethodType: {
      card: "Kredit-/Debitkarte",
      bankTransfer: "Banküberweisung",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "SEPA-Lastschrift",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Benötigt Zahlungsmethode",
      requiresConfirmation: "Benötigt Bestätigung",
      requiresAction: "Benötigt Aktion",
      processing: "In Bearbeitung",
      requiresCapture: "Benötigt Erfassung",
      canceled: "Storniert",
      succeeded: "Erfolgreich",
    },
    checkoutMode: {
      payment: "Zahlung",
      subscription: "Abonnement",
      setup: "Einrichtung",
    },
    refundStatus: {
      pending: "Ausstehend",
      succeeded: "Erfolgreich",
      failed: "Fehlgeschlagen",
      canceled: "Storniert",
    },
    disputeStatus: {
      warningNeedsResponse: "Warnung - Antwort erforderlich",
      warningUnderReview: "Warnung - In Prüfung",
      warningClosed: "Warnung - Geschlossen",
      needsResponse: "Antwort erforderlich",
      underReview: "In Prüfung",
      chargeRefunded: "Betrag erstattet",
      won: "Gewonnen",
      lost: "Verloren",
    },
    invoiceStatus: {
      draft: "Entwurf",
      open: "Offen",
      paid: "Bezahlt",
      void: "Ungültig",
      uncollectible: "Uneinbringlich",
    },
    taxStatus: {
      complete: "Vollständig",
      failed: "Fehlgeschlagen",
      requiresLocation: "Standort erforderlich",
    },
  },
};
