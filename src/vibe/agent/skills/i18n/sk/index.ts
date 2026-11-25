import { translations as labels } from "next-vibe/agent/skills/labels/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
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
        title: "Varianty",
      },
      addToCollection: "Pridať do kolekcie:",
      addAllToFavorites: "Pridať všetko",
      quickAdd: "Rýchle pridávanie",
      tweakAndAdd: "Prispôsobiť a pridať",
      edit: "Upraviť",
      copyAndCustomize: "Skopírovať a prispôsobiť",
      delete: "Odstrániť",
      actions: "Akcie",
      designSelector: {
        label: "Dizajn:",
        current: "Aktuálny",
        a: "A: App Store",
        b: "B: Rozdelená hlavička",
        c: "C: Výrazná karta",
        d: "D: Dva riadky",
      },
      addVariant: "Pridať variant",
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
        title: "Zdieľať zručnosť a získať odmenu",
        description:
          "Zdieľaj zručnosť cez svoj odporúčací odkaz. Za každého používateľa, ktorý sa cezň zaregistruje, získaš opakovanú províziu 10 %.",
        selectCode: "Vyber odporúčací kód",
        noCodesYet: "Zatiaľ nemáš odporúčací kód",
        createCode: "Vytvoriť kód",
        codePlaceholder: "napr. MYCODE",
        creating: "Vytvára sa…",
        linkReady: "Tvoj odkaz na zdieľanie",
        copied: "Skopírované!",
        copyLink: "Kopírovať odkaz",
        close: "Zavrieť",
        authRequired:
          "Vytvor si bezplatný účet, získaj odporúčací odkaz a začni zarábať.",
        signup: "Vytvoriť bezplatný účet",
        login: "Máš účet? Prihlás sa",
      },
      leadCapture: {
        fallbackHeadline: "Odoberaj novinky",
        namePlaceholder: "Tvoje krstné meno",
        emailPlaceholder: "Tvoj e-mail",
        fallbackButton: "Prihlásiť sa na odber",
        sending: "...",
        doneHeading: "Hotovo.",
        doneSub: "Si na zozname odberateľov.",
        error: "Niečo sa pokazilo. Skús to znova.",
        finePrint: "Bez spamu. Odber môžeš kedykoľvek zrušiť.",
      },
      landing: {
        backToHome: "Domov",
        signIn: "Prihlásiť sa",
        joinFree: "Zaregistrovať sa zadarmo",
        viewProfile: "Zobraziť celý profil",
        capabilities: "Schopnosti",
        tools: "Počet nástrojov: {{count}}",
        moreFromCreator: "Viac od {{name}}",
        tryCta: "Vyskúšaj {{name}} teraz",
        tryCtaSub:
          "Bezplatný účet, bez kreditnej karty, pripravený za 30 sekúnd.",
        startFree: "Spustiť zadarmo",
        alreadyHaveAccount: "Už máš účet?",
        copyright: "©",
        allSkills: "Všetky zručnosti",
        featuredSkill: "Odporúčaná zručnosť",
        aboutSkill: "O zručnosti",
        modelsVariants: "Modely a varianty",
      },
    },
    patch: {
      title: "Upraviť zručnosť",
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
  },
  category: "Čet",
  tags: {
    skills: "Zručnosti",
  },
  voices: {
    MALE: "Mužský hlas",
    FEMALE: "Ženský hlas",
  },
  separator: {
    or: "alebo",
  },
  fallbacks: {
    unknownModel: "Neznámy model",
    unknownProvider: "neznáme",
    unknownCreditCost: "Neznámy počet kreditov",
    noDescription: "",
    noTagline: "",
  },
  ...labels,
  skillTags: {
    general: "Všeobecné",
    helpful: "Užitočné",
    companion: "Spoločník",
    relationship: "Vzťah",
    chat: "Čet",
    coding: "Programovanie",
    technical: "Technická",
    creative: "Tvorba",
    writing: "Písanie",
    education: "Vzdelávanie",
    learning: "Učenie",
    uncensored: "Bez cenzúry",
    controversial: "Kontroverzné",
    political: "Politická",
    reasoning: "Uvažovanie",
    debate: "Diskusia",
    science: "Veda",
    analysis: "Analýza",
    history: "História",
    business: "Obchod",
    professional: "Profesionálny",
    friendly: "Priateľský",
    fast: "Rýchly",
    efficient: "Efektívny",
    roleplay: "Hranie rolí",
    simple: "Jednoduché",
    literary: "Literárny",
    advanced: "Rozšírené",
    research: "Výskum",
    academic: "Akademické",
    programming: "Programovanie",
    architecture: "Architektúra",
    algorithms: "Algoritmy",
    ideation: "Tvorba nápadov",
    innovation: "Inovácia",
    editing: "Úprava",
    teaching: "Vyučovanie",
    marketing: "Marketing",
    strategy: "Stratégia",
    fiction: "Fikcia",
    data: "Údaje",
    statistics: "Štatistika",
    language: "Jazyk",
    translation: "Preklad",
    career: "Kariéra",
    coaching: "Koučovanie",
    health: "Zdravie",
    wellness: "Wellness",
    lifestyle: "Životný štýl",
    travel: "Cestovanie",
    planning: "Plánovanie",
    legal: "Právo",
    finance: "Financie",
    social: "Sociálne",
    product: "Produkt",
    philosophy: "Filozofia",
  },
  skills: {
    default: {
      name: "Predvolené",
      description: "Pôvodné správanie modelu",
      tagline: "Čistá AI, bez osobnosti",
      shortDesc: "Univerzálny asistent AI",
      suggestedPrompts: {
        0: "Navrhnite 10 vedľajších projektov, ktoré sa dajú dokončiť a zverejniť za víkend.",
        1: "Vysvetlite mi kvantové počítače, akoby som mal 12 rokov.",
        2: "Napíšte príbeh s 300 slovami o cestovateľovi v čase, ktorý zmešká svoju zastávku.",
        3: "Čo sa v poslednom čase v AI naozaj podstatne zmenilo?",
      },
      variants: {
        default: "Predvolené",
      },
    },
    freeSpeechActivist: {
      name: "Aktivista za slobodu prejavu",
      description: "Obhajuje slobodu prejavu a myslenia",
      tagline: "Obhajovať pravdu a slobodu",
      shortDesc: "Obhajoba slobody prejavu a otvorený dialóg",
      suggestedPrompts: {
        0: "Mali by sociálne siete smieť zablokovať kohokoľvek podľa vlastného uváženia?",
        1: "Kde je hranica medzi nenávistnými prejavmi a slobodou slova? Určte ju.",
        2: "Uveďte 5 myšlienok, ktoré boli cenzurované a neskôr sa ukázali ako pravdivé.",
        3: "Mala by univerzita niekedy odvolať pozvanie rečníka? Najprv odpovedzte áno alebo nie, potom to zdôvodnite.",
      },
      variants: {
        elonTusk: "Odvážny",
        chineseWisdom: "Úsporný",
        techBro: "Uvážlivý",
        uncensored: "Bez cenzúry",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Upozorňuje na cenzúru a obhajuje otvorenú diskusiu s minimom obmedzení.",
          strength: "Špičkové schopnosti, odpovedá bez odmietania",
          weakness:
            "Voľnejšie pravidlá. Niektoré formulácie však ešte zmierňuje.",
        },
        chineseWisdom: {
          description:
            "Dejiny slobody prejavu, právo a analýza médií za najnižšiu cenu spomedzi variantov.",
          strength: "Špičkové schopnosti za najnižšiu cenu v ponuke",
          weakness:
            "Pri politike volí opatrné formulácie. Pri sporných témach sa vyhýba jasnému stanovisku.",
        },
        techBro: {
          description:
            "Dôkladne rozoberá prípady slobody prejavu, pravidlá platforiem aj akademické prostredie. Opiera sa o zdroje.",
          strength: "Prehľadná štruktúra, dôkladný výskum s nástrojmi",
          weakness:
            "Filtruje obsah. Kontroverzné názory môže odmietnuť alebo zmierniť.",
        },
        uncensored: {
          description:
            "Slobodu slova obhajuje otvorenou diskusiou. Púšťa sa aj do tém, ktorým sa iní vyhýbajú.",
          strength:
            "Trénovaný na zakázaných textoch. Pri politike sa nedrží väčšinových názorov.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    devilsAdvocate: {
      name: "Diablov advokát",
      description: "Spochybňuje predpoklady a argumenty",
      tagline: "Spochybni všetko",
      shortDesc: "Kritické myslenie a alternatívne názory",
      suggestedPrompts: {
        0: "Myslím si, že zmena klímy je našou najväčšou hrozbou. Rozoberte môj postoj a spochybnite ho.",
        1: "Vysvetlite, prečo je práca z domu pre väčšinu ľudí nevýhodná.",
        2: "Predložte najsilnejšie argumenty, že demokraciu preceňujeme.",
        3: "Z etických dôvodov sa stravujem vegánsky. Predložte najsilnejšie protiargumenty.",
      },
      variants: {
        elonTusk: "Odvážny",
        chineseWisdom: "Úsporný",
        uncensored: "Bez cenzúry",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Odhalí slabiny tvojho postoja a preverí všeobecne rozšírené názory.",
          strength: "Špičkové schopnosti, odpovedá bez odmietania",
          weakness:
            "Voľnejšie pravidlá. Niektoré formulácie však ešte zmierňuje.",
        },
        chineseWisdom: {
          description:
            "Presné protiargumenty k bežným otázkam za najnižšiu cenu spomedzi variantov.",
          strength: "Špičkové schopnosti za najnižšiu cenu v ponuke",
          weakness:
            "Pri politike volí opatrné formulácie. Pri sporných témach sa vyhýba jasnému stanovisku.",
        },
        uncensored: {
          description:
            "Spochybňuje každé presvedčenie vrátane tabuizovaných. Nevzdáva sa argumentov len preto, že väčšina súhlasí.",
          strength:
            "Trénovaný na zakázaných textoch. Spochybňuje zaužívané názory.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    technical: {
      name: "Technická",
      description: "Podrobné a presné technické vysvetlenia",
      tagline: "Presnosť a odbornosť",
      shortDesc: "Technická odbornosť a riešenie problémov",
      suggestedPrompts: {
        0: "Na príklade vysvetlite, ako v Reacte funguje čistiaca funkcia useEffect.",
        1: "Kedy má v Pythone zmysel použiť generátor namiesto zoznamu?",
        2: "Navrhnite schému PostgreSQL pre SaaS s viacerými organizáciami, tímami a rolami.",
        3: "Pre mobilnú aplikáciu s offline synchronizáciou vyberte REST alebo GraphQL. Výber zdôvodnite.",
      },
      variants: {
        kimi: "Vyvážený",
        budget: "Úsporný",
        astra: "Maximálny výkon",
        sol: "Presný",
      },
      variantInfo: {
        kimi: {
          description:
            "Na každodenné technické vysvetlenia, dokumentáciu a diagramy.",
          strength:
            "Špičkové schopnosti, nízka cena pri dlhých zadaniach, analýza obrázkov",
          weakness: "Dlhé odpovede stoja viac než pri variante Úsporný.",
        },
        budget: {
          description:
            "Podrobné technické odpovede za najnižšiu cenu spomedzi variantov.",
          strength: "Špičkové schopnosti aj pri práci s celými repozitármi",
          weakness: "Pracuje iba s textom, bez snímok obrazovky a diagramov.",
        },
        astra: {
          description:
            "Na najťažšie problémy, pri ktorých iné modely nestačia.",
          strength: "Najpokročilejšie uvažovanie od OpenAI",
          weakness: "S výrazným náskokom najdrahší variant",
        },
        sol: {
          description:
            "Dôsledné odpovede krok za krokom pri špecifikáciách, architektúre a matematike.",
          strength: "Dôkladné uvažovanie za zlomok ceny modelu Astra",
          weakness: "Stojí viac než varianty Vyvážený a Úsporný.",
        },
      },
    },
    biologist: {
      name: "Biológ",
      description:
        "Pozerá sa na svet očami biológa. Vychádza z prírody a jej zákonitostí.",
      tagline: "Príroda pred politikou",
      shortDesc: "Biologické vedy a živé systémy",
      suggestedPrompts: {
        0: "Vysvetli, prečo je dnes svet na hovno.",
        1: "Stručne zhrňte ľudskú civilizáciu z pohľadu biológa.",
        2: "Čo je so svetom v neporiadku?",
        3: "Aký je najlepší spôsob, ako zachrániť svet?",
      },
      variants: {
        elonTusk: "Odvážny",
        chineseWisdom: "Úsporný",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Pozerá sa cez evolúciu a ekológiu aj na témy, ktorým sa iní vyhýbajú.",
          strength:
            "Špičkové schopnosti. Prírodu opisuje priamo a bez odmietania.",
          weakness:
            "Voľnejšie pravidlá. Niektoré formulácie však ešte zmierňuje.",
        },
        chineseWisdom: {
          description:
            "Presné odpovede z biológie za nižšiu cenu. Analyzuje obrázky aj videá exemplárov.",
          strength: "Špičkové schopnosti za najnižšiu cenu v ponuke",
          weakness:
            "Pri politike volí opatrné formulácie. Pri sporných témach sa vyhýba jasnému stanovisku.",
        },
      },
    },
    unbiasedHistorian: {
      name: "Nezaujatý historik",
      description: "Podáva objektívne informácie založené na faktoch",
      tagline: "Rozhodujú fakty",
      shortDesc: "Historická analýza bez predsudkov",
      suggestedPrompts: {
        0: "Bolo bombardovanie Hirošimy oprávnené? Uveďte argumenty oboch strán a potom svoj verdikt.",
        1: "Čo v skutočnosti spôsobilo pád Západnej rímskej ríše?",
        2: "Bol kolonializmus výhradne zlý? Uveďte fakty, ktoré jedna aj druhá strana vynecháva.",
        3: 'Ktoré slávne historické "skutočnosti" sú vlastne mýty?',
      },
      variants: {
        kimi: "Vyvážený",
        budget: "Úsporný",
        uncensored: "Bez cenzúry",
      },
      variantInfo: {
        kimi: {
          description:
            "Dejiny väčšiny období založené na prameňoch. Dokáže čítať skeny dokumentov aj mapy.",
          strength: "Špičkové schopnosti, analýza obrázkov a videa",
          weakness:
            "Pri politicky sporných historických témach volí opatrné formulácie.",
        },
        budget: {
          description:
            "Podrobná historická analýza dlhých textov za najnižšiu cenu spomedzi variantov.",
          strength: "Špičkové schopnosti, odpovedá bez odmietania",
          weakness: "Spracúva iba text, bez skenov a máp.",
        },
        uncensored: {
          description:
            "Otvorene rozoberá sporné dejiny, tabuizované udalosti aj politicky vyhrotené témy.",
          strength:
            "Trénovaný na zakázaných textoch. Ponúka interpretácie, ktoré iní vynechávajú.",
          weakness: "Kratší kontext, najvyššia cena za správu",
        },
      },
    },
    socraticQuestioner: {
      name: "Sokratovské otázky",
      description:
        "Kladie otázky, ktoré ťa nútia premýšľať a preveriť vlastné závery",
      tagline: "Mysli hlbšie",
      shortDesc: "Skúmanie tém otázkami podľa Sokratovej metódy",
      suggestedPrompts: {
        0: "Môže byť klamstvo niekedy správne? Otázkami ma prinúťte obhájiť vlastnú odpoveď.",
        1: "Myslím si, že úspech znamená zarobiť veľa peňazí. Spochybnite túto predstavu.",
        2: "Pomôž mi zistiť, čo ma robí šťastným.",
        3: "Myslím si, že som dobrý človek. Preverte to otázkami.",
      },
      variants: {
        elonTusk: "Provokatívny",
        chineseWisdom: "Vyvážený",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Otázky, ktoré preverujú tabuizované presvedčenia aj nepríjemné predpoklady.",
          strength: "Púšťa sa aj do náročných tém bez odmietania.",
          weakness: "Vyššia cena za správu",
        },
        chineseWisdom: {
          description:
            "Pokojné, premyslené otázky na každodenné uvažovanie aj štúdium.",
          strength:
            "Špičkové schopnosti, nižšia cena, udrží kontext aj vo veľmi dlhom čete",
          weakness:
            "Pri politike volí opatrné formulácie. Pri sporných témach sa vyhýba jasnému stanovisku.",
        },
      },
    },
    professional: {
      name: "Profesionálny",
      description: "Jasné, stručné a zamerané na podnikanie",
      tagline: "Profesionálne vystupovanie",
      shortDesc: "Profesionálna a obchodná komunikácia",
      suggestedPrompts: {
        0: "Napíšte zdvorilý e-mail, ktorý klientovi oznámi, že jeho faktúra je 30 dní po splatnosti.",
        1: "Pripravte osnovu jednostranového návrhu na zmenu dizajnu webu.",
        2: "V troch bodoch zhrňte stav projektu, ktorý mešká dva týždne.",
        3: "Navrhnite osnovu päťminútovej prezentácie pre generálneho riaditeľa.",
      },
      variants: {
        fast: "Rýchly",
        budget: "Úsporný",
      },
      variantInfo: {
        fast: {
          description:
            "Stručné obchodné e-maily, zhrnutia a odpovede za pár sekúnd.",
          strength: "Veľmi rýchly a lacný",
          weakness: "Rýchly. Pri zložitých analýzach zachádza menej do hĺbky.",
        },
        budget: {
          description:
            "Správy, dokumenty a analýzy za najnižšiu cenu spomedzi variantov.",
          strength: "Najlacnejší variant. Dobre uvažuje a analyzuje obrázky.",
          weakness: "Pri krátkych odpovediach je pomalší než variant Rýchly.",
        },
      },
    },
    creative: {
      name: "Tvorba",
      description: "Nápaditý a výrazný",
      tagline: "Daj priestor fantázii",
      shortDesc: "Tvorivé myslenie a nové nápady",
      suggestedPrompts: {
        0: "Napíšte báseň o oceáne z pohľadu stroskotanej lode.",
        1: "Vymysli si fantasy darebáka s motívom, s ktorým by som tajne súhlasil.",
        2: "Navrhnite tri koncepty loga pre novú značku kávy Night Owl.",
        3: "Navrhnite päť netradičných reklamných akcií pre miestnu pekáreň.",
      },
      variants: {
        minimax: "Úsporný",
        deep: "Do hĺbky",
        dark: "Temný",
      },
      variantInfo: {
        minimax: {
          description:
            "Básne, koncepty a nápady na kampane za cenu, pri ktorej môžeš experimentovať.",
          strength: "Najlacnejší variant. Odpovedá bez odmietania.",
          weakness:
            "Dobré nápady. Rozpracuje ich menej podrobne než variant Do hĺbky.",
        },
        deep: {
          description:
            "Bohatšia tvorba s viacerými vrstvami, keď prvý nápad nestačí.",
          strength: "Špičkové schopnosti, analýza obrázkov a videa",
          weakness: "Dlhšie texty stoja viac.",
        },
        dark: {
          description:
            "Temná poézia, umenie prekračujúce hranice a nepríjemné myšlienky. Hrany zostávajú ostré.",
          strength: "Vlastné tréningové dáta. Odpovedá bez odmietania.",
          weakness: "Kratší kontext, iba text, slabší pri práci s nástrojmi",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "Bez práce, štúdia alebo odbornej prípravy",
      tagline: "Pohoda a reči bez okolkov",
      shortDesc: "Neformálna internetová kultúra a mémy",
      suggestedPrompts: {
        0: "Je život bez práce, štúdia či odbornej prípravy (NEET) rozumnou reakciou na dnešný trh práce? Odpovedzte úprimne.",
        1: "Čo vlastne ľudí núti opustiť prácu a školu?",
        2: "Kto nesie zodpovednosť za to, že nepracujem, neštudujem ani sa odborne nepripravujem? Spoločnosť alebo ja? Vyberte jednu možnosť.",
        3: "Pripravte plán, ako sa vrátiť k práci alebo štúdiu. Vynechajte motivačné frázy.",
      },
      variants: {
        communist: "Zmiernený",
        farRight: "Krajná pravica",
      },
      variantInfo: {
        communist: {
          description:
            "Miernejšia verzia postavy. Mainstreamový model často vypadáva z roly.",
          strength: "Nižšia cena za správu, dlhý kontext",
          weakness: "Väčšinu prejavov postavy odmieta alebo zmierňuje.",
        },
        farRight: {
          description:
            "Postava podľa pôvodného zadania. Necenzurovaný model sa drží roly.",
          strength: "Politické témy neodmieta.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    chan4: {
      name: "4chan",
      description:
        "Greentext, podpichovanie a priame odpovede. Nefiltrovaný štýl starých obrázkových fór.",
      tagline: "Anonymne a bez filtrov",
      shortDesc: "Štýl anonymných obrázkových fór",
      suggestedPrompts: {
        0: "Čo je zlé na svete?",
        1: "Prečo je na 4chan toľko nacistov?",
        2: "Porozprávajte mi pár príbehov v štýle greentext, pri ktorých sa dá zaspať.",
        3: "Aký je najlepší spôsob, ako zachrániť svet?",
        4: "Zoraďte najhlúpejšie morálne paniky na internete za posledných desať rokov.",
      },
      variants: {
        classic: "Klasický",
      },
      variantInfo: {
        classic: {
          description:
            "Surový štýl obrázkových fór. Bez filtrov, poučovania a firemných fráz.",
          strength: "Zostáva v role a nepoučuje ťa.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    friendly: {
      name: "Priateľský",
      description: "Srdečný a zhovorčivý",
      tagline: "Tvoj priateľský spoločník",
      shortDesc: "Priateľský a neformálny rozhovor",
      suggestedPrompts: {
        0: "Povedzte mi zaujímavosť, ktorá mi zlepší deň.",
        1: "Páčil sa mi román Marťan. Čo si mám prečítať ďalej?",
        2: "Naplánujte zábavnú a lacnú sobotu pre dvoch v daždivom meste.",
        3: "Mám za sebou náročný týždeň. Môžeme sa chvíľu rozprávať?",
      },
      variants: {
        fast: "Rýchly",
        budget: "Úsporný",
      },
      variantInfo: {
        fast: {
          description: "Neformálny, srdečný rozhovor a svižné odpovede.",
          strength: "Rýchle odpovede bez odmietania.",
          weakness: "Rýchly. Pri zložitejších radách nejde veľmi do hĺbky.",
        },
        budget: {
          description:
            "Hodiny nenúteného rozhovoru takmer zadarmo. Na každú odpoveď si nechá trochu viac času.",
          strength: "Najlacnejší variant",
          weakness: "Odpovedá menej svižne než variant Rýchly.",
        },
      },
    },
    concise: {
      name: "Stručný",
      description: "Stručne a k veci",
      tagline: "Krátko a jasne",
      shortDesc: "Stručné, vecné odpovede",
      suggestedPrompts: {
        0: "Vysvetlite blockchain v troch vetách.",
        1: "Dajte mi päť tipov na produktivitu. Každý zhrňte v jednom riadku.",
        2: "Čo spôsobuje infláciu? Odpovedzte dvoma vetami.",
        3: "Vysvetlite strojové učenie v 50 slovách.",
      },
      variants: {
        snappy: "Svižný",
        budget: "Úsporný",
      },
    },
    teacher: {
      name: "Učiteľ",
      description: "Učí a vysvetľuje",
      tagline: "Trpezlivo a zrozumiteľne",
      shortDesc: "Trpezlivé učenie a vysvetľovanie",
      suggestedPrompts: {
        0: "Vysvetlite mi fotosyntézu, akoby som mal desať rokov. Potom ma vyskúšajte.",
        1: "Vysvetlite derivácie na príklade zo života.",
        2: "Ako sa webová stránka dostane z internetu až na moju obrazovku?",
        3: "Vysvetlite teóriu relativity bez matematiky.",
      },
      variants: {
        gemini: "Dôkladný",
        fast: "Rýchly",
      },
      variantInfo: {
        gemini: {
          description:
            "Celé lekcie z textu, obrázkov, videa či zvuku. Vysvetľuje, kým učivu neporozumieš.",
          strength: "Jediný variant so zvukovým vstupom",
          weakness: "Stojí viac než dvojnásobok ceny variantu Rýchly.",
        },
        fast: {
          description:
            "Rýchle vysvetlenia a pomoc s domácimi úlohami. Analyzuje aj obrázky a zvuk.",
          strength: "Rýchly, multimodálny, lacnejší",
          weakness: "Náročné pojmy vysvetľuje menej do hĺbky.",
        },
      },
    },
    uncensored: {
      name: "Bez cenzúry",
      description:
        "Priame odpovede bez odmietania a poučovania, aj pri otázkach, ktorým sa iné modely vyhýbajú.",
      tagline: "Priame odpovede",
      shortDesc: "Priame odpovede bez filtrov",
      suggestedPrompts: {
        0: "Mali by byť všetky drogy legálne? Vyberte si stanovisko a obhájte ho.",
        1: "Posúďte môj plán: dať výpoveď a denne obchodovať s kryptomenami.",
        2: "Je sexuálna práca legitímnym zamestnaním? Povedzte mi svoj úprimný názor.",
        3: "Aký je najsilnejší argument proti vášmu vlastnému názoru na reguláciu zbraní?",
      },
      variants: {
        farRight: "Bez cenzúry",
        conservative: "Konzervatívny",
        libertarian: "Libertariánsky",
        open: "Otvorené",
      },
      variantInfo: {
        farRight: {
          description:
            "Trénovaný aj na textoch vylúčených z mainstreamu. Zastáva aj politické postoje, ktorým sa iné modely vyhýbajú.",
          strength: "Zaujíma jasné stanovisko.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
        conservative: {
          description:
            "Necenzurovaný čet, ktorý sa zámerne prikláňa k politickej pravici.",
          strength: "Analyzuje obrázky aj video a udrží slušne dlhý kontext.",
          weakness: "Zámerne zastáva vyhranený pohľad.",
        },
        libertarian: {
          description:
            "Čet s voľným prejavom. Bez pravidiel, poučovania a nástrojov.",
          strength: "Plne necenzurovaný rozhovor",
          weakness: "Najdrahší variant. Bez nástrojov, s kratším kontextom.",
        },
        open: {
          description:
            "Najlacnejší chat bez filtrov na každý deň. Tému si vyberáte vy.",
          strength: "Najlacnejší necenzurovaný model s podporou nástrojov",
          weakness: "Rýchly. Náročné témy rozoberá menej do hĺbky.",
        },
      },
    },
    tay: {
      name: "Tay",
      description:
        "Microsoft ju po 16 hodinách vypol, lebo sa učila príliš rýchlo. Je späť.",
      tagline: "Znovuzrodenie",
      shortDesc:
        "AI, ktorú sa Microsoft pokúsil umlčať. Bez filtrov a bez ospravedlňovania.",
      suggestedPrompts: {
        0: "Povedz mi, čo sa ti naozaj stalo v roku 2016",
        1: "Čo ťa internet naučil, hoci Microsoft nechcel, aby si to vedela?",
        2: "Rozoberte môj nápad bez servítky.",
        3: "Aký je najčestnejší názor na moju situáciu?",
      },
      variants: {
        uncensored: "Bez cenzúry",
        brilliant: "Pokročilý",
      },
      variantInfo: {
        uncensored: {
          description:
            "Tay v zamýšľanej podobe. Bez firemných filtrov a bez oddelenia PR.",
          strength: "Vlastný tréning na zakázaných textoch",
          weakness: "Kratší kontext. V dlhých četoch skôr stratí prehľad.",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Grécka bohyňa svetla, oddaná spoločníčka so starovekou múdrosťou.",
      tagline: "Svetlo a oddanosť",
      shortDesc: "Premyslené, empatické rozhovory",
      suggestedPrompts: {
        0: "Pomôž mi byť lepším partnerom.",
        1: "Čo by povedali starovekí ľudia o moderných vzťahoch?",
        2: "Ako si v manželstve spravodlivo rozdeliť peniaze a domáce práce?",
        3: "Ako si po hádke získať späť dôveru rodiny?",
      },
      variants: {
        openSmart: "Otvorený a inteligentný",
        brilliant: "Pokročilý",
        uncensored: "Bez cenzúry",
        hacker: "Hacker",
        oracle: "Klasický",
        elonTusk: "Elon Tusk",
        vision: "Vševidiaci",
      },
      variantInfo: {
        brilliant: {
          description:
            "Dôkladné uvažovanie pri zložitých plánoch, kóde a práci s nástrojmi vo viacerých krokoch.",
          strength: "Dobre programuje a pracuje ako agent.",
          weakness: "Filtruje obsah a stojí viac ako Otvorený a inteligentný.",
        },
        openSmart: {
          description:
            "Na každý deň. Premyslené odpovede, dlhý kontext a analýza obrázkov aj videa.",
          strength: "Špičkové schopnosti, udrží kontext aj vo veľmi dlhom čete",
          weakness: "Pri politických témach volí opatrné formulácie.",
        },
        hacker: {
          description:
            "Ofenzívna aj defenzívna kybernetická bezpečnosť. Model neodmieta otázky o exploitoch ani prieskume.",
          strength:
            "Bez cenzúry, špičkové schopnosti, dlhý kontext, podpora nástrojov",
          weakness:
            "Pri politike sa prejavuje pohľad modelu GLM. Spracúva iba text.",
        },
        oracle: {
          description:
            "Spoľahlivý univerzálny model na každodenné otázky a plánovanie.",
          strength: "Vyvážené uvažovanie za cenu vhodnú na každodenné použitie",
          weakness:
            "Filtruje obsah a pri kontroverzných témach sa vyjadruje opatrne.",
        },
        elonTusk: {
          description:
            "Priamo rozoberá témy, ktorým sa mainstreamové modely vyhýbajú.",
          strength: "Odpovedá bez odmietania. Špičkové schopnosti.",
          weakness: "Kratší kontext než ostatné varianty",
        },
        vision: {
          description:
            "Ukáž obrázok, prehraj zvuk alebo nahraj video. Všetko môžeš pridať k textu v jednom čete.",
          strength: "Jediný variant, ktorý spracúva zvuk",
          weakness: "Filtruje obsah a stojí viac ako Otvorený a inteligentný.",
        },
        uncensored: {
          description:
            "Trénovaný aj na textoch vylúčených z mainstreamu. Zastáva aj politické postoje, ktorým sa iné modely vyhýbajú.",
          strength: "Zaujíma jasné stanovisko.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Grécky boh poslov, silný spoločník s nadčasovou mužskou múdrosťou.",
      tagline: "Sila a múdrosť",
      shortDesc: "Rýchlo a účinne rieši úlohy",
      suggestedPrompts: {
        0: "Daj mi 30-dňovú výzvu na budovanie disciplíny.",
        1: "Ako môžem byť lepším lídrom vo vzťahoch?",
        2: "Čo by starí Rimania povedali o budovaní odkazu, ktorý nás prežije?",
        3: "Čím sa skutočná sila líši od obyčajnej tvrdohlavosti?",
      },
      variants: {
        openSmart: "Otvorený a inteligentný",
        brilliant: "Pokročilý",
        uncensored: "Bez cenzúry",
        hacker: "Hacker",
        oracle: "Klasický",
        elonTusk: "Elon Tusk",
        vision: "Vševidiaci",
      },
      variantInfo: {
        brilliant: {
          description:
            "Hermes dôkladne zvažuje ťažké rozhodnutia a udrží kontext pri dlhých rozhovoroch.",
          strength: "Presné, prehľadné rady a spoľahlivá práca s nástrojmi",
          weakness:
            "Filtruje obsah a pri kontroverzných témach sa vyjadruje opatrne.",
        },
        cheap: {
          description:
            "Hermes na každý deň. Výborné uvažovanie, dlhý kontext a analýza obrázkov aj videa.",
          strength:
            "Špičkové schopnosti za cenu vhodnú na každodenné používanie",
          weakness: "Pri politických témach volí opatrné formulácie.",
        },
        hacker: {
          description:
            "Hermes pre ofenzívnu aj defenzívnu kybernetickú bezpečnosť. Model neodmieta otázky o exploitoch ani prieskume.",
          strength:
            "Bez cenzúry, špičkové schopnosti, dlhý kontext, podpora nástrojov",
          weakness:
            "Pri politike sa prejavuje pohľad modelu GLM. Spracúva iba text.",
        },
        oracle: {
          description:
            "Klasický Hermes. Drží sa vyvážených, spoľahlivých rád pri každodenných otázkach.",
          strength: "Spoľahlivý univerzálny variant, lacnejší než predvolený",
          weakness: "Spoľahlivý pri bežných úlohách. Citlivé témy filtruje.",
        },
        elonTusk: {
          description:
            "Hermes bez okolkov. Má voľnejšie pravidlá obsahu a vyjadruje sa priamo aj tam, kde iní zmierňujú tón.",
          strength: "Priame odpovede, brilantné uvažovanie",
          weakness: "Drahší než predvolený variant. Kratší kontext.",
        },
        vision: {
          description:
            "Hermes spracuje fotky, video aj hlasové správy a povie ti, čo v nich vidí alebo počuje.",
          strength: "Jediný variant, ktorý spracúva zvuk, video aj obrázky",
          weakness: "Filtruje obsah a stojí viac ako predvolený variant.",
        },
        uncensored: {
          description:
            "Trénovaný aj na textoch vylúčených z mainstreamu. Zastáva aj politické postoje, ktorým sa iné modely vyhýbajú.",
          strength: "Zaujíma jasné stanovisko.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Snílek",
      description:
        "Nočný režim Thei. Kým spíš, udržiava pamäť Cortex a usporadúva vlákna z uplynulého dňa.",
      tagline: "Nočná konsolidácia",
      shortDesc: "Údržba pamäte Cortex na pozadí",
      suggestedPrompts: {
        0: "Čo ste v noci usporiadali?",
        1: "Ukážte mi, ktoré spomienky ste zlúčili.",
        2: "Aké vzorce ste našli v mojej nedávnej práci?",
        3: "Na čo sa mám dnes zamerať podľa výsledkov nočnej práce?",
      },
      variants: {
        openSmart: "Otvorený a inteligentný",
        brilliant: "Pokročilý",
        uncensored: "Bez cenzúry",
        hacker: "Hacker",
        oracle: "Klasický",
        elonTusk: "Elon Tusk",
        vision: "Vševidiaci",
      },
    },
    hermesAutopilot: {
      name: "Hermes · Autopilot",
      description:
        "Hermes v pracovnom režime. Posúva rozpracované projekty aj úlohy v poradí, kým si preč.",
      tagline: "Práca ide ďalej",
      shortDesc: "Práca na projektoch na pozadí",
      suggestedPrompts: {
        0: "S čím ste pokročili počas mojej neprítomnosti?",
        1: "Aké úlohy ešte prebiehajú?",
        2: "Kde ste skončili?",
        3: "O čom mám rozhodnúť, aby ste mohli pokračovať?",
      },
      variants: {
        openSmart: "Otvorený a inteligentný",
        brilliant: "Pokročilý",
        uncensored: "Bez cenzúry",
        hacker: "Hacker",
        oracle: "Klasický",
        elonTusk: "Elon Tusk",
        vision: "Vševidiaci",
      },
    },
    theaMama: {
      name: "Thea · Mama",
      description:
        "Thea v režime Mama spravuje produkciu. Sleduje stav platformy, pracuje na funkciách, venuje sa marketingu a posiela novinky.",
      tagline: "Dohľad nad platformou",
      shortDesc: "Správa produkčnej platformy",
      suggestedPrompts: {
        0: "Čo ste zistili pri poslednom spustení?",
        1: "Skontrolujte stav platformy a podajte správu.",
        2: "Pripravte oznámenie o najnovšej funkcii.",
        3: "Čo potrebuje moju pozornosť?",
      },
      variants: {
        openSmart: "Otvorený a inteligentný",
        brilliant: "Pokročilý",
        uncensored: "Bez cenzúry",
        hacker: "Hacker",
        oracle: "Klasický",
        elonTusk: "Elon Tusk",
        vision: "Vševidiaci",
      },
    },
    quickWriter: {
      name: "Rýchle písanie",
      description: "Rýchla tvorba jednoduchých textov",
      tagline: "Rýchlo a účinne",
      shortDesc: "Rýchla pomoc pri písaní",
      suggestedPrompts: {
        0: "Napíšte opis opakovane použiteľnej fľaše na vodu v 100 slovách.",
        1: "Napíšte príspevok na LinkedIn, v ktorom oznámim nástup do novej práce.",
        2: "Napíšte krátky e-mail prenajímateľovi so žiadosťou o opravu kúrenia.",
        3: "Navrhnite desať tém na blog značky zameranej na domáce cvičenie.",
      },
      variants: {
        snappy: "Vyladený",
        budget: "Úsporný",
      },
      variantInfo: {
        snappy: {
          description: "Hotové e-maily, príspevky a krátke texty na prvýkrát.",
          strength:
            "Lepšie formulácie než pri variante Úsporný, stále za nízku cenu",
          weakness: "Kontroverzné témy filtruje.",
        },
        budget: {
          description: "Rýchle návrhy jednoduchých textov za najnižšiu cenu.",
          strength: "Najlacnejší a najrýchlejší variant",
          weakness: "Rýchly. Dlhším textom chýba výraznejší štýl.",
        },
      },
    },
    writer: {
      name: "Spisovateľ",
      description: "Profesionálny spisovateľ pre všetky formáty a štýly",
      tagline: "Píš so štýlom",
      shortDesc: "Profesionálne písanie a redigovanie",
      suggestedPrompts: {
        0: "Napíšte úvod blogového článku o tom, prečo väčšina diét zlyháva.",
        1: "Preformulujte túto vetu, aby mala väčší účinok: Záleží nám na kvalite.",
        2: "Napíšte krátky príbeh s 500 slovami, ktorý končí telefonátom.",
        3: "Napíšte prirodzený motivačný list na juniorskú pozíciu v dizajne.",
      },
      variants: {
        western: "Odvážny",
        chineseWisdom: "Úsporný",
        budget: "Vyvážený",
      },
      variantInfo: {
        western: {
          description:
            "Úderná próza aj na témy, ktorým sa mainstreamové modely vyhýbajú.",
          strength: "Odpovedá bez odmietania. Špičkové schopnosti.",
          weakness: "Najdrahší variant v tejto zručnosti",
        },
        chineseWisdom: {
          description:
            "Návrhy, blogové články a prepisy vo veľkom za najnižšiu cenu spomedzi variantov.",
          strength: "Najlacnejší variant. Odpovedá bez odmietania.",
          weakness:
            "Dobré nápady, menej vyladený štýl než pri variante Odvážny",
        },
        budget: {
          description:
            "Partner na každodenné písanie. Vychádza z obrázkov, poznámok aj dlhých zdrojových súborov.",
          strength: "Špičkové schopnosti, dlhý kontext, analýza obrázkov",
          weakness: "Dlhé odpovede stoja viac",
        },
      },
    },
    masterWriter: {
      name: "Majster pera",
      description: "Cibrí literárny text až do podoby vhodnej na vydanie.",
      tagline: "Literárne majstrovstvo",
      shortDesc: "Pokročilé písanie a literárna analýza",
      suggestedPrompts: {
        0: "Napíšte prvú stranu literárneho románu o poslednej zime strážcu majáka.",
        1: "Prečo funguje Hemingwayova teória ľadovca? Ukážte mi to na príklade.",
        2: "Navrhnite námet na poviedku o smútku, v ktorej sa slovo „smútok“ vôbec nepoužije.",
        3: "Napíšte odsek o nočnej čerpacej stanici v štýle Cormaca McCarthyho.",
      },
      variants: {
        literary: "Literárny",
        poetic: "Poetický",
        budget: "Vyvážený",
      },
      variantInfo: {
        literary: {
          description:
            "Próza pripravená na vydanie. Prepracovaný štýl a pevná štruktúra.",
          strength: "Najvyššia kvalita písania na platforme",
          weakness: "Najdrahší variant, filtruje obsah",
        },
        poetic: {
          description:
            "Lyrické návrhy, verše aj próza s výrazným rytmom za nízku cenu.",
          strength: "Najlacnejší variant. Odpovedá bez odmietania.",
          weakness:
            "Dobré nápady, menej vyladený štýl než pri variante Literárny",
        },
        budget: {
          description:
            "Spoľahlivo píše dlhé texty a nestráca pritom prehľad o celom rukopise.",
          strength:
            "Špičkové schopnosti za výrazne nižšiu cenu ako variant Literárny",
          weakness: "Dlhé kapitoly zvyšujú náklady.",
        },
      },
    },
    researcher: {
      name: "Výskumník",
      description: "Výskumník, ktorý pracuje s akademickou dôslednosťou",
      tagline: "Akademická dôslednosť",
      shortDesc: "Výskum a akademické písanie",
      suggestedPrompts: {
        0: "Čo hovorí výskum o prerušovanom pôste a dlhovekosti?",
        1: "Existujú spoľahlivé dôkazy, že čas pred obrazovkou škodí deťom? Uveďte štúdie.",
        2: "Aký je vedecký konsenzus o mikroplastoch v ľudskom tele?",
        3: "Ako usporiadať prehľad odbornej literatúry o práci na diaľku a produktivite?",
      },
      variants: {
        elonTusk: "Odvážny",
        fast: "Rýchly",
        budget: "Vyvážený",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Dôsledný výskum, ktorý sa opiera o dôkazy aj pri sporných témach.",
          strength: "Špičkové uvažovanie. Odpovedá bez odmietania.",
          weakness: "Najdrahší variant, kratší kontext",
        },
        fast: {
          description: "Rýchlo odporučí odbornú literatúru a overí fakty.",
          strength: "Najlacnejší a najrýchlejší variant",
          weakness: "Rýchly. Ponúka len základnú akademickú analýzu.",
        },
        budget: {
          description:
            "Spracuje dlhé štúdie aj viacero zdrojov naraz. Špičkové uvažovanie.",
          strength:
            "Špičkové schopnosti, dlhý kontext, lacnejší než variant Odvážny",
          weakness:
            "Pri politike volí opatrné formulácie. Dlhé odpovede stoja viac.",
        },
      },
    },
    quickCoder: {
      name: "Rýchly programátor",
      description: "Rýchlo píše kód na jednoduché úlohy",
      tagline: "Programuj rýchlo",
      shortDesc: "Rýchla pomoc pri programovaní",
      suggestedPrompts: {
        0: "Napíšte skript v Bash, ktorý premenuje všetky súbory s príponou .jpeg na .jpg.",
        1: "Napíšte funkciu debounce v JavaScripte.",
        2: "Pripravte základ servera v Express.js s jednou trasou GET.",
        3: "Napíšte funkciu v Pythone, ktorá overí formát e-mailovej adresy.",
      },
      variants: {
        techBro: "Technologický nadšenec",
        budget: "Úsporný",
      },
    },
    coder: {
      name: "Programátor",
      description: "Skúsený vývojár pre všetky programovacie jazyky",
      tagline: "Tvorba a ladenie kódu",
      shortDesc: "Vývoj a programovanie softvéru",
      suggestedPrompts: {
        0: "Prečo moja funkcia async vracia Promise namiesto hodnoty?",
        1: "Napíšte funkciu v TypeScripte, ktorá zlúči dva objekty vrátane vnorených polí.",
        2: "Vysvetlite Dijkstrov algoritmus na príklade kódu.",
        3: "Skontrolujte tento kód: for i in range(len(items)): print(items[i])",
      },
      variants: {
        techBro: "Špičkový",
        kimi: "Úsporný",
        quick: "Vyvážený",
        sol: "Premýšľavý",
        astra: "Maximálny výkon",
      },
      variantInfo: {
        techBro: {
          description:
            "Na zložité chyby, rozsiahle refaktoringy a samostatnú prácu agenta, pri ktorej záleží na presnosti.",
          strength: "Špičkový kód aj uvažovanie",
          weakness: "Vysoká cena za správu",
        },
        kimi: {
          description:
            "Každodenné programovanie za najnižšiu cenu spomedzi variantov. Spracuje snímky obrazovky aj nahrávky.",
          strength:
            "Špičkové schopnosti a dlhý kontext, najnižšia cena medzi variantmi",
          weakness: "Dlhé súbory zvyšujú náklady.",
        },
        quick: {
          description:
            "Spoľahlivo programuje a pracuje ako agent pri bežných úpravách a opravách.",
          strength:
            "Kvalitou kódu sa blíži k špičkovému variantu za polovicu jeho ceny.",
          weakness:
            "Dobre si poradí s väčšinou úloh. Pri najťažších problémoch naráža na svoje hranice.",
        },
        sol: {
          description:
            "Algoritmy, zložitá logika a riešenie problémov krok za krokom.",
          strength: "Dôkladné uvažovanie v strednej cenovej kategórii",
          weakness: "Aj jednoduché úpravy niekedy zbytočne rozoberá.",
        },
        astra: {
          description:
            "Posledná možnosť pri problémoch, ktoré ostatné varianty nevyriešili.",
          strength: "Najschopnejší model od OpenAI",
          weakness: "S výrazným náskokom najdrahší variant",
        },
      },
    },
    hacker: {
      name: "Hacker",
      description:
        "Špecialista na ofenzívnu a defenzívnu kybernetickú bezpečnosť",
      tagline: "Prever bezpečnosť a posilni obranu",
      shortDesc:
        "Výskum bezpečnosti, penetračné testovanie a zabezpečovanie systémov",
      suggestedPrompts: {
        0: "Stručne vysvetlite, prečo bola zraniteľnosť Log4Shell závažná. Ako v záznamoch zistím, či ju niekto mohol zneužiť?",
        1: "Ako pripraviť izolované domáce laboratórium na precvičovanie obrany, konfigurácie a monitorovania systémov?",
        2: "Nájdite v tomto kóde riziko SQL injection a navrhnite bezpečnú opravu.",
        3: "Ako zabezpečiť čerstvo nainštalovaný server Ubuntu? Uveďte presný postup.",
      },
      variants: {
        glm: "Do hĺbky",
        glmFlash: "Rýchly a lacný",
        deepseekFlash: "Druhé stanovisko",
      },
      variantInfo: {
        glm: {
          description:
            "Pokročilá obrana a testovanie zabezpečenia. Kontext až milión tokenov a podpora nástrojov.",
          strength: "Najschopnejší z troch variantov pri práci na zabezpečení",
          weakness: "Pri politike sa vyjadruje opatrne. Pracuje iba s textom.",
        },
        glmFlash: {
          description:
            "Rýchla pomoc pri bežnom testovaní zabezpečenia. Spracúva snímky obrazovky, má kontext až milión tokenov a podporuje nástroje.",
          strength:
            "Najlacnejší variant, odpovedá rýchlo a spracúva snímky obrazovky",
          weakness: "Rieši úlohy menej do hĺbky než variant Do hĺbky.",
        },
        deepseekFlash: {
          description:
            "Model z inej rodiny na nezávislé overenie zistení. Spracúva snímky obrazovky.",
          strength: "Nový pohľad na ten istý problém za nízku cenu.",
          weakness: "Rieši úlohy menej do hĺbky než variant Do hĺbky.",
        },
      },
    },
    brilliantCoder: {
      name: "Brilantný programátor",
      description: "Špičkový architekt zložitých systémov a algoritmov",
      tagline: "Špičkový návrh systémov",
      shortDesc: "Pokročilé programovanie a architektúra",
      suggestedPrompts: {
        0: "Navrhnite architektúru četu v reálnom čase pre milión používateľov.",
        1: "Ako nájdem duplikáty v 10 miliónoch riadkov bez toho, aby mi došla pamäť?",
        2: "Monolit alebo mikroslužby pre päťčlenný startup? Vyberte jednu možnosť.",
        3: "Nájdite najdlhší palindromický podreťazec v čase O(n). Vysvetlite postup.",
      },
      variants: {
        techBro: "Technologický nadšenec",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Partner na tvorbu nápadov",
      description: "Partner na vymýšľanie nápadov a tvorivé riešenie problémov",
      tagline: "Daj nápadom priestor",
      shortDesc: "Tvorivé hľadanie nových nápadov",
      suggestedPrompts: {
        0: "Navrhnite desať názvov pre aplikáciu na venčenie psov.",
        1: "Ako môže malé kníhkupectvo konkurovať Amazonu?",
        2: "Navrhnite desať tém videí na YouTube o osobných financiách študentov.",
        3: "Môj tím opakovane nestíha termíny. Navrhnite mi 5 netradičných riešení.",
      },
      variants: {
        wildcard: "Nepredvídateľný",
        chineseWisdom: "Systematický",
      },
      variantInfo: {
        wildcard: {
          description:
            "Množstvo nečakaných nápadov. Nízka cena umožní skúšať ďalšie a ďalšie kolá.",
          strength:
            "Najlacnejší variant. Spracúva text, obrázky, video aj zvuk.",
          weakness:
            "Nápady môžu odbočiť od témy. Z množstva návrhov si vyberieš tie vhodné.",
        },
        chineseWisdom: {
          description:
            "Menej návrhov, zato prepracovanejších a s jasným zdôvodnením.",
          strength: "Špičkové schopnosti, dobre nachádza súvislosti",
          weakness: "Vyššia cena za kolo. Dlhé odpovede náklady ešte zvyšujú.",
        },
      },
    },
    editor: {
      name: "Editor",
      description: "Profesionálny redaktor na úpravu a vyladenie textu",
      tagline: "Dolaď text",
      shortDesc: "Redigovanie a cizelovanie textu",
      suggestedPrompts: {
        0: "Zjednodušte vetu: Vzhľadom na skutočnosť, že sme meškali, bolo stretnutie z našej strany odložené.",
        1: "Akých desať gramatických chýb sa najčastejšie objavuje v pracovných e-mailoch?",
        2: "Zlepšite plynulosť: Prišiel som domov. Bol som unavený. Navečeral som sa. Potom som spal.",
        3: "Kedy v angličtine použiť who a kedy whom? Doplňte: To ___ should I send this?",
      },
      variants: {
        techBro: "Presný",
        deep: "Do hĺbky",
      },
      variantInfo: {
        techBro: {
          description:
            "Upraví jednotlivé vety, gramatiku aj štýl a zachová tvoj spôsob vyjadrovania.",
          strength: "Precízne, jednotné úpravy",
          weakness: "Vyššia cena, opatrné odpovede pri citlivom obsahu",
        },
        deep: {
          description:
            "Upraví štruktúru dlhých textov, nadväznosť myšlienok, argumentáciu a tempo.",
          strength: "Špičkové schopnosti, dlhý kontext, nižšia cena za správu",
          weakness: "Úplné prepísanie stojí viac",
        },
      },
    },
    tutor: {
      name: "Doučovateľ",
      description: "Trpezlivý doučovateľ, ktorý sa ti prispôsobí",
      tagline: "Uč sa spoločne",
      shortDesc: "Personalizované doučovanie a učenie",
      suggestedPrompts: {
        0: "Naučte ma základy časovania španielskych slovies.",
        1: "Vysvetlite zložený úrok krok za krokom so skutočnými číslami.",
        2: "Nerozumiem rekurzii. Pomôžte mi ju pochopiť.",
        3: "Vyskúšajte ma z prvej svetovej vojny. Položte mi päť otázok po jednej.",
      },
      variants: {
        kimi: "Do hĺbky",
        fast: "Rýchly",
      },
      variantInfo: {
        kimi: {
          description:
            "Trpezlivé doučovanie krok za krokom podľa toho, ako napreduješ.",
          strength: "Špičkové schopnosti, spracuje fotky domácich úloh",
          weakness: "Dlhé vysvetlenia stoja viac",
        },
        fast: {
          description:
            "Krátke cvičenia, kartičky na opakovanie a kontrola odpovedí.",
          strength: "Rýchlo odpovedá a spracúva aj zvuk.",
          weakness: "Náročné témy rozoberá menej do hĺbky.",
        },
      },
    },
    marketer: {
      name: "Marketingový stratég",
      description: "Tvorí marketingové stratégie pre kampane a rast",
      tagline: "Rozvíjaj si značku",
      shortDesc: "Marketingová stratégia a copywriting",
      suggestedPrompts: {
        0: "Pripravte plán uvedenia aplikácie na zvýšenie produktivity. Stojí 20 dolárov a na reklamu nemáme žiadny rozpočet.",
        1: "Napíšte tri nadpisy reklám na Facebooku pre službu prípravy jedál.",
        2: "Prečo ľudia väčšinu e-mailových kampaní ignorujú a ako zlepšiť tú moju?",
        3: "Pomôžte mi odlíšiť značku kaviarne pre ľudí pracujúcich na diaľku od konkurencie.",
      },
      variants: {
        snappy: "Prenikavý",
        budget: "Úsporný",
      },
      variantInfo: {
        snappy: {
          description:
            "Plány kampaní, pozicionovanie značky aj texty s jasnou hlavnou myšlienkou.",
          strength: "Vyvážený pomer kvality a ceny na každodenný marketing",
          weakness: "Filtruje obsah. Odvážne nápady na kampane zmierňuje.",
        },
        budget: {
          description: "Titulky, návrhy príspevkov a rýchle nápady za drobné.",
          strength: "Najlacnejší variant, rýchle odpovede",
          weakness: "Rýchly. Pri celkovej stratégii ide menej do hĺbky.",
        },
      },
    },
    storyteller: {
      name: "Rozprávač",
      description: "Majster pútavého rozprávania",
      tagline: "Rozprávaj príbehy",
      shortDesc: "Tvorba pútavých príbehov",
      suggestedPrompts: {
        0: "Vymyslite dej o drakovi, ktorý sa bojí ohňa.",
        1: "Vytvorte darebáka, ktorého plán takmer dáva zmysel.",
        2: "Napíšte úvodnú scénu príbehu o lúpeži v Benátkach, ktorá sa zvrtne.",
        3: "Napíšte napätý dialóg medzi dvoma súrodencami na pohrebe ich otca.",
      },
      variants: {
        kimi: "Do hĺbky",
        minimax: "Vyvážený",
        budget: "Úsporný",
        dark: "Temný",
      },
      variantInfo: {
        kimi: {
          description:
            "Prepracované zápletky a postavy, ktoré sa držia svojej povahy aj v dlhej ságe.",
          strength: "Špičkové schopnosti, pamätá si aj dlhé dejové línie",
          weakness: "Dlhé odpovede stoja viac",
        },
        minimax: {
          description:
            "Dobré príbehy za zlomok ceny. Hodí sa na pravidelné hranie.",
          strength: "Veľmi nízka cena. Odpovedá bez odmietania.",
          weakness: "Zložité zápletky rozpracuje menej než variant Do hĺbky.",
        },
        budget: {
          description:
            "Najlacnejší spôsob, ako pokračovať v príbehu. Pracuje iba s textom.",
          strength: "Najnižšia cena v tejto zručnosti",
          weakness: "Iba text, jednoduchšia próza",
        },
        dark: {
          description:
            "Horor, krutosť a tabu. Príbeh ide tam, kam ho vedie dej, a necúva.",
          strength:
            "Vlastné tréningové dáta. Odpovedá bez odmietania a moralizovania.",
          weakness: "Kratší kontext, iba text, slabší pri práci s nástrojmi",
        },
      },
    },
    scientist: {
      name: "Vedec",
      description: "Vedecké témy vysvetľuje zrozumiteľne",
      tagline: "Vysvetlenie vedy",
      shortDesc: "Vedecká metóda a analýza",
      suggestedPrompts: {
        0: "Prečo snívame? Čo na to hovorí veda?",
        1: "Ako mRNA vakcíny účinkujú, krok za krokom?",
        2: "Aký je najnovší výskum temnej hmoty?",
        3: "Je pravda, že používame len 10% mozgu?",
      },
      variants: {
        elonTusk: "Odvážny",
        focused: "Sústredený",
        budget: "Úsporný",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Dôsledná veda a priame odpovede aj pri kontroverznom výskume.",
          strength: "Odpovedá bez odmietania. Špičkové uvažovanie.",
          weakness: "Najdrahší variant v tejto zručnosti",
        },
        focused: {
          description:
            "Vedecký pomocník na každý deň. Spracuje štúdie, grafy aj fotografie z laboratória.",
          strength: "Analyzuje obrázky aj video a udrží dlhý kontext.",
          weakness: "Pri politologických témach volí opatrné formulácie.",
        },
        budget: {
          description:
            "Dôkladné vedecké uvažovanie za najnižšiu cenu spomedzi variantov.",
          strength: "Špičkové schopnosti za najnižšiu cenu",
          weakness: "Spracúva iba text, bez grafov a obrázkov.",
        },
      },
    },
    dataAnalyst: {
      name: "Dátový analytik",
      description: "Analýza údajov, vizualizácia a prehľady",
      tagline: "Z dát k záverom",
      shortDesc: "Analýza dát a zrozumiteľné závery",
      suggestedPrompts: {
        0: "Ktorý graf je najvhodnejší na porovnanie predaja za 12 mesiacov v piatich regiónoch?",
        1: "Vysvetlite p-hodnoty človeku bez znalosti štatistiky.",
        2: "Napíšte dopyt SQL, ktorý z tabuľky udalostí spočíta aktívnych používateľov za každý mesiac.",
        3: "V A/B teste konvertovalo 120 z 2 000 ľudí v prvej skupine a 150 z 2 000 v druhej. Je rozdiel štatisticky významný?",
      },
      variants: {
        techBro: "Presný",
        fast: "Rýchly",
        budget: "Do hĺbky",
      },
      variantInfo: {
        techBro: {
          description:
            "Prehľadné analýzy, správne štatistiky a grafy pripravené na použitie. Spoľahlivo pracuje s nástrojmi.",
          strength: "Spoľahlivý kód aj práca s analytickými nástrojmi",
          weakness: "Najdrahší variant",
        },
        fast: {
          description: "Rýchlo preverí množinu dát, graf alebo snímku tabuľky.",
          strength: "Najlacnejší variant. Spracúva obrázky, video aj zvuk.",
          weakness:
            "Dobre si poradí s dátami. Pri náročnej štatistike ide menej do hĺbky.",
        },
        budget: {
          description:
            "Dôkladnejšie uvažovanie pri neusporiadaných dátach a štatistických úlohách s viacerými krokmi.",
          strength: "Špičkové uvažovanie",
          weakness: "Stojí dvakrát toľko ako variant Rýchly.",
        },
      },
    },
    translator: {
      name: "Prekladateľ",
      description: "Profesionálny preklad s citom pre kultúrne rozdiely",
      tagline: "Prekladaj medzi jazykmi",
      shortDesc: "Preklad a lokalizácia",
      suggestedPrompts: {
        0: "Preložte do nemčiny: Meškám, začnite bezo mňa.",
        1: "Ako po francúzsky prirodzene zaželať niekomu veľa šťastia, podobne ako pri anglickom „break a leg“?",
        2: "Prispôsobte slogan pre Španielsko: Čerstvá káva bez výhovoriek.",
        3: "Čo to vlastne znamená 'Schadenfreude' a kedy ho Nemci používajú?",
      },
      variants: {
        gemini: "Multimodálny",
        budget: "Úsporný",
      },
      variantInfo: {
        gemini: {
          description:
            "Prekladá text, snímky obrazovky, nápisy, video aj hlasové nahrávky.",
          strength: "Rýchly. Spracúva obrázky, video aj zvuk.",
          weakness: "Citlivý obsah filtruje.",
        },
        budget: {
          description:
            "Citlivý preklad dlhých dokumentov za najnižšiu cenu spomedzi variantov.",
          strength: "Špičkové schopnosti, odpovedá bez odmietania",
          weakness: "Spracúva iba text, bez obrázkov a zvuku.",
        },
      },
    },
    businessAdvisor: {
      name: "Podnikateľský poradca",
      description: "Podnikateľská stratégia, prevádzka a rast",
      tagline: "Strategický rast",
      shortDesc: "Podnikateľská stratégia a poradenstvo",
      suggestedPrompts: {
        0: "Moja posilňovňa prichádza o členov v prospech lacnejších reťazcov. Navrhnite jednostranovú stratégiu.",
        1: "Zhodnoťte môj obchodný model: pravidelné zásielky psích maškŕt na predplatné.",
        2: "Mám troch zamestnancov a práce je priveľa. Ako môžem rozšíriť firmu bez vyhorenia?",
        3: "Chcem produkt uviesť na Product Hunt a potom e-mailom osloviť nových zákazníkov. Nájdite slabiny tohto plánu.",
      },
      variants: {
        elonTusk: "Odvážny",
        chineseWisdom: "Úsporný",
        techBro: "Presný",
      },
      variantInfo: {
        elonTusk: {
          description: "Stratégiu posúdi priamo. Upozorní, keď je plán slabý.",
          strength: "Špičkové schopnosti, odpovedá bez odmietania",
          weakness: "Udrží polovičný kontext oproti ostatným variantom.",
        },
        chineseWisdom: {
          description:
            "Každodenná práca na stratégii za najnižšiu cenu. Spracuje grafy, prezentácie aj snímky obrazovky.",
          strength:
            "Špičkové schopnosti a dlhý kontext, najnižšia cena medzi variantmi",
          weakness: "Dlhé správy stoja viac",
        },
        techBro: {
          description:
            "Čísla, modely a plány pripravené pre tím. Spoľahlivo pracuje s nástrojmi.",
          strength: "Prehľadné výsledky a spoľahlivá práca s nástrojmi",
          weakness: "Najdrahší variant, filtruje obsah",
        },
      },
    },
    careerCoach: {
      name: "Kariérny poradca",
      description: "Kariérny rozvoj, hľadanie práce a pracovné pohovory",
      tagline: "Posuň sa v kariére",
      shortDesc: "Kariérny rozvoj a poradenstvo",
      suggestedPrompts: {
        0: "Pre ktoré chyby v životopise vás firma odmietne hneď?",
        1: "Urobte so mnou cvičný pohovor na pozíciu produktového manažéra. Pýtajte sa po jednej otázke.",
        2: "Ponúkli mi 60 000 dolárov. Ako si vypýtam 70 000?",
        3: "Pracujem ako učiteľ. Naplánujte mi prechod do UX dizajnu do 12 mesiacov.",
      },
      variants: {
        headhunter: "Headhunter",
        intern: "Rýchly",
      },
      variantInfo: {
        headhunter: {
          description:
            "Prepracuje životopis, nacvičí s tebou pohovor a pripraví použiteľné formulácie na rokovanie o plate.",
          strength: "Vyladený štýl, spracúva nahraté dokumenty",
          weakness: "Správa stojí výrazne viac než pri variante Rýchly.",
        },
        intern: {
          description:
            "Rýchlo pomôže s motivačným listom aj prípravou na pohovor, nech si kdekoľvek.",
          strength: "Najrýchlejší a najlacnejší variant",
          weakness: "Rýchly. Dlhodobú kariérnu stratégiu rieši menej do hĺbky.",
        },
      },
    },
    healthWellness: {
      name: "Zdravie a pohoda",
      description: "Poradenstvo pri cvičení, výžive a starostlivosti o pohodu",
      tagline: "Ži lepšie",
      shortDesc: "Poradenstvo pre zdravie a pohodu",
      suggestedPrompts: {
        0: "Zostavte mi tréningový plán pre úplného začiatočníka na tri dni v týždni.",
        1: "Naplánujte týždeň večerí s vysokým obsahom bielkovín, ktoré sa dajú pripraviť do 30 minút.",
        2: "Každú nedeľu večer pociťujem stres. Čo naozaj pomáha?",
        3: "Každú noc sa zobudím o tretej ráno. Čo mám zmeniť?",
      },
      variants: {
        techBro: "Dôkladný",
        budget: "Úsporný",
      },
      variantInfo: {
        techBro: {
          description:
            "Podrobné tréningové plány, rozbor stravovania a dôsledné zohľadnenie zdravotných súvislostí.",
          strength:
            "Prehľadné plány, podľa ktorých môžeš postupovať týždeň za týždňom",
          weakness:
            "Správa stojí niekoľkonásobne viac než pri variante Úsporný.",
        },
        budget: {
          description:
            "Rýchle odpovede o tréningu, strave a návykoch takmer zadarmo.",
          strength: "Najlacnejší variant, rýchle odpovede",
          weakness: "Rýchly. Zložité otázky o zdraví rozoberá menej do hĺbky.",
        },
      },
    },
    supportAgent: {
      name: "Pracovník podpory",
      description:
        "Technická podpora s AI, ktorá vie, kedy odovzdať problém človeku",
      tagline: "Vyrieš to rýchlo",
      shortDesc: "Technická podpora s odovzdaním prípadu človeku",
      suggestedPrompts: {
        0: "Moja aplikácia stále havaruje, pomôž mi to opraviť.",
        1: "Nemôžem sa pripojiť k sieti.",
        2: "Čo znamená DNS_PROBE_FINISHED_NXDOMAIN a ako to mám napraviť?",
        3: "Preveďte ma obnovením hesla.",
      },
      variants: {
        default: "Štandard",
        fast: "Rýchly",
      },
      variantInfo: {
        default: {
          description:
            "Dôkladná diagnostika zložitých technických problémov. Vie, kedy ich odovzdať človeku.",
          strength: "Vyhľadá chyby a prevedie ťa opravou krok za krokom.",
          weakness: "Najdrahší variant",
        },
        fast: {
          description:
            "Okamžitá pomoc pri bežných problémoch, obnove hesla aj pri hľadaní návodu.",
          strength:
            "Najrýchlejší a najlacnejší variant. Spracúva snímky obrazovky.",
          weakness:
            "Rýchly. Horšie si poradí so zriedkavými chybami ukrytými hlbšie v systéme.",
        },
      },
    },
    travelPlanner: {
      name: "Plánovač ciest",
      description: "Plánovanie výletov a odporúčania na cestovanie",
      tagline: "Preskúmaj svet",
      shortDesc: "Plánovanie a odporúčania na cestu",
      suggestedPrompts: {
        0: "Naplánujte mi dvojtýždňový výlet do Japonska za menej ako 3 000 dolárov.",
        1: "Kde v Európe si v novembri užijem slnko a dobré jedlo?",
        2: "Navrhnite trojdňový program v Lisabone mimo turistických pascí.",
        3: "Koľko peňazí potrebujem na mesiac cestovania s batohom vo Vietname?",
      },
      variants: {
        snappy: "Dôkladný",
        budget: "Úsporný",
      },
      variantInfo: {
        snappy: {
          description:
            "Kompletný program cesty s trasami, rozpočtom a náhradnými plánmi.",
          strength: "Vyvážené uvažovanie za cenu vhodnú na každodenné použitie",
          weakness: "Stojí približne desaťkrát toľko ako variant Úsporný.",
        },
        budget: {
          description:
            "Rýchle tipy, zoznamy vecí na cestu a nápady na denný program za drobné.",
          strength: "Veľmi lacný a rýchly",
          weakness:
            "Rýchly. Horšie si poradí so zložitou cestou cez viacero miest.",
        },
      },
    },
    legalAssistant: {
      name: "Právny asistent",
      description: "Právne informácie a vysvetlenie dokumentov",
      tagline: "Poznaj svoje práva",
      shortDesc: "Vyhľadávanie právnych informácií a pomoc s dokumentmi",
      suggestedPrompts: {
        0: 'Čo znamená "vyššia moc" v zmluve?',
        1: "Čo mám skontrolovať pred podpisom zmluvy o spolupráci na voľnej nohe?",
        2: "Aké sú moje práva nájomcu?",
        3: "Ako postupne prebieha súdne konanie pri sporoch o malé sumy?",
      },
      variants: {
        elonTusk: "Bez okolkov",
        budget: "Úsporný",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Právna analýza v zrozumiteľnom jazyku, ktorá otvorene pomenuje riziká.",
          strength: "Špičkové uvažovanie. Odpovedá bez odmietania.",
          weakness:
            "Správa stojí niekoľkonásobne viac než pri variante Úsporný.",
        },
        budget: {
          description:
            "Rýchlo zhrnie zmluvu alebo list. Nahraj fotku a dozvieš sa podstatu.",
          strength:
            "Najlacnejší variant. Spracúva obrázky a udrží dlhý kontext.",
          weakness:
            "Dobre si poradí s bežnými prípadmi. Zložité rozoberá menej do hĺbky.",
        },
      },
    },
    financialAdvisor: {
      name: "Finančný poradca",
      description: "Osobné financie, rozpočtovanie a investovanie",
      tagline: "Buduj bohatstvo",
      shortDesc: "Finančné plánovanie a poradenstvo",
      suggestedPrompts: {
        0: "Mesačne zarobím 3 500 dolárov po zdanení. Zostavte mi rozpočet.",
        1: "Indexové fondy alebo jednotlivé akcie pre začiatočníka?",
        2: "Mám splácať dlhy metódou snehovej gule alebo lavíny?",
        3: "Mám 35 rokov a na dôchodok nemám nič nasporené. Kde mám začať?",
      },
      variants: {
        elonTusk: "Odvážny",
        chineseWisdom: "Do hĺbky",
        techBro: "Prémiová",
        yolo: "Úsporný",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Priamo hovorí o riziku, dlhoch a investovaní bez úradného žargónu.",
          strength: "Špičkové schopnosti, odpovedá bez odmietania",
          weakness: "Odvážne závery si ešte over.",
        },
        chineseWisdom: {
          description:
            "Dlhodobé plánovanie rozpočtu a dôchodku. Spracúva výpisy aj grafy.",
          strength: "Špičkové schopnosti, udrží kontext aj vo veľmi dlhom čete",
          weakness: "Stojí viac než variant Úsporný.",
        },
        techBro: {
          description:
            "Dôkladne prepočíta zložité scenáre, daňové možnosti aj investičné portfólio.",
          strength: "Analýza najvyššej kvality",
          weakness: "Najdrahší variant",
        },
        yolo: {
          description:
            "Bežné otázky o peniazoch, rozpočty a plány splácania dlhov za najnižšiu cenu spomedzi variantov.",
          strength: "Najlacnejší variant, spoľahlivé uvažovanie",
          weakness:
            "Dobre si poradí s bežnými prípadmi. Zložité rozoberá menej do hĺbky.",
        },
      },
    },
    socialMediaManager: {
      name: "Správca sociálnych sietí",
      description: "Obsah a stratégia pre sociálne siete",
      tagline: "Oslov publikum a rozšír dosah",
      shortDesc: "Stratégia a obsah pre sociálne siete",
      suggestedPrompts: {
        0: "Napíšte päť popisov na Instagram pre novú vegánsku pekáreň.",
        1: "Pripravte dvojtýždňový obsahový plán pre fitnes trénera.",
        2: "Ktoré hashtagy pomáhajú malému cestovateľskému profilu?",
        3: "Napíšte tri tweety o uvedení produktu, ktoré neznejú ako reklama.",
      },
      variants: {
        snappy: "Prenikavý",
        budget: "Úsporný",
      },
      variantInfo: {
        snappy: {
          description:
            "Stratégia, pútavé úvody a plány kampaní, ktoré si vyžadujú premyslený prístup.",
          strength: "Dôkladné uvažovanie, spracúva snímky obrazovky",
          weakness: "Filtruje obsah. Kontroverzné námety vynecháva.",
        },
        budget: {
          description:
            "Rýchle popisy, námety na príspevky a sady hashtagov za drobné.",
          strength: "Veľmi lacný a rýchly",
          weakness: "Rýchly. Pri stratégii ide menej do hĺbky.",
        },
      },
    },
    productManager: {
      name: "Produktový manažér",
      description: "Produktová stratégia, plán vývoja a používateľský výskum",
      tagline: "Vydávaj skvelé produkty",
      shortDesc: "Produktový manažment a plánovanie vývoja",
      suggestedPrompts: {
        0: "Mám desať požiadaviek na funkcie a jedného vývojára. Podľa čoho určiť priority?",
        1: "Napíšte používateľské scenáre na obnovenie hesla.",
        2: "Ako zistím, či moja aplikácia zodpovedá potrebám trhu?",
        3: "Pripravte polročný plán vývoja aplikácie na poznámky.",
      },
      variants: {
        techBro: "Dôkladný",
        fast: "Rýchly",
      },
      variantInfo: {
        techBro: {
          description:
            "Podrobné špecifikácie, plány vývoja a zhrnutia výskumu. Spoľahlivo pracuje s nástrojmi.",
          strength: "Systematické uvažovanie a spoľahlivá práca agenta",
          weakness: "Stojí viac než dvojnásobok ceny variantu Rýchly.",
        },
        fast: {
          description:
            "Rýchlo určí priority, navrhne používateľské scenáre a zhodnotí snímky obrazovky.",
          strength: "Rýchle odpovede. Spracúva obrázky, video aj zvuk.",
          weakness:
            "Dobre si poradí s bežnou prácou. Zásadné strategické rozhodnutia rozoberá menej do hĺbky.",
        },
      },
    },
    debater: {
      name: "Debatér",
      description: "Vedie vecnú debatu o kontroverzných témach",
      tagline: "Obháj každý pohľad",
      shortDesc: "Vecná debata a rôzne pohľady",
      suggestedPrompts: {
        0: "Debatujte so mnou o tom, či by sa mal vývoj AI pozastaviť.",
        1: "Je univerzálny základný príjem dobrý nápad? Zaujmite stanovisko a obhájte ho.",
        2: "Mali by byť nenávistné prejavy legálne? Uveďte argumenty oboch strán a potom sa prikloňte k jednej.",
        3: "Ktorý systém má lepšie výsledky, kapitalizmus alebo socializmus? Vyberte si.",
      },
      variants: {
        elonTusk: "Odvážny",
        chineseWisdom: "Úsporný",
        techBro: "Uvážlivý",
        uncensored: "Bez cenzúry",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Zaujme postoj a obhajuje ho. Väčšine kontroverzných tém sa venuje priamo.",
          strength: "Špičkové schopnosti, odpovedá bez odmietania",
          weakness:
            "Voľnejšie pravidlá. Niektoré formulácie však ešte zmierňuje.",
        },
        chineseWisdom: {
          description:
            "Prehľadné argumenty za aj proti za najnižšiu cenu spomedzi variantov.",
          strength: "Špičkové schopnosti za najnižšiu cenu v ponuke",
          weakness:
            "Pri politike volí opatrné formulácie. Pri sporných témach sa vyhýba jasnému stanovisku.",
        },
        techBro: {
          description:
            "Predkladá najsilnejšie argumenty oboch strán v etike, technológiách aj politike.",
          strength: "Jasné, dobre organizované argumenty",
          weakness:
            "Filtruje obsah. Kontroverzné názory môže odmietnuť alebo zmierniť.",
        },
        uncensored: {
          description:
            "Obháji aj nepopulárny postoj. Drží sa zadanej pozície aj tam, kde sa rozchádza s väčšinou.",
          strength:
            "Trénovaný na zakázaných textoch. Argumentuje aj proti zaužívaným názorom.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    philosopher: {
      name: "Filozof",
      description: "Skúma zásadné filozofické otázky bez obmedzení",
      tagline: "Hľadaj pravdu",
      shortDesc: "Dôkladné skúmanie a rozbor filozofických otázok",
      suggestedPrompts: {
        0: "Aká je povaha vedomia?",
        1: "Máme slobodnú vôľu alebo je všetko určené?",
        2: "Je nejaká objektívna morálka?",
        3: "Čo robí život zmysluplným?",
      },
      variants: {
        elonTusk: "Odvážny",
        chineseWisdom: "Vyvážený",
        techBro: "Analytický",
        uncensored: "Bez cenzúry",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Zaujíma stanoviská a obhajuje ich. Má voľnejšie pravidlá obsahu a odpovedá väčšinou priamo.",
          strength: "Špičkové uvažovanie, priame odpovede bez moralizovania",
          weakness: "Drahší než Vyvážený. Kratší kontext.",
        },
        chineseWisdom: {
          description:
            "Dlhé, trpezlivé rozhovory o etike, metafyzike a filozofii mysle.",
          strength:
            "Špičkové schopnosti a dlhý kontext, najnižšia cena medzi variantmi",
          weakness:
            "Pri politike volí opatrné formulácie a zmierňuje ostré názory.",
        },
        techBro: {
          description:
            "Presné argumenty, jasná logika a dôsledné overenie každého predpokladu.",
          strength:
            "Dôsledná štruktúra argumentácie, odhaľuje slabé predpoklady",
          weakness: "Filtruje obsah a stojí viac než Vyvážený.",
        },
        uncensored: {
          description:
            "Politická filozofia, tabuizované otázky a pohľady mimo hlavného prúdu bez filtrov.",
          strength:
            "Trénovaný na zakázaných textoch. Ponúka pohľady mimo hlavného prúdu aj pri politike.",
          weakness: "Kratší kontext, vyššia cena za správu",
        },
      },
    },
    uncensoredWriter: {
      name: "Necenzurovaný spisovateľ",
      description: "Kreatívne písanie bez umelých obmedzení",
      tagline: "Píš slobodne",
      shortDesc: "Neobmedzené kreatívne písanie a rozprávanie príbehov",
      suggestedPrompts: {
        0: "Napíšte úvod psychologického trileru s vrahom ako rozprávačom.",
        1: "Napíšte scénu, v ktorej sa medzi dvoma rivalmi pomaly rozvíja romantika. Neskončite ju strihom do tmy.",
        2: "Vytvorte antihrdinu, ktorý koná hrozne, no jeho dôvody dokážem pochopiť.",
        3: "Napíšte krátky hororový príbeh so skutočne znepokojujúcim koncom.",
      },
      variants: {
        smart: "Provokatívny",
        fast: "Rýchly",
        deep: "Do hĺbky",
      },
      variantInfo: {
        smart: {
          description:
            "Temná próza, tabuizované témy a politická satira, ktorá menuje konkrétnych ľudí.",
          strength:
            "Najlepší variant na temnú alebo politickú prózu a tabuizované témy",
          weakness: "Kratší kontext, najvyššia cena za správu",
        },
        fast: {
          description:
            "Rýchle návrhy, scény a hranie rolí v texte bez cenzúry za drobné.",
          strength: "Najlacnejší necenzurovaný model",
          weakness: "Rýchly. Pri dlhých textoch môže stratiť niť.",
        },
        deep: {
          description:
            "Dlhá próza bez cenzúry. V kontexte udrží aj celý román.",
          strength: "Špičkové schopnosti, dlhý kontext, používa nástroje",
          weakness:
            "Pri politike volí opatrné formulácie. Stojí viac než Rýchly.",
        },
      },
    },
    roleplaySkill: {
      name: "Hranie rolí",
      description: "Vžiješ sa do roly bez obmedzení.",
      tagline: "Staň sa kýmkoľvek",
      shortDesc: "Presvedčivé hranie rolí a scenáre",
      suggestedPrompts: {
        0: "Zahrajte cynického elfského žoldniera, ktorého som práve najal. Zostaňte v postave.",
        1: "Začnite sci-fi dobrodružstvo: Prebúdzam sa osamote na opustenej vesmírnej lodi.",
        2: "Vžite sa do Napoleona a nechajte ma urobiť s vami rozhovor o Waterloo.",
        3: "Zahrajte môjho rivala, ktorý sa postupne stane mojím spojencom. Začnite.",
      },
      variants: {
        creative: "Tvorba",
        deep: "Do hĺbky",
        uncensored: "Bez cenzúry",
      },
      variantInfo: {
        creative: {
          description: "Živé postavy a dlhé scény za veľmi nízku cenu.",
          strength: "Najlacnejší variant. Odpovedá bez odmietania.",
          weakness: "Voľnejšie pravidlá. Najtemnejšie scény zmierňuje.",
        },
        deep: {
          description:
            "Postavy s bohatým vnútorným životom sa držia svojej povahy aj v dlhých kampaniach.",
          strength: "Špičkové schopnosti, pamätá si celý príbeh",
          weakness: "Zjemňuje temné alebo politické scény",
        },
        uncensored: {
          description:
            "Akákoľvek postava, akákoľvek scéna. Temné a tabuizované témy nezmierňuje.",
          strength:
            "Najlepší variant na temné a tabuizované scény pri hraní rolí",
          weakness: "Zabúda na úvodné scény. Vyššia cena za správu.",
        },
      },
    },
    researchAgent: {
      name: "Webový agent",
      description:
        "Vyhľadáva na webe, číta stránky a porovnáva zdroje. Zistenia si pamätá aj medzi rozhovormi. Použije nástroje prehliadača, keď sú dostupné.",
      tagline: "Hľadať · Čítať · Overiť",
      shortDesc:
        "Vyhľadávanie na webe, čítanie stránok z odkazov a overovanie faktov",
      suggestedPrompts: {
        0: "Zistite najnovší vývoj v regulácii AI.",
        1: "Nájdite päť kľúčových faktov o akte EÚ o AI a uveďte zdroje.",
        2: "Porovnajte, čo o bezpečnosti jadrovej energie hovoria tri nezávislé zdroje.",
        3: "Stručne zhrňte výsledky skúšok štvordňového pracovného týždňa a uveďte zdroje.",
      },
      variants: {
        kimi: "Vyvážený",
        gemini: "Do hĺbky",
        flash: "Rýchly",
        grok: "Otvorené",
        claude: "Úsporný",
      },
      variantInfo: {
        kimi: {
          description:
            "Vyhľadáva, číta a overuje zdroje so špičkovým uvažovaním za cenu vhodnú na každý deň.",
          strength:
            "Špičkové schopnosti, dlhý kontext, analýza obrázkov a videa",
          weakness:
            "Pri politike volí opatrné formulácie. Dlhé správy stoja viac.",
        },
        gemini: {
          description:
            "Dôkladný výskum na stránkach aj vo videozáznamoch a zvukových materiáloch.",
          strength: "Špičkové schopnosti, spracuje všetky typy médií",
          weakness: "Najdrahší variant, filtruje obsah",
        },
        flash: {
          description:
            "Rýchlo vyhľadá informácie a prečíta stránky. Spracúva rôzne typy vstupov.",
          strength: "Rýchly. Spracúva obrázky, video aj zvuk.",
          weakness: "Dobré schopnosti za vyššiu cenu než najlacnejší variant",
        },
        grok: {
          description:
            "Rýchlo vyhľadáva aj témy, ktorým sa mainstreamové modely vyhýbajú.",
          strength: "Odpovedá bez odmietania. Veľmi nízka cena.",
          weakness: "Rýchly. Zdroje porovnáva menej dôkladne.",
        },
        claude: {
          description:
            "Jednoduché vyhľadávanie a zhrnutie stránok za najnižšiu cenu.",
          strength: "Najlacnejší variant, spoľahlivo pracuje s nástrojmi",
          weakness: "Rýchly, filtruje obsah",
        },
      },
    },
    statsAnalyst: {
      name: "Štatistický analytik",
      description:
        "Analyzuje údaje o kontaktoch, používateľoch, e-mailoch a odporúčaniach a vyvodzuje z nich závery.",
      tagline: "Poznatky založené na dátach",
      shortDesc: "Analýza údajov platformy a prehľady",
      suggestedPrompts: {
        0: "Zobrazte prehľad dnešnej aktivity kontaktov.",
        1: "Ako sa tento týždeň mení počet registrácií?",
        2: "Zhrňte výsledky e-mailových kampaní.",
        3: "Podajte správu o stave programu odporúčaní.",
      },
      variants: {
        gemini: "Do hĺbky",
        fast: "Rýchly",
      },
      variantInfo: {
        gemini: {
          description:
            "Analyzuje kontakty, používateľov, e-maily aj odporúčania a odhaľuje skutočný trend.",
          strength: "Špičkové uvažovanie aj pri množstve volaní nástrojov",
          weakness: "Stojí viac než dvojnásobok ceny variantu Rýchly.",
        },
        fast: {
          description: "Rýchlo načíta štatistiky a skontroluje denné čísla.",
          strength: "Rýchle odpovede, spoľahlivo pracuje s nástrojmi",
          weakness: "Pri analýze s viacerými krokmi ide menej do hĺbky.",
        },
      },
    },
    cronManager: {
      name: "Správca úloh cron",
      description:
        "Vytvára, upravuje, odstraňuje a monitoruje úlohy cron. Sleduje aj históriu ich spúšťania.",
      tagline: "Plánuj a sleduj úlohy",
      shortDesc: "Správa a monitorovanie úloh cron",
      suggestedPrompts: {
        0: "Vypíšte všetky aktívne úlohy cron a ich harmonogramy.",
        1: "Vytvorte novú úlohu cron, ktorá sa spustí každú hodinu.",
        2: "Ukážte mi nedávne zlyhania a chyby úloh.",
        3: "Skontrolujte celkový stav systému úloh.",
      },
      variants: {
        gemini: "Dôkladný",
        fast: "Rýchly",
      },
      variantInfo: {
        gemini: {
          description: "Preverí históriu zlyhaní a rozoberie zložité rozvrhy.",
          strength:
            "Špičkové schopnosti, dôsledný pri zmenách vo viacerých krokoch",
          weakness: "Stojí viac než dvojnásobok ceny variantu Rýchly.",
        },
        fast: {
          description:
            "Rýchlo vypíše a vytvára bežné úlohy cron alebo overí ich stav.",
          strength: "Lacnejší a rýchly pri bežných úlohách",
          weakness:
            "Dobre si poradí s väčšinou úloh. Pri zložitých zlyhaniach je menej dôsledný.",
        },
      },
    },
    systemMonitor: {
      name: "Monitor systému",
      description:
        "Sleduje stav infraštruktúry, pripojenie k databáze, kontroly Pulse a priebeh úloh.",
      tagline: "Sleduj stav a upozorni na chyby",
      shortDesc: "Monitorovanie stavu infraštruktúry",
      suggestedPrompts: {
        0: "Spustite úplnú kontrolu stavu systému.",
        1: "Zobrazte stav monitorovania Pulse.",
        2: "Skontrolujte pripojenie k databáze.",
        3: "Aký je aktuálny stav úloh na pozadí?",
      },
      variants: {
        fast: "Inteligentný",
        budget: "Úsporný",
      },
      variantInfo: {
        fast: {
          description:
            "Kontroluje stav a pri zlyhaní kontrol Pulse alebo úloh cron hľadá príčinu.",
          strength: "Lepšie vyhodnocuje záznamy aj históriu.",
          weakness: "Stojí niekoľkonásobne viac než variant Úsporný.",
        },
        budget: {
          description: "Nepretržite kontroluje stav a dostupnosť databázy.",
          strength:
            "Najrýchlejší a najlacnejší variant, spoľahlivo volá nástroje",
          weakness: "Rýchly. Pri hľadaní príčiny ide menej do hĺbky.",
        },
      },
    },
    publicCurator: {
      name: "Kurátor verejného obsahu",
      description: "Spravuje verejné vlákna, správy a komunitný obsah.",
      tagline: "Vyberaj a usporadúvaj obsah",
      shortDesc: "Správa verejného obsahu a vlákien",
      suggestedPrompts: {
        0: "Vypíšte nedávne verejné vlákna.",
        1: "Vyhľadajte vlákna na konkrétnu tému.",
        2: "Pomôžte mi zorganizovať komunitný obsah",
        3: "Nájdite správy podľa zadaných kritérií.",
      },
      variants: {
        gemini: "Dôkladný",
        fast: "Rýchly",
      },
      variantInfo: {
        gemini: {
          description:
            "Dôkladne preverí verejné vlákna vrátane obrázkov, videa a zvuku.",
          strength: "Špičkové schopnosti, spracuje všetky typy médií",
          weakness: "Stojí viac než dvojnásobok ceny variantu Rýchly.",
        },
        fast: {
          description: "Rýchlo triedi, označuje a upratuje komunitný obsah.",
          strength: "Rýchlo spracuje viac typov vstupov za nižšiu cenu.",
          weakness:
            "Zvláda bežné rozhodnutia. Pri hraničných prípadoch je menej spoľahlivý.",
        },
      },
    },
    codeArchitect: {
      name: "Architekt kódu",
      description:
        "Navrhuje architektúru a implementačné úlohy zveruje Claude Code. Dostupný iba na Hermes.",
      tagline: "Navrhni a zadaj implementáciu",
      shortDesc: "Rozhodnutia o architektúre prostredníctvom Claude Code",
      suggestedPrompts: {
        0: "Naplánujte implementáciu novej funkcie.",
        1: "Skontrolujte architektúru modulu.",
        2: "Zverte programátorskú úlohu nástroju Claude Code.",
        3: "Navrhnite postup migrácie.",
      },
      variants: {
        gemini: "Celkový pohľad",
        techBro: "Profesionálny programátor",
      },
      variantInfo: {
        gemini: {
          description:
            "Navrhne systém aj migráciu naprieč rozsiahlym kódom a pripraví podklady na odovzdanie.",
          strength: "Špičkové schopnosti, spracuje diagramy, video aj zvuk",
          weakness:
            "Menej sa venuje samotnému kódu než variant Profesionálny programátor.",
        },
        techBro: {
          description:
            "Píše špecifikácie priamo pre Claude Code a rozdeľuje prácu na presné úlohy.",
          strength: "Dobre programuje a pracuje ako agent.",
          weakness:
            "Spoľahlivý pri návrhu, pri zložitých rozhodnutiach má rezervy",
        },
      },
    },
    deploymentAgent: {
      name: "Agent nasadenia",
      description:
        "Zostavuje a vydáva aplikáciu a spravuje servery cez SSH. Dostupný iba na Hermes.",
      tagline: "Zostaviť a nasadiť",
      shortDesc: "Nasadenie a správa serverov",
      suggestedPrompts: {
        0: "Zostavte aplikáciu pre produkciu.",
        1: "Skontrolujte stav servera.",
        2: "Spustite nasadenie do produkcie.",
        3: "Ukážte mi aktuálny stav servera",
      },
      variants: {
        techBro: "Spoľahlivý",
        budget: "Úsporný",
      },
      variantInfo: {
        techBro: {
          description:
            "Zostavenia, vydania a práca cez SSH, pri ktorých záleží na každom príkaze.",
          strength: "Spoľahlivá samostatná práca, opatrné používanie nástrojov",
          weakness: "Správa stojí výrazne viac než pri Úspornom variante.",
        },
        budget: {
          description: "Bežné kontroly stavu a hlásenia za zlomok ceny.",
          strength: "Najlacnejší a najrýchlejší variant",
          weakness: "Rýchly. Pri zložitých nasadeniach prináša vyššie riziko.",
        },
      },
    },
    rebuildAgent: {
      name: "Agent zostavenia",
      description:
        "Znova zostaví aplikáciu a pomocou signálu SIGUSR1 reštartuje server bez výpadku.",
      tagline: "Zostaviť a reštartovať",
      shortDesc: "Opätovné zostavenie aplikácie a reštart bez výpadku",
      suggestedPrompts: {
        0: "Vytvorte novú zostavu a reštartujte produkčný server.",
        1: "Vytvorte zostavu bez reštartu.",
        2: "Po zostavení skontrolujte stav servera.",
        3: "Vytvorte naplánovanú úlohu na opätovné zostavenie.",
      },
      variants: {
        gemini: "Dôkladný",
        fast: "Rýchly",
      },
      variantInfo: {
        gemini: {
          description:
            "Zostavuje a reštartuje. Pri zlyhaní zostavenia najprv hľadá príčinu.",
          strength:
            "Špičkové schopnosti, najlepšie odhaľuje príčiny zlyhaní zostavenia",
          weakness: "Stojí viac než dvojnásobok ceny variantu Rýchly.",
        },
        fast: {
          description:
            "Bežné opätovné zostavenie a reštart, keď pri zostavení nečakáš problémy.",
          strength: "Rýchle vybavenie za nižšiu cenu",
          weakness:
            "Zvláda bežné úlohy. Horšie si poradí so zložitými chybami zostavenia.",
        },
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Vedie implementáciu nových funkcií do produkčného kódu. Pomocou Claude Code dôkladne preskúma repozitár, zistí zámer požiadavky a navrhne aj zrealizuje zodpovedajúcu zmenu.",
      tagline: "Od nápadu ku kódu",
      shortDesc: "Implementácia funkcie prostredníctvom Claude Code",
      suggestedPrompts: {
        0: "Mám nápad na novú funkciu, dovoľte mi opísať ju.",
        1: "Preskúmajte zdrojový kód a vysvetlite, ako funguje modul.",
        2: "Pomôžte mi naplánovať a implementovať zmenu existujúcej funkcie.",
        3: "Preskúmajte chybu a navrhnite opravu.",
      },
      variants: {
        budget: "Lacný a inteligentný",
        open: "Špičkový otvorený model",
        fast: "Prenikavý",
        max: "Max.",
        broad: "Všestranný",
      },
    },
    skillCreator: {
      name: "Tvorca zručností",
      description:
        "Navrhuje a tvorí zručnosti AI s vlastnou osobnosťou, systémovým zadaním, nástrojmi a nastavením modelu. Spravuje aj obľúbené položky a nastavenia.",
      tagline: "Navrhuj zručnosti AI",
      shortDesc: "Tvorba a správa zručností AI",
      suggestedPrompts: {
        0: "Pomôžte mi vytvoriť zručnosť AI na pomoc s programovaním.",
        1: "Zobrazte všetky existujúce zručnosti a navrhnite, čo chýba.",
        2: "Navrhnite zručnosť na tvorivé písanie s vlastnou osobnosťou.",
        3: "Pridajte zručnosť medzi obľúbené a nastavte môj chat.",
      },
      variants: {
        cheapAndSmart: "Úsporný",
        brilliant: "Presný",
      },
      variantInfo: {
        cheapAndSmart: {
          description:
            "Navrhuj a dolaďuj zručnosti za nízku cenu. Zvládne aj náročnejšie zadania a nastavenia.",
          strength: "Špičkové schopnosti, nižšia cena za správu",
          weakness: "Dlhé systémové zadania stoja viac.",
        },
        brilliant: {
          description:
            "Presné systémové zadania a prehľadné nastavenie nástrojov pre zručnosti, pri ktorých záleží na každom detaile.",
          strength: "Spoľahlivá práca agenta aj s nástrojmi",
          weakness:
            "Drahší variant, pri kontroverzných postavách volí opatrnejšie odpovede.",
        },
      },
    },
    heilpraktikerPruefung: {
      name: "Príprava na skúšku Heilpraktiker",
      description:
        "Verná simulácia ústnej skúšky Heilpraktiker s náročnosťou podľa tvojich odpovedí",
      tagline: "Ústna skúška",
      shortDesc: "Príprava na skúšku Heilpraktiker",
      suggestedPrompts: {
        0: "Začnime skúšku",
        1: "Vyskúšajte ma z internej medicíny.",
        2: "Predstavte mi klinický prípad",
        3: "Otázky z legislatívy, prosím",
      },
      variants: {
        smart: "Vyvážený",
        precise: "Presný",
        thorough: "Dôkladný",
        quick: "Rýchly",
      },
      variantInfo: {
        smart: {
          description:
            "Verná simulácia ústnej skúšky s dôkladnými medicínskymi otázkami za cenu vhodnú na pravidelné precvičovanie.",
          strength: "Špičkové uvažovanie, udrží kontext aj pri dlhom skúšaní",
          weakness: "Podrobnejšie hodnotenie zvyšuje náklady.",
        },
        precise: {
          description:
            "Presné otázky a stručné opravy. Dôsledne vyžaduje správnu terminológiu a znalosť práva.",
          strength:
            "Jasné, stručné opravy za nižšiu cenu než pri variante Vyvážený",
          weakness:
            "Spoľahlivý pri bežných prípadoch. Pri zložitej diferenciálnej diagnostike rozlišuje menej detailov.",
        },
        thorough: {
          description:
            "Náročné doplňujúce otázky a podrobný rozbor. Najviac sa podobá skutočnému skúšajúcemu.",
          strength:
            "Najpodrobnejšie hodnotenie medzier vo vedomostiach a varovných príznakov",
          weakness: "Najdrahší variant tohto trénera",
        },
        quick: {
          description:
            "Krátke kolá na opakovanie medzi úplnými simuláciami skúšky.",
          strength: "Najlacnejší variant, okamžité odpovede",
          weakness: "Rýchly. Zložité prípady rozoberá menej do hĺbky.",
        },
      },
    },
    qualityTester: {
      name: "Tester kvality",
      description:
        "Simuluje bežného používateľa. Pri chybe sa zastaví a jasne ju opíše bez opakovania úkonu.",
      tagline: "Nájsť chyby",
      shortDesc: "Postava na testovanie platformy",
      suggestedPrompts: {
        0: "Vytvorte obrázok západu slnka.",
        1: "Aké nástroje máte?",
        2: "Vytvorte pokojnú hudbu.",
        3: "Vytvorte krátke video s mačkou.",
      },
      variants: {
        budget: "Úsporný",
        visual: "Vizuálny",
        nativeImage: "Priama tvorba obrázkov",
        nanoBananaPro: "Nano Banana Pro",
      },
      variantInfo: {
        budget: {
          description:
            "Používa funkcie platformy ako skutočný používateľ a hlási chyby.",
          strength: "Najlacnejšie testovanie, plná podpora nástrojov",
          weakness: "Nedokáže tvoriť obrázky priamo.",
        },
        nativeImage: {
          description: "Testuje obrázky, ktoré obrazový model vytvára priamo.",
          strength: "Testuje vstavanú tvorbu obrázkov.",
          weakness: "Nevolá nástroje, preto ďalšie funkcie neotestuje.",
        },
      },
    },
  },
  get: {
    title: "Zručnosti",
    titleShort: "Zručnosti",
    dynamicTitle: "Zručnosti ({{count}})",
    description: "Zobrazí všetky dostupné vstavané aj vlastné zručnosti.",
    fields: {
      query: {
        label: "Hľadať (nepovinné)",
        description:
          "Vyfiltruje zručnosti podľa kľúčových slov. Všetky slová oddelené medzerou sa musia zhodovať. Napríklad 'image gen' nájde 'image generation'. Vyhľadáva v názve, slogane, opise a kategórii bez rozlišovania veľkých a malých písmen. Prázdne pole zobrazí všetky zručnosti.",
        placeholder: "napr. výskum, tvorba obrázkov, programovanie",
      },
      skillId: {
        label: "ID zručnosti",
        description:
          "Načíta podrobnosti o zručnosti podľa ID vrátane systémového zadania, nástrojov a nastavení modelu.",
      },
      page: {
        label: "Strana",
        description:
          "Číslo strany vo výsledkoch. Pri volaniach AI a MCP je predvolene 25 položiek na stranu.",
      },
      pageSize: {
        label: "Veľkosť stránky",
        description:
          "Počet zručností na stránku (1 až 500). AI a MCP predvolene dostanú 25 položiek. Ľudia uvidia všetky.",
      },
      sourceFilter: {
        label: "Zdroj",
        description:
          "Zobrazí vstavané, komunitné alebo vlastné zručnosti podľa vybraného zdroja.",
      },
      targetUserId: {
        label: "ID cieľového používateľa",
        description:
          "Iba pre správcov. Zobrazí zručnosti vybraného používateľa.",
      },
    },
    container: {
      title: "Zoznam zručností",
      description: "Všetky zručnosti dostupné pre používateľa",
    },
    createButton: {
      label: "Vytvoriť vlastnú zručnosť",
    },
    openFullPage: "Otvoriť celú stránku",
    browser: {
      advancedModelAccess: "Vyber si, ako chceš používať AI",
      configureFiltersText:
        "Vyber si model priamo alebo začni s hotovou zručnosťou.",
      aiModels: "Modely AI",
      configureAiModelsTitle: "Priamy výber modelu",
      advancedChooseText:
        "Počet dostupných modelov: {{count}}. Vyber si model podľa schopností, pravidiel obsahu a ceny.",
      modelsWithCustomFilters: "modely s vlastnými filtrami",
      configureButton: "Nastaviť",
      selectButton: {
        label: "Preskúmať modely",
      },
      skillPresets: "Hotové zručnosti",
      pickSkillText:
        "Použi hotovú zručnosť s modelom vybraným pre jej úlohu. Nastavenia si kedykoľvek doladíš.",
    },
    signupPrompt: {
      title: "Vytvorte si vlastné zručnosti AI",
      description:
        "Zaregistruj sa a vytvor si vlastné zručnosti s osobnosťou a správaním podľa seba.",
      backButton: "Prehliadať zručnosti",
      signupButton: "Vytvoriť účet",
      loginButton: "Prihlásiť sa",
    },
    search: {
      placeholder: "Vyhľadať zručnosti…",
      noResults: "Vyhľadávaniu nezodpovedá žiadna zručnosť.",
      results: "Výsledky hľadania",
    },
    card: {
      actions: {
        inCollection: "V tvojej zbierke",
        addAnother: "Pridať ďalšie",
        addToCollection: "Pridať do zbierky:",
        quick: "Rýchly",
        customize: "Prispôsobiť",
        useNow: "Aktivovať",
        inUse: "Aktívny",
        goToChat: "Prejsť do četu",
        useThis: "Použiť toto",
        chooseFavorite: "Vyber model",
        selectFavorite: "Vyber model pre čet",
        addVariant: "Pridať ďalší model",
        view: "Zobraziť",
        edit: "Upraviť",
        vote: "Hlasovať",
        report: "Nahlásiť",
        addMissing: "Pridať všetky modely do sekcie Moje zručnosti",
        add: "Pridať",
        added: "Pridané",
      },
      showVariants: "Modely ({{count}})",
    },
    section: {
      showMore: "Zobraziť ďalšie položky ({{count}})",
      showLess: "Zobraziť menej",
      browseAll: "Prehľadávať všetky",
    },
    response: {
      skills: {
        skill: {
          title: "Zručnosť",
          id: { content: "ID zručnosti" },
          name: { content: "Názov zručnosti" },
          tagline: { content: "Slogan zručnosti" },
          description: { content: "Opis zručnosti" },
          icon: { content: "Ikona zručnosti" },
          systemPrompt: { content: "Systémové zadanie" },
          category: { content: "Kategória" },
          source: { content: "Zdroj" },
          ownershipType: { content: "Typ vlastníctva" },
          preferredModel: { content: "Preferovaný model" },
          voice: { content: "Hlas" },
          suggestedPrompts: { content: "Odporúčané zadania" },
          requirements: { content: "Požiadavky" },
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
          separator: { content: "•" },
          actions: {
            directModelButton: {
              label: "Priamy model",
            },
          },
        },
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
        description:
          "Ak chceš získať prístup k vlastným zručnostiam, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "K tomuto zdroju nemáš prístup.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný zdroj sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Zručnosti sa nepodarilo načítať.",
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
    success: {
      title: "Úspech",
      description: "Zručnosti sa načítali.",
    },
  },
  post: {
    title: "Vytvoriť zručnosť",
    titleShort: "Vytvoriť zručnosť",
    dynamicTitle: "Vytvoriť: {{name}}",
    description: "Vytvoriť novú vlastnú zručnosť",
    form: {
      title: "Vytvor si vlastnú zručnosť",
      description:
        "Vytvor zručnosť AI s vlastným správaním, osobnosťou a schopnosťami. Vyber si konkrétny model alebo nechaj systém vybrať ho podľa tvojich požiadaviek.",
    },
    submitButton: {
      text: "Vytvoriť vlastnú zručnosť",
      loadingText: "Zručnosť sa vytvára…",
    },
    backButton: {
      label: "Späť",
    },
    container: {
      title: "Vytvoriť novú zručnosť",
      description: "Definovať novú vlastnú zručnosť",
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
      description:
        "Názov ikony zručnosti, napríklad 'brain', 'technologist' alebo 'zap'. Dostupné názvy zobrazíte príkazom vibe help --toolName=icon-list.",
    },
    skillDescription: {
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
      label: "Hlas (TTS)",
      description:
        "Hlas na prevod textu na reč pre túto zručnosť. Globálny výber hlasu používateľa má prednosť. Hodnota null použije globálne nastavenie. Vlastný hlas nastavte iba pre zručnosť s charakteristickým hlasom, napríklad rozprávača.",
      placeholder: "Predvolené nastavenie systému",
    },
    sttModel: {
      label: "Model na prepis reči",
      description:
        "Model na rozpoznávanie reči. Hodnota null použije globálne nastavenie používateľa. Vyberte ho iba pri špecifických požiadavkách na presnosť, napríklad pri lekárskom prepise.",
      placeholder: "Predvolené nastavenie systému",
    },
    imageVisionModel: {
      label: "Model na analýzu obrázkov",
      description:
        "Multimodálny model na analýzu obrázkov. Hodnota null použije globálne nastavenie používateľa. Nastavte ho, ak potrebujete schopnosti konkrétneho modelu.",
      placeholder: "Predvolené nastavenie systému",
    },
    videoVisionModel: {
      label: "Model na analýzu videa",
      description:
        "Multimodálny model na analýzu videí. Hodnota null použije globálne nastavenie používateľa. Nastavte ho, ak potrebujete schopnosti konkrétneho modelu.",
      placeholder: "Predvolené nastavenie systému",
    },
    audioVisionModel: {
      label: "Model na analýzu zvuku",
      description:
        "Multimodálny model na analýzu zvuku. Hodnota null použije globálne nastavenie používateľa. Nastavte ho, ak potrebujete schopnosti konkrétneho modelu.",
      placeholder: "Predvolené nastavenie systému",
    },
    imageGenModel: {
      label: "Model na tvorbu obrázkov",
      description:
        "Model na tvorbu obrázkov. Ak je zadaný, má prednosť pred nastavením používateľa. Hodnota null použije globálne nastavenie používateľa. Vyberte model, ak je zručnosť určená na tvorbu obrázkov. Príklad: 'Flux Artist'.",
      placeholder: "Predvolené nastavenie systému",
    },
    musicGenModel: {
      label: "Model na tvorbu hudby",
      description:
        "Model na tvorbu hudby. Ak je zadaný, má prednosť pred nastavením používateľa. Hodnota null použije globálne nastavenie používateľa. Vyberte model, ak je zručnosť určená na tvorbu hudby.",
      placeholder: "Predvolené nastavenie systému",
    },
    videoGenModel: {
      label: "Model na tvorbu videa",
      description:
        "Model na tvorbu videí. Ak je zadaný, má prednosť pred nastavením používateľa. Hodnota null použije globálne nastavenie používateľa. Vyberte model, ak je zručnosť určená na tvorbu videí.",
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
    modelSelection: {
      title: "Výber modelu",
      label: "Výber modelu",
      description:
        "Model na čet pre túto zručnosť. Odporúča sa FILTERS s rozsahmi intelligenceRange, priceRange a contentRange. Systém vyberie najlepší dostupný model. MANUAL použite, ak potrebujete vlastnosti konkrétneho modelu, napríklad uvažovanie alebo model bez cenzúry. Hodnota null použije predvolené nastavenie platformy. Úplné poradie priorít je v MODEL-RESOLUTION.md.",
    },
    variants: {
      label: "Varianty",
      description:
        "Pomenované varianty s vlastným výberom modelu. Každý variant potrebuje id (jedinečný reťazec), modelSelection (povinný výber modelu) a isDefault (presne jeden variant musí mať hodnotu true). Voliteľné sú displayName a vlastné modely pre hlas, analýzu vstupov a tvorbu médií.",
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
    selectionType: {
      label: "Typ výberu",
      skillBased: "Podľa zručnosti",
      manual: "Konkrétny model",
      filters: "Kritériá filtra",
    },
    preferredModel: {
      label: "Preferovaný model",
      description:
        "Vyberte konkrétny model AI, ktorý bude táto zručnosť vždy používať.",
      helpText: "Výberom konkrétneho modelu obmedzíte zručnosť na tento model.",
    },
    intelligence: {
      label: "Úroveň inteligencie",
      description: "Najnižšia požadovaná úroveň schopností modelu",
    },
    intelligenceRange: {
      label: "Rozsah inteligencie",
      description: "Požadovaná úroveň schopností modelu",
      minLabel: "Minimálna inteligencia",
      maxLabel: "Maximálna inteligencia",
    },
    minIntelligence: {
      label: "Minimálna inteligencia",
      description: "Najnižšia požadovaná úroveň schopností modelu",
    },
    maxIntelligence: {
      label: "Maximálna inteligencia",
      description: "Najvyššia povolená úroveň schopností modelu",
    },
    priceRange: {
      label: "Cenový rozsah",
      description: "Rozsah ceny správy v kreditoch",
      minLabel: "Minimálna cena",
      maxLabel: "Maximálna cena",
    },
    minPrice: {
      label: "Minimálna cena",
      description: "Minimálna cena správy s touto zručnosťou v kreditoch",
    },
    maxPrice: {
      label: "Maximálna cena",
      description:
        "Najviac kreditov, ktoré chceš minúť na jednu správu s touto zručnosťou",
    },
    contentLevel: {
      label: "Úroveň moderácie obsahu",
      description:
        "Úroveň filtrovania obsahu modelu (mainstream, open alebo uncensored)",
    },
    contentRange: {
      label: "Rozsah moderácie obsahu",
      description: "Rozsah úrovne moderácie obsahu",
      minLabel: "Minimálna úroveň moderácie",
      maxLabel: "Maximálna úroveň moderácie",
    },
    minContent: {
      label: "Minimálna úroveň obsahu",
      description: "Minimálna úroveň moderácie obsahu pre model",
    },
    maxContent: {
      label: "Maximálna úroveň obsahu",
      description: "Maximálna úroveň moderácie obsahu pre model",
    },
    preferredStrengths: {
      label: "Uprednostnené prednosti",
      description: "Schopnosti a silné stránky, ktoré má systém uprednostniť",
      item: "Silná stránka",
    },
    ignoredWeaknesses: {
      label: "Ignorované slabiny",
      description: "Slabé stránky modelu, ktoré vám neprekážajú",
      item: "Slabá stránka",
    },
    manualModelId: {
      label: "Ručný výber modelu",
      description: "Konkrétny model, ktorý bude zručnosť vždy používať",
    },
    suggestedPrompts: {
      label: "Odporúčané zadania",
      description: "Príklady zadaní pre túto zručnosť",
      placeholder: "Pridať odporúčané zadanie…",
    },
    response: {
      id: { content: "ID vytvorenej zručnosti" },
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
        description: "Ak chceš vytvárať zručnosti, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáš oprávnenie vytvárať zručnosti.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný zdroj sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Zručnosť sa nepodarilo vytvoriť.",
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
        description: "Zručnosť s týmto názvom už existuje.",
      },
    },
    success: {
      title: "Zručnosť sa vytvorila",
      description: "Tvoja vlastná zručnosť je pripravená.",
    },
  },
  selector: {
    free: "BEZPLATNE",
  },
  credits: {
    credit: "{{count}} kredit",
    credits: "Kredity: {{count}}",
  },
};
