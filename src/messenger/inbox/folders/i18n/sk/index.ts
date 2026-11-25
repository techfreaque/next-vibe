import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zobraziť priečinky",
  titleShort: "Priečinky",
  description: "Zobraziť dostupné priečinky účtu na odosielanie správ",
  tag: "Doručená pošta",

  container: {
    title: "Priečinky",
    description: "Dostupné priečinky vybraného účtu",
  },

  accountId: {
    label: "Účet",
    description: "Účet, ktorého priečinky sa majú načítať",
    placeholder: "UUID účtu",
  },

  folders: {
    label: "Priečinky",
    path: { label: "Cesta" },
    name: { label: "Názov" },
    displayName: { label: "Zobrazované meno" },
    specialUseType: { label: "Typ" },
    messageCount: { label: "Správy" },
    unseenCount: { label: "Neprečítané" },
  },

  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Skontrolujte zadané údaje",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    server: {
      title: "Chyba servera",
      description: "Interná chyba servera",
      detail: "Nepodarilo sa načítať priečinky: {{error}}",
    },
    unknown: { title: "Neznáma chyba", description: "Neočakávaná chyba" },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    network: { title: "Chyba siete", description: "Chyba siete" },
    notFound: {
      title: "Účet sa nenašiel",
      description: "Účet na odosielanie správ sa nenašiel",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Požiadavka je v rozpore s existujúcimi údajmi",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
  },

  success: {
    title: "Priečinky načítané",
    description: "Priečinky boli načítané",
  },
};
