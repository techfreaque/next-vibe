import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operácie s databázou",
  tag: "migrácia",
  post: {
    title: "Vygenerovať migrácie",
    titleShort: "Vygenerovať migrácie",
    description: "Vygeneruje migračné súbory Drizzle podľa zmien schémy.",
    form: {
      title: "Nastavenie generovania",
      description: "Nastavenie možností generovania migrácií",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre",
      },
      network: {
        title: "Generovanie zlyhalo",
        description: "Príkaz drizzle-kit generate zlyhal.",
        detail: "Príkaz drizzle-kit generate zlyhal: {{error}}",
        exitCode: "Príkaz drizzle-kit generate skončil s kódom {{code}}.",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nedostatočné oprávnenia",
      },
      notFound: { title: "Nenájdené", description: "Zdroje sa nenašli" },
      server: {
        title: "Chyba servera",
        description: "Interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      conflict: { title: "Konflikt", description: "Zistený konflikt" },
    },
    success: {
      title: "Generovanie dokončené",
      description: "Migračné súbory boli vygenerované.",
    },
  },
  fields: {
    success: { title: "Výsledok" },
    output: { title: "Výstup" },
    duration: { title: "Trvanie (ms)" },
  },
};
