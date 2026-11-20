import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    noRowReturned: "Nessuna riga restituita dall'inserto",
    notYourConnection: "Questa connessione non appartiene a voi",
    mountNotFound: "Montaggio non trovato",
  },

  list: {
    title: "Regole montate",
    titleShort: "Montanti",
    description:
      "Scorciatoie di directory nominate per questa connessione. Ogni supporto appare come /ssh/ <connection> / <name> / in cortex. I terminali iniziano nella directory di default mount.",
    fields: {
      connectionId: {
        label: "Connessione",
        description: "Il collegamento SSH questi supporti appartengono a",
      },
    },
    response: {
      mounts: { title: "Montanti" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare l'ingresso e riprovare",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      server: {
        title: "Errore del server",
        description: "Non caricate i supporti",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione non trovata",
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
        description: "Il nome di montaggio esiste già su questa connessione",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
    },
    success: {
      title: "Supporti caricati",
      description: "Supporti di directory per questa connessione",
    },
  },

  create: {
    title: "Aggiungi il supporto",
    titleShort: "Aggiungi il supporto",
    description:
      "Aggiungi un collegamento di directory chiamato. Il nome diventa un segmento di percorso: /ssh/ <connection> / <name> /",
    fields: {
      connectionId: {
        label: "Connessione ID",
        description: "La connessione SSH per aggiungere il supporto al",
      },
      path: {
        label: "Percorso di directory",
        description:
          "Percorso assoluto sulla macchina, ad esempio /home/max/project. Sezione Cortex = nome base. Il cwd predefinito del terminale quando questo è il mount predefinito.",
        placeholder: "/home/utente/progetto",
      },
      isDefault: {
        label: "Montaggio predefinito",
        description:
          "Le nuove sessioni terminali iniziano in questa directory. Solo un supporto può essere predefinito per connessione.",
      },
    },
    response: {
      id: { title: "Montaggio ID" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla i campi del modulo e riprova",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      server: {
        title: "Errore del server",
        description: "Non riuscito a salvare il supporto",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione non trovata",
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
        title: "Nome Taken",
        description:
          "Un supporto con questo nome esiste già su questa connessione",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
    },
    success: {
      title: "Montaggio Aggiunto",
      description: "Supporto per directory aggiunto con successo",
    },
  },

  detail: {
    titleGet: "Montaggio",
    titleShortGet: "Montaggio",
    descriptionGet: "Visualizzare un collegamento di directory montato.",
    titlePatch: "Modifica",
    titleShortPatch: "Modifica",
    descriptionPatch:
      "Rinominare o spostare un collegamento di directory montato.",
    titleDelete: "Rimuovere il Monte",
    titleShortDelete: "Rimuovere il Monte",
    descriptionDelete:
      "Rimuovere una scorciatoia di montaggio directory da questa connessione.",
    fields: {
      mountId: {
        label: "Montaggio ID",
        description: "Unico identificatore di questo supporto",
      },
      path: {
        label: "Percorso di directory",
        description:
          "Percorso assoluto sulla macchina. Sezione Cortex = nome base.",
        placeholder: "/home/utente/progetto",
      },
      isDefault: {
        label: "Montaggio predefinito",
        description: "Nuove sessioni terminali iniziano in questa directory",
      },
    },
    response: {
      id: { title: "Montaggio ID" },
      name: { title: "Nome" },
      path: { title: "Sentiero" },
      isDefault: { title: "Predefinito" },
      createdAt: { title: "Creato" },
      updatedAt: { title: "Aggiornato" },
      deleted: { title: "Cancellato" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare l'ingresso e riprovare",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      server: {
        title: "Errore del server",
        description: "Non è possibile aggiornare il montaggio",
      },
      notFound: { title: "Non trovato", description: "Montaggio non trovato" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Nome Taken",
        description:
          "Un supporto con questo nome esiste già su questa connessione",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
    },
    successGet: {
      title: "Montaggio carico",
      description: "Dettagli del montaggio",
    },
    successPatch: {
      title: "Mount Aggiornato",
      description: "Montare aggiornato con successo",
    },
    successDelete: {
      title: "Montaggio rimosso",
      description: "Montaggio rimosso con successo",
    },
    widget: {
      confirmDelete: "Rimuovere questo supporto?",
    },
  },

  widget: {
    noMounts: "Nessun montaggio configurato",
    noMountsHint:
      "Aggiungi un supporto per creare una scorciatoia di directory. I terminali inizieranno nella directory di mount predefinita.",
    addMount: "Aggiungi il supporto",
    defaultBadge: "predefinito",
    cortexPath: "Sentiero Cortex",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
