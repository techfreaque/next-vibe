import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Len v miestnom režime",
    },
    cannotDeleteCurrentUser:
      "Používateľa, pod ktorým beží tento proces, nemožno odstrániť",
    cannotDeleteSystemUser:
      "Systémových používateľov (UID < 1000) nemožno odstrániť",
    userNotFound: "Používateľ sa nenašiel",
  },

  delete: {
    review: "Skontrolujte miestny účet v zozname používateľov Linuxu.",
    title: "Odstrániť používateľa Linuxu",
    titleShort: "Odstrániť používateľa",
    description: "Odstrániť používateľský účet z hostiteľského systému",
    fields: {
      removeHome: {
        label: "Odstrániť domovský adresár",
        description: "Odstrániť aj domovský adresár používateľa",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description:
          "Systémové účty ani účet, pod ktorým beží tento proces, nemožno odstrániť",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa odstrániť používateľa",
      },
      notFound: { title: "Nenašlo sa", description: "Používateľ sa nenašiel" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: { title: "Neuložené zmeny" },
      conflict: {
        title: "Konflikt údajov",
        description: "Používateľa nemožno odstrániť",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      timeout: {
        title: "Časový limit",
        description: "Čas na spracovanie požiadavky vypršal",
      },
    },
    response: {
      ok: { title: "OK" },
    },
    success: {
      title: "Používateľ sa odstránil",
      description: "Používateľský účet sa zo systému odstránil",
    },
  },
};
