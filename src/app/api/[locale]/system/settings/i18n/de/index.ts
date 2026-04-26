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
    restartWizard: "Einrichtungsassistent",
    generate: "Generieren",
    editConfirmHint: "[Enter] bestätigen  [Esc] abbrechen",
    editSettings: "Einstellungen bearbeiten",
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
    subtitle: "Konfigurieren Sie Ihre Instanz in wenigen Schritten.",
    alreadyConfigured: "Bereits konfiguriert",
    stepOf: "Schritt {{step}} von {{total}}",
    next: "Weiter",
    back: "Zurück",
    skip: "Diesen Schritt überspringen",
    finish: "Einrichtung abschließen",
    restart: "Assistenten neu starten",
    done: "Einrichtung abgeschlossen",
    doneSubtitle:
      "Ihre Instanz ist bereit. Sie können die Einstellungen jederzeit ändern.",
    goToSettings: "Zu den vollständigen Einstellungen",
    viewAllSettings: "Alle Einstellungen anzeigen",
    encryptionNote:
      "Dieser Wert wird verschlüsselt und sicher gespeichert - er ist niemals im Klartext lesbar.",
    autoGeneratedNote:
      "Automatisch generiert - sicher so zu verwenden, oder durch eigenen Wert ersetzen.",
    steps: {
      admin: "Admin-Konto",
      database: "Datenbank",
      security: "Sicherheitsschlüssel",
      ai: "KI-Anbieter",
    },
    ai: {
      claudeCodeTitle: "Claude Code (Automatisch erkannt)",
      claudeCodeDescription:
        "Nutzt Ihre lokale Claude CLI-Sitzung - kein API-Schlüssel nötig. Fügen Sie unten OpenRouter hinzu, um 200+ weitere Modelle zu nutzen.",
      claudeDetected:
        "Claude CLI erkannt! Stellen Sie sicher, dass Sie mit `claude login` angemeldet sind.",
      claudeNotDetected:
        "Claude CLI nicht gefunden. Installieren Sie es von claude.ai/code und führen Sie `claude login` aus. Oder überspringen und OpenRouter unten verwenden.",
      claudeInstallHint:
        "Optional - Sie können stattdessen OpenRouter oder andere Anbieter verwenden.",
      openRouterTitle: "OpenRouter API-Schlüssel",
      openRouterDescription:
        "Zugang zu 200+ KI-Modellen. Funktioniert zusammen mit Claude Code oder allein.",
      openRouterHint:
        "Holen Sie sich Ihren kostenlosen API-Schlüssel auf openrouter.ai/keys",
      unbottledTitle: "Unbottled AI Cloud",
      unbottledDescription:
        "Melden Sie sich bei unbottled.ai an, um alle KI-Modelle ohne eigene API-Schlüssel zu nutzen. Ihre selbstgehostete Instanz leitet über die Cloud weiter.",
      unbottledConnected: "Verbunden mit {{url}}",
      unbottledDisconnected: "Nicht verbunden",
      unbottledSignIn: "Anmelden",
      unbottledSigningIn: "Anmeldung...",
      unbottledDisconnect: "Trennen",
      unbottledEmail: "E-Mail",
      unbottledPassword: "Passwort",
      unbottledRemoteUrl: "Cloud-URL",
      unbottledLoginFailed:
        "Anmeldung fehlgeschlagen - überprüfen Sie E-Mail und Passwort.",
      unbottledConnectionError:
        "Server nicht erreichbar. Überprüfen Sie die URL.",
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
