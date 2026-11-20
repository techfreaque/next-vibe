import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Costruisci con next-vibe - {{appName}}",
    category: "Sviluppatori",
    description:
      "next-vibe trasforma qualsiasi endpoint in una forma web, il comando CLI, lo strumento MCP, lo schermo nativo, e AI -callable skill - simultaneamente. Automatizzare tutto ciò che un umano può fare su un computer.",
    imageAlt: "Piattaforma di sviluppo next-vibe - {{appName}}",
    keywords:
      "next-vibe, automazione AI, piattaforma di sviluppo, automazione aziendale, integrazione ERP, automazione di produzione, {{appName}}",
    ogTitle: "Costruisci con next-vibe - {{appName}}",
    ogDescription:
      "Una base di codice. Ogni superficie. Automatizzare linee di produzione, sistemi ERP, flussi di lavoro desktop - tutto ciò che un umano può fare su un computer.",
    twitterTitle: "Costruisci con next-vibe - {{appName}}",
    twitterDescription:
      "Una base di codice. Ogni superficie. Automatizzare linee di produzione, sistemi ERP, flussi di lavoro desktop - tutto ciò che un umano può fare su un computer.",
  },

  hero: {
    eyebrow: "Carriere",
    title: "Il lavoro si fa in pubblico.",
    subtitle:
      "Qui trovi il lavoro, senza annunci di assunzione. Porta next-vibe ai tuoi clienti, automatizza attività reali e guadagna con le skill che pubblichi. Tutto quello che ti serve è su GitHub.",
    ctaPrimary: "Inizia a sviluppare",
    ctaSecondary: "Leggi la documentazione",
  },

  audience: {
    title: "Chi costruisce con next-vibe",
    items: {
      freelancers: {
        title: "Freelancers e agenzie",
        description:
          "Consegnare gli strumenti AI -powered ai clienti senza costruire backend separati, CLIs e UIs. Una base di codice, ogni superficie.",
      },
      businessDevs: {
        title: "Sviluppatori di affari",
        description:
          "Collegare i flussi di lavoro ERP, CRM o qualsiasi sistema interno ai flussi di lavoro AI. Passare i dati dentro, prendere decisioni fuori - nessun codice colla.",
      },
      industrialDevs: {
        title: "Industriale e incorporato",
        description:
          "Automatizzare la configurazione del dispositivo sulle linee di produzione. Trigger AI abilità quando i sensori fuoco. Misurare con il senso Vibe, agire con pilota automatico.",
      },
      enterpriseDevs: {
        title: "Squadre di Enterprise",
        description:
          "Sostituire utensili frammentati con una piattaforma unificata. Web UI, CLI, MCP, app nativa - stesso endpoint, zero duplicazione.",
      },
    },
  },

  useCases: {
    title: "Cosa puoi costruire",
    items: {
      erpIntegration: {
        title: "Integrazione del sistema aziendale ERP &",
        description:
          "Passare i dati di produzione in un'abilità AI che classifica i difetti, aggiorna l'inventario o attiva i flussi di lavoro di riordine. Il tuo punto di vista e' il ponte.",
      },
      desktopAutomation: {
        title: "Automazione desktop completa",
        description:
          "next-vibe può prendere il controllo dell'intero desktop, compreso un browser. Compila il modulo, raschiatura, navigazione, operazioni di file - scripted una volta, viene eseguito ovunque.",
      },
      productionLine: {
        title: "Automazione della linea di produzione",
        description:
          "Configurare i dispositivi in remoto tramite endpoint. Controllo qualità del trigger via Vibe Sense. Quando una misura attraversa una soglia, un'abilità AI risponde.",
      },
      autopilotScheduling: {
        title: "Azioni programmate AI",
        description:
          "Autopilota gestisce le tue abilità in un programma. Versare una fonte di dati ogni ora, riassumere i registri notturni, spingere gli avvisi quando le anomalie appaiono.",
      },
      vibeSenseMonitoring: {
        title: "Sense → decidere → agire condutture",
        description:
          "Vibe Sense misura qualsiasi cosa: uscita macchina, salute API, profondità della coda. Nutrire la lettura in un'abilità. L'abilità decide. Un punto finale agisce.",
      },
      skillEconomy: {
        title: "Vendere ciò che si costruisce",
        description:
          "Avvolgi la tua automazione come un'abilità. Condividi il link. Guadagnare il 10% di ogni pagamento da ogni utente che si registra attraverso di esso - ricorrente, per tutto il tempo che pagano.",
      },
    },
  },

  architecture: {
    title: "Una definizione. Ogni superficie.",
    subtitle:
      "Scrivi un file definition.ts per funzionalità. Il framework genera il resto.",
    surfaces: {
      web: "Modulo web",
      cli: "comando CLI",
      mcp: "Strumento MCP",
      native: "Schermo nativo",
      cron: "Lavoro Cron",
      ai: "AI - abilità incallabile",
    },
    description:
      "La piattaforma viene rilevata a tempo di esecuzione. Lo stesso endpoint che rende un web UI per un essere umano diventa uno strumento selezionabile in macchina per un agente AI - nessun codice aggiuntivo.",
  },

  referral: {
    title: "Costruiscilo. Condividilo. Guadagnati.",
    description:
      "Ogni abilità che condividi porta il tuo link di riferimento. 10% di ogni pagamento da parte degli utenti che porti. Più 5% quando il link di qualcun altro porta un utente alla tua abilità. Ripresa, per tutto il tempo che pagano.",
    cta: "Come funziona l'economia di abilità",
  },

  cta: {
    title: "Inizia con un punto finale.",
    subtitle:
      "Aggiungi next-vibe a un progetto esistente in pochi minuti. O iniziare dal ponteggio e distribuire uno strumento completo multi-superficie oggi.",
    primary: "Iniziare",
    secondary: "Esplora i messaggi della storia",
  },

  // kept for type compatibility
  post: {
    title: "Costruisci con next-vibe",
    description: "La piattaforma di sviluppo endpoint",
    form: {
      title: "Configurazione",
      description: "Configurare i parametri",
    },
    response: {
      title: "Risposta",
      description: "Dati di risposta",
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
