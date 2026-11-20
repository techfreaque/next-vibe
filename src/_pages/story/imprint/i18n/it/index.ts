import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Note legali | {{appName}}",
    category: "Informazioni legali",
    description: "Note legali e dati del gestore di {{appName}}",
    imageAlt: "Note legali",
    keywords:
      "note legali, informazioni sul gestore, dati del fornitore, {{appName}}",
    ogTitle: "Note legali | {{appName}}",
    ogDescription: "Note legali e dati del gestore di {{appName}}",
    twitterTitle: "Note legali | {{appName}}",
    twitterDescription: "Note legali e dati del gestore di {{appName}}",
  },
  printAriaLabel: "Stampa le note legali",
  onThisPage: "In questa pagina",
  printButton: "Stampa",
  title: "Note legali",
  lastUpdated: "Ultimo aggiornamento: novembre 2026",
  bindingVersionNotice:
    "Questa traduzione è fornita a titolo informativo. Fa fede la versione in lingua tedesca.",
  introduction:
    "Queste note riportano le informazioni su {{appName}} richieste dalla normativa applicabile.",
  sections: {
    companyInfo: {
      title: "Gestore",
      description: "Il gestore di {{appName}} è:",
      vat: "IVA: non viene addebitata in base al regime per le piccole imprese previsto dal § 19 della legge tedesca sull’IVA (UStG).",
    },
    responsiblePerson: {
      title: "Responsabile",
      description:
        "Informazioni sulla persona responsabile dei contenuti di questo sito.",
    },
    contactInfo: {
      title: "Contatti",
      description: "Come contattarci per questioni legali e commerciali.",
    },
    disclaimer: {
      title: "Limitazione di responsabilità",
      copyright: {
        title: "Diritto d’autore",
        content:
          "Il diritto d’autore tutela tutti i contenuti di questo sito. È vietato utilizzarli senza autorizzazione.",
      },
      liability: {
        title: "Responsabilità",
        content:
          "Non rilasciamo dichiarazioni né garanzie sulla completezza, l’accuratezza o l’affidabilità delle informazioni contenute in questo sito.",
      },
      links: {
        title: "Link esterni",
        content:
          "Il nostro sito può contenere link a siti esterni. Non siamo responsabili del contenuto di tali siti.",
      },
    },
    disputeResolution: {
      title: "Risoluzione delle controversie",
      description:
        "Informazioni su come trattiamo e risolviamo le controversie.",
      content:
        "Non siamo tenuti né disponibili a partecipare a procedimenti di risoluzione delle controversie davanti a un organo arbitrale per i consumatori.",
    },
  },
  post: {
    title: "Note legali",
    description: "Endpoint delle note legali",
    form: {
      title: "Configurazione delle note legali",
      description: "Configura i parametri delle note legali",
    },
    response: {
      title: "Risposta",
      description: "Dati restituiti dalle note legali",
    },
    errors: {
      unauthorized: {
        title: "Non autorizzato",
        description: "Devi autenticarti",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai i permessi per accedere",
      },
      notFound: {
        title: "Risorsa non trovata",
        description: "La risorsa richiesta non esiste",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto di dati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
