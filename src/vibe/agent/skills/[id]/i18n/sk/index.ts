import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nástroje AI",
  tags: {
    skills: "zručnosti",
  },
  voices: {
    MALE: "Mužský hlas",
    FEMALE: "Ženský hlas",
  },
  enums: {
    category: {
      companion: "Spoločníci",
      assistant: "Asistenti",
      coding: "Programovanie",
      creative: "Tvorba",
      writing: "Písanie",
      analysis: "Analýza",
      roleplay: "Hranie rolí",
      education: "Vzdelávanie",
      controversial: "Kontroverzné",
      background: "Na pozadí",
      custom: "Vlastné",
    },
    ownershipType: {
      system: "Vstavaná zručnosť",
      user: "Tvoja zručnosť",
      public: "Od komunity",
    },
  },

  get: {
    title: "Zobraziť zručnosť",
    titleShort: "Podrobnosti o zručnosti",
    dynamicTitle: "Zručnosť: {{name}}",
    description: "Načíta zručnosť podľa ID.",
    container: {
      title: "Podrobnosti o zručnosti",
      description: "Podrobnosti o požadovanej zručnosti",
    },
    backButton: {
      label: "Späť k zručnostiam",
    },
    openFullPage: "Otvoriť celú stránku",
    editButton: {
      label: "Upraviť zručnosť",
    },
    customizeButton: {
      label: "Prispôsobiť zručnosť",
    },
    deleteButton: {
      label: "Odstrániť zručnosť",
    },
    addToFavoritesButton: {
      label: "Pridať medzi obľúbené",
    },
    inCollection: "V zbierke",
    useNow: "Použiť teraz",
    goToChat: "Prejsť do četu",
    addAnother: "Pridať ďalšie",
    addAnotherTooltip: "Pridaj si ďalšiu konfiguráciu tejto zručnosti.",
    variants: {
      title: "Vybrať model",
      strength: "Silná stránka",
      weakness: "Slabá stránka",
    },
    addToCollection: "Pridať do kolekcie:",
    addAllToFavorites: "Pridať všetky modely",
    quickAdd: "Pridať",
    tweakAndAdd: "Prispôsobiť a pridať",
    edit: "Upraviť",
    copyAndCustomize: "Vytvoriť vlastnú verziu",
    delete: "Odstrániť",
    vote: "Hlasovať",
    report: "Nahlásiť",
    actions: "Akcie",
    designSelector: {
      label: "Dizajn:",
      current: "Aktuálny",
      a: "A: App Store",
      b: "B: Rozdelená hlavička",
      c: "C: Výrazná karta",
      d: "D: Dva riadky",
    },
    addVariant: "Pridať ďalší model",
    addVariantHint: "Iný model, osobnosť alebo štýl",
    yourskill: "Tvoja zručnosť",
    signupPrompt: {
      title: "Prispôsobiť túto zručnosť",
      description:
        "Zaregistruj sa a vytvor si vlastnú verziu zručnosti s nastaveniami podľa seba.",
      backButton: "Späť",
      signupButton: "Vytvoriť účet",
      loginButton: "Prihlásiť sa",
    },
    id: {
      label: "ID zručnosti",
      description: "Krátky identifikátor zručnosti (slug)",
    },
    systemPrompt: {
      label: "Systémové zadanie",
      copy: "Kopírovať",
      copied: "Skopírované!",
      view: "Zobraziť celé zadanie",
    },
    models: {
      brain: "Mozog",
      eyes: "Oči",
      ears: "Uši a hlas",
      media: "Médiá",
      slots: {
        chat: "Čet",
        imageVision: "Analýza obrázkov",
        videoVision: "Analýza videa",
        stt: "Prepis reči",
        tts: "Syntéza reči",
        audioVision: "Analýza zvuku",
        imageGen: "Tvorba obrázkov",
        musicGen: "Tvorba hudby",
        videoGen: "Tvorba videa",
      },
    },
    response: {
      skill: {
        title: "zručnosť",
        id: { content: "ID zručnosti" },
        name: { content: "Názov zručnosti" },
        description: { content: "Opis zručnosti" },
        icon: { content: "Ikona zručnosti" },
        systemPrompt: { content: "Systémové zadanie" },
        category: { content: "Kategória" },
        source: { content: "Zdroj" },
        preferredModel: { content: "Preferovaný model" },
        voice: { content: "Hlas" },
        modelSelection: { title: "Výber modelu" },
        selectionType: { content: "Typ výberu" },
        minIntelligence: { content: "Minimálna inteligencia" },
        maxIntelligence: { content: "Maximálna inteligencia" },
        minPrice: { content: "Minimálna cena" },
        maxPrice: { content: "Maximálna cena" },
        minContent: { content: "Minimálna úroveň obsahu" },
        maxContent: { content: "Maximálna úroveň obsahu" },
        preferredStrengths: { content: "Uprednostnené prednosti" },
        ignoredWeaknesses: { content: "Ignorované slabiny" },
        manualModelId: { content: "Ručný výber modelu" },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš získať prístup k tomuto zdroju, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "K tomuto zdroju nemáš prístup.",
      },
      notFound: {
        title: "Zručnosť sa nenašla.",
        description: "Požadovaná zručnosť neexistuje",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba pri získavaní zručnosti",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt so súčasným stavom",
      },
    },
    voiceModelSelection: {
      systemDefault: "Predvolené nastavenie systému",
    },
    success: {
      title: "Úspech",
      description: "Zručnosť sa načítala.",
    },
    share: {
      button: "Zdieľať a zarobiť",
      titleNamed: "Zdieľať {{name}} a zarobiť",
      title: "Zdieľať zručnosť a získať odmenu",
      description:
        "Zdieľaj zručnosť cez svoj odporúčací odkaz. Za každého používateľa, ktorý sa cezň zaregistruje, získaš opakovanú províziu 10 %.",
      selectCode: "Vyber odporúčací kód",
      noCodesYet: "Zatiaľ nemáš odporúčací kód",
      createCode: "Vytvoriť kód",
      codePlaceholder: "napr. MYCODE",
      creating: "Vytvára sa…",
      createFailed: "Kód sa nepodarilo vytvoriť. Skús iný.",
      linkReady: "Tvoj odkaz na zdieľanie",
      copied: "Skopírované!",
      copyLink: "Kopírovať odkaz",
      close: "Zavrieť",
      authRequired:
        "Vytvor si bezplatný účet, získaj odporúčací odkaz a začni zarábať.",
      signup: "Vytvoriť bezplatný účet",
      login: "Máš účet? Prihlás sa",
    },
  },
  patch: {
    title: "Upraviť zručnosť",
    titleShort: "Upraviť zručnosť",
    dynamicTitle: "Upraviť: {{name}}",
    container: {
      title: "Upraviť zručnosť",
      description: "Upraviť existujúcu vlastnú zručnosť",
    },
    backButton: {
      label: "Späť na zručnosť",
    },
    deleteButton: {
      label: "Odstrániť zručnosť",
    },
    submitButton: {
      label: "Upraviť zručnosť",
      loadingText: "Zručnosť sa ukladá…",
    },
    actions: {
      update: "Upraviť zručnosť",
      updating: "Zručnosť sa ukladá",
    },
    response: {
      success: {
        content: "Zručnosť sa uložila.",
      },
    },
    id: {
      label: "ID zručnosti",
      description: "Krátky identifikátor zručnosti, ktorú chceš upraviť",
    },
    name: {
      label: "Názov zručnosti",
      description:
        "Vyber názov, pod ktorým zručnosť ľahko nájdeš ty aj ostatní.",
      placeholder: "Zadaj názov zručnosti",
      validation: {
        minLength: "Názov musí mať aspoň 2 znaky.",
        maxLength: "Názov môže mať najviac 100 znakov.",
      },
    },
    tagline: {
      label: "Slogan zručnosti",
      description: "Vystihni zručnosť jednou krátkou vetou.",
      placeholder: "Zadaj krátky slogan",
      validation: {
        minLength: "Slogan musí mať aspoň 2 znaky.",
        maxLength: "Slogan môže mať najviac 500 znakov.",
      },
    },
    icon: {
      label: "Ikona zručnosti",
      description: "Vyber emoji. Bude sa zobrazovať ako ikona zručnosti.",
    },
    description: {
      label: "Opis zručnosti",
      description:
        "Opíš, akú úlohu má zručnosť plniť a s čím pomáha. Uveď konkrétne príklady alebo podrobnosti.",
      placeholder: "Opíš účel zručnosti a čo dokáže",
      validation: {
        minLength: "Opis musí mať aspoň 10 znakov.",
        maxLength: "Opis môže mať najviac 500 znakov.",
      },
    },
    category: {
      label: "Kategória",
      description: "Vyber kategóriu, v ktorej ostatní zručnosť ľahko nájdu.",
    },
    isPublic: {
      label: "Zverejniť",
      description:
        "Zapni zdieľanie s komunitou. Ak je vypnuté, zručnosť uvidíš iba ty.",
    },
    chatModel: {
      label: "Model pre čet",
      placeholder: "Predvolené nastavenie systému",
    },
    voice: {
      label: "Hlas",
      description:
        "Vyber hlas pre zvukové odpovede. Každá zručnosť môže používať iný hlas.",
      placeholder: "Predvolené nastavenie systému",
    },
    sttModel: {
      label: "Model na prepis reči",
      description: "Model na rozpoznávanie reči",
      placeholder: "Predvolené nastavenie systému",
    },
    imageVisionModel: {
      label: "Model na analýzu obrázkov",
      description: "Model na analýzu obrázkov",
      placeholder: "Predvolené nastavenie systému",
    },
    videoVisionModel: {
      label: "Model na analýzu videa",
      description: "Model na analýzu videí",
      placeholder: "Predvolené nastavenie systému",
    },
    audioVisionModel: {
      label: "Model na analýzu zvuku",
      description: "Model na analýzu zvuku",
      placeholder: "Predvolené nastavenie systému",
    },
    imageGenModel: {
      label: "Model na tvorbu obrázkov",
      description: "Model na tvorbu obrázkov",
      placeholder: "Predvolené nastavenie systému",
    },
    musicGenModel: {
      label: "Model na tvorbu hudby",
      description: "Model na tvorbu hudby",
      placeholder: "Predvolené nastavenie systému",
    },
    videoGenModel: {
      label: "Model na tvorbu videa",
      description: "Model na tvorbu videí",
      placeholder: "Predvolené nastavenie systému",
    },
    systemPrompt: {
      label: "Systémové zadanie",
      description:
        "Urči, ako sa má zručnosť správať, akú má mať osobnosť a v čom sa má vyznať. Toto zadanie určuje, ako AI odpovedá. Spresni tón, oblasti odbornosti a štýl rozhovoru.",
      placeholder: "Si asistent so zameraním na…",
      validation: {
        minLength: "Systémové zadanie musí mať aspoň 10 znakov.",
        maxLength: "Systémové zadanie môže mať najviac 5 000 znakov.",
      },
    },
    source: {
      label: "Zdroj",
      description: "Zdroj zručnosti (vstavaná, vlastná alebo komunitná)",
    },
    modelSelection: {
      label: "Výber modelu",
      description:
        "Vyberte konkrétny model AI alebo nechajte systém vybrať model podľa filtrov.",
    },
    variants: {
      label: "Varianty",
      description:
        "Pomenované varianty s vlastným výberom modelu. Každý variant potrebuje id (jedinečný reťazec), modelSelection (povinný výber modelu) a isDefault (presne jeden variant musí mať hodnotu true). Voliteľné sú displayName a vlastné modely pre hlas, analýzu vstupov a tvorbu médií.",
      addButton: "Pridať variant",
      setDefault: "Nastaviť ako predvolený",
      remove: "Odobrať",
      defaultBadge: "Predvolené",
      namePlaceholder: "Názov variantu (nepovinné)",
      skillDefaults: "Predvolené nastavenia zručnosti",
      skillDefaultsHint:
        "Použijú sa tam, kde variant nemá vlastné nastavenie pre daný typ vstupu alebo výstupu.",
    },
    preferredModel: {
      label: "Preferovaný model",
      description: "Preferovaný model AI pre túto zručnosť",
    },
    availableTools: {
      label: "Povolené nástroje",
      description:
        "Zoznam povolených nástrojov. Každá položka potrebuje toolId. Dostupné identifikátory získate z system_help_GET. Ak má používateľ vykonanie najprv potvrdiť, nastavte requiresConfirmation: true. Hodnota null prevezme globálne nastavenia.",
    },
    pinnedTools: {
      label: "Pripnuté nástroje",
      description:
        "Nástroje pripnuté na paneli pre rýchly prístup pri používaní zručnosti. Vyberte ich z availableTools. Hodnota null použije predvolené pripnuté nástroje.",
    },
    compactTrigger: {
      label: "Hranica na skrátenie kontextu (tokeny)",
      description:
        "Počet tokenov, pri ktorom sa automaticky skráti kontext rozhovoru. Hodnota null použije globálne predvolené nastavenie.",
    },

    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Údaje zručnosti sú neplatné.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš upravovať zručnosti, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Túto zručnosť nemáš oprávnenie upraviť.",
      },
      notFound: {
        title: "Zručnosť sa nenašla.",
        description: "Zručnosť, ktorú chceš upraviť, neexistuje.",
      },
      server: {
        title: "Chyba servera",
        description: "Zručnosť sa nepodarilo uložiť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri ukladaní zručnosti nastal konflikt.",
      },
    },
    success: {
      title: "Zručnosť uložená",
      description: "Vlastná zručnosť sa uložila.",
    },
  },
  delete: {
    title: "Odstrániť zručnosť",
    titleShort: "Odstrániť zručnosť",
    dynamicTitle: "Odstrániť: {{name}}",
    description: "Odstrániť vlastnú zručnosť",
    container: {
      title: "Odstrániť zručnosť",
      description: "Trvalo odstrániť túto vlastnú zručnosť",
    },
    backButton: {
      label: "Späť na zručnosť",
    },
    actions: {
      delete: "Odstrániť zručnosť",
      deleting: "Zručnosť sa odstraňuje",
    },
    id: {
      label: "ID zručnosti",
      description: "Krátky identifikátor zručnosti, ktorú chceš odstrániť",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Údaje zručnosti sú neplatné.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Na odstránenie tejto zručnosti potrebuješ oprávnenie.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Túto zručnosť nemáš oprávnenie odstrániť.",
      },
      notFound: {
        title: "Zručnosť sa nenašla.",
        description: "Zručnosť, ktorú chceš odstrániť, neexistuje.",
      },
      server: {
        title: "Chyba servera",
        description: "Zručnosť sa nepodarilo odstrániť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri odstraňovaní zručnosti nastala neočakávaná chyba.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Zručnosť medzitým upravil iný používateľ.",
      },
    },
    success: {
      title: "Zručnosť odstránená",
      description: "Zručnosť sa odstránila.",
      content: "Zručnosť sa odstránila.",
    },
  },
};
