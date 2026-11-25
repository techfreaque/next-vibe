import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  enums: {
    threadStatus: {
      active: "Aktívne",
      archived: "Archivované",
      deleted: "Odstránené",
    },
  },
  config: {
    folders: {
      private: "Súkromné čety",
      shared: "Zdieľané čety",
      public: "Verejné čety",
      incognito: "Čety inkognito",
      background: "Čety na pozadí",
      remote: "Vzdialené čety",
    },
  },
  tags: {
    threads: "Vlákna",
  },
  errors: {
    not_implemented_on_native:
      "Funkcia {{method}} nie je v natívnej aplikácii dostupná. Použite webovú verziu.",
  },
  get: {
    title: "Načítať konverzáciu",
    titleShort: "Konverzácia",
    description: "Načítaj konverzáciu podľa ID",
    container: {
      title: "Podrobnosti konverzácie",
      description: "Zobraz podrobnosti konverzácie",
    },
    id: {
      label: "ID vlákna",
      description: "Jedinečné ID konverzácie",
      placeholder: "Zadaj ID konverzácie...",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    response: {
      thread: {
        title: "Podrobnosti konverzácie",
        description: "Úplné údaje konverzácie",
        id: {
          content: "ID vlákna",
        },
        userId: {
          content: "ID používateľa",
        },
        leadId: {
          content: "ID potenciálneho zákazníka",
        },
        threadTitle: {
          content: "Názov",
        },
        rootFolderId: {
          content: "ID koreňového priečinka",
        },
        folderId: {
          content: "ID priečinka",
        },
        status: {
          content: "Stav",
        },
        defaultModel: {
          content: "Predvolený model",
        },
        defaultTone: {
          content: "Predvolená zručnosť",
        },
        systemPrompt: {
          content: "Systémový prompt",
        },
        pinned: {
          content: "Pripnuté",
        },
        archived: {
          content: "Archivované",
        },
        tags: {
          content: "Značky",
        },
        published: {
          content: "Zverejnené",
        },
        streamingState: {
          content: "Stav priebežnej odpovede",
        },
        searchVector: {
          content: "Vyhľadávací vektor",
        },
        preview: {
          content: "Náhľad",
        },
        metadata: {
          content: "Metadáta",
        },
        createdAt: {
          content: "Vytvorené",
        },
        updatedAt: {
          content: "Aktualizované",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID konverzácie je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie konverzácií sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie zobraziť túto konverzáciu",
      },
      notFound: {
        title: "Konverzácia sa nenašla",
        description: "Požadovaná konverzácia sa nenašla",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
        detail: "Chyba servera: {{error}}",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
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
        description: "Nastal konflikt",
      },
    },
    success: {
      title: "Hotovo",
      description: "Konverzácia sa načítala",
    },
  },
  patch: {
    title: "Upraviť konverzáciu",
    titleShort: "Upraviť konverzáciu",
    description: "Uprav existujúcu konverzáciu",
    container: {
      title: "Upraviť konverzáciu",
      description: "Zmeň nastavenia konverzácie",
    },
    id: {
      label: "ID vlákna",
      description: "Jedinečné ID konverzácie, ktorú chceš upraviť",
      placeholder: "Zadaj ID konverzácie...",
    },
    sections: {
      updates: {
        title: "Zmeny konverzácie",
        description: "Polia na úpravu",
      },
    },
    threadTitle: {
      label: "Názov",
      description: "Názov konverzácie",
      placeholder: "Zadaj názov konverzácie...",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    folderId: {
      label: "Priečinok",
      description: "Priečinok, do ktorého sa konverzácia zaradí",
    },
    status: {
      label: "Stav",
      description: "Stav konverzácie",
    },
    defaultModel: {
      label: "Predvolený model",
      description: "Predvolený model AI pre túto konverzáciu",
    },
    defaultTone: {
      label: "Predvolená zručnosť",
      description: "Predvolená zručnosť pre túto konverzáciu",
    },
    systemPrompt: {
      label: "Systémový prompt",
      description: "Vlastné systémové pokyny pre túto konverzáciu",
    },
    pinned: {
      label: "Pripnuté",
      description: "Pripni túto konverzáciu navrch",
    },
    archived: {
      label: "Archivované",
      description: "Archivuj túto konverzáciu",
    },
    tags: {
      label: "Značky",
      description: "Značky na usporiadanie konverzácií",
    },
    published: {
      label: "Zverejnené",
      description:
        "Sprístupni túto konverzáciu každému s odkazom. Platí len v zdieľaných priečinkoch (SHARED).",
    },
    response: {
      thread: {
        title: "Upravená konverzácia",
        description: "Podrobnosti konverzácie po úprave",
        id: {
          content: "ID vlákna",
        },
        userId: {
          content: "ID používateľa",
        },
        leadId: {
          content: "ID potenciálneho zákazníka",
        },
        threadTitle: {
          content: "Názov",
        },
        rootFolderId: {
          content: "ID koreňového priečinka",
        },
        folderId: {
          content: "ID priečinka",
        },
        status: {
          content: "Stav",
        },
        defaultModel: {
          content: "Predvolený model",
        },
        defaultTone: {
          content: "Predvolená zručnosť",
        },
        systemPrompt: {
          content: "Systémový prompt",
        },
        pinned: {
          content: "Pripnuté",
        },
        archived: {
          content: "Archivované",
        },
        tags: {
          content: "Značky",
        },
        published: {
          content: "Zverejnené",
        },
        searchVector: {
          content: "Vyhľadávací vektor",
        },
        preview: {
          content: "Náhľad",
        },
        metadata: {
          content: "Metadáta",
        },
        createdAt: {
          content: "Vytvorené",
        },
        updatedAt: {
          content: "Aktualizované",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané údaje konverzácie sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na úpravu konverzácií sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie upraviť túto konverzáciu",
      },
      notFound: {
        title: "Konverzácia sa nenašla",
        description: "Konverzácia určená na úpravu sa nenašla",
        detail: "Konverzácia sa nenašla: {{threadId}}",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
        detail: "Chyba servera: {{error}}",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
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
        description: "Pri úprave došlo ku konfliktu",
      },
    },
    success: {
      title: "Hotovo",
      description: "Konverzácia sa upravila",
    },
  },
  delete: {
    title: "Odstrániť konverzáciu",
    titleShort: "Odstrániť konverzáciu",
    description: "Odstráň konverzáciu",
    container: {
      title: "Odstrániť konverzáciu",
      description: "Natrvalo odstráň konverzáciu",
    },
    id: {
      label: "ID vlákna",
      description: "Jedinečné ID konverzácie, ktorú chceš odstrániť",
      placeholder: "Zadaj ID konverzácie...",
      helpText: "Upozornenie: Tento krok sa nedá vrátiť späť",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    response: {
      userId: {
        content: "Vlastník",
      },
      title: {
        content: "Názov",
      },
      folderId: {
        content: "Priečinok",
      },
      status: {
        content: "Stav",
      },
      preview: {
        content: "Náhľad",
      },
      createdAt: {
        content: "Vytvorené",
      },
      updatedAt: {
        content: "Aktualizované",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané ID konverzácie je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na odstránenie konverzácií sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie odstrániť túto konverzáciu",
      },
      notFound: {
        title: "Konverzácia sa nenašla",
        description: "Konverzácia určená na odstránenie sa nenašla",
        detail: "Konverzácia sa nenašla: {{threadId}}",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
        detail: "Chyba servera: {{error}}",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
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
        description:
          "Konverzáciu nemožno odstrániť, kým na ňu odkazujú ďalšie záznamy",
      },
    },
    success: {
      title: "Hotovo",
      description: "Konverzácia sa odstránila",
    },
  },
  widget: {
    screenshot: {
      capture: "Zachytiť snímku obrazovky",
      capturing: "Zachytáva sa…",
    },
  },
};
