import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Pulizia di Vibe Sense",
    description:
      "Elimina i dati meno recenti e le istantanee scadute dalla cache.",
  },
  graphRunner: {
    name: "Esecuzione dei grafi di Vibe Sense",
    description: "Esegue i grafi di elaborazione pianificati con cron.",
  },
  post: {
    title: "Detergente di Vibe",
    titleShort: "Detergente di senso",
    description:
      "Eseguire la pulizia della ritenzione per i punti di dati e scadere snapshot",
    response: {
      nodesProcessed: "Nomi trattati",
      totalDeleted: "Righe cancellate",
      snapshotsDeleted: "Istantanee cancellate",
      graphsChecked: "Grafi controllati",
      graphsExecuted: "Grafi eseguiti",
    },
    success: {
      title: "Pulizia completa",
      description: "Pulizia della conservazione finito",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: {
        title: "Errore del server",
        description: "La pulizia non è riuscita",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Richiesta non valida",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Account o sessione non trovati",
      },
      conflict: { title: "Conflitto", description: "Conflitto" },
      network: {
        title: "Errore di rete",
        description: "La richiesta di rete è fallita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima",
      },
    },
  },
};
