import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Richiesta non valida",
      description: "Controlli la richiesta.",
    },
    unauthorized: {
      title: "Accedi per continuare",
      description: "Acceda per aprire la panoramica delle pubblicazioni.",
    },
    forbidden: {
      title: "Solo per amministratori",
      description: "È necessario il ruolo di amministratore.",
    },
    notFound: {
      title: "Nessun dato",
      description: "Questa istanza non contiene dati sulle pubblicazioni.",
    },
    server: {
      title: "Panoramica delle pubblicazioni",
      description: "Impossibile caricare la panoramica delle pubblicazioni.",
    },
    network: {
      title: "Errore di rete",
      description: "Non è possibile raggiungere il server",
    },
    unknown: {
      title: "Panoramica delle pubblicazioni",
      description: "Impossibile caricare la panoramica delle pubblicazioni.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "La richiesta è in conflitto con i dati attuali",
    },
  },
  title: "Panoramica delle pubblicazioni",
  description: "Forum pubblico e invii salvati in IndexNow.",
  threads: "Discussioni pubbliche",
  savedUrls: "URL salvati in IndexNow",
  snapshotOn: "Situazione al {{date}} (UTC)",
  newestThread: "Ultima discussione pubblica",
  indexingSnapshot: "Stato di IndexNow",
  newestOn: "Ultima discussione pubblica del {{date}}.",
  noThreads: "Il forum non contiene ancora discussioni pubbliche.",
  indexingSavedOn:
    "Ultimo salvataggio IndexNow il {{date}}. I motori di ricerca indicano separatamente lo stato di indicizzazione.",
  noIndexingSnapshot: "Questa istanza non ha invii IndexNow registrati.",
  noIndexingRecordsYet: "Nessun dato registrato",
  loading: "Caricamento della panoramica delle pubblicazioni…",
};
