import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Zobraziť obrázok",
    titleShort: "Zobraziť obrázok",
    description:
      "Načítaj obrázok z jeho adresy v úložisku. Takto sa môžeš vrátiť k snímke obrazovky alebo k obrázku z predchádzajúcej správy.",
    dynamicTitle: "Zobraziť: {{url}}",
    url: {
      label: "URL obrázka",
      description: "Adresa obrázka v úložisku",
      placeholder: "https://...",
    },
    response: {
      url: "URL obrázka",
    },
    errors: {
      validation_failed: {
        title: "Neplatné údaje",
        description: "Zadaná adresa je neplatná.",
      },
      network_error: {
        title: "Chyba siete",
        description: "Obrázok sa nepodarilo načítať.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie tohto obrázka nemáš oprávnenie.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup k tomuto obrázku je zakázaný.",
      },
      not_found: {
        title: "Obrázok sa nenašiel",
        description: "Na zadanej adrese sa nenašiel žiadny obrázok.",
      },
      server_error: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera.",
      },
      unknown_error: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba.",
      },
      unsaved_changes: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt.",
      },
    },
    success: {
      title: "Obrázok sa načítal",
      description: "Obrázok je pripravený na zobrazenie.",
    },
  },
  tags: {
    vision: "Počítačové videnie",
    ai: "AI",
  },
};
