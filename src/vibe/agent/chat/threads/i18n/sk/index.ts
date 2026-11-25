import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    threads: "Vlákna",
  },
  enums: {
    threadStatus: {
      active: "Aktívne",
      archived: "Archivované",
      deleted: "Odstránené",
    },
  },
  errors: {
    count_failed: "Nepodarilo sa zistiť počet konverzácií: {{error}}",
  },
  get: {
    title: "Vlákna",
    titleShort: "Vlákna",
    description:
      "Načítajte stránkovaný zoznam konverzácií s možnosťou filtrovania",
    container: {
      title: "Zoznam konverzácií",
      description: "Prezerajte a filtrujte konverzácie",
    },
    sections: {
      pagination: {
        title: "Stránkovanie",
        description: "Nastavenia prechádzania medzi stránkami",
      },
      filters: {
        title: "Filtre",
        description: "Filtrujte konverzácie podľa kritérií",
      },
    },
    page: {
      label: "Stránka",
      description: "Číslo stránky na načítanie",
    },
    limit: {
      label: "Limit",
      description: "Počet konverzácií na stránku",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description:
        "Filtrovať podľa koreňového priečinka (súkromný, zdieľaný, verejný alebo inkognito)",
    },
    subFolderId: {
      label: "Podpriečinok",
      description: "Filtrovať podľa ID podpriečinka (voliteľné)",
    },
    status: {
      label: "Stav",
      description: "Filtrovať podľa stavu konverzácie",
    },
    search: {
      label: "Vyhľadať",
      description: "Hľadať konverzácie podľa názvu alebo obsahu",
      placeholder: "Vyhľadať vlákna…",
    },
    isPinned: {
      label: "Len pripnuté",
      description: "Zobrazí len pripnuté konverzácie",
    },
    dateFrom: {
      label: "Dátum od",
      description: "Zobrazí konverzácie vytvorené po tomto dátume",
    },
    dateTo: {
      label: "Dátum do",
      description: "Zobrazí konverzácie vytvorené pred týmto dátumom",
    },
    response: {
      title: "Výsledok načítania konverzácií",
      description: "Stránkovaný zoznam konverzácií",
      threads: {
        thread: {
          title: "Konverzácia",
          id: {
            content: "ID vlákna",
          },
          threadTitle: {
            content: "Názov",
          },
          rootFolderId: {
            content: "Koreňový priečinok",
          },
          folderId: {
            content: "ID podpriečinka",
          },
          status: {
            content: "Stav",
          },
          preview: {
            content: "Náhľad",
          },
          pinned: {
            content: "Pripnuté",
          },
          archived: {
            content: "Archivované",
          },
          streamingState: {
            content: "Stav priebežnej odpovede",
          },
          createdAt: {
            content: "Vytvorené",
          },
          updatedAt: {
            content: "Aktualizované",
          },
          canEdit: {
            content: "Môže upravovať",
          },
          canPost: {
            content: "Môže pridávať správy",
          },
          canModerate: {
            content: "Môže moderovať",
          },
          canDelete: {
            content: "Môže odstraňovať",
          },
          canManagePermissions: {
            content: "Môže spravovať oprávnenia",
          },
        },
      },
      totalCount: {
        content: "Celkový počet",
      },
      pageCount: {
        content: "Počet stránok",
      },
      page: {
        content: "Aktuálna stránka",
      },
      limit: {
        content: "Položky na stránku",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie konverzácií sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť konverzácie",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sa žiadne konverzácie",
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
      description: "Konverzácie sa načítali",
    },
  },
  post: {
    title: "Nová konverzácia",
    titleShort: "Nová konverzácia",
    description: "Vytvorte novú konverzáciu",
    form: {
      title: "Vytvoriť konverzáciu",
      description: "Nastavte novú konverzáciu",
    },
    sections: {
      thread: {
        title: "Podrobnosti konverzácie",
        description: "Základné údaje konverzácie",
      },
    },
    id: {
      label: "ID vlákna",
      description: "ID konverzácie vytvorené klientom",
    },
    threadTitle: {
      label: "Názov",
      description: "Názov konverzácie",
      placeholder: "Zadaj názov konverzácie...",
      default: "Nový chat",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Podpriečinok",
      description: "Podpriečinok, do ktorého sa konverzácia pridá (voliteľné)",
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
      placeholder: "Zadajte systémové pokyny...",
    },
    response: {
      title: "Vytvorená konverzácia",
      description: "Podrobnosti novej konverzácie",
      thread: {
        title: "Konverzácia",
        id: {
          content: "ID vlákna",
        },
        threadTitle: {
          content: "Názov",
        },
        rootFolderId: {
          content: "Koreňový priečinok",
        },
        subFolderId: {
          content: "ID podpriečinka",
        },
        status: {
          content: "Stav",
        },
        createdAt: {
          content: "Vytvorené",
        },
        updatedAt: {
          content: "Aktualizované",
        },
        canEdit: {
          content: "Môže upravovať",
        },
        canPost: {
          content: "Môže pridávať správy",
        },
        canModerate: {
          content: "Môže moderovať",
        },
        canDelete: {
          content: "Môže odstraňovať",
        },
        canManagePermissions: {
          content: "Môže spravovať oprávnenia",
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
        description: "Na vytváranie konverzácií sa musíte prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie vytvárať konverzácie",
        incognitoNotAllowed:
          "Konverzácie inkognito nemožno vytvoriť na serveri",
        cannotCreateHere: "Na tomto mieste nemôžete vytvoriť konverzáciu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
        folderNotFound: "Priečinok sa nenašiel",
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
        description: "Konverzácia s týmto názvom už existuje",
      },
    },
    success: {
      title: "Hotovo",
      description: "Konverzácia sa vytvorila",
    },
  },
  widget: {
    common: {
      noChatsFound: "Nenašli sa žiadne chaty",
      delete: "Odstrániť",
      cancel: "Zrušiť",
    },
    actions: {
      menu: "Akcie konverzácie",
      rename: "Premenovať",
      unpin: "Odopnúť",
      pin: "Pripnúť navrch",
      unarchive: "Vrátiť z archívu",
      archive: "Archivovať",
      manageSharing: "Spravovať zdieľanie",
      moveToFolder: "Presunúť do priečinka",
      unfiled: "Nezaradené",
    },
    folderList: {
      managePermissions: "Spravovať oprávnenia",
      today: "Dnes",
      lastWeek: "Posledných 7 dní",
      lastMonth: "Posledných 30 dní",
      older: "Staršie",
    },
    threadList: {
      deleteDialog: {
        title: "Odstrániť konverzáciu",
        description:
          "Chcete odstrániť „{{title}}“? Všetky správy v tejto konverzácii sa natrvalo odstránia. Tento krok sa nedá vrátiť späť.",
      },
    },
    suggestedPrompts: {
      starters: {
        explain: {
          label: "Vysvetli to jednoducho",
          prompt:
            "Vysvetli mi, ako funguje inflácia, akoby som mal 12 rokov. Stručne a konkrétne.",
        },
        search: {
          label: "Hľadať na webe",
          prompt:
            "Aké boli najdôležitejšie technologické správy tohto týždňa? Vyhľadaj ich a uveď zdroje.",
        },
        image: {
          label: "Vytvoriť obrázok",
          prompt:
            "Vytvor obrázok útulnej chaty počas nočnej snehovej víchrice. Z okien vychádza teplé svetlo.",
        },
        honest: {
          label: "Povedz to na rovinu",
          prompt:
            "Uveď najsilnejšie argumenty za kryptomeny aj proti nim. Odpovedz priamo, bez výhrad.",
        },
      },
      backgroundTitle: "Tvoji agenti AI pracujú",
      backgroundDescription:
        "Podagenti a samostatní agenti na pozadí tu plnia úlohy, kým sa venuješ niečomu inému. Výsledky sa zobrazia automaticky.",
    },
    emptyState: {
      changeCompanion: "Zmeniť spoločníka alebo model. Teraz: {{name}}",
      folder: {
        private: {
          label: "Súkromné",
          note: "Synchronizuje sa s tvojím účtom.",
        },
        incognito: {
          label: "Inkognito",
          note: "Ukladá sa len v tomto prehliadači a nesynchronizuje sa.",
        },
        shared: { label: "Zdieľané", note: "Čítať môže každý, kto má odkaz." },
        public: { label: "Verejné", note: "Viditeľné pre všetkých." },
        cron: { label: "Na pozadí", note: "Agenti tu pracujú samostatne." },
        remote: {
          label: "Vzdialené",
          note: "Beží na tvojej pripojenej inštancii.",
        },
      },
      use: {
        everyday: {
          good: "Výskum, písanie a každodenné úlohy",
          weak: "Pri politických otázkach je opatrný",
        },
        politics: {
          good: "Priame odpovede na politické a tabuizované témy",
          weak: "Len text, slabší pri zložitých úlohách",
        },
        security: {
          good: "Ofenzívna a defenzívna kybernetická bezpečnosť",
          weak: "Pri politických otázkach je opatrný",
        },
        writing: {
          good: "Dôsledné písanie, programovanie a analýza",
          weak: "Pri citlivých témach sa vyhýba priamej odpovedi alebo ju odmietne",
        },
        images: {
          good: "Rozumie snímkam obrazovky, fotografiám aj videu",
          weak: "Opatrný pri citlivých témach",
        },
        classic: {
          good: "Spoľahlivý všestranný model na programovanie a plánovanie",
          weak: "Opatrný pri citlivých témach",
        },
        bold: {
          good: "Priame odpovede s jasným názorom",
          weak: "Slabší pri politických otázkach",
        },
        general: {
          good: "Všeobecné otázky",
          weak: "Slabší pri politických otázkach",
        },
      },
      mode: {
        autoModel: "Automatický výber",
        goodAt: "Silné stránky:",
        weakAt: "Slabé stránky:",
      },
      spotlight: {
        adultsOnly: "18+",
        title: "Vyber, ako má {{name}} pracovať.",
        subtitle:
          "Každý režim používa iný model. Začať môžeš aj rovno správou.",
        now: "Aktuálny režim: {{mode}}",
        runsOn: "Používa model",
        allModes: "Všetky režimy",
        fix: {
          politics: "Politika? Prepni na {{mode}}",
          complex: "Zložitá úloha? Prepni na {{mode}}",
        },
      },
      single: {
        title: "Začni čet: {{name}}",
        action: "Viac režimov nájdeš v ponuke {{companion}}",
      },
      companion: {
        title: "Kto má odpovedať?",
        subtitle:
          "Každý spoločník má vlastnú osobnosť a modely na rôzne úlohy.",
        skip: "Ak chceš začať bez spoločníka, rovno napíš správu.",
        skipModel: "Stačí napísať. Odpovie {{model}} bez zvolenej osobnosti.",
        about: {
          thea: "Srdečný a premýšľavý. Preberie to s tebou.",
          hermes: "Priamy a rýchly. Vybaví úlohu.",
        },
      },
      custom: {
        title: "Tvoja vlastná zručnosť je pripravená.",
        subtitle: "Zručnosť alebo model zmeníš vo výbere pod poľom správy.",
      },
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "Práve teraz",
      hoursAgo: "pred {{hours}} h",
      daysAgo: "pred {{days}} d",
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
};
