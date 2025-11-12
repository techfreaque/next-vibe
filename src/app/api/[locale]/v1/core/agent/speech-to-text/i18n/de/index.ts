/**
 * Speech-to-Text German translations
 */

import { hotkeyTranslations } from "./hotkey";

export const translations = {
  hotkey: hotkeyTranslations,
  post: {
    title: "Sprache zu Text",
    description: "Konvertieren Sie Audio in Text mit KI-Transkription",
    form: {
      title: "Audio-Transkription",
      description: "Laden Sie eine Audiodatei zum Transkribieren hoch",
    },
    fileUpload: {
      title: "Audiodatei-Upload",
      description: "Laden Sie Ihre Audiodatei zur Transkription hoch",
    },
    audio: {
      label: "Audiodatei",
      description: "Zu transkribierende Audiodatei (MP3, WAV, WebM usw.)",
      validation: {
        maxSize: "Dateigröße muss unter 25 MB liegen",
        audioOnly: "Bitte laden Sie eine Audio- oder Videodatei hoch",
      },
    },
    provider: {
      label: "Anbieter",
      description: "KI-Anbieter für Transkription",
    },
    language: {
      label: "Sprache",
      description: "Sprache der Audiodatei",
    },
    response: {
      title: "Transkriptionsergebnis",
      description: "Der transkribierte Text aus Ihrer Audiodatei",
      success: "Erfolg",
      text: "Transkribierter Text",
      provider: "Verwendeter Anbieter",
      confidence: "Konfidenzwert",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um diese Funktion zu nutzen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Die Audiodatei oder Parameter sind ungültig",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Verarbeiten der Transkription",
      },
      apiKeyMissing: "Eden AI API-Schlüssel ist nicht konfiguriert",
      transcriptionFailed: "Transkription fehlgeschlagen: {error}",
      noAudioFile: "Keine Audiodatei bereitgestellt",
      internalError: "Interner Serverfehler",
      noPublicId: "Keine öffentliche ID erhalten",
      pollFailed: "Fehler beim Abrufen der Transkriptionsergebnisse",
      failed: "Transkription fehlgeschlagen",
      timeout: "Transkriptions-Zeitüberschreitung",
    },
    success: {
      title: "Erfolg",
      description: "Audio erfolgreich transkribiert",
      transcriptionComplete: "Transkription erfolgreich abgeschlossen",
    },
  },
  providers: {
    openai: "OpenAI Whisper",
    assemblyai: "AssemblyAI",
    deepgram: "Deepgram",
    google: "Google Speech-to-Text",
    amazon: "Amazon Transcribe",
    microsoft: "Microsoft Azure",
    ibm: "IBM Watson",
    rev: "Rev.ai",
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
