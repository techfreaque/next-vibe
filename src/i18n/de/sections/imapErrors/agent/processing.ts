import type { processingTranslations as EnglishProcessingTranslations } from "../../../../en/sections/imapErrors/agent/processing";

export const processingTranslations: typeof EnglishProcessingTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, E-Mails über den Agent zu verarbeiten.",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Parameter für die E-Mail-Verarbeitung angegeben.",
    },
    server: {
      title: "Serverfehler",
      description: "Fehler beim Verarbeiten von E-Mails über den Agent.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Unbekannter Fehler bei der E-Mail-Verarbeitung aufgetreten.",
    },
    api_error: {
      title: "API-Fehler",
      description: "API-Anfrage fehlgeschlagen: {{error}}",
    },
    api_timeout: {
      title: "API-Zeitüberschreitung",
      description: "API-Anfrage hat das Zeitlimit überschritten",
    },
    api_key_not_configured: {
      title: "API-Schlüssel nicht konfiguriert",
      description: "API-Schlüssel ist nicht ordnungsgemäß konfiguriert",
    },
    llm_provider_unsupported: {
      title: "Nicht unterstützter LLM-Anbieter",
      description: "Der angegebene LLM-Anbieter wird nicht unterstützt",
    },
    template_not_found: {
      title: "Vorlage nicht gefunden",
      description: "Die angeforderte Prompt-Vorlage wurde nicht gefunden",
    },
    analysis_failed: {
      title: "Analyse fehlgeschlagen",
      description: "E-Mail-Analyse konnte nicht abgeschlossen werden",
    },
    response_generation_failed: {
      title: "Antwortgenerierung fehlgeschlagen",
      description: "E-Mail-Antwort konnte nicht generiert werden",
    },
  },
  success: {
    title: "Verarbeitung gestartet",
    description:
      "E-Mail-Verarbeitung über den Agent wurde erfolgreich gestartet.",
    analysis_completed:
      "Erweiterte KI-Analyse mit hoher Sicherheit abgeschlossen",
    ai_analysis_completed: "KI-Analyse erfolgreich abgeschlossen",
  },
};
