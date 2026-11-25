import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "História verzií grafu",
    titleShort: "Verzie grafu",
    description:
      "Načíta reťazec verzií grafu. Staršie verzie dohľadá pomocou parentVersionId.",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      versions: {
        label: "Verzie",
        description: "Zoznam predchádzajúcich verzií od najstaršej.",
        id: { label: "ID verzie", description: "UUID verzie" },
        name: { label: "Názov", description: "Názov grafu v tejto verzii" },
        createdAt: {
          label: "Čas vytvorenia",
          description: "Čas vytvorenia tejto verzie",
        },
        isActive: {
          label: "Aktívny",
          description: "Či je táto verzia práve aktívna",
        },
      },
    },
    success: {
      title: "História verzií načítaná",
      description: "Reťazec verzií sa načítal",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "K tomuto grafu nemáš prístup",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa načítať históriu verzií",
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
