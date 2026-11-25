import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa serverov",

  tag: "Stav",
  get: {
    title: "Kontrola stavu",
    titleShort: "Kontrola stavu",
    description: "Zobraziť stav servera a diagnostiku",
    form: {
      title: "Možnosti kontroly stavu",
      description: "Nastaviť parametre kontroly stavu",
    },
    fields: {
      detailed: {
        title: "Podrobná správa",
        description: "Zahrnúť podrobné systémové informácie",
      },
      includeDatabase: {
        title: "Zahrnúť databázu",
        description: "Zahrnúť kontroly stavu databázy",
      },
      includeTasks: {
        title: "Zahrnúť úlohy",
        description: "Zahrnúť kontrolu spúšťača úloh",
      },
      includeSystem: {
        title: "Zahrnúť systém",
        description: "Zahrnúť informácie o systémových zdrojoch",
      },
    },
    response: {
      status: {
        title: "Stav",
        description: "Celkový stav",
      },
      timestamp: {
        title: "Časová pečiatka",
        description: "Čas kontroly stavu",
      },
      uptime: {
        title: "Čas prevádzky",
        description: "Čas prevádzky servera v sekundách",
      },
      revision: {
        title: "Commit zostavenia",
      },
      environment: {
        title: "Prostredie",
        description: "Informácie o prostredí servera",
        name: {
          title: "Názov prostredia",
        },
        nodeEnv: {
          title: "Prostredie Node.js",
        },
        platform: {
          title: "Platforma",
        },
        supportsTaskRunners: {
          title: "Podpora spúšťačov úloh",
        },
      },
      database: {
        title: "Stav databázy",
        description: "Stav pripojenia k databáze",
        status: {
          title: "Stav pripojenia",
        },
        responseTime: {
          title: "Čas odozvy (ms)",
        },
        error: {
          title: "Chybové hlásenie",
        },
      },
      tasks: {
        title: "Stav úlohy",
        description: "Stav spúšťača úloh",
        runnerStatus: {
          title: "Stav spúšťača",
        },
        activeTasks: {
          title: "Aktívne úlohy",
        },
        totalTasks: {
          title: "Celkový počet úloh",
        },
        errors: {
          title: "Počet chýb",
        },
        lastError: {
          title: "Posledná chyba",
        },
      },
      system: {
        title: "Systémové informácie",
        description: "Informácie o systémových zdrojoch",
        memory: {
          title: "Využitie pamäte",
          description: "Informácie o systémovej pamäti",
          used: {
            title: "Použitá pamäť",
          },
          total: {
            title: "Celková pamäť",
          },
          percentage: {
            title: "Využitie pamäte (%)",
          },
        },
        cpu: {
          title: "Využitie procesora",
          description: "Informácie o procesore",
          usage: {
            title: "Využitie procesora (%)",
          },
          loadAverage: {
            title: "Priemerné zaťaženie",
          },
        },
        disk: {
          title: "Využitie disku",
          description: "Informácie o systémovom disku",
          available: {
            title: "Dostupný priestor",
          },
          total: {
            title: "Celkový priestor",
          },
          percentage: {
            title: "Využitie disku (%)",
          },
        },
      },
      checks: {
        title: "Kontroly stavu",
        description: "Kontroly stavu jednotlivých komponentov",
        item: {
          title: "Kontrola stavu",
          description: "Výsledok kontroly jedného komponentu",
          name: {
            title: "Názov kontroly",
          },
          status: {
            title: "Stav kontroly",
          },
          message: {
            title: "Hlásenie kontroly",
          },
          duration: {
            title: "Trvanie (ms)",
          },
        },
      },
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera",
        checkFailed: "Kontrola stavu zlyhala: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Zostali neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "úspešne dokončená kontrola stavu",
    },
  },
};
