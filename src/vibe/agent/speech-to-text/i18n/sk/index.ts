/**
 * Speech-to-Text English translations
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  hotkey: {
    post: {
      title: "Klávesová skratka na prepis reči",
      titleShort: "Skratka prepisu reči",
      description: "Nahrá zvuk, prepíše ho a automaticky vloží text.",
      form: {
        title: "Nastavenia klávesovej skratky",
        description: "Nastavte klávesovú skratku na prepis reči.",
      },
      action: {
        label: "Akcia",
        description: "Akcia, ktorá sa má vykonať (start, stop alebo toggle)",
      },
      provider: {
        label: "Poskytovateľ",
        description: "Poskytovateľ služby na prepis reči",
      },
      language: {
        label: "Jazyk",
        description: "Jazyk zvuku",
      },
      insertPrefix: {
        label: "Text pred prepisom",
        description: "Text, ktorý sa vloží pred prepis",
        placeholder: "napr. '> '",
      },
      insertSuffix: {
        label: "Text za prepisom",
        description: "Text, ktorý sa vloží za prepis",
        placeholder: "napr. ' '",
      },
      response: {
        title: "Výsledok",
        description: "Výsledok záznamu a prepisu",
        success: "Úspech",
        status: "Stav",
        message: "Správa",
        text: "Prepísaný text",
        recordingDuration: "Trvanie záznamu (ms)",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete použiť túto funkciu, prihláste sa.",
        },
        validation: {
          title: "Chyba overenia",
          description: "Neplatné parametre požiadavky",
        },
        server: {
          title: "Chyba servera",
          description: "Nepodarilo sa spracovať záznam",
        },
        conflict: {
          title: "Konflikt",
          description: "Nahrávanie už prebieha.",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Na použitie tejto funkcie nemáte oprávnenie.",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k službe na prepis reči.",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Relácia sa nenašla.",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Prebieha nahrávanie",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        dependenciesMissing:
          "Požadované závislosti nie sú k dispozícii: {{missing}}. {{recommendations}}",
        invalidAction: "Neplatná akcia: {{action}}",
        noActionProvided: "Nezadali ste žiadnu akciu.",
        actionFailed: "Akcia zlyhala: {{error}}",
        alreadyRecording: "Nahrávanie už prebieha.",
        notRecording: "Nahrávanie neprebieha.",
      },
      success: {
        title: "Úspech",
        description: "Operácia sa dokončila.",
      },
    },
    tags: {
      ai: "AI",
      transcription: "Prepis",
      speech: "Reč",
      hotkey: "Klávesová skratka",
      cli: "CLI",
    },
    platforms: {
      macos: "macOS",
      linuxWayland: "Linux (Wayland)",
      linuxX11: "Linux (X11)",
      windows: "Windows",
    },
    status: {
      idle: "Pripravené",
      recording: "Nahráva sa",
      processing: "Spracúva sa",
      completed: "Dokončené",
      error: "Chyba",
    },
    actions: {
      start: "Začať nahrávanie",
      stop: "Zastaviť nahrávanie",
      toggle: "Prepnúť nahrávanie",
      status: "Skontrolovať stav",
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
    download: "Stiahnuť",
    title: "Prepis reči na text",
    titleShort: "Prepis reči",
    dynamicTitle: "Prepis: {{text}}",
    description:
      "Prepíše zvuk na text. Nahrajte súbor vo formáte MP3, WAV alebo WebM s veľkosťou najviac 25 MB. Cena za sekundu závisí od vybraného modelu. Sadzby nájdete v nástroji models. Vo výsledku dostanete prepis, názov použitého poskytovateľa a mieru spoľahlivosti.",
    form: {
      title: "Prepis zvuku",
      description: "Nahrajte zvuk, ktorý chcete prepísať.",
    },
    fileUpload: {
      title: "Nahrať zvukový súbor",
      description: "Vyberte súbor na prepis.",
    },
    audio: {
      label: "Zvukový súbor",
      description: "Zvukový súbor na prepis (MP3, WAV, WebM a ďalšie formáty)",
      validation: {
        maxSize: "Súbor musí byť menší ako 25 MB.",
        audioOnly: "Nahrajte zvukový súbor alebo video.",
      },
    },
    model: {
      label: "Model",
      description: "Model na prepis reči",
    },
    provider: {
      label: "Poskytovateľ",
      description: "Poskytovateľ služby na prepis reči",
    },
    language: {
      label: "Jazyk",
      description: "Jazyk zvuku",
    },
    response: {
      title: "Výsledok prepisu",
      description: "Text získaný zo zvukovej nahrávky",
      success: "Úspech",
      text: "Prepísaný text",
      provider: "Použitý poskytovateľ",
      confidence: "Miera spoľahlivosti",
      creditCost: "Spotrebované kredity",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete použiť túto funkciu, prihláste sa.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Zvukový súbor alebo parametre sú neplatné",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa spracovať prepis",
      },
      apiKeyMissing: "Kľúč API služby Eden AI nie je nastavený.",
      transcriptionFailed: "Prepis zlyhal: {{error}}",
      noSttProvider: "Nie je dostupný žiadny poskytovateľ prepisu reči.",
      unsupportedProvider:
        "Nepodporovaný poskytovateľ prepisu reči: {{provider}}",
      noSttProviderConfigured:
        "Chýba konfigurácia poskytovateľa prepisu reči. Pridajte OPENAI_API_KEY, EDEN_AI_API_KEY alebo DEEPGRAM_API_KEY, prípadne pripojte systémového poskytovateľa modelov.",
      notConfigured:
        "Chýba konfigurácia služby {{label}}. Pridaj {{envKey}} do súboru .env. Kľúč získaš na {{url}}.",
      audioTooShort:
        "Nahrávka je príliš krátka. Podržte tlačidlo dlhšie a hovorte zreteľne.",
      noAudioFile: "Chýba zvukový súbor.",
      internalError: "Interná chyba servera",
      noPublicId: "Poskytovateľ nevrátil verejné ID.",
      pollFailed: "Nepodarilo sa načítať výsledok prepisu.",
      failed: "Prepis zlyhal",
      timeout: "Vypršal čas na prepis.",
      creditsFailed: "Zlyhalo odpočítanie kreditov: {{error}}",
      providerError:
        "Služba na prepis reči ohlásila chybu. Skúste to znova. Ak chyba pretrváva, obráťte sa na podporu.",
      balanceCheckFailed:
        "Zostatok kreditov sa nepodarilo overiť. Skúste to znova.",
      insufficientCredits:
        "Na tento prepis nemáte dosť kreditov. Doplňte kredity a pokračujte.",
    },
    success: {
      title: "Prepis je hotový",
      description: "Zvuk sa podarilo prepísať.",
      transcriptionComplete: "Prepis je hotový.",
      transcribing: "Prepisuje sa…",
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
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    es: "Španielčina",
    sk: "Slovenčina",
    hi: "Hindčina",
    fr: "Francúzština",
    it: "Taliančina",
  },
  models: {
    descriptions: {
      qwen3Asr:
        "Qwen3 ASR prepisuje reč v 30 jazykoch a 22 čínskych nárečiach.",
      parakeetV3:
        "Prepisuje reč v 25 európskych jazykoch. Jazyk rozpozná a interpunkciu doplní automaticky.",
      nemotron35Transcribe:
        "NVIDIA Nemotron prepíše až hodinu zvuku v 40 jazykoch.",
      openaiWhisper:
        "OpenAI Whisper. Pokročilé rozpoznávanie reči v 99 jazykoch.",
      deepgramNova2:
        "Deepgram Nova-2. Rýchly, presný prepis aj pri okolitom hluku.",
      whisperLargeV3:
        "Whisper Large V3. Model OpenAI s otvorenými váhami a podporou 99 jazykov. Stojí výrazne menej než hostovaný whisper-1.",
      voxtralSmall: "Voxtral Small od Mistralu prepisuje nahranú reč.",
      voxtralMini:
        "Voxtral Mini Transcribe. Model od Mistralu prepíše nahrávky dlhé najviac 10 minút, rozlíši hovoriacich a doplní časové značky jednotlivých úsekov.",
      nemotronAsr:
        "Nemotron ASR. Otvorené viacjazyčné rozpoznávanie reči od NVIDIA. Podpora 40 jazykových variantov a nízke oneskorenie.",
      gpt4oMiniTranscribe:
        "GPT-4o Mini Transcribe. V porovnaní s modelom Whisper robí pri prepise menej chýb a lepšie rozpoznáva jazyk.",
    },
  },
};

export default translations;
