import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    messages: "Správy",
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
  get: {
    title: "Načítať vetvu konverzácie",
    titleShort: "Vetva správ",
    description: "Načítaj správy z určenej vetvy konverzácie",
    container: {
      title: "Vetva konverzácie",
      description: "Správy vo vybranej vetve konverzácie",
    },
    threadId: {
      label: "ID vlákna",
      description: "ID konverzácie, z ktorej sa má načítať vetva",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    leafMessageId: {
      label: "ID koncovej správy",
      description:
        "ID koncovej (najhlbšej) správy vybranej vetvy. Ak pole vynecháš, načíta sa najnovšia.",
    },
    before: {
      label: "ID správy pre načítanie staršej histórie",
      description:
        "Načítaj staršiu časť histórie pred týmto ID správy (stránkovanie kurzorom)",
    },
    response: {
      title: "Správy vo vetve",
      description: "Správy vo vetve konverzácie",
      messages: {
        message: {
          title: "Správa",
          id: {
            content: "ID správy",
          },
          threadId: {
            content: "ID vlákna",
          },
          role: {
            content: "Rola",
          },
          content: {
            content: "Obsah",
          },
          parentId: {
            content: "ID nadradenej správy",
          },
          sequenceId: {
            content: "ID postupnosti",
          },
          authorId: {
            content: "ID autora",
          },
          authorName: {
            content: "Meno autora",
          },
          isAI: {
            content: "Správa od AI",
          },
          model: {
            content: "Model",
          },
          skill: {
            content: "Zručnosť",
          },
          errorType: {
            content: "Typ chyby",
          },
          errorMessage: {
            content: "Chybová správa",
          },
          errorCode: {
            content: "Kód chyby",
          },
          metadata: {
            content: "Metadáta",
          },
          upvotes: {
            content: "Kladné hlasy",
          },
          downvotes: {
            content: "Záporné hlasy",
          },
          searchVector: {
            content: "Vyhľadávací vektor",
          },
          createdAt: {
            content: "Vytvorené",
          },
          updatedAt: {
            content: "Aktualizované",
          },
        },
      },
      hasOlderHistory: {
        content: "Má staršiu históriu",
      },
      hasNewerMessages: {
        content: "Má novšie správy",
      },
      resolvedLeafMessageId: {
        content: "ID určenej koncovej správy",
      },
      oldestLoadedMessageId: {
        content: "ID najstaršej načítanej správy",
      },
      compactionBoundaryId: {
        content: "ID hranice zhrnutia",
      },
      newerChunkAnchorId: {
        content: "ID referenčnej správy pre novšiu časť",
      },
    },
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
        description: "Na zobrazenie vetiev konverzácií sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie zobraziť túto vetvu konverzácie",
      },
      notFound: {
        title: "Nenájdené",
        description: "Vlákno sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
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
      threadNotFound: {
        title: "Konverzácia sa nenašla",
        description: "Zadaná konverzácia neexistuje",
      },
      noRootMessage: {
        title: "Chýba prvá správa",
        description: "Konverzácia nemá prvú správu",
      },
      getFailed: {
        title: "Načítanie zlyhalo",
        description: "Vetvu konverzácie sa nepodarilo načítať",
      },
    },
    success: {
      title: "Hotovo",
      description: "Vetva konverzácie sa načítala",
    },
  },
};

export default translations;
