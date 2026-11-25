import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "AND",
    titleShort: "AND",
    description:
      "Vyšle signál, keď sa všetky vstupné signály vyšlú s rovnakou časovou značkou",
    fields: {
      signals: {
        label: "Toky signálov",
        description: "Pole tokov signálov pre logickú operáciu AND",
      },
      result: { label: "Výsledok", description: "Výstupné udalosti signálov" },
    },
    success: {
      title: "Operácia AND vyhodnotená",
      description: "Výsledné udalosti signálov sú pripravené",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: {
        title: "Chyba servera",
        description: "Vyhodnotenie operácie AND zlyhalo",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv uložte zmeny",
      },
    },
  },
};
