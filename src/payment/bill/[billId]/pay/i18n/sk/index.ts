import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "platba", bill: "prijatá faktúra", ap: "záväzky" },
  post: {
    title: "Uhradiť prijatú faktúru",
    titleShort: "Uhradiť prijatú faktúru",
    description:
      "Označiť schválenú dodávateľskú faktúru ako uhradenú a zaúčtovať platbu",
    billId: { label: "ID dodávateľskej faktúry", description: "Prijatá faktúra na označenie ako uhradená" },
    errors: {
      validation: { title: "Neplatné údaje", description: "Neplatné vstupné údaje" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa a uhraďte faktúry.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa rola účtovníka alebo správcu.",
      },
      conflict: {
        title: "Neplatný stav",
        description: "Pred úhradou musí byť faktúra v stave APPROVED.",
      },
      server: {
        title: "Chyba servera",
        description: "Úhradu sa nepodarilo zaevidovať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: { title: "Chyba siete", description: "Skontrolujte pripojenie." },
      notFound: {
        title: "Faktúra sa nenašla",
        description: "Faktúra neexistuje.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: { title: "Faktúra je uhradená", description: "Faktúra bola označená ako uhradená." },
    response: {
      status: "Stav",
      paidAt: "Dátum úhrady",
    },
    widget: {
      back: "Späť",
      submit: "Označiť ako uhradenú",
      paymentRecorded: "Úhrada bola zaevidovaná",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Koncept",
      RECEIVED: "Prijatá",
      APPROVED: "Schválená",
      PAID: "Zaplatené",
      DISPUTED: "Sporná",
    },
  },
  accountNodeId: {
    label: "Bankový alebo pokladničný účet",
    description: "Bankový alebo pokladničný účet použitý na úhradu",
    placeholder: "UUID účtu",
  },
  paidAt: {
    label: "Dátum platby",
    description: "Dátum vykonania úhrady",
    placeholder: "2024-01-31",
  },
};
