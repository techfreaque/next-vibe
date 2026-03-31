// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    video: "Video",
    generation: "Generierung",
    ai: "KI",
  },
  post: {
    title: "Video generieren",
    dynamicTitle: "Video: {{prompt}}",
    description: "Generiere ein Video aus einer Textbeschreibung mit KI",
    form: {
      title: "Videogenerierung",
      description: "Gib eine Beschreibung ein, um ein Video zu generieren",
    },
    prompt: {
      label: "Beschreibung",
      description: "Beschreibe das Video, das du generieren möchtest",
      placeholder:
        "Eine kinematografische Aufnahme eines Bergsees bei Sonnenuntergang...",
    },
    model: {
      label: "Modell",
      description: "Wähle ein Videogenerierungsmodell",
    },
    duration: {
      label: "Dauer",
      description: "Länge des generierten Videoclips",
      short: "Kurz (~5 Sek.)",
      medium: "Mittel (~10 Sek.)",
      long: "Lang (~15 Sek.)",
    },
    download: "Herunterladen",
    generatingNote: "Videogenerierung kann 1–3 Minuten dauern",
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      text: "Video generieren",
      label: "Video generieren",
      loadingText: "Generiere...",
    },
    response: {
      videoUrl: "URL des generierten Videos",
      creditCost: "Verwendete Credits",
      durationSeconds: "Dauer in Sekunden",
      jobId: "Asynchrone Job-ID",
    },
    errors: {
      validation_failed: {
        title: "Validierungsfehler",
        description: "Bitte überprüfe deine Beschreibung und Einstellungen",
      },
      network_error: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Videogenerierungsdienst fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Bitte melde dich an, um Videos zu generieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Du hast keine Berechtigung, diese Funktion zu nutzen",
      },
      not_found: {
        title: "Nicht gefunden",
        description: "Das angeforderte Modell wurde nicht gefunden",
      },
      server_error: {
        title: "Serverfehler",
        description:
          "Ein unerwarteter Fehler ist bei der Videogenerierung aufgetreten",
      },
      unknown_error: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved_changes: {
        title: "Nicht gespeicherte Änderungen",
        description: "Bitte speichere deine Änderungen, bevor du generierst",
      },
      conflict: {
        title: "Konflikt",
        description: "Bei der Videogenerierung ist ein Konflikt aufgetreten",
      },
      notAVideoModel:
        "Das ausgewählte Modell unterstützt keine Videogenerierung. Bitte wähle ein Videomodell.",
      notConfigured:
        "{{label}} ist nicht konfiguriert. Füge {{envKey}} zu deiner .env-Datei hinzu. Hol dir deinen Schlüssel unter {{url}}",
      insufficientCredits:
        "Nicht genug Credits. Guthaben: {{balance}}, erforderlich: {{minimum}}",
      balanceCheckFailed: "Kontostand konnte nicht geprüft werden",
      generationFailed: "Videogenerierung fehlgeschlagen: {{error}}",
      providerError: "Anbieter-Fehler: {{error}}",
      noVideoUrl: "Kein Video-URL vom Anbieter zurückgegeben",
      creditsFailed:
        "Credits für Videogenerierung konnten nicht abgezogen werden",
    },
    success: {
      title: "Video generiert",
      description: "Dein Video wurde erfolgreich generiert",
    },
  },
} as const;
