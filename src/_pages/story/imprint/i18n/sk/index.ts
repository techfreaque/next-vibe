import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Právne informácie o prevádzkovateľovi | {{appName}}",
    category: "Právne informácie",
    description:
      "Povinné právne informácie a údaje o prevádzkovateľovi služby {{appName}}.",
    imageAlt: "Právne informácie o prevádzkovateľovi",
    keywords:
      "právne informácie, údaje o prevádzkovateľovi, právne informácie služby {{appName}}",
    ogTitle: "Právne informácie o prevádzkovateľovi | {{appName}}",
    ogDescription:
      "Povinné právne informácie a údaje o prevádzkovateľovi služby {{appName}}.",
    twitterTitle: "Právne informácie o prevádzkovateľovi | {{appName}}",
    twitterDescription:
      "Povinné právne informácie a údaje o prevádzkovateľovi služby {{appName}}.",
  },
  printAriaLabel: "Vytlačiť právne informácie",
  onThisPage: "Na tejto stránke",
  printButton: "Vytlačiť",
  title: "Právne informácie o prevádzkovateľovi",
  lastUpdated: "Posledná aktualizácia: november 2026",
  bindingVersionNotice:
    "Preklad je určený na uľahčenie porozumenia. Právne záväzné je nemecké znenie tohto dokumentu.",
  introduction:
    "Na tejto stránke uvádzame zákonom vyžadované informácie o službe {{appName}} v súlade s uplatniteľnými právnymi predpismi.",
  sections: {
    companyInfo: {
      title: "Prevádzkovateľ",
      description: "Službu {{appName}} prevádzkuje:",
      vat: "DPH: Uplatňujeme režim pre malé podniky podľa § 19 nemeckého zákona o dani z pridanej hodnoty (UStG). DPH neúčtujeme.",
    },
    responsiblePerson: {
      title: "Zodpovedná osoba",
      description: "Údaje o osobe zodpovednej za obsah tejto webovej stránky.",
    },
    contactInfo: {
      title: "Kontaktné údaje",
      description: "Kontakt pre právne a obchodné záležitosti.",
    },
    disclaimer: {
      title: "Vylúčenie zodpovednosti",
      copyright: {
        title: "Autorské práva",
        content:
          "Všetok obsah tejto webovej stránky je chránený autorským právom. Používanie bez povolenia je zakázané.",
      },
      liability: {
        title: "Zodpovednosť",
        content:
          "Neposkytujeme žiadne vyhlásenia ani záruky týkajúce sa úplnosti, správnosti alebo spoľahlivosti informácií na tejto webovej stránke.",
      },
      links: {
        title: "Externé odkazy",
        content:
          "Naša webová stránka môže obsahovať odkazy na externé weby. Za ich obsah nezodpovedáme.",
      },
    },
    disputeResolution: {
      title: "Riešenie sporov",
      description: "Informácie o postupe pri riešení sporov.",
      content:
        "Na konaní o urovnaní sporu pred orgánom alternatívneho riešenia spotrebiteľských sporov nemáme povinnosť zúčastniť sa a ani sa na ňom nezúčastňujeme.",
    },
  },
  post: {
    title: "Právne informácie o prevádzkovateľovi",
    description: "Koncový bod právnych informácií",
    form: {
      title: "Nastavenie právnych informácií",
      description: "Nastavte parametre právnych informácií",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje v odpovedi právnych informácií",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba kontroly údajov",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera",
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
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Došlo ku konfliktu údajov",
      },
    },
    success: {
      title: "Hotovo",
      description: "Operácia sa dokončila",
    },
  },
};
