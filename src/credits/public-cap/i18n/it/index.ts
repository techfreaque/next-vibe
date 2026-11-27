import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "pubblico-cap",
    admin: "admin",
  },
  get: {
    perDayUnit: "crediti/giorno",
    lead: "Visitatore",
    ip: "Indirizzo IP",
    globalCap: "Limite giornaliero raggiunto",
    leadCap: "Limite visitatore raggiunto",
    ipCap: "Limite IP raggiunto",
    singleRequest: "Richiesta troppo costosa",
    failClosed: "Bloccato, controllo del limite fallito",
    poolReserved: "Crediti riservati",
    threshold80: "80% del limite usato",
    threshold100: "Limite esaurito",
    other: "Altro",
    changeCap: "Modifica limite",
    limits: "Limiti",
    capHint: "Condiviso da tutti i visitatori senza piano a pagamento",
    usedOfCap: "{{used}} su {{cap}} usati",
    exceededHint:
      "I visitatori gratuiti sono bloccati fino al reset giornaliero.",
    resetAt: "Ultimo reset {{time}}",
    title: "Ottieni il cappuccio pubblico di livello libero",
    titleShort: "Tappo di livello gratuito",
    description:
      "Visualizzare la spesa e il cap di credito free-tier globale di oggi",
    container: {
      title: "Public Free-Tier Daily Cap",
      description:
        "Limite di spesa giornaliero globale per gli utenti non paganti",
    },
    spendToday: {
      content: "Spettacolo oggi",
    },
    capAmount: {
      content: "Tappo giornaliero",
    },
    remainingToday: {
      content: "Restare oggi",
    },
    percentUsed: {
      content: "Usato",
    },
    lastResetAt: {
      content: "Ultimo ripristino",
    },
    capExceeded: {
      content: "Cap Exceeded",
    },
    perLeadCap: { content: "Per-Lead Cap" },
    perIpCap: { content: "Per- IP Cap" },
    topSpenders: { content: "I migliori trascorsi gratis oggi" },
    recentEvents: { content: "Recenti Cap Eventi" },
    noData: "Ancora oggi niente.",
    success: {
      title: "Cap Status recuperato",
      description: "Stato di cappuccio libero pubblico recuperato con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Collegamento di rete fallito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Configurazione del tappo non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non recuperato lo stato del cappuccio",
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
        description: "Il conflitto di risorse",
      },
    },
  },
  post: {
    perDayUnit: "crediti al giorno",
    back: "Indietro",
    decrease: "Riduci di 100",
    increase: "Aumenta di 100",
    title: "Aggiornamento pubblico Free-Tier Cap",
    titleShort: "Aggiornamento Cap",
    description:
      "Aggiornare il berretto giornaliero di spesa di credito globale per gli utenti non paganti",
    capAmount: {
      label: "Daily Cap (crediti)",
      description:
        "Crediti massimi utenti non paganti possono spendere collettivamente al giorno",
      placeholder: "ad esempio 500",
    },
    perLeadCap: {
      label: "Per-Lead Daily Cap (crediti)",
      description:
        "Max crediti gratuiti un ospite / carico può bruciare al giorno",
      placeholder: "per esempio 20",
    },
    perIpCap: {
      label: "Per- IP Daily Cap (crediti)",
      description: "Max crediti gratuiti uno IP può bruciare al giorno",
      placeholder: "ad esempio 40",
    },
    message: {
      content: "Risultato",
    },
    success: {
      title: "Cap Aggiornato",
      description: "Tappo giornaliero aggiornato con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "L'importo del cappuccio deve essere un numero positivo",
      },
      network: {
        title: "Errore di rete",
        description: "Collegamento di rete fallito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Configurazione del tappo non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito ad aggiornare il tappo",
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
        description: "Il conflitto di risorse",
      },
    },
  },
  repository: {
    capUpdated: "Tappo giornaliero impostato su crediti {{capAmount}}",
    capExceeded:
      "La quota gratuita rimasta per oggi non basta per questa richiesta. Riprova domani o usa crediti a pagamento.",
    leadCapExceeded:
      "Limite gratuito giornaliero raggiunto su questo dispositivo o rete. I tuoi crediti gratuiti restano nel tuo account e tornano utilizzabili domani. I crediti a pagamento funzionano subito.",
    reservedByRunningReply:
      "I tuoi crediti gratuiti coprono ancora una risposta in corso. Aspetta che finisca, poi invia di nuovo.",
    capUnavailable:
      "I crediti gratuiti sono temporaneamente indisponibili. Riprova più tardi.",
    getCapFailed:
      "Non riuscita a recuperare la configurazione del cappuccio free-tier",
    updateCapFailed:
      "Non è riuscito ad aggiornare il tappo di livello gratuito",
    incrementFailed: "Non ha registrato la spesa free-tier",
  },
};
