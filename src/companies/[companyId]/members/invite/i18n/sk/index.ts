import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Jednotlivec",
    },
    companyMemberRole: {
      owner: "Vlastník",
      admin: "Správca",
      member: "Člen",
      accountant: "Účtovník",
      viewer: "Čitateľ",
    },
  },
  tags: {
    companies: "Firmy",
    members: "Členovia",
    invite: "Pozvať",
  },
  post: {
    title: "Pozvať člena",
    titleShort: "Pozvať člena",
    description: "Pozvite registrovaného používateľa do firmy e-mailom.",
    companyId: {
      label: "ID firmy",
      description: "Firma, do ktorej chcete používateľa pozvať",
    },
    email: {
      label: "E-mail používateľa",
      description: "E-mail registrovaného používateľa, ktorého chcete pozvať",
      placeholder: "colleague@company.com",
    },
    role: {
      label: "Rola",
      description: "Rola, ktorú chcete prideliť novému členovi",
      placeholder: "Vyberte rolu",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte e-mail a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na pozývanie členov sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Členov môže pozývať iba správca alebo vlastník",
      },
      conflict: {
        title: "Používateľ už je členom",
        description: "Tento používateľ už je členom firmy",
      },
      server: {
        title: "Chyba servera",
        description: "Niečo sa pokazilo. Skúste znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste to znova",
      },
      notFound: {
        title: "Používateľ sa nenašiel",
        description:
          "Nenašiel sa žiadny registrovaný používateľ s týmto e-mailom",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Člen pozvaný",
      description: "Používateľ bol pridaný do firmy",
    },
    response: {
      memberId: "ID člena",
      userId: "ID používateľa",
      role: "Rola",
    },
    widget: {
      back: "Späť k členom",
      invited: "Pozvaný člen",
    },
  },
};
