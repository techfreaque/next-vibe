import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} installieren",
    description:
      "Lokaler Installationsstatus und optionale private GitHub-Einrichtung.",
  },
  enums: {
    stepStatus: {
      done: "Bereit",
      inProgress: "Läuft",
      pending: "Ausstehend",
      skipped: "Übersprungen",
      error: "Prüfung nötig",
    },
    action: {
      refresh: "Status neu prüfen",
      githubAuthStart: "Mit GitHub anmelden",
      githubAuthCheck: "GitHub-Anmeldung prüfen",
      githubCreatePrivateRepo: "Privates Repository erstellen",
      githubSkip: "GitHub überspringen",
      githubReset: "GitHub einrichten",
    },
    checkoutMode: {
      cloned: "Neu geklont",
      existing: "Vorhandener Stand erhalten",
      unknown: "Lokaler Stand",
    },
  },
  get: {
    title: "Installationsstatus",
    titleShort: "Installer",
    description:
      "Lokalen Installationsfortschritt, Projektordner und optionale GitHub-Anbindung prüfen.",
    tags: {
      installer: "Installer",
    },
    success: {
      title: "Status geladen",
      description: "Lokaler Installationsstatus wurde ermittelt.",
    },
    response: {
      installDir: { title: "Installationsordner" },
      os: { title: "Betriebssystem" },
      arch: { title: "Architektur" },
      checkoutMode: { title: "Checkout-Modus" },
      branch: { title: "Git-Branch" },
      originUrl: { title: "Origin-Remote" },
      upstreamUrl: { title: "Upstream-Remote" },
      port: { title: "Lokaler Port" },
      stateFilePath: { title: "Statusdatei" },
      updatedAt: { title: "Zuletzt aktualisiert" },
      lastError: { title: "Letzter Fehler" },
      steps: { title: "Installationsschritte" },
      github: { title: "GitHub-Status" },
      setup: { title: "Setup-Status" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Statusanfrage.",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmeldung erforderlich.",
      },
      forbidden: {
        title: "Nur lokal verfügbar",
        description:
          "Der Installer steht nur auf einer lokalen Erstinstallation bereit.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Installationsstatus wurde nicht gefunden.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen.",
      },
      server: {
        title: "Serverfehler",
        description: "Lokaler Installationsstatus konnte nicht gelesen werden.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      },
      unsavedChanges: {
        title: "Konflikt",
        description: "Der Status hat sich während des Lesens geändert.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt beim Installationsstatus.",
      },
    },
  },
  post: {
    title: "Installer-Aktion ausführen",
    titleShort: "Installer-Aktion",
    description:
      "Lokale Prüfungen erneuern oder optional ein privates GitHub-Repository einrichten.",
    tags: {
      installer: "Installer",
    },
    request: {
      action: {
        label: "Aktion",
        description: "Auszuführende Installer-Aktion.",
      },
      repoName: {
        label: "Name des privaten Repositories",
        description: "Repository-Name in deinem GitHub-Konto.",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "Ergebnis" },
    },
    success: {
      title: "Aktion abgeschlossen",
      description: "Installer-Aktion erfolgreich ausgeführt.",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Aktion oder ungültiger Repository-Name.",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmeldung erforderlich.",
      },
      forbidden: {
        title: "Nur lokal verfügbar",
        description:
          "Installer-Aktionen sind nur auf einer lokalen Erstinstallation erlaubt.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ein benötigtes lokales Werkzeug wurde nicht gefunden.",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "GitHub war nicht erreichbar. Prüfe deine Verbindung und versuche es erneut.",
      },
      server: {
        title: "Serverfehler",
        description: "Installer-Aktion fehlgeschlagen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      },
      unsavedChanges: {
        title: "Konflikt",
        description: "Der Status hat sich während der Aktion geändert.",
      },
      conflict: {
        title: "Repository existiert bereits",
        description: "Konflikt beim GitHub-Repository.",
      },
    },
  },
  errors: {
    localOnly:
      "Der Installer ist nur auf einer lokalen Erstinstallation verfügbar.",
    invalidRepoName:
      "Erlaubt sind Buchstaben, Zahlen, Punkte, Bindestriche und Unterstriche (maximal 100 Zeichen).",
    ghNotInstalled:
      "Die GitHub CLI (gh) ist hier nicht installiert. Nutze die manuelle Anleitung unten oder überspringe diesen Schritt.",
    ghAuthStartFailed:
      "GitHub-Geräteanmeldung konnte nicht gestartet werden. Führe 'gh auth login --web' im Terminal aus oder nutze die manuelle Anleitung.",
    ghNotSignedIn:
      "Melde dich zuerst bei GitHub an und versuche es dann erneut.",
    ghCreateFailed:
      "Das private GitHub-Repository konnte nicht erstellt oder gepusht werden. Prüfe deine GitHub-Rechte und versuche es erneut.",
  },
  actions: {
    refreshed: "Umgebungsprüfungen wurden aktualisiert.",
    githubAuthPending:
      "Gib den Einmalcode bei GitHub ein und klicke danach auf Anmeldung prüfen.",
    githubAuthReady: "Bei GitHub angemeldet als {{username}}.",
    githubAuthWaiting: "Warte auf Abschluss der GitHub-Anmeldung im Browser.",
    githubRepoCreated: "Privates Repository verbunden und gepusht.",
    githubSkipped:
      "GitHub-Einrichtung übersprungen. Du kannst später jederzeit ein Repository verbinden.",
    githubReset: "GitHub-Einrichtung wieder geöffnet.",
  },
  widget: {
    progressOf: "{{done}} von {{total}} Schritten bereit",
    title: "Deine lokale Installation steht.",
    titleIncomplete: "Lokale Installation abschließen",
    subtitle:
      "next-vibe läuft auf deinem Rechner. Verbinde optional ein eigenes privates GitHub-Repository und starte danach den Einrichtungsassistenten.",
    subtitleIncomplete:
      "Prüfe die Punkte unten, behebe markierte Hinweise und gehe dann weiter zum Einrichtungsassistenten.",
    checkoutLabel: "Ordner",
    stateFileLabel: "Statusdatei",
    recheck: "Neu prüfen",
    rechecking: "Prüfe...",
    copy: "Kopieren",
    copied: "Kopiert",
    steps: {
      git: {
        title: "Git",
        missingDetail: "Git wurde nicht im PATH gefunden.",
        missingRecovery:
          "Installiere git, öffne ein neues Terminal und starte den Installer erneut.",
      },
      bun: {
        title: "Bun-Laufzeit",
        missingDetail: "Bun wurde nicht im PATH gefunden.",
        missingRecovery:
          "Installiere Bun von https://bun.sh und starte den Installer erneut.",
      },
      clone: {
        title: "next-vibe Checkout",
        clonedDetail: "Geklont nach {{dir}}",
        existingDetail: "Vorhandener Checkout unverändert übernommen: {{dir}}",
        unknownDetail: "Aktiv im Ordner {{dir}}",
      },
      dependencies: {
        title: "Abhängigkeiten und CLI",
        readyDetail: "Pakete installiert und vibe CLI einsatzbereit.",
        missingDetail: "node_modules ist unvollständig.",
        missingRecovery: "Führe 'bun install' im Projektordner aus.",
      },
      github: {
        title: "Privates GitHub-Repository",
        optionalTag: "Optional",
        connectedDetail: "Origin zeigt auf {{url}}",
        skippedDetail:
          "Vorerst übersprungen. Updates kommen weiterhin direkt von next-vibe.",
        pendingDetail:
          "Optional. Behalte deine eigene private Kopie auf GitHub.",
      },
      server: {
        title: "Lokaler Server",
        readyDetail: "Läuft unter http://localhost:{{port}}",
      },
    },
    githubCard: {
      title: "Privates GitHub-Repository",
      badge: "Optional",
      body: "Lege ein eigenes privates Repository an, damit deine Anpassungen auf GitHub privat bleiben und upstream weiter auf next-vibe zeigt.",
      connectedTitle: "Privates Repository verbunden",
      connectedOpen: "Auf GitHub öffnen",
      skippedNotice:
        "GitHub-Einrichtung übersprungen. Du kannst jederzeit später ein privates Repository verbinden.",
      reopenButton: "GitHub einrichten",
      skipButton: "Vorerst überspringen",
      signedInAs: "Bei GitHub angemeldet als {{username}}",
      repoNameLabel: "Name des privaten Repositories",
      repoNameHelp:
        "Wird als privates Repository in deinem GitHub-Konto erstellt. Upstream bleibt mit next-vibe verknüpft.",
      createButton: "Privates Repository erstellen",
      creatingButton: "Erstelle und pushe...",
      signInButton: "Mit GitHub anmelden",
      startingSignIn: "Starte Anmeldung...",
      deviceTitle: "Anmeldung auf GitHub bestätigen",
      deviceBody:
        "Kopiere den Einmalcode, öffne die GitHub-Geräteseite und bestätige den Zugriff. Diese Seite speichert keine Tokens.",
      deviceOpenLink: "GitHub-Geräteseite öffnen",
      deviceCheckButton: "Angemeldet, erneut prüfen",
      manualTitle: "Manuelle Einrichtung (ohne GitHub CLI)",
      manualBody:
        "Die GitHub CLI (gh) ist nicht installiert. Erstelle ein leeres privates Repository auf GitHub und führe diese drei Befehle im Projektordner aus.",
      manualNewRepoLink: "Privates Repository auf GitHub anlegen",
      manualShowCommands: "Git-Befehle anzeigen",
      manualHideCommands: "Git-Befehle ausblenden",
    },
    handover: {
      continueToSetup: "Weiter zum Einrichtungsassistenten",
      openApp: "App öffnen",
      hint: "Als Nächstes: Admin-Zugang festlegen und dein unbottled.ai-Konto oder eigene API-Keys verbinden.",
      completeHint:
        "Die Ersteinrichtung ist auf dieser Instanz bereits abgeschlossen.",
    },
  },
};
