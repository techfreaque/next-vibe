import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    credits: "Kredity",
  },
  enum: {
    offer: {
      available: "Dostupné",
      pendingConfirmation: "Čaká na potvrdenie e-mailu",
      active: "Bonus aktívny",
      notEligible: "Nie je k dispozícii",
    },
  },
  response: {
    offer: "Bonus za newsletter",
    email: "E-mail k účtu",
    bonusCredits: "Bonusové kredity mesačne",
    freeRefillAt: "Bezplatné kredity sa obnovia",
  },
  get: {
    title: "Kredity navyše za odber newslettera",
    titleShort: "Bonus za newsletter",
    description:
      "Zisti, či máš ešte nárok na mesačný bonus za odber newslettera. Vyžaduje sa účet.",
  },
  post: {
    title: "Získať kredity za odber newslettera",
    titleShort: "Získať bonus za odber newslettera",
    description:
      "Prihlás e-mail svojho účtu na odber newslettera a každý mesiac získaš kredity navyše. Bonus sa dá získať raz na účet.",
  },
  errors: {
    validation: {
      title: "Neplatná požiadavka",
      description: "Požiadavku sa nepodarilo spracovať",
    },
    unauthorized: {
      title: "Vyžaduje sa účet",
      description:
        "Bonus za odber newslettera získaš s účtom. Vytvor si ho zadarmo alebo sa prihlás.",
    },
    forbidden: {
      title: "Nepovolené",
      description: "Tento bonus nemôžeš získať",
    },
    notFound: {
      title: "Účet sa nenašiel",
      description: "Tvoj účet sa nenašiel",
    },
    internal: {
      title: "Niečo sa pokazilo",
      description:
        "Bonus za odber newslettera sa nepodarilo overiť. Skús znova.",
    },
  },
  success: {
    title: "Hotovo",
    description: "Stav bonusu za odber newslettera bol načítaný",
  },
  widget: {
    available: "+{{bonusCredits}} bezplatných kreditov každý mesiac",
    availableHint:
      "Prihlás adresu {{email}} na odber newslettera. Najprv pošleme potvrdzovací odkaz.",
    claim: "Získať +{{bonusCredits}} kreditov mesačne",
    pending:
      "Skontroluj schránku {{email}}. Po potvrdení odberu dostaneš +{{bonusCredits}} kreditov mesačne.",
    active: "Bonus je aktívny: +{{bonusCredits}} kreditov mesačne.",
    notEligible: "Pre tento účet bonus za newsletter nie je dostupný.",
    refill: "Bezplatné kredity sa obnovia {{date}}.",
  },
};
