import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    models: "Modely",
  },
  endpointCategories: {
    ai: "AI",
  },
  enums: {
    modelType: {
      text: "Text",
      image: "Obrázok",
      video: "Video",
      audio: "Zvuk",
    },
    content: {
      mainstream: "Bežné modely",
      open: "Otvorené modely",
      uncensored: "Bez cenzúry",
    },
    intelligence: {
      quick: "Rýchly",
      smart: "Inteligentný",
      brilliant: "Pokročilý",
    },
  },
  get: {
    title: "Modely",
    titleShort: "Modely AI",
    description:
      "Prehľad všetkých modelov AI. Filtrujte podľa typu (text, obrázok, video, zvuk), úrovne filtrovania obsahu a inteligencie. Pri modeloch na tvorbu videa uvádza supportedDurations podporované dĺžky v sekundách, supportedAspectRatios pomery strán a supportedFrameImages podporované vstupné snímky. first_frame slúži na animáciu počiatočného obrázka, last_frame určuje záverečný obrázok. allowedPassthroughParameters uvádza ďalšie voľby modelu (napr. negative_prompt a cfg_scale) a generateAudio informuje, či model vytvára aj zvuk. Pri volaní generate_video zadajte ID modelu v parametri model.",
    dynamicTitle: "Počet modelov: {{count}}",

    fields: {
      query: {
        label: "Hľadať",
        description:
          "Filtrovať podľa názvu, poskytovateľa alebo schopnosti. Príklady vyhľadávania: coding, uncensored, image, fast.",
        placeholder: "Napr. GPT, Gemini, coding, uncensored…",
      },
      modelType: {
        label: "Typ",
        description:
          "Filtrovať podľa typu modelu: text (čet alebo LLM), image (tvorba obrázkov), video alebo audio (syntéza reči, prepis či hudba). Prázdne pole zobrazí všetky typy.",
        placeholder: "Všetky typy",
      },
      contentLevel: {
        label: "Úroveň obsahu",
        description:
          "Filtrovať podľa pravidiel obsahu: mainstream (bežné bezpečnostné filtre), open (menej obmedzení) alebo uncensored (bez filtrov).",
        placeholder: "Všetky úrovne obsahu",
      },
      intelligence: {
        label: "Inteligencia",
        description:
          "Minimálna úroveň inteligencie: quick (rýchlosť a efektivita), smart (vyvážená kvalita) alebo brilliant (hĺbkové uvažovanie).",
        placeholder: "Akákoľvek inteligencia",
      },
      page: {
        label: "Strana",
        description: "Číslo stránky, počítané od 1.",
      },
      pageSize: {
        label: "Veľkosť stránky",
        description:
          "Počet modelov na stránku (predvolená hodnota 50, max 200).",
      },
    },

    response: {
      models: "Modely",
      totalCount: "Spolu",
      matchedCount: "Nájdené",
      currentPage: "Strana",
      totalPages: "Stránky",
      hint: "Nápoveda",
      model: {
        id: "ID modelu",
        name: "Názov",
        provider: "Poskytovateľ",
        type: "Typ",
        description: "Opis",
        contextWindow: "Kontext",
        parameterCount: "Parametre",
        intelligence: "Inteligencia",
        content: "Obsah",
        price: "Cena (kredity)",
        supportsTools: "Nástroje",
        utilities: "Schopnosti",
        inputs: "Vstupy",
        outputs: "Výstupy",
        supportedDurations: "Trvanie (s)",
        supportedAspectRatios: "Pomery strán",
        supportedResolutions: "Rozlíšenia",
        supportedFrameImages: "Typy referenčných snímok",
        generateAudio: "Generuje zvuk",
        supportedSizes: "Presné veľkosti",
        allowedPassthroughParameters: "Ďalšie parametre",
      },
    },

    errors: {
      server: {
        title: "Chyba servera",
        description:
          "Zlyhalo získanie zoznamu modelov. Prosím skúste to znova.",
      },
      network: {
        title: "Chyba siete",
        description:
          "Sieťové pripojenie zlyhalo. Prosím skontrolujte si pripojenie.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre filtra.",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Musíte byť prihlásený pre zobrazenie modelov.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáte povolenie na prístup k tomuto zdroju.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sme žiadne modely.",
      },
      conflict: {
        title: "Konflikt",
        description: "Žiadaj konflikt.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
    },

    success: {
      title: "Načítané modely",
      description: "Zoznam modelov AI sa načítal.",
    },

    browser: {
      subtitle:
        "Všetky modely platformy s cenou, kontextovým oknom a úrovňou obsahu.",
      emptyTitle: "Týmto filtrom nezodpovedá žiadny model",
      emptyHint:
        "Vyberte iný typ alebo úroveň obsahu, alebo vymažte vyhľadávanie.",
      clearFilters: "Zrušiť filtre",
      toolCalls: "Volania nástrojov",
      context: "Kontext {{size}}",
      supportsTools: "✓ nástroje",
      noModels: "Žiadne modely sa nezhodujú s vašimi filtrami.",
      allLabel: "Všetky",
      statsLabel: "{{matched}} z {{total}} modelov",
      free: "Bezplatne",
      credits: "približne {{cost}} kreditov",
      ctx: "ctx",
    },
  },
};
