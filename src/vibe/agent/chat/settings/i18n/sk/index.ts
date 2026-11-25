// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/sk";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    settings: "Nastavenia",
  },
  voices: {
    MALE: "Mužský hlas",
    FEMALE: "Ženský hlas",
  },
  enums: {
    viewMode: {
      linear: "Lineárne",
      threaded: "Vo vláknach",
      flat: "Ploché",
      debug: "Ladenie",
    },
    provider: {
      AUTO: "Automaticky",
      BRAVE: "Brave",
      KAGI: "Kagi",
    },
  },
  get: {
    title: "Nastavenia",
    titleShort: "Nastavenia četu",
    description: "Načítaj nastavenia a predvoľby četu používateľa",
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na prístup k nastaveniam sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie pristupovať k tomuto zdroju",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nastavenia sa nenašli",
      },
      server: {
        title: "Chyba servera",
        description: "Pri načítaní nastavení došlo k chybe",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Došlo ku konfliktu s aktuálnym stavom",
      },
    },
    success: {
      title: "Hotovo",
      description: "Nastavenia sa načítali",
    },
  },
  post: {
    title: "Uložiť nastavenia",
    titleShort: "Uložiť nastavenia",
    description: "Uprav nastavenia a predvoľby četu používateľa",
    container: {
      title: "Nastavenia četu",
    },
    selectedModel: {
      label: "Vybraný model",
    },
    selectedSkill: {
      label: "Vybraná zručnosť",
    },
    activeFavoriteId: {
      label: "Aktívna obľúbená položka",
    },
    ttsAutoplay: {
      label: "Automatické čítanie nahlas",
    },
    viewMode: {
      label: "Režim zobrazenia",
    },
    contextMemory: {
      title: "Rozsah pamäte konverzácie",
      description:
        "Koľko z konverzácie si AI pamätá, kým začne staršie správy sumarizovať.",
      costNote: "Menší rozsah stojí menej",
      costExplain: "Do istej miery. Kratšia pamäť znižuje cenu za správu.",
      tooltipTitle: "Koľko z histórie konverzácie si AI ponechá",
      tooltipBody:
        "Keď konverzácia prekročí tento limit, staršie správy sa automaticky zhrnú. AI si zachová súvislosti a spotrebuje menej tokenov, takže klesne aj cena.",
      tooltipModelCap: "Aktuálny model podporuje až {cap} tokenov.",
      default: "predvolené",
      tokens: "tokeny",
      modelMax: "maximum modelu",
      resetToDefault: "Obnoviť predvolenú hodnotu ({value})",
      cheaper: "nižšia cena",
      moreMemory: "dlhšia pamäť",
      barCheap: "Nižšia cena · kratšia pamäť",
      barBalanced: "Rovnováha medzi cenou a pamäťou",
      barRich: "Dlhšia pamäť · vyššia cena",
      barMax: "Najdlhšia pamäť · najvyššia cena",
      tools: "Nástroje",
      toolsInherited: "zdedené",
    },
    turnStepLimit: {
      save: "Uložiť",
      label: "Kroky na jedno kolo",
      description:
        "Koľko kôl volania nástrojov môže AI vykonať, kým sa pozastaví. Vyber hodnotu od 5 do 500.",
    },
    searchProvider: {
      label: "Vyhľadávač",
      description:
        "Vyber vyhľadávač na webe. Pri automatickom výbere sa použije Brave, ak je nastavený, inak Kagi.",
    },
    codingAgent: {
      label: "Programovací agent",
      description:
        "Určuje, ktorého agenta príkazového riadka AI použije pri volaní nástroja na programovanie. Nastavenie môžu meniť len správcovia.",
      options: {
        claudeCode: "Claude Code (predvolené)",
        openCode: "OpenCode",
        nextVibeCoder: "Next Vibe Coder",
      },
    },
    dreaming: {
      title: "Snívanie",
      description:
        "Kým spíš, AI zlučuje spomienky, upratuje dokumenty a vyberá to podstatné.",
      toggle: {
        label: "Zapnúť snívanie",
      },
      schedule: {
        label: "Harmonogram",
        options: {
          nightlyAt2: "Každú noc o 2:00",
          weekdaysAt2: "V pracovné dni o 2:00",
          weekdaysAt8: "V pracovné dni o 8:00",
          every6h: "Každých 6 hodín",
          every12h: "Každých 12 hodín",
        },
      },
      favoriteId: {
        label: "Obľúbená položka",
        defaultOption: "Predvolené (Thea)",
      },
      prompt: {
        label: "Pokyny pre reláciu",
        placeholder:
          "Na čo sa má Thea v tejto relácii zamerať? Ak chceš použiť predvolené pokyny, nechaj pole prázdne.",
        defaultPrompt:
          "Spusť reláciu snívania. Usporiadaj a zlúč obsah kortexu: spomienky, dokumenty a konverzácie. Zanechaj v nich poriadok.",
      },
      lastRun: "Posledné spustenie:",
      neverRun: "Zatiaľ sa nespustilo",
      folderLink: "Otvoriť priečinok Dreams",
      sessionCost:
        "Limit relácie je {{steps}} krokov. Relácia sa zastaví po prekročení limitu {{cap}} kreditov.",
      runNow: "Spustiť teraz",
    },
    autopilot: {
      title: "Autopilot",
      description:
        "Keď si preč, AI pokračuje v rozpracovaných projektoch a vybavuje úlohy vo fronte.",
      toggle: {
        label: "Zapnúť autopilota",
      },
      schedule: {
        label: "Harmonogram",
        options: {
          nightlyAt2: "Každú noc o 2:00",
          weekdaysAt2: "V pracovné dni o 2:00",
          weekdaysAt8: "V pracovné dni o 8:00",
          every6h: "Každých 6 hodín",
          every12h: "Každých 12 hodín",
        },
      },
      favoriteId: {
        label: "Obľúbená položka",
        defaultOption: "Predvolené (Thea)",
      },
      prompt: {
        label: "Pokyny pre reláciu",
        placeholder:
          "Na čo sa má Hermes v tejto relácii zamerať? Ak chceš použiť predvolené pokyny, nechaj pole prázdne.",
        defaultPrompt:
          "Spusť reláciu autopilota. Nadviaž na rozpracované projekty, vykonaj ďalšie kroky a vybav úlohy vo fronte.",
      },
      lastRun: "Posledné spustenie:",
      neverRun: "Zatiaľ sa nespustilo",
      folderLink: "Otvoriť priečinok Autopilot",
      sessionCost:
        "Limit relácie je {{steps}} krokov. Relácia sa zastaví po prekročení limitu {{cap}} kreditov.",
      runNow: "Spustiť teraz",
    },
    mama: {
      title: "Pravidelná kontrola platformy",
      description:
        "Thea sleduje produkčnú inštanciu. Kontroluje jej stav, pracuje na funkciách, venuje sa marketingu a posiela novinky. Všetci správcovia používajú to isté nastavenie.",
      toggle: {
        label: "Zapnúť režim Mama",
      },
      schedule: {
        label: "Harmonogram",
        options: {
          every4h: "Každé 4 hodiny",
          every6h: "Každých 6 hodín",
          every12h: "Každých 12 hodín",
          daily: "Denne o polnoci",
        },
      },
      prompt: {
        label: "Pokyny pre reláciu",
        placeholder:
          "Na čo sa má Thea zamerať? Ak chceš použiť predvolené pokyny, nechaj pole prázdne.",
        defaultPrompt:
          "Spusť reláciu v režime Mama. Skontroluj stav platformy a denníky chýb, pokračuj v rozpracovaných funkciách a priprav potrebné oznámenia. Súhrn ulož do /documents/mama/log/.",
      },
      lastRun: "Posledné spustenie:",
      neverRun: "Zatiaľ sa nespustilo",
      runNow: "Spustiť teraz",
    },
    webPinnedTools: {
      label: "Pripnuté nástroje na bočnom paneli webu",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané nastavenia sú neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "Nastavenia sa nepodarilo uložiť",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na úpravu nastavení sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie upraviť nastavenia",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nastavenia sa nenašli",
      },
      server: {
        title: "Chyba servera",
        description: "Nastavenia sa nepodarilo uložiť",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Došlo ku konfliktu nastavení",
      },
    },
    success: {
      title: "Nastavenia boli uložené",
      description: "Tvoje nastavenia sa uložili",
    },
  },
  patch: {
    chatModel: {
      label: "Model četu",
      placeholder: "Predvolené nastavenie systému",
    },
  },
  models: { names: modelTranslations.names },
};
