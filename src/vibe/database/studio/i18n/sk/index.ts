import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operácie s databázou",

  tag: "štúdio",
  post: {
    title: "Databázové štúdio",
    titleShort: "Štúdio DB",
    description: "Otvorí štúdio na správu databázy v grafickom rozhraní.",
    form: {
      title: "Nastavenie štúdia",
      description: "Nastaviť parametre databázového štúdia",
    },
    response: {
      title: "Výsledok spustenia štúdia",
      description: "Výsledky spustenia databázového štúdia",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Ak chceš otvoriť databázové štúdio, prihlás sa.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre štúdia",
      },
      server: {
        title: "Chyba servera",
        description: "Interná chyba servera počas spustenia štúdia",
        detail:
          "Drizzle Studio sa nepodarilo spustiť ani po {{seconds}} s: {{error}}",
      },
      internal: {
        title: "Interná chyba",
        description: "Spustenie databázového štúdia zlyhalo",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Počas spustenia štúdia sa vyskytla neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Chyba siete počas spustenia štúdia",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáš oprávnenie otvoriť databázové štúdio.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroje štúdia sa nenašli",
      },
      conflict: {
        title: "Konflikt",
        description: "Port databázového štúdia je už obsadený.",
      },
    },
    success: {
      title: "Štúdio spustené",
      description: "Databázové štúdio sa úspešne spustilo",
    },
  },
  fields: {
    port: {
      title: "Port",
      description: "Číslo portu databázového štúdia (1 024 až 65 535)",
    },
    openBrowser: {
      title: "Otvoriť prehliadač",
      description: "Automaticky otvorí štúdio v prehliadači.",
    },
    success: {
      title: "Výsledok",
    },
    url: {
      title: "Adresa URL štúdia",
    },
    portUsed: {
      title: "Použitý port",
    },
    output: {
      title: "Výstup spustenia",
    },
    duration: {
      title: "Trvanie spustenia",
    },
  },
};
