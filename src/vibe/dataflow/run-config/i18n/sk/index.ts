import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Spustiť graf zo zadanej konfigurácie",
    titleShort: "Spustiť konfiguráciu",
    description:
      "Spustí graf priamo zo zadanej konfigurácie. Graf nemusí byť uložený.",
    fields: {
      config: {
        label: "Konfigurácia grafu",
        description: "Konfigurácia grafu zadaná priamo (uzly, hrany a spúšťač)",
      },
      rangeFrom: {
        label: "Od",
        description: "Začiatok rozsahu (dátum a čas vo formáte ISO)",
      },
      rangeTo: {
        label: "Do",
        description: "Koniec rozsahu (dátum a čas vo formáte ISO)",
      },
    },
    response: {
      nodeCount: "Vykonané uzly",
      errorCount: "Chyby",
      errors: "Podrobnosti o chybe",
    },
    success: {
      title: "Konfigurácia vykonaná",
      description: "Graf sa úspešne spustil zo zadanej konfigurácie",
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
        detail: "Spustenie grafu zlyhalo: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatná konfigurácia grafu alebo neplatné parametre",
        detail: "Neplatná konfigurácia grafu: {{error}}",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt zdrojov",
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
