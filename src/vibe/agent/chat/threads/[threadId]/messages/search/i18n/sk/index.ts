import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    messages: "Správy",
  },
  search: {
    get: {
      title: "Hľadať správy",
      titleShort: "Hľadať správy",
      description: "Vyhľadaj správy v konkrétnej konverzácii pomocou fulltextu",
      container: {
        title: "Vyhľadávanie správ",
        description: "Hľadaj správy v tejto konverzácii",
      },
      threadId: {
        label: "ID vlákna",
        description: "ID konverzácie, v ktorej chceš hľadať",
      },
      query: {
        label: "Hľadaný výraz",
        description: "Text, ktorý chceš nájsť v správach",
      },
      sections: {
        pagination: {
          title: "Stránkovanie",
          description: "Nastavenia prechádzania medzi stránkami",
        },
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
            title: "Správa",
            id: {
              content: "ID správy",
            },
            content: {
              content: "Obsah",
            },
            role: {
              content: "Rola",
            },
            rank: {
              content: "Skóre relevantnosti",
            },
            headline: {
              content: "Úryvok",
            },
            createdAt: {
              content: "Vytvorené",
            },
          },
        },
        totalCount: {
          content: "Celkový počet výsledkov",
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
          description: "Nemáš oprávnenie vyhľadávať správy v tejto konverzácii",
        },
        notFound: {
          title: "Konverzácia sa nenašla",
          description:
            "Zadaná konverzácia neexistuje alebo k nej nemáš prístup",
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
        description: "Vyhľadávanie správ sa dokončilo",
      },
    },
  },
};
