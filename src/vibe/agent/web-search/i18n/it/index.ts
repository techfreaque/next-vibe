import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Information",
  enums: {
    provider: {
      AUTO: "Auto (consigliato)",
      BRAVE: "Brave Search",
      KAGI: "Kagi FastGPT",
    },
  },
  get: {
    title: "Ricerca sul Web",
    titleShort: "Ricerca web",
    dynamicTitle: "Ricerca: {{query}}",
    description:
      "Cerca su internet per informazioni, notizie, fatti o eventi recenti. Si indirizza automaticamente al tuo provider di ricerca preferito.",
    form: {
      title: "Ricerca web",
      description: "Cerca sul web con il tuo fornitore preferito",
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
      provider: {
        title: "Fornitore di ricerca",
        description:
          "Quale motore di ricerca da usare. Auto sceglie il vostro default o il più economico disponibile.",
        options: {
          auto: "Auto (consigliato)",
          brave: "Ricerca di Brave",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "Max risultati",
        description: "Numero di risultati da restituire (1-10). Brave solo.",
      },
      includeNews: {
        title: "Includi le notizie",
        description:
          "Includere i risultati delle notizie per gli eventi attuali. Brave solo.",
      },
      freshness: {
        title: "Freschezza",
        description: "Filtra i risultati di quanto siano recenti. Brave solo.",
        options: {
          day: "Giorno passato",
          week: "Rassegna",
          month: "Passato Mese",
          year: "Anno passato",
        },
      },
    },
    response: {
      provider: {
        title: "Fornitore",
        description: "Quale fornitore di ricerca è stato utilizzato",
      },
      output: {
        title: "Risposta AI",
        description: "AI -Riepilogo generato (solo Kagi)",
      },
      results: {
        title: "Risultati",
        description: "Risultati della ricerca web",
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
    },
    widget: {
      aiDefaultLabel: "predefinito AI:",
      switchTo: "Passare a",
      separatorDot: "·",
      via: "via {{provider}}",
      braveBanner: "Ricerca la tua AI con Kagi",
      kagiBanner: "Ricerca la tua AI con Brave",
      useBrave: "Usare Brave",
      useKagi: "Utilizzare Kagi",
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
      noProvider: {
        title: "Nessun fornitore di ricerca disponibile",
        description:
          "Non sono configurate chiavi API di ricerca. Impostare Brave Search o Kagi nel file.env.",
      },
      noProviderAdmin: {
        title:
          "Nessun provider di ricerca configurato. Aggiungi BRAVE_SEARCH_API_KEY o KAGI_API_KEY al tuo file.env.",
        description:
          "Ricerca Brave: https://api.search.brave.com/app/keys. Kagi : https://kagi.com/settings?p=api",
      },
      noProviderUser: {
        title: "La ricerca Web non è disponibile in questo momento.",
        description:
          "L'amministratore non ha ancora configurato un provider di ricerca.",
      },
      providerUnavailable: {
        title: "Fornitori di ricerca non disponibili",
        description:
          "Il provider di ricerca selezionato non è configurato. Scegliere un fornitore diverso o utilizzare auto.",
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
