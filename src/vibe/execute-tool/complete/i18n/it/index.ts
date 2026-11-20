import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    remoteSync: "Sincronizzazione remota",
  },
  taskReport: {
    post: {
      title: "Relazione sull'attività",
      titleShort: "Relazione",
      description:
        "Accettare i risultati dell'esecuzione delle attività da istanze remote.",
      taskId: {
        label: "Task ID",
        description: "ID dell'attività che viene segnalato",
      },
      executionId: {
        label: "Esecuzione ID",
        description: "ID dell'esecuzione specifica",
      },
      status: {
        label: "Stato",
        description: "Stato finale dell'esecuzione delle attività",
      },
      durationMs: {
        label: "Durata (m)",
        description: "Durata dell'esecuzione in millisecondi",
      },
      summary: {
        label: "Riepilogo",
        description:
          "Riepilogo leggibile dall'uomo del risultato dell'esecuzione",
      },
      error: {
        label: "Errore",
        description: "Messaggio di errore se l'esecuzione non è riuscita",
      },
      serverTimezone: {
        label: "Timezone del server",
        description: "Timezone del server di esecuzione",
      },
      executedByInstance: {
        label: "Eseguita da",
        description: "Tribunale di primo grado ID che ha eseguito il compito",
      },
      output: {
        label: "Produzione",
        description: "Dati di output strutturati dall'attività",
      },
      startedAt: {
        label: "Iniziato a",
        description: "timestamp ISO quando l'esecuzione è iniziata",
      },
      wakeUpContext: {
        label: "Contesto di rinascita",
        description:
          "Il contesto revival del filo riecheggiato dalla richiesta di spedizione. permette al chiamante di rivivere senza un record di attività locale",
      },
      processed: {
        label: "Elaborazione",
        description: "Se la relazione è stata accettata",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Resoconto non valido carico utile",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        internal: {
          title: "Errore di elaborazione",
          description:
            "Si è verificato un errore durante l'elaborazione della relazione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di inviare report",
        },
        notFound: {
          title: "Non trovato",
          description: "Compito non trovato",
        },
        network: {
          title: "Errore di rete",
          description:
            "Non è possibile raggiungere il punto finale della relazione",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        conflict: {
          title: "Conflitto",
          description: "Rapporto di conflitto rilevato",
        },
      },
      success: {
        title: "Relazione Accettata",
        description: "Relazione attività elaborata con successo",
      },
    },
  },
};
