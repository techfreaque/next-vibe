import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operácie s databázou",

  tag: "sql",
  post: {
    title: "Vykonať SQL",
    titleShort: "Spustiť SQL",
    description: "Vykonáva dopyty SQL v databáze.",
    form: {
      title: "Nastavenia dopytu SQL",
      description: "Nastavenie parametrov dopytu SQL",
    },
    response: {
      title: "Výsledok dopytu",
      description: "Výsledky vykonaných dopytov SQL",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš vykonávať SQL, prihlás sa.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Dopyt SQL alebo jeho parametre sú neplatné.",
      },
      server: {
        title: "Chyba servera",
        description: "Pri vykonávaní SQL sa vyskytla interná chyba servera.",
      },
      internal: {
        title: "Interná chyba",
        description: "Dopyt SQL sa nepodarilo vykonať.",
      },
      database: {
        title: "Chyba databázy",
        description: "Pri vykonávaní dopytu nastala chyba databázy.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vykonávaní SQL nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vykonávaní SQL nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáš oprávnenie vykonávať SQL.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroje pre SQL sa nenašli.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vykonávaní SQL nastal konflikt.",
      },
    },
    success: {
      title: "Dopyt bol vykonaný",
      description: "Dopyt SQL sa úspešne vykonal.",
    },
  },
  fields: {
    query: {
      title: "Dopyt SQL",
      description: "Dopyt SQL, ktorý chceš vykonať",
    },
    queryFile: {
      title: "Cesta k súboru s dopytom",
      description: "Cesta k súboru SQL na spustenie",
      placeholder: "/path/to/query.sql",
    },
    dryRun: {
      title: "Skúšobné spustenie",
      description: "Zobrazí dopyt bez jeho vykonania.",
    },
    verbose: {
      title: "Podrobný výstup",
      description: "Zobraziť podrobné informácie o dopyte",
    },
    limit: {
      title: "Limit počtu riadkov",
      description: "Maximálny počet vrátených riadkov (1 až 1 000)",
    },
    success: {
      title: "Výsledok",
    },
    output: {
      title: "Výstup",
    },
    results: {
      title: "Výsledky dopytu",
    },
    rowCount: {
      title: "Počet riadkov",
    },
    queryType: {
      title: "Typ dopytu",
    },
  },
};
