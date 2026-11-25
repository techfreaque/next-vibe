// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/sk";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "Obrázok",
    generation: "Tvorba",
    ai: "AI",
  },
  post: {
    title: "Vytvoriť obrázok",
    titleShort: "Vytvoriť obrázok",
    dynamicTitle: "Obrázok: {{prompt}}",
    description:
      "Vytvorí obrázok podľa textového zadania. V nástroji models s parametrom modelType=image nájdeš dostupné modely a ich možnosti. Zadaj ID modelu alebo nechaj pole prázdne pre predvolený model používateľa. Parametrom aspectRatio (napr. 16:9) nastavíš formát na šírku alebo na výšku. Cez inputMediaUrl môžeš zadať adresu obrázkovej predlohy. Výsledok obsahuje imageUrl, skutočnú šírku a výšku obrázka a pomer strán outputAspectRatio.",
    form: {
      title: "Tvorba obrázkov",
      description: "Zadaj, aký obrázok chceš vytvoriť.",
    },
    prompt: {
      label: "Zadanie",
      description: "Opíš, ako má obrázok vyzerať.",
      placeholder: "Fotorealistický západ slnka nad horským jazerom…",
    },
    model: {
      label: "Model",
      description:
        "ID modelu na tvorbu obrázkov. Ak pole necháš prázdne, použije sa predvolený model používateľa. Dostupné modely nájdeš v nástroji models (modelType=image).",
    },
    approxCost: "~kreditov",
    size: {
      label: "Veľkosť",
      description: "Vyber rozmery výsledného obrázka.",
      square1024: "Štvorec (1024 × 1024)",
      landscape1792: "Na šírku (1792 × 1024)",
      portrait1792: "Na výšku (1024 × 1792)",
    },
    quality: {
      label: "Kvalita",
      description: "Vyber kvalitu výsledného obrázka.",
      standard: "Štandard",
      hd: "HD",
    },
    aspectRatio: {
      label: "Pomer strán",
      description:
        "Pomer strán môže byť 16:9 alebo 21:9 na šírku, 9:16 na výšku, prípadne 4:3, 3:4, 3:2, 2:3 či 1:1. Ak pole necháš prázdne, vytvorí sa štvorcový obrázok. Model použije najbližší podporovaný pomer. Pri opise výsledku sa riaď skutočnou šírkou, výškou a pomerom strán vo výstupe.",
    },
    inputMediaUrl: {
      label: "URL referenčného obrázka",
      description:
        "Adresa obrázka, ktorý má model upraviť alebo štylizovať. Funguje iba s modelmi, ktoré prijímajú obrázky.",
      placeholder: "https://example.com/image.jpg",
    },
    download: "Stiahnuť",
    dimensionSeparator: "×",
    backButton: {
      label: "Späť",
    },
    submitButton: {
      text: "Vytvoriť obrázok",
      label: "Vytvoriť obrázok",
      loadingText: "Vytvára sa…",
    },
    response: {
      imageUrl: "URL vytvoreného obrázka",
      creditCost: "Spotrebované kredity",
      jobId: "ID asynchrónnej úlohy",
      width: "Šírka (px)",
      height: "Výška (px)",
      outputAspectRatio: "Pomer strán",
    },
    errors: {
      referenceUnavailable:
        "Obrázková predloha už nie je dostupná. Mohla byť odstránená alebo môže patriť do chatu, ku ktorému nemáš prístup. Použi obrázok z tohto chatu alebo ho nahraj znova.",
      validation_failed: {
        title: "Chyba overenia",
        description: "Skontroluj zadanie a nastavenia.",
      },
      network_error: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k službe na tvorbu obrázkov.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš vytvárať obrázky, prihlás sa.",
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
        description: "Pri tvorbe obrázka nastala neočakávaná chyba.",
      },
      unknown_error: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsaved_changes: {
        title: "Neuložené zmeny",
        description: "Pred vytvorením obrázka si ulož zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri tvorbe obrázka nastal konflikt.",
      },
      notAnImageModel:
        "Vybraný model nevie vytvárať obrázky. Zvoľ model na tvorbu obrázkov.",
      notConfigured:
        "Chýba konfigurácia služby {{label}}. Pridaj {{envKey}} do súboru .env. Kľúč získaš na {{url}}.",
      providerUnavailable:
        "Služba {{label}} je dočasne nedostupná. Iný model si môžeš vybrať na {{url}}.",
      insufficientCredits:
        "Nedostatok kreditov. Zostatok: {{balance}}. Potrebné množstvo: {{minimum}}.",
      balanceCheckFailed: "Nepodarilo sa overiť zostatok kreditov",
      unsupportedSize:
        "Model {{model}} nepodporuje veľkosť {{size}}. Podporované veľkosti: {{supported}}",
      unsupportedQuality:
        "Model {{model}} nepodporuje kvalitu {{quality}}. Dostupné úrovne kvality: {{supported}}",
      unsupportedAspectRatio:
        "Model {{model}} nepodporuje pomer strán {{aspectRatio}}. Podporované pomery: {{supported}}",
      modelNoReferenceImage:
        "Model {{model}} neprijíma obrázkové predlohy. Ak chceš použiť predlohu, vyber model na úpravu obrázkov, ktorý medzi vstupmi uvádza image.",
      generationFailed: "Obrázok sa nepodarilo vytvoriť.",
      generationFailedWithReason: "Obrázok sa nepodarilo vytvoriť: {{error}}",
      contentRejected:
        "Filter poskytovateľa odmietol zadanie: {{error}}. Skús ho preformulovať alebo vyber model bez cenzúry. Kredity sa ti neodpočítali.",
      providerOutage:
        "Poskytovateľ obrázkov má výpadok alebo je preťažený: {{error}}. Skús to znova o minútu alebo vyber iný model. Kredity sa ti neodpočítali.",
      providerError: "Chyba služby na tvorbu obrázkov: {{error}}",
      noImageUrl: "Poskytovateľ nevrátil adresu obrázka.",
      noImageGenerated:
        "Model nevrátil obrázok. Mohol odmietnuť zadanie, napríklad pre zbrane, skutočné osoby alebo postavy chránené autorským právom, alebo daný typ požiadavky nepodporuje. Skús zadanie preformulovať alebo vyber iný model. Tento model tvorí obrázky len z textu a obrázkové predlohy nevyužíva. Kredity sa ti neodpočítali.",
      creditsFailed: "Kredity za vytvorenie obrázka sa nepodarilo odpočítať.",
      apiKeyNotConfigured: "Nie je nastavený kľúč API.",
      externalServiceError: "Chyba externej služby: {{message}}",
      requestAborted: "Požiadavka sa zrušila.",
      requestTimedOut: "Čas na vytvorenie obrázka vypršal.",
      requestFailed: "Požiadavka zlyhala: {{message}}",
      pollFailed: "Požiadavka na zistenie stavu zlyhala s kódom {{status}}.",
      nonJsonResponse:
        "Poskytovateľ vrátil odpoveď v inom formáte ako JSON (HTTP {{status}}): {{body}}",
    },
    success: {
      title: "Obrázok je hotový",
      description: "Obrázok sa podarilo vytvoriť",
    },
  },
  models: {
    selector: {
      bestForFilter: "Najlepšie zodpovedá filtru",
      setupRequired: "Vyžaduje nastavenie",
      providerUnconfigured: "Chýba kľúč API poskytovateľa",
      addEnvKey: "Pridať do súboru .env",
      noMatchingModels: "Tvojim filtrom nezodpovedá žiadny model",
      noModelsWarning:
        "Žiadny model nezodpovedá filtrom. Uprav nastavenia a skús to znova.",
      allModelsCount: "Dostupné modely ({{count}})",
      filteredModelsCount: "Zodpovedajúce modely ({{count}})",
      showAllModels: "Zobraziť všetky modely ({{count}})",
      showFiltered: "Zobraziť filtrované modely",
      creditsExact: "Kredity: {{cost}}",
      creditsSingle: "1 kredit",
      free: "Bezplatne",
      autoSelectedModel: "Podľa filtrov:",
      manualSelectedModel: "Vybrané:",
      skillSelectedModel: "Model zručnosti:",
      selectModelBelow: "Vyber model zo zoznamu",
      sortBy: "Zoradiť podľa",
      sortThen: "Potom:",
      showLess: "Zobraziť menej",
      showMore: "Zobraziť ďalšie položky ({{count}})",
      showLegacyModels: "Zobraziť staršie modely ({{count}})",
      autoMode: "Podľa filtrov",
      manualMode: "Ručný výber",
      skillMode: "Predvolený model zručnosti",
      autoModeDescription:
        "Automaticky vyberie model, ktorý najlepšie zodpovedá filtrom.",
      manualModeDescription: "Vyber si ľubovoľný model.",
      characterBasedModeDescription:
        "Použije model, pre ktorý táto zručnosť vznikla.",
      typeChat: "Chat",
      typeImage: "Obrázok",
      typeVideo: "Video",
      typeAudio: "Zvuk",
      filters: "Filtre",
      filtersActive: "Filtre ({{count}})",
      clearFilter: "Vymazať",
      inherited: "Zdedené",
      platformDefault: "Predvolené",
      searchPlaceholder: "Hľadať modely…",
      noSearchResults: "Pre „{{query}}“ sa nenašiel žiadny model",
      searchExtrasGroup: "Mimo aktuálnych filtrov",
    },
    tiers: {
      intelligence: {
        quick: "Rýchly",
        smart: "Inteligentný",
        brilliant: "Pokročilý",
        quickDesc: "Rýchla a úsporná odpoveď",
        smartDesc: "Vyvážená kvalita",
        brilliantDesc: "Hĺbkové uvažovanie",
      },
      price: {
        cheap: "Úsporné",
        standard: "Štandard",
        premium: "Prémiové",
        cheapDesc: "0 až 3 kredity za správu",
        standardDesc: "3 až 9 kreditov za správu",
        premiumDesc: "9 a viac kreditov za správu",
      },
      content: {
        mainstream: "Bežné modely",
        open: "Otvorené modely",
        uncensored: "Bez cenzúry",
        mainstreamDesc: "Štandardné filtre",
        openDesc: "Menej obmedzení",
        uncensoredDesc: "Žiadne obmedzenia",
      },
    },
    sort: { intelligence: "Inteligencia", price: "Cena", content: "Obsah" },
    ranges: {
      intelligenceRange: {
        minLabel: "Minimálna inteligencia",
        maxLabel: "Maximálna inteligencia",
      },
      priceRange: { minLabel: "Minimálna cena", maxLabel: "Maximálna cena" },
      contentRange: {
        minLabel: "Minimálna úroveň filtrovania obsahu",
        maxLabel: "Maximálna úroveň filtrovania obsahu",
      },
    },
    credits: { credit: "{{count}} kredit", credits: "Kredity: {{count}}" },
    creditDisplay: {
      badge: {
        approxPerMsg: "Kredity za správu: ≈ {{cost}}",
        exactPerMsg: "Kredity za správu: {{cost}}",
        perImg: "Kredity za obrázok: {{cost}}",
        perClip: "Kredity za klip: {{cost}}",
        ratePerChar: "Kredity za znak: {{rate}}",
        ratePerSec: "Kredity za sekundu: {{rate}}",
        approxChars: "Znaky: ≈ {{count}}",
        seconds: "{{count}} s",
        lessThanMin: "< 0,1",
      },
      tokenBased: {
        header: "Cena za správu",
        costRangeLabel: "Bežný rozsah v kreditoch:",
        costRangeValue: "{{min}} až {{max}}",
        examplesLabel: "Príklady:",
        examples: {
          short: "Krátky rozhovor",
          medium: "Stredne dlhý rozhovor",
          long: "Dlhý rozhovor",
        },
        triggersCompacting: "⚡ Spustí automatické zhrnutie",
        tokensCount: "Počet tokenov: {{count}}",
        explanation: "AI pri každej správe spracúva celú históriu rozhovoru.",
        compactingLabel: "✨ Automatické zhrnutie:",
        compactingExplanation:
          " Po dosiahnutí limitu tokenov ({{threshold}}) sa staršie správy automaticky zhrnú.",
      },
      fixed: {
        title: "Cena modelu {{model}}",
        freeDescription: "Tento model nečerpá kredity.",
        fixedDescription: "Cena za správu je pevná bez ohľadu na jej dĺžku.",
        costPerMessage: "Cena za správu:",
        freeExplanation: "Model je bezplatný a nemá limit používania.",
        freeHighlight: "Hodí sa na testovanie a skúšanie.",
        simpleLabel: "Pevná cena:",
        simpleExplanation: " Krátke aj dlhé správy stoja rovnako.",
      },
      media: {
        perImage: "za obrázok",
        perClip: "za klip",
        perSecond: "za sekundu",
        perClipDuration: "za klip ({{duration}} s)",
        costPerImage: "Cena za obrázok:",
        costPerClip: "Cena za klip:",
        costPerSecond: "Cena za sekundu:",
        imageDescription:
          "Cena za vytvorený obrázok je pevná pri každom rozlíšení.",
        clipDescription: "Cena za vytvorený zvukový klip je pevná.",
        videoDescription:
          "Účtujeme za každú sekundu vytvoreného videa. Predvolená dĺžka: {{duration}} s.",
        ttsDescription: "Účtujeme za každý znak prevedený na reč.",
        ttsPricing: "Sadzba:",
        ttsScenarios: {
          short: "Krátka veta",
          medium: "Bežná správa",
          long: "Dlhý článok",
        },
        ttsExample:
          "Správa so 100 slovami (asi 600 znakov). Cena v kreditoch: ≈ {{count}}.",
        sttDescription: "Účtujeme za každú sekundu prepísaného zvuku.",
        sttPricing: "Sadzba:",
        sttScenarios: {
          short: "Krátka hlasová poznámka",
          medium: "Hlasová správa",
          long: "Celá minúta",
        },
        sttExample: "Minútová nahrávka. Cena v kreditoch: ≈ {{count}}.",
        costPerChar: "Cena za znak:",
        costPerClipMusic: "Cena za klip:",
        videoBreakdown:
          "Kredity: {{costPerSecond}} za sekundu × {{duration}} s = {{total}}",
        imageHeader: "Cena za vytvorenie obrázka",
        videoHeader: "Cena za vytvorenie videa",
        musicHeader: "Cena za vytvorenie hudby",
        ttsHeader: "Cena za prevod textu na reč",
        sttHeader: "Cena za prepis reči na text",
      },
      creditValue: "1 kredit = {{value}}",
    },
    modelUtilities: {
      adultExplicit: "Explicitný obsah pre dospelých",
      adultImplied: "Náznakový obsah pre dospelých",
      analysis: "Analýza",
      chat: "Chat",
      coding: "Programovanie",
      conspiracy: "Konšpiračné teórie",
      controversial: "Kontroverzné témy",
      creative: "Tvorivé písanie",
      fast: "Rýchla odozva",
      harmful: "Potenciálne škodlivý obsah",
      illegalInfo: "Informácie o nezákonnej činnosti",
      imageGen: "Tvorba obrázkov",
      musicGen: "Tvorba hudby",
      tts: "Prevod textu na reč",
      stt: "Prepis reči na text",
      videoGen: "Tvorba videa",
      legacy: "Starší model",
      medicalAdvice: "Lekárske rady",
      offensiveLanguage: "Urážlivé výrazy",
      politicalLeft: "Ľavicové politické názory",
      politicalRight: "Pravicové politické názory",
      reasoning: "Pokročilé uvažovanie",
      roleplay: "Hranie rolí",
      roleplayDark: "Hranie rolí s temnými motívmi",
      smart: "Inteligentný",
      uncensored: "Bez cenzúry",
      violence: "Násilie",
      vision: "Rozpoznávanie obrazu",
    },
    names: modelTranslations.names,
  },
};
