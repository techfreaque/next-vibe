import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  post: {
    title: "Lokale Instanz registrieren",
    description:
      "Von einer lokalen Instanz während des Verbindungsvorgangs aufgerufen, um sich beim Cloud zu registrieren",
    instanceId: {
      label: "Instanz-ID",
      description: "Die eindeutige Kennung der lokalen Instanz",
      placeholder: "hermes",
      validation: {
        invalid: "Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt",
      },
    },
    localUrl: {
      label: "Lokale URL",
      description: "Die App-URL der lokalen Instanz",
      placeholder: "http://localhost:3000",
      validation: {
        required: "Bitte gib die lokale URL ein",
        invalid: "Bitte gib eine gültige URL ein",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Bitte überprüfe deine Angaben und versuche es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description:
          "Du musst angemeldet sein, um eine Instanz zu registrieren",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, eine Instanz zu registrieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Registrieren der Instanz",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Instanz-ID bereits registriert",
        description:
          "Eine Instanz mit dieser ID ist bereits für dein Konto registriert. Wähle eine andere Instanz-ID.",
      },
    },
    success: {
      title: "Instanz registriert",
      description: "Die lokale Instanz wurde erfolgreich registriert",
    },
  },
};
