import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    ar: "pohľadávky",
  },
  post: {
    title: "Stornovať faktúru",
    titleShort: "Stornovať faktúru",
    description:
      "Stornovať koncept alebo otvorenú faktúru. Uhradené faktúry nemožno stornovať. Existujúci účtovný zápis sa stornuje.",
    form: {
      title: "Stornovať faktúru",
      description: "Túto operáciu nemožno vrátiť späť.",
    },
    response: {
      success: "Faktúra bola stornovaná",
      message: "Stavová správa",
    },
    errors: {
      appliedPayments:
        "Faktúru s priradenou platbou alebo uplatneným dobropisom nemožno stornovať.",
      reversalPosting:
        "Pred stornovaním skontrolujte pôvodné zaúčtovanie a otvorené účtovné obdobie.",
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
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
        title: "Storno nie je možné",
        description: "Uhradené faktúry nemožno stornovať",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Faktúra bola stornovaná",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "ID faktúry, ktorú chcete stornovať",
    placeholder: "Zadajte ID faktúry",
  },
  widget: {
    invoice: "Faktúra",
    total: "Suma faktúry",
    customer: "Zákazník",
    openInvoice: "Otvoriť faktúru",
    retry: "Skúsiť znova",
    loading: "Načítava sa faktúra…",
    unavailable: "Faktúra nie je dostupná",
    reversal: "Storno s dnešným dátumom vyrovná otvorenú pohľadávku.",
    cancelOnly: "Faktúra bude zrušená.",
    ineligible:
      "Stornovať môžete koncept alebo neuhradenú faktúru bez priradených platieb či dobropisov.",
    back: "Späť",
    submit: "Stornovať faktúru",
    warning: "Faktúra sa natrvalo stornuje. Operáciu nemožno vrátiť späť.",
    confirm: "Stornovať faktúru",
    voided: "Faktúra bola stornovaná",
    backToList: "Späť na faktúry",
  },
};
