import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Systém",
  get: {
    title: "Vytvoriť tajný kľúč",
    titleShort: "Vytvoriť kľúč",
    description:
      "Vygenerujte kryptograficky bezpečný náhodný kľúč so 64 hexadecimálnymi znakmi",
    tags: {
      generateKey: "Vytvoriť kľúč",
    },
    response: {
      key: {
        title: "Vygenerovaný kľúč",
      },
    },
    success: {
      title: "Kľúč sa vytvoril",
      description: "Bezpečný kľúč sa vygeneroval",
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
        description: "Nenájdené",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      server: {
        title: "Chyba servera",
        description: "Kľúč sa nepodarilo vygenerovať",
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
