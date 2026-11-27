import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "Inattivo",
  running: "In corso",
  completed: "Completato",
  interrupted: "Interrotto",
  failed: "Non riuscito",
  "read-only": "Sola lettura",
  "workspace-write": "Scrittura nell'area di lavoro",
  "danger-full-access": "Accesso completo",
  codingAgent: {
    tags: {
      tasks: "Compiti",
    },
    run: {
      post: {
        title: "Avvia agente di programmazione",
        titleShort: "Agente di programmazione",
        dynamicTitle: "Agente di programmazione: {{prompt}}",
        description:
          "Esegue un compito con Claude Code, OpenCode, Codex o Antigravity. Indica un nome per salvare e riprendere la conversazione con guida in tempo reale, oppure attiva interactiveMode=true per aprire un terminale.",
        fields: {
          name: {
            label: "Nome agente",
            description:
              "Nome persistente facoltativo (da 1 a 40 lettere, cifre, trattini o trattini bassi). Riusare il nome riprende la conversazione.",
          },
          prompt: {
            label: "Compito",
            description:
              "Il compito o la domanda da inviare all'agente. Indica percorsi file, contesto e verifiche attese.",
          },
          promptFile: {
            label: "File del compito",
            description:
              "Percorso del file di istruzioni relativo alla cartella corrente. Alternativa al testo diretto.",
          },
          provider: {
            label: "Provider",
            description:
              "CLI da usare: claude-code, open-code, codex o antigravity. Predefinito codex per nuovi agenti con nome, claude-code per esecuzioni senza nome.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "Modello",
            description:
              "ID modello del provider. Lascia vuoto per il predefinito (Antigravity usa Gemini 4 Neon High, Codex usa gpt-6.2-sol).",
          },
          effort: {
            label: "Livello di ragionamento",
            description:
              "Livello di ragionamento per Codex o Antigravity (es. low, medium, high).",
          },
          sandbox: {
            label: "Sandbox Codex",
            description:
              "Isolamento file per Codex (read-only, workspace-write o danger-full-access).",
          },
          cwd: {
            label: "Cartella di lavoro",
            description:
              "Cartella in cui lavora l'agente. Predefinita la cartella corrente.",
          },
          fresh: {
            label: "Nuova conversazione",
            description:
              "Avvia una nuova conversazione invece di riprendere il thread salvato per questo nome.",
          },
          taskTitle: {
            label: "Titolo del compito",
            description:
              "Titolo breve per archiviare il compito. Generato automaticamente dal prompt se omesso.",
          },
          interactiveMode: {
            label: "Modalità interattiva",
            description:
              "false (PREDEFINITO): esegue senza interfaccia e restituisce l'output. true: apre una finestra terminale dal vivo e invia il risultato al termine.",
          },
          output: {
            label: "Output",
            description:
              "Risposta finale o stdout combinato dell'agente. Vuoto se il compito prosegue in background.",
          },
          durationMs: {
            label: "Durata (ms)",
            description: "Tempo totale di esecuzione del processo.",
          },
          threadId: {
            label: "ID conversazione",
            description:
              "ID salvato del thread o della sessione per riprendere un agente con nome.",
          },
          status: {
            label: "Stato",
            description: "Esito del turno dell'agente persistente.",
          },
          taskId: {
            label: "ID compito",
            description:
              "In modalità interattiva: ID di tracciamento. Il risultato viene recapitato automaticamente.",
          },
          hint: {
            label: "Indicazione",
            description:
              "Indicazione per l'IA su come verrà recapitato il risultato.",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description:
              "Parametri non validi. Controlla nome agente, compito e opzioni.",
          },
          unauthorized: {
            title: "Non autorizzato",
            description:
              "Accesso richiesto. Serve un account admin o il login CLI del provider.",
          },
          internal: {
            title: "Esecuzione non riuscita",
            description:
              "Il processo dell'agente non si è avviato o si è arrestato in modo imprevisto.",
          },
          binaryMissing: {
            title:
              "{{bin}} non è installato su questa istanza. Installalo o scegli un altro provider.",
            description:
              "Il binario CLI dell'agente non è stato trovato nel PATH di questo server.",
          },
          internalExitCode: {
            title: "Esecuzione non riuscita (uscita {{exitCode}})",
            description:
              "Il processo dell'agente è terminato con un codice diverso da zero.",
          },
          forbidden: {
            title: "Accesso negato",
            description:
              "Permessi insufficienti. Controlla le autorizzazioni del provider.",
          },
          notFound: {
            title: "Non trovato",
            description:
              "Agente, file del compito o cartella di lavoro non trovati.",
          },
          vibeCoderRedirect: {
            title: "Usa invece ai-run con vibe-coder",
            description:
              "L'agente di programmazione è impostato su vibe-coder. Usa lo strumento ai-run con la skill vibe-coder.",
          },
          network: {
            title: "Errore di rete",
            description: "Il provider o l'agente non è disponibile al momento.",
          },
          unknown: {
            title: "Errore sconosciuto",
            description:
              "Si è verificato un errore imprevisto durante l'esecuzione.",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Rilevato conflitto con modifiche non salvate.",
          },
          conflict: {
            title: "Conflitto",
            description:
              "Un altro agente è già in esecuzione con questo nome oppure la conversazione salvata usa un altro provider.",
          },
          detail: "Operazione dell'agente non riuscita: {{detail}}",
        },
        backButton: {
          label: "Indietro",
        },
        submitButton: {
          label: "Avvia",
          loadingText: "In corso...",
        },
        success: {
          title: "Agente completato",
          description:
            "L'agente ha completato l'esecuzione. Se l'output è vuoto, il risultato arriverà nel thread.",
        },
        widget: {
          runningBatch: "In corso...",
          runningInteractive: "Avvio della sessione terminale interattiva...",
          escalated:
            "In esecuzione in background. Il risultato verrà recapitato al termine.",
          taskIdLabel: "ID compito",
          outputLabel: "Output",
          interactiveSessionLaunched:
            "Sessione interattiva avviata nel terminale.",
          copyOutput: "Copia",
          copied: "Copiato!",
          interactive: "Interattivo",
          emptyPromptHint:
            "Inserisci un compito qui sotto per avviare l'agente",
          agentNamePlaceholder: "Nome agente (facoltativo)",
        },
      },
    },
    say: {
      post: {
        title: "Guida agente di programmazione",
        titleShort: "Guida agente",
        description:
          "Invia un messaggio durante il turno a un agente Codex o Antigravity attivo. A turno concluso, riusa il nome con coding-agent per continuare.",
        success: {
          title: "Messaggio consegnato",
          description: "Messaggio inviato all'agente in esecuzione.",
        },
        fields: {
          message: {
            label: "Messaggio",
            description: "Indicazione da inviare al turno in corso.",
          },
          messageFile: {
            label: "File del messaggio",
            description:
              "Percorso del file con il messaggio, relativo alla cartella corrente.",
          },
          delivered: {
            label: "Consegnato",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "Interrompi agente di programmazione",
        titleShort: "Interrompi agente",
        description:
          "Ferma il turno attivo di un agente Codex o Antigravity. Riusa il nome più tardi per riprendere la conversazione.",
        success: {
          title: "Interruzione richiesta",
          description: "Segnale di interruzione elaborato per l'agente.",
        },
        fields: {
          interrupted: {
            label: "Interruzione inviata",
          },
          noInterrupt: {
            label: "Nessun turno attivo",
          },
        },
      },
    },
    list: {
      post: {
        title: "Elenca agenti di programmazione",
        titleShort: "Elenca agenti",
        description:
          "Elenca gli agenti attivi e salvati. Indica un nome per vedere stato, registro recente e ultima risposta.",
        success: {
          title: "Agenti caricati",
          description: "Elenco degli agenti attivi e salvati pronto.",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "Agenti",
          },
          noAgents: {
            label: "Nessun agente persistente per ora.",
          },
          lines: {
            label: "Righe del registro",
            description:
              "Numero di righe finali del registro da includere per un singolo agente.",
          },
          tail: {
            label: "Registro recente",
          },
          emptyTail: {
            label: "Il registro è vuoto.",
          },
          lastMessage: {
            label: "Ultima risposta",
          },
          lastError: {
            label: "Ultimo errore",
          },
          startedAt: {
            label: "Avvio",
          },
          finishedAt: {
            label: "Fine",
          },
        },
      },
    },
  },
};
