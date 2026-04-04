// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    music: "Musik",
    generation: "Generierung",
    ai: "KI",
  },
  post: {
    title: "Musik generieren",
    dynamicTitle: "Musik: {{prompt}}",
    description: "Generiere Musik aus einer Textbeschreibung mit KI",
    form: {
      title: "Musikgenerierung",
      description: "Gib eine Beschreibung ein, um Musik zu generieren",
    },
    prompt: {
      label: "Beschreibung",
      description: "Beschreibe die Musik, die du generieren möchtest",
      placeholder:
        "Mitreißende elektronische Musik mit einer eingängigen Melodie...",
    },
    model: {
      label: "Modell",
      description: "Wähle ein Musikgenerierungsmodell",
    },
    duration: {
      label: "Dauer",
      description: "Länge des generierten Audioclips",
      short: "Kurz (~8 Sek.)",
      medium: "Mittel (~20 Sek.)",
      long: "Lang (~30 Sek.)",
    },
    download: "Herunterladen",
    separator: "·",
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      text: "Musik generieren",
      label: "Musik generieren",
      loadingText: "Generiere...",
    },
    response: {
      audioUrl: "URL des generierten Audios",
      creditCost: "Verwendete Credits",
      durationSeconds: "Dauer in Sekunden",
      inputRef: "Eingabe-Medienreferenz",
      jobId: "Asynchrone Job-ID",
    },
    errors: {
      validation_failed: {
        title: "Validierungsfehler",
        description: "Bitte überprüfe deine Beschreibung und Einstellungen",
      },
      network_error: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Musikgenerierungsdienst fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Bitte melde dich an, um Musik zu generieren",
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
          "Ein unerwarteter Fehler ist bei der Musikgenerierung aufgetreten",
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
        description: "Bei der Musikgenerierung ist ein Konflikt aufgetreten",
      },
      notAnAudioModel:
        "Das ausgewählte Modell unterstützt keine Musikgenerierung. Bitte wähle ein Musikmodell.",
      notConfigured:
        "{{label}} ist nicht konfiguriert. Füge {{envKey}} zu deiner .env-Datei hinzu. Hol dir deinen Schlüssel unter {{url}}",
      insufficientCredits:
        "Nicht genug Credits. Guthaben: {{balance}}, erforderlich: {{minimum}}",
      balanceCheckFailed: "Kontostand konnte nicht geprüft werden",
      unsupportedDuration:
        "Modell {{model}} unterstützt die Dauer {{duration}} nicht. Unterstützte Dauern: {{supported}}",
      generationFailed: "Musikgenerierung fehlgeschlagen",
      providerError: "Anbieter-Fehler: {{error}}",
      noAudioUrl: "Kein Audio-URL vom Anbieter zurückgegeben",
      creditsFailed:
        "Credits für Musikgenerierung konnten nicht abgezogen werden",
      apiKeyNotConfigured: "API-Schlüssel nicht konfiguriert",
      externalServiceError: "Externer Dienst-Fehler: {{message}}",
      requestAborted: "Anfrage wurde abgebrochen",
      requestTimedOut: "Zeitüberschreitung bei der Musikgenerierung",
      requestFailed: "Anfrage fehlgeschlagen: {{message}}",
      pollFailed: "Abfrage fehlgeschlagen mit Status {{status}}",
    },
    success: {
      title: "Musik generiert",
      description: "Deine Musik wurde erfolgreich generiert",
    },
  },
} as const;
