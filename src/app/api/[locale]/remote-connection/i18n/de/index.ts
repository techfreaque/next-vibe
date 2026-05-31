import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  widget: {
    title: "Fernverbindung",
    signInDescription:
      "Melde dich an, um deine Fernverbindung zu konfigurieren",
    connected: {
      title: "Mit Cloud-Konto verbunden",
      badge: "Aktiv",
      description:
        "Deine Erinnerungen und KI-Tools synchronisieren sich automatisch mit deinem Cloud-Konto.",
      connectedTo: "Verbunden mit",
      lastSynced: "Zuletzt synchronisiert",
      refresh: "Aktualisieren",
    },
    notConnected: {
      title: "Cloud-Konto verbinden",
      description:
        "Verbinde dich mit deinem Cloud-Konto (z.B. unbottled.ai), um deine Erinnerungen zu synchronisieren und KI-Tools von überall zu nutzen.",
      benefit1:
        "Deine Erinnerungen synchronisieren sich automatisch zwischen diesem Gerät und deinem Cloud-Konto",
      benefit2: "KI-Tools von der Kommandozeile nutzen mit",
      benefit2Code: "vibe --remote",
      benefit3: "Dein Cloud-Konto und deine lokale Instanz bleiben synchron",
    },
  },
  get: {
    title: "Fernverbindung",
    description: "Status deiner Fernverbindung abrufen",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um deine Verbindung zu sehen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, dies zu sehen",
      },
      notFound: {
        title: "Nicht verbunden",
        description: "Keine Fernverbindung konfiguriert",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen deiner Verbindung",
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
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Verbindung abgerufen",
      description: "Fernverbindungsstatus erfolgreich abgerufen",
    },
  },
  connect: {
    title: "Mit Remote-Konto verbinden",
    description:
      "Verbinde dein Konto mit einer Remote-Instanz, um Erinnerungen zu synchronisieren",
    remoteUrl: {
      label: "Remote-URL",
      description:
        "Die Webadresse deines Remote-Kontos (z.B. https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Bitte gib die Remote-URL ein",
        invalid: "Bitte gib eine gültige URL ein (z.B. https://unbottled.ai)",
      },
    },
    email: {
      label: "E-Mail",
      description: "Deine E-Mail-Adresse auf der Remote-Instanz",
      placeholder: "du@beispiel.de",
      validation: {
        required: "Bitte gib deine E-Mail ein",
        invalid: "Bitte gib eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Passwort",
      description: "Dein Passwort auf der Remote-Instanz",
      placeholder: "••••••••",
      validation: {
        required: "Bitte gib dein Passwort ein",
      },
    },
    actions: {
      submit: "Verbinden",
      submitting: "Verbinde...",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Bitte überprüfe deine Angaben und versuche es erneut",
      },
      network: {
        title: "Verbindung fehlgeschlagen",
        description: "Remote-Server nicht erreichbar. Überprüfe die URL",
      },
      unauthorized: {
        title: "Anmeldung fehlgeschlagen",
        description: "Falsche E-Mail oder falsches Passwort",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Dein Konto hat keine Berechtigung zur Verbindung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Remote-Server unter dieser URL nicht gefunden",
      },
      server: {
        title: "Remote-Serverfehler",
        description: "Der Remote-Server hat einen Fehler gemeldet",
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
        title: "Bereits verbunden",
        description: "Du bist bereits mit einer Remote-Instanz verbunden",
      },
      noLeadId: {
        title: "Verbindungsfehler",
        description:
          "Sitzung mit dem Remote-Server konnte nicht aufgebaut werden",
      },
    },
    success: {
      title: "Verbunden!",
      description: "Dein Konto ist jetzt mit der Remote-Instanz verbunden",
    },
  },
  disconnect: {
    title: "Trennen",
    description: "Von deiner Remote-Instanz trennen",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um zu trennen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung zum Trennen",
      },
      notFound: {
        title: "Nicht verbunden",
        description: "Keine Fernverbindung zum Trennen",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Trennen",
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
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Getrennt",
      description: "Deine Fernverbindung wurde entfernt",
    },
  },
};
