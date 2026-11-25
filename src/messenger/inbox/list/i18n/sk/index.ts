import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zobraziť doručenú poštu",
  titleShort: "Doručená pošta",
  description: "Zobraziť správy z doručenej pošty alebo vybraného priečinka",
  tag: "Doručená pošta",

  container: {
    title: "Správy v doručenej pošte",
    description: "Správy z vybraného účtu a priečinka",
  },

  accountId: {
    label: "Účet",
    description: "Účet, z ktorého sa má načítať doručená pošta",
    placeholder: "UUID účtu",
  },
  folderPath: {
    label: "Priečinok",
    description:
      "Cesta k priečinku, ktorého správy sa majú načítať. Predvolená hodnota je INBOX.",
    placeholder: "INBOX",
  },

  messages: {
    label: "Správy",
    uid: { label: "UID" },
    messageId: { label: "ID správy" },
    subject: { label: "Predmet" },
    from: { label: "Od" },
    to: { label: "Komu" },
    date: { label: "Dátum" },
    isRead: { label: "Prečítané" },
    isFlagged: { label: "Označené príznakom" },
    folderPath: { label: "Priečinok" },
    bodyText: { label: "Obsah správy" },
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
      detail: "Doručenú poštu sa nepodarilo načítať: {{error}}",
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
    title: "Doručená pošta načítaná",
    description: "Správy boli načítané",
  },
};
