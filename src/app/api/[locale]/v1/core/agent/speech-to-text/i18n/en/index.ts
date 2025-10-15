/**
 * Speech-to-Text English translations
 */

export const translations = {
  post: {
    title: "Speech to Text",
    description: "Convert audio to text using AI transcription",
    form: {
      title: "Audio Transcription",
      description: "Upload an audio file to transcribe",
    },
    fileUpload: {
      title: "Audio File Upload",
      description: "Upload your audio file for transcription",
    },
    audio: {
      label: "Audio File",
      description: "Audio file to transcribe (MP3, WAV, WebM, etc.)",
      validation: {
        maxSize: "File size must be less than 25MB",
        audioOnly: "Please upload an audio or video file",
      },
    },
    provider: {
      label: "Provider",
      description: "AI provider for transcription",
    },
    language: {
      label: "Language",
      description: "Language of the audio",
    },
    response: {
      title: "Transcription Result",
      description: "The transcribed text from your audio",
      success: "Success",
      text: "Transcribed Text",
      provider: "Provider Used",
      confidence: "Confidence Score",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to use this feature",
      },
      validation: {
        title: "Validation Error",
        description: "The audio file or parameters are invalid",
      },
      server: {
        title: "Server Error",
        description: "Failed to process the transcription",
      },
      apiKeyMissing: "Eden AI API key is not configured",
      transcriptionFailed: "Transcription failed: {error}",
      noAudioFile: "No audio file provided",
      internalError: "Internal server error",
      noPublicId: "No public ID received",
      pollFailed: "Failed to poll transcription results",
      failed: "Transcription failed",
      timeout: "Transcription timeout",
    },
    success: {
      title: "Success",
      description: "Audio transcribed successfully",
      transcriptionComplete: "Transcription completed successfully",
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
    en: "English",
    de: "German",
    pl: "Polish",
    es: "Spanish",
    fr: "French",
    it: "Italian",
  },
} as const;

export default translations;
