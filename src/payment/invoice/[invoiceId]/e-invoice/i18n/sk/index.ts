import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Elektronická faktúra",
  titleShort: "E-faktúra",
  description:
    "Exportujte vystavenú faktúru alebo dobropis ako súbor Peppol BIS Billing 3.0 (UBL, EN 16931).",
  invoiceId: {
    label: "Faktúra",
    description: "Vystavená faktúra alebo dobropis na export",
  },
  buyerReference: {
    label: "Referencia odberateľa",
    description:
      "Zadajte referenciu od odberateľa. Pri nemeckom verejnom úrade zadajte jeho Leitweg-ID.",
  },
  response: {
    invoiceNumber: "Číslo dokladu",
    isCreditNote: "Dobropis",
    fileName: "Názov súboru",
    ready: "Pripravené na odoslanie",
    missingFields: "Chýbajúce údaje",
    xml: "XML",
  },
  widget: {
    peppol: "Stiahnuť XML Peppol",
    slovak: "Stiahnuť XML eFaktúry",
    xrechnung: "XML XRechnung",
    send: "Odoslať cez Peppol",
    providerNeeded:
      "Pripojte certifikovaného digitálneho poštára a zaregistrujte Peppol ID vystavovateľa.",
    back: "Späť",
    submit: "Pripraviť e-faktúru",
    invoice: "Faktúra {{number}}",
    creditNote: "Dobropis {{number}}",
    ready: "Pripravené. Všetky povinné údaje podľa EN 16931 sú vyplnené.",
    missing: "Pred odoslaním súboru doplňte tieto údaje:",
    download: "Stiahnuť XML",
    copy: "Kopírovať XML",
    copied: "XML skopírované",
    copyFailed: "XML sa nepodarilo skopírovať",
    preview: "Zobraziť XML",
    disclaimer: "Poskytujeme nástroje, nie daňové poradenstvo.",
  },
  fields: {
    bt10: "Referencia odberateľa",
    bt35: "Ulica dodávateľa",
    bt37: "Obec dodávateľa",
    bt38: "PSČ dodávateľa",
    bt42: "Telefón dodávateľa",
    bt43: "E-mail dodávateľa",
    bt50: "Ulica odberateľa",
    bt52: "Obec odberateľa",
    bt53: "PSČ odberateľa",
    bt1: "Číslo dokladu",
    bt2: "Dátum vyhotovenia",
    bt5: "Mena",
    bt9: "Dátum splatnosti",
    bt27: "Názov Vašej firmy",
    bt31: "Vaše IČ DPH",
    bt34: "Vaša elektronická adresa (IČ DPH, DIČ alebo IČO)",
    bt40: "Krajina Vašej firmy",
    bt44: "Názov odberateľa",
    bt48: "IČ DPH odberateľa",
    bt49: "Elektronická adresa odberateľa (IČ DPH, DIČ alebo IČO)",
    bt55: "Adresa odberateľa s krajinou",
    bt153: "Popis na každej položke",
    bg25: "Aspoň jedna položka",
  },
  errors: {
    validation: {
      title: "Neplatná požiadavka",
      description: "Skontrolujte odkaz na faktúru.",
    },
    network: {
      title: "Chyba siete",
      description: "E-faktúru sa nepodarilo načítať.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na export e-faktúr sa, prosím, prihláste.",
    },
    forbidden: {
      title: "Bez prístupu",
      description: "K tomuto dokladu nemáte prístup.",
    },
    notFound: {
      title: "Doklad sa nenašiel",
      description: "Táto faktúra neexistuje.",
    },
    server: {
      title: "Export zlyhal",
      description:
        "E-faktúru sa nepodarilo vytvoriť. Skúste to, prosím, znova.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Niečo sa pokazilo.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv uložte zmeny.",
    },
    conflict: {
      title: "Ešte nevystavená",
      description: "Pred exportom do e-faktúry faktúru vystavte.",
    },
  },
  success: {
    title: "E-faktúra pripravená",
    description: "Súbor Peppol je pripravený.",
  },
  tags: { payment: "platba", invoice: "faktúra", eInvoice: "e-faktúra" },
};
