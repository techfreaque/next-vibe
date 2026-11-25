import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",
  get: {
    title: "Exportovať produkčné nastavenia prostredia",
    titleShort: "Exportovať .env",
    description:
      "Vytvorte súbor .env s dešifrovanými hodnotami, pokynmi na nasadenie a kontrolným zoznamom pre produkciu",
    tags: {
      exportEnv: "Exportovať .env",
    },
    response: {
      content: {
        title: "Obsah súboru .env",
      },
      filename: {
        title: "Názov súboru",
      },
    },
    success: {
      title: "Súbor .env sa exportoval",
      description: "Produkčný súbor .env sa vytvoril",
    },
    widget: {
      copy: "Kopírovať do schránky",
      copied: "Skopírované!",
      download: "Stiahnuť .env.prod",
      instructions: "Skopírujte tento súbor na server a reštartujte aplikáciu.",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Požaduje sa prístup pre administrátora",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nastavenia sa nenašli.",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Súbor .env sa nepodarilo vytvoriť",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
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
  },
};
