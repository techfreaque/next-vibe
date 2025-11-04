/**
 * Text-to-Speech German translations
 */

export const translations = {
  post: {
    title: "Text zu Sprache",
    description: "Konvertieren Sie Text in natürlich klingende Sprache mit KI",
    form: {
      title: "Text-zu-Sprache-Konvertierung",
      description: "Geben Sie Text ein, um ihn in Sprache umzuwandeln",
    },
    text: {
      label: "Text",
      description: "In Sprache umzuwandelnder Text",
      placeholder:
        "Geben Sie den Text ein, den Sie in Sprache umwandeln möchten...",
    },
    provider: {
      label: "Anbieter",
      description: "KI-Anbieter für Sprachsynthese",
    },
    voice: {
      label: "Stimme",
      description: "Stimmtyp für Sprachsynthese",
    },
    language: {
      label: "Sprache",
      description: "Sprache für Sprachsynthese",
    },
    response: {
      title: "Audio-Ergebnis",
      description: "Die generierte Sprachaudio",
      success: "Erfolg",
      audioUrl: "Audio-URL",
      provider: "Verwendeter Anbieter",
    },
    errors: {
      validation_failed: {
        title: "Validierungsfehler",
        description: "Der angegebene Text oder die Parameter sind ungültig",
      },
      network_error: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Text-zu-Sprache zu verwenden",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, Text-zu-Sprache zu verwenden",
      },
      not_found: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server_error: {
        title: "Serverfehler",
        description:
          "Beim Konvertieren von Text zu Sprache ist ein Fehler aufgetreten",
      },
      unknown_error: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsaved_changes: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      apiKeyMissing: "Eden AI API-Schlüssel ist nicht konfiguriert",
      conversionFailed: "Sprachsynthese fehlgeschlagen: {error}",
      noText: "Kein Text angegeben",
      noAudioUrl: "Keine Audio-URL vom Anbieter erhalten",
      audioFetchFailed: "Fehler beim Abrufen der Audiodatei",
      providerError: "Anbieterfehler: {error}",
      internalError: "Interner Serverfehler",
    },
    success: {
      title: "Erfolg",
      description: "Text erfolgreich in Sprache umgewandelt",
      conversionComplete: "Sprachsynthese erfolgreich abgeschlossen",
    },
  },
  providers: {
    openai: "OpenAI",
    google: "Google Text-to-Speech",
    amazon: "Amazon Polly",
    microsoft: "Microsoft Azure",
    ibm: "IBM Watson",
    lovoai: "Lovo AI",
  },
  voices: {
    MALE: "Männlich",
    FEMALE: "Weiblich",
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
    es: "Spanisch",
    fr: "Französisch",
    it: "Italienisch",
  },
};

export default translations;
