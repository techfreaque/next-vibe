import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "platba", bill: "prijatá faktúra", ap: "záväzky" },
  post: {
    title: "Uhradiť prijatú faktúru",
    titleShort: "Uhradiť prijatú faktúru",
    description:
      "Označiť schválenú dodávateľskú faktúru ako uhradenú a zaúčtovať platbu",
    billId: {
      label: "Prijatá faktúra",
      description: "Faktúra, ktorú chcete označiť ako uhradenú.",
    },
    errors: {
      approvalPosting:
        "Pred úhradou musí byť účtovný zápis o schválení faktúry zaúčtovaný.",
      paymentAccount:
        "Vyberte aktívny bankový alebo pokladničný účet tejto firmy.",
      paymentPosting:
        "Skontrolujte dátum platby, menu firmy a účty na zaúčtovanie.",
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné vstupné údaje",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa a uhraďte faktúry.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa rola účtovníka alebo správcu.",
      },
      conflict: {
        title: "Faktúru nemožno uhradiť",
        description: "Ako uhradené môžete označiť iba schválené faktúry.",
      },
      server: {
        title: "Chyba servera",
        description: "Úhradu sa nepodarilo zaevidovať.",
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
      title: "Faktúra je uhradená",
      description: "Faktúra bola označená ako uhradená.",
    },
    response: {
      status: "Stav",
      paidAt: "Dátum úhrady",
    },
    widget: {
      back: "Späť",
      details: "Údaje o úhrade",
      loadingBill: "Načítava sa faktúra…",
      retry: "Skúsiť znova",
      submit: "Označiť ako uhradenú",
      paymentRecorded: "Úhrada bola zaevidovaná",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Koncept",
      RECEIVED: "Prijatá",
      APPROVED: "Schválená",
      PAID: "Uhradená",
      DISPUTED: "Sporná",
    },
  },
  accountNodeId: {
    label: "Bankový alebo pokladničný účet",
    description:
      "Ak pole necháte prázdne, použije sa predvolený účet na úhrady.",
  },
  paidAt: {
    label: "Dátum platby",
    description: "Dátum vykonania úhrady",
    placeholder: "2024-01-31",
  },
};
