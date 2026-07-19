import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description: "Kryptowährungs-Zahlungsanbieter mit Abo-Unterstützung",

  cli: {
    post: {
      title: "NOWPayments CLI",
      description: "NOWPayments Webhook-Tunneling mit ngrok verwalten",
      category: "Zahlung",
      tags: {
        nowpayments: "NOWPayments",
        cli: "CLI",
        webhook: "Webhook",
      },
      operations: {
        check: "Prüfen",
        install: "Installieren",
        tunnel: "Tunnel",
        status: "Status",
      },
      form: {
        title: "NOWPayments CLI Operationen",
        description:
          "ngrok-Tunnel für NOWPayments Webhooks konfigurieren und verwalten",
        fields: {
          operation: {
            label: "Operation",
            description: "Wählen Sie die auszuführende Operation",
            placeholder: "Wählen Sie eine Operation",
          },
          port: {
            label: "Port",
            description: "Lokaler Port für Tunnel (Standard: 3000)",
            placeholder: "3000",
          },
        },
      },
      errors: {
        validationFailed: {
          title: "Validierungsfehler",
          description: "Ungültige Operation oder Parameter",
        },
        networkError: {
          title: "Netzwerkfehler",
          description: "Netzwerkverbindung fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        serverError: {
          title: "Serverfehler",
          description: "Fehler beim Ausführen der Operation",
        },
        unknownError: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Es gibt nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ressourcenkonflikt",
        },
      },
      response: {
        title: "Antwort",
        description: "Operationsergebnis",
        fields: {
          success: "Erfolg",
          installed: "Installiert",
          version: "Version",
          status: "Status",
          output: "Ausgabe",
          instructions: "Anweisungen",
          tunnelUrl: "Tunnel-URL",
          webhookUrl: "Webhook-URL",
        },
      },
      success: {
        title: "Erfolg",
        description: "Operation erfolgreich abgeschlossen",
      },
    },
  },

  errors: {
    userNotFound: {
      title: "Benutzer nicht gefunden",
      description: "Der angegebene Benutzer konnte nicht gefunden werden",
    },
    customerCreationFailed: {
      title: "Kundenerstellung fehlgeschlagen",
      description: "NOWPayments-Kunde konnte nicht erstellt werden: {error}",
    },
    productNotFound: {
      title: "Produkt nicht gefunden",
      description:
        "Das angegebene Produkt konnte nicht gefunden werden: {productId}",
    },
    userEmailRequired: {
      title: "Benutzer-E-Mail erforderlich",
      description: "Benutzer-E-Mail ist für Abonnements erforderlich: {userId}",
    },
    checkoutCreationFailed: {
      title: "Checkout-Erstellung fehlgeschlagen",
      description:
        "NOWPayments-Checkout-Sitzung konnte nicht erstellt werden: {error}",
    },
    invoiceCreationFailed: {
      title: "Rechnungserstellung fehlgeschlagen",
      description: "NOWPayments-Rechnung konnte nicht erstellt werden: {error}",
    },
    invalidApiKey: {
      title: "Ungültiger API-Schlüssel",
      description:
        "Ungültiger NOWPayments API-Schlüssel. Bitte überprüfen Sie Ihre Konfiguration und stellen Sie sicher, dass Sie einen gültigen API-Schlüssel von https://nowpayments.io/app/dashboard haben",
    },
    planCreationFailed: {
      title: "Plan-Erstellung fehlgeschlagen",
      description: "NOWPayments-Abo-Plan konnte nicht erstellt werden: {error}",
    },
    subscriptionCreationFailed: {
      title: "Abo-Erstellung fehlgeschlagen",
      description:
        "NOWPayments-Abonnement konnte nicht erstellt werden: {error}",
    },
    subscriptionRetrievalFailed: {
      title: "Abo-Abruf fehlgeschlagen",
      description:
        "NOWPayments-Abonnement konnte nicht abgerufen werden: {error}",
    },
    subscriptionCancellationFailed: {
      title: "Abo-Kündigung fehlgeschlagen",
      description:
        "NOWPayments-Abonnement konnte nicht gekündigt werden: {error}",
    },
    subscriptionListFailed: {
      title: "Abo-Listenabruf fehlgeschlagen",
      description:
        "NOWPayments-Abonnements konnten nicht aufgelistet werden: {error}",
    },
    notConfigured: {
      title: "NOWPayments nicht konfiguriert",
      description:
        "NOWPayments ist nicht konfiguriert - setze NOWPAYMENTS_API_KEY und NOWPAYMENTS_IPN_SECRET in deiner .env",
    },
    webhookVerificationFailed: {
      title: "Webhook-Verifizierung fehlgeschlagen",
      description:
        "NOWPayments-Webhook-Signatur konnte nicht verifiziert werden: {error}",
    },
    paymentStatusFailed: {
      title: "Abruf des Zahlungsstatus fehlgeschlagen",
      description:
        "Zahlungsstatus konnte nicht von NOWPayments abgerufen werden: {error}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Rechnung erstellt",
      description: "NOWPayments-Rechnung erfolgreich erstellt",
    },
    webhookVerified: {
      title: "Webhook verifiziert",
      description: "NOWPayments-Webhook erfolgreich verifiziert",
    },
    paymentStatusRetrieved: {
      title: "Zahlungsstatus abgerufen",
      description: "NOWPayments-Zahlungsstatus erfolgreich abgerufen",
    },
  },
};
