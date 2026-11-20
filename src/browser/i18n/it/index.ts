/**
 * Browser API translations (English)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  click: {
    title: "Fare clic su Elemento",
    titleShort: "Fare clic su",
    description:
      "Fare clic su un elemento per la sua UID da una snapshot. Prima fai un'istantanea con l'impulso.",
    dynamicTitle: "Clicca su: {{uid}}",

    form: {
      label: "Fare clic su Elemento",
      description: "Fare clic su un elemento specifico nella pagina",
      fields: {
        uid: {
          label: "Elemento UID",
          description:
            "L'aiuto di un elemento nella pagina dall'istantanea del contenuto della pagina",
          placeholder: "Inserisci elemento UID",
        },
        dblClick: {
          label: "Doppio click",
          description: "Impostare a true per doppio clic. Il default è falso",
        },
      },
    },

    response: {
      success: "Fare clic su operazione di successo",
      result: "Fare clic sul risultato dell'operazione",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante l'operazione di clic",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire operazioni di click",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Il funzionamento del click è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "L'elemento richiesto non è stato trovato",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno si è verificato durante l'operazione di clic",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di clic",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di clic",
      },
    },

    success: {
      title: "Fare clic su Operazione Successivo",
      description: "L'elemento è stato cliccato con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "close-page": {
    title: "Pagina iniziale",
    titleShort: "Pagina iniziale",
    description:
      "Chiudere la pagina di sessione corrente. L'ultima pagina aperta non può essere chiusa.",

    form: {
      label: "Pagina iniziale",
      description: "Chiudi una pagina del browser per il suo indice",
      fields: {
        pageIdx: {
          label: "Indice della pagina",
          description:
            "L'indice della pagina da chiudere. Chiama list_pages per elencare le pagine",
          placeholder: "Inserisci l'indice di pagina (ad esempio, 0)",
        },
      },
    },

    response: {
      success: "Pagina chiusa con successo",
      result: "Risultato dell'operazione di pagina",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la chiusura della pagina",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a chiudere le pagine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Pagina operazione di chiusura è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La pagina richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la chiusura della pagina",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la chiusura della pagina",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la chiusura della pagina",
      },
    },

    success: {
      title: "Pagina Chiuso Successivo",
      description: "La pagina è stata chiusa con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      navigationAutomation: "Automazione di navigazione",
    },
  },
  drag: {
    title: "Elemento di trascinamento",
    titleShort: "Dragaggio",
    description:
      "Trascinare un elemento su un altro da UID. Prendi gli UID dal take-snapshot.",
    dynamicTitle: "Drag: {{from}} → {{to}}",

    form: {
      label: "Elemento di trascinamento",
      description: "Trascinare un elemento su un altro elemento",
      fields: {
        from_uid: {
          label: "Dall'elemento UID",
          description: "L'Uid dell'elemento da trascinare",
          placeholder: "Inserisci l'elemento sorgente UID",
        },
        to_uid: {
          label: "Per Elementare UID",
          description: "L'Uid dell'elemento per cadere in",
          placeholder: "Inserisci l'elemento target UID",
        },
      },
    },

    response: {
      success: "Funzionamento di trascinamento",
      result: "Risultato dell'operazione",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante l'operazione di trascinamento",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a eseguire operazioni di trascinamento",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Il funzionamento del trascinamento è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "L'elemento richiesto non è stato trovato",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Durante l'operazione di trascinamento si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di trascinamento",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di trascinamento",
      },
    },

    success: {
      title: "Gestione del Drago Successo",
      description: "L'elemento è stato trascinato con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  fill: {
    title: "Riempimento",
    titleShort: "Riempimento",
    description:
      "Digitare il testo in un'area di input/text o selezionare un'opzione a discesa da UID. Prendi gli UID dal take-snapshot.",
    dynamicTitle: "Riempimento: {{uid}}",

    form: {
      label: "Elemento di riempimento",
      description: "Digitare il testo in un elemento di forma",
      fields: {
        uid: {
          label: "Elemento UID",
          description:
            "L'aiuto di un elemento nella pagina dall'istantanea del contenuto della pagina",
          placeholder: "Inserisci elemento uid",
        },
        value: {
          label: "Valore",
          description: "Il valore da riempire",
          placeholder: "Inserisci il valore per riempire",
        },
      },
    },

    response: {
      success: "Funzionamento di riempimento successo",
      result: "Risultato dell'operazione di riempimento",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete è avvenuto durante l'operazione di riempimento",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire operazioni di riempimento",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di riempimento è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Durante l'operazione di riempimento si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di riempimento",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di riempimento",
      },
    },

    success: {
      title: "Operazione di riempimento Successo",
      description: "L'elemento è stato riempito con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "fill-form": {
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      inputAutomation: "Automazione dell'ingresso",
    },
    title: "Modulo di riempimento",
    titleShort: "Modulo di riempimento",
    description:
      "Compilare più campi formali in una sola volta da array UID. Più efficiente delle singole chiamate di riempimento.",

    form: {
      label: "Elementi di forma di riempimento",
      description: "Riempire più elementi di forma simultaneamente",
      fields: {
        elements: {
          label: "Elementi di forma",
          description: "Array di elementi da snapshot per riempire",
          placeholder: "Inserisci elementi formali (array JSON)",
          uid: {
            label: "Elemento UID",
            description: "L'identificatore univoco dell'elemento da riempire",
          },
          value: {
            label: "Valore",
            description: "Il valore da inserire nell'elemento",
          },
        },
      },
    },

    response: {
      success: "Funzionamento di riempimento del modulo successo",
      result: {
        title: "Risultato",
        description: "Risultato del funzionamento di riempimento del modulo",
        filled: "Tutto riempito",
        filledCount: "Contatore riempito",
        elements: {
          uid: "Elemento UID",
          filled: "Riempito con successo",
        },
      },
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante l'operazione di riempimento del modulo",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a eseguire operazioni di riempimento del modulo",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di riempimento del modulo è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno è avvenuto durante l'operazione di riempimento del modulo",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di riempimento del modulo",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di riempimento del modulo",
      },
    },

    success: {
      title: "Modulo di riempimento Operazione Successivo",
      description:
        "Tutti gli elementi di forma sono stati riempiti con successo",
    },
  },
  "handle-dialog": {
    title: "Dialogo della maniglia",
    titleShort: "Dialogo",
    description:
      "Accettare o rifiutare una finestra di dialogo del browser (accettare/confermare/prompt). Chiama prima dell'azione che lo innesca.",
    dynamicTitle: "Dialogo: {{action}}",

    form: {
      label: "Dialogo del browser della maniglia",
      description: "Accetti o licenzi una finestra di dialogo del browser",
      fields: {
        action: {
          label: "Azione",
          description: "Se rifiutare o accettare la finestra di dialogo",
          placeholder: "Selezionare l'azione",
          options: {
            accept: "Accettare",
            dismiss: "Deliberazione",
          },
        },
        promptText: {
          label: "Testo del prompt",
          description:
            "Testo del prompt facoltativo per entrare nella finestra di dialogo",
          placeholder: "Inserisci il testo del prompt (opzionale)",
        },
      },
    },

    response: {
      success: "Funzionamento di gestione del dialogo",
      result: "Risultato della gestione del dialogo",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante l'operazione di gestione della finestra",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire operazioni di dialogo",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di manipolazione del dialogo è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno si è verificato durante l'operazione di gestione della finestra",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di gestione della finestra",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di gestione della finestra",
      },
    },

    success: {
      title: "Dialog Handling Successivo",
      description:
        "La finestra di dialogo del browser è stata gestita con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      dialogAutomation: "Automazione del Dialogo",
    },
  },
  hover: {
    title: "Hover",
    titleShort: "Hover",
    description:
      "Passare sopra un elemento di UID per attivare le opzioni degli strumenti o rivelare i controlli nascosti.",
    dynamicTitle: "Hover: {{uid}}",

    form: {
      label: "Elemento di Hover",
      description: "Spostare il cursore del mouse su un elemento",
      fields: {
        uid: {
          label: "Elemento UID",
          description:
            "L'aiuto di un elemento nella pagina dall'istantanea del contenuto della pagina",
          placeholder: "Inserisci elemento uid",
        },
      },
    },

    response: {
      success: "Funzionamento Hover di successo",
      result: "Risultato dell'operazione Hover",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante l'operazione hover",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire operazioni di hover",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di Hover è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Durante l'operazione hover si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione hover",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description: "Un conflitto si è verificato durante l'operazione hover",
      },
    },

    success: {
      title: "Operazione di Hover Successo",
      description: "L'elemento è stato affinato con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "press-key": {
    title: "Chiave di stampa",
    titleShort: "Chiave di stampa",
    dynamicTitle: "Chiave: {{key}}",
    description: "Premere una combinazione chiave o chiave",
    form: {
      label: "Chiave di stampa",
      description: "Premere una combinazione chiave o chiave",
      fields: {
        key: {
          label: "chiave",
          description:
            "Una chiave o una combinazione (ad esempio, Invio, Controllo+A, Control+Shift+R)",
          placeholder: "Inserisci chiave o combinazione",
        },
      },
    },
    response: {
      success: "Funzionamento della pressa chiave successo",
      result: "Risultato del funzionamento della pressa chiave",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante l'operazione di pressa chiave",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a eseguire operazioni di pressa chiave",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di pressa chiave è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno si è verificato durante l'operazione di stampa chiave",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di stampa chiave",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di stampa chiave",
      },
    },
    success: {
      title: "Operazione di stampa chiave Successo",
      description: "La chiave è stata stampata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "upload-file": {
    title: "Caricare File",
    titleShort: "Caricamento",
    dynamicTitle: "Caricamento: {{file}}",
    description: "Caricare un file tramite un elemento fornito",
    form: {
      label: "Caricare File",
      description: "Caricare un file in un elemento di input del file",
      fields: {
        uid: {
          label: "Elemento UID",
          description:
            "L'Uid dell'elemento di input del file o un elemento che aprirà il selezionatore del file",
          placeholder: "Inserisci elemento uid",
        },
        filePaths: {
          label: "Percorsi di file",
          description:
            "Percorso assoluto del file da caricare, o diversi per un ingresso multi-file. Deve sedersi all'interno della directory del progetto o nella directory temp OS.",
          placeholder: "/tmp/photo.png",
        },
        includeSnapshot: {
          label: "Includere l'istantanea",
          description: "Ritorna un'istantanea di pagina dopo il caricamento",
        },
      },
    },
    response: {
      success: "Funzionamento di caricamento file di successo",
      result: "Risultato dell'operazione di upload file",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete è avvenuto durante l'operazione di caricamento del file",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a eseguire operazioni di caricamento dei file",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di caricamento dei file è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno è avvenuto durante l'operazione di caricamento del file",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di caricamento del file",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di caricamento del file",
      },
    },
    success: {
      title: "File Upload Operazione Successivo",
      description: "Il file è stato caricato con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "list-pages": {
    title: "Elenco Pagine",
    titleShort: "Pagine",
    description:
      "Elenca tutte le pagine del browser aperto con i loro URL. Ogni sessione del chiamante possiede una scheda; la nuova pagina lo sostituisce.",
    form: {
      label: "Elenco Pagine",
      description: "Ottieni tutte le pagine del browser aperto",
      fields: {},
    },
    response: {
      success: "Pagine che elencano l'operazione di successo",
      result: {
        title: "Risultato",
        description: "Risultato dell'elenco delle pagine",
        pages: {
          idx: "Index",
          title: "Titolo",
          url: "URL",
          active: "Attivo",
        },
        totalCount: "Totale conteggio",
      },
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'elenco delle pagine",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a elencare le pagine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di elenco delle pagine è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'elenco delle pagine",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la lista delle pagine",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la lista delle pagine",
      },
    },
    success: {
      title: "Pagine elencate in seguito",
      description: "Le pagine aperte sono state elencate con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      navigationAutomation: "Automazione di navigazione",
    },
  },
  "navigate-page": {
    title: "Pagina di navigazione",
    titleShort: "Navigare",
    dynamicTitle: "Navigate: {{target}}",
    description:
      "Passare la pagina di sessione a un URL, indietro, avanti o ricarica. Preferisci questo su nuova pagina per la navigazione con la stessa velocità.",
    form: {
      label: "Pagina di navigazione",
      description:
        "Navigare la pagina attualmente selezionata in uno URL o attraverso la storia",
      fields: {
        type: {
          label: "Tipo di navigazione",
          description:
            "Navigare per URL, indietro o avanti nella storia, o ricaricare",
          placeholder: "Selezionare il tipo di navigazione",
          options: {
            url: "URL",
            back: "Indietro",
            forward: "Avanti",
            reload: "Ricaricare",
          },
        },
        url: {
          label: "URL",
          description: "Obiettivo URL (solo per tipo=url)",
          placeholder: "Inserisci l’URL",
        },
        ignoreCache: {
          label: "Ignora Cache",
          description: "Se ignorare la cache su ricarica",
          placeholder: "Ignora la cache",
        },
        timeout: {
          label: "Timeout",
          description:
            "Tempo di attesa massimo in millisecondi (0 per impostazione predefinita)",
          placeholder: "Inserisci il timeout",
        },
      },
    },
    response: {
      success: "Funzionamento di navigazione",
      result: "Risultato della navigazione",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete durante la navigazione",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a navigare nelle pagine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Il funzionamento della navigazione di pagina è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno è avvenuto durante la navigazione",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la navigazione",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto durante la navigazione",
      },
    },
    success: {
      title: "Navigazione Successivo",
      description: "La pagina è stata navigata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      navigationAutomation: "Automazione di navigazione",
    },
  },
  "new-page": {
    title: "Nuova pagina",
    titleShort: "Nuova pagina",
    dynamicTitle: "Nuova pagina: {{url}}",
    description:
      "Aprire una nuova scheda del browser a URL. La sessione adotta la nuova scheda. tutte le chiamate successive operano su di essa.",
    form: {
      label: "Nuova pagina",
      description: "Creare una nuova pagina del browser e caricare un URL",
      fields: {
        url: {
          label: "URL",
          description: "URL da caricare nella nuova pagina",
          placeholder: "Inserisci l’URL",
        },
        replacePage: {
          label: "Sostituisci la pagina",
          description: "Chiudere le pagine esistenti prima di aprire il nuovo",
        },
        background: {
          label: "Sfondo",
          description: "Aprire la pagina senza portarla davanti",
        },
        timeout: {
          label: "Timeout",
          description:
            "Tempo di attesa massimo in millisecondi (0 per impostazione predefinita)",
          placeholder: "Inserisci il timeout",
        },
      },
    },
    response: {
      success: "Nuova operazione di creazione pagina successo",
      result: "Risultato della creazione di nuove pagine",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la creazione della nuova pagina",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a creare nuove pagine",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Il funzionamento della creazione di nuove pagine è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la creazione della nuova pagina",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Si è verificato un errore sconosciuto durante la creazione della nuova pagina",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la creazione della nuova pagina",
      },
    },
    success: {
      title: "Nuova pagina creata con successo",
      description: "La nuova pagina è stata creata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      navigationAutomation: "Automazione di navigazione",
    },
  },
  "select-page": {
    title: "Seleziona la pagina",
    titleShort: "Seleziona la pagina",
    dynamicTitle: "Seleziona: {{page}}",
    description:
      "Passare la sessione a una pagina specifica per indice. Utilizzare list-pages per trovare l'indice. Non aggiorna la scheda tracciata della sessione.",
    form: {
      label: "Seleziona la pagina",
      description: "Seleziona una pagina per il suo indice",
      fields: {
        pageIdx: {
          label: "Indice della pagina",
          description:
            "L'indice della pagina da selezionare (call list_pages per elencare le pagine)",
          placeholder: "Inserisci l'indice di pagina",
        },
      },
    },
    response: {
      success: "Operazione di selezione pagina di successo",
      result: "Risultato della selezione pagina",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la selezione della pagina",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a selezionare le pagine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di selezione della pagina è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la selezione della pagina",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Si è verificato un errore sconosciuto durante la selezione della pagina",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la selezione della pagina",
      },
    },
    success: {
      title: "Pagina selezionata con successo",
      description: "La pagina è stata selezionata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      navigationAutomation: "Automazione di navigazione",
    },
  },
  emulate: {
    title: "Emulate",
    titleShort: "Emulate",
    description:
      "Inserisci le condizioni di rete (offline/3G/4G) o CPU throttling nella pagina corrente. Ogni chiamata è assoluta: i campi omessi vengono ripristinati. Un override dell'agente utente si applica dalla successiva navigazione, quindi ricaricare la pagina dopo impostarla.",
    dynamicTitle: "Emulazione: {{config}}",
    form: {
      label: "Dispositivo di emulazione",
      description: "Emulare le condizioni di rete e CPU",
      fields: {
        networkConditions: {
          label: "Condizioni di rete",
          description: "Rete di treppiede (set to No emulation to disable)",
          placeholder: "Selezionare la condizione di rete",
          options: {
            noEmulation: "Nessuna emulazione",
            offline: "Offline",
            slow3g: "Slow 3G",
            fast3g: "Veloce 3G",
            slow4g: "Slow 4G",
            fast4g: "Veloce 4G",
          },
        },
        cpuThrottlingRate: {
          label: "CPU Tasso di atterraggio",
          description:
            "CPU fattore di rallentamento (1 per disabilitare, 1-20)",
          placeholder: "Inserisci il tasso di ottimizzazione",
        },
      },
    },
    response: {
      success: "Funzionamento di emulazione di successo",
      result: "Risultato dell'operazione di emulazione",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description: "Un errore di rete si è verificato durante l'emulazione",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a emulare le funzionalità del dispositivo",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Il funzionamento dell'emulazione del dispositivo è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno è avvenuto durante l'emulazione",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'emulazione",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description: "Un conflitto si è verificato durante l'emulazione",
      },
    },
    success: {
      title: "Emulazione Successo",
      description:
        "Le funzionalità del dispositivo sono state emulate con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      performanceAutomation: "Automazione delle prestazioni",
    },
  },
  "resize-page": {
    title: "Ridimensiona la pagina",
    titleShort: "Ridimensionare",
    dynamicTitle: "Ridimensiona: {{width}} x {{height}}",
    description:
      "Ridimensionare il viewport del browser in dimensioni specifiche in pixel.",
    form: {
      label: "Ridimensiona la pagina",
      description: "Ridimensiona la pagina alle dimensioni specificate",
      fields: {
        width: {
          label: "Larghezza",
          description: "Larghezza pagina in pixel",
          placeholder: "Inserisci la larghezza",
        },
        height: {
          label: "Altezza",
          description: "Altezza della pagina in pixel",
          placeholder: "Inserire altezza",
        },
      },
    },
    response: {
      success: "Funzionamento di ridimensionamento della pagina di successo",
      result: "Risultato dell'operazione di ridimensionamento pagina",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la ridimensionamento della pagina",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a ridimensionare le pagine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di ridimensionamento della pagina è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la ridimensionamento della pagina",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la ridimensionamento della pagina",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la ridimensionamento della pagina",
      },
    },
    success: {
      title: "Pagina Resized Successivo",
      description: "La pagina è stata ridimensionata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      viewportAutomation: "Viewport Automation",
    },
  },
  "evaluate-script": {
    title: "Valutare Script",
    titleShort: "Eval Script",
    description:
      "Eseguire JavaScript nella pagina e restituire il risultato. L'uso per la lettura dello stato che l'acquisizione-snapshot non espone.",
    dynamicTitle: "Script: {{snippet}}",
    form: {
      label: "Valutare Script",
      description: "Eseguire JavaScript nella pagina del browser",
      fields: {
        function: {
          label: "Funzione",
          description: "Dichiarazione della funzione JavaScript per eseguire",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Argomenti",
          description:
            "Elenco facoltativo di argomenti (element UIDs) da passare alla funzione",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "Elemento UID",
            description: "L'identificatore univoco di un elemento nella pagina",
          },
        },
      },
    },
    response: {
      success: "Funzionamento di valutazione script di successo",
      result: {
        title: "Risultato",
        description: "Risultato della valutazione dello script",
        executed: "Esecuzione",
        result: "Valore di ritorno",
      },
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la valutazione dello script",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a valutare gli script",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di valutazione dello script è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Un errore del server interno si è verificato durante la valutazione dello script",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la valutazione dello script",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante la valutazione dello script",
      },
    },
    success: {
      title: "Script valutato con successo",
      description: "Il JavaScript è stato eseguito con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      scriptExecution: "Esecuzione script",
    },
  },
  "get-console-message": {
    title: "Ricevi il messaggio di Console",
    titleShort: "Console Msg",
    description:
      "Ottenere il corpo completo di un messaggio di console specifico da msgid da messaggi elenco-console.",
    dynamicTitle: "Console # {{id}}",
    form: {
      label: "Ricevi il messaggio di Console",
      description: "Recuperare un messaggio di console specifico",
      fields: {
        msgid: {
          label: "Messaggio ID",
          description:
            "Il msgid di un messaggio di console dai messaggi di console elencati",
          placeholder: "Inserisci messaggio ID",
        },
      },
    },
    response: {
      success: "Console messaggio di operazione di recupero di successo",
      result: "Risultato del reperimento dei messaggi della console",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante il recupero del messaggio della console",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a recuperare i messaggi di console",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "L'operazione di recupero del messaggio di console è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante il recupero del messaggio della console",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante il recupero del messaggio della console",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante il recupero del messaggio della console",
      },
    },
    success: {
      title: "Console Messaggio recuperato con successo",
      description: "Il messaggio della console è stato recuperato con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      debugging: "Debug",
    },
  },
  "list-console-messages": {
    title: "Elenco Messaggi di console",
    titleShort: "Console Log",
    description:
      "Elenca i messaggi di console dall'ultima navigazione. Filtra per tipo (error/warn/log). Utilizzare dopo le azioni per catturare gli errori JS.",
    form: {
      label: "Elenco Messaggi di console",
      description:
        "Ricevi tutti i messaggi della console dalla pagina del browser",
      fields: {
        includePreservedMessages: {
          label: "Includi i messaggi riservati",
          description:
            "Impostare a true per restituire i messaggi conservati sulle ultime 3 navigazioni",
          placeholder: "false",
        },
        pageIdx: {
          label: "Indice della pagina",
          description:
            "Numero di pagina da restituire (0-based, omit per prima pagina)",
          placeholder: "Inserisci l'indice di pagina",
        },
        pageSize: {
          label: "Dimensione della pagina",
          description:
            "Numero massimo di messaggi da restituire (omettere di restituire tutti i messaggi)",
          placeholder: "Inserisci dimensione pagina",
        },
        types: {
          label: "Tipi di messaggi",
          description:
            "Filtra i messaggi per restituire solo i messaggi dei tipi specificati (omettere di restituire tutti)",
          placeholder: "Seleziona i tipi di messaggio",
          options: {
            log: "Log",
            debug: "Debug",
            info: "Info",
            error: "Errore",
            warn: "Avvertenza",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Tabella",
            trace: "Trace",
            clear: "Azzera",
            startGroup: "Gruppo di partenza",
            startGroupCollapsed: "Gruppo di partenza Collasso",
            endGroup: "Gruppo finale",
            assert: "Asserta",
            profile: "Profilo",
            profileEnd: "Profilo Fine",
            count: "Conte",
            timeEnd: "Fine del tempo",
            verbose: "Verbose",
            issue: "Fascicolo",
          },
        },
      },
    },
    response: {
      success: "Console messaggi recuperati con successo",
      result: {
        title: "Risultato",
        description: "Console elenco messaggi risultato",
        messages: {
          msgid: "Messaggio ID",
          type: "Tipologia",
          text: "Messaggio",
          timestamp: "Timestamp",
        },
        totalCount: "Totale conteggio",
      },
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'elenco dei messaggi della console",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a elencare i messaggi della console",
      },
      forbidden: {
        title: "Accesso negato",
        description: "I messaggi della console di lista sono vietati",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'elenco dei messaggi della console",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'elenco dei messaggi della console",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'elenco dei messaggi della console",
      },
    },
    success: {
      title: "Console messaggi recuperati con successo",
      description:
        "I messaggi della console sono stati recuperati con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      debugging: "Debug",
    },
  },
  "get-network-request": {
    title: "Ottieni la richiesta di rete",
    titleShort: "Regime di rete",
    description:
      "Ottenere i dettagli completi (intestazioni, corpo) per una richiesta da reqid da list-network-requests.",
    dynamicTitle: "Rete # {{id}}",
    form: {
      label: "Ottieni la richiesta di rete",
      description:
        "Ottieni una specifica richiesta di rete o quella attualmente selezionata",
      fields: {
        reqid: {
          label: "Richiesta ID",
          description:
            "Il reqid della richiesta di rete (omettere di ottenere la richiesta attualmente selezionata in DevTools)",
          placeholder: "Inserire richiesta ID",
        },
        maxBodyLength: {
          label: "Lunghezza corpo max",
          description:
            "Personaggi massimi da restituire da corpi di richiesta/risposta in linea. I corpi superiori a questo sono troncati con un avviso. Omit per nessun limite.",
          placeholder: "ad esempio, 10000",
        },
      },
    },
    response: {
      success: "Richiesta di rete recuperata con successo",
      result: "Risultato della richiesta di rete",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'ottenimento della richiesta di rete",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato ad ottenere richieste di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Ottenere richieste di rete è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'ottenimento della richiesta di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'ottenimento della richiesta di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'ottenimento della richiesta di rete",
      },
    },
    success: {
      title: "Richiesta di rete recuperato con successo",
      description: "La richiesta di rete è stata recuperata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      networkAnalysis: "Analisi della rete",
    },
  },
  "list-network-requests": {
    title: "Elenca le richieste di rete",
    titleShort: "Log di rete",
    description:
      "Elenca le richieste di rete dall'ultima navigazione. Filtra per tipo di risorsa (fetch/xhr/doc). Utilizzare per ispezionare le chiamate API.",
    form: {
      label: "Elenca le richieste di rete",
      description: "Ricevi tutte le richieste di rete dalla pagina del browser",
      fields: {
        includePreservedRequests: {
          label: "Includere richieste riservate",
          description:
            "Corretta per restituire le richieste conservate sulle ultime 3 navigazioni",
          placeholder: "false",
        },
        pageIdx: {
          label: "Indice della pagina",
          description:
            "Numero di pagina da restituire (0-based, omit per prima pagina)",
          placeholder: "Inserisci l'indice di pagina",
        },
        pageSize: {
          label: "Dimensione della pagina",
          description:
            "Numero massimo di richieste di ritorno (omettere di restituire tutte le richieste)",
          placeholder: "Inserisci dimensione pagina",
        },
        resourceTypes: {
          label: "Tipi di risorse",
          description:
            "Filtra le richieste per restituire solo le richieste dei tipi di risorse specificati (omettere di restituire tutti)",
          placeholder: "Seleziona i tipi di risorse",
          options: {
            document: "Documento",
            stylesheet: "Scheda di stile",
            image: "Immagine",
            media: "Media",
            font: "Fonti",
            script: "Script",
            texttrack: "Traccia di testo",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "Event Source",
            websocket: "WebSocket",
            manifest: "Manifestazione",
            signedexchange: "Signed Exchange",
            ping: "Ping",
            cspviolationreport: "CSP Rapporto di violazione",
            preflight: "Preflight",
            fedcm: "FedCM",
            other: "Altro",
          },
        },
      },
    },
    response: {
      success: "Le richieste di rete recuperate con successo",
      result: {
        title: "Risultato",
        description: "Risultati dell'elenco delle richieste di rete",
        requests: {
          reqid: "Richiesta ID",
          url: "URL",
          method: "Metodo",
          status: "Stato",
          type: "Tipologia",
        },
        totalCount: "Totale conteggio",
      },
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'elenco delle richieste di rete",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato ad elencare le richieste di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Le richieste di rete di lista sono vietate",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'elenco delle richieste di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'elenco delle richieste di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'elenco delle richieste di rete",
      },
    },
    success: {
      title: "Recuperare le richieste di rete con successo",
      description: "Le richieste di rete sono state recuperate con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      networkAnalysis: "Analisi della rete",
    },
  },
  "performance-analyze-insight": {
    title: "Analizzare l'opinione delle prestazioni",
    titleShort: "Perf Insight",
    description:
      "Trapanare in una specifica visione da un risultato traccia (ad es. DocumentLatency, LCPBreakdown). Chiamate dopo la trasmissione.",
    form: {
      label: "Analizzare l'opinione delle prestazioni",
      description:
        "Ottieni informazioni dettagliate su una specifica panoramica delle prestazioni",
      fields: {
        insightSetId: {
          label: "Set di vista ID",
          description:
            "L'id per il set di informazioni specifico (utilizzare solo gli ids forniti nell'elenco dei set di intuizioni disponibili)",
          placeholder: "Inserisci set di informazioni ID",
        },
        insightName: {
          label: "Nome della vista",
          description:
            "Il nome dell'Insight si desidera maggiori informazioni su (ad esempio, DocumentLatency o LCPBreakdown)",
          placeholder: "Inserire il nome di comprensione",
        },
      },
    },
    response: {
      success: "Intuizione delle prestazioni analizzata con successo",
      result: "Risultati dell'analisi delle prestazioni",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'analisi delle informazioni sulle prestazioni",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato ad analizzare le informazioni sulle prestazioni",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'analisi delle informazioni sulle prestazioni è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'analisi delle informazioni sulle prestazioni",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'analisi della percezione delle prestazioni",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto analizzando la percezione delle prestazioni",
      },
    },
    success: {
      title: "Performance Insight Analizzato Con successo",
      description:
        "L'intuizione delle prestazioni è stata analizzata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      performanceAutomation: "Automazione delle prestazioni",
    },
  },
  "performance-start-trace": {
    title: "Avviare la trazione delle prestazioni",
    titleShort: "Avviare il trasmettitore",
    description:
      "Avviare una traccia delle prestazioni per catturare vitali del core web e metriche di carico. Seguire con performance-stop-trace.",
    form: {
      label: "Avviare la trazione delle prestazioni",
      description:
        "Iniziare la registrazione delle metriche di performance per la pagina del browser",
      fields: {
        reload: {
          label: "Pagina di ricarica",
          description:
            "Determina se, una volta avviato il tracciamento, la pagina dovrebbe essere ricaricata automaticamente",
          placeholder: "true",
        },
        autoStop: {
          label: "Fermata automatica",
          description:
            "Determina se la registrazione delle tracce deve essere arrestata automaticamente",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "La traccia delle prestazioni è iniziata con successo",
      result: "Risultato di inizio traccia delle prestazioni",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'avvio della traccia delle prestazioni",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a iniziare le tracce delle prestazioni",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Le tracce delle prestazioni iniziali sono proibite",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'avvio della traccia delle prestazioni",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'avvio della traccia delle prestazioni",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'avvio della traccia delle prestazioni",
      },
    },
    success: {
      title: "Performance Trace Iniziato con successo",
      description: "La traccia delle prestazioni è stata avviata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      performanceAutomation: "Automazione delle prestazioni",
    },
  },
  "performance-stop-trace": {
    title: "Stop Performance Trace",
    titleShort: "Stop Trace",
    description:
      "Interrompere le metriche di traccia attiva e restituire le prestazioni con gli ID set di insight per le prestazioni-analyze-insight.",
    form: {
      label: "Stop Performance Trace",
      description:
        "Interrompere la registrazione delle tracce attive delle prestazioni",
      fields: {},
    },
    response: {
      success: "La traccia delle prestazioni si è fermata con successo",
      result: "Risultato della traccia di prestazione con metriche",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'arresto della traccia delle prestazioni",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a fermare le tracce delle prestazioni",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "La memorizzazione delle tracce delle prestazioni è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'arresto della traccia delle prestazioni",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'arresto della traccia delle prestazioni",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto, fermando la traccia delle prestazioni",
      },
    },
    success: {
      title: "Prestazioni Trace bloccato con successo",
      description: "La traccia delle prestazioni è stata fermata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      performanceAutomation: "Automazione delle prestazioni",
    },
  },
  "take-screenshot": {
    title: "Prendere Screenshot",
    titleShort: "Immagine di schermo",
    dynamicTitle: "Schermata: {{target}}",
    description:
      "Cattura uno screenshot visivo della pagina o un elemento specifico. Restituisce un'immagine. Utilizzare per verificare lo stato UI.",
    form: {
      label: "Prendere Screenshot",
      description: "Cattura uno screenshot della pagina del browser o elemento",
      fields: {
        uid: {
          label: "Elemento UID",
          description:
            "L'Uid di un elemento a screenshot (omettere di screenshot l'intera pagina)",
          placeholder: "Inserisci elemento uid",
        },
        fullPage: {
          label: "Pagina completa",
          description:
            "Se impostato a true prende uno screenshot della pagina completa invece del viewport attualmente visibile (incompatibile con uid)",
          placeholder: "false",
        },
        format: {
          label: "Format",
          description:
            "Tipo di formato per salvare lo screenshot come (default: png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "Qualità",
          description:
            "Qualità di compressione per formati JPEG e WebP (0-100). Valori più elevati significano una migliore qualità ma dimensioni di file più grandi. Ignorato per il formato PNG.",
          placeholder: "80",
        },
        filePath: {
          label: "Percorso file",
          description:
            "Il percorso assoluto, o un percorso relativo alla directory di lavoro corrente, per salvare lo screenshot al posto di attaccarlo alla risposta",
          placeholder: "/ percorso/a/screenshot.png",
        },
      },
    },
    response: {
      success: "Screenshot catturato con successo",
      result: "Risultato di cattura dello schermo",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la cattura dello screenshot",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a catturare screenshots",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Catturare gli screenshot è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la cattura dello screenshot",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la cattura dello screenshot",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante la cattura dello screenshot",
      },
    },
    success: {
      title: "Screenshot catturato con successo",
      description: "Lo screenshot è stato catturato con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      captureAutomation: "Automazione di Cattura",
    },
  },
  "take-snapshot": {
    title: "Indossando una cinghia",
    titleShort: "Snapshot",
    description:
      "Ottieni l'a11y albero della pagina come testo. Richiesto prima di fare clic / riempire / drag. fornisce UID elemento.",
    form: {
      label: "Indossando una cinghia",
      description:
        "Catturare un'istantanea di testo della pagina del browser in base all'albero a11y",
      fields: {
        verbose: {
          label: "Verbose",
          description:
            "Se includere tutte le informazioni possibili disponibili nell'albero completo a11y (default: false)",
          placeholder: "false",
        },
        filePath: {
          label: "Percorso file",
          description:
            "Il percorso assoluto, o un percorso relativo alla directory di lavoro corrente, per salvare l'istantanea al posto di attaccarla alla risposta",
          placeholder: "/percorso/a/snapshot.txt",
        },
      },
    },
    response: {
      success: "Istantanee catturate con successo",
      result: "Risultato di cattura istantaneo",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la cattura dell'istantanea",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a catturare istantanee",
      },
      forbidden: {
        title: "Accesso negato",
        description: "La cattura di istantanee è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la cattura dell'istantanea",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la cattura dell'istantanea",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la cattura dell'istantanea",
      },
    },
    success: {
      title: "Istantanee catturate con successo",
      description: "L'istantanea è stata catturata con successo",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      captureAutomation: "Automazione di Cattura",
    },
  },
  "wait-for": {
    title: "Aspettare",
    titleShort: "Aspetta.",
    dynamicTitle: "Aspetta: {{text}}",
    description:
      "Attendere che il testo specifico venga visualizzato nella pagina. Utilizzare dopo la navigazione o le azioni che attivano gli aggiornamenti asincroni.",

    form: {
      label: "Attendere il testo",
      description:
        "Attendere che il testo specifico venga visualizzato nella pagina",
      fields: {
        text: {
          label: "Testo",
          description: "Testo da inserire nella pagina",
          placeholder: "Inserisci il testo per aspettare",
        },
        timeout: {
          label: "Timeout",
          description:
            "Tempo di attesa massimo in millisecondi. Se impostato a 0, verrà utilizzato il timeout predefinito",
          placeholder: "Inserisci timeout (ms)",
        },
        captureSnapshot: {
          label: "Istantaneità della cattura",
          description:
            "Quando abilitato, include l'istantanea di accessibilità completa nella risposta. Disabilitato per impostazione predefinita per mantenere le risposte concise.",
        },
      },
    },

    response: {
      success: "Operazione di attesa riuscita",
      result: "Risultato dell'operazione di attesa",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },

    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante l'operazione di attesa",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire operazioni di attesa",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'operazione di attesa è vietata",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Durante l'operazione di attesa si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'operazione di attesa",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'operazione di attesa",
      },
    },

    success: {
      title: "Operazione di attesa Successo",
      description: "Il testo specificato è apparso sulla pagina",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automazione del browser",
      waitAutomation: "Attendere l'automazione",
    },
  },
  title: "Strumenti Chrome DevTools MCP",
  description:
    "automazione del browser tramite Chrome DevTools. Flusso: nuova pagina → take-snapshot → interagire (click/fill) → verificare.",
  category: "Browser",
  summary:
    "Accesso agli strumenti di protocollo DevTools Chrome tramite MCP per l'automazione web",
  tags: {
    browserAutomation: "Automazione del browser",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "Strumenti MCP",
    webDebugging: "Debug Web",
    performanceAnalysis: "Analisi delle prestazioni",
    inputAutomation: "Automazione dell'ingresso",
    captureAutomation: "Automazione di Cattura",
    debugging: "Debug",
    dialogAutomation: "Automazione del Dialogo",
    navigationAutomation: "Automazione di navigazione",
    networkAnalysis: "Analisi della rete",
    performanceAutomation: "Automazione delle prestazioni",
    scriptExecution: "Esecuzione script",
    viewportAutomation: "Viewport Automation",
    waitAutomation: "Attendere l'automazione",
  },

  form: {
    label: "Esecuzione dello strumento del browser",
    description:
      "Eseguire strumenti DevTools Chrome MCP per il controllo e l'analisi del browser",
    fields: {
      tool: {
        label: "Strumento",
        description:
          "Selezionare lo strumento Chrome DevTools MCP per eseguire",
        placeholder: "Scegli uno strumento...",
      },
      arguments: {
        label: "Argomenti",
        description: "Argomenti JSON per lo strumento selezionato (opzionale)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Fare clic su Elemento",
    drag: "Elemento di trascinamento",
    fill: "Campo d'ingresso di riempimento",
    fillForm: "Modulo di riempimento",
    handleDialog: "Dialogo della maniglia",
    hover: "Elemento di Hover",
    pressKey: "Chiave di stampa",
    uploadFile: "Caricare File",

    // Navigation automation tools (6)
    closePage: "Pagina iniziale",
    listPages: "Elenco Pagine",
    navigatePage: "Pagina di navigazione",
    newPage: "Nuova pagina",
    selectPage: "Seleziona la pagina",
    waitFor: "Aspettare",

    // Emulation tools (2)
    emulate: "Dispositivo di emulazione",
    resizePage: "Ridimensiona la pagina",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analizzare l'opinione delle prestazioni",
    performanceStartTrace: "Avviare la trazione delle prestazioni",
    performanceStopTrace: "Stop Performance Trace",

    // Network tools (2)
    getNetworkRequest: "Ottieni la richiesta di rete",
    listNetworkRequests: "Elenca le richieste di rete",

    // Debugging tools (5)
    evaluateScript: "Valutare Script",
    getConsoleMessage: "Ricevi il messaggio di Console",
    listConsoleMessages: "Elenco Messaggi di console",
    takeScreenshot: "Prendere Screenshot",
    takeSnapshot: "Indossando una cinghia",
  },

  status: {
    pending: "Finanziamenti",
    running: "Esecuzione",
    completed: "Completo",
    failed: "Sfigato",
  },

  response: {
    success: "Strumento eseguito con successo",
    result: "Risultato dell'esecuzione",
    status: "Stato attuale dell'esecuzione",
    statusItem: "Articolo di stato",
    executionId: "Esecuzione ID per il monitoraggio",
  },

  examples: {
    requests: {
      navigate: {
        title: "Navigare a URL",
        description: "Navigare il browser a uno specifico URL",
      },
      screenshot: {
        title: "Prendere Screenshot",
        description: "Cattura uno screenshot della pagina corrente",
      },
      click: {
        title: "Fare clic su Elemento",
        description: "Fare clic su un elemento specifico",
      },
      performance: {
        title: "Avviare la trazione delle prestazioni",
        description: "Inizio metriche di registrazione delle prestazioni",
      },
      script: {
        title: "Valutare Script",
        description: "Eseguire JavaScript nel browser",
      },
    },
    responses: {
      navigate: {
        title: "Risultato di navigazione",
        description: "Risultato della navigazione di pagina",
      },
      screenshot: {
        title: "Risultato di schermate",
        description: "Risultato di cattura dello schermo",
      },
      click: {
        title: "Fare clic su Risultato",
        description: "Elemento click risultato",
      },
      performance: {
        title: "Prestazioni Trace Iniziato",
        description: "Tracciamento delle prestazioni iniziato",
      },
      script: {
        title: "Risultato di valutazione Script",
        description: "Esecuzione JavaScript risultato",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Esecuzione degli strumenti fallita",
      description:
        "Lo strumento selezionato non potrebbe essere eseguito con successo",
    },
    invalidArguments: {
      title: "Argomenti non validi",
      description: "Gli argomenti forniti non sono validi per questo strumento",
    },
    browserNotAvailable: {
      title: "Browser Non disponibile",
      description: "Chrome browser istanza non è disponibile",
    },
    toolNotFound: {
      title: "Strumento non trovato",
      description: "Lo strumento richiesto non è disponibile",
    },
    validation: {
      title: "Errore di convalida",
      description: "Si prega di controllare il vostro input e riprovare",
      toolRequired: "La selezione degli strumenti è richiesta",
      argumentsInvalid: "Gli argomenti devono essere validi JSON",
    },
    network: {
      title: "Errore di rete",
      description:
        "Si è verificato un errore di rete durante l'esecuzione dello strumento",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Non sei autorizzato a eseguire gli strumenti del browser",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Esecuzione strumento Browser è vietato",
    },
    notFound: {
      title: "Non trovato",
      description: "Lo strumento del browser richiesto non è stato trovato",
    },
    serverError: {
      title: "Errore del server",
      description:
        "Un errore del server interno è avvenuto durante l'esecuzione degli strumenti",
    },
    unknown: {
      title: "Errore sconosciuto",
      description:
        "Un errore sconosciuto si è verificato durante l'esecuzione degli strumenti",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai dei cambiamenti non salvati che possono essere persi",
    },
    conflict: {
      title: "Conflitto",
      description:
        "Si è verificato un conflitto durante l'esecuzione dello strumento",
    },
  },

  success: {
    title: "Strumento eseguito con successo",
    description: "Lo strumento del browser è stato eseguito con successo",
  },

  shared: {
    instanceId: {
      label: "Sessione ID",
      description:
        "Sessione del browser ID. Ogni ID unico ottiene la propria scheda isolata. Lasciare vuoto per utilizzare la sessione predefinita.",
      placeholder: "ad esempio la mia sessione-1",
    },
  },

  repository: {
    execute: {
      start: "Avviare l'esecuzione dello strumento del browser",
      success: "Strumento Browser eseguito con successo",
      error: "Errore di eseguire strumento del browser",
    },
    mcp: {
      connect: {
        start: "Collegamento al server Chrome DevTools MCP",
        success: "Collegato al server MCP con successo",
        error: "Non è riuscito a connettersi al server MCP",
        failedToInitialize: "Non inizializzato Chrome DevTools MCP server",
      },
      closePage: {
        noSession: "Nessuna sessione attiva. niente da chiudere",
        switchedToPage: "Pagina chiusa, a pagina {{pageId}}",
        closedPage: "Pagina chiusa {{pageId}}",
        pageNotInSession: "Pagina {{pageId}} non appartiene a questa sessione",
      },
      tool: {
        call: {
          start: "Chiamare lo strumento MCP",
          success: "Strumento MCP chiamato con successo",
          error: "Errore chiamando lo strumento MCP",
          invalidJsonArguments: "Argomenti non validi JSON",
          executionFailed: "Esecuzione degli strumenti guasto: {{error}}",
          newPageFailed: "Non poteva aprire una nuova pagina",
          toolExecutionFailed: "Non eseguito {{toolName}}",
        },
      },
    },
  },
};
