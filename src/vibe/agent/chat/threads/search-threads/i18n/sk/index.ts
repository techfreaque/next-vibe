/**
 * Thread Search API - English Translations
 */

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
  tags: {
    threads: "Vlákna",
  },
  search: {
    get: {
      title: "Hľadať konverzácie",
      titleShort: "Hľadať konverzácie",
      description:
        "Vyhľadaj konverzácie podľa názvov, náhľadov a systémových pokynov pomocou fulltextu",
      container: {
        title: "Vyhľadávanie konverzácií",
        description: "Hľadaj konverzácie zoradené podľa relevantnosti",
      },
      query: {
        label: "Hľadaný výraz",
        description:
          "Zadaj hľadané slová. Môžeš použiť výrazy v úvodzovkách a operátory AND/OR.",
        placeholder: "Vyhľadať vlákna…",
      },
      sections: {
        pagination: {
          title: "Stránkovanie",
          description: "Nastav stránkovanie výsledkov",
        },
      },
      page: {
        label: "Stránka",
        description: "Číslo stránky (od 1)",
      },
      limit: {
        label: "Výsledky na stránku",
        description: "Počet výsledkov na stránku (1 až 100)",
      },
      sortBy: {
        label: "Zoradiť podľa",
        description: "Zoradiť výsledky podľa relevantnosti alebo dátumu",
        options: {
          relevance: "Relevantnosť",
          date: "Dátum (od najnovších)",
        },
      },
      includeArchived: {
        label: "Zahrnúť archivované",
        description: "Vo výsledkoch zobrazí aj archivované konverzácie",
      },
      response: {
        results: {
          title: "Výsledky vyhľadávania",
          description: "Konverzácie zodpovedajúce hľadanému výrazu",
          thread: {
            id: {
              label: "ID vlákna",
            },
            title: {
              label: "Názov",
            },
            preview: {
              label: "Náhľad",
            },
            rank: {
              label: "Skóre relevantnosti",
              description: "Vyššie skóre znamená lepšiu zhodu",
            },
            headline: {
              label: "Úryvok",
              description: "Úryvok so zvýraznenými zhodami",
            },
            status: {
              label: "Stav",
            },
            createdAt: {
              label: "Vytvorené",
            },
            updatedAt: {
              label: "Aktualizované",
            },
          },
        },
        totalResults: {
          label: "Celkový počet výsledkov",
          description:
            "Celkový počet konverzácií zodpovedajúcich hľadanému výrazu",
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
          description: "Na vyhľadávanie konverzácií sa musíš prihlásiť",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáš oprávnenie vyhľadávať konverzácie",
        },
        notFound: {
          title: "Nenájdené",
          description: "Nenašli sa žiadne konverzácie",
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
        description: "Vyhľadávanie sa dokončilo",
      },
    },
  },
};
