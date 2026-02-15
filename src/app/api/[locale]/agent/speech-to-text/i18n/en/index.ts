/**
 * Speech-to-Text English translations
 */

export const translations = {
  hotkey: {
    post: {
      title: "Speech-to-Text Hotkey",
      description: "Record and transcribe audio with automatic text insertion",
      form: {
        title: "Hotkey Configuration",
        description: "Configure speech-to-text hotkey settings",
      },
      action: {
        label: "Action",
        description: "Action to perform (start/stop/toggle)",
      },
      provider: {
        label: "Provider",
        description: "AI provider for transcription",
      },
      language: {
        label: "Language",
        description: "Language of the audio",
      },
      insertPrefix: {
        label: "Insert Prefix",
        description: "Text to insert before transcription",
        placeholder: "e.g., '> '",
      },
      insertSuffix: {
        label: "Insert Suffix",
        description: "Text to insert after transcription",
        placeholder: "e.g., ' '",
      },
      response: {
        title: "Result",
        description: "Recording and transcription result",
        success: "Success",
        status: "Status",
        message: "Message",
        text: "Transcribed Text",
        recordingDuration: "Recording Duration (ms)",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to use this feature",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Failed to process recording",
        },
        conflict: {
          title: "Conflict",
          description: "Recording already in progress",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to use this feature",
        },
        network: {
          title: "Network Error",
          description: "Failed to connect to transcription service",
        },
        notFound: {
          title: "Not Found",
          description: "Session not found",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Recording in progress",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        dependenciesMissing:
          "Required dependencies not available: {missing}. {recommendations}",
        invalidAction: "Invalid action: {action}",
        actionFailed: "Failed to perform action: {error}",
        alreadyRecording: "Recording already in progress",
        notRecording: "No recording in progress",
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
    tags: {
      hotkey: "Hotkey",
      cli: "CLI",
    },
    platforms: {
      macos: "macOS",
      linuxWayland: "Linux (Wayland)",
      linuxX11: "Linux (X11)",
      windows: "Windows",
    },
    status: {
      idle: "Idle",
      recording: "Recording",
      processing: "Processing",
      completed: "Completed",
      error: "Error",
    },
    actions: {
      start: "Start Recording",
      stop: "Stop Recording",
      toggle: "Toggle Recording",
      status: "Check Status",
    },
    recorderBackends: {
      ffmpegAvfoundation: "FFmpeg (AVFoundation)",
      ffmpegPulse: "FFmpeg (PulseAudio)",
      ffmpegAlsa: "FFmpeg (ALSA)",
      ffmpegDshow: "FFmpeg (DirectShow)",
      wfRecorder: "wf-recorder",
      arecord: "arecord",
    },
    typerBackends: {
      applescript: "AppleScript",
      wtype: "wtype",
      xdotool: "xdotool",
      wlClipboard: "wl-clipboard",
      xclip: "xclip",
      powershell: "PowerShell",
    },
  },
  post: {
    title: "Speech to Text",
    description:
      "Convert audio to text using AI transcription (0.013 credits per second, 0.78 credits per minute)",
    form: {
      title: "Audio Transcription",
      description:
        "Upload an audio file to transcribe (0.013 credits per second, 0.78 credits per minute)",
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
      transcriptionFailed: "Transcription failed: {{error}}",
      noAudioFile: "No audio file provided",
      internalError: "Internal server error",
      noPublicId: "No public ID received",
      pollFailed: "Failed to poll transcription results",
      failed: "Transcription failed",
      timeout: "Transcription timeout",
      creditsFailed: "Failed to deduct credits: {{error}}",
      providerError:
        "Transcription service error. Please try again or contact support if the issue persists.",
      balanceCheckFailed:
        "Unable to check your credit balance. Please try again",
      insufficientCredits:
        "You don't have enough credits for this transcription. Please add more credits to continue",
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
};

export default translations;
