import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  widget: {
    signInDescription:
      "Melde dich an, um dich mit einem Remote-Konto zu verbinden.",
    adminOnlyDescription:
      "Ausgehende Verbindungen erfordern Admin-Zugriff. Falls du von einer Remote-Instanz verbunden wurdest, sind deine Verbindungen oben sichtbar.",
    benefit1:
      "Erinnerungen synchronisieren automatisch - alles, was du der KI beibringst, überträgt sich",
    benefit2:
      "Greife auf Cloud-KI-Modelle und Tools von deiner lokalen Instanz aus zu",
    benefit3: "Kontext reist mit dir auf allen Geräten",
    adminBenefit1: "Erinnerungen synchronisieren bidirektional, automatisch",
    adminBenefit2:
      "Cloud-KI entdeckt und führt deine lokalen Tools aus (SSH, Dateien, Code-Ausführung)",
    adminBenefit3:
      "Delegiere Aufgaben von der Cloud an diese Maschine - Claude Code führt lokal aus",
    adminBenefit4:
      "Fähigkeiten-Snapshot wird bei jeder Synchronisierung gesendet - Thea weiß immer, was diese Instanz kann",
  },
  post: {
    title: "Mit Remote-Konto verbinden",
    titleShort: "Remote verbinden",
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
    token: {
      label: "Token",
      description: "JWT-Token der Remote-Instanz (wird automatisch gesetzt)",
      validation: {
        required: "Melde dich zuerst bei der Remote-Instanz an",
      },
    },
    leadId: {
      label: "Lead-ID",
      description: "Lead-ID der Remote-Instanz (wird automatisch gesetzt)",
    },
    transportMode: {
      label: "Verbindungsart",
      description:
        "Wie diese Instanz mit der Remote kommuniziert. reverse-ws: persistente ausgehende Verbindung (empfohlen). ws-provider: Remote führt den KI-Inferenz-Loop aus.",
      default: "reverse-ws (Standard)",
    },
    isInferenceProvider: {
      label: "Als Inference-Provider nutzen",
      description:
        "Lässt diese Verbindung KI-Streams ausführen — die Remote-Instanz übernimmt den KI-Loop über den Rück-WS-Kanal.",
    },
    syncScope: {
      label: "Sync-Umfang",
      description: "Welche Daten über diese Verbindung synchronisiert werden.",
      memories: "Erinnerungen",
      documents: "Dokumente",
      skills: "Skills",
      favorites: "Favoriten",
      threads: "Threads",
      chat: "Chat",
      defaultNote:
        "Standardmäßig alles deaktiviert. Nach dem Verbinden aktivierbar.",
    },
    advancedSettings: "Erweiterte Einstellungen",
    credentialWarning:
      "Deine Zugangsdaten gehen direkt von deinem Browser an den Remote-Server. Der hier gespeicherte Token gibt dem Betreiber dieses Servers jedoch vollen Zugriff auf dein Remote-Konto - er kann alles tun, was du dort tun kannst. Verbinde dich nur auf Servern, denen du vollständig vertraust.",
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
        title: "Verbindungen nicht erlaubt",
        description:
          "Der Remote-Server akzeptiert keine eingehenden Verbindungen. Stelle sicher, dass du dich mit einer Cloud-Instanz verbindest (z.B. unbottled.ai), nicht mit einer anderen lokalen Installation.",
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
        description:
          "Du bist bereits mit einer Remote-Instanz mit dieser Instanz-ID verbunden",
      },
      instanceIdConflict: {
        title: "Instanz-ID bereits registriert",
        description:
          "Eine Instanz mit dieser ID ist bereits auf dem Remote registriert. Wähle eine andere Instanz-ID.",
      },
      noLeadId: {
        title: "Verbindungsfehler",
        description:
          "Sitzung mit dem Remote-Server konnte nicht aufgebaut werden",
      },
      invalidUrl: {
        title: "Ungültige Remote-URL",
        description:
          "Die Remote-URL muss auf einen öffentlichen Server zeigen, nicht auf eine lokale oder private Adresse",
      },
    },
    success: {
      title: "Verbunden!",
      description: "Dein Konto ist jetzt mit der Remote-Instanz verbunden",
    },
  },
};
