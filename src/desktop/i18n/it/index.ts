/**
 * Desktop API translations (English)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  "take-screenshot": {
    title: "Prendere Schermata Desktop",
    titleShort: "Immagine di schermo",
    dynamicTitle: "Schermata: {{target}}",
    description:
      "Cattura uno screenshot del desktop o una regione dello schermo",
    form: {
      label: "Prendere Screenshot",
      capturing: "Catturare...",
      refresh: "Recuperare",
      description:
        "Cattura uno screenshot del desktop completo o una regione specifica",
      fields: {
        outputPath: {
          label: "Percorso di uscita",
          description:
            "Percorso assoluto per salvare lo screenshot. Omit per restituire la base in linea64.",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "Indice di schermo",
          description:
            "Indice schermo/monitor (0 = primario). Preferisci monitorName su questo.",
          placeholder: "0",
        },
        monitorName: {
          label: "Nome del monitor",
          description:
            "Monitorare il nome di uscita (ad es. DP-1, HDMI-1). Eseguire elenco-monitori prima di vedere i nomi disponibili.",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "Larghezza massima",
          description:
            "Abbassare a questa larghezza se la cattura è più ampia. Utile per AI - le catture a 4 motori sono enormi.",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "Screenshot catturato con successo",
      imagePath: "Percorso dove è stato salvato lo screenshot",
      imageData: "Base64-encoded PNG dati screenshot",
      imageUrl: "URL per accedere allo screenshot",
      width: "Larghezza dello schermo in pixel",
      height: "Altezza dello schermo in pixel",
      monitorName: "Monitor che è stato catturato",
      originalWidth: "Larghezza originale prima di downscaling",
      originalHeight: "Altezza originale prima dell'aumento",
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
        description:
          "Non sei autorizzato a catturare gli screenshot del desktop",
      },
      forbidden: {
        title: "Accesso negato",
        description: "La cattura di screenshots desktop è vietata",
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
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Schermata catturata",
      description: "Lo screenshot del desktop è stato catturato con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      captureAutomation: "Automazione di Cattura",
    },
  },
  "get-accessibility-tree": {
    title: "Ottenere l'albero di accesso",
    titleShort: "A11y Tree",
    dynamicTitle: "A11y: {{app}}",
    description:
      "Ottenere l'albero di accessibilità della finestra concentrata o una specifica applicazione",
    form: {
      label: "Ottenere l'albero di accesso",
      description:
        "Recuperare l'albero di accessibilità AT - SPI per l'ispezione desktop UI",
      fields: {
        appName: {
          label: "Nome dell'applicazione",
          description:
            "Nome del processo o titolo della finestra per il bersaglio (omit per la finestra concentrata)",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "Max Depth",
          description:
            "Profondità massima dell'albero a traversare (default: 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "Includere azioni",
          description:
            "Mostra le azioni disponibili per nodo (cliccare, premere, attivare...). Più dettaglio ma più grande uscita.",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Albero di Accessibilità recuperato con successo",
      tree: "Albero di accesso come testo strutturato",
      nodeCount: "Numero totale di nodi traversati",
      truncated: "Se la query timed out e l'output possono essere incompleti",
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
          "Si è verificato un errore di rete durante il recupero dell'albero di accessibilità",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato ad accedere all'albero di accessibilità",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso all'albero di accessibilità è vietato",
      },
      notFound: {
        title: "Non trovato",
        description:
          "L'applicazione di destinazione o la finestra non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante il recupero dell'albero di accessibilità",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante il recupero dell'albero di accessibilità",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante il recupero dell'albero di accessibilità",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Accessibilità albero recuperato",
      description: "L'albero di accessibilità è stato recuperato con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      accessibilityAutomation: "Automazione di Accessibilità",
    },
  },
  "list-monitors": {
    title: "Elenco Monitor",
    titleShort: "Monitor",
    description:
      "Elenca tutti i monitor collegati con risoluzione, posizione e indice",
    form: {
      label: "Elenco Monitor",
      description:
        "Enumerare tutti i display collegati. Utilizzare i nomi del monitor per individuare le schermate specifiche per gli screenshot.",
      fields: {},
    },
    response: {
      success: "Monitori elencati con successo",
      monitors: "Array di monitor collegati",
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
          "Si è verificato un errore di rete durante l'elenco dei monitor",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a elencare i monitor",
      },
      forbidden: {
        title: "Accesso negato",
        description: "I monitor di lista sono vietati",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'elenco dei monitor",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante il monitoraggio dell'elenco",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description: "Un conflitto si è verificato durante i monitor di elenco",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "L'elenco dei monitor non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Monitori elencati",
      description: "Tutti i monitor collegati sono stati elencati con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      captureAutomation: "Automazione di Cattura",
    },
  },
  click: {
    title: "Fare clic su",
    titleShort: "Fare clic su",
    dynamicTitle: "Clic: {{x}}, {{y}}",
    description:
      "Spostare il mouse in coordinate assolute ed eseguire un clic del mouse",
    form: {
      label: "Fare clic su",
      description: "Spostare il mouse sulle coordinate indicate e fare clic",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Coordinata orizzontale dello schermo in pixel (dal bordo sinistro)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description:
            "Coordinata verticale dello schermo in pixel (dal bordo superiore)",
          placeholder: "200",
        },
        button: {
          label: "Pulsante del mouse",
          description:
            "Pulsante del mouse per fare clic (sinistra, centrale, destra)",
          placeholder: "sinistra",
          options: {
            left: "Sinistra",
            middle: "Medio Oriente",
            right: "Giusto.",
          },
        },
        doubleClick: {
          label: "Doppio click",
          description: "Eseguire un doppio click invece di un singolo clic",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Fare clic su eseguito con successo",
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
          "Si è verificato un errore di rete durante l'esecuzione del clic",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a eseguire clic sul desktop",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Eseguire clic desktop è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'esecuzione del clic",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'esecuzione del clic",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'esecuzione del clic",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Fare clic su Eseguita",
      description: "Il click del mouse è stato eseguito con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "type-text": {
    title: "Tipo",
    titleShort: "Tipo",
    dynamicTitle: "Tipo: {{text}}",
    description:
      "Digitare il testo nella finestra concentrata utilizzando la simulazione della tastiera",
    form: {
      label: "Tipo",
      description:
        "Invia tasti alla finestra concentrata per digitare il testo",
      fields: {
        text: {
          label: "Testo",
          description: "Il testo da digitare nella finestra focalizzata",
          placeholder: "Ciao, World!",
        },
        delay: {
          label: "Ritardo (ms)",
          description: "Ritardo tra tastiere in millisecondi (default: 12)",
          placeholder: "12",
        },
        windowId: {
          label: "Finestra ID",
          description:
            "Concentra questa finestra UUID prima di digitare (da list-finestre)",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Titolo della finestra",
          description:
            "Finestra di messa a fuoco contenente questo titolo prima di digitare",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Testo digitato con successo",
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
          "Si è verificato un errore di rete durante la digitazione del testo",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a digitare il testo sul desktop",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Scrivere testo sul desktop è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la digitazione del testo",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la digitazione del testo",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante la digitazione del testo",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Tipo di testo",
      description: "Il testo è stato digitato con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "press-key": {
    title: "Chiave di stampa",
    titleShort: "Chiave di stampa",
    dynamicTitle: "Chiave: {{key}}",
    description: "Premere una combinazione chiave o chiave utilizzando xdotool",
    form: {
      label: "Chiave di stampa",
      description:
        "Invia un evento di stampa chiave al desktop utilizzando la sintassi chiave xdotool",
      fields: {
        key: {
          label: "chiave",
          description:
            "Nome chiave o combinazione in sintassi xdotool (es. Ritorno, ctrl+c, alt+F4)",
          placeholder: "Return",
        },
        repeat: {
          label: "Ripeti il conteggio",
          description: "Numero di volte per premere il tasto (default: 1)",
          placeholder: "1",
        },
        delay: {
          label: "Ritardo (ms)",
          description:
            "Ritardo tra ripetizioni di tasti in millisecondi (default: 0)",
          placeholder: "0",
        },
        windowId: {
          label: "Finestra ID",
          description:
            "Concentra questa finestra UUID prima di premere il tasto",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Titolo della finestra",
          description:
            "Finestra di messa a fuoco contenente questo titolo prima di premere il tasto",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Chiave pressata con successo",
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
          "Si è verificato un errore di rete durante la pressione della chiave",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a premere i tasti sul desktop",
      },
      forbidden: {
        title: "Accesso negato",
        description: "È vietato premere i tasti sul desktop",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante la pressione della chiave",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la pressione della chiave",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto premendo la chiave",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Chiave pressata",
      description: "La chiave è stata stampata con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "move-mouse": {
    title: "Muovete il mouse",
    titleShort: "Muovete il mouse",
    dynamicTitle: "Spostamento: {{x}}, {{y}}",
    description:
      "Spostare il cursore del mouse in coordinate di schermata assolute",
    form: {
      label: "Muovete il mouse",
      description:
        "Spostare il cursore del mouse sulla posizione della schermata specificata",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Coordinata orizzontale dello schermo in pixel (dal bordo sinistro)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description:
            "Coordinata verticale dello schermo in pixel (dal bordo superiore)",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "Mouse si è mosso con successo",
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
          "Si è verificato un errore di rete durante lo spostamento del mouse",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a spostare il mouse sul desktop",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Spostare il mouse sul desktop è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante lo spostamento del mouse",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante lo spostamento del mouse",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante lo spostamento del mouse",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Spostamento del mouse",
      description: "Il cursore del mouse è stato spostato con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  scroll: {
    title: "Scambio",
    titleShort: "Scambio",
    dynamicTitle: "Scorrelazione: {{direction}}",
    description:
      "Scorrere alla posizione del mouse corrente o coordinate specificate",
    form: {
      label: "Scambio",
      description:
        "Scorrere verso l'alto, verso il basso, a sinistra o a destra nella posizione indicata",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Posizione orizzontale per scorrere (utilizza la posizione corrente se omessa)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description:
            "Posizione verticale per scorrere a (utilizza la posizione corrente se omessa)",
          placeholder: "200",
        },
        direction: {
          label: "Direzione",
          description: "Scorrere la direzione",
          placeholder: "giù",
          options: {
            up: "Su.",
            down: "Giù",
            left: "Sinistra",
            right: "Giusto.",
          },
        },
        amount: {
          label: "Importo",
          description: "Numero di passaggi di scorrimento (default: 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "Scroll eseguito con successo",
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
        description: "Si è verificato un errore di rete durante lo scorrimento",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a scorrere sul desktop",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Scorrere sul desktop è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante lo scorrimento",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante lo scorrimento",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description: "Un conflitto si è verificato durante lo scorrimento",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Scorrelare Eseguita",
      description: "La pergamena è stata eseguita con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      inputAutomation: "Automazione dell'ingresso",
    },
  },
  "get-focused-window": {
    title: "Ottenere la finestra messa a fuoco",
    titleShort: "Finestra focalizzata",
    description: "Ottieni informazioni sulla finestra attualmente focalizzata",
    form: {
      label: "Ottenere la finestra messa a fuoco",
      description:
        "Recuperare la finestra ID, titolo e PID della finestra attiva",
      fields: {},
    },
    response: {
      success: "Concentrati informazioni finestra recuperato con successo",
      windowId: "X11 finestra ID della finestra concentrata",
      windowTitle: "Titolo testo della finestra focalizzata",
      pid: "Processo ID della finestra concentrata",
      width: "Larghezza finestra in pixel",
      height: "Altezza della finestra in pixel",
      monitor: "Monitora l'indice della finestra",
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
          "Si è verificato un errore di rete durante l'ottenimento della finestra concentrata",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato ad ottenere informazioni sulle finestre",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Ottenere informazioni finestra è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessuna finestra focalizzata è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'ottenimento della finestra concentrata",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'ottenimento della finestra concentrata",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato mentre ottenere la finestra concentrata",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Finestra concentrata recuperato",
      description:
        "Le informazioni della finestra concentrata sono state recuperate con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      windowManagement: "Gestione della finestra",
    },
  },
  "list-windows": {
    title: "Elenco di Windows",
    titleShort: "Elenco di Windows",
    description: "Elenca tutte le finestre aperte sul desktop",
    form: {
      label: "Elenco di Windows",
      description:
        "Recuperare un elenco di tutte le finestre aperte con i loro ID, titoli e posizioni",
      fields: {},
    },
    response: {
      success: "Lista finestra recuperata con successo",
      windows: "Elenco delle finestre aperte",
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
          "Si è verificato un errore di rete durante l'elenco delle finestre",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a elencare le finestre",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Le finestre delle inserzioni sono vietate",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessuna finestra è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante l'elenco delle finestre",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'elenco delle finestre",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'elenco delle finestre",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Elencato di Windows",
      description: "L'elenco delle finestre è stato recuperato con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      windowManagement: "Gestione della finestra",
    },
  },
  "focus-window": {
    title: "Finestra di messa a fuoco",
    titleShort: "Finestra di messa a fuoco",
    dynamicTitle: "Focus: {{target}}",
    description: "Portare una finestra in primo piano e darlo fuoco",
    form: {
      label: "Finestra di messa a fuoco",
      description: "Concentra una finestra dal suo ID, PID, o titolo",
      fields: {
        windowId: {
          label: "Finestra ID",
          description:
            "X11 finestra ID (es. 0x1234). Prende la priorità su altre opzioni.",
          placeholder: "0x1234",
        },
        pid: {
          label: "Processo ID",
          description:
            "Concentra la finestra che appartiene a questo processo ID",
          placeholder: "12345",
        },
        title: {
          label: "Titolo della finestra",
          description:
            "Concentrare la finestra il cui titolo contiene questa stringa (segretario)",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "Finestra focalizzata con successo",
      error: "Messaggio di errore",
      executionId: "Esecuzione ID per il monitoraggio",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description:
          "Si prega di fornire almeno uno di: windowId, pid, o titolo",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante la messa a fuoco della finestra",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a mettere a fuoco le finestre",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Concentrando le finestre è vietato",
      },
      notFound: {
        title: "Non trovato",
        description: "La finestra specificata non è stata trovata",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno mentre si concentra la finestra",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato mentre si concentra la finestra",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto mentre si concentrava la finestra",
      },
      notImplemented: {
        title: "Non implementato",
        description:
          "Questa funzione non è disponibile sul tuo sistema operativo",
      },
    },
    success: {
      title: "Finestra messa a fuoco",
      description: "La finestra è stata portata in primo piano con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      windowManagement: "Gestione della finestra",
    },
  },
  "move-window-to-monitor": {
    title: "Spostare la finestra per monitorare",
    titleShort: "Spostare la finestra",
    dynamicTitle: "Spostamento: {{target}}",
    description: "Spostare una finestra su un monitor specifico",
    form: {
      label: "Spostare la finestra per monitorare",
      description:
        "Spostare una finestra dal suo ID, PID, o il titolo di un monitor di destinazione",
      fields: {
        windowId: {
          label: "Finestra ID",
          description:
            "KWin finestra interna UUID (da list-finestre). Presta la priorità su pid e il titolo.",
          placeholder: "{uuid}",
        },
        pid: {
          label: "Processo ID",
          description:
            "Spostare la finestra che appartiene a questo processo ID",
          placeholder: "12345",
        },
        title: {
          label: "Titolo della finestra",
          description:
            "Spostare la finestra il cui titolo contiene questa stringa (case-insensibile)",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "Nome del monitor",
          description:
            "Nome del monitor di destinazione (ad es. DP-1, HDMI -A-1). Utilizzare list-monitor per visualizzare i nomi disponibili.",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "Indice di monitoraggio",
          description:
            "Indice di monitoraggio target (0-based). Utilizzare monitorName quando possibile.",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "Se la mossa è riuscita",
      movedTo: "Monitorare la finestra è stata spostata",
      windowTitle: "Titolo della finestra che è stato spostato",
      error: "Messaggio di errore se l'operazione non è riuscita",
      executionId: "Unico identificatore per questa esecuzione",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description:
          "Si prega di fornire almeno un identificatore di finestra e un obiettivo del monitor",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante lo spostamento della finestra",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a spostare le finestre",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Le finestre mobili sono proibite",
      },
      notFound: {
        title: "Non trovato",
        description: "La finestra o il monitor specificato non è stato trovato",
      },
      serverError: {
        title: "Errore del server",
        description:
          "Si è verificato un errore del server interno durante lo spostamento della finestra",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante lo spostamento della finestra",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti non salvati che possono essere persi",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato mentre si sposta la finestra",
      },
    },
    success: {
      title: "Finestra spostata",
      description:
        "La finestra è stata spostata al monitor di destinazione con successo",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automazione desktop",
      windowManagement: "Gestione della finestra",
    },
  },

  title: "Strumenti di automazione Desktop",
  description: "Controllare il desktop: screenshot, mouse, tastiera, finestre",
  category: "Desktop",
  summary:
    "Automazione desktop cross-platform: Linux (ydotool/KWin/pyatspi) e Windows (PowerShell/UIAutomation)",
  tags: {
    desktopAutomation: "Automazione desktop",
    inputAutomation: "Automazione dell'ingresso",
    windowManagement: "Gestione della finestra",
    captureAutomation: "Automazione di Cattura",
    accessibilityAutomation: "Automazione di Accessibilità",
  },

  tool: {
    takeScreenshot: "Prendere Screenshot",
    getAccessibilityTree: "Ottenere l'albero di accesso",
    listMonitors: "Elenco Monitor",
    click: "Fare clic su",
    typeText: "Tipo",
    pressKey: "Chiave di stampa",
    moveMouse: "Muovete il mouse",
    scroll: "Scambio",
    getFocusedWindow: "Ottenere la finestra messa a fuoco",
    listWindows: "Elenco di Windows",
    focusWindow: "Finestra di messa a fuoco",
    moveWindowToMonitor: "Spostare la finestra per monitorare",
  },

  widget: {
    refresh: "Aggiorna",
    noWindows: "Nessuna finestra aperta trovata",
    windowCount_one: "Finestra {{count}}",
    windowCount_other: "Finestre {{count}}",
    actionFocus: "Focus",
    actionType: "Tipologia",
    actionKey: "chiave",
    actionMove: "Muovetevi!",
    actionA11y: "A11y",
    actionTypeText: "Tipo",
    actionPressKey: "Chiave di stampa",
    actionScreenshot: "Immagine di schermo",
    actionScreenshotOnMonitor: "Schermata: {{monitor}}",
    actionA11yTree: "A11y Tree",
    actionAllWindows: "← Tutte le finestre",
    actionAllMonitors: "Tutti i monitor →",
    actionScreenshotLink: "Schermo →",
    actionMoveWindowHere: "Spostare la finestra qui",
    labelPrimary: "Primario",
    statusFocused: "Finestra focalizzata",
    statusTyped: "Tipologia",
    statusPressed: "Pressato",
    statusMoved: "Spostato",
    statusScrolled: "Scorrelato",
    statusMouseMoved: "Il mouse si è mosso",
    statusClickExecuted: "Fare clic su eseguito",
    labelSaved: "Salvataggio:",
    labelTruncated: " ⁇  Truncated",
    filterPlaceholder: "Filtra nodi...",
    titleTypeText: "Tipo",
    titlePressKey: "Chiave di stampa",
    titleClick: "Fare clic su",
    titleScroll: "Scambio",
    titleMoveMouse: "Muovete il mouse",
    titleMoveWindow: "Spostare la finestra",
    titleA11yTree: "Albero di accesso",
    titleListWindows: "Finestre",
    titleListMonitors: "Monitor",
    titleGetFocusedWindow: "Finestra focalizzata",
    titleFocusWindow: "Finestra di messa a fuoco",
  },

  repository: {
    platformNotSupported:
      "Piattaforma non supportata: {{platform}}. Linux e Windows sono supportati.",
    windowsNotSupported: "Supporto di Windows in arrivo",
    macosNotSupported: "supporto macOS in arrivo",
    commandFailed: "Comando fallito: {{error}}",
    toolNotFound:
      "Strumento richiesto non trovato: {{tool}}. Installarlo con: {{installCmd}}",
    screenshotFailed: "Non riuscito a catturare screenshot",
    accessibilityFailed: "Non è riuscito a ottenere l'albero di accessibilità",
    accessibilityFailedWithError:
      "Non è riuscito a ottenere l'albero di accessibilità: {{error}}",
    focusWindowRequiresIdentifier:
      "Almeno uno di windowId, pid o titolo è richiesto",
    missingDep:
      "Pacchetto di sistema richiesto mancante: {{dep}}. Una finestra di dialogo auth di sistema dovrebbe essere apparsa - approvarla per installare automaticamente.",
    scriptWriteFailed: "Non è riuscito a scrivere script: {{error}}",
    monitorNotFoundByName: 'Monitor " {{monitorName}} " non trovato',
    noMonitorsDetected: "Nessun monitor rilevato",
    invalidWindowHandle:
      'Invalid windowId: " {{handle}} " non è una maniglia di finestra numerica valida',
    screenIndexOutOfRange: "Indice dello schermo {{screen}} fuori gamma",
    unknownKeyName: "Nome chiave sconosciuto: {{key}}",
    focusedWindowParseFailed:
      "Non riuscito a parse in uscita di finestra focalizzata",
    couldNotListWindows: "Non è possibile elencare le finestre",
    noWindowWithPid: "Nessuna finestra con PID {{pid}}",
    noWindowWithTitle:
      'Nessuna finestra con il titolo contenente " {{title}} "',
    provideMonitorNameOrIndex: "Fornire monitorName o monitorIndex",
    monitorNotFound: "Non trovato: {{monitor}}",
    noActiveWindow: "Nessuna finestra attiva",
    kwinNoOutput: "Lo script KWin non ha prodotto alcun output",
    kwinNoWindowData: "Nessun dato di finestra nell'output dello script KWin",
    windowMoveNoEffect:
      "La mossa della finestra non ha effetto. la finestra non ha mai raggiunto il monitor {{monitor}}",
  },
};
