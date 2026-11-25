import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Doplniť embeddingy",
    titleShort: "Doplniť",
    description: "Vytvorí embeddingy pre všetky uzly Cortexu, ktorým chýbajú.",
    status: {
      loading: "Vytvárajú sa embeddingy…",
      done: "Hotovo",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "Vytvorí embeddingy pre všetky uzly Cortexu, ktorým chýbajú. Môže to chvíľu trvať.",
    },
    fields: {
      force: {
        label: "Vynútiť opätovné vytvorenie",
        description:
          "Odstráni všetky existujúce embeddingy a vygeneruje ich znova iba z obsahu. Použi po zmene formátu embeddingov.",
      },
    },
    submitButton: {
      label: "Spustiť dopĺňanie",
      loadingText: "Spracúva sa…",
    },
    response: {
      materialized: { text: "Sprístupnené uzly" },
      processed: { text: "Vektorizované uzly" },
      failed: { text: "Zlyhalo" },
      skipped: { text: "Preskočené" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Neplatná požiadavka",
      },
      network: {
        title: "Offline",
        description: "So serverom sa nedá spojiť",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Iba pre správcu",
        description: "Vyžaduje sa oprávnenie správcu",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Služba na vytváranie embeddingov zlyhala",
      },
      unknown: {
        title: "Chyba",
        description: "Niečo sa pokazilo.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: {
        title: "Už beží",
        description: "Dopĺňanie embeddingov už prebieha.",
      },
    },
    success: {
      title: "Dopĺňanie dokončené",
      description: "Všetky embeddingy sa spracovali",
    },
  },
};
