import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operácie s databázou",
  tag: "databáza",
  post: {
    title: "Overiť pripojenie k databáze",
    titleShort: "Dostupnosť databázy",
    description: "Skontroluje dostupnosť a stav databázy.",
    form: {
      title: "Nastavenia kontroly pripojenia",
      description: "Parametre kontroly pripojenia k databáze",
    },
    response: {
      title: "Odpoveď",
      description: "Výsledok kontroly pripojenia",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš používať databázové nástroje, prihlás sa.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre kontroly pripojenia",
      },
      server: {
        title: "Chyba servera",
        description:
          "Pri kontrole pripojenia k databáze sa vyskytla interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description:
          "Pri kontrole pripojenia k databáze sa vyskytla neznáma chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Pri pripájaní k databáze nastala chyba siete.",
        detail: "Kontrola pripojenia k databáze zlyhala: {{error}}",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup je zamietnutý pre nedostatok oprávnení.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj databázy sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri operácii nastal konflikt údajov.",
      },
    },
    success: {
      title: "Databáza je dostupná",
      description: "Pripojenie k databáze sa podarilo.",
    },
  },
  fields: {
    silent: {
      title: "Tichý režim",
      description: "Spustí kontrolu pripojenia bez výstupných správ.",
    },
    keepConnectionOpen: {
      title: "Udržať spojenie otvorené",
      description: "Ponechá pripojenie k databáze otvorené aj po kontrole.",
    },
    success: {
      title: "Výsledok",
      content: "Úspech",
    },
    isAccessible: {
      title: "Dostupnosť databázy",
      content: "Dostupná",
    },
    output: {
      title: "Výstupná správa",
      content: "Výstup",
    },
    connectionInfo: {
      title: "Informácie o pripojení",
      totalConnections: {
        content: "Celkový počet pripojení",
      },
      idleConnections: {
        content: "Nečinné pripojenia",
      },
      waitingClients: {
        content: "Čakajúci klienti",
      },
    },
  },
  status: {
    success: "Úspech",
    failed: "Zlyhalo",
    timeout: "Časový limit",
    error: "Chyba",
  },
  connectionType: {
    primary: "Primárne",
    replica: "Replika",
    cache: "Vyrovnávacia pamäť",
  },
};
