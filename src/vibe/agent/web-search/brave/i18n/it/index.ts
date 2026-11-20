import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  get: {
    title: "Ricerca sul Web",
    titleShort: "Ricerca di Brave",
    dynamicTitle: "Ricerca: {{query}}",
    description:
      "Cerca su internet per informazioni, notizie, fatti o eventi recenti. Utilizzare questo quando avete bisogno di informazioni aggiornate o per verificare i fatti.",
    form: {
      title: "Parametri di ricerca",
      description: "Configurare la tua richiesta di ricerca web",
    },
    submitButton: {
      label: "Cerca",
      loadingText: "Cercando...",
    },
    backButton: {
      label: "Indietro",
    },
    fields: {
      query: {
        title: "Ricerca di Query",
        description:
          "Domanda di ricerca chiara e specifica. Usa parole chiave piuttosto che domande.",
        placeholder: "Inserisci la tua richiesta di ricerca...",
      },
      maxResults: {
        title: "Max risultati",
        description: "Numero di risultati da restituire (1-10)",
      },
      includeNews: {
        title: "Includi le notizie",
        description:
          "Includere i risultati delle notizie per gli eventi attuali",
      },
      freshness: {
        title: "Freschezza",
        description: "Filtra i risultati per quanto recenti sono",
        options: {
          day: "Giorno passato",
          week: "Rassegna",
          month: "Passato Mese",
          year: "Anno passato",
        },
      },
    },
    response: {
      success: {
        title: "Operazione riuscita",
        description: "Se la ricerca è stata di successo",
      },
      message: {
        title: "Messaggio",
        description: "Messaggio di stato sulla ricerca",
      },
      query: {
        title: "Query",
        description: "La query di ricerca che è stata eseguita",
      },
      results: {
        title: "Risultati",
        description: "Array dei risultati della ricerca",
        result: "Risultato",
        item: {
          title: "Risultato della ricerca",
          description: "Risultati di ricerca individuali",
          url: "URL",
          snippet: "Snippet",
          age: "Età",
          source: "Fonte",
        },
      },
      cached: {
        title: "Cached",
        description: "Se i risultati sono stati serviti dalla cache",
      },
      timestamp: {
        title: "Timestamp",
        description: "Quando la ricerca è stata eseguita",
      },
    },
    errors: {
      queryEmpty: {
        title: "La richiesta di ricerca è necessaria",
        description: "Si prega di fornire una query di ricerca",
      },
      queryTooLong: {
        title:
          "La query di ricerca è troppo lunga (caratteri massimo {{maxLength}})",
        description: "La query deve essere 400 caratteri o meno",
      },
      timeout: {
        title: "Ricerca richiesta time out",
        description: "La ricerca ha richiesto troppo tempo per completare",
      },
      searchFailed: {
        title: "Ricerca fallita",
        description: "Si è verificato un errore durante la ricerca",
      },
      validation: {
        title: "Ricerca non valida",
        description:
          "Si prega di controllare i parametri di ricerca e riprovare",
      },
      internal: {
        title: "Qualcosa di strano",
        description:
          "Non siamo riusciti a completare la tua ricerca. Per favore prova di nuovo",
      },
      notConfigured: {
        title:
          "La chiave {{label}} API non è configurata. Aggiungi {{envKey}} = <your-key> al tuo file.env. Ottieni la tua chiave a {{url}}",
        description: "Impostare {{label}} per abilitare la ricerca web",
      },
    },
    success: {
      title: "Ricerca di successo",
      description: "La ricerca web completata con successo",
    },
  },
  tags: {
    search: "Cerca",
    web: "Web",
    internet: "Internet",
  },
};
