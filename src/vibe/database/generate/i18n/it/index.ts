import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operazioni del database",
  tag: "migration",
  post: {
    title: "Generare le migrazioni",
    titleShort: "Generare le migrazioni",
    description:
      "Generare i file di migrazione Drizzle dai cambiamenti dello schema",
    form: {
      title: "Generare la configurazione",
      description: "Configurare le opzioni di generazione di migrazione",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      network: {
        title: "Generazione fallita",
        description: "drizzle-kit genera guasto",
        detail: "drizzle-kit genera guasto: {{error}}",
        exitCode: "drizzle-kit generare espulso con il codice {{code}}",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Autorizzazioni insufficienti",
      },
      notFound: { title: "Non trovato", description: "Risorse non trovate" },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      conflict: { title: "Conflitto", description: "Rilevato conflitto" },
    },
    success: {
      title: "Generazione Successo",
      description: "I file di migrazione generati con successo",
    },
  },
  fields: {
    success: { title: "Stato di successo" },
    output: { title: "Produzione" },
    duration: { title: "Durata (m)" },
  },
};
