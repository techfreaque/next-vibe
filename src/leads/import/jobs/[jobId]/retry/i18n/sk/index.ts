import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Import údajov",
  tags: {
    leads: "Kontakty",
    management: "Správa",
  },

  post: {
    title: "Zopakovať úlohu importu",
    titleShort: "Zopakovať import",
    description: "Zopakovať neúspešnú úlohu importu",
    jobId: {
      label: "ID úlohy",
      description: "Jedinečné ID úlohy importu, ktorú chcete zopakovať",
    },
    form: {
      title: "Zopakovať úlohu importu",
      description: "Zopakovať neúspešnú úlohu importu",
    },
    response: {
      title: "Výsledok opakovaného pokusu",
      description: "Výsledok opakovaného spustenia",
      success: {
        content: "Úspešnosť operácie",
      },
      message: {
        content: "Hlásenie o opakovanom pokuse",
      },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Poskytnuté ID úlohy je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete úlohu zopakovať, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zopakovať túto úlohu",
      },
      notFound: {
        title: "Úloha sa nenašla",
        description: "Úloha importu so zadaným ID sa nenašla",
      },
      server: {
        title: "Chyba servera",
        description: "Pri opätovnom spustení úlohy nastala chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nedá sa pripojiť k serveru",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt pri opakovanom spustení",
        description: "Prebiehajúcu úlohu nemožno spustiť znova",
      },
    },
    success: {
      title: "Úspech",
      description: "Úloha importu sa spustila znova",
    },
  },
  widget: {
    title: "Zopakovať úlohu importu",
    successMessage: "Opakované spustenie úlohy sa začalo",
  },
};
