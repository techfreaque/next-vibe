import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  widget: {
    title: "Sincronizzazione inversa",
    description:
      "Punto finale del sistema. Chiamato dall'istanza di avvio per rispecchiare le modifiche syncScope al lato remoto.",
    note: "Non user-facing. invocato automaticamente sull'aggiornamento delle impostazioni di connessione.",
  },
  patch: {
    title: "Aggiornamento connessione inversa",
    titleShort: "Aggiornamento in corso",
    description:
      "Chiamato dall'istanza di avvio per sincronizzare le impostazioni di connessione all'altro lato",
    syncScope: {
      label: "Sync Scope",
      description:
        "Quali domini di dati da sincronizzare su questa connessione",
    },
    newInstanceId: {
      label: "Nome del sito",
      description:
        "Il nuovo nome di istanza del chiamante. aggiorna la nostra etichetta per esso",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare i dettagli e riprovare",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Devi essere connesso per aggiornare la connessione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questa connessione",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessuna connessione inversa trovata per questo caso",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'aggiornamento della connessione",
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
        description:
          "Si è verificato un conflitto durante l'aggiornamento della connessione",
      },
    },
    success: {
      title: "Collegamento Aggiornato",
      description:
        "Le impostazioni di connessione inversa sono state aggiornate",
    },
  },
};
