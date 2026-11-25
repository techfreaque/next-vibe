import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    threads: "Vlákna",
    folders: "Priečinky",
    files: "Súbory",
    messages: "Správy",
    characters: "Zručnosti",
    memories: "Spomienky",
    favorites: "Obľúbené",
    credits: "Kredity",
    balance: "Zostatok",
    permissions: "Oprávnenia",
    hotkey: "Klávesová skratka",
    cli: "CLI",
    speech: "Reč",
    sharing: "Zdieľanie",
    settings: "Nastavenia",
  },
  config: {
    appName: "unbottled.ai",
    folders: {
      private: "Súkromné",
      shared: "Zdieľané",
      public: "Verejné",
      incognito: "Inkognito",
      background: "Na pozadí",
      remote: "Vzdialené",
    },
    foldersShort: {
      private: "Súkromné",
      shared: "Zdieľané",
      public: "Verejné",
      incognito: "Inkognito",
      background: "Na pozadí",
      remote: "Vzdialené",
    },
  },
  enums: {
    role: {
      user: "Používateľ",
      assistant: "Asistent",
      system: "Systém",
      tool: "Nástroj",
      error: "Chyba",
    },
    threadModerationStatus: {
      visible: "Viditeľné",
      underReview: "V kontrole",
      removed: "Odobraté",
    },
    threadReportReason: {
      spam: "Nevyžiadaný obsah",
      illegal: "Nezákonný obsah",
      abuse: "Zneužívanie alebo obťažovanie",
      csamFlag: "Ohrozenie bezpečnosti detí",
      other: "Iné",
    },
    threadModerationAction: {
      dismiss: "Zamietnuť hlásenia a obnoviť obsah",
      remove: "Odstrániť obsah",
      banAuthor: "Odstrániť obsah a zablokovať autora",
    },
    threadStatus: {
      active: "Aktívne",
      archived: "Archivované",
      deleted: "Odstránené",
    },
    viewMode: {
      linear: "Lineárne",
      threaded: "Vo vláknach",
      flat: "Ploché",
      debug: "Ladenie",
    },
  },
  components: {
    sidebar: {
      login: "Prihlásiť sa",
      logout: "Odhlásiť sa",
      footer: {
        account: "Účet",
        profile: "Profil",
        balance: "Zostatok",
        buy: "Kúpiť",
        freeCreditsLeft: "Bezplatné kredity",
      },
    },
    credits: {
      credit: "{{count}} kredit",
      credits: "Kredity: {{count}}",
    },
    navigation: {
      subscription: "Predplatné a kredity",
      referral: "Program odporúčaní",
      help: "Pomoc",
      about: "O platforme",
    },
    confirmations: {
      deleteMessage: "Chcete odstrániť túto správu?",
    },
    welcomeTour: {
      authDialog: {
        title: "Odomknúť súkromné a zdieľané priečinky",
        description:
          "Zaregistrujte sa alebo sa prihláste a získate prístup k súkromným a zdieľaným priečinkom. Chaty sa budú synchronizovať medzi zariadeniami.",
        continueTour: "Pokračovať v prehliadke",
        signUp: "Zaregistrovať sa alebo prihlásiť",
      },
      buttons: {
        back: "Späť",
        close: "Zavrieť",
        last: "Dokončiť",
        next: "Ďalej",
        skip: "Preskočiť",
      },
      welcome: {
        title: "Vitajte na {{appName}}",
        description:
          "Platforma AI s dôrazom na súkromie a slobodu prejavu. Má {{modelCount}} modelov a filtre obsahu si nastavujete sami.",
        subtitle: "Na začiatok si pozrite krátku prehliadku.",
      },
      aiCompanion: {
        title: "Vyberte si spoločníka AI",
        description:
          "Vyberte si z {{modelCount}} modelov AI. Na výber sú bežné modely, modely s otvoreným zdrojovým kódom aj modely bez cenzúry.",
        tip: "Otvorte výber modelu a vyberte si spoločníka.",
      },
      rootFolders: {
        title: "Vaše priečinky chatov",
        description:
          "Usporiadajte si chaty do priečinkov s rôznymi nastaveniami súkromia:",
        private: {
          name: "Súkromné",
          suffix: "vidíte iba vy",
        },
        incognito: {
          name: "Inkognito",
          suffix: "bez uloženej histórie",
        },
        shared: {
          name: "Zdieľané",
          suffix: "spolupráca s ostatnými",
        },
        public: {
          name: "Verejné",
          suffix: "vidia všetci",
        },
      },
      privateFolder: {
        name: "Súkromné",
        suffix: "Priečinok",
        description: "Súkromné chaty vidíte iba vy. Hodia sa na citlivé témy.",
      },
      incognitoFolder: {
        name: "Inkognito",
        suffix: "Priečinok",
        description:
          "História chatu sa neukladá na server. Správy zostávajú vo vašom prehliadači, kým ich nevymažete.",
        note: "Pri relácii inkognito údaje na serveroch neukladáme. Vygenerované médiá sa z technických dôvodov ukladajú dočasne.",
      },
      sharedFolder: {
        name: "Zdieľané",
        suffix: "Priečinok",
        description:
          "Zdieľajte prístup k tomuto priečinku s ľuďmi, s ktorými chcete spolupracovať.",
      },
      publicFolder: {
        name: "Verejné",
        suffix: "Priečinok",
        description:
          "Zverejnite svoje rozhovory s AI. Ostatní môžu vaše vlákna zobraziť a vytvoriť ich vetvu.",
        note: "Všetko vo verejnom priečinku vidia všetci používatelia aj vyhľadávače.",
      },
      newChatButton: {
        title: "Začať nový chat",
        description: "Otvorte nový rozhovor v ľubovoľnom priečinku.",
      },
      sidebarLogin: {
        title: "Ďalšie možnosti po prihlásení",
        description:
          "Vytvorte bezplatný účet a odomknite súkromné a zdieľané priečinky. História rozhovorov sa bude synchronizovať medzi zariadeniami a AI si môže zapamätať údaje o vás.",
        tip: "Registrácia je zadarmo.",
      },
      subscriptionButton: {
        title: "Kredity a predplatné",
        description:
          "Za {{price}} mesačne dostanete v predplatnom {{credits}} kreditov na mesiac. Bezplatný účet má mesačne {{freeCredits}} kreditov, s odberom newslettera {{freeCreditsMax}}.",
      },
      chatInput: {
        title: "Napíšte správu",
        description:
          "Napíšte správu a stlačte Enter alebo kliknite na Odoslať. Správu dostane váš spoločník AI.",
        tip: "Shift+Enter vloží nový riadok. Priložiť môžete aj súbory a obrázky.",
      },
      voiceInput: {
        title: "Hlasový vstup",
        description: "So spoločníkom AI sa môžete rozprávať cez mikrofón:",
        options: {
          transcribe: "Prepísať reč na text",
          sendAudio: "Odoslať zvuk priamo do AI",
          pauseResume: "Pozastaviť a obnoviť nahrávanie",
        },
      },
      callMode: {
        title: "Režim hovoru",
        description:
          "Zapnite režim hovoru a rozprávajte sa s AI hlasom v reálnom čase aj bez držania zariadenia.",
        tip: "Hodí sa na cesty alebo keď radšej hovoríte, než píšete.",
      },
      complete: {
        title: "Môžete začať",
        description:
          "Dokončili ste prehliadku. Teraz môžete začať rozhovor so spoločníkom AI.",
        help: "Potrebujete pomoc? Kedykoľvek kliknite na otáznik v bočnom paneli.",
      },
      authUnlocked: {
        unlocked: "Odomknuté",
        privateDescription:
          "Súkromný priečinok je pripravený. Chaty v ňom vidíte iba vy.",
        privateNote:
          "Súkromné chaty sa automaticky synchronizujú medzi všetkými vašimi zariadeniami.",
        sharedDescription:
          "Zdieľaný priečinok je pripravený. Pozvite ostatných na spoločné rozhovory s AI.",
        sharedNote:
          "Vy rozhodujete, kto má prístup k zdieľaným priečinkom a vláknam.",
      },
    },
  },
  selector: {
    loading: "Načítava sa…",
    best: "Najlepšia zhoda",
    free: "ZADARMO",
    creditsSingle: "1 kredit",
    creditsExact: "Kredity: {{cost}}",
    modelOnly: "Iba model",
    editModelSettings: "Upraviť nastavenia modelu",
    editSettings: "Upraviť nastavenia",
    switchSkill: "Zmeniť zručnosť",
    editSkill: "Upraviť zručnosť",
    delete: "Odstrániť",
    autoSelectedModel: "VÝBER PODĽA FILTROV",
    manualSelectedModel: "RUČNÝ VÝBER",
    intelligence: "Inteligencia",
    contentFilter: "Obsah",
    maxPrice: "Najvyššia cena",
    modelSelection: "Výber modelu",
    autoModeDescription: "Najlepší model sa vyberie podľa vašich filtrov",
    manualModeDescription: "Vyberte konkrétny model ručne",
    autoMode: "Podľa filtrov",
    manualMode: "Ručne",
    allModelsCount: "Všetky modely ({{count}})",
    filteredModelsCount: "Počet modelov zodpovedajúcich filtrom: {{count}}",
    showFiltered: "Zobraziť filtrované",
    showAllModels: "Zobraziť všetky modely",
    showLess: "Zobraziť menej",
    showMore: "Zobraziť ďalšie ({{remaining}})",
    showLegacyModels_one: "Zobraziť archivovaný model ({{count}})",
    showLegacyModels_other: "Zobraziť archivované modely ({{count}})",
    noMatchingModels: "Nenašli sa žiadne vhodné modely",
    noModelsWarning: "Žiadny model nezodpovedá filtrom",
    useOnce: "Použiť raz",
    saveAsDefault: "Pridať do obľúbených",
    deleteSetup: "Odstrániť nastavenie",
    content: "Vyhľadať obsah…",
    characterSetup: "Nastavenia zručnosti",
    noResults: "Žiadne výsledky",
    add: "Pridať do obľúbených",
    added: "Pridané",
    addNew: "Pridať nové",
    searchSkills: "Vyhľadať zručnosti…",
    createCustom: "Vytvoriť vlastné",
    customizeSettings: "Prispôsobiť nastavenia",
    requirements: {
      characterConflict: "Nesplnené požiadavky zručnosti",
      tooLow: "príliš nízke",
      tooHigh: "príliš vysoké",
      min: "min.",
      max: "max.",
    },
  },
  common: {
    newChat: "Nový chat",
    privateChats: "Súkromné čety",
    search: "Vyhľadať",
    delete: "Odstrániť",
    cancel: "Zrušiť",
    save: "Uložiť",
    edit: "Upraviť",
    settings: "Nastavenia",
    close: "Zavrieť",
    toggleSidebar: "Otvoriť alebo zavrieť bočný panel",
    lightMode: "Svetlý režim",
    darkMode: "Tmavý režim",
    searchPlaceholder: "Hľadať...",
    searchThreadsPlaceholder: "Vyhľadať vlákna…",
    searchResults: "Výsledky vyhľadávania",
    noChatsFound: "Nenašli sa žiadne chaty",
    noThreadsFound: "Nenašli sa žiadne konverzácie",
    enableTTSAutoplay: "Zapnúť automatické prehrávanie reči (TTS)",
    disableTTSAutoplay: "Vypnúť automatické prehrávanie reči (TTS)",
    selector: {
      country: "Krajina",
      language: "Jazyk",
    },
    copyButton: {
      copied: "Skopírované",
      copyToClipboard: "Kopírovať do schránky",
      copyAsMarkdown: "Kopírovať ako Markdown",
      copyAsText: "Kopírovať ako text",
    },
    assistantMessageActions: {
      cancelLoading: "Zrušiť načítavanie",
      stopAudio: "Zastaviť zvuk",
      playAudio: "Prehrať zvuk",
      answerAsAI: "Odpovedať ako model AI",
      deleteMessage: "Odstrániť správu",
    },
    characterSelector: {
      placeholder: "Vybrať zručnosť",
      addNewLabel: "Vytvoriť vlastnú zručnosť",
      grouping: {
        bySource: "Podľa zdroja",
        byCategory: "Podľa kategórie",
        sourceLabels: {
          builtIn: "Vstavané",
          my: "Moje zručnosti",
          community: "Komunita",
        },
        sourceIcons: {
          builtIn: "sparkles",
          my: "user",
          community: "people",
        },
      },
      addDialog: {
        title: "Vytvoriť vlastnú zručnosť",
        fields: {
          name: {
            label: "Názov",
            placeholder: "Zadajte názov zručnosti",
          },
          icon: {
            label: "Ikona (emoji)",
            placeholder: "😊",
          },
          description: {
            label: "Opis",
            placeholder: "Stručný opis zručnosti",
          },
          systemPrompt: {
            label: "Systémový prompt",
            placeholder: "Určte, ako sa má zručnosť správať…",
          },
          category: {
            label: "Kategória",
          },
        },
        createCategory: "Vytvoriť kategóriu",
        cancel: "Zrušiť",
        create: "Vytvoriť zručnosť",
      },
      addCategoryDialog: {
        title: "Vytvoriť kategóriu",
        fields: {
          name: {
            label: "Názov kategórie",
            placeholder: "Zadajte názov kategórie",
          },
          icon: {
            label: "Ikona (emoji)",
            placeholder: "📁",
          },
        },
        cancel: "Zrušiť",
        create: "Vytvoriť kategóriu",
      },
    },
  },
  actions: {
    newChatInFolder: "Nový čet v priečinku",
    newFolder: "Nový priečinok",
    deleteFolder: "Odstrániť priečinok",
    deleteMessage: "Odstrániť správu",
    deleteThisMessage: "Odstrániť túto správu",
    searchEnabled: "Vyhľadávanie je zapnuté",
    searchDisabled: "Vyhľadávanie je vypnuté",
    answerAsAI: "Odpovedať ako model AI",
    retry: "Skúsiť znova s iným modelom alebo zručnosťou",
    branch: "Vytvoriť vetvu rozhovoru odtiaľto",
    editMessage: "Upraviť správu",
    stopAudio: "Zastaviť prehrávanie zvuku",
    playAudio: "Prehrať zvuk",
    copyContent: "Kopírovať do schránky",
  },
  dialogs: {
    searchAndCreate: "Vyhľadávanie a tvorba",
    deleteChat: "Odstrániť chat „{{title}}“?",
    deleteFolderConfirm:
      "Odstrániť priečinok „{{name}}“ a presunúť jeho chaty ({{count}}) do priečinka Všeobecné?",
  },
  views: {
    linearView: "Lineárne zobrazenie (ako v ChatGPT)",
    threadedView: "Zobrazenie vo vláknach (ako na Reddite a Discorde)",
    flatView: "Ploché zobrazenie (ako na 4chane)",
    debugView: "Zobrazenie na ladenie (so systémovými promptmi)",
  },

  screenshot: {
    capturing: "Zachytáva sa…",
    capture: "Zachytiť snímku obrazovky",
    failed: "Snímku obrazovky sa nepodarilo zachytiť",
    failedWithMessage: "Snímku obrazovky sa nepodarilo zachytiť: {{message}}",
    tryAgain: "Snímku obrazovky sa nepodarilo zachytiť. Skúste znova.",
    noMessages:
      "Oblasť správ sa nenašla. Skontrolujte, či chat obsahuje správy.",
    quotaExceeded: "Úložisko je plné. Snímka obrazovky je príliš veľká.",
    canvasError: "Snímku obrazovky sa nepodarilo previesť na obrázok.",
  },
  errors: {
    noResponse: "AI vrátila prázdnu odpoveď. Skúste znova.",
    noStream:
      "Odpoveď sa nepodarilo streamovať. Čítačka streamu nie je dostupná.",
    saveFailed: "Úpravu sa nepodarilo uložiť",
    branchFailed: "Vetvu sa nepodarilo vytvoriť",
    retryFailed: "Opakovanie zlyhalo",
    answerFailed: "Odpoveď sa nepodarilo odoslať",
    deleteFailed: "Odstránenie zlyhalo",
  },
  errorTypes: {
    streamError: "Chyba streamovania",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Rozhranie na prepis reči nie je dostupné",
      "failed-to-start": "Nahrávanie sa nepodarilo spustiť",
      "permission-denied":
        "Mikrofón je zablokovaný. Povoľte ho v nastaveniach prehliadača a obnovte stránku.",
      "permission-denied-ios":
        "Mikrofón je zablokovaný. Otvorte Nastavenia → Safari → Mikrofón a povoľte prístup pre tento web.",
      "permission-denied-android":
        "Mikrofón je zablokovaný. Ťuknite na zámok v paneli s adresou → Nastavenia webu → Mikrofón → Povoliť.",
      "permission-denied-mac":
        "Mikrofón je zablokovaný. Otvorte Nastavenia systému → Súkromie a bezpečnosť → Mikrofón a povoľte prístup prehliadaču.",
      "permission-dismissed":
        "Výzva na povolenie mikrofónu bola zavretá. Ťuknite znova na mikrofón a vyberte Povoliť.",
      "permission-denied-site":
        "Mikrofón je pre tento web zablokovaný. Kliknite na ikonu vľavo od adresy → Mikrofón → Povoliť a skúste znova.",
      "permission-denied-windows":
        "Mikrofón je zablokovaný. V časti Nastavenia → Súkromie → Mikrofón povoľte svoj prehliadač.",
      "no-microphone":
        "Mikrofón sa nenašiel. Pripojte mikrofón alebo náhlavnú súpravu a skúste znova.",
      "microphone-in-use":
        "Tvoj mikrofón používa iná aplikácia. Zavri ju a skús znova.",
      "not-supported":
        "Tvoj prehliadač nepodporuje prístup k mikrofónu. Skús Chrome, Firefox alebo Safari.",
      "transcription-failed": "Zvuk sa nepodarilo prepísať",
      "audio-too-short":
        "Nahrávka je príliš krátka. Podrž mikrofón, hovor zreteľne a skús znova.",
    },
    tts: {
      "endpoint-not-available":
        "Rozhranie na prevod textu na reč nie je dostupné",
      "failed-to-play": "Zvuk sa nepodarilo prehrať",
      "conversion-failed": "Prevod textu na reč zlyhal",
      "failed-to-generate": "Zvuk sa nepodarilo vytvoriť",
    },
  },
  post: {
    title: "Čet",
    description: "Rozhranie chatu",
  },
  models: {
    descriptions: {
      uncensoredLmV11:
        "Model AI bez cenzúry na tvorivé rozhovory bez obmedzení",
      freedomgptLiberty:
        "FreedomGPT Liberty je model AI bez cenzúry zameraný na slobodné vyjadrovanie a tvorbu obsahu.",
      gabAiArya:
        "Gab AI Arya je konverzačný model bez cenzúry na slobodné vyjadrovanie a tvorbu.",
      gemini31ProPreviewCustomTools:
        "Gemini 3.1 Pro Preview (Custom Tools). Variant Gemini 3.1 Pro s presnejším výberom nástrojov. Namiesto zbytočných volaní Bash uprednostňuje efektívnejšie funkcie tretích strán. Hodí sa pre programovacích agentov a úlohy s viacerými nástrojmi.",
      gemini31FlashImagePreview:
        "Gemini 3.1 Flash Image Preview. Multimodálny model od Googlu vytvára obrázky podľa textového zadania priamo v čete. V jednej konverzácii dokáže odpovedať textom aj obrázkami.",
      gemini31FlashLitePreview:
        "Gemini 3.1 Flash Lite Preview. Úsporný model od Googlu na spracovanie veľkého množstva požiadaviek. Oproti Gemini 2.5 Flash Lite lepšie pracuje so zvukom, presnejšie zoraďuje výsledky RAG, prekladá a dopĺňa kód.",
      gemini3Pro:
        "Google Gemini 3 Pro je pokročilý multimodálny model AI s veľkým kontextovým oknom a schopnosťou zložitého uvažovania.",
      gemini35Flash:
        "Gemini 3.5 Flash sa v programovaní a uvažovaní blíži modelom Pro za cenu Flash. Spracuje text, obrázky, video, zvuk aj PDF. Podporuje súbežné slučky agentov. Úroveň uvažovania od minimálnej po vysokú dáva kontrolu nad cenou a výkonom.",
      gemini3Flash:
        "Google Gemini 3 Flash je rýchly a úsporný multimodálny model na pohotové odpovede.",
      deepseekV32:
        "DeepSeek V3.2 je výkonný model na uvažovanie s pokročilými programátorskými schopnosťami.",
      deepseekV4Pro:
        "DeepSeek V4 Pro je výkonný model MoE s 1,6 bilióna parametrov a kontextom na milión tokenov. Hodí sa na analýzu celých repozitárov, zložité uvažovanie a viacstupňovú prácu agentov.",
      deepseekV4Flash:
        "DeepSeek V4 Flash je model MoE s 284 miliardami parametrov za takmer nulovú cenu. Kontext na milión tokenov, rýchla inferencia a výkonné programovanie pri veľkom objeme práce.",
      gpt55:
        "GPT-5.5. Špičkový model OpenAI na náročnú odbornú prácu. Lepšie uvažuje, pracuje spoľahlivejšie a efektívnejšie využíva tokeny. Podporuje text aj obrázky a kontext nad 1 milión tokenov.",
      gpt55Pro:
        "GPT-5.5 Pro. Najvýkonnejší model OpenAI na dôkladné uvažovanie pri zložitých a kritických úlohách. Má kontext nad 1 milión tokenov. Zvláda dlhé úlohy, programovanie s agentmi aj presné vykonávanie viacerých krokov.",
      gpt54Pro:
        "GPT-5.4 Pro. Najpokročilejší model OpenAI s prepracovaným uvažovaním a kontextom nad 1 milión tokenov. Vyniká pri zložitých a kritických úlohách.",
      gpt54:
        "GPT-5.4. Špičkový model OpenAI spája Codex a GPT. Kontext nad 1 milión tokenov využíva na analýzu rozsiahlych podkladov, programovanie a prácu s viacerými typmi vstupov.",
      gpt53Codex:
        "GPT-5.3-Codex. Najpokročilejší programátorský agent OpenAI. Spája pokročilé softvérové inžinierstvo so všestranným uvažovaním a zvláda dlhé úlohy s nástrojmi aj náročný vývoj.",
      gpt53Chat:
        "GPT-5.3 Chat. Aktualizovaný konverzačný model ChatGPT. Odpovedá presnejšie, lepšie zohľadňuje kontext a menej odmieta alebo pridáva zbytočné výhrady.",
      gpt52Pro:
        "GPT-5.2 Pro. Pokročilý model OpenAI s lepším uvažovaním a programovaním.",
      gpt52: "GPT-5.2. Výkonný model OpenAI na zložité úlohy a analýzu.",
      gpt52_chat: "GPT-5.2 Chat. Model OpenAI optimalizovaný na konverzácie.",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B je veľký jazykový model bez cenzúry založený na Mistral.",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B je veľký jazykový model bez cenzúry založený na Llama 3.",
      veniceUncensored:
        "Venice Uncensored 1.1. Model AI s minimálnymi obsahovými obmedzeniami a podporou volania nástrojov. Hodí sa na voľné skúmanie tém, hranie rolí a rozhovory bez filtrov.",
      claudeOpus45:
        "Claude Opus 4.5 je výkonný model Claude s výnimočným uvažovaním a tvorivými schopnosťami.",
      claudeOpus46:
        "Claude Opus 4.6 je výkonný model Claude s výnimočným uvažovaním a tvorivými schopnosťami.",
      claudeOpus47:
        "Claude Opus 4.7 je model predchádzajúcej generácie Opus. Nahrádza ho 4.8.",
      claudeOpus48:
        "Claude Opus 4.8 je najvýkonnejší bežne dostupný Opus od Anthropic. Zvláda dlhodobú prácu agentov, zložité programovanie a viacstupňové uvažovanie pri veľmi dlhých výstupoch. Kontext má milión tokenov. Prijíma text, obrázky a súbory.",
      claudeSonnet46:
        "Claude Sonnet 4.6 je najvýkonnejší model triedy Sonnet od Anthropic. Vyniká v programovaní, práci agentov a profesionálnych úlohách.",
      claudeHaiku45:
        "Claude Haiku 4.5. Rýchly a úsporný model Claude na úlohy, kde záleží na čase aj cene.",
      glm5_1:
        "GLM-5.1. Programovací model novej generácie od Z.AI na dlhé úlohy. Na jednej úlohe dokáže samostatne pracovať viac než 8 hodín. Plánuje, vykonáva kroky a priebežne vylepšuje výsledok.",
      glm5: "GLM-5. Vlajkový model Z.AI s otvoreným zdrojovým kódom. Je určený na návrh zložitých systémov a dlhé úlohy agentov. Konkuruje popredným uzavretým modelom.",
      glm5Turbo:
        "GLM-5 Turbo. Model novej generácie od Z.AI pre prácu s agentmi. Rýchlo odpovedá, lepšie rozkladá zložité pokyny na kroky a dlhšie si drží smer úlohy.",
      glm46: "GLM-4 6B. Úsporný čínsko-anglický model AI na širokú škálu úloh.",
      glm47:
        "GLM-4 7B. Pokročilý čínsko-anglický model s lepším uvažovaním a programovaním.",
      glm47Flash:
        "GLM-4 7B Flash. Mimoriadne rýchly čínsko-anglický model s krátkym časom odozvy.",
      kimiK2: "Kimi K2. Výkonný čínsky model AI, ktorý dobre rozumie kontextu.",
      kimiK2_5:
        "Kimi K2.5. Model predchádzajúcej generácie od Moonshot AI. Dobre programuje a uvažuje aj pri dlhom kontexte.",
      kimiK2_6:
        "Kimi K2.6. Multimodálny model novej generácie od Moonshot AI. Zvláda dlhé programátorské úlohy, tvorbu UI a UX podľa zadania alebo obrázkov a koordináciu stoviek podagentov pracujúcich súbežne.",
      claudeSonnet45:
        "Claude Sonnet 4.5. Model Sonnet predchádzajúcej generácie od Anthropicu so silnými programátorskými a analytickými schopnosťami.",
      claudeAgentSonnet:
        "Claude Agent Sonnet. Samostatný agent AI využíva Claude Sonnet cez Agent SDK od Anthropicu. Sám uvažuje a volá nástroje.",
      claudeAgentHaiku:
        "Claude Agent Haiku. Rýchly samostatný agent AI využíva Claude Haiku cez Agent SDK od Anthropicu. Volá nástroje s dôrazom na rýchlosť.",
      claudeAgentOpus:
        "Claude Agent Opus. Najvýkonnejší autonómny agent AI s modelom Claude Opus cez Agent SDK od Anthropicu. Zvláda náročné uvažovanie aj používanie nástrojov.",
      grok4:
        "Grok 4. Vlajkový model xAI na uvažovanie, prácu s obrázkami a vyhľadávanie na webe.",
      grok4Fast:
        "Grok 4 Fast. Rýchly model xAI s kontextom 2 milióny tokenov. Je optimalizovaný na krátky čas odozvy.",
      grok43:
        "Grok 4.3. Model xAI s kontextom 1 milión tokenov a vysokou faktickou presnosťou. Uvažovanie je vždy zapnuté. Hodí sa pre agentov a hĺbkový výskum.",
      grok420Beta:
        "Grok 4.20 (Legacy). Predchádzajúci vlajkový model xAI s podporou volania nástrojov, nízkou mierou halucinácií a kontextom 2 milióny tokenov.",
      gpt5Pro:
        "GPT-5 Pro. Prémiový model OpenAI s vynikajúcim uvažovaním a programovaním.",
      gpt5Codex:
        "GPT-5 Codex. Špecializovaný model OpenAI na programovanie a náročné technické úlohy.",
      gpt51Codex:
        "GPT 5.1 Codex. Aktualizovaný model OpenAI s lepšími tvorivými a programátorskými schopnosťami.",
      gpt51:
        "GPT 5.1. Úsporný všestranný model OpenAI na uvažovanie a analýzu.",
      gpt5: "GPT-5. Vlajkový model OpenAI na širokú škálu úloh.",
      gpt54Mini:
        "GPT-5.4 Mini. Úsporný variant GPT-5.4 na veľké množstvo požiadaviek. Dobre uvažuje, programuje a používa nástroje pri nižších nákladoch.",
      gpt54Nano:
        "GPT-5.4 Nano. Najmenší a najúspornejší model OpenAI. Hodí sa na úlohy, kde záleží na rýchlosti: triedenie, získavanie údajov a spúšťanie podagentov.",
      gpt5Mini: "GPT-5 Mini. Malý a rýchly model OpenAI na každodenné úlohy.",
      gpt5Nano:
        "GPT-5 Nano. Najmenší a najlacnejší model OpenAI na jednoduché rozhovory.",
      gptOss120b:
        "GPT-OSS 120B. Model OpenAI s otvoreným zdrojovým kódom a 120 miliardami parametrov. Vyniká v programovaní.",
      kimiK2Thinking:
        "Kimi K2 Thinking. Model Kimi na dôkladnú analýzu a riešenie problémov krok za krokom.",
      minimaxM27:
        "MiniMax M2.7. Model novej generácie od MiniMax na samostatnú prácu a spoluprácu agentov. Zvláda ladenie kódu, finančné modelovanie aj tvorbu dokumentov v produkčnom prostredí.",
      mimoV2Pro:
        "MiMo V2 Pro. Vlajkový model Xiaomi s viac ako biliónom parametrov a kontextom 1 milión tokenov. Koordinuje agentov, automatizuje zložité postupy a zvláda vývoj v produkčnom prostredí.",
      glm45Air: "GLM 4.5 AIR. Ľahký a veľmi rýchly model Z.AI na konverzácie.",
      glm45v:
        "GLM 4.5v. Model Z.AI na konverzácie, ktorý dokáže pracovať s obrázkami.",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite. Základný model radu Gemini od Googlu s rozsiahlym kontextom a krátkym časom odozvy.",
      geminiFlash25Flash:
        "Gemini 2.5 Flash. Úsporný multimodálny model Googlu s kontextom 1 milión tokenov na úlohy, kde záleží na rýchlosti.",
      geminiFlash25Pro:
        "Gemini 2.5 Pro. Model Pro od Googlu z predchádzajúcej generácie s rozsiahlym kontextom a dobrým uvažovaním.",
      deepseekV31:
        "DeepSeek V3.1. Model DeepSeek z predchádzajúcej generácie na programovanie a analýzu.",
      deepseekR1:
        "DeepSeek R1. Model DeepSeek na pokročilé uvažovanie a riešenie problémov krok za krokom.",
      qwen3235bFree:
        "Qwen3 235B. Veľký otvorený model od Alibaby s 235 miliardami parametrov na zložité programovanie a uvažovanie.",
      deepseekR1Distill:
        "DeepSeek R1 Distill. Kompaktná verzia DeepSeek R1 vytvorená destiláciou. Uvažuje s nižšou spotrebou zdrojov.",
      qwen257b:
        "Qwen 2.5 7B. Kompaktný model od Alibaby so 7 miliardami parametrov na rýchle a cenovo dostupné rozhovory.",
      dallE3:
        "DALL-E 3. Model OpenAI vytvára kvalitné a detailné obrázky podľa textového zadania.",
      gptImage1:
        "GPT-Image-1. Rýchly a cenovo dostupný model OpenAI na tvorbu obrázkov.",
      fluxSchnell:
        "Flux Schnell. Model od Black Forest Labs na rýchlu tvorbu obrázkov.",
      fluxPro:
        "Flux Pro 1.1. Profesionálny model od Black Forest Labs na tvorbu kvalitných obrázkov, ktoré sa presne držia zadania.",
      flux2Max:
        "FLUX.2 Max. Špičkový model od Black Forest Labs na tvorbu obrázkov. Presne rozumie zadaniu a pri úpravách zachováva konzistentný vzhľad.",
      flux2Klein4b:
        "FLUX.2 Klein 4B. Najrýchlejší a najúspornejší obrazový model od Black Forest Labs na spracovanie veľkého množstva požiadaviek.",
      riverflowV2Pro:
        "Riverflow V2 Pro. Najvýkonnejší obrazový model od Sourceful. Ponúka presnú kontrolu nad výsledkom a bezchybne vykresľuje text.",
      riverflowV2Fast:
        "Riverflow V2 Fast. Najrýchlejší obrazový model od Sourceful pre produkčné nasadenia a úlohy, pri ktorých záleží na krátkom čase odozvy.",
      riverflowV2MaxPreview:
        "Riverflow V2 Max Preview. Najvýkonnejší predbežný variant od Sourceful. Vytvára obrázky z textu aj zo vstupných obrázkov.",
      riverflowV2StandardPreview:
        "Riverflow V2 Standard Preview. Štandardný predbežný variant od Sourceful. Vytvára obrázky z textu aj vstupných obrázkov a prekonáva modely radu Riverflow 1.",
      riverflowV2FastPreview:
        "Riverflow V2 Fast Preview. Najrýchlejší predbežný variant od Sourceful. Vytvára obrázky z textu aj vstupných obrázkov za najnižšiu cenu.",
      flux2Flex:
        "FLUX.2 Flex. Obrazový model od Black Forest Labs vyniká v zložitom vykresľovaní textu, typografii a úpravách podľa viacerých referenčných obrázkov.",
      flux2Pro:
        "FLUX.2 Pro. Špičkový model od Black Forest Labs na tvorbu a úpravu obrázkov. Presne dodržiava zadanie a zachováva vzhľad postáv.",
      gemini3ProImagePreview:
        "Nano Banana Pro (Gemini 3 Pro Image Preview). Najpokročilejší obrazový model od Googlu. Lepšie prepája rôzne typy vstupov, vychádza zo znalostí o reálnom svete, verne tvorí obraz a presne vykresľuje text.",
      gpt5ImageMini:
        "GPT-5 Image Mini. Úsporný multimodálny model OpenAI spája jazykové schopnosti GPT-5 Mini s rýchlou a cenovo dostupnou tvorbou obrázkov.",
      gpt5Image:
        "GPT-5 Image. Vlajkový multimodálny model OpenAI spája jazykové schopnosti GPT-5 s pokročilou tvorbou a úpravou obrázkov.",
      gpt54Image2:
        "GPT-5.4 Image 2. Multimodálny model novej generácie od OpenAI spája uvažovanie GPT-5.4 s tvorbou obrázkov GPT Image 2. V jednej konverzácii zvládne programovať, analyzovať aj tvoriť obrázky.",
      seedream45:
        "Seedream 4.5. Obrazový model od ByteDance s konzistentnejšími úpravami, presnejším doladením portrétov a lepším skladaním viacerých obrázkov.",
      sdxl: "Stable Diffusion XL. Otvorený model od Stability AI na tvorbu kvalitných obrázkov.",
      cassetteMusic:
        "CassetteAI Music. Pomocou Fal.ai rýchlo vytvorí hudbu z textu. Skladby môžu mať až tri minúty.",
      musicgenStereo:
        "MusicGen Stereo. Model od Meta s otvoreným zdrojovým kódom tvorí stereofónnu hudbu cez Replicate.",
      stableAudio:
        "Stable Audio. Model od Stability AI na tvorbu kvalitnej hudby a zvukových ukážok.",
      udioV2:
        "Udio v2. Vytvára plnohodnotné skladby so spevom v produkčnej kvalite.",
      modelsLabMusicGen:
        "ModelsLab Music Gen. Vytvára hudbu podľa textového zadania. Výstup podporuje formáty MP3, WAV a FLAC.",
      modelsLabElevenlabsMusic:
        "ElevenLabs Music. Tvorí kvalitnú hudbu pomocou ElevenLabs cez ModelsLab.",
      modelsLabSonautoSong:
        "Sonauto Song. Vytvára celé skladby so spevom v rôznych žánroch. Maximálna dĺžka skladby je 4 minúty a 45 sekúnd.",
      modelsLabLyria3:
        "Lyria 3. Pokročilý model od Googlu tvorí z textu originálne 30-sekundové skladby.",
      modelsLabCogVideoX:
        "CogVideoX. Model od ModelsLab na tvorbu krátkych videí z textu.",
      modelsLabWanx: "Wanx. Model od ModelsLab na tvorbu videí z textu.",
      modelsLabWan22:
        "Wan 2.2 Ultra. Model od ModelsLab na tvorbu kvalitných videí z textu.",
      modelsLabWan21:
        "Wan 2.1 Ultra. Model od ModelsLab na tvorbu videí z textu vo vyššej kvalite.",
      modelsLabWan25T2V:
        "Wan 2.5 T2V. Model Wan 2.5 od ModelsLab na tvorbu videí z textu.",
      modelsLabWan25I2V:
        "Wan 2.5 I2V. Model Wan 2.5 od ModelsLab na tvorbu videí z obrázkov.",
      modelsLabWan27T2V:
        "Wan 2.7 T2V. Model Wan 2.7 od Alibaby tvorí z textu videá v rozlíšení 1080p s rôznymi pomermi strán.",
      modelsLabWan26T2V:
        "Wan 2.6 T2V. Model Wan 2.6 od ModelsLab na tvorbu videí z textu.",
      modelsLabWan26I2V:
        "Wan 2.6 I2V. Model Wan 2.6 od ModelsLab na tvorbu videí z obrázkov.",
      modelsLabWan26I2VFlash:
        "Wan 2.6 I2V Flash. Rýchly model Wan 2.6 od ModelsLab na tvorbu videí z obrázkov.",
      modelsLabSeedanceT2V:
        "Seedance T2V. Model od BytePlus na tvorbu videí z textu.",
      modelsLabSeedanceI2V:
        "Seedance I2V. Model od BytePlus na tvorbu videí z obrázkov.",
      modelsLabOmnihuman:
        "Omnihuman. Model od BytePlus na tvorbu videí s ľuďmi.",
      modelsLabSeedance1ProI2V:
        "Seedance 1.0 Pro I2V. Profesionálny model od BytePlus na tvorbu videí z obrázkov.",
      modelsLabSeedance1ProFastI2V:
        "Seedance 1.0 Pro Fast I2V. Rýchly profesionálny model od BytePlus na tvorbu videí z obrázkov.",
      modelsLabSeedance1ProFastT2V:
        "Seedance 1.0 Pro Fast T2V. Rýchly profesionálny model od BytePlus na tvorbu videí z textu.",
      modelsLabOmnihuman15:
        "Omnihuman 1.5. Vylepšený model od BytePlus na tvorbu videí s ľuďmi.",
      modelsLabSeedance15Pro:
        "Seedance 1.5 Pro. Pokročilý model od BytePlus na tvorbu videí.",
      modelsLabVeo2:
        "Veo 2. Model od Googlu na tvorbu kvalitných videí cez ModelsLab.",
      modelsLabVeo3: "Veo 3. Model od Googlu na tvorbu videí cez ModelsLab.",
      modelsLabVeo3Fast:
        "Veo 3 Fast. Rýchly model od Googlu na tvorbu videí cez ModelsLab.",
      modelsLabVeo3FastPreview:
        "Veo 3 Fast Preview. Predbežná verzia rýchleho modelu od Googlu na tvorbu videí cez ModelsLab.",
      modelsLabVeo31:
        "Veo 3.1. Vylepšená verzia modelu Veo 3 od Googlu na tvorbu videí cez ModelsLab.",
      modelsLabVeo31Fast:
        "Veo 3.1 Fast. Rýchla verzia modelu Veo 3.1 od Googlu na tvorbu videí cez ModelsLab.",
      modelsLabKlingV21I2V:
        "Kling V2.1 I2V. Model od Kling AI vo verzii 2.1 na tvorbu videí z obrázkov.",
      modelsLabKlingV25TurboI2V:
        "Kling V2.5 Turbo I2V. Zrýchlený model od Kling AI vo verzii 2.5 na tvorbu videí z obrázkov.",
      modelsLabKlingV25TurboT2V:
        "Kling V2.5 Turbo T2V. Zrýchlený model od Kling AI vo verzii 2.5 na tvorbu videí z textu.",
      modelsLabKlingV2MasterT2V:
        "Kling V2 Master T2V. Špičkový model od Kling AI na tvorbu videí z textu.",
      modelsLabKlingV2MasterI2V:
        "Kling V2 Master I2V. Špičkový model od Kling AI na tvorbu videí z obrázkov.",
      modelsLabKlingV21MasterT2V:
        "Kling V2.1 Master T2V. Špičkový model od Kling AI vo verzii 2.1 na tvorbu videí z textu.",
      modelsLabKlingV21MasterI2V:
        "Kling V2.1 Master I2V. Špičkový model od Kling AI vo verzii 2.1 na tvorbu videí z obrázkov.",
      modelsLabKlingV16MultiI2V:
        "Kling V1.6 Multi I2V. Model od Kling AI vo verzii 1.6 na tvorbu videí z viacerých obrázkov.",
      modelsLabKling30T2V:
        "Kling 3.0 T2V. Model od Kling AI vo verzii 3.0 na tvorbu videí z textu.",
      modelsLabLtx2ProT2V:
        "LTX 2 PRO T2V. Profesionálny model od LTX na tvorbu videí z textu.",
      modelsLabLtx2ProI2V:
        "LTX 2 PRO I2V. Profesionálny model od LTX na tvorbu videí z obrázkov.",
      modelsLabLtx23ProI2V:
        "LTX 2.3 Pro I2V. Vylepšený profesionálny model od LTX na tvorbu videí z obrázkov.",
      modelsLabHailuo23T2V:
        "Hailuo 2.3 T2V. Model od MiniMax vo verzii 2.3 na tvorbu videí z textu.",
      modelsLabHailuo02T2V:
        "Hailuo 02 T2V. Model od MiniMax vo verzii 02 na tvorbu videí z textu.",
      modelsLabHailuo23I2V:
        "Hailuo 2.3 I2V. Model od MiniMax vo verzii 2.3 na tvorbu videí z obrázkov.",
      modelsLabHailuo23FastI2V:
        "Hailuo 2.3 Fast I2V. Rýchly model od MiniMax vo verzii 2.3 na tvorbu videí z obrázkov.",
      modelsLabHailuo02I2V:
        "Hailuo 02 I2V. Model od MiniMax vo verzii 02 na tvorbu videí z obrázkov.",
      modelsLabHailuo02StartEnd:
        "Hailuo 02 Start/End. Model od MiniMax na tvorbu videí podľa prvého a posledného záberu.",
      modelsLabSora2: "Sora 2. Model OpenAI na tvorbu videí cez ModelsLab.",
      modelsLabSora2Pro:
        "Sora 2 Pro. Model OpenAI na tvorbu videí cez ModelsLab.",
      modelsLabGen4Aleph:
        "Gen4 Aleph. Model od Runway na tvorbu videí cez ModelsLab.",
      modelsLabLipsync2:
        "Lipsync 2. Model od Sync na synchronizáciu pohybu pier so zvukom vo videu.",
      modelsLabGrokT2V:
        "Grok T2V. Model Grok od xAI na tvorbu videí z textu cez ModelsLab.",
      modelsLabGrokI2V:
        "Grok I2V. Model Grok od xAI na tvorbu videí z obrázkov cez ModelsLab.",
      klingV30Std:
        "Kling 3.0 Standard. Štandardný model od Kuaishou na tvorbu videí z textu aj obrázkov cez OpenRouter.",
      klingVideoO1:
        "Kling Video O1. Model od Kuaishou s pokročilým uvažovaním na tvorbu videí cez OpenRouter.",
      veo31Lite:
        "Veo 3.1 Lite. Úsporný model od Googlu na tvorbu veľkého množstva videí cez OpenRouter.",
      seedance2:
        "Seedance 2.0. Model novej generácie od ByteDance na tvorbu videí cez OpenRouter. Podporuje referenčné vstupy a zachováva vzhľad postáv.",
      seedance2Fast:
        "Seedance 2.0 Fast. Rýchly model od ByteDance na tvorbu videí cez OpenRouter.",
      happyhorse11:
        "HappyHorse 1.1. Model od Alibaby na tvorbu videí z textu alebo obrázkov cez OpenRouter. Podporuje referenčné obrázky.",
      happyhorse10:
        "HappyHorse 1.0. Model od Alibaby na tvorbu videí z textu alebo obrázkov cez OpenRouter. Podporuje referenčné obrázky.",
      modelsLabGen4T2ITurbo:
        "Gen4 T2I Turbo. Rýchly model od Runway na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabGen4Image:
        "Gen4 Image. Model Gen4 od Runway na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabWan27T2I:
        "Wan 2.7 T2I. Model Wan 2.7 od Alibaby na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabGrokT2I:
        "Grok Imagine T2I. Model Grok od xAI na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabZImageBase:
        "Z Image Base. Rýchly a cenovo dostupný model od ModelsLab na tvorbu obrázkov z textu.",
      modelsLabZImageTurbo:
        "Z Image Turbo. Mimoriadne rýchly model od ModelsLab na tvorbu obrázkov z textu.",
      modelsLabFlux2MaxT2I:
        "Flux 2 Max T2I. Model Flux 2 Max od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabFluxPro11Ultra:
        "Flux Pro 1.1 Ultra. Model Flux Pro Ultra od Black Forest Labs na tvorbu kvalitných obrázkov cez ModelsLab.",
      modelsLabFluxPro11:
        "Flux Pro 1.1. Model od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabFlux2ProT2I:
        "Flux 2 Pro T2I. Model Flux 2 Pro od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabFlux2DevT2I:
        "Flux 2 Dev T2I. Model Flux 2 Dev od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabFluxT2I:
        "Flux T2I. Model Flux od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabSeedream45T2I:
        "Seedream 4.5 T2I. Model Seedream 4.5 od ByteDance na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabSeedream40T2I:
        "Seedream 4.0 T2I. Model Seedream 4.0 od ByteDance na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabSeedreamT2I:
        "Seedream T2I. Model Seedream od ByteDance na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabImagen4Ultra:
        "Imagen 4 Ultra. Model od Googlu na tvorbu obrázkov v najvyššej kvalite cez ModelsLab.",
      modelsLabImagen4:
        "Imagen 4. Model od Googlu na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabImagen4Fast:
        "Imagen 4 Fast. Rýchly model od Googlu na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabImagen3:
        "Imagen 3. Model od Googlu na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabNanoBananaPro:
        "Nano Banana Pro. Tvorba kvalitných obrázkov cez ModelsLab.",
      modelsLabNanoBanana: "Nano Banana. Tvorba obrázkov cez ModelsLab.",
      modelsLabQwenT2I:
        "Qwen T2I. Model Qwen od Alibaby na tvorbu obrázkov z textu cez ModelsLab.",
      modelsLabRealtimeT2I:
        "Realtime T2I. Model od ModelsLab na mimoriadne rýchlu tvorbu obrázkov z textu v reálnom čase.",
      claudeSonnet5:
        "Claude Sonnet 5. Vyvážený model radu Sonnet od Anthropicu na programovanie, prácu s agentmi a analýzu. Kontext: 1 milión tokenov.",
      claudeOpus5:
        "Claude Opus 5. Vlajkový model od Anthropicu na najnáročnejšie úlohy agentov a analýzy. Kontext: 1 milión tokenov.",
      claudeOpus5Fast:
        "Claude Opus 5 Fast. Rýchly variant modelu Claude Opus 5 na veľké množstvo požiadaviek s krátkym časom odozvy. Kontext: 1 milión tokenov.",
      claudeFable5:
        "Claude Fable 5. Špičkový model od Anthropicu spája dôkladné uvažovanie, tvorivé spájanie poznatkov a plánovanie dlhých úloh. Kontext: 1 milión tokenov.",
      grok45:
        "Grok 4.5. Model xAI na uvažovanie, ktorý pracuje s obrázkami a má otvorené pravidlá pre obsah. Kontext: 500 000 tokenov.",
      grok46:
        "Grok 4.6. Model Grok od xAI s lepším uvažovaním a programovaním. Kontext: 500 000 tokenov.",
      gpt56Luna:
        "GPT-5.6 Luna. Ľahký a rýchly model OpenAI na každodenné úlohy za veľmi nízku cenu. Kontext: 1,05 milióna tokenov.",
      gpt56LunaPro:
        "GPT-5.6 Luna Pro. Vylepšený variant modelu Luna, ktorý lepšie programuje a dodržiava pokyny. Kontext: 1,05 milióna tokenov.",
      gpt56Terra:
        "GPT-5.6 Terra. Model OpenAI strednej triedy vyvažuje výkon a cenu. Dobre programuje a uvažuje. Kontext: 1,05 milióna tokenov.",
      gpt56TerraPro:
        "GPT-5.6 Terra Pro. Pokročilý variant modelu Terra s dôkladnejším uvažovaním a analýzou. Kontext: 1,05 milióna tokenov.",
      gpt56Sol:
        "GPT-5.6 Sol. Prémiový model OpenAI so špičkovým výkonom na uvažovanie pri zložitých úlohách. Kontext: 1,05 milióna tokenov.",
      gpt56SolPro:
        "GPT-5.6 Sol Pro. Špičkový model GPT spája pokročilé uvažovanie s tvorbou a dôkladnou analýzou. Kontext: 1,05 milióna tokenov.",
      gemini36Flash:
        "Gemini 3.6 Flash. Výkonný model radu Flash od Googlu podporuje rôzne typy vstupov a dobre programuje. Kontext: 1 milión tokenov.",
      gemini35FlashLite:
        "Gemini 3.5 Flash Lite. Rýchly a veľmi lacný model od Googlu na jednoduché úlohy. Kontext: 1 milión tokenov.",
      gemini37Flash:
        "Gemini 3.7 Flash. Model radu Flash od Googlu s lepším uvažovaním a prácou s rôznymi druhmi médií. Kontext: 1,05 milióna tokenov.",
      kimiK3:
        "Kimi K3. Špičkový model od Moonshot AI uvažuje nad rôznymi druhmi médií aj pri dlhom kontexte a podporuje pokročilú prácu agentov. Kontext: 1,05 milióna tokenov.",
      glm52:
        "GLM-5.2. Základný model novej generácie od Z.AI. Dobre uvažuje a rýchlo generuje odpovede. Kontext: 1,05 milióna tokenov.",
      minimaxM3:
        "MiniMax M3. Vlajkový model od MiniMax na programovanie a uvažovanie za priaznivú cenu. Kontext: 1,05 milióna tokenov.",
      qwen37Flash:
        "Qwen 3.7 Flash. Veľmi rýchly a úsporný model od Alibaby na spracovanie veľkého množstva požiadaviek. Kontext: 1 milión tokenov.",
      qwen38Max:
        "Qwen 3.8 Max. Špičkový model od Alibaby na uvažovanie. Kontext: 1 milión tokenov.",
      mimoV25:
        "MiMo V2.5. Úsporný model od Xiaomi na uvažovanie a programovanie. Kontext: 1,05 milióna tokenov.",
      mimoV25Pro:
        "MiMo V2.5 Pro. Prémiový model od Xiaomi na uvažovanie, dôkladnú analýzu a pokročilé programovanie. Kontext: 1,05 milióna tokenov.",
      metaMuseSpark12:
        "Meta Muse Spark 1.2. Multimodálny model od Meta pracuje s obrázkami, zvukom aj videom. Vyniká v analýze, ktorá spája rôzne druhy vstupov. Kontext: 1,05 milióna tokenov.",
      mistralMedium35:
        "Mistral Medium 3.5. Model strednej triedy od Mistral AI rozumie obrázkom a dobre programuje. Kontext: 262 000 tokenov.",
      claudeOpus55:
        "Claude Opus 5.5. Najvýkonnejší model od Anthropicu na najťažšie úlohy agentov, programovanie a analýzu. Je o 20 % lacnejší ako Opus 5. Kontext: 1 milión tokenov.",
      claudeSonnet55:
        "Claude Sonnet 5.5. Model od Anthropicu na každodennú prácu. Pri programovaní a úlohách agentov sa blíži k Opusu za cenu Sonnetu. Kontext: 1 milión tokenov.",
      claudeHaiku55:
        "Claude Haiku 5.5. Najrýchlejší model od Anthropicu. Rozumie obrázkom, volá nástroje a má kontext 1 milión tokenov za desatinu ceny modelu Haiku 4.5.",
      claudeFable51:
        "Claude Fable 5.1. Špičkový model od Anthropicu na uvažovanie. Dôkladne spája poznatky a dlhodobé úlohy plánuje presnejšie než Fable 5. Kontext: 1 milión tokenov.",
      claudeFable52:
        "Claude Fable 5.2. Špičkový model od Anthropicu na uvažovanie. Oproti Fable 5.1 dôkladnejšie spája poznatky, spoľahlivejšie plánuje dlhé úlohy a stojí menej. Kontext: 1 milión tokenov.",
      gpt6Astra:
        "Predchádzajúci vlajkový model radu Astra podporuje text, obrázky aj nástroje. Nahradil ho GPT-6.2 Astra.",
      gpt6AstraPro:
        "GPT-6 Astra Pro. Variant GPT-6 Astra s rozsiahlejším uvažovaním. Odpovedá pomalšie, ale dôkladnejšie. Kontext: 1,05 milióna tokenov.",
      gpt61Sol:
        "Predchádzajúce vydanie radu Sol podporuje text, obrázky aj nástroje. Nahradil ho GPT-6.2 Sol.",
      gpt61SolPro:
        "GPT-6.1 Sol Pro. Variant GPT-6.1 Sol s rozsiahlejším uvažovaním na zložité analýzy a programovanie. Kontext: 1,05 milióna tokenov.",
      gpt61Terra:
        "GPT-6.1 Terra. Vyvážený model strednej triedy od OpenAI. Dobre programuje a uvažuje za cenu vhodnú na každodennú prácu. Kontext: 1,05 milióna tokenov.",
      gpt61TerraPro:
        "GPT-6.1 Terra Pro. Variant GPT-6.1 Terra s dôkladnejším uvažovaním pre náročnú analytickú prácu. Kontext: 1,05 milióna tokenov.",
      gpt6Luna:
        "GPT-6 Luna. Ľahký model OpenAI odpovedá rýchlo a za pár centov. Kontext: 1,05 milióna tokenov.",
      gpt6LunaPro:
        "GPT-6 Luna Pro. Variant GPT-6 Luna s rozsiahlejším uvažovaním. Lepšie programuje a drží sa pokynov za rovnakú nízku cenu. Kontext: 1,05 milióna tokenov.",
      gemini4Argon:
        "Gemini 4 Argon. Vlajkový model od Googlu na pokročilé uvažovanie nad textom, obrázkami, videom a zvukom. Kontext: 1 milión tokenov.",
      gemini38Flash:
        "Gemini 3.8 Flash. Rýchly multimodálny model radu Flash od Googlu, ktorý dobre programuje. Kontext: 1 milión tokenov.",
      grok47:
        "Grok 4.7. Model Grok od xAI s lepším uvažovaním a programovaním. Pracuje s obrázkami a má otvorené pravidlá pre obsah. Kontext: 500 000 tokenov.",
      kimiK31Pro:
        "Kimi K3.1 Pro. Najvýkonnejší model od Moonshot AI. Uvažuje nad rôznymi druhmi médií a zvláda dlhé úlohy agentov. Kontext: 1 milión tokenov.",
      gpt62Sol: "Sol pracuje s textom a obrázkami, píše kód a volá nástroje.",
      gpt62Astra:
        "Astra zvláda zložitý vývoj a analýzu. Pracuje s textom a obrázkami a volá nástroje.",
      superGemma426b:
        "Model Gemma 4 doladený autorom Jiunsong spracuje text spolu s jedným obrázkom a dokáže volať nástroje.",
      deepseekV41FlashCsf:
        "DeepSeek V4.1 Flash upravený autorom jcartu metódou abliteration spracúva text, uvažuje a volá nástroje.",
      maiImage27:
        "Model od Microsoftu na tejto trase vytvára z textu obrázky v rozlíšení 1K.",
      maiImage27Flash:
        "Rýchlejší variant MAI Image 2.7 vytvára z textu obrázky v rozlíšení 1K.",
      qwen4Max:
        "Qwen 4 Max. Vlajkový model od Alibaby na pokročilé uvažovanie, programovanie a analýzu. Pracuje s obrázkami a videom. Kontext: 1 milión tokenov.",
      kimiK31ProUncensored:
        "Kimi K3.1 Pro Uncensored. Najvýkonnejší model Kimi od Moonshot AI s odstráneným odmietaním pomocou metódy abliteration. Špičkové uvažovanie, odpovede bez poučovania a volanie nástrojov. Kontext: 1 milión tokenov.",
      deepseekV41Flash:
        "DeepSeek V4.1 Flash. Rýchly otvorený model od DeepSeek teraz pracuje aj s obrázkami. Zvláda náročné programovanie za veľmi nízku cenu. Kontext: 1 milión tokenov.",
      qwen38Flash:
        "Qwen 3.8 Flash. Rýchly multimodálny model od Alibaby pracuje s textom, obrázkami aj videom za nízku cenu. Kontext: 1 milión tokenov.",
      glm53:
        "GLM-5.3. Základný model od Z.AI na pokročilé uvažovanie a programovanie za nízku cenu. Kontext: 1 milión tokenov.",
      glm53Flash:
        "GLM-5.3 Flash. Rýchly multimodálny model od Z.AI spracúva veľké množstvá textu, obrázkov aj videa. Kontext: 1 milión tokenov.",
      mimoV26Pro:
        "MiMo V2.6 Pro. Prémiový model od Xiaomi na dôkladnú analýzu textu, obrázkov, videa a zvuku. Kontext: 1,05 milióna tokenov.",
      mimoV26Flash:
        "MiMo V2.6 Flash. Rýchly multimodálny model od Xiaomi. Dobre programuje a stojí veľmi málo. Kontext: 1,05 milióna tokenov.",
      metaMuseSpark13:
        "Meta Muse Spark 1.3. Multimodálny model od Meta dokáže v jednej analýze kombinovať text, obrázky a video. Kontext: 1 milión tokenov.",
      metaMuseWonder:
        "Meta Muse Wonder. Vlajkový model od Meta na špičkové uvažovanie, programovanie a tvorbu naprieč všetkými typmi médií. Kontext: 1 milión tokenov.",
      mistralLarge4:
        "Mistral Large 4. Európsky vlajkový model od Mistral AI pracuje s obrázkami a dobre programuje. Je lacnejší ako Medium 3.5. Kontext: 1 milión tokenov.",
      gemini4Hydrogen:
        "Gemini 4 Hydrogen. Všestranný model radu Gemini 4 od Googlu na rýchle programovanie s agentmi a analýzu. Prijíma text, obrázky, video a zvuk. Kontext: 1 milión tokenov.",
      gemini4Carbon:
        "Gemini 4 Carbon. Najvýkonnejší model Gemini od Googlu na najťažšie úlohy programovania, práce s agentmi a uvažovania. Podporuje všetky typy médií. Kontext: 1 milión tokenov.",
      minimaxM31Flash:
        "MiniMax M3.1 Flash. Rýchly multimodálny model od MiniMax prekonáva M3 v programovaní a práci agentov za polovicu jeho ceny alebo menej. Kontext: 1 milión tokenov.",
      metaMuseEmber:
        "Meta Muse Ember. Najmenší model radu Muse od Meta. Rýchlo volá nástroje, smeruje požiadavky a zvláda jednoduché programovanie za pár centov. Podporuje všetky typy médií. Kontext: 1 milión tokenov.",
      veniceDeepseekV41FlashUncensored:
        "DeepSeek V4.1 Flash Uncensored. Variant DeepSeek V4.1 Flash s odstráneným odmietaním cez Venice.ai. Zachováva výkon aj volanie nástrojov a odpovedá bez poučovania. Kontext: 1 milión tokenov.",
      drummerArtemis31b:
        "Artemis 31B. Model Gemma 4 doladený autorom TheDrummer na hranie rolí. Zvláda temné scény, explicitnú fikciu a zachováva spôsob reči postáv. Má nízku cenu, kontext 262 000 tokenov, podporuje obrázky a volanie nástrojov.",
      grokImagineImage2:
        "Grok Imagine Image 2.0. Obrazový model od xAI presnejšie dodržiava zadanie a vytvára kvalitnejšie obrázky.",
      recraftV41:
        "Recraft V4.1. Model Recraft na logá, plagáty a vizuály značky. Presne vykresľuje text v obrázkoch.",
      recraftV41Pro:
        "Recraft V4.1 Pro. Prémiový model Recraft vytvára detailnú grafiku značky a produktové vizuály v rozlíšení 2K pripravené na tlač.",
      recraftV41Flash:
        "Recraft V4.1 Flash. Rýchly a úsporný model Recraft na návrhy a hromadnú tvorbu. Jeden obrázok stojí menej ako 1 kredit.",
      qwenImage3:
        "Qwen Image 3. Rýchly model od Alibaby na tvorbu obrázkov za veľmi nízku cenu.",
      qwenImage3Pro:
        "Qwen Image 3 Pro. Prémiový model od Alibaby na tvorbu kvalitnejších a detailnejších obrázkov.",
      hailuo3:
        "Hailuo 3. Model od MiniMax na tvorbu videí s filmovým vzhľadom a plynulým pohybom.",
      seedance25:
        "Seedance 2.5. Vylepšený model od ByteDance na tvorbu videí s lepším pohybom a vernejším obrazom.",
      flux3Video:
        "Flux 3 Video. Vlajkový model od Black Forest Labs na tvorbu kvalitných videí, ktoré sa presne držia zadania.",
      grokImagineVideo15:
        "Grok Imagine Video 1.5. Aktualizovaný model od xAI na tvorbu videí s konzistentnejším vzhľadom medzi jednotlivými snímkami.",
      lyria3ProPreview:
        "Lyria 3 Pro Preview. Prémiový model od Googlu na tvorbu celých skladieb v produkčnej kvalite.",
      lyria3ClipPreview:
        "Lyria 3 Clip Preview. Rýchly model od Googlu na tvorbu krátkych hudobných ukážok.",
      geminiNanoBanana21:
        "Nano Banana 2.1. Model od Googlu vytvára a upravuje obrázky priamo v čete. Za obrázok zaplatíš polovicu ceny pôvodného modelu Nano Banana.",
      seedream55:
        "Seedream 5.5. Model od ByteDance vytvára a upravuje obrázky podľa viacerých referencií. Jeden obrázok stojí 2 kredity.",
      flux3Image:
        "FLUX.3. Vlajkový obrazový model od Black Forest Labs vykresľuje ostrejšie detaily a čitateľnejší text než FLUX.2.",
      flux3Klein:
        "FLUX.3 Klein. Malý a rýchly model od Black Forest Labs na návrhy a hromadnú tvorbu. Jeden obrázok stojí menej ako 1 kredit.",
      gptImage26Flare:
        "GPT Image 2.6 Flare. Rýchly model OpenAI na tvorbu a úpravu obrázkov.",
      gptImage26Sunburst:
        "GPT Image 2.6 Sunburst. Detailný obrazový model OpenAI na zložité kompozície a grafiku s množstvom textu.",
      geminiOmni12Flash:
        "Gemini Omni 1.2 Flash. Model od Googlu vytvára videá priamo so zvukom. Klipy majú od 3 do 15 sekúnd a rozlíšenie až 4K.",
      grokImagineVideo15Lite:
        "Grok Imagine Video 1.5 Lite. Rýchly a úsporný model xAI na tvorbu videí v rozlíšení až 1080p.",
      wan30:
        "Wan 3.0. Model od Alibaby vytvára videá priamo so zvukom. Klipy môžu mať až 30 sekúnd.",
      seedance2Mini:
        "Seedance 2.0 Mini. Úsporný model od ByteDance na tvorbu videí so zvukom v rozlíšení 480p a 720p.",
      seedance25Flash:
        "Seedance 2.5 Flash. Rýchly variant Seedance 2.5 od ByteDance vytvára videá so zvukom do 30 sekúnd v rozlíšení 480p a 720p.",
      hailuo3Max:
        "Hailuo 3 Max. Rýchlejší a lacnejší variant Hailuo 3 od MiniMax. Vytvára videá bez zvuku v rozlíšení 768p.",
      runwayGen45:
        "Runway Gen-4.5. Model od Runway tvorí z textu a obrázkov videá s filmovým vzhľadom v rozlíšení 720p.",
    },
  },
  modelUtilities: {
    adultExplicit: "Explicitný obsah pre dospelých",
    adultImplied: "Naznačený obsah pre dospelých",
    analysis: "Analýza",
    chat: "Čet",
    coding: "Programovanie",
    conspiracy: "Konšpiračné teórie",
    controversial: "Kontroverzné témy",
    creative: "Tvorivé písanie",
    fast: "Rýchly",
    harmful: "Potenciálne škodlivý obsah",
    illegalInfo: "Informácie o nelegálnych činnostiach",
    imageGen: "Tvorba obrázkov",
    legacy: "Starší model",
    medicalAdvice: "Zdravotné rady",
    offensiveLanguage: "Urážlivý jazyk",
    politicalLeft: "Ľavicové politické názory",
    politicalRight: "Pravicové politické názory",
    reasoning: "Pokročilé uvažovanie",
    roleplay: "Hranie rolí",
    roleplayDark: "Hranie rolí s temnými témami",
    smart: "Inteligentný",
    uncensored: "Bez cenzúry",
    violence: "Násilie",
    vision: "Rozpoznávanie obrázkov",
  },
  input: {
    attachments: {
      uploadFile: "Priložiť súbory",
      attachedFiles: "Priložené súbory",
      addMore: "Priložiť ďalšie",
    },
  },
};
