import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  codingAgent: {
    tags: {
      tasks: "Compiti",
    },
    run: {
      post: {
        title: "Run Coding Agent",
        titleShort: "Agente di programmazione",
        dynamicTitle: "Agente di codifica: {{prompt}}",
        description:
          "Eseguire un compito agente di codifica. Modalità Batch (DEFAULT): viene eseguito senza testa e restituisce l'output. Modalità interattiva: apre una sessione terminale dal vivo - il risultato viene rispedito automaticamente quando la sessione termina.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "Il compito o la domanda di inviare all'agente di codifica. Essere specifici - includere i percorsi di file, il contesto e il formato di output previsto.",
          },
          provider: {
            label: "Fornitore",
            description:
              "Quale agente di codifica CLI da usare. claude-code utilizza lo Claude CLI; open-code utilizza l'OpenCode CLI.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
            },
          },
          model: {
            label: "Modello",
            description:
              "Modello da usare. Per Claude Code: modello ID (ad esempio claude-sonnet-4-6). Per OpenCode: provider/modello (ad esempio antropologico/claude-sonnet-4-6). Lasciare vuoto per impostazione predefinita.",
          },
          taskTitle: {
            label: "Titolo della missione",
            description:
              "Titolo breve per l'archiviazione di questa attività (ad esempio 'Fix login bug'). Auto-generato dal prompt se omesso.",
          },
          interactiveMode: {
            label: "Modalità interattiva",
            description:
              "falso (DEFAULT): viene eseguito senza testa e restituisce tutto l'output quando fatto. true: apre una finestra terminale per una sessione live - il risultato viene rispedito automaticamente quando la sessione termina.",
          },
          output: {
            label: "Produzione",
            description:
              "Stdout combinato dal processo dell'agente di codifica. Vuoto quando l'attività è stata escalata all'esecuzione di sfondo (risultato iniettato tramite wakeUp).",
          },
          durationMs: {
            label: "Durata (m)",
            description: "Tempo totale di parete-clock il processo è corso.",
          },
          taskId: {
            label: "Task ID",
            description:
              "Per la modalità interattiva: l'attività di tracciamento ID. Il risultato viene rispedito automaticamente. Per modalità batch: non presente (risultato restituito in linea).",
          },
          hint: {
            label: "Hit",
            description:
              "Guida per la AI su come il risultato sarà consegnato.",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description:
              "Parametri di richiesta non valida - verifica richiesta e campi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Autenticazione richiesta - ruolo di amministratore necessario",
          },
          internal: {
            title: "Esecuzione non riuscita",
            description:
              "Il processo di agente di codifica non è riuscito a iniziare o crash inaspettatamente",
          },
          binaryMissing: {
            title:
              "{{bin}} non è installato su questa istanza - installarlo o scegliere un altro agente di codifica",
            description:
              "L'agente di codifica CLI binario non è stato trovato su PATH di questo server",
          },
          internalExitCode: {
            title: "Esecuzione non riuscita (uscita {{exitCode}})",
            description:
              "Processo di agente di codifica uscito con un codice di uscita non zero",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso negato - autorizzazioni insufficienti",
          },
          notFound: {
            title: "Non trovato",
            description: "Resource o directory di lavoro non trovata",
          },
          vibeCoderRedirect: {
            title: "Utilizzare la corsia con vibra-coder invece",
            description:
              "L'agente di codifica e' pronto per l'ammortizzatore. Utilizzare lo strumento ai-run con l'abilità vibra-coder.",
          },
          network: {
            title: "Errore di rete",
            description: "Errore di rete che comunica con l'agente di codifica",
          },
          unknown: {
            title: "Errore sconosciuto",
            description:
              "Un errore inaspettato si è verificato durante l'esecuzione",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Rilevato conflitto di modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description:
              "conflitto di esecuzione - un'altra sessione può essere in esecuzione",
          },
        },
        backButton: {
          label: "Indietro",
        },
        submitButton: {
          label: "Invia",
          loadingText: "Invio in corso...",
        },
        success: {
          title: "Agente di Coding Completato",
          description:
            "Processo agente di codifica finito con successo. Se l'output è vuoto, il risultato arriverà attraverso l'iniezione del thread.",
        },
        widget: {
          runningBatch: "Correre...",
          runningInteractive: "Avviare la sessione terminale interattiva...",
          escalated:
            "Correre in background - il risultato verrà iniettato quando completo.",
          taskIdLabel: "Task ID",
          outputLabel: "Produzione",
          interactiveSessionLaunched:
            "Sessione interattiva lanciata in terminal.",
          copyOutput: "Copia",
          copied: "Copiato!",
          interactive: "Interattivo interattivo",
          emptyPromptHint:
            "Inserisci un prompt qui sotto per eseguire l'agente di codifica",
        },
      },
    },
  },
};
