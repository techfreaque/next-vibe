/**
 * Desktop API translations (Slovak)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  "take-screenshot": {
    title: "Zachytiť snímku pracovnej plochy",
    titleShort: "Snímka obrazovky",
    dynamicTitle: "Snímka: {{target}}",
    description: "Zachytí snímku pracovnej plochy alebo výrezu obrazovky",
    form: {
      label: "Zachytiť snímku",
      capturing: "Zachytáva sa…",
      refresh: "Zachytiť znova",
      description: "Zachytí celú pracovnú plochu alebo zadaný výrez",
      fields: {
        outputPath: {
          label: "Cesta výstupu",
          description:
            "Absolútna cesta na uloženie snímky. Bez nej sa údaje Base64 vrátia priamo v odpovedi.",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "Index obrazovky",
          description:
            "Index obrazovky alebo monitora (0 = hlavný). Ak je to možné, uprednostnite monitorName.",
          placeholder: "0",
        },
        monitorName: {
          label: "Názov monitora",
          description:
            "Výstupný názov monitora, napríklad DP-1 alebo HDMI-1. Dostupné názvy vypíše list-monitors.",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "Maximálna šírka",
          description:
            "Širšia snímka sa zmenší na túto šírku. Hodí sa pri práci s AI, pretože snímky zo štyroch monitorov sú veľké.",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "Snímka sa úspešne zachytila",
      imagePath: "Cesta k uloženej snímke",
      imageData: "Snímka PNG zakódovaná v Base64",
      imageUrl: "Adresa URL snímky",
      width: "Šírka snímky v pixeloch",
      height: "Výška snímky v pixeloch",
      monitorName: "Monitor, z ktorého pochádza snímka",
      originalWidth: "Pôvodná šírka pred zmenšením",
      originalHeight: "Pôvodná výška pred zmenšením",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri zachytávaní snímky nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie zachytávať snímky pracovnej plochy",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Zachytávanie snímok pracovnej plochy nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri zachytávaní snímky nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri zachytávaní snímky nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri zachytávaní snímky nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Snímka zachytená",
      description: "Snímka pracovnej plochy sa úspešne zachytila",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      captureAutomation: "Automatizácia snímania",
    },
  },
  "get-accessibility-tree": {
    title: "Získať strom prístupnosti",
    titleShort: "Strom prístupnosti",
    dynamicTitle: "Prístupnosť: {{app}}",
    description:
      "Získa strom prístupnosti aktívneho okna alebo zadanej aplikácie",
    form: {
      label: "Získať strom prístupnosti",
      description:
        "Načíta strom prístupnosti AT-SPI na kontrolu rozhrania pracovnej plochy",
      fields: {
        appName: {
          label: "Názov aplikácie",
          description:
            "Názov procesu alebo titulok cieľového okna. Pri prázdnom poli sa použije aktívne okno.",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "Maximálna hĺbka",
          description: "Maximálna hĺbka prehľadávania stromu (predvolene 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "Zahrnúť akcie",
          description:
            "Zobrazí dostupné akcie každého uzla (kliknutie, stlačenie, aktivácia a ďalšie). Výstup bude podrobnejší a väčší.",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Strom prístupnosti sa úspešne načítal",
      tree: "Strom prístupnosti ako štruktúrovaný text",
      nodeCount: "Celkový počet prejdených uzlov",
      truncated: "Ukazuje, či uplynul časový limit a výstup môže byť neúplný",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní stromu prístupnosti nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie pristupovať k stromu prístupnosti",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup k stromu prístupnosti nie je povolený",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Cieľová aplikácia alebo okno sa nenašli",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní stromu prístupnosti nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní stromu prístupnosti nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní stromu prístupnosti nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Strom prístupnosti načítaný",
      description: "Strom prístupnosti sa úspešne načítal",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      accessibilityAutomation: "Automatizácia prístupnosti",
    },
  },
  "list-monitors": {
    title: "Zobraziť monitory",
    titleShort: "Monitory",
    description: "Vypíše pripojené monitory s rozlíšením, polohou a indexom",
    form: {
      label: "Zobraziť monitory",
      description:
        "Vypíše všetky pripojené obrazovky. Pri snímaní vyberte konkrétnu obrazovku podľa názvu monitora.",
      fields: {},
    },
    response: {
      success: "Zoznam monitorov sa úspešne načítal",
      monitors: "Pole pripojených monitorov",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní zoznamu monitorov nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie zobraziť zoznam monitorov",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Zobrazenie zoznamu monitorov nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní zoznamu monitorov nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní zoznamu monitorov nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní zoznamu monitorov nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description:
          "Zoznam monitorov nie je dostupný vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Monitory načítané",
      description: "Zoznam všetkých pripojených monitorov sa úspešne načítal",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      captureAutomation: "Automatizácia snímania",
    },
  },
  click: {
    title: "Kliknúť",
    titleShort: "Kliknúť",
    dynamicTitle: "Kliknutie: {{x}},{{y}}",
    description: "Presunie kurzor na absolútne súradnice a klikne",
    form: {
      label: "Kliknúť",
      description: "Presunie kurzor na zadané súradnice a klikne",
      fields: {
        x: {
          label: "Súradnica X",
          description:
            "Vodorovná súradnica obrazovky v pixeloch od ľavého okraja",
          placeholder: "100",
        },
        y: {
          label: "Súradnica Y",
          description:
            "Zvislá súradnica obrazovky v pixeloch od horného okraja",
          placeholder: "200",
        },
        button: {
          label: "Tlačidlo myši",
          description: "Tlačidlo myši na kliknutie (left, middle, right)",
          placeholder: "left",
          options: {
            left: "Ľavé",
            middle: "Stredné",
            right: "Pravé",
          },
        },
        doubleClick: {
          label: "Dvojité kliknutie",
          description: "Namiesto jedného kliknutia vykoná dvojité",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Kliknutie bolo úspešné",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri kliknutí nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie klikať na pracovnej ploche",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Klikanie na pracovnej ploche nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri kliknutí nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri kliknutí nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri kliknutí nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Kliknutie vykonané",
      description: "Kliknutie myšou sa úspešne vykonalo",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "type-text": {
    title: "Napísať text",
    titleShort: "Napísať text",
    dynamicTitle: "Napísať: {{text}}",
    description: "Napíše text do aktívneho okna simulovaním klávesnice",
    form: {
      label: "Napísať text",
      description: "Odošle stlačenia klávesov do aktívneho okna a napíše text",
      fields: {
        text: {
          label: "Text",
          description: "Text, ktorý sa napíše do aktívneho okna",
          placeholder: "Hello, World!",
        },
        delay: {
          label: "Oneskorenie (ms)",
          description:
            "Oneskorenie medzi stlačeniami klávesov v milisekundách (predvolene 12)",
          placeholder: "12",
        },
        windowId: {
          label: "ID okna",
          description:
            "Pred písaním aktivuje okno s týmto UUID. UUID zistíte cez list-windows.",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Titulok okna",
          description:
            "Pred písaním aktivuje okno, ktorého titulok obsahuje tento text",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Text sa úspešne napísal",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri písaní textu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie písať text na pracovnej ploche",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Písanie textu na pracovnej ploche nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri písaní textu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri písaní textu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri písaní textu nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Text napísaný",
      description: "Text sa úspešne napísal",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "press-key": {
    title: "Stlačiť kláves",
    titleShort: "Stlačiť kláves",
    dynamicTitle: "Kláves: {{key}}",
    description: "Stlačí kláves alebo kombináciu klávesov cez xdotool",
    form: {
      label: "Stlačiť kláves",
      description:
        "Odošle stlačenie klávesu na pracovnú plochu v syntaxi xdotool",
      fields: {
        key: {
          label: "Kláves",
          description:
            "Názov alebo kombinácia klávesov v syntaxi xdotool, napríklad Return, ctrl+c alebo alt+F4",
          placeholder: "Return",
        },
        repeat: {
          label: "Počet opakovaní",
          description: "Počet stlačení klávesu (predvolene 1)",
          placeholder: "1",
        },
        delay: {
          label: "Oneskorenie (ms)",
          description:
            "Oneskorenie medzi opakovanými stlačeniami v milisekundách (predvolene 0)",
          placeholder: "0",
        },
        windowId: {
          label: "ID okna",
          description: "Pred stlačením klávesu aktivuje okno s týmto UUID",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Titulok okna",
          description:
            "Pred stlačením klávesu aktivuje okno s týmto textom v titulku",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Kláves sa úspešne stlačil",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri stlačení klávesu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie stláčať klávesy na pracovnej ploche",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Stláčanie klávesov na pracovnej ploche nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri stlačení klávesu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri stlačení klávesu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri stlačení klávesu nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Kláves stlačený",
      description: "Kláves sa úspešne stlačil",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "move-mouse": {
    title: "Presunúť kurzor",
    titleShort: "Presunúť kurzor",
    dynamicTitle: "Presun: {{x}},{{y}}",
    description: "Presunie kurzor na absolútne súradnice obrazovky",
    form: {
      label: "Presunúť kurzor",
      description: "Presunie kurzor na zadanú pozíciu obrazovky",
      fields: {
        x: {
          label: "Súradnica X",
          description:
            "Vodorovná súradnica obrazovky v pixeloch od ľavého okraja",
          placeholder: "100",
        },
        y: {
          label: "Súradnica Y",
          description:
            "Zvislá súradnica obrazovky v pixeloch od horného okraja",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "Kurzor sa úspešne presunul",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri presune kurzora nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie presúvať kurzor na pracovnej ploche",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Presúvanie kurzora na pracovnej ploche nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri presune kurzora nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri presune kurzora nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri presune kurzora nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Kurzor presunutý",
      description: "Kurzor myši sa úspešne presunul",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  scroll: {
    title: "Posúvať",
    titleShort: "Posúvať",
    dynamicTitle: "Posun: {{direction}}",
    description:
      "Posunie obsah pri aktuálnej polohe kurzora alebo na zadaných súradniciach",
    form: {
      label: "Posúvať",
      description:
        "Posunie obsah nahor, nadol, doľava alebo doprava na zadanom mieste",
      fields: {
        x: {
          label: "Súradnica X",
          description:
            "Vodorovná súradnica posunu. Predvolene sa použije aktuálna poloha.",
          placeholder: "100",
        },
        y: {
          label: "Súradnica Y",
          description:
            "Zvislá súradnica posunu. Predvolene sa použije aktuálna poloha.",
          placeholder: "200",
        },
        direction: {
          label: "Smer",
          description: "Smer posunu",
          placeholder: "down",
          options: {
            up: "Nahor",
            down: "Nadol",
            left: "Ľavé",
            right: "Pravé",
          },
        },
        amount: {
          label: "Rozsah",
          description: "Počet krokov posunu (predvolene 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "Obsah sa úspešne posunul",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri posúvaní obsahu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie posúvať obsah na pracovnej ploche",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Posúvanie obsahu na pracovnej ploche nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri posúvaní obsahu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri posúvaní obsahu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri posúvaní obsahu nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Posun vykonaný",
      description: "Obsah sa úspešne posunul",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "get-focused-window": {
    title: "Získať aktívne okno",
    titleShort: "Aktívne okno",
    description: "Získa údaje o aktuálne aktívnom okne",
    form: {
      label: "Získať aktívne okno",
      description: "Načíta ID, titulok a PID aktívneho okna",
      fields: {},
    },
    response: {
      success: "Údaje aktívneho okna sa úspešne načítali",
      windowId: "ID aktívneho okna v X11",
      windowTitle: "Text titulku aktívneho okna",
      pid: "ID procesu aktívneho okna",
      width: "Šírka okna v pixeloch",
      height: "Výška okna v pixeloch",
      monitor: "Index monitora, na ktorom je okno",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní aktívneho okna nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie načítať údaje o okne",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Načítanie údajov o okne nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Žiadne aktívne okno sa nenašlo",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní aktívneho okna nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní aktívneho okna nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní aktívneho okna nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Aktívne okno načítané",
      description: "Údaje aktívneho okna sa úspešne načítali",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      windowManagement: "Správa okien",
    },
  },
  "list-windows": {
    title: "Zobraziť zoznam okien",
    titleShort: "Zobraziť zoznam okien",
    description: "Vypíše všetky otvorené okná na pracovnej ploche",
    form: {
      label: "Zobraziť zoznam okien",
      description:
        "Načíta zoznam otvorených okien s ich ID, titulkami a polohou",
      fields: {},
    },
    response: {
      success: "Zoznam okien sa úspešne načítal",
      windows: "Zoznam otvorených okien",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadané údaje a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní zoznamu okien nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie zobraziť zoznam okien",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Zobrazenie zoznamu okien nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne okná",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní zoznamu okien nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní zoznamu okien nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní zoznamu okien nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Okná načítané",
      description: "Zoznam okien sa úspešne načítal",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      windowManagement: "Správa okien",
    },
  },
  "focus-window": {
    title: "Aktivovať okno",
    titleShort: "Aktivovať okno",
    dynamicTitle: "Aktivovať: {{target}}",
    description: "Presunie okno do popredia a aktivuje ho",
    form: {
      label: "Aktivovať okno",
      description: "Aktivuje okno podľa ID, PID alebo titulku",
      fields: {
        windowId: {
          label: "ID okna",
          description:
            "ID okna v X11 (hexadecimálne, napríklad 0x1234). Má prednosť pred ostatnými možnosťami.",
          placeholder: "0x1234",
        },
        pid: {
          label: "ID procesu",
          description: "Aktivuje okno patriace procesu s týmto ID",
          placeholder: "12345",
        },
        title: {
          label: "Titulok okna",
          description:
            "Aktivuje okno, ktorého titulok obsahuje zadaný text. Rozlišuje veľké a malé písmená.",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "Okno sa úspešne aktivovalo",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Zadajte aspoň jeden údaj: windowId, pid alebo title",
      },
      network: {
        title: "Chyba siete",
        description: "Pri aktivovaní okna nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie aktivovať okná",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Aktivovanie okien nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zadané okno sa nenašlo",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri aktivovaní okna nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri aktivovaní okna nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri aktivovaní okna nastal konflikt",
      },
      notImplemented: {
        title: "Nedostupné",
        description: "Táto funkcia nie je dostupná vo vašom operačnom systéme",
      },
    },
    success: {
      title: "Okno aktivované",
      description: "Okno sa úspešne presunulo do popredia",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      windowManagement: "Správa okien",
    },
  },
  "move-window-to-monitor": {
    title: "Presunúť okno na monitor",
    titleShort: "Presunúť okno",
    dynamicTitle: "Presunúť: {{target}}",
    description: "Presunie okno na zadaný monitor",
    form: {
      label: "Presunúť okno na monitor",
      description:
        "Presunie okno podľa ID, PID alebo titulku na cieľový monitor",
      fields: {
        windowId: {
          label: "ID okna",
          description:
            "Interné UUID okna KWin z list-windows. Má prednosť pred pid a title.",
          placeholder: "{uuid}",
        },
        pid: {
          label: "ID procesu",
          description: "Presunie okno patriace procesu s týmto ID",
          placeholder: "12345",
        },
        title: {
          label: "Titulok okna",
          description:
            "Presunie okno, ktorého titulok obsahuje zadaný text. Nerozlišuje veľké a malé písmená.",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "Názov monitora",
          description:
            "Názov cieľového monitora, napríklad DP-1 alebo HDMI-A-1. Dostupné názvy vypíše list-monitors.",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "Index monitora",
          description:
            "Index cieľového monitora od 0. Ak je to možné, použite monitorName.",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "Ukazuje, či sa presun podaril",
      movedTo: "Monitor, na ktorý sa okno presunulo",
      windowTitle: "Titulok presunutého okna",
      error: "Chybové hlásenie pri zlyhaní operácie",
      executionId: "Jedinečné ID vykonania",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Zadajte aspoň jeden identifikátor okna a cieľový monitor",
      },
      network: {
        title: "Chyba siete",
        description: "Pri presune okna nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie presúvať okná",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Presúvanie okien nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zadané okno alebo monitor sa nenašli",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri presune okna nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri presune okna nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri presune okna nastal konflikt",
      },
    },
    success: {
      title: "Okno presunuté",
      description: "Okno sa úspešne presunulo na cieľový monitor",
    },
    category: "Pracovná plocha",
    tags: {
      desktopAutomation: "Automatizácia pracovnej plochy",
      windowManagement: "Správa okien",
    },
  },

  title: "Nástroje na automatizáciu pracovnej plochy",
  description: "Ovládanie pracovnej plochy: snímky, myš, klávesnica a okná",
  category: "Pracovná plocha",
  summary:
    "Automatizácia pracovnej plochy v Linuxe (ydotool/KWin/pyatspi) a vo Windows (PowerShell/UIAutomation)",
  tags: {
    desktopAutomation: "Automatizácia pracovnej plochy",
    inputAutomation: "Automatizácia vstupu",
    windowManagement: "Správa okien",
    captureAutomation: "Automatizácia snímania",
    accessibilityAutomation: "Automatizácia prístupnosti",
  },

  tool: {
    takeScreenshot: "Zachytiť snímku",
    getAccessibilityTree: "Získať strom prístupnosti",
    listMonitors: "Zobraziť monitory",
    click: "Kliknúť",
    typeText: "Napísať text",
    pressKey: "Stlačiť kláves",
    moveMouse: "Presunúť kurzor",
    scroll: "Posúvať",
    getFocusedWindow: "Získať aktívne okno",
    listWindows: "Zobraziť zoznam okien",
    focusWindow: "Aktivovať okno",
    moveWindowToMonitor: "Presunúť okno na monitor",
  },

  widget: {
    refresh: "Obnoviť",
    noWindows: "Nenašli sa žiadne otvorené okná",
    windowCount_one: "{{count}} okno",
    windowCount_other: "Počet okien: {{count}}",
    actionFocus: "Aktivovať",
    actionType: "Napísať",
    actionKey: "Kláves",
    actionMove: "Presunúť",
    actionA11y: "Prístupnosť",
    actionTypeText: "Napísať text",
    actionPressKey: "Stlačiť kláves",
    actionScreenshot: "Snímka obrazovky",
    actionScreenshotOnMonitor: "Snímka: {{monitor}}",
    actionA11yTree: "Strom prístupnosti",
    actionAllWindows: "← Všetky okná",
    actionAllMonitors: "Všetky monitory →",
    actionScreenshotLink: "Snímka →",
    actionMoveWindowHere: "Presunúť okno sem",
    labelPrimary: "Hlavný",
    statusFocused: "Okno aktivované",
    statusTyped: "Napísané",
    statusPressed: "Stlačené",
    statusMoved: "Presunuté",
    statusScrolled: "Posunuté",
    statusMouseMoved: "Kurzor presunutý",
    statusClickExecuted: "Kliknutie vykonané",
    labelSaved: "Uložené:",
    labelTruncated: "⚠ Skrátené",
    filterPlaceholder: "Filtrovať uzly…",
    titleTypeText: "Napísať text",
    titlePressKey: "Stlačiť kláves",
    titleClick: "Kliknúť",
    titleScroll: "Posúvať",
    titleMoveMouse: "Presunúť kurzor",
    titleMoveWindow: "Presunúť okno",
    titleA11yTree: "Strom prístupnosti",
    titleListWindows: "Okná",
    titleListMonitors: "Monitory",
    titleGetFocusedWindow: "Aktívne okno",
    titleFocusWindow: "Aktivovať okno",
  },

  repository: {
    platformNotSupported:
      "Platforma {{platform}} nie je podporovaná. Podporujeme Linux a Windows.",
    windowsNotSupported: "Podpora Windows bude dostupná čoskoro",
    macosNotSupported: "Podpora macOS bude dostupná čoskoro",
    commandFailed: "Príkaz zlyhal: {{error}}",
    toolNotFound:
      "Chýba potrebný nástroj {{tool}}. Nainštalujte ho príkazom: {{installCmd}}",
    screenshotFailed: "Snímku sa nepodarilo zachytiť",
    accessibilityFailed: "Strom prístupnosti sa nepodarilo načítať",
    accessibilityFailedWithError:
      "Strom prístupnosti sa nepodarilo načítať: {{error}}",
    focusWindowRequiresIdentifier:
      "Vyžaduje sa aspoň jeden z údajov windowId, pid alebo title",
    missingDep:
      "Chýba systémový balík {{dep}}. V systémovom dialógu potvrďte oprávnenie na automatickú inštaláciu.",
    scriptWriteFailed: "Skript sa nepodarilo zapísať: {{error}}",
    monitorNotFoundByName: "Monitor „{{monitorName}}“ sa nenašiel",
    noMonitorsDetected: "Nezistili sa žiadne monitory",
    invalidWindowHandle:
      "Neplatné windowId: „{{handle}}“ nie je platný číselný identifikátor okna",
    screenIndexOutOfRange: "Index obrazovky {{screen}} je mimo rozsahu",
    unknownKeyName: "Neznámy názov klávesu: {{key}}",
    focusedWindowParseFailed:
      "Výstup s údajmi aktívneho okna sa nepodarilo spracovať",
    couldNotListWindows: "Zoznam okien sa nepodarilo načítať",
    noWindowWithPid: "Nenašlo sa žiadne okno s PID {{pid}}",
    noWindowWithTitle: "Nenašlo sa žiadne okno s textom „{{title}}“ v titulku",
    provideMonitorNameOrIndex: "Zadajte monitorName alebo monitorIndex",
    monitorNotFound: "Monitor sa nenašiel: {{monitor}}",
    noActiveWindow: "Žiadne aktívne okno",
    kwinNoOutput: "Skript KWin nevygeneroval výstup",
    kwinNoWindowData: "Vo výstupe skriptu KWin chýbajú údaje o okne",
    windowMoveNoEffect:
      "Presun sa nevykonal. Okno sa na monitor {{monitor}} nedostalo.",
  },
};
