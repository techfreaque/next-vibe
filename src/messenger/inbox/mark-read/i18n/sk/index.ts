import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zmeniť stav prečítania",
  titleShort: "Zmeniť stav prečítania",
  description: "Označiť správu ako prečítanú alebo neprečítanú",
  tag: "Doručená pošta",

  container: {
    title: "Označiť správu",
    description: "Zmeniť, či je správa prečítaná",
  },

  accountId: {
    label: "Účet",
    description: "Účet na odosielanie správ",
    placeholder: "UUID účtu",
  },
  uid: {
    label: "UID správy",
    description: "UID správy",
    placeholder: "12345",
  },
  folderPath: {
    label: "Priečinok",
    description: "Cesta k priečinku, ktorý obsahuje správu",
    placeholder: "INBOX",
  },
  isRead: {
    label: "Označiť ako prečítané",
    description:
      "Hodnota true označí správu ako prečítanú. Hodnota false ju označí ako neprečítanú.",
  },

  updated: { label: "Aktualizované" },

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
      detail: "Stav prečítania sa nepodarilo zmeniť: {{error}}",
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
    title: "Správa aktualizovaná",
    description: "Stav prečítania sa zmenil",
  },
};
