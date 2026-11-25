import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Spustiť graf",
    titleShort: "Spustiť graf",
    description: "Spustiť graf ručne na požiadanie",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      rangeFrom: {
        label: "Od",
        description: "Začiatok rozsahu (dátum vo formáte ISO)",
      },
      rangeTo: {
        label: "Do",
        description: "Koniec rozsahu (dátum vo formáte ISO)",
      },
    },
    response: {
      nodeCount: "Vykonané uzly",
      errorCount: "Chyby",
    },
    widget: {
      nodesExecuted: "Vykonané uzly",
      errors: "Chyby",
      errorDetails: "Podrobnosti o chybe",
      nodeLabel: "Uzol",
    },
    success: {
      title: "Graf spustený",
      description: "Vykonávanie grafu sa úspešne dokončilo",
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
        description: "Spustenie grafu zlyhalo",
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
