export const translations = {
  category: "Release-Executor",
  releaseExecutor: {
    processing: "Verarbeite: {{directory}}",
    executing: "Führe aus: {{command}}",
    completed: "Erfolgreich abgeschlossen: {{directory}}",
    failed: "Fehler bei der Verarbeitung von {{directory}}",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",

    state: {
      continuing: "Setze vorherigen Zustand fort...",
      noState: "Kein vorheriger Zustand gefunden, starte neu...",
      allCompleted: "Alle Ziele wurden erfolgreich verarbeitet!",
    },

    prompts: {
      retryFailed: "{{count}} fehlgeschlagene Ziele wiederholen?",
      targetAction: "Was möchten Sie mit {{directory}} tun?",
      processTarget: "Dieses Ziel verarbeiten",
      skipTarget: "Dieses Ziel überspringen",
      abortOperation: "Gesamten Vorgang abbrechen",
      continueAfterFailure: "Mit verbleibenden Zielen fortfahren?",
    },

    actions: {
      skipped: "Übersprungen: {{directory}}",
      aborted: "Vorgang vom Benutzer abgebrochen",
      stopped: "Vorgang aufgrund eines Fehlers gestoppt",
      continuing: "Fahre mit verbleibenden Zielen fort...",
    },

    summary: {
      title: "Abschließende Zusammenfassung:",
      allSuccess: "Alle Ziele erfolgreich verarbeitet!",
      failedTargets:
        "{{count}} Ziele fehlgeschlagen. Verwenden Sie --continue zum Wiederholen.",
    },

    forceUpdate: {
      starting: "Erzwinge Aktualisierung der Abhängigkeiten für alle Ziele...",
      updating: "Aktualisiere: {{directory}}",
      updated: "Aktualisiert: {{directory}}",
      failed: "Fehler beim Aktualisieren von {{directory}}",
      completed: "Erzwungene Aktualisierung für alle Ziele abgeschlossen!",
    },

    forceRelease: {
      starting:
        "Erzwinge Release aller Ziele mit {{versionBump}} Versionserhöhung...",
    },

    weeklyUpdate: {
      starting: "Starte wöchentlichen Update-Prozess...",
      targetBranch: "Ziel-Branch: {{branchName}}",
      creatingBranch: "Erstelle Update-Branch...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages: "Aktualisiere alle Paket-Abhängigkeiten...",
      runningSnyk: "Führe Snyk-Sicherheitsüberwachung durch...",
      noChanges:
        "Keine Änderungen erkannt, überspringe Commit und PR-Erstellung",
      committing: "Erstelle Commit...",
      pushing: "Pushe Branch...",
      gitPush: "git push origin {{branchName}}",
      creatingPR: "Erstelle/aktualisiere Pull Request...",
      completed: "Wöchentliches Update erfolgreich abgeschlossen!",
      failed: "Wöchentliches Update fehlgeschlagen:",
    },

    snyk: {
      noCredentials:
        "Snyk-Zugangsdaten nicht gefunden, überspringe Sicherheitsüberwachung",
      monitoring: "Überwache {{packageName}}...",
      failed:
        "Snyk-Überwachung für {{packageFile}} fehlgeschlagen, fahre fort...",
    },

    github: {
      noToken: "GITHUB_TOKEN nicht gefunden, überspringe PR-Erstellung",
      prFailed: "PR-Erstellung fehlgeschlagen, fahre fort...",
      prError: "PR-Erstellungsfehler:",
      prSuccess: "PR erfolgreich erstellt/aktualisiert",
    },

    git: {
      findCommand:
        'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },
};
