import type { translations as enTranslations } from "../en";

/**
 * Speech-to-Text Polish translations
 */

export const translations: typeof enTranslations = {
  hotkey: {
    post: {
      title: "Hotkey mowy na tekst",
      description: "Nagrywaj i transkrybuj audio z automatycznym wstawianiem tekstu",
      form: {
        title: "Konfiguracja hotkey",
        description: "Skonfiguruj ustawienia hotkey mowy na tekst",
      },
      action: {
        label: "Akcja",
        description: "Akcja do wykonania (start/stop/toggle)",
      },
      provider: {
        label: "Dostawca",
        description: "Dostawca AI do transkrypcji",
      },
      language: {
        label: "Język",
        description: "Język audio",
      },
      insertPrefix: {
        label: "Wstaw prefiks",
        description: "Tekst do wstawienia przed transkrypcją",
        placeholder: "np. '> '",
      },
      insertSuffix: {
        label: "Wstaw sufiks",
        description: "Tekst do wstawienia po transkrypcji",
        placeholder: "np. ' '",
      },
      response: {
        title: "Wynik",
        description: "Wynik nagrywania i transkrypcji",
        success: "Sukces",
        status: "Status",
        message: "Wiadomość",
        text: "Transkrybowany tekst",
        recordingDuration: "Czas nagrywania (ms)",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być zalogowany, aby korzystać z tej funkcji",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się przetworzyć nagrania",
        },
        conflict: {
          title: "Konflikt",
          description: "Nagrywanie już w toku",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do korzystania z tej funkcji",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z usługą transkrypcji",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Sesja nie znaleziona",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Nagrywanie w toku",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        dependenciesMissing:
          "Wymagane zależności niedostępne: {missing}. {recommendations}",
        invalidAction: "Nieprawidłowa akcja: {action}",
        actionFailed: "Nie udało się wykonać akcji: {error}",
        alreadyRecording: "Nagrywanie już w toku",
        notRecording: "Brak nagrywania w toku",
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
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
      idle: "Bezczynny",
      recording: "Nagrywanie",
      processing: "Przetwarzanie",
      completed: "Zakończono",
      error: "Błąd",
    },
    actions: {
      start: "Rozpocznij nagrywanie",
      stop: "Zatrzymaj nagrywanie",
      toggle: "Przełącz nagrywanie",
      status: "Sprawdź status",
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
    title: "Mowa na tekst",
    description: "Konwertuj audio na tekst za pomocą transkrypcji AI (~0,011 kredytów na sekundę)",
    form: {
      title: "Transkrypcja audio",
      description: "Prześlij plik audio do transkrypcji (Deepgram: ~0,011 kredytów na sekundę)",
    },
    fileUpload: {
      title: "Przesyłanie pliku audio",
      description: "Prześlij plik audio do transkrypcji",
    },
    audio: {
      label: "Plik audio",
      description: "Plik audio do transkrypcji (MP3, WAV, WebM itp.)",
      validation: {
        maxSize: "Rozmiar pliku musi być mniejszy niż 25 MB",
        audioOnly: "Proszę przesłać plik audio lub wideo",
      },
    },
    provider: {
      label: "Dostawca",
      description: "Dostawca AI do transkrypcji",
    },
    language: {
      label: "Język",
      description: "Język pliku audio",
    },
    response: {
      title: "Wynik transkrypcji",
      description: "Transkrybowany tekst z Twojego audio",
      success: "Sukces",
      text: "Transkrybowany tekst",
      provider: "Użyty dostawca",
      confidence: "Wynik pewności",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby korzystać z tej funkcji",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Plik audio lub parametry są nieprawidłowe",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się przetworzyć transkrypcji",
      },
      apiKeyMissing: "Klucz API Eden AI nie jest skonfigurowany",
      transcriptionFailed: "Transkrypcja nie powiodła się: {{error}}",
      noAudioFile: "Nie podano pliku audio",
      internalError: "Wewnętrzny błąd serwera",
      noPublicId: "Nie otrzymano publicznego ID",
      pollFailed: "Nie udało się pobrać wyników transkrypcji",
      failed: "Transkrypcja nie powiodła się",
      timeout: "Przekroczono limit czasu transkrypcji",
      creditsFailed: "Nie udało się potrącić kredytów: {{error}}",
      providerError: "Błąd usługi transkrypcji. Spróbuj ponownie lub skontaktuj się z pomocą techniczną, jeśli problem będzie się powtarzał.",
    },
    success: {
      title: "Sukces",
      description: "Audio transkrybowane pomyślnie",
      transcriptionComplete: "Transkrypcja zakończona pomyślnie",
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
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
    es: "Hiszpański",
    fr: "Francuski",
    it: "Włoski",
  },
};

export default translations;
