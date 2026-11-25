import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "NOT",
    titleShort: "NOT",
    description:
      "Obráti stav signálu. V intervale s vyslaným signálom ho vypne a v intervale bez neho ho vyšle.",
    fields: {
      signal: {
        label: "Signál",
        description: "Vstupný tok signálov na obrátenie",
      },
      result: {
        label: "Výsledok",
        description: "Výstupné udalosti s obráteným stavom signálu",
      },
    },
    success: {
      title: "Operácia NOT vyhodnotená",
      description: "Výsledné udalosti s obráteným stavom signálu sú pripravené",
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
        description: "Vyhodnotenie operácie NOT zlyhalo",
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
