// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/it";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    settings: "Impostazioni",
  },
  voices: {
    MALE: "Voce maschile",
    FEMALE: "Voce femminile",
  },
  enums: {
    viewMode: {
      linear: "Lineare",
      threaded: "A ramificazioni",
      flat: "Piatta",
      debug: "Debug",
    },
    provider: {
      AUTO: "Automatico",
      BRAVE: "Brave",
      KAGI: "Kagi",
    },
  },
  get: {
    title: "Impostazioni",
    titleShort: "Impostazioni della chat",
    description: "Leggi le impostazioni e le preferenze della chat.",
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per aprire le impostazioni",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai i permessi per accedere a questa risorsa",
      },
      notFound: {
        title: "Non trovato",
        description: "Impostazioni non trovate",
      },
      server: {
        title: "Errore del server",
        description: "Impossibile caricare le impostazioni",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "La richiesta è in conflitto con lo stato attuale",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Impostazioni caricate",
    },
  },
  post: {
    title: "Salva impostazioni",
    titleShort: "Salva impostazioni",
    description: "Aggiorna le impostazioni e le preferenze della chat.",
    container: {
      title: "Impostazioni della chat",
    },
    selectedModel: {
      label: "Modello selezionato",
    },
    selectedSkill: {
      label: "Skill selezionata",
    },
    activeFavoriteId: {
      label: "Preferito attivo",
    },
    ttsAutoplay: {
      label: "Riproduzione automatica della voce",
    },
    viewMode: {
      label: "Modalità di visualizzazione",
    },
    contextMemory: {
      title: "Limite della memoria della conversazione",
      description:
        "Quanta parte della conversazione l’IA conserva prima di iniziare a riassumerla.",
      costNote: "Meno memoria, costi più bassi",
      costExplain:
        "Entro certi limiti, ridurre la memoria costa meno per messaggio.",
      tooltipTitle: "Quanta parte della conversazione conserva l’IA",
      tooltipBody:
        "Quando la conversazione supera il limite, riassumiamo i messaggi più vecchi. L’IA mantiene il filo usando meno token, quindi spendi meno.",
      tooltipModelCap: "Il modello attuale supporta fino a {cap} token.",
      default: "predefinito",
      tokens: "token",
      modelMax: "limite del modello",
      resetToDefault: "Ripristina valore predefinito ({value})",
      cheaper: "meno costi",
      moreMemory: "più memoria",
      barCheap: "Costi più bassi · meno memoria",
      barBalanced: "Equilibrio tra costi e memoria",
      barRich: "Più memoria · costi più alti",
      barMax: "Memoria massima · costi più alti",
      tools: "Strumenti",
      toolsInherited: "ereditati",
    },
    turnStepLimit: {
      save: "Salva",
      label: "Passaggi per risposta",
      description:
        "Numero di cicli di chiamate agli strumenti prima che l’IA si fermi. Scegli da 5 a 500.",
    },
    searchProvider: {
      label: "Motore di ricerca",
      description:
        "Scegli il tuo motore di ricerca preferito. La modalità automatica usa Brave se configurato e Kagi negli altri casi.",
    },
    codingAgent: {
      label: "Agente di programmazione",
      description:
        "Scegli quale CLI avviare quando l’IA chiama lo strumento di programmazione. Solo gli amministratori possono cambiarla.",
      options: {
        claudeCode: "Claude Code (predefinito)",
        openCode: "OpenCode",
        nextVibeCoder: "Next Vibe Coder",
      },
    },
    dreaming: {
      title: "Dreaming",
      description:
        "Mentre dormi, l’IA mette ordine. Riunisce i ricordi, sistema i documenti e porta in primo piano ciò che conta.",
      toggle: {
        label: "Attiva Dreaming",
      },
      schedule: {
        label: "Pianificazione",
        options: {
          nightlyAt2: "Ogni notte alle 02:00",
          weekdaysAt2: "Alle 02:00 nei feriali",
          weekdaysAt8: "Alle 08:00 nei feriali",
          every6h: "Ogni 6 ore",
          every12h: "Ogni 12 ore",
        },
      },
      favoriteId: {
        label: "Preferito",
        defaultOption: "Predefinito (Thea)",
      },
      prompt: {
        label: "Istruzioni per la sessione",
        placeholder:
          "Su cosa deve concentrarsi Thea? Lascia vuoto per usare le istruzioni predefinite.",
        defaultPrompt:
          "Avvia la sessione Dreaming. Riordina e consolida il cortex: ricordi, documenti e conversazioni. Lascia tutto più pulito e organizzato.",
      },
      lastRun: "Ultima esecuzione:",
      neverRun: "Mai eseguito",
      folderLink: "Apri cartella Dreams",
      sessionCost:
        "Per sessione: massimo {{steps}} passaggi. Termina quando supera {{cap}} crediti.",
      runNow: "Avvia ora",
    },
    autopilot: {
      title: "Autopilot",
      description:
        "L’IA lavora mentre sei via. Riprende da dove eri arrivato, porta avanti i progetti e si occupa delle attività in coda.",
      toggle: {
        label: "Attiva Autopilot",
      },
      schedule: {
        label: "Pianificazione",
        options: {
          nightlyAt2: "Ogni notte alle 02:00",
          weekdaysAt2: "Alle 02:00 nei feriali",
          weekdaysAt8: "Alle 08:00 nei feriali",
          every6h: "Ogni 6 ore",
          every12h: "Ogni 12 ore",
        },
      },
      favoriteId: {
        label: "Preferito",
        defaultOption: "Predefinito (Thea)",
      },
      prompt: {
        label: "Istruzioni per la sessione",
        placeholder:
          "Su cosa deve concentrarsi Hermes? Lascia vuoto per usare le istruzioni predefinite.",
        defaultPrompt:
          "Avvia la sessione Autopilot. Riprendi i progetti attivi dal punto in cui si sono fermati, completa i prossimi passaggi e gestisci le attività in coda.",
      },
      lastRun: "Ultima esecuzione:",
      neverRun: "Mai eseguito",
      folderLink: "Apri cartella Autopilot",
      sessionCost:
        "Per sessione: massimo {{steps}} passaggi. Termina quando supera {{cap}} crediti.",
      runNow: "Avvia ora",
    },
    mama: {
      title: "Monitoraggio della piattaforma",
      description:
        "Thea monitora l’istanza di produzione: controlla che funzioni, porta avanti le funzionalità, gestisce il marketing e invia aggiornamenti. Gli amministratori condividono una sola configurazione.",
      toggle: {
        label: "Attiva modalità Mama",
      },
      schedule: {
        label: "Pianificazione",
        options: {
          every4h: "Ogni 4 ore",
          every6h: "Ogni 6 ore",
          every12h: "Ogni 12 ore",
          daily: "A mezzanotte ogni giorno",
        },
      },
      prompt: {
        label: "Istruzioni per la sessione",
        placeholder:
          "Su cosa deve concentrarsi Thea? Lascia vuoto per usare le istruzioni predefinite.",
        defaultPrompt:
          "Avvia la sessione Mama. Controlla lo stato della piattaforma, esamina i log degli errori, porta avanti le funzionalità in sospeso e prepara gli annunci necessari. Lascia un riepilogo in /documents/mama/log/.",
      },
      lastRun: "Ultima esecuzione:",
      neverRun: "Mai eseguito",
      runNow: "Avvia ora",
    },
    webPinnedTools: {
      label: "Strumenti fissati nella barra laterale web",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Impostazioni non valide",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile salvare le impostazioni",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per modificare le impostazioni",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai i permessi per modificare le impostazioni",
      },
      notFound: {
        title: "Non trovato",
        description: "Impostazioni non trovate",
      },
      server: {
        title: "Errore del server",
        description: "Impossibile salvare le impostazioni",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Le impostazioni sono in conflitto",
      },
    },
    success: {
      title: "Impostazioni salvate",
      description: "Abbiamo salvato le tue impostazioni",
    },
  },
  patch: {
    chatModel: {
      label: "Modello della chat",
      placeholder: "Predefinito di sistema",
    },
  },
  models: { names: modelTranslations.names },
};
