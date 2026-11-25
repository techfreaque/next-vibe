import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "platba", bill: "prijatá faktúra", ap: "záväzky" },
  enums: {
    billStatus: {
      DRAFT: "Koncept",
      RECEIVED: "Prijatá",
      APPROVED: "Schválená",
      PAID: "Zaplatené",
      DISPUTED: "Sporná",
    },
  },
  post: {
    title: "Skontrolovať stav faktúry",
    titleShort: "Skontrolovať stav faktúry",
    description: "Zmeňte stav konceptu alebo prijatej faktúry.",
    billId: {
      label: "ID dodávateľskej faktúry",
      description: "Dodávateľská faktúra na schválenie",
    },
    errors: {
      existingPosting:
        "Pred schválením faktúry skontrolujte a zosúlaďte jej existujúci účtovný zápis.",
      billLines:
        "Pridajte položky s kladnou celkovou sumou a použite aktívne nákladové účty tejto firmy.",
      posting:
        "Skontrolujte celkové sumy faktúry, menu firmy, účtovné obdobie a účty na zaúčtovanie.",
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné ID faktúry",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na schvaľovanie dodávateľských faktúr sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa rola účtovníka alebo správcu.",
      },
      conflict: {
        title: "Už schválené",
        description: "Dodávateľská faktúra je už schválená alebo uhradená",
      },
      server: {
        title: "Chyba servera",
        description: "Dodávateľskú faktúru sa nepodarilo schváliť",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
      },
      notFound: {
        title: "Faktúra sa nenašla",
        description: "Faktúra neexistuje.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Dodávateľská faktúra schválená",
      description: "Faktúra prešla do ďalšieho stavu.",
    },
    response: {
      status: "Nový stav",
      journalEntryId: "ID účtovného zápisu",
    },
    widget: {
      back: "Späť",
      submit: "Potvrdiť zmenu stavu",
      confirmTitle: "Schváliť túto dodávateľskú faktúru?",
      confirmDescription:
        "Koncept prejde do stavu Prijatá. Schválením prijatej faktúry sa zaúčtuje účtovný zápis.",
      confirmButton: "Áno, schváliť",
      cancelButton: "Zrušiť",
      approved: "Stav faktúry bol aktualizovaný.",
    },
  },
};
