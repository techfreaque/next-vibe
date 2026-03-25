// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    image: "Bild",
    generation: "Generierung",
    ai: "KI",
  },
  post: {
    title: "Bild generieren",
    description: "Erstelle ein Bild aus einer Textbeschreibung mit KI",
    form: {
      title: "Bildgenerierung",
      description: "Gib eine Beschreibung ein, um ein Bild zu generieren",
    },
    prompt: {
      label: "Beschreibung",
      description: "Beschreibe das Bild, das du generieren möchtest",
      placeholder: "Ein Sonnenuntergang über einem Bergsee, fotorealistisch...",
    },
    model: {
      label: "Modell",
      description: "Wähle ein Bildgenerierungsmodell",
    },
    size: {
      label: "Größe",
      description: "Wähle die Ausgabebildgröße",
      square1024: "Quadrat (1024×1024)",
      landscape1792: "Querformat (1792×1024)",
      portrait1792: "Hochformat (1024×1792)",
    },
    quality: {
      label: "Qualität",
      description: "Wähle die Ausgabebildqualität",
      standard: "Standard",
      hd: "HD",
    },
    threadId: {
      label: "Thread-ID",
      description:
        "Optionale Thread-ID, um das generierte Bild als Chat-Nachricht zu speichern",
    },
    response: {
      imageUrl: "URL des generierten Bildes",
      creditCost: "Verwendete Credits",
      messageId: "Nachrichten-ID",
    },
    errors: {
      validation_failed: {
        title: "Validierungsfehler",
        description: "Bitte überprüfe deine Beschreibung und Einstellungen",
      },
      network_error: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Bildgenerierungsdienst fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Bitte melde dich an, um Bilder zu generieren",
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
          "Ein unerwarteter Fehler ist bei der Bildgenerierung aufgetreten",
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
        description: "Bei der Bildgenerierung ist ein Konflikt aufgetreten",
      },
      notAnImageModel:
        "Das ausgewählte Modell unterstützt keine Bildgenerierung. Bitte wähle ein Bildmodell.",
      notConfigured:
        "{{label}} ist nicht konfiguriert. Füge {{envKey}} zu deiner .env-Datei hinzu. Hol dir deinen Schlüssel unter {{url}}",
      insufficientCredits:
        "Nicht genug Credits. Guthaben: {{balance}}, erforderlich: {{minimum}}",
      balanceCheckFailed: "Kontostand konnte nicht geprüft werden",
      generationFailed: "Bildgenerierung fehlgeschlagen: {{error}}",
      providerError: "Anbieter-Fehler: {{error}}",
      noImageUrl: "Kein Bild-URL vom Anbieter zurückgegeben",
      creditsFailed:
        "Credits für Bildgenerierung konnten nicht abgezogen werden",
    },
    success: {
      title: "Bild generiert",
      description: "Dein Bild wurde erfolgreich generiert",
    },
  },
} as const;
