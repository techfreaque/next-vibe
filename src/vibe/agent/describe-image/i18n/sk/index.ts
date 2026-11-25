import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "Obrázok",
    vision: "Počítačové videnie",
    ai: "AI",
  },
  post: {
    title: "Opísať obrázok",
    titleShort: "Opísať obrázok",
    dynamicTitle: "Opísať súbor {{filename}}",
    description: "Model AI rozpozná a opíše, čo je na obrázku.",
    fileUrl: {
      label: "URL obrázka",
      description: "Adresa obrázka, ktorý chceš opísať",
    },
    context: {
      label: "Kontext",
      description: "Môžeš spresniť, na čo sa má model zamerať.",
      placeholder: "Opíš tento obrázok a zameraj sa na…",
    },
    submitButton: {
      label: "Opísať obrázok",
      loadingText: "Vytvára sa opis…",
    },
    response: {
      text: "Opis",
      model: "Použitý model",
      creditCost: "Spotrebované kredity",
    },
    errors: {
      validation_failed: {
        title: "Neplatné údaje",
        description: "Zadaj platnú adresu obrázka.",
      },
      network_error: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k službe na rozpoznávanie obrazu.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš túto funkciu použiť, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na použitie tejto funkcie nemáš oprávnenie.",
      },
      not_found: {
        title: "Nenašlo sa",
        description: "Obrázok sa nenašiel.",
      },
      server_error: {
        title: "Chyba servera",
        description: "Pri vytváraní opisu obrázka nastala neočakávaná chyba.",
      },
      unknown_error: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba.",
      },
      unsaved_changes: {
        title: "Neuložené zmeny",
        description: "Pred vytvorením opisu si ulož zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt.",
      },
      noVisionModel:
        "Nie je nastavený žiadny model na rozpoznávanie obsahu obrázkov.",
      descriptionFailed: "Obrázok sa nepodarilo opísať: {{error}}",
      insufficientCredits:
        "Nedostatok kreditov. Zostatok: {{balance}}. Potrebné množstvo: {{minimum}}.",
      balanceCheckFailed: "Zostatok kreditov sa nepodarilo overiť.",
      creditsFailed: "Kredity sa nepodarilo odpočítať.",
    },
    success: {
      title: "Opis obrázka je hotový",
      description: "Model dokončil opis obrázka.",
    },
  },
};
