import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description: "ngrok-Tunnel für NOWPayments Webhooks starten",
    category: "Zahlung",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    form: {
      title: "NOWPayments Tunnel",
      description: "ngrok-Tunnel für lokale NOWPayments Webhooks starten",
      fields: {
        port: {
          label: "Port",
          description: "Lokaler Port für Tunnel (Standard: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        instructions:
          "So installierst du ngrok:\n\n1. Öffne https://ngrok.com/download\n2. Lade ngrok für deine Plattform herunter\n3. Entpacke es und verschiebe es in deinen PATH\n4. Führe aus: ngrok authtoken DEIN_AUTH_TOKEN (Token erhältst du unter https://dashboard.ngrok.com/get-started/your-authtoken)\n\nOder per Paketmanager installieren:\n- macOS: brew install ngrok/ngrok/ngrok\n- Linux: snap install ngrok\n- Windows: choco install ngrok",
        title: "ngrok nicht installiert",
        description:
          "ngrok wird für den Tunnel benötigt. Installieren und erneut versuchen.",
      },
      validationFailed: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
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
        noTunnelUrl: "ngrok-Tunnel-URL konnte nicht gelesen werden",
        title: "Serverfehler",
        description: "Tunnel konnte nicht gestartet werden",
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
    success: {
      title: "Tunnel gestartet",
      description: "ngrok-Tunnel läuft",
    },
  },
};
