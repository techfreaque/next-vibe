import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Inviti",
  tags: {
    referral: "referral",
    admin: "admin",
    analytics: "analytics",
  },
  enums: {
    sort: {
      revenue: "Entrate",
      commission: "Commissioni",
      payers: "Utenti paganti",
      signups: "Registrazioni",
      leads: "Lead",
      clicks: "Clic",
      conversion: "Da clic a registrazione",
      ownerQueue: "Coda pagamenti del titolare",
      ownerFree: "Libero da pagare (prima il più basso)",
      newest: "Codici più recenti",
    },
  },
  get: {
    title: "Panoramica inviti",
    titleShort: "Panoramica",
    description:
      "Tutti i codici invito e i partner in un'unica vista: clic, lead, registrazioni, utenti paganti, entrate, commissioni e coda dei pagamenti, a confronto con il periodo precedente.",
    fields: {
      search: {
        label: "Cerca",
        description: "Codice, etichetta o email del titolare",
        placeholder: "Codice, etichetta o email del titolare",
      },
      ownerUserId: {
        label: "Titolare",
        description: "Solo i codici di questo partner (ID utente)",
      },
      activeOnly: {
        label: "Solo codici attivi",
        description: "Nascondi i codici disattivati",
      },
      sortBy: {
        label: "Ordina i codici per",
        description: "Ordine della tabella dei codici",
      },
      limit: {
        label: "Codici mostrati",
        description: "Numero massimo di righe nella tabella dei codici",
      },
    },
    response: {
      window: "Periodo",
      kpis: "Numeri chiave",
      trend: "Andamento",
      codes: "Codici",
      codesTotal: "Codici nel filtro",
      overCommittedOwners: "Titolari oltre il saldo",
      payouts: "Coda dei pagamenti",
    },
    widget: {
      subtitle:
        "Clic, iscrizioni, ricavi e commissioni per codice partner, rispetto al periodo precedente.",
      kpi: {
        clicks: "Clic",
        clicksHint: "Arrivi da browser con un codice",
        leads: "Lead",
        leadsHint: "Visitatori attribuiti a un codice",
        signups: "Registrazioni",
        signupsHint: "{{rate}} dei clic",
        payers: "Utenti paganti",
        payersHint: "Utenti invitati che hanno pagato nel periodo",
        revenue: "Entrate",
        revenueHint: "Pagate dagli utenti invitati",
        commission: "Commissioni maturate",
        commissionHint: "{{pending}} in sospeso, {{confirmed}} confermate",
        payoutsPaid: "Pagamenti erogati",
        payoutsPaidHint: "Completati in questo periodo",
        queue: "Coda dei pagamenti",
        queueHint: "{{count}} richieste aperte",
        queueEmpty: "Nulla in attesa",
      },
      chart: {
        traffic: "Traffico",
        trafficSub: "Clic e lead attribuiti",
        conversions: "Conversioni",
        conversionsSub: "Nuove registrazioni e utenti paganti",
        money: "Entrate e commissioni",
        moneySub: "USD, per data di pagamento",
      },
      series: {
        clicks: "Clic",
        leads: "Lead",
        signups: "Registrazioni",
        payers: "Utenti paganti",
        revenue: "Entrate",
        commission: "Commissioni",
      },
      table: {
        title: "Codici",
        subtitle:
          "{{shown}} di {{total}} codici. Clicca un codice per aprire il suo report.",
        dimension: "Codice",
        clicks: "Clic",
        leads: "Lead",
        signups: "Registrazioni",
        payers: "Paganti",
        conversion: "Da clic a registrazione",
        revenue: "Entrate",
        commission: "Commissioni",
        signupsChange: "Registrazioni vs prec.",
        ownerQueue: "Coda del titolare",
        ownerFree: "Libero da pagare",
        inactive: "inattivo",
        overCommitted: "saldo superato",
        overCommittedOwners: "{{count}} titolari oltre il saldo",
        empty: "Nessun codice corrisponde a questi filtri.",
        sort: "Ordina",
      },
      payouts: {
        title: "Pagamenti per stato",
        subtitle:
          "Stato attuale di tutte le richieste. Clicca uno stato per gestire l'elenco.",
        dimension: "Stato",
        count: "Richieste",
        amount: "Importo",
        open: "Apri i pagamenti",
        empty: "Ancora nessuna richiesta di pagamento.",
      },
      filters: {
        search: "Cerca",
        owner: "Titolare",
        activeOnly: "Solo attivi",
        searchPlaceholder: "Codice, etichetta o email del titolare",
      },
      loading: "Caricamento panoramica inviti",
      cli: {
        payouts: "Coda dei pagamenti: {{count}} aperte, {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "Filtri non validi",
      description: "Controlla il periodo e i filtri",
    },
    unauthorized: {
      title: "Accesso non effettuato",
      description: "Accedi come admin per vedere le statistiche degli inviti",
    },
    forbidden: {
      title: "Solo admin",
      description: "Solo gli admin vedono le statistiche degli inviti",
    },
    notFound: {
      title: "Non trovato",
      description: "Nessun risultato per questi filtri",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono cambiati durante il caricamento, riprova",
    },
    server: {
      title: "Errore del server",
      description: "Impossibile generare la panoramica inviti",
    },
    network: {
      title: "Errore di rete",
      description: "La richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Prima salva o annulla le modifiche",
    },
  },
  success: {
    title: "Caricato",
    description: "Panoramica inviti caricata",
  },
};
