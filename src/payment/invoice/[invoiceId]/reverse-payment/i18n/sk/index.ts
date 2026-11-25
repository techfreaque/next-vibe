import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stornovať prijatú platbu zákazníka",
  description: "Uveďte dôvod storna. Pôvodný zápis zostane v účtovnom denníku.",
  invoiceId: "Referencia faktúry",
  entryId: "Referencia zaúčtovania prijatej platby",
  date: "Dátum storna",
  reason: "Dôvod storna",
  reasonPlaceholder: "Napríklad banka vrátila platbu",
  datePlaceholder: "Dnes",
  viewInvoice: "Zobraziť faktúru",
  reversal: "Účtovný zápis storna",
  originalDate: "Dátum pôvodnej úhrady",
  receiptAmount: "Suma úhrady",
  postingStatus: "Stav zaúčtovania",
  viewReversal: "Zobraziť stornovací zápis",
  cancel: "Zrušiť",
  confirmTitle: "Zaúčtovať storno tejto prijatej platby?",
  confirm: "Zaúčtovať storno",
  success: {
    title: "Prijatá platba stornovaná",
    description: "Zostatok faktúry sa upravil o stornovanú úhradu.",
  },
  invalidDate: "Zadajte dátum od pôvodnej úhrady do dnešného dňa vrátane.",
  noPeriod: "Pre tento dátum nie je otvorené účtovné obdobie.",
  invalidReceipt: "Túto úhradu nemožno pri danej faktúre stornovať.",
  invalidLines:
    "Položky úhrady sú neúplné alebo patria inej spoločnosti či mene.",
  errors: {
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa.",
    },
    validation: {
      title: "Neplatné údaje",
      description: "Skontrolujte údaje o úhrade.",
    },
    server: {
      title: "Chyba servera",
      description: "Na serveri sa vyskytla chyba.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba.",
    },
    network: {
      title: "Chyba siete",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáte potrebné oprávnenie.",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Faktúra sa nenašla.",
    },
    conflict: {
      title: "Konflikt",
      description: "Faktúra je už uhradená alebo stornovaná",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny.",
    },
  },
  tags: { payment: "úhrada", invoice: "faktúra" },
};
