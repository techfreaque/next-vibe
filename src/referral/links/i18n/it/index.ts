import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Inviti",
  tags: {
    referral: "rinvio",
    links: "collegamenti",
  },
  get: {
    title: "I miei link con statistiche",
    titleShort: "Link con statistiche",
    description:
      "I tuoi link invito, uno per ogni pubblicazione. Ogni link mostra visite, registrazioni e guadagni.",
    response: {
      links: "Links",
    },
    widget: {
      title: "Link con statistiche",
      subtitle:
        "Usa un link per ogni pubblicazione. Scopri quali video, post o newsletter ti fanno guadagnare.",
      create: "Nuovo link",
      refresh: "Aggiorna",
      loading: "Caricamento dei link…",
      copy: "Copia",
      copied: "Affrontato",
      visits: "Visite",
      signups: "Registrazioni",
      paid: "Pagamenti",
      earned: "Guarnizione",
      pending: "{{amount}} in attesa",
      code: "Code {{code}}",
      landsOn: "Destinazione: {{path}}",
      empty: {
        title: "Non hai ancora link con statistiche",
        hint: "Crea un link per ogni video, post o numero della newsletter. A ogni link associamo visite, registrazioni e pagamenti.",
        cta: "Crea il tuo primo link",
      },
      cli: {
        header: "{{count}} link con statistiche",
        funnel:
          "{{visits}} visite, {{signups}} registrazioni, {{paid}} utenti paganti, {{earned}} guadagnati ({{pending}} in attesa)",
      },
    },
  },
  post: {
    title: "Crea un link con statistiche",
    titleShort: "Nuovo link",
    description:
      "Crea un link invito per una pubblicazione. Il link contiene il tuo codice invito e i tag UTM per contare visite, registrazioni e pagamenti.",
    submit: "Creare link",
    fields: {
      name: {
        label: "Nome",
        description: "Solo tu lo vedi. Nomina il posizionamento.",
        placeholder: "YouTube recensione, novembre",
      },
      source: {
        label: "Dove la posta",
        description:
          "La piattaforma o il sito, ad esempio youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "Campagna",
        description:
          "I link di gruppi, ad esempio un video o un problema. Facoltativo.",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "Mezzo medio",
        description: "Tipo di collocamento. Predefiniti per il rinvio.",
        placeholder: "video",
      },
      destinationPath: {
        label: "Pagina di atterraggio",
        description: "Percorso su questo sito dove i visitatori sbarcano",
        placeholder: "/",
      },
      code: {
        label: "Codice invito",
        description:
          "Uno dei tuoi codici. Empty utilizza il tuo primo codice attivo.",
        placeholder: "MYCODE",
      },
    },
    response: {
      id: "Link ID",
      url: "Link",
      code: "Codice invito",
    },
    widget: {
      back: "Indietro",
      hint: "Usa un link per ogni pubblicazione. Così vedi quale porta utenti paganti.",
      presets: "Dove lo condividerai?",
      created: "Il tuo link è pronto",
      copy: "Copia",
      copied: "Affrontato",
    },
  },
  errors: {
    validation: {
      title: "Input non valido",
      description: "Controllare i campi evidenziati",
    },
    unauthorized: {
      title: "Non firmato",
      description: "Accedi per gestire i tuoi link",
    },
    forbidden: {
      title: "Operazione non consentita",
      description: "Non è possibile gestire questi link",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Questo link non esiste",
    },
    conflict: {
      title: "Conflitto",
      description: "Qualcosa è cambiato nel frattempo, ricaricare e riprovare",
    },
    server: {
      title: "Errore del server",
      description: "Non è possibile completare la richiesta",
    },
    network: {
      title: "Errore di rete",
      description: "Richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa di imprevisto è fallito",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvare o scartare le modifiche prima",
    },
    noCode:
      "Crea prima il tuo codice invito. I link con statistiche usano quel codice.",
    notYourCode:
      "Codice {{code}} non è uno dei tuoi codici di riferimento attivi",
    invalidDestination:
      "Il percorso di atterraggio deve iniziare con / e rimanere su questo sito",
  },
  success: {
    title: "Fatto",
    description: "Link pronto",
  },
};
