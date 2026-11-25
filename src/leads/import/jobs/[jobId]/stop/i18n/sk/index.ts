import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Import údajov",
  tags: {
    leads: "Kontakty",
    management: "Správa",
  },

  post: {
    title: "Zastaviť úlohu importu",
    titleShort: "Zastaviť import",
    description: "Zastaviť prebiehajúcu úlohu importu",
    jobId: {
      label: "ID úlohy",
      description: "Jedinečné ID úlohy importu, ktorú chcete zastaviť",
    },
    form: {
      title: "Zastaviť úlohu importu",
      description: "Zastaviť prebiehajúci import",
    },
    response: {
      title: "Výsledok zastavenia",
      description: "Výsledok zastavenia úlohy",
      success: {
        content: "Úspešnosť operácie",
      },
      message: {
        content: "Hlásenie o zastavení",
      },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Poskytnuté ID úlohy je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zastaviť úlohu, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zastaviť túto úlohu",
      },
      notFound: {
        title: "Úloha sa nenašla",
        description: "Úloha importu so zadaným ID sa nenašla",
      },
      server: {
        title: "Chyba servera",
        description: "Pri zastavovaní úlohy nastala chyba",
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
        title: "Konflikt pri zastavovaní",
        description: "Zastaviť možno iba prebiehajúcu úlohu",
      },
    },
    success: {
      title: "Úspech",
      description: "Úloha importu sa zastavila",
    },
  },
  widget: {
    title: "Zastaviť úlohu importu",
    successMessage: "Úloha sa zastavila",
  },
};
