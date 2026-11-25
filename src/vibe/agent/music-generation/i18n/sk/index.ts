import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    music: "Hudba",
    generation: "Tvorba",
    ai: "AI",
  },
  post: {
    title: "Vytvoriť hudbu",
    titleShort: "Vytvoriť hudbu",
    dynamicTitle: "Hudba: {{prompt}}",
    description:
      "Vytvorí hudbu podľa textového zadania. Dostupné modely nájdeš v nástroji models s parametrom modelType=audio. Zadaj ID modelu alebo nechaj pole prázdne pre predvolený model používateľa. Ak chceš preniesť štýl z inej nahrávky, zadaj jej adresu do inputMediaUrl. Výsledok obsahuje audioUrl a durationSeconds.",
    form: {
      title: "Tvorba hudby",
      description: "Zadaj, akú hudbu chceš vytvoriť.",
    },
    prompt: {
      label: "Zadanie",
      description: "Opíš, ako má hudba znieť.",
      placeholder: "Energická elektronická hudba s chytľavou melódiou…",
    },
    model: {
      label: "Vzor",
      description:
        "ID modelu na tvorbu hudby. Ak pole necháš prázdne, použije sa predvolený model používateľa. Dostupné modely nájdeš v nástroji models (modelType=audio).",
    },
    duration: {
      label: "Trvanie",
      description: "Dĺžka vytvorenej zvukovej ukážky",
      short: "Krátka (asi 8 s)",
      medium: "Stredná (asi 20 s)",
      long: "Dlhá (asi 30 s)",
    },
    inputMediaUrl: {
      label: "URL zvukovej predlohy",
      description:
        "Adresa nahrávky, z ktorej model prevezme štýl alebo vytvorí remix. Túto možnosť majú iba modely so zvukovým vstupom.",
      placeholder: "https://example.com/audio.mp3",
    },
    download: "Stiahnuť",
    separator: "·",
    backButton: {
      label: "Späť",
    },
    submitButton: {
      text: "Vytvoriť hudbu",
      label: "Vytvoriť hudbu",
      loadingText: "Vytvára sa…",
    },
    response: {
      audioUrl: "URL vytvoreného zvuku",
      creditCost: "Spotrebované kredity",
      durationSeconds: "Trvanie v sekundách",
      jobId: "ID asynchrónnej úlohy",
    },
    errors: {
      referenceUnavailable:
        "Zvuková predloha už nie je dostupná. Mohla byť odstránená alebo môže patriť do chatu, ku ktorému nemáš prístup. Použi zvuk z tohto chatu alebo nahrávku nahraj znova.",
      validation_failed: {
        title: "Chyba overenia",
        description: "Skontroluj zadanie a nastavenia.",
      },
      network_error: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k službe na tvorbu hudby.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš vytvárať hudbu, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Na použitie tejto funkcie nemáš oprávnenie.",
      },
      not_found: {
        title: "Nenašlo sa",
        description: "Požadovaný model sa nenašiel",
      },
      server_error: {
        title: "Chyba servera",
        description: "Pri tvorbe hudby nastala neočakávaná chyba.",
      },
      unknown_error: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsaved_changes: {
        title: "Neuložené zmeny",
        description: "Pred spustením tvorby si ulož zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri tvorbe hudby nastal konflikt.",
      },
      noModelConfigured:
        "Chýba model na tvorbu hudby. Vyber si ho v nastaveniach obľúbených modelov.",
      notAnAudioModel:
        "Vybraný model nevie vytvárať hudbu. Zvoľ model na tvorbu hudby.",
      notConfigured:
        "Chýba konfigurácia služby {{label}}. Pridaj {{envKey}} do súboru .env. Kľúč získaš na {{url}}.",
      providerUnsupported: "{{label}} zatiaľ nemá podporu",
      insufficientCredits:
        "Nedostatok kreditov. Zostatok: {{balance}}. Potrebné množstvo: {{minimum}}.",
      balanceCheckFailed: "Nepodarilo sa overiť zostatok kreditov",
      unsupportedDuration:
        "Model {{model}} nepodporuje dĺžku {{duration}}. Dostupné dĺžky: {{supported}}",
      generationFailed: "Hudbu sa nepodarilo vytvoriť.",
      providerError: "Chyba poskytovateľa hudby: {{error}}",
      noAudioUrl: "Poskytovateľ nevrátil adresu zvukového súboru.",
      creditsFailed: "Kredity za vytvorenie hudby sa nepodarilo odpočítať.",
      apiKeyNotConfigured: "Nie je nastavený kľúč API.",
      externalServiceError: "Chyba externej služby: {{message}}",
      requestAborted: "Požiadavka sa zrušila.",
      requestTimedOut: "Čas na vytvorenie hudby vypršal.",
      requestFailed: "Požiadavka zlyhala: {{message}}",
      pollFailed: "Požiadavka na zistenie stavu zlyhala s kódom {{status}}.",
    },
    success: {
      title: "Hudba je hotová",
      description: "Hudbu sa podarilo vytvoriť",
    },
  },
  models: {
    names: {
      MUSICGEN_STEREO: "MusicGen Stereo",
      MUSIC_GEN: "ModelsLab Music Gen",
      ELEVENLABS_MUSIC: "ElevenLabs Music",
      CASSETTE_MUSIC: "CassetteAI Music",
      SONAUTO_SONG: "Sonauto Song",
      LYRIA_3: "Lyria 3",
      LYRIA_3_PRO_PREVIEW: "Lyria 3 Pro Preview",
      LYRIA_3_CLIP_PREVIEW: "Lyria 3 Clip Preview",
    },
  },
};
