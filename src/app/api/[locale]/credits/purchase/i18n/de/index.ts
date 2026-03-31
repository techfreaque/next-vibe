import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Credits kaufen",
    description: "Stripe-Checkout-Sitzung für Credit-Paket-Kauf erstellen",
    container: {
      title: "Credits kaufen",
      description: "Kaufe Credit-Pakete für AI-Funktionen",
    },
    quantity: {
      label: "Anzahl",
      description: "Anzahl der zu kaufenden Credit-Pakete (1-10)",
      placeholder: "Anzahl eingeben (1-10)",
    },
    provider: {
      label: "Zahlungsmethode wählen",
      description: "Wählen Sie, wie Sie für Ihr Credit-Paket bezahlen möchten",
      placeholder: "Zahlungsanbieter auswählen",
      stripe: "Kredit- / Debitkarte",
      stripeDescription: "Sicher bezahlen mit Stripe",
      nowpayments: "Kryptowährung",
      nowpaymentsDescription: "Mit Bitcoin, Ethereum und mehr bezahlen",
      cryptoMinimumDisabled:
        "Mindestens {{min}} Pakete für Krypto-Zahlungen erforderlich",
    },
    checkoutUrl: {
      content: "Checkout-URL",
    },
    sessionId: {
      content: "Sitzungs-ID",
    },
    totalAmount: {
      content: "Gesamtbetrag (Cent)",
    },
    totalCredits: {
      content: "Gesamt-Credits",
    },
    pack: {
      title: "Credit-Paket",
      description: "Einmaliges Credit-Paket für KI-Nutzung",
      perPack: "/ Paket",
      features: {
        credits: "{{count}} Credits enthalten",
        expiry: "Credits verfallen nie",
        bestFor: "Ideal für gelegentliche Nutzung",
      },
      totalSummary: "{{totalCredits}} Credits gesamt · {{totalPrice}} gesamt",
      requiresSubscription:
        "Ein aktives Abonnement ist erforderlich, um Credit-Pakete zu kaufen",
    },
    submit: {
      text: "Credit-Paket kaufen",
      loading: "Verarbeitung...",
    },
    redirecting: "Weiterleitung zum Checkout...",
    openCheckout: "Checkout öffnen",
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      label: "Credits kaufen",
      loadingText: "Wird verarbeitet...",
    },
    success: {
      title: "Checkout erstellt",
      description: "Stripe-Checkout-Sitzung erfolgreich erstellt",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Kaufmenge",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Credits zu kaufen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Credits zu kaufen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Checkout-Sitzung konnte nicht erstellt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
      noActiveSubscription: {
        title: "Aktives Abonnement erforderlich",
        description:
          "Sie müssen ein aktives Abonnement haben, um Credit-Pakete zu kaufen",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "Benutzer nicht gefunden",
      description: "Das Benutzerkonto konnte nicht gefunden werden",
    },
    checkoutFailed: {
      title: "Checkout fehlgeschlagen",
      description:
        "Checkout-Sitzung für Credit-Kauf konnte nicht erstellt werden",
    },
  },
};
