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
  get: {
    title: "Report codice invito",
    titleShort: "Report codice",
    description:
      "Un codice invito dall'inizio alla fine: chi ne è il titolare, come i clic diventano lead, registrazioni e utenti paganti, quanto ha incassato, quali commissioni ha generato e i pagamenti al titolare.",
    fields: {
      code: {
        label: "Codice invito",
        description:
          "Il codice da analizzare (maiuscole e minuscole indifferenti)",
        placeholder: "moemoe",
      },
    },
    response: {
      window: "Periodo",
      header: "Codice",
      kpis: "Numeri chiave",
      funnel: "Funnel",
      trend: "Andamento",
      balance: "Saldo del titolare",
      earningsByLevel: "Commissioni per livello",
      referredUsers: "Utenti invitati",
      referredTotal: "Utenti invitati in totale",
      payouts: "Pagamenti al titolare",
    },
    widget: {
      periodTitle: "Questo periodo",
      owner: "Titolare",
      ownerEmail: "Email del titolare",
      openOwner: "Apri titolare",
      label: "Etichetta",
      noLabel: "Nessuna etichetta",
      bonus: "Bonus di registrazione",
      bonusValue: "+{{credits}} crediti con il primo piano",
      noBonus: "Nessuno",
      status: "Stato",
      active: "Attivo",
      inactive: "Inattivo",
      created: "Creato",
      uses: "Registrazioni attribuite",
      editBonus: "Modifica bonus",
      reassign: "Riassegna codice",
      kpi: {
        clicks: "Clic",
        leads: "Lead",
        signups: "Registrazioni",
        signupsHint: "{{rate}} dei clic",
        payers: "Utenti paganti",
        payersHint: "Utenti invitati che hanno pagato nel periodo",
        revenue: "Entrate",
        commission: "Commissioni generate",
        commissionHint:
          "{{pending}} in sospeso fino alla fine del periodo di rimborso, {{confirmed}} confermate",
      },
      funnel: {
        title: "Funnel",
        subtitle: "Questo periodo",
        clicks: "Clic",
        leads: "Lead",
        signups: "Registrazioni",
        payers: "Utenti paganti",
      },
      chart: {
        conversions: "Conversioni",
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
      balance: {
        title: "Saldo del titolare (da sempre)",
        confirmed: "Guadagni confermati",
        pending: "In sospeso (periodo di rimborso)",
        paidOut: "Pagato",
        open: "In coda di pagamento",
        available: "Disponibile prima della coda",
        free: "Libero da pagare dopo la coda",
        overCommitted:
          "Le richieste aperte superano il saldo confermato. Non approvarle tutte.",
      },
      levels: {
        title: "Commissioni per livello",
        subtitle: "Generate dagli utenti di questo codice, in questo periodo",
        dimension: "Livello",
        direct: "Diretto (titolare del codice)",
        upline: "Upline {{level}}",
        count: "Pagamenti",
        total: "Guadagnato",
        pending: "In sospeso",
        confirmed: "Confermati",
        canceled: "Annullati",
        empty: "Nessuna commissione in questo periodo.",
      },
      users: {
        title: "Utenti invitati",
        subtitle: "Da sempre, chi paga di più in cima. {{shown}} di {{total}}.",
        dimension: "Utente",
        signedUp: "registrato il {{date}}",
        payments: "Pagamenti",
        revenue: "Entrate",
        commission: "Commissioni",
        unpaid: "nessun pagamento",
        empty: "Nessuno si è ancora registrato con questo codice.",
      },
      payouts: {
        title: "Pagamenti al titolare",
        subtitle: "Tutte le richieste di questo partner",
        dimension: "Richiesta",
        amount: "Importo",
        requested: "richiesto il {{date}}",
        processed: "elaborato il {{date}}",
        openAll: "Apri nei pagamenti",
        empty: "Questo partner non ha mai richiesto un pagamento.",
      },
      notFound: "Il codice {{code}} non esiste.",
      pickCode:
        "Scegli un codice dalla tabella della panoramica o inseriscilo qui sopra.",
      pickTitle: "Nessun codice selezionato",
      browseCodes: "Sfoglia i codici",
      subtitle:
        "Clic, iscrizioni, ricavi, commissioni e saldo del partner per un codice.",
      loading: "Caricamento report codice",
    },
  },
  errors: {
    validation: {
      title: "Dati non validi",
      description: "Controlla il codice e il periodo",
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
      title: "Codice non trovato",
      description: "Nessun codice invito corrispondente",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono cambiati durante il caricamento, riprova",
    },
    server: {
      title: "Errore del server",
      description: "Impossibile generare il report del codice",
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
    codeNotFound: "Il codice invito {{code}} non esiste",
  },
  success: {
    title: "Caricato",
    description: "Report codice caricato",
  },
};
