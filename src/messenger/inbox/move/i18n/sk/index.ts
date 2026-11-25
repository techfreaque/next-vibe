import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Presunúť správu",
  titleShort: "Presunúť správu",
  description: "Presunúť správu do iného priečinka",
  tag: "Doručená pošta",

  container: {
    title: "Presunúť správu",
    description: "Presunúť správu z jedného priečinka do druhého",
  },

  accountId: {
    label: "Účet",
    description: "Účet na odosielanie správ",
    placeholder: "UUID účtu",
  },
  uid: {
    label: "UID správy",
    description: "UID správy, ktorá sa má presunúť",
    placeholder: "12345",
  },
  fromFolder: {
    label: "Zdrojový priečinok",
    description: "Aktuálna cesta k priečinku",
    placeholder: "INBOX",
  },
  toFolder: {
    label: "Cieľový priečinok",
    description: "Cesta k cieľovému priečinku",
    placeholder: "Archív",
  },

  moved: { label: "Presunuté" },

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
      detail: "Presun zlyhal: {{error}}",
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
    title: "Správa presunutá",
    description: "Správa bola presunutá",
  },
};
