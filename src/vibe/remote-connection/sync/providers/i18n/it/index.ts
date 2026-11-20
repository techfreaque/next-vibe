import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  providers: {
    memories: "Memoria",
    documents: "Documenti",
    skills: "Skill",
    favorites: "Preferiti",
    threads: "Conversazioni",
  },
  providerDescriptions: {
    memories: "Sincronizza i tuoi ricordi AI attraverso le istanze",
    documents: "Sincronizza la libreria dei documenti",
    skills: "Sincronizza competenze e suggerimenti personalizzati",
    favorites: "Configurazioni preferite salvate da Sync",
    threads: "Sincronizzare thread e messaggi di conversazione",
  },
  get: {
    title: "Fornitori di sincronizzazione",
    titleShort: "Fornitori di sincronizzazione",
    description:
      "Elenca tutti i provider di sincronizzazione registrati per le impostazioni di connessione",
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      network: {
        title: "Errore di rete",
        description: "Non è riuscito a connettersi",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Ruolo di amministrazione richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun fornitore registrato",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscita a caricare i fornitori",
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
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Fornitori Caricati",
      description: "Elenco dei provider Sync recuperato con successo",
    },
  },
};
