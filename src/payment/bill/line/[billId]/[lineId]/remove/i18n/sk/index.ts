import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    bill: "dodávateľská faktúra",
    lines: "riadky",
  },
  post: {
    title: "Odstrániť položku faktúry",
    titleShort: "Odstrániť riadok",
    description: "Odstráňte položku z rozpracovanej dodávateľskej faktúry",
    form: {
      title: "Odstrániť riadok",
      description: "Odstráni túto položku z rozpracovanej faktúry.",
    },
    response: {
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
        description:
          "Položku možno odstrániť iba z rozpracovanej dodávateľskej faktúry, ktorú možno upravovať.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Položka bola odstránená.",
    },
  },
  billId: {
    label: "Dodávateľská faktúra",
    description: "Dodávateľská faktúra s položkou na odstránenie",
  },
  lineId: {
    label: "ID riadku",
    description: "ID riadkovej položky na odstránenie",
    placeholder: "Zadajte ID riadku",
  },
  widget: {
    verifying: "Overuje sa vybratá položka…",
    unavailable:
      "Túto položku už nemožno odstrániť. Znova otvorte rozpracovanú faktúru a skontrolujte jej položky.",
    lineGross: "Suma položky s DPH: {{amount}}",

    back: "Späť",
    submit: "Odstrániť riadok",
    warning: "Položka sa natrvalo odstráni a celková suma sa prepočíta.",
    confirm: "Odstrániť riadok",
    removed: "Odstránená riadková položka",
  },
};
