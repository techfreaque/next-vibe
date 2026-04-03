import type { translations as enTranslations } from "../en";

/**
 * Text-to-Speech German translations
 */

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    speech: "Sprache",
    tts: "Text-zu-Sprache",
    ai: "KI",
  },

  post: {
    title: "Text zu Sprache",
    description:
      "Konvertieren Sie Text in natürlich klingende Sprache mit KI (~0,00052 Credits pro Zeichen)",
    form: {
      title: "Text-zu-Sprache-Konvertierung",
      description:
        "Geben Sie Text ein, um ihn in Sprache umzuwandeln (OpenAI TTS: ~0,00052 Credits pro Zeichen)",
    },
    text: {
      label: "Text",
      description: "In Sprache umzuwandelnder Text",
      placeholder:
        "Geben Sie den Text ein, den Sie in Sprache umwandeln möchten...",
    },
    voice: {
      label: "Stimme",
      description: "Stimmmodell für Sprachsynthese",
    },
    response: {
      title: "Audio-Ergebnis",
      description: "Die generierte Sprachaudio",
      success: "Erfolg",
      audioUrl: "Audio-URL",
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
      notConfigured:
        "{{label}} API-Schlüssel nicht konfiguriert. Fügen Sie {{envKey}}=<ihr-schlüssel> zu Ihrer .env-Datei hinzu. Holen Sie sich Ihren Schlüssel auf {{url}}",
      conversionFailed: "Sprachsynthese fehlgeschlagen: {{error}}",
      noText: "Kein Text angegeben",
      noAudioUrl: "Keine Audio-URL vom Anbieter erhalten",
      audioFetchFailed: "Fehler beim Abrufen der Audiodatei",
      providerError: "Anbieterfehler: {{error}}",
      internalError: "Interner Serverfehler",
      unsupportedProvider:
        "Nicht unterstützter TTS-Anbieter für Stimme: {{voiceId}}",
      creditsFailed: "Fehler beim Abziehen der Credits: {{error}}",
      balanceCheckFailed:
        "Ihr Guthaben konnte nicht überprüft werden. Bitte versuchen Sie es erneut",
      insufficientCredits:
        "Sie haben nicht genügend Credits für diese Konvertierung. Bitte fügen Sie weitere Credits hinzu, um fortzufahren",
    },
    success: {
      title: "Erfolg",
      description: "Text erfolgreich in Sprache umgewandelt",
      conversionComplete: "Sprachsynthese erfolgreich abgeschlossen",
    },
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
    es: "Spanisch",
    fr: "Französisch",
    it: "Italienisch",
  },
  models: {
    descriptions: {
      openaiAlloy: "OpenAI Alloy",
      openaiNova: "OpenAI Nova",
      openaiOnyx: "OpenAI Onyx",
      openaiEcho: "OpenAI Echo",
      openaiShimmer: "OpenAI Shimmer",
      openaiFable: "OpenAI Fable",
      elevenlabsRachel: "ElevenLabs Rachel",
      elevenlabsJosh: "ElevenLabs Josh",
      elevenlabsBella: "ElevenLabs Bella",
      elevenlabsAdam: "ElevenLabs Adam",
    },
  },
};

export default translations;
