import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",

  enums: {
    level: {
      error: "Chyba",
      warn: "Upozornenie",
    },
  },

  post: {
    title: "Nahlásiť chybu klienta",
    titleShort: "Zaznamenať chybu",
    description: "Uložiť chybu alebo upozornenie z klienta do protokolu chýb",
    tags: {
      monitoring: "Monitorovanie",
    },
    fields: {
      level: {
        label: "Úroveň",
        description: "Úroveň záznamu: error alebo warn",
      },
      message: {
        label: "Správa",
        description: "Chybové hlásenie",
        placeholder: "Niečo sa pokazilo.",
      },
      metadata: {
        label: "Metadáta",
        description: "Dodatočný štruktúrovaný kontext",
      },
    },
    response: {
      ok: {
        title: "Prijaté",
      },
    },
    success: {
      title: "Zaznamenané",
      description: "Chyba z klienta sa zaznamenala.",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Chybu sa nepodarilo zapísať do protokolu.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        titleChanges: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
    },
  },
};
