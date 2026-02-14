/**
 * Speech-to-Text German translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  hotkey: {
    post: {
      title: "Sprache-zu-Text-Hotkey",
      description:
        "Audio aufnehmen und transkribieren mit automatischer Texteinfügung",
      form: {
        title: "Hotkey-Konfiguration",
        description: "Sprache-zu-Text-Hotkey-Einstellungen konfigurieren",
      },
      action: {
        label: "Aktion",
        description: "Auszuführende Aktion (start/stop/toggle)",
      },
      provider: {
        label: "Anbieter",
        description: "KI-Anbieter für Transkription",
      },
      language: {
        label: "Sprache",
        description: "Sprache der Audiodatei",
      },
      insertPrefix: {
        label: "Präfix einfügen",
        description: "Text, der vor der Transkription eingefügt werden soll",
        placeholder: "z.B. '> '",
      },
      insertSuffix: {
        label: "Suffix einfügen",
        description: "Text, der nach der Transkription eingefügt werden soll",
        placeholder: "z.B. ' '",
      },
      response: {
        title: "Ergebnis",
        description: "Aufnahme- und Transkriptionsergebnis",
        success: "Erfolg",
        status: "Status",
        message: "Nachricht",
        text: "Transkribierter Text",
        recordingDuration: "Aufnahmedauer (ms)",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um diese Funktion zu nutzen",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anforderungsparameter",
        },
        server: {
          title: "Serverfehler",
          description: "Fehler beim Verarbeiten der Aufnahme",
        },
        conflict: {
          title: "Konflikt",
          description: "Aufnahme läuft bereits",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, diese Funktion zu nutzen",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Transkriptionsdienst fehlgeschlagen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Sitzung nicht gefunden",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Aufnahme läuft",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        dependenciesMissing:
          "Erforderliche Abhängigkeiten nicht verfügbar: {missing}. {recommendations}",
        invalidAction: "Ungültige Aktion: {action}",
        actionFailed: "Fehler beim Ausführen der Aktion: {error}",
        alreadyRecording: "Aufnahme läuft bereits",
        notRecording: "Keine Aufnahme läuft",
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
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
      idle: "Leerlauf",
      recording: "Aufnahme",
      processing: "Verarbeitung",
      completed: "Abgeschlossen",
      error: "Fehler",
    },
    actions: {
      start: "Aufnahme starten",
      stop: "Aufnahme stoppen",
      toggle: "Aufnahme umschalten",
      status: "Status prüfen",
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
    title: "Sprache zu Text",
    description:
      "Konvertieren Sie Audio in Text mit KI-Transkription (0,013 Credits pro Sekunde, 0,78 Credits pro Minute)",
    form: {
      title: "Audio-Transkription",
      description:
        "Laden Sie eine Audiodatei zum Transkribieren hoch (0,013 Credits pro Sekunde, 0,78 Credits pro Minute)",
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
      transcriptionFailed: "Transkription fehlgeschlagen: {{error}}",
      noAudioFile: "Keine Audiodatei bereitgestellt",
      internalError: "Interner Serverfehler",
      noPublicId: "Keine öffentliche ID erhalten",
      pollFailed: "Fehler beim Abrufen der Transkriptionsergebnisse",
      failed: "Transkription fehlgeschlagen",
      timeout: "Transkriptions-Zeitüberschreitung",
      creditsFailed: "Fehler beim Abziehen der Credits: {{error}}",
      providerError:
        "Fehler beim Transkriptionsdienst. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.",
      balanceCheckFailed:
        "Ihr Guthaben konnte nicht überprüft werden. Bitte versuchen Sie es erneut",
      insufficientCredits:
        "Sie haben nicht genügend Guthaben für diese Transkription. Bitte fügen Sie mehr Guthaben hinzu, um fortzufahren",
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
