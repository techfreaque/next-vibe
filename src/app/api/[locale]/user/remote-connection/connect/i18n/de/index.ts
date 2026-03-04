export const translations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
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
};
