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

  post: {
    title: "Vytvoriť obľúbenú konfiguráciu",
    titleShort: "Pridať medzi obľúbené",
    description: "Vytvoriť novú obľúbenú konfiguráciu zručnosti",
    container: {
      title: "Nová obľúbená konfigurácia",
      description: "Uložiť konfiguráciu zručnosti medzi obľúbené",
    },
    backButton: {
      label: "Späť k obľúbeným",
    },
    submitButton: {
      label: "Vytvoriť obľúbenú konfiguráciu",
      loadingText: "Vytvára sa…",
    },
    addModeButton: {
      label: "Pridať režim",
      loadingText: "Pridávam...",
    },
    useWithoutSavingButton: {
      label: "Použiť bez uloženia",
      loadingText: "Používa sa nastavenie…",
    },
    skillId: {
      label: "Zručnosť",
      description:
        'ID zručnosti v spoločnom formáte: "skillSlug" pre predvolený variant, "skillSlug__variantId" pre konkrétny variant, napríklad "thea__brilliant". Dostupné ID zobrazíš pomocou skills.',
    },
    customVariantName: {
      label: "Označenie",
      description:
        "Vlastný názov variantu. Prázdne pole použije predvolený názov zručnosti.",
    },
    customIcon: {
      label: "Vlastná ikona",
      description: "Nepovinná vlastná ikona obľúbenej konfigurácie",
    },
    chatModel: {
      label: "Model pre čet",
      placeholder: "Podľa zručnosti",
    },
    voice: {
      label: "Hlas",
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
        "Vlastný model na analýzu obrázkov. Hodnota null použije globálne nastavenie používateľa.",
      placeholder: "Podľa zručnosti",
    },
    videoVisionModel: {
      label: "Model na analýzu videa",
      description:
        "Vlastný model na analýzu videa. Hodnota null použije globálne nastavenie používateľa.",
      placeholder: "Podľa zručnosti",
    },
    audioVisionModel: {
      label: "Model na analýzu zvuku",
      description:
        "Vlastný model na analýzu zvuku. Hodnota null použije globálne nastavenie používateľa.",
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
        "Vlastný model na tvorbu videa. Hodnota null použije videoGenModelSelection zručnosti. Pri tvorbe médií má zručnosť prednosť.",
      placeholder: "Podľa zručnosti",
    },
    mode: {
      label: "Režim výberu",
      description: "Spôsob výberu modelu",
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
    icon: {
      label: "Vlastná ikona",
      description: "Vlastná ikona tejto obľúbenej konfigurácie",
    },
    compactTrigger: {
      label: "Hranica na skrátenie kontextu (tokeny)",
      description:
        "Počet tokenov, pri ktorom sa má rozhovor zhrnúť. Hodnota null použije nastavenie zručnosti alebo globálne nastavenie.",
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
    changeSkill: {
      label: "Zmeniť zručnosť",
    },
    modifySkill: {
      label: "Zmeniť zručnosť",
    },
    character: {
      name: "Názov",
      tagline: "Slogan",
      description: "Opis",
    },
  },
};
