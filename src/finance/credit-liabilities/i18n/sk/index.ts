import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Záväzky za kredity zákazníkov",
  description:
    "Skontrolujte zaúčtované záväzky za zaplatené balíky kreditov priradené tejto firme.",
  tag: "Záväzky za kredity",
  company: "Firma",
  choose:
    "Vyberte firmu, ktorej zaúčtované záväzky za kredity chcete zobraziť.",
  empty: "Žiadne priradené zápisy za zaplatené kredity",
  account: "Účtovný účet",
  currency: "Mena",
  amount: "Zaúčtovaný zostatok",
  asOf: "Stav k",
  reportDay: "Do {{date}} (UTC)",
  scope:
    "Prehľad zahŕňa priradené predaje, refundácie, uznané výnosy a storno zápisy. Kredity v peňaženkách a sumy bez overeného priradenia k firme sa nezobrazujú.",
  ledgerScope:
    "Otvorte účet a pozrite si úplnú hlavnú knihu vrátane zápisov mimo tohto prehľadu.",
  supplierLink: "Skontrolovať preddavky dodávateľom",
  errors: {
    validation: {
      title: "Skontrolujte vybranú firmu",
      description: "Vyberte aktívnu firmu, ku ktorej máte prístup.",
    },
    forbidden: {
      title: "Vyžaduje sa prístup k firme",
      description: "K tejto firme nemáte prístup.",
    },
    server: {
      title: "Záväzky za kredity sa nepodarilo načítať",
      description: "Skúste prehľad načítať znova.",
    },
  },
};
