import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zastaviť všetky kampane",
  description: "Zastaviť všetky aktívne e-mailové kampane",
  post: {
    title: "Zastaviť všetky kampane",
    titleShort: "Zastaviť kampane",
    description:
      "Okamžite zastaví všetky aktívne e-mailové kampane a zruší čakajúce správy",
    fields: {
      confirm: {
        label: "Potvrdiť zastavenie",
        description: "Začiarknite políčko, ak chcete zastaviť všetky kampane",
      },
      reason: {
        label: "Dôvod",
        description: "Dôvod zastavenia (voliteľný)",
      },
    },
    response: {
      halted: "Zastavené kampane",
      emailsCancelled: "Zrušené e-maily",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Chýba oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Kampane sa nepodarilo zastaviť",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Potvrdenie musí byť začiarknuté",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: { title: "Chyba siete", description: "Chyba siete" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
    },
    success: {
      title: "Kampane zastavené",
      description: "Všetky kampane sa úspešne zastavili",
    },
  },
  widget: {
    title: "Núdzové zastavenie",
    description:
      "Okamžite zastaví všetky aktívne e-mailové kampane. Použite pri chybe alebo naliehavom probléme.",
    haltButton: "Zastaviť všetky kampane",
    halting: "Zastavujú sa kampane…",
    confirmTitle: "Zastaviť všetky kampane?",
    confirmDescription:
      "Táto akcia okamžite zastaví všetky aktívne e-mailové kampane a zruší čakajúce správy. Nedá sa vrátiť.",
    confirmButton: "Áno, zastaviť všetky kampane",
    cancelButton: "Zrušiť",
    done: "Zastavené",
  },
};
