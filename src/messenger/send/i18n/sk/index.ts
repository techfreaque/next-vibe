/**
 * English translations for unified Messenger Send endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Odoslať správu",
  titleShort: "Odoslať správu",
  description:
    "Odošle správu cez vybraný kanál (e-mail, SMS, WhatsApp alebo Telegram)",
  category: "Správy",
  tag: "Poslať",

  container: {
    title: "Odoslať správu",
    description: "Odoslať správu cez nastavený účet",
  },

  accountId: {
    label: "Účet na odosielanie správ",
    description: "Účet, z ktorého sa správa odošle",
    placeholder: "Vyberte UUID účtu",
  },
  to: {
    label: "Príjemca",
    description: "E-mailová adresa, telefónne číslo alebo ID četu",
    placeholder: "user@example.com alebo +12025551234",
  },
  toName: {
    label: "Meno príjemcu",
    description: "Zobrazované meno príjemcu (nepovinné)",
    placeholder: "John Doe",
  },
  subject: {
    label: "Predmet",
    description: "Nepovinný predmet e-mailu. Ostatné kanály ho nepoužívajú.",
    placeholder: "Zadajte predmet…",
  },
  text: {
    label: "Správa",
    description:
      "Neformátovaný text pre SMS, WhatsApp a Telegram. Pri e-maile slúži ako alternatíva k obsahu HTML.",
    placeholder: "Zadajte správu…",
  },
  html: {
    label: "Obsah HTML",
    description:
      "Obsah HTML len pre e-mail. Ak ho nevyplníte, použije sa obyčajný text.",
    placeholder: "<p>Zadajte obsah e-mailu v HTML…</p>",
  },
  senderName: {
    label: "Meno odosielateľa",
    description: "Zobrazované meno odosielateľa e-mailu (nepovinné)",
    placeholder: "Vaša spoločnosť",
  },
  replyTo: {
    label: "Adresa na odpoveď",
    description: "E-mailová adresa pre odpovede (nepovinná)",
    placeholder: "support@example.com",
  },
  leadId: {
    label: "ID kontaktu",
    description: "Pridružený kontakt na sledovanie (nepovinné)",
    placeholder: "UUID",
  },
  campaignId: {
    label: "ID kampane",
    description: "Pridružená kampaň na sledovanie (nepovinné)",
    placeholder: "UUID",
  },

  response: {
    title: "Výsledok odoslania",
    description: "Výsledok odoslania správy",
    messageId: { label: "ID správy" },
    accountName: { label: "Účet" },
    channel: { label: "Kanál" },
    provider: { label: "Poskytovateľ" },
    sentAt: { label: "Odoslané" },
  },

  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Skontrolujte zadané údaje a skúste to znova",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Nemáte oprávnenie odosielať správy",
    },
    server: {
      title: "Chyba servera",
      description: "Pri odosielaní nastala chyba interného servera",
      detail: "Odoslanie zlyhalo: {{error}}",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup k tomuto zdroju je zakázaný",
    },
    network: {
      title: "Chyba siete",
      description: "Pri odosielaní nastala sieťová chyba",
    },
    notFound: {
      title: "Účet sa nenašiel",
      description: "Zadaný účet na odosielanie správ sa nenašiel",
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
    title: "Správa odoslaná",
    description: "Správa bola odoslaná",
  },
};
