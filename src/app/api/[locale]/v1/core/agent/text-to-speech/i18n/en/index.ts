/**
 * Text-to-Speech English translations
 */

export const translations = {
  post: {
    title: "Text to Speech",
    description: "Convert text to natural-sounding speech using AI",
    form: {
      title: "Text to Speech Conversion",
      description: "Enter text to convert to speech",
    },
    text: {
      label: "Text",
      description: "Text to convert to speech",
      placeholder: "Enter the text you want to convert to speech...",
    },
    provider: {
      label: "Provider",
      description: "AI provider for speech synthesis",
    },
    voice: {
      label: "Voice",
      description: "Voice type for speech synthesis",
    },
    language: {
      label: "Language",
      description: "Language for speech synthesis",
    },
    response: {
      title: "Audio Result",
      description: "The generated speech audio",
      success: "Success",
      audioUrl: "Audio URL",
      provider: "Provider Used",
    },
    errors: {
      validation_failed: {
        title: "Validation Error",
        description: "The provided text or parameters are invalid",
      },
      network_error: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to use text-to-speech",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to use text-to-speech",
      },
      not_found: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server_error: {
        title: "Server Error",
        description: "An error occurred while converting text to speech",
      },
      unknown_error: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsaved_changes: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      apiKeyMissing: "Eden AI API key is not configured",
      conversionFailed: "Speech synthesis failed: {error}",
      noText: "No text provided",
      noAudioUrl: "No audio URL received from provider",
      audioFetchFailed: "Failed to fetch audio file",
      internalError: "Internal server error",
    },
    success: {
      title: "Success",
      description: "Text converted to speech successfully",
      conversionComplete: "Speech synthesis completed successfully",
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
    MALE: "Male",
    FEMALE: "Female",
  },
  languages: {
    en: "English",
    de: "German",
    pl: "Polish",
    es: "Spanish",
    fr: "French",
    it: "Italian",
  },
} as const;

export default translations;
