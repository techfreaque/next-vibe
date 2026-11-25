import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Nastaviť ako systémový graf",
    titleShort: "Nastaviť ako systémový",
    description:
      "Zmení graf správcu na zdieľaný systémový graf iba na čítanie.",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
    },
    response: {
      promotedId: "ID grafu",
    },
    widget: {
      confirmDescription:
        "Graf bude patriť systému a bude zdieľaný so všetkými používateľmi. Doterajšia systémová verzia s rovnakým identifikátorom slug sa deaktivuje. Zmenu možno zvrátiť nastavením inej verzie ako systémovej.",
      promotedIdLabel: "ID systémového grafu",
      viewButton: "Zobraziť",
    },
    success: {
      title: "Graf je systémový",
      description: "Graf bol nastavený ako systémový.",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu.",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa nastaviť graf ako systémový",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatné parametre",
      },
      notFound: { title: "Nenájdené", description: "Graf sa nenašiel." },
      conflict: { title: "Konflikt", description: "Konflikt zdrojov" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož zmeny",
      },
    },
  },
};
