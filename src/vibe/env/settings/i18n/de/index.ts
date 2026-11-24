import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",

  errors: {
    readFailed: "Systemeinstellungen konnten nicht gelesen werden",
    writeFailed:
      "Einstellungen konnten nicht in die .env-Datei geschrieben werden",
    readOnly: "Konfiguration ist in dieser Umgebung schreibgeschützt",
    defaultPasswordDetected: "Standard-Admin-Passwort erkannt",
    passwordNotConfigured: "Admin-Passwort nicht konfiguriert",
  },

  messages: {
    settingsUpdated: "Einstellungen aktualisiert",
  },

  get: {
    title: "Systemeinstellungen",
    titleShort: "Systemeinstellungen",
    description:
      "Umgebungskonfiguration nach Modul gruppiert anzeigen und verwalten",
    tags: {
      settings: "Einstellungen",
    },
    response: {
      modules: {
        title: "Konfigurationsmodule",
      },
      isWritable: {
        title: "Schreibbar",
      },
      isDevMode: {
        title: "Entwicklungsmodus",
      },
      needsOnboarding: {
        title: "Einrichtung erforderlich",
      },
      onboardingIssues: {
        title: "Einrichtungsprobleme",
      },
      wizardSteps: {
        title: "Einrichtungsschritte",
      },
    },
    success: {
      title: "Einstellungen geladen",
      description: "Umgebungseinstellungen erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einstellungen nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Einstellungen konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },

  patch: {
    title: "Einstellungen aktualisieren",
    titleShort: "Einstellungen aktualisieren",
    description: "Umgebungskonfigurationswerte in der .env-Datei aktualisieren",
    tags: {
      settings: "Einstellungen",
    },
    fields: {
      settings: {
        label: "Einstellungen",
        description: "Schlüssel-Wert-Paare zum Aktualisieren",
      },
    },
    response: {
      updated: {
        title: "Aktualisierte Schlüssel",
      },
      needsRestart: {
        title: "Neustart erforderlich",
      },
      resultMessage: {
        title: "Einstellungen aktualisiert",
      },
    },
    success: {
      title: "Einstellungen gespeichert",
      description: "Umgebungseinstellungen erfolgreich aktualisiert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Einstellungswerte",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einstellungen nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      server: {
        title: "Serverfehler",
        description: "Einstellungen konnten nicht gespeichert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },

  widget: {
    title: "Systemkonfiguration",
    subtitle: "Umgebungsvariablen nach Modul gruppiert",
    readOnlyBanner:
      "Konfiguration ist schreibgeschützt. Bearbeiten Sie die .env-Datei direkt oder verwenden Sie die CLI.",
    onboardingBanner:
      "Einrichtung erforderlich - konfigurieren Sie die hervorgehobenen Felder, um loszulegen.",
    defaultPasswordWarning:
      "Standard-Admin-Passwort erkannt! Ändern Sie es sofort.",
    cancel: "Abbrechen",
    save: "Änderungen speichern",
    saving: "Speichern...",
    apply: "Anwenden & Neustarten",
    applying: "Wird angewendet...",
    saved: "Einstellungen erfolgreich gespeichert",
    restartRequired:
      "Einstellungen gespeichert. Ein Neustart ist erforderlich, um die Änderungen anzuwenden.",
    devRestartHint:
      "Starten Sie den Dev-Server neu (Strg+C, dann vibe dev ausführen), um Änderungen anzuwenden.",
    notSet: "nicht gesetzt",
    configured: "Konfiguriert",
    partial: "Teilweise",
    notConfigured: "Nicht konfiguriert",
    required: "Erforderlich",
    selectPlaceholder: "Auswählen...",
    boolTrue: "an",
    boolFalse: "aus",
    logPathDisabled: "Datei-Logging deaktiviert",
    openSetup: "Einrichtung öffnen",
    restartWizard: "Einrichtungsassistent",
    generate: "Generieren",
    editConfirmHint: "[Enter] bestätigen  [Esc] abbrechen",
    editSettings: "Einstellungen bearbeiten",
    exit: "Beenden",
    loading: "Einstellungen werden geladen...",
    exportProd: "Für Produktion exportieren",
    moduleLabels: {
      env: "Kern",
      agent: "KI-Anbieter",
      leadsCampaigns: "Lead-Kampagnen",
      messenger: "Messenger / SMTP",
      imap: "IMAP",
      payment: "Zahlungen",
      sms: "SMS",
      serverSystem: "Server / Plattform",
    },
  },

  wizard: {
    title: "Willkommen bei Vibe Setup",
    subtitle: "Drei kurze Schritte, dann chatten Sie.",
    alreadyConfigured: "Bereits konfiguriert",
    stepOf: "Schritt {{step}} von {{total}}",
    next: "Weiter",
    continue: "Fortfahren",
    back: "Zurück",
    skip: "Schritt überspringen",
    finish: "Einrichtung abschließen",
    restart: "Assistent neu starten",
    done: "Einrichtung abgeschlossen",
    doneSubtitle:
      "Ihre Instanz ist bereit. Jede Einstellung lässt sich später unter Alle Einstellungen ändern.",
    goToSettings: "Zu allen Einstellungen",
    startChatting: "Chat starten",
    viewAllSettings: "Alle Einstellungen anzeigen",
    encryptionNote:
      "Verschlüsselt gespeichert. Im Klartext liest ihn niemand mehr aus.",
    autoGeneratedNote:
      "Für Sie generiert. Behalten oder eigenen Wert einfügen.",
    steps: {
      admin: "Admin-Konto",
      database: "Datenbank",
      security: "Sicherheitsschlüssel",
      ai: "KI-Anbieter",
    },
    ai: {
      claudeCodeTitle: "Claude Code (auf diesem Rechner erkannt)",
      claudeCodeDescription:
        "Nutzt Ihre lokale Claude-CLI-Sitzung. Kein API-Schlüssel nötig.",
      claudeDetected:
        "Claude CLI gefunden. Prüfen Sie, ob Sie mit `claude login` angemeldet sind.",
      claudeNotDetected:
        "Claude CLI nicht gefunden. Installieren Sie es über claude.ai/code und führen Sie `claude login` aus, oder wählen Sie eine andere Option auf dieser Seite.",
      claudeInstallHint:
        "Optional. Ihr unbottled.ai-Konto oder ein OpenRouter-Schlüssel funktioniert genauso.",
      openRouterTitle: "OpenRouter-API-Schlüssel",
      openRouterDescription:
        "Hunderte Modelle mit einem Schlüssel. Allein oder zusammen mit Claude Code.",
      openRouterHint:
        "Schlüssel auf openrouter.ai/keys holen. Kostenlose Modelle ohne Kreditkarte.",
      recommended: "Empfohlen",
      unbottledTitle: "Ihr unbottled.ai-Konto",
      unbottledDescription:
        "Einmal anmelden, und diese Instanz nutzt jedes Modell von unbottled.ai. Chats bleiben in Ihrer Datenbank, die Modellnutzung geht auf Ihre Credits. Setzt ein bezahltes Abo oder Credit-Paket voraus.",
      unbottledNoAccount:
        "Noch kein Konto? Auf unbottled.ai anlegen, dann hier anmelden.",
      unbottledConnected: "Verbunden mit {{url}}",
      unbottledDisconnected: "Nicht verbunden",
      unbottledSignIn: "Anmelden",
      unbottledSigningIn: "Anmeldung läuft...",
      unbottledDisconnect: "Trennen",
      unbottledEmail: "E-Mail",
      unbottledPassword: "Passwort",
      unbottledRemoteUrl: "Cloud-URL",
      unbottledLoginFailed:
        "Anmeldung fehlgeschlagen. Prüfen Sie E-Mail und Passwort.",
      unbottledConnectionError: "Server nicht erreichbar. Prüfen Sie die URL.",
      orDivider: "Oder eigener Anbieter",
    },
  },

  post: {
    title: "Bei unbottled.ai anmelden",
    titleShort: "Unbottled-Anmeldung",
    description:
      "Server-seitige Proxy-Anmeldung — Zugangsdaten verlassen nie deinen Server",
    tags: { settings: "Unbottled-Anmeldung" },
    fields: {
      email: {
        label: "E-Mail",
        description: "unbottled.ai-Konto-E-Mail",
        placeholder: "du@beispiel.de",
      },
      password: {
        label: "Passwort",
        description: "unbottled.ai-Konto-Passwort",
        placeholder: "Passwort",
      },
      remoteUrl: {
        label: "Remote-URL",
        description: "URL der unbottled.ai-Instanz",
        placeholder: "https://unbottled.ai",
      },
      credential: {
        label: "Zugangsdaten",
        description: "Kodierter Anmelde-String",
      },
      syncScope: {
        label: "Sync-Umfang",
        description:
          "Welche Daten über diese Verbindung synchronisiert werden.",
      },
    },
    success: {
      title: "Angemeldet",
      description: "Zugangsdaten erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "E-Mail, Passwort und URL prüfen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      network: {
        title: "Verbindung fehlgeschlagen",
        description: "Remote-Instanz nicht erreichbar",
      },
      server: {
        title: "Anmeldung fehlgeschlagen",
        description: "Falsche E-Mail oder falsches Passwort",
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
  },

  export: {
    title: "Für Produktion exportieren",
    subtitle:
      "Generieren Sie eine .env-Datei für Ihren Server. Sensible Werte werden im Klartext angezeigt - halten Sie diese Datei sicher.",
    copyButton: "In Zwischenablage kopieren",
    copied: "Kopiert!",
    downloadButton: ".env.prod herunterladen",
    instructions:
      "Datei auf Ihren Server kopieren:\n  scp .env.prod benutzer@ihreserver:/app/.env\nOder manuell einfügen:\n  ssh benutzer@ihreserver && nano /app/.env",
    checklist: "Deployment-Checkliste",
    close: "Schließen",
  },
};
