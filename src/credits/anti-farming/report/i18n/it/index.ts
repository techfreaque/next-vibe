import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { antiFarming: "anti-agricoltore", admin: "admin" },
  get: {
    title: "Rapporto gratuito sull'agricoltura di credito",
    titleShort: "Relazione sull'agricoltura",
    description:
      "Chi è l'agricoltura crediti liberi. Le subnet principali da tentativi bloccati e da piscine libere rivendicate, domini di posta elettronica superiori tra i registri duplicati e usa e getta, e i limiti attivi.",
    fields: {
      days: {
        label: "Finestra (giorni)",
        description:
          "Guarda indietro questo molti giorni per tentativi bloccati, piscine per gli ospiti e domini di posta elettronica. I pool di account contano sempre l'attuale mese UTC.",
      },
    },
    response: {
      window: "Finestra",
      thresholds: "Limiti attivi",
      totals: "Atti bloccati",
      subnetsByBlocked: "Subnets Top da tentativi bloccati",
      subnetsByClaims: "Sottorete top da piscine gratuite rivendicate",
      emailDomains: "domini e-mail top",
    },
    success: {
      title: "Rapporto di allevamento pronto",
      description: "Rapporto anti-agricoltore generato",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Firma in primo luogo",
      },
      forbidden: { title: "Accesso negato", description: "Admins solo" },
      server: {
        title: "Errore del server",
        description: "Non è possibile costruire la relazione agricola",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Qualcosa è andato storto",
      },
      validation: {
        title: "Richiesta non valida",
        description: "I giorni devono essere tra 1 e 365",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Nulla trovato",
      },
      conflict: { title: "Conflitto", description: "Richiesta di conflitti" },
      network: {
        title: "Errore di rete",
        description: "Richiesta non ha raggiunto il server",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima",
      },
    },
  },
  widget: {
    refresh: "Aggiorna",
    loading: "Caricamento del rapporto sull'agricoltura...",
    windowLine:
      "Ultimi giorni {{days}} (dal momento {{from}}). Piscine di account: {{month}} (UTC).",
    kpi: {
      total: "Totale bloccata",
      subnetAccountLimit: "Limite di conto raggiunto",
      subnetGuestLimit: "Limite degli ospiti colpito",
      duplicateEmail: "Duplicare email",
      disposableEmail: "E-mail monouso",
      subnetSignupLimit: "Limite di iscrizione colpito",
    },
    col: {
      subnet: "Subnet",
      blocked: "Bloccato",
      accountGranted: "Acct ok",
      accountBlocked: "Articolo n",
      guestGranted: "Ospite ok",
      guestBlocked: "Ospite no",
      lastSeen: "Ultimo accesso",
      domain: "Domini",
      duplicate: "Duplicare",
      disposable: "Monouso",
      total: "Totale",
    },
    colHint:
      "Acct = pool di account questo mese, Guest = piscine per gli ospiti nella finestra. ok = ottenuto crediti gratuiti, no = budget subnet pieno.",
    empty: {
      subnets: "Nessuna attività subnet in questa finestra.",
      domains:
        "Nessuna registrazione duplicata o usa e getta in questa finestra.",
    },
    limits: {
      accountPerSubnet: "Piscine di conto per subnet al mese",
      guestPerSubnet: "Piscine per subnet al giorno",
      guestIpWindow: "Gli ospiti di uno IP condividono una piscina per (ore)",
      signupLookback: "Spesa degli ospiti effettuata in registrazione da (ore)",
      subnetPrefix: "Dimensione subnet",
      signupsPerSubnet: "Nuovi conti per subnet per 24 h",
    },
  },
};
