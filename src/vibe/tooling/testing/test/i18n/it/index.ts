import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Esegui i test",
  titleShort: "Esegui i test",
  description: "Eseguire suite di prova con configurazioni opzionali",
  category: "Testing",
  tag: "Test",

  container: {
    title: "Configurazione dei test",
    description: "Configurare i parametri di esecuzione del test",
  },

  fields: {
    path: {
      label: "Sentiero di prova",
      description: "Percorso per testare file o directory",
      placeholder: "src/",
    },
    verbose: {
      label: "Uscita Verbose",
      description: "Abilitare l'output di prova dettagliato",
    },
    watch: {
      label: "Modalità di orologio",
      description:
        "Eseguire i test in modalità orologio per le modifiche dei file",
    },
    coverage: {
      label: "Rapporto di copertura",
      description: "Generare report di copertura dei test",
    },
  },

  response: {
    success: "Stato dell'esecuzione del test",
    output: "Emissione di prova e risultati",
    duration: "Durata dell'esecuzione del test (ms)",
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri di configurazione di test non validi",
    },
    internal: {
      title: "Errore interno",
      description: "Esecuzione del test non riuscita a causa di errore interno",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Permesso negato per l'esecuzione di prova",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Esecuzione del test è vietata",
    },
    notFound: {
      title: "Non trovato",
      description: "File di prova o directory non trovata",
    },
    server: {
      title: "Errore del server",
      description: "Errore del server durante l'esecuzione della prova",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    unsaved: {
      title: "Modifiche non salvate",
      description:
        "Ci sono cambiamenti non rilevati che possono influenzare i test",
    },
    conflict: {
      title: "Conflitto",
      description: "Rilevato conflitto di esecuzione di test",
    },
    executionFailed:
      "Esecuzione del test non riuscita dopo {{duration}} ms: {{detail}}\n{{output}}",
    // The EN wording of `streamingUnsupported` is load-bearing: test-endpoint.ts
    // probes response messages for "Streaming responses are not supported" to tell
    // test-infrastructure failures from real endpoint errors. Keep that substring.
    streamingUnsupported:
      "Le risposte di streaming non sono supportate nei test",
    responseSchemaFailed:
      "La validazione dello schema di risposta è fallita per {{path}}: {{issues}}",
    requestFailed: "La richiesta di prova non è riuscita: {{detail}}",
    browser: {
      serverNotRunning:
        "Atlas dev server non è in esecuzione - avviare con vibe dev",
      openFailed: "Non è possibile aprire la pagina del browser: {{detail}}",
      fillFailed: "Non poteva riempire i campi di modulo: {{detail}}",
      submitFailed:
        "Non è possibile fare clic sul pulsante di invio: {{detail}}",
      evaluateFailed:
        "La valutazione degli script nella pagina è fallita: {{detail}}",
      resultTimeout:
        "Nessun risultato di mutazione è arrivato entro {{timeoutMs}} ms",
      parseFailed:
        "Non è possibile analizzare la risposta cache come JSON: {{raw}}",
      cacheEmpty: "La cache di mutazione è vuota - la risposta non carica mai",
      requestFailed: "Prova del browser guasto: {{detail}}",
    },
  },

  success: {
    title: "Test completati",
    description: "Esecuzione test completata con successo",
  },
};
