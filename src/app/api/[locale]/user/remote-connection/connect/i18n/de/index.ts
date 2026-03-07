export const translations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  widget: {
    signInDescription:
      "Melde dich an, um dich mit einem Remote-Konto zu verbinden.",
    benefit1:
      "Erinnerungen synchronisieren automatisch — alles, was du der KI beibringst, überträgt sich",
    benefit2:
      "Greife auf Cloud-KI-Modelle und Tools von deiner lokalen Instanz aus zu",
    benefit3: "Kontext reist mit dir auf allen Geräten",
    adminBenefit1: "Erinnerungen synchronisieren bidirektional, automatisch",
    adminBenefit2:
      "Cloud-KI entdeckt und führt deine lokalen Tools aus (SSH, Dateien, Code-Ausführung)",
    adminBenefit3:
      "Delegiere Aufgaben von der Cloud an diese Maschine — Claude Code führt lokal aus",
    adminBenefit4:
      "Fähigkeiten-Snapshot wird bei jeder Synchronisierung gesendet — Thea weiß immer, was diese Instanz kann",
  },
  post: {
    title: "Mit Remote-Konto verbinden",
    description:
      "Verbinde dein Konto mit einer Remote-Instanz, um Erinnerungen zu synchronisieren",
    instanceId: {
      label: "Instanz-ID",
      description: "Eine kurze eindeutige ID für diese Maschine",
      placeholder: "hermes",
      validation: {
        invalid: "Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt",
      },
    },
    friendlyName: {
      label: "Anzeigename",
      description: "Ein freundlicher Name für die Anzeige",
      placeholder: "Mein Laptop",
    },
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
    credentialWarning:
      "Deine Zugangsdaten gehen direkt von deinem Browser an den Remote-Server. Der hier gespeicherte Token gibt dem Betreiber dieses Servers jedoch vollen Zugriff auf dein Remote-Konto — er kann alles tun, was du dort tun kannst. Verbinde dich nur auf Servern, denen du vollständig vertraust.",
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
