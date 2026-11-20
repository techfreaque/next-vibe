import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    remoteSync: "Sincronizzazione remota",
  },
  taskSync: {
    post: {
      title: "Sincronizzazione remota",
      titleShort: "Sincronizzazione",
      description:
        "Sincronizzazione bidirezionale basata su cursor tra le istanze. Invia i cursori locali, riceve solo i record più recenti.",
      instanceId: {
        label: "Articolo ID",
        description: "L'identificatore dell'istanza di chiamata",
      },
      syncCursors: {
        label: "Revisione:",
        description:
          "Per-domain cursori che indicano l'ultima posizione sincronizzata",
      },
      capabilitiesVersion: {
        label: "Versione delle capacità",
        description:
          "Versione dell'istantanea di capacità dell'istanza ricevente il chiamante detiene",
      },
      senderCapabilitiesVersion: {
        label: "Versione delle capacità di sicurezza",
        description:
          "Versione dell'istantanea di capacità dell'istanza di chiamata",
      },
      capabilitiesJson: {
        label: "Capacità JSON",
        description:
          "Istantanea del manifesto dello strumento per registrarsi su questo caso",
      },
      pushPayloads: {
        label: "Spingere i carichi di pagamento",
        description:
          "I dischi del chiamante più recenti dei suoi cursori di spinta. applicati qui prima che la risposta sia serializzata (pull push-bidirezionale)",
      },
      syncPayloads: {
        label: "Caricamenti",
        description: "Registra più recente dei cursori forniti, per dominio",
      },
      syncCounts: {
        label: "Contatori di sincronizzazione",
        description: "Numero di record restituiti per dominio",
      },
      remoteCursors: {
        label: "Cursori remoti",
        description:
          "I cursori attuali di questa istanza. avanzano i cursori locali a questi",
      },
      remoteCapabilitiesVersion: {
        label: "Versione di funzionalità remote",
        description: "La versione attuale delle capacità di questa istanza",
      },
      capabilities: {
        label: "Capacità",
        description: "Istantanea di manifesto di strumento da questa istanza",
      },
      serverTime: {
        label: "Tempo del server",
        description: "timestamp del server corrente",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Richiesta di sincronizzazione non valida",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        internal: {
          title: "Errore di sincronizzazione",
          description: "Si è verificato un errore durante la sincronizzazione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di sincronizzare",
        },
        notFound: {
          title: "Non trovato",
          description: "Obiettivo Sync non trovato",
        },
        network: {
          title: "Errore di rete",
          description: "Non poteva raggiungere l'estremità di sincronizzazione",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        conflict: {
          title: "Conflitto",
          description: "Rilevato conflitto sintetico",
        },
      },
      success: {
        title: "Traduzione:",
        description: "Sync completato con successo",
      },
    },
  },
};
