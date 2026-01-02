import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI Integration",
  description: "Stripe CLI-Operationen und Webhook-Listening verwalten",
  category: "Payment Integration",
  tags: {
    stripe: "Stripe",
    cli: "Kommandozeile",
    webhook: "Webhook",
  },

  operations: {
    check: "Installation prüfen",
    install: "Stripe CLI installieren",
    listen: "Webhook-Listener starten",
    login: "Bei Stripe anmelden",
    status: "Status prüfen",
  },

  form: {
    title: "Stripe CLI-Konfiguration",
    description: "Stripe CLI-Operationen und Webhook-Einstellungen konfigurieren",
    fields: {
      operation: {
        label: "Operationstyp",
        description: "Wählen Sie die auszuführende Stripe CLI-Operation",
        placeholder: "Wählen Sie eine Operation...",
      },
      port: {
        label: "Portnummer",
        description: "Portnummer für Webhook-Weiterleitung (1000-65535)",
        placeholder: "4242",
      },
      events: {
        label: "Webhook-Events",
        description: "Wählen Sie Stripe-Events zum Abhören",
        placeholder: "Wählen Sie zu überwachende Events...",
        paymentIntentSucceeded: "Zahlungsabsicht erfolgreich",
        paymentIntentFailed: "Zahlungsabsicht fehlgeschlagen",
        subscriptionCreated: "Abonnement erstellt",
        subscriptionUpdated: "Abonnement aktualisiert",
        invoicePaymentSucceeded: "Rechnungszahlung erfolgreich",
        invoicePaymentFailed: "Rechnungszahlung fehlgeschlagen",
      },
      forwardTo: {
        label: "Weiterleiten an URL",
        description: "Lokaler Endpunkt zur Weiterleitung von Webhook-Events",
        placeholder: "localhost:3000/api/webhooks/stripe",
      },
      skipSslVerify: {
        label: "SSL-Verifizierung überspringen",
        description: "SSL-Zertifikatverifizierung für Entwicklung überspringen",
      },
    },
  },

  response: {
    success: "Operation erfolgreich abgeschlossen",
    installed: "Stripe CLI-Installationsstatus",
    version: "Installierte Stripe CLI-Version",
    status: "Aktueller Operationsstatus",
    output: "Befehlsausgabe und Logs",
    instructions: "Nächste Schritte und Anweisungen",
    webhookEndpoint: "Webhook-Endpunkt-URL",
  },

  login: {
    instructions:
      "Um sich bei Stripe zu authentifizieren, führen Sie 'stripe login' in Ihrem Terminal aus und folgen Sie den Anweisungen, um Ihr Stripe-Konto zu verbinden.",
  },

  status: {
    authenticated: "Authentifiziert und bereit",
    not_authenticated: "Nicht authentifiziert - führen Sie 'stripe login' aus",
    not_installed: "Stripe CLI ist nicht installiert",
  },

  errors: {
    validation: {
      title: "Ungültige Konfiguration",
      description: "Bitte überprüfen Sie Ihre Stripe CLI-Konfiguration und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung zu Stripe-Diensten nicht möglich",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie haben keine Berechtigung, diese Operation auszuführen",
    },
    forbidden: {
      title: "Zugriff verboten",
      description: "Diese Operation ist für Ihr Konto nicht erlaubt",
    },
    notFound: {
      title: "Ressource nicht gefunden",
      description: "Die angeforderte Stripe-Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein Fehler ist bei der Verarbeitung der Stripe-Operation aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist mit Stripe CLI aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Konfigurationsänderungen",
    },
    conflict: {
      title: "Operationskonflikt",
      description: "Eine andere Stripe-Operation läuft derzeit",
    },
    execution_failed: "Stripe CLI-Operation konnte nicht ordnungsgemäß ausgeführt werden",
    userNotFound: {
      title: "Benutzer nicht gefunden",
      description: "Der angegebene Benutzer wurde nicht gefunden",
    },
    customerCreationFailed: {
      title: "Kundenerstellung fehlgeschlagen",
      description: "Stripe-Kunde konnte nicht erstellt werden",
    },
    customerRetrievalFailed: {
      title: "Kundenabruf fehlgeschlagen",
      description: "Stripe-Kundeninformationen konnten nicht abgerufen werden",
    },
    checkoutCreationFailed: {
      title: "Checkout-Erstellung fehlgeschlagen",
      description: "Stripe-Checkout-Sitzung konnte nicht erstellt werden",
    },
    webhookVerificationFailed: {
      title: "Webhook-Verifizierung fehlgeschlagen",
      description: "Webhook-Signatur konnte nicht verifiziert werden",
    },
    subscriptionRetrievalFailed: {
      title: "Abonnement-Abruf fehlgeschlagen",
      description: "Abonnement konnte nicht von Stripe abgerufen werden",
    },
    subscriptionCancellationFailed: {
      title: "Abonnement-Kündigung fehlgeschlagen",
      description: "Abonnement konnte in Stripe nicht gekündigt werden",
    },
    priceCreationFailed: {
      title: "Preis-Erstellung fehlgeschlagen",
      description: "Preis konnte in Stripe nicht erstellt werden",
    },
  },

  success: {
    title: "Operation erfolgreich",
    description: "Stripe CLI-Operation erfolgreich abgeschlossen",
  },

  installInstructions: {
    documentation:
      "Bitte installieren Sie Stripe CLI gemäß der offiziellen Dokumentation unter: https://docs.stripe.com/stripe-cli",
    quickInstallation: "Schnelle Installationsoptionen:",
    macOS: {
      title: "macOS (mit Homebrew):",
      command: "brew install stripe/stripe-cli/stripe",
    },
    linux: {
      title: "Linux (mit Paketmanager):",
      debian: {
        title: "Debian/Ubuntu",
      },
      fedora: {
        title: "CentOS/RHEL/Fedora",
      },
    },
    windows: {
      title: "Windows:",
      scoop: {
        title: "Mit Scoop",
      },
      github: {
        title: "Oder direkt von GitHub-Releases herunterladen:",
        url: "https://github.com/stripe/stripe-cli/releases",
      },
    },
    authentication: {
      title: "Nach der Installation authentifizieren mit:",
      command: "stripe login",
    },
  },
};
