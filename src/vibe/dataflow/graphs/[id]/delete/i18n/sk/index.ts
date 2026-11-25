import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "Odstrániť graf",
    titleShort: "Odstrániť graf",
    description: "Natrvalo odstráni graf. Odstránenie sa nedá vrátiť.",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu na odstránenie" },
    },
    response: {
      deletedId: "ID odstráneného grafu",
    },
    widget: {
      confirmDescription:
        "Graf aj jeho nastavenia sa natrvalo vymažú. Odstrániť možno iba graf bez údajov. Ak graf obsahuje údaje, môžeš ho archivovať.",
      deletedIdLabel: "ID odstráneného grafu",
      backToList: "Späť na zoznam grafov",
    },
    success: {
      title: "Graf bol odstránený",
      description: "Graf bol natrvalo odstránený",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Tento graf nemôžeš odstrániť.",
      },
      server: {
        title: "Chyba servera",
        description: "Zlyhalo odstránenie grafu",
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
      conflict: {
        title: "Má údaje",
        description: "Graf obsahuje dátové body. Môžeš ho archivovať.",
      },
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
