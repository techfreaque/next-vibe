import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    titleShort: "Obľúbené",
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
    titleShort: "Upraviť obľúbenú konfiguráciu",
    description: "Aktualizovať existujúcu obľúbenú konfiguráciu",
    container: {
      title: "Upraviť nastavenie zručnosti",
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
    reportButton: {
      label: "Nahlásiť",
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
      label: "Označenie",
      description:
        "Vlastný názov variantu. Prázdne pole použije predvolený názov zručnosti.",
    },
    chatModel: {
      label: "Model pre čet",
      placeholder: "Podľa zručnosti",
    },
    voice: {
      label: "Hlas AI",
      description:
        "Vlastný hlas na prevod textu na reč pre túto obľúbenú konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
      placeholder: "Podľa zručnosti",
    },
    sttModel: {
      label: "Model na prepis reči",
      description:
        "Model na rozpoznávanie reči. Hodnota null použije globálne nastavenie používateľa. Vlastný model vyberte iba pre špecializovaný prepis.",
      placeholder: "Podľa zručnosti",
    },
    imageVisionModel: {
      label: "Model na analýzu obrázkov",
      description:
        "Vyber konkrétny model na analýzu obrázkov pre túto konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
      placeholder: "Podľa zručnosti",
    },
    videoVisionModel: {
      label: "Model na analýzu videa",
      description:
        "Model na analýzu videa pre túto konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
      placeholder: "Podľa zručnosti",
    },
    audioVisionModel: {
      label: "Model na analýzu zvuku",
      description:
        "Model na analýzu zvuku pre túto konfiguráciu. Hodnota null použije globálne nastavenie používateľa.",
      placeholder: "Podľa zručnosti",
    },
    imageGenModel: {
      label: "Model na tvorbu obrázkov",
      description:
        "Vlastný model na tvorbu obrázkov pre túto konfiguráciu. Hodnota null použije imageGenModelSelection zručnosti. Zručnosť má pri tvorbe médií prednosť. Vyplňte pole, ak chcete použiť iný model.",
      placeholder: "Podľa zručnosti",
    },
    musicGenModel: {
      label: "Model na tvorbu hudby",
      description:
        "Vlastný model na tvorbu hudby pre túto konfiguráciu. Hodnota null použije musicGenModelSelection zručnosti. Pri tvorbe médií má zručnosť prednosť.",
      placeholder: "Podľa zručnosti",
    },
    videoGenModel: {
      label: "Model na tvorbu videa",
      description:
        "Vlastný model na tvorbu videa pre túto konfiguráciu. Hodnota null použije videoGenModelSelection zručnosti. Pri tvorbe médií má zručnosť prednosť.",
      placeholder: "Podľa zručnosti",
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
    titleShort: "Odstrániť obľúbenú konfiguráciu",
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
};
