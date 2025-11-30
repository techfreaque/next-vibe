import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
