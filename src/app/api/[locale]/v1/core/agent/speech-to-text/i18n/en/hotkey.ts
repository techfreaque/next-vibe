/**
 * Speech-to-Text Hotkey English translations
 */

export const hotkeyTranslations = {
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
      dependenciesMissing: "Required dependencies not available: {missing}. {recommendations}",
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
};
