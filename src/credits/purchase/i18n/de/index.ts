import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
      whop: "Whop",
    },
  },
  post: {
    title: "Credits kaufen",
    titleShort: "Credits kaufen",
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
    productId: {
      label: "Credit-Paket",
      description: "Paketgröße zum Kauf wählen",
      placeholder: "Paket wählen",
    },
    provider: {
      label: "Zahlungsmethode wählen",
      description: "Wählen Sie, wie Sie für Ihr Credit-Paket bezahlen möchten",
      placeholder: "Zahlungsanbieter auswählen",
      stripe: "Karte, PayPal & Wallets",
      stripeDescription: "Karte, PayPal, Apple Pay, Google Pay über Stripe",
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
      addPack: "Ein Paket hinzufügen",
      removePack: "Ein Paket abziehen",
      qtyCredits: "{{count}} Credits",
      title: "Credit-Paket",
      description: "Lädt deinen Plan auf. Credits verfallen nie.",
      perPack: "/ Paket",
      features: {
        credits: "{{count}} Credits enthalten",
        expiry: "Credits verfallen nie",
        bestFor: "Ergänzt dein monatliches Kontingent",
      },
      totalSummary: "{{totalCredits}} Credits gesamt · {{totalPrice}} gesamt",
      planRequired: {
        title: "Pakete laden einen Plan auf",
        body: "Erst Plan starten, dann nachladen, wann immer es knapp wird. Pläne ab {{price}} im Monat.",
        cta: "Pläne ansehen",
      },
      logIn: "Anmelden",
      signUp: "Registrieren",
      signInToBuy:
        "Pakete laden einen Plan auf. Leg ein Gratis-Konto an und starte zuerst einen Plan.",
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
      planRequired: {
        title: "Plan erforderlich",
        description:
          "Credit-Pakete laden einen aktiven Plan auf. Wähle zuerst einen Plan, dann jederzeit Pakete dazu.",
      },
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
        detail: "Checkout konnte nicht gestartet werden: {{error}}",
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
