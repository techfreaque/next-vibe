import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione server",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Ricostruire e riavviare",
    titleShort: "Ricostruire",
    description:
      "Ricostruisci l'applicazione e riavvia il server Next.js in esecuzione. Esegue 6 passi in sequenza: 1) generazione di codice, 2) controllo dell'atmosfera (cancello di qualità del codice), 3) Next.js costruzione di produzione, 4) migrazioni di database, 5) database di semina, 6) hot-restart via SIGUSR1. Il controllo dell'atmosfera blocca la costruzione se ci sono errori - utilizzare 'vibe check' o lo strumento di controllo MCP per visualizzare i dettagli. WARNING: La risposta HTTP può essere ridotta perché il server si riavvia prima che la risposta venga completata.",
    form: {
      title: "Ricostruire e riavviare",
      description: "Ricostruire l'applicazione e riavviare il server",
    },
    fields: {
      framework: {
        title: "Framework",
        description: "Quadro di destinazione per costruire e riavviare",
      },
      webpack: {
        title: "Webpack",
        description: "Utilizzare webpack invece di Turbopack (default: true)",
      },
      success: {
        title: "Risultato",
      },
      errors: {
        title: "Errori",
      },
      duration: {
        title: "Durata",
      },
      steps: {
        title: "Passi",
      },
    },
    steps: {
      codegen: "Generazione del codice",
      vibeCheck: "Verifica Vibe",
      nextBuild: "Next.js costruire",
      migrate: "Migrazioni",
      seed: "Seeding",
      restart: "Riavviare",
      codegenFailed: "La generazione del codice è fallita: {{error}}",
      vibeCheckFailed:
        "Verifica Vibe: errori {{errors}}, avvisi {{warnings}}. Utilizzare 'vibe check' o lo strumento di controllo MCP per visualizzare i dettagli.",
      vibeCheckError: "Vibe check fail: {{error}}",
      buildFailed: "Next.js costruzione fallito: {{error}}",
      buildOom:
        "Next.js costruire ucciso da OS (come fuori memoria) - segnale: {{signal}}",
      buildExitCode: "Next.js costruire esce con il codice {{code}}",
      migrationFailed: "Migrazione fallita: {{error}}",
      seedingFailed: "Mancato: {{error}}",
      restartFailed: "Il riavvio del server non è riuscito: {{error}}",
      unknownError: "errore sconosciuto",
      noPidFile: "Nessun file.vibe-pid trovato - è vibe iniziare a funzionare?",
      invalidPid: "Invalid PID in.vibe-pid: {{pid}}",
      processNotRunning: "Processo {{pid}} non è in esecuzione",
      signalFailed: "Non inviare SIGUSR1: {{error}}",
    },
    errors: {
      validation: {
        title: "Convalida non riuscita",
        description: "Parametri di ricostruzione non validi forniti",
      },
      network: {
        title: "Errore di rete",
        description:
          "La connessione di rete è fallita durante la ricostruzione",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per ricostruire l'applicazione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di ricostruire l'applicazione",
      },
      notFound: {
        title: "Non trovato",
        description: "Ricostruisci risorse non trovate",
      },
      server: {
        title: "Errore del server",
        description:
          "Un errore del server interno si è verificato durante la ricostruzione",
        buildFailed: "Costruisci fallito: {{error}}",
        migrationsFailed: "Migrazioni fallite: {{error}}",
        rebuildFailed: "Ricostruire fallito: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la ricostruzione",
      },
      conflict: {
        title: "Conflitto",
        description: "Una ricostruzione è già in corso",
      },
    },
    success: {
      title: "Ricostruire Completa",
      description: "Applicazione ricostruita e riavviato server con successo",
    },
    widget: {
      rebuildComplete: "Ricostruire completo",
      rebuildFailed: "Ricostruire fallito",
      errors: "Errori:",
      runRebuild: "Esegui la ricostruzione",
      runAgain: "Correre di nuovo",
      skipped: "saltato",
    },
  },
};
