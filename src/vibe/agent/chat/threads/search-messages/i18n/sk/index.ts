import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    messages: "Správy",
  },
  search: {
    get: {
      title: "Vyhľadávanie správ vo všetkých konverzáciách",
      titleShort: "Hľadať správy",
      description:
        "Vyhľadaj správy vo všetkých konverzáciách pomocou fulltextu",
      container: {
        title: "Vyhľadávanie správ vo všetkých konverzáciách",
        description: "Hľadaj správy vo všetkých svojich konverzáciách",
      },
      query: {
        label: "Hľadaný výraz",
        description: "Text, ktorý chceš nájsť v správach",
      },
      sections: {
        filters: {
          title: "Filtre",
          description: "Voliteľné filtre na zúženie výsledkov",
        },
        pagination: {
          title: "Stránkovanie",
          description: "Nastavenia prechádzania medzi stránkami",
        },
      },
      rootFolderId: {
        label: "Koreňový priečinok",
        description:
          "Obmedz vyhľadávanie na určitý typ koreňového priečinka (private, shared, public, background)",
      },
      role: {
        label: "Rola správy",
        description:
          "Filtrovať podľa roly správy (user, assistant, system, tool, error)",
      },
      startDate: {
        label: "Dátum od",
        description: "Zahrnie len správy vytvorené po tomto dátume",
      },
      endDate: {
        label: "Dátum do",
        description: "Zahrnie len správy vytvorené pred týmto dátumom",
      },
      page: {
        label: "Stránka",
        description: "Číslo stránky na načítanie",
      },
      limit: {
        label: "Limit",
        description: "Počet výsledkov na stránku",
      },
      response: {
        results: {
          message: {
            title: "Nájdená správa",
            messageId: {
              content: "ID správy",
            },
            threadId: {
              content: "ID vlákna",
            },
            threadTitle: {
              content: "Názov konverzácie",
            },
            role: {
              content: "Rola",
            },
            headline: {
              content: "Úryvok obsahu",
            },
            createdAt: {
              content: "Vytvorené",
            },
            rootFolderId: {
              content: "Koreňový priečinok",
            },
          },
        },
        total: {
          content: "Celkový počet výsledkov",
        },
        page: {
          content: "Aktuálna stránka",
        },
      },
      errors: {
        validationFailed: {
          title: "Overenie zlyhalo",
          description: "Parametre vyhľadávania sú neplatné",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na vyhľadávanie správ sa musíš prihlásiť",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáš oprávnenie spustiť toto vyhľadávanie",
        },
        notFound: {
          title: "Nenájdené",
          description: "Nenašli sa výsledky zodpovedajúce hľadanému výrazu",
        },
        serverError: {
          title: "Chyba servera",
          description: "Pri vyhľadávaní nastala interná chyba servera",
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
        description:
          "Vyhľadávanie správ vo všetkých konverzáciách sa dokončilo",
      },
    },
  },
};
