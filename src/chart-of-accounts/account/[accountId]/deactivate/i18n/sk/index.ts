import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Deaktivovať účet",
    titleShort: "Deaktivovať",
    description:
      "Deaktivovať účet a zachovať jeho údaje. Systémové účty ani účty so zaúčtovanými zápismi nemožno deaktivovať.",
    accountId: {
      label: "Účet",
      description: "Účet na deaktiváciu",
      placeholder: "Vyberte účet",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné ID účtu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Systémové účty nemožno deaktivovať",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa deaktivovať účet",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: {
        title: "Má transakcie",
        description: "Účet s účtovnými zápismi nemožno deaktivovať",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: { title: "Nenašlo sa", description: "Účet sa nenašiel" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Účet deaktivovaný",
      description: "Účet je teraz neaktívny",
    },
    widget: {
      confirmWarning:
        "Tento účet bude deaktivovaný. Táto akcia nemôže byť odvolaná pre účty s vloženými transakciami.",
      doneLabel: "Hotovo",
      confirmTitle: "Deaktivovať účet?",
      confirmDescription:
        "Účet sa deaktivuje a nebude ho možné použiť pre nové účtovné zápisy. Existujúce zápisy zostanú zachované.",
      confirmButton: "Áno, deaktivujte",
      cancelButton: "Zrušiť",
    },
  },
  title: "Deaktivovať účet",
  description: "Soft-deaktivovať účet",
  category: "Účtový rozvrh",
  tag: "Účet",
};
