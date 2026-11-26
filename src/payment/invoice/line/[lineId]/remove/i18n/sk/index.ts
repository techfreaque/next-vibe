import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    lines: "riadky",
  },
  post: {
    title: "Odstrániť faktúrový riadok",
    titleShort: "Odstrániť riadok",
    description: "Odstrániť riadkovú položku z návrhu faktúry",
    form: {
      title: "Odstrániť riadok",
      description: "Trvalo odstráni tento riadok z faktúry",
    },
    response: {
      invoiceId: "Faktúra",
      success: "Položka odstránená",
      message: "Stavová správa",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Požadované overenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Položka sa nenašla.",
      },
      conflict: {
        title: "Konflikt",
        description: "Faktúra nie je v stave návrhu",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Líniová položka stiahnutá z faktúry",
    },
  },
  lineId: {
    label: "ID riadku",
    description: "ID riadkovej položky na odstránenie",
    placeholder: "Zadajte ID riadku",
  },
  widget: {
    lineActions: "Akcie",
    remove: "Odstrániť",
    removeNamed: "Odstrániť položku {{description}}",
    cancel: "Zrušiť",
    lineTotal: "Suma položky",
    back: "Späť",
    submit: "Odstrániť riadok",
    warning: "Tým sa natrvalo odstráni položka riadku z faktúry.",
    confirm: "Odstrániť riadok",
    removed: "Odstránená riadková položka",
  },
};
