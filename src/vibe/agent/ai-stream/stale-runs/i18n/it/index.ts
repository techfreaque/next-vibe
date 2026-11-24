import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Manutenzione",
  },
  post: {
    title: "Reapertore di corsa Stale",
    titleShort: "Stale Runs",
    description:
      "Frees chat thread bloccato in 'streaming' dopo il processo di scrittura la risposta è morta. Mantiene la risposta parziale, segna l'interruzione e avvia qualsiasi messaggio in coda. Le corse dal vivo su qualsiasi nodo non sono mai toccate.",
    container: {
      title: "Reapertore di corsa Stale",
      description: "Anteprima o filetti bloccati gratuiti",
    },
    fields: {
      localThresholdMinutes: {
        label: "Soglia locale (min)",
        description:
          "Ripristina una corsa locale una volta che il suo proprietario non ha inviato un battito cardiaco per questo lungo",
      },
      remoteThresholdMinutes: {
        label: "Soglia remota (min)",
        description:
          "Ripristinare una corsa loop su un'altra istanza una volta che nulla è arrivato per questo lungo",
      },
      batchSize: {
        label: "Filati max",
        description: "Limite superiore di fili liberati per corsa",
      },
      dryRun: {
        label: "Simulazione",
        description: "Elencare i filetti bloccati, non cambiare nulla",
      },
    },
    response: {
      candidates: "Trovati i filetti stuck",
      reaped: "Filetti liberati",
      lost: "Asciutto: tornato in vita",
      failed: "Sfigato",
      queuedStarted: "I messaggi queued sono iniziati",
      threadIds: "ID filettati",
      executionTimeMs: "Tempo di esecuzione (ms)",
    },
    success: {
      title: "Nuoto fatto",
      description: "Fili di bloccaggio liberati",
    },
  },
  interrupted: {
    content:
      "Il server ha ricominciato mentre questa risposta era scritta. La risposta parziale viene salvata. Cercate di continuare.",
  },
  errors: {
    failed: "Stale run spazzata fallita: {{error}}",
    server: {
      title: "Errore del sudore",
      description: "La spazzata di corsa stale non è riuscita",
    },
  },
  task: {
    name: "Sblocco delle esecuzioni interrotte",
    description:
      "Ogni 5 minuti sblocca le conversazioni rimaste in streaming dopo l’interruzione del processo che stava rispondendo.",
  },
};
