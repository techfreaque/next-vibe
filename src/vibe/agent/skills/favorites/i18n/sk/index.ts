import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: {
    category: "Čet",
    tags: {
      favorites: "Obľúbené",
    },
    voices: {
      MALE: "Mužský hlas",
      FEMALE: "Ženský hlas",
    },

    get: {
      title: "Zobraziť obľúbenú konfiguráciu",
      description: "Načíta konkrétnu obľúbenú konfiguráciu.",
      container: {
        title: "Podrobnosti obľúbenej konfigurácie",
      },
      editButton: {
        label: "Upraviť obľúbenú konfiguráciu",
      },
      deleteButton: {
        label: "Odstrániť obľúbenú konfiguráciu",
      },
      viewSkillButton: {
        label: "Zobraziť zručnosť",
      },
      signupPrompt: {
        title: "Prispôsob si osobnosť zručnosti",
        description:
          "Zaregistruj sa, ak chceš upraviť systémové zadanie a správanie zručnosti.",
        backButton: "Späť",
        signupButton: "Vytvoriť účet",
        loginButton: "Prihlásiť sa",
      },
      id: {
        label: "ID obľúbenej konfigurácie",
      },
      response: {
        skillId: {
          content: "Zručnosť: {{value}}",
        },
        customVariantName: {
          content: "Názov variantu: {{value}}",
        },
        customIcon: {
          content: "Vlastná ikona: {{value}}",
        },
        voice: {
          content: "Hlas: {{value}}",
        },
        mode: {
          content: "Režim: {{value}}",
        },
        intelligence: {
          content: "Inteligencia: {{value}}",
        },
        modelSelection: {
          title: "Výber modelu",
        },
        selectionType: {
          content: "Typ výberu: {{value}}",
        },
        minIntelligence: {
          content: "Minimálna inteligencia: {{value}}",
        },
        maxIntelligence: {
          content: "Maximálna inteligencia: {{value}}",
        },
        minPrice: {
          content: "Minimálna cena: {{value}}",
        },
        maxPrice: {
          content: "Maximálna cena: {{value}}",
        },
        minContent: {
          content: "Minimálna úroveň moderácie obsahu: {{value}}",
        },
        maxContent: {
          content: "Maximálna úroveň moderácie obsahu: {{value}}",
        },
        content: {
          content: "Úroveň moderácie obsahu: {{value}}",
        },
        preferredStrengths: {
          content: "Uprednostnené prednosti: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Ignorované slabiny: {{value}}",
        },
        manualModelId: {
          content: "Ručne vybraný model: {{value}}",
        },
        position: {
          content: "Poradie: {{value}}",
        },
        color: {
          content: "Farba: {{value}}",
        },
        isActive: {
          content: "Aktívne: {{value}}",
        },
        useCount: {
          content: "Počet použití: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Neplatné ID obľúbenej konfigurácie",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Ak chceš zobraziť túto konfiguráciu, prihlás sa.",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Túto konfiguráciu nemáš oprávnenie zobraziť.",
        },
        notFound: {
          title: "Nenájdené",
          description: "Obľúbená konfigurácia sa nenašla.",
        },
        server: {
          title: "Chyba servera",
          description: "Konfiguráciu sa nepodarilo načítať.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny. Po odchode sa stratia.",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri spracovaní vašej žiadosti nastal konflikt",
        },
      },
      success: {
        title: "Úspech",
        description: "Konfigurácia sa načítala.",
      },
    },
    patch: {
      title: "Upraviť obľúbenú konfiguráciu",
      description: "Aktualizovať existujúcu obľúbenú konfiguráciu",
      container: {
        title: "Upraviť obľúbenú konfiguráciu",
      },
      backButton: {
        label: "Späť na obľúbenú konfiguráciu",
      },
      deleteButton: {
        label: "Odstrániť obľúbenú konfiguráciu",
      },
      viewSkillButton: {
        label: "Zobraziť zručnosť",
      },
      useThisSkillButton: {
        label: "Použiť túto zručnosť",
      },
      useThisModelButton: {
        label: "Použiť tento model",
      },
      currentlyActiveButton: {
        label: "V súčasnosti aktívny",
      },
      signupPrompt: {
        title: "Prispôsob si osobnosť zručnosti",
        description:
          "Zaregistruj sa, ak chceš upraviť systémové zadanie a správanie zručnosti.",
        backButton: "Späť",
        signupButton: "Vytvoriť účet",
        loginButton: "Prihlásiť sa",
      },
      saveButton: {
        label: "Uložiť",
        loadingText: "Ukladá sa…",
      },
      saveAndUseButton: {
        label: "Uložiť a použiť",
        loadingText: "Ukladá sa a aktivuje…",
      },
      id: {
        label: "ID obľúbenej konfigurácie",
      },
      skillId: {
        label: "Zručnosť",
        description:
          'ID zručnosti. Pre predvolený variant použi "skillSlug", pre konkrétny variant "skillSlug__variantId".',
      },
      customVariantName: {
        label: "Názov variantu",
        description:
          "Vlastný názov variantu. Prázdne pole použije predvolený názov zručnosti.",
      },
      chatModel: {
        label: "Model pre čet",
        placeholder: "Prevziať zo zručnosti",
      },
      voice: {
        label: "Hlas AI",
        description:
          "Vlastný hlas na prevod textu na reč pre túto obľúbenú konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
        placeholder: "Prevziať zo zručnosti",
      },
      sttModel: {
        label: "Model na prepis reči",
        description:
          "Model na rozpoznávanie reči. Hodnota null použije globálne nastavenie používateľa. Vlastný model vyberte iba pre špecializovaný prepis.",
        placeholder: "Prevziať zo zručnosti",
      },
      imageVisionModel: {
        label: "Model na analýzu obrázkov",
        description:
          "Vyber konkrétny model na analýzu obrázkov pre túto konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
        placeholder: "Prevziať zo zručnosti",
      },
      videoVisionModel: {
        label: "Model na analýzu videa",
        description:
          "Model na analýzu videa pre túto konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
        placeholder: "Prevziať zo zručnosti",
      },
      audioVisionModel: {
        label: "Model na analýzu zvuku",
        description:
          "Model na analýzu zvuku pre túto konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
        placeholder: "Prevziať zo zručnosti",
      },
      imageGenModel: {
        label: "Model na tvorbu obrázkov",
        description:
          "Vlastný model na tvorbu obrázkov pre túto konfiguráciu. Hodnota null použije imageGenModelSelection zručnosti. Zručnosť má pri tvorbe médií prednosť. Vyplňte pole, ak chcete použiť iný model.",
        placeholder: "Prevziať zo zručnosti",
      },
      musicGenModel: {
        label: "Model na tvorbu hudby",
        description:
          "Vlastný model na tvorbu hudby pre túto konfiguráciu. Hodnota null použije musicGenModelSelection zručnosti. Pri tvorbe médií má zručnosť prednosť.",
        placeholder: "Prevziať zo zručnosti",
      },
      videoGenModel: {
        label: "Model na tvorbu videa",
        description:
          "Vlastný model na tvorbu videa pre túto konfiguráciu. Hodnota null použije videoGenModelSelection zručnosti. Pri tvorbe médií má zručnosť prednosť.",
        placeholder: "Prevziať zo zručnosti",
      },
      mode: {
        label: "Režim výberu",
      },
      modelSelection: {
        title: "Výber modelu",
        label: "Výber modelu",
        description:
          "Výber modelu pre túto konfiguráciu. Použite filtre alebo zadajte konkrétny model. Hodnota null použije predvolený model zručnosti.",
      },
      selectionType: {
        label: "Typ výberu",
        characterBased: "Podľa zručnosti",

        manual: "Konkrétny model",
        filters: "Kritériá filtra",
      },
      intelligence: {
        label: "Úroveň inteligencie",
      },
      minIntelligence: {
        label: "Minimálna inteligencia",
        description: "Najnižšia požadovaná úroveň schopností modelu",
      },
      maxIntelligence: {
        label: "Maximálna inteligencia",
        description: "Najvyššia povolená úroveň schopností modelu",
      },
      minPrice: {
        label: "Minimálna cena",
        description: "Minimálna cena správy v kreditoch",
      },
      maxPrice: {
        label: "Maximálna cena",
      },
      minContent: {
        label: "Minimálna úroveň obsahu",
        description: "Minimálna úroveň moderácie obsahu pre model",
      },
      maxContent: {
        label: "Maximálna úroveň obsahu",
        description: "Maximálna úroveň moderácie obsahu pre model",
      },
      content: {
        label: "Úroveň moderácie obsahu",
      },
      preferredStrengths: {
        label: "Uprednostnené prednosti",
        description: "Schopnosti a silné stránky, ktoré má systém uprednostniť",
      },
      ignoredWeaknesses: {
        label: "Ignorované slabiny",
        description: "Slabé stránky modelu, ktoré vám neprekážajú",
      },
      manualModelId: {
        label: "Ručný výber modelu",
      },
      isActive: {
        label: "Aktívny",
      },
      position: {
        label: "Poradie",
      },
      color: {
        label: "Farba",
        description: "Vlastná farba obľúbenej konfigurácie",
      },
      customIcon: {
        label: "Vlastná ikona",
        description: "Vlastná ikona obľúbenej konfigurácie",
      },
      icon: {
        label: "Vlastná ikona",
        description: "Vlastná ikona tejto obľúbenej konfigurácie",
      },
      availableTools: {
        label: "Povolené nástroje",
        description:
          "Zoznam povolených nástrojov. Každá položka potrebuje toolId. Dostupné identifikátory získate z system_help_GET. Ak má používateľ vykonanie najprv potvrdiť, nastavte requiresConfirmation: true. Hodnota null použije nastavenia zručnosti alebo globálne nastavenia.",
      },
      pinnedTools: {
        label: "Pripnuté nástroje",
        description:
          "Pripnuté nástroje na paneli pre túto konfiguráciu. Hodnota null prevezme nastavenia zručnosti alebo globálne nastavenia.",
      },
      deniedTools: {
        label: "Blokované nástroje",
        description:
          "Pridaj ďalšie blokované nástroje pre túto konfiguráciu. Budú zablokované spolu s nástrojmi, ktoré blokuje zručnosť, bez ohľadu na ostatné nastavenia.",
        clearAll: "Vyčistiť všetko",
        noToolsFound: "Nenájdené žiadne nástroje",
        blockedNote:
          "Blokované nástroje nemožno spustiť bez ohľadu na ostatné nastavenia.",
        searchPlaceholder: "Vyhľadať nástroje…",
        blocked: "zablokované",
      },
      promptAppend: {
        label: "Dodatočné pokyny",
        description:
          "Dodatočné pokyny sa pripoja k systémovému zadaniu zručnosti iba v tejto konfigurácii. Prispôsobíte si ju bez zmeny zdieľanej zručnosti. Agenti AI: doplňte meno používateľa, uprednostňovaný jazyk, technickú úroveň a odborný kontext. Napríklad: Volám sa Max. Uprednostňujem TypeScript a Bun. Odpovedajte po anglicky.",
        placeholder:
          "Napr. Volám sa Alex. Uprednostňujem stručné odpovede v angličtine.",
      },
      compactTrigger: {
        label: "Hranica na skrátenie kontextu (tokeny)",
        description:
          "Počet tokenov, pri ktorom sa má rozhovor v tejto konfigurácii zhrnúť. Hodnota null použije nastavenie zručnosti alebo globálne nastavenie.",
      },
      memoryLimit: {
        label: "Limit pamäte (tokeny)",
        description:
          "Najvyšší počet tokenov spomienok pridaných do jedného kroku tejto konfigurácie. Hodnota null použije nastavenie zručnosti alebo globálne nastavenie.",
      },
      changeSkill: {
        label: "Zmeniť zručnosť",
      },
      modifySkill: {
        label: "Zmeniť zručnosť",
      },
      response: {
        success: {
          content: "Aktualizované: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Skontroluj zadané údaje a skús to znova.",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Ak chceš upraviť túto konfiguráciu, prihlás sa.",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Túto konfiguráciu nemáš oprávnenie upraviť.",
        },
        notFound: {
          title: "Nenájdené",
          description: "Obľúbená konfigurácia sa nenašla.",
        },
        server: {
          title: "Chyba servera",
          description: "Konfiguráciu sa nepodarilo uložiť.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny. Po odchode sa stratia.",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri ukladaní obľúbenej konfigurácie nastal konflikt.",
        },
      },
      slotOverride: {
        label: "Vlastné nastavenie pre túto konfiguráciu",
      },
      globalDefault: {
        label: "Moje predvolené nastavenie",
      },
      success: {
        title: "Úspech",
        description: "Obľúbená konfigurácia sa uložila.",
      },
    },
    delete: {
      title: "Odstrániť obľúbenú konfiguráciu",
      description: "Odstrániť obľúbenú konfiguráciu",
      container: {
        title: "Odstrániť obľúbenú konfiguráciu",
        description: "Trvalo odstrániť túto obľúbenú konfiguráciu",
      },
      backButton: {
        label: "Zrušiť",
      },
      actions: {
        delete: "Odstrániť obľúbenú konfiguráciu",
        deleting: "Konfigurácia sa odstraňuje",
      },
      id: {
        label: "ID obľúbenej konfigurácie",
        description: "Krátky identifikátor konfigurácie, ktorú chceš odstrániť",
      },
      response: {
        success: {
          content: "Odstránené: {{value}}",
        },
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Neplatné ID obľúbenej konfigurácie",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Ak chceš odstrániť túto konfiguráciu, prihlás sa.",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Túto konfiguráciu nemáš oprávnenie odstrániť.",
        },
        notFound: {
          title: "Nenájdené",
          description: "Obľúbená konfigurácia sa nenašla.",
        },
        server: {
          title: "Chyba servera",
          description: "Konfiguráciu sa nepodarilo odstrániť.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máš neuložené zmeny. Po odchode sa stratia.",
        },
        conflict: {
          title: "Konflikt",
          description: "Konfiguráciu sa pre konflikt nepodarilo odstrániť.",
        },
      },
      success: {
        title: "Úspech",
        description: "Konfigurácia sa odstránila.",
      },
    },
  },
  category: "Čet",
  tags: {
    favorites: "Obľúbené",
  },
  active: "Aktívny",
  fallbacks: {
    unknownSkill: "Neznáma zručnosť",
    unknownModel: "Neznámy model",
    unknown: "Neznáme",
    unknownProvider: "neznáme",
    noTagline: "",
    noDescription: "",
    zeroCredits: "0 kreditov",
    noModelConfiguration: "Chyba: model nemá konfiguráciu",
    configurationMissing: "Chýba konfigurácia",
    noModel: "Žiadny model",
    dash: ".",
  },
  enums: {
    selectionType: {
      characterBased: "Podľa zručnosti",
      manual: "Konkrétny model",
      filters: "Kritériá filtra",
    },
    mode: {
      auto: "Automatické",
      manual: "Ručne",
    },
    intelligence: {
      any: "Akýkoľvek",
      quick: "Rýchly",
      smart: "Inteligentný",
      brilliant: "Pokročilý",
    },
    price: {
      any: "Akýkoľvek",
      cheap: "Lacné",
      standard: "Štandard",
      premium: "Prémiová",
    },
    content: {
      any: "Akýkoľvek",
      mainstream: "Bežné modely",
      open: "Otvorené",
      uncensored: "Bez cenzúry",
    },
    variantsMode: {
      all: "Všetky varianty",
      some: "Niektoré varianty",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Zoradiť podľa úrovne inteligencie",
      price: "Zoradiť podľa ceny",
      content: "Zoradiť podľa pravidiel obsahu",
    },
    sortDirection: {
      asc: "Od najnižšej hodnoty",
      desc: "Od najvyššej hodnoty",
    },
    sortField: {
      intelligence: "Inteligencia",
      price: "Cena",
      content: "Obsah",
    },
  },
  get: {
    title: "Zobraziť obľúbené konfigurácie",
    titleShort: "Obľúbené",
    description: "Zobrazí všetky uložené obľúbené konfigurácie zručností.",
    userId: {
      label: "ID používateľa",
      description:
        "Iba pre správcov. Zobrazí obľúbené konfigurácie vybraného používateľa. Prázdne pole zobrazí tvoje konfigurácie.",
    },
    fields: {
      query: {
        label: "Hľadať",
        description:
          "Vyhľadaj obľúbené konfigurácie podľa názvu, sloganu alebo ID zručnosti.",
      },
      page: {
        label: "Strana",
        description:
          "Číslo strany vo výsledkoch. Pri volaniach AI a MCP je predvolene 25 položiek na stranu.",
      },
      pageSize: {
        label: "Veľkosť stránky",
        description:
          "Počet obľúbených konfigurácií na stránku (1 až 500). AI a MCP predvolene dostanú 25 položiek. Ľudia uvidia všetky.",
      },
    },
    actions: {
      menu: "Možnosti",
      share: "Zdieľať a zarábať",
      addAi: "Pridať AI",
      edit: "Upraviť",
      active: "Aktívny",
      reorder: "Ťahaním zmeníš poradie",
      moveUp: "Posunúť vyššie",
      moveDown: "Posunúť nižšie",
      showMore: "Ďalšie modely ({{count}})",
      showLess: "Zobraziť menej",
      settings: "Nastavenia četu",
    },
    addVariant: "Pridať ďalší model",
    viewSkill: "Detaily",
    deleteVariant: "Odstrániť tento model?",
    deleteVariantAction: "Odobrať",
    deleteGroup: {
      trigger: "Odstrániť zručnosť",
      confirm: "Odstrániť zručnosť aj jej modely ({{count}})?",
      cancel: "Zrušiť",
      action: "Odobrať",
    },
    emptyState: "Zatiaľ nemáš zručnosť. Vyber si jednu a začni četovať.",
    tabs: {
      myFavorites: "Moje zručnosti",
      browseSkills: "Prehliadať zručnosti",
    },
    sections: {
      companion: "Spoločníci",
      skills: "Zručnosti",
      model: "Samotné modely",
      background: "Agenti na pozadí",
    },
    container: {
      title: "Tvoje zručnosti",
      description: "Správa obľúbených konfigurácií zručností a modelov",
    },
    createButton: {
      label: "Preskúmať zručnosti",
    },
    response: {
      favorite: {
        title: "Obľúbené nastavenie",
        id: {
          content: "ID: {{value}}",
        },
        skillId: {
          content: "Zručnosť: {{value}}",
        },
        customVariantName: {
          content: "Názov variantu: {{value}}",
        },
        customIcon: {
          content: "Vlastná ikona: {{value}}",
        },
        voice: {
          content: "Hlas: {{value}}",
        },
        mode: {
          content: "Režim: {{value}}",
        },
        intelligence: {
          content: "Inteligencia: {{value}}",
        },
        modelSelection: {
          title: "Výber modelu",
        },
        selectionType: {
          content: "Typ výberu: {{value}}",
        },
        minIntelligence: {
          content: "Minimálna inteligencia: {{value}}",
        },
        maxIntelligence: {
          content: "Maximálna inteligencia: {{value}}",
        },
        minPrice: {
          content: "Minimálna cena: {{value}}",
        },
        maxPrice: {
          content: "Maximálna cena: {{value}}",
        },
        minContent: {
          content: "Minimálna úroveň moderácie obsahu: {{value}}",
        },
        maxContent: {
          content: "Maximálna úroveň moderácie obsahu: {{value}}",
        },
        content: {
          content: "Úroveň moderácie obsahu: {{value}}",
        },
        preferredStrengths: {
          content: "Uprednostnené prednosti: {{value}}",
        },
        ignoredWeaknesses: {
          content: "Ignorované slabiny: {{value}}",
        },
        manualModelId: {
          content: "Ručne vybraný model: {{value}}",
        },
        position: {
          content: "Poradie: {{value}}",
        },
        color: {
          content: "Farba: {{value}}",
        },
        isActive: {
          content: "Aktívne: {{value}}",
        },
        useCount: {
          content: "Počet použití: {{value}}",
        },
        separator: {
          content: "•",
        },
      },
      hasCompanion: {
        content: "Má spoločníka: {{value}}",
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
        description: "Ak chceš zobraziť obľúbené konfigurácie, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "K tomuto zdroju nemáš prístup.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sa žiadne obľúbené konfigurácie.",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať obľúbené",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny. Po odchode sa stratia.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri spracovaní vašej žiadosti nastal konflikt",
      },
    },
    success: {
      title: "Úspech",
      description: "Obľúbené konfigurácie sa načítali.",
    },
  },
  post: {
    title: "Vytvoriť obľúbenú konfiguráciu",
    description: "Vytvoriť novú obľúbenú konfiguráciu zručnosti",
    container: {
      title: "Nová obľúbená konfigurácia",
      description: "Uložiť konfiguráciu zručnosti medzi obľúbené",
    },
    backButton: {
      label: "Zrušiť",
    },
    useWithoutSavingButton: {
      label: "Použiť bez pridania medzi obľúbené",
      loadingText: "Používa sa nastavenie…",
    },
    submitButton: {
      label: "Pridať medzi obľúbené",
      loadingText: "Pridáva sa…",
    },
    skillId: {
      label: "Zručnosť",
      description: "Vyber zručnosť pre túto obľúbenú konfiguráciu.",
    },
    customVariantName: {
      label: "Názov variantu",
      description:
        "Vlastný názov variantu. Prázdne pole použije predvolený názov zručnosti.",
    },
    customIcon: {
      label: "Vlastná ikona",
      description: "Nepovinná vlastná ikona obľúbenej konfigurácie",
    },
    voice: {
      label: "Hlas",
      description: "Uprednostnený hlas syntézy reči",
    },
    mode: {
      label: "Režim výberu",
      description: "Spôsob výberu modelu",
    },
    modelSelection: {
      title: "Výber modelu",
      description:
        "Vyberte konkrétny model AI alebo nechajte systém vybrať model podľa filtrov.",
    },
    selectionType: {
      label: "Typ výberu",
      manual: "Konkrétny model",
      filters: "Kritériá filtra",
    },
    intelligence: {
      label: "Úroveň inteligencie",
      description: "Najnižšia požadovaná úroveň inteligencie",
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
      description: "Minimálna cena správy v kreditoch",
    },
    maxPrice: {
      label: "Maximálna cena",
      description: "Maximálna cenová úroveň, ktorá sa má použiť",
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
    content: {
      label: "Úroveň moderácie obsahu",
      description: "Úroveň moderácie obsahu",
    },
    preferredStrengths: {
      label: "Uprednostnené prednosti",
      description: "Schopnosti a silné stránky, ktoré má systém uprednostniť",
    },
    ignoredWeaknesses: {
      label: "Ignorované slabiny",
      description: "Slabé stránky modelu, ktoré vám neprekážajú",
    },
    manualModelId: {
      label: "Ručný výber modelu",
      description: "Konkrétny model pre ručný výber",
    },
    response: {
      id: {
        content: "Obľúbená konfigurácia vytvorená. ID: {{value}}",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Skontroluj zadané údaje a skús to znova.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš pridať položku medzi obľúbené, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáš oprávnenie vytvárať obľúbené konfigurácie.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Položka, ktorú chceš pridať medzi obľúbené, neexistuje.",
      },
      server: {
        title: "Chyba servera",
        description: "Položku sa nepodarilo pridať medzi obľúbené.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny. Po odchode sa stratia.",
      },
      conflict: {
        title: "Konflikt",
        description: "Túto konfiguráciu už máš medzi obľúbenými.",
      },
    },
    success: {
      title: "Úspech",
      description: "Konfigurácia sa uložila medzi obľúbené.",
    },
  },
  reorder: {
    post: {
      title: "Zmeniť poradie obľúbených",
      description: "Aktualizovať poradie vašich obľúbených konfigurácií",
      errors: {
        validation: {
          title: "Neplatné poradie",
          description: "Skontroluj poradie a skús to znova.",
        },
        network: {
          title: "Chyba pripojenia",
          description: "Nové poradie sa nepodarilo uložiť. Skús to znova.",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description:
            "Ak chceš zmeniť poradie obľúbených konfigurácií, prihlás sa.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description:
            "Nemáš oprávnenie meniť poradie obľúbených konfigurácií.",
        },
        notFound: {
          title: "Nenašli sa žiadne obľúbené konfigurácie",
          description:
            "Nenašli sa obľúbené konfigurácie, ktorých poradie chceš zmeniť.",
        },
        server: {
          title: "Niečo sa pokazilo",
          description: "Nové poradie sa nepodarilo uložiť. Skús to znova.",
        },
        unknown: {
          title: "Neočakávaná chyba",
          description: "Nastala neočakávaná chyba. Skús to znova.",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Tvoje zmeny sa ešte neuložili.",
        },
        conflict: {
          title: "Konflikt pri zmene poradia",
          description: "Poradie sa zmenilo. Obnov stránku a skús to znova.",
        },
      },
      success: {
        title: "Poradie uložené",
        description: "Nové poradie obľúbených konfigurácií sa uložilo.",
      },
    },
  },
};
