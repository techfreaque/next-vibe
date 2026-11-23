import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Informazioni su di noi: {{appName}}",
    category: "Chi siamo",
    description:
      "Scopri la missione di {{appName}} per fornire conversazioni AI non censurate",
    imageAlt: "Informazioni su {{appName}}",
    keywords: "circa {{appName}}, non censurato AI, missione AI, valori AI",
    ogTitle: "Informazioni su {{appName}}: Piattaforma AI non censurata",
    ogDescription:
      "Scopri la nostra missione per democratizzare l'accesso a AI non censurato",
    twitterTitle: "Informazioni su {{appName}}",
    twitterDescription:
      "Scopri la nostra missione per conversazioni AI non censurate",
  },
  hero: {
    eyebrow: "Informazioni su {{appName}}",
    title: "Un’IA che risponde a te.",
    subtitle:
      "{{modelCount}} modelli, {{skillCount}} skill e circa {{toolCount}} strumenti. SSH, email, automazione del browser e attività pianificate. Provalo gratis su {{appName}} o eseguilo sul tuo computer.",
    ctaPrimary: "Inizia a chattare",
    ctaSecondary: "Leggi il blog",
  },
  stats: {
    models: "Modelli AI",
    skills: "competenze",
    tools: "strumenti",
    founded: "fondata",
  },
  backToHome: "Torna a casa",
  title: "Informazioni su {{appName}}",
  subtitle: "Conversazioni AI non censurate",
  description:
    "Dal {{foundedYear}}, {{appName}} ti dà accesso ai migliori modelli IA. Scegli il modello e decidi tu quali filtri applicare.",
  values: {
    title: "I nostri principi",
    description: "Quattro regole per ogni funzionalità di {{appName}}.",
    excellence: {
      title: "Scegli il filtro",
      description:
        "Modelli tradizionali, aperti o senza censura. Scegli il livello di filtro per ogni conversazione.",
    },
    innovation: {
      title: "open source, tutto",
      description:
        "{{appName}} gira su next-vibe, che è open source su GitHub. Leggi il codice, fai un fork ed eseguilo sul tuo hardware.",
    },
    integrity: {
      title: "Privato per default",
      description:
        "Con la modalità in incognito le conversazioni restano sul tuo dispositivo. Conserviamo temporaneamente i contenuti generati per motivi tecnici. I dati restano tuoi.",
    },
    collaboration: {
      title: "Sviluppo pubblico",
      description:
        "Sul blog trovi la roadmap, le scelte di architettura e i tentativi falliti. Le tue segnalazioni ci aiutano a decidere cosa sviluppare.",
    },
  },
  mission: {
    title: "Il tuo AI. Le tue regole.",
    subtitle: "Democratizzare l'accesso a uncensored AI",
    description:
      "I grandi fornitori di IA filtrano le domande e tengono nascoste le regole. Crediamo che gli adulti sappiano scegliere. Per questo {{appName}} riunisce modelli e livelli di filtro e lascia a te la scelta.",
    vision: {
      title: "La visione",
      description:
        "Una piattaforma per i migliori modelli IA, tradizionali, aperti e senza censura. I limiti li decidi tu.",
    },
    approach: {
      title: "L'approccio",
      description:
        "Aggiungiamo in fretta i modelli migliori e diamo loro strumenti per ricerca, memoria e automazione. La privacy è inclusa di default.",
    },
    commitment: {
      title: "L'impegno",
      description:
        "Prezzi trasparenti, senza trucchi. Puoi lasciare la piattaforma in qualsiasi momento e ospitare lo stesso codice sul tuo computer.",
    },
  },
  contact: {
    title: "Domande? Parla con noi.",
    description:
      "Segnalazioni, collaborazioni, stampa o bug. Una persona legge ogni messaggio.",
    cta: "Contattaci",
    selfHost: "Installalo sul tuo computer",
  },
  post: {
    title: "Informazioni su di noi",
    description: "Informazioni su di noi",
    form: {
      title: "Informazioni su di noi",
      description: "Configurare i parametri di noi",
    },
    response: {
      title: "Risposta",
      description: "Su di noi i dati di risposta",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
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
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
