import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Informácie",
  get: {
    title: "Získať obsah URL",
    titleShort: "Načítať adresu URL",
    description:
      "Načíta obsah z adresy URL a prevedie ho do čitateľného formátu Markdown na čítanie alebo analýzu.",
    form: {
      title: "Parametre načítania adresy URL",
      description: "Zadaj adresu URL, z ktorej sa má načítať obsah",
    },
    fields: {
      url: {
        title: "URL",
        description: "Úplná adresa URL vrátane http:// alebo https://",
        placeholder: "https://example.com",
      },
      query: {
        title: "Hľadaný výraz (nepovinné)",
        description:
          "Po načítaní použije regulárny výraz. Vráti iba odseky, ktoré mu zodpovedajú, zoradené podľa počtu zhôd až po limit znakov. Ak filter vynecháš, dostaneš celú stránku. Pri dlhých stránkach sa vynechá stred. Použiť môžeš ľubovoľný regulárny výraz v syntaxi JavaScriptu, napríklad 'authentication', '(login|signup)' alebo 'class\\s+\\w+'. Neplatný výraz sa použije ako doslovný text.",
        placeholder: "authentication",
      },
    },
    response: {
      message: {
        title: "Správa",
        description: "Stav načítania",
      },
      content: {
        title: "Obsah",
        description: "Získaný obsah vo formáte Markdown",
      },
      truncated: {
        title: "Skrátené",
        description: "Či sa obsah skrátil pre prekročenie limitu",
      },
      truncatedNote: {
        title: "Informácia o skrátení",
        description: "Informácie o skrátení a možnosti načítať ďalší obsah",
      },
      url: {
        title: "Zobraziť originál",
        description: "Adresa URL, z ktorej sa načítal obsah",
      },
      statusCode: {
        title: "Stavový kód",
        description: "Kód stavu HTTP odpovede",
      },
      timeElapsed: {
        title: "Trvanie (ms)",
        description: "Čas potrebný na získanie obsahu v milisekundách",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Adresa URL chýba alebo je neplatná",
      },
      internal: {
        title: "Chyba pri načítaní",
        description: "Pri načítaní adresy URL nastala chyba",
        // Dedicated key: `title` doubles as the generic errorTypes label, so the
        // detail placeholder lives here instead of leaking into those labels.
        detail: "Chyba pri načítaní: {{message}}",
      },
      notConfigured: {
        title:
          "Chýba kľúč API pre {{label}}. Do súboru .env pridaj {{envKey}}=<your-key>. Kľúč získaš na {{url}}.",
        description: "Pre načítavanie webových stránok nastav {{label}}",
      },
      timeout: {
        title: "Čas načítania vypršal",
        description: "Vypršal časový limit načítania adresy URL",
        detail:
          "Vypršal časový limit načítania adresy {{url}}. Stránka odpovedá pomaly alebo je nedostupná.",
      },
    },
    success: {
      title: "Načítanie dokončené",
      description: "Obsah z adresy URL sa načítal",
      detail: "Načítaná adresa: {{url}}",
    },
  },
  tags: {
    scraping: "Získavanie obsahu z webu",
    web: "Web",
    content: "Obsah",
  },
  cleanup: {
    post: {
      title: "Čistenie vyrovnávacej pamäte adries URL",
      titleShort: "Čistenie vyrovnávacej pamäte adries URL",
      description:
        "Odstrániť súbory z vyrovnávacej pamäte adries URL staršie ako 7 dní",
      container: {
        title: "Výsledky čistenia",
        description: "Zhrnutie zmazaných súborov vyrovnávacej pamäte",
      },
      response: {
        deletedCount: "Vymazané súbory",
        totalScanned: "Počet skontrolovaných súborov",
        retentionDays: "Doba uchovávania v dňoch",
      },
      success: {
        title: "Vyrovnávacia pamäť vyčistená",
        description:
          "Staré súbory sa odstránili z vyrovnávacej pamäte adries URL",
      },
    },
    errors: {
      server: {
        title: "Chyba čistenia",
        description: "Nastala chyba pri čistení vyrovnávacej pamäte URL",
      },
    },
    name: "Čistenie vyrovnávacej pamäte adries URL",
    description:
      "Týždenné čistenie starých súborov uložených pri načítavaní adries URL",
  },
};
