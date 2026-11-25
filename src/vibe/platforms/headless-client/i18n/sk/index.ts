import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Klient bez používateľského rozhrania",
    titleShort: "headless",
    description:
      "Spustiť klienta vzdialeného pripojenia bez používateľského rozhrania",
    form: {
      title: "Klient bez používateľského rozhrania",
      description:
        "Spustí spätné pripojenia WebSocket a službu na vykonávanie nástrojov. Webový server sa nespustí.",
    },
    fields: {
      computerName: {
        title: "Názov počítača",
        description:
          "Identifikátor počítača. Predvolene sa použije názov hostiteľa z operačného systému.",
      },
      remoteUrl: {
        title: "Adresa vzdialenej inštancie",
        description:
          "Adresa URL cloudovej inštancie, ku ktorej sa má klient pripojiť",
      },
      leadId: {
        title: "ID kontaktu",
        description: "UUID vášho kontaktu na vzdialenej inštancii",
      },
      token: { title: "Token", description: "Token na overenie pripojenia" },
      output: { title: "Výstup" },
    },
    errors: {
      validation: {
        title: "Chyba pri validácii",
        description: "Neplatný vstup",
      },
      network: { title: "Chyba siete", description: "Chyba siete" },
      unauthorized: { title: "Bez oprávnenia", description: "Bez oprávnenia" },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      server: { title: "Chyba servera", description: "Chyba servera" },
      unknown: { title: "Neznáma chyba", description: "Neznáma chyba" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      migrationFailed: "Migrácia zlyhala",
      migrationError: "Chyba pri migrácii",
    },
    success: {
      title: "Klient bez používateľského rozhrania sa spustil",
      description:
        "Spätné pripojenia WebSocket sú otvorené. Čaká sa na požiadavky na spustenie nástrojov.",
    },
  },
};
