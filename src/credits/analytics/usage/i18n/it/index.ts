import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Consumo crediti",
    titleShort: "Consumo",
    description:
      "Spesa di crediti nel tempo: account vs ospiti, crediti gratuiti vs pacchetti, per modello, funzione e provider, con costo provider, margine e maggiori consumatori.",
    tags: {
      usage: "consumo crediti",
      margin: "margine",
    },
    fields: {
      actor: {
        label: "Consumatore",
        description: "Account, ospiti (senza account) o entrambi",
      },
      creditKind: {
        label: "Crediti",
        description: "Quota mensile gratuita, crediti da pacchetti o entrambi",
      },
      model: {
        label: "Modello",
        description: "Solo la spesa su questo ID modello",
      },
      feature: {
        label: "Funzione",
        description:
          "Solo la spesa su questa funzione (chat, Generate Image, ...)",
      },
      provider: {
        label: "Provider upstream",
        description: "Solo la spesa servita da questo provider upstream",
      },
      includeInternal: {
        label: "Includi account admin",
        description: "Conta anche la spesa degli account admin",
      },
    },
    response: {
      window: "Periodo",
      appliedFilters: "Filtri applicati",
      kpis: "Dati chiave",
      spendByActor: "Spesa per consumatore",
      spendByKind: "Spesa per tipo di credito",
      costVsSpend: "Valore speso vs costo provider",
      byModel: "Per modello",
      byFeature: "Per funzione",
      byProvider: "Per provider upstream",
      featureLabels: "Nomi delle funzioni",
      topSpenders: "Maggiori consumatori",
    },
    errors: {
      validation: {
        title: "Filtri non validi",
        description: "Controlla periodo e filtri, poi riprova.",
      },
      unauthorized: {
        title: "Accesso richiesto",
        description: "Accedi come admin per vedere il consumo crediti.",
      },
      forbidden: {
        title: "Solo admin",
        description: "Solo gli admin vedono il consumo crediti.",
      },
      notFound: {
        title: "Nessun risultato",
        description: "Nessun dato di consumo per questa richiesta.",
      },
      server: {
        title: "Report non riuscito",
        description: "Impossibile generare il report di consumo. Riprova.",
      },
      unknown: {
        title: "Errore imprevisto",
        description:
          "Qualcosa è andato storto durante il caricamento del report.",
      },
      network: {
        title: "Errore di connessione",
        description: "Il server non è raggiungibile.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Prima applica o scarta le modifiche ai filtri.",
      },
      conflict: {
        title: "Conflitto di dati",
        description:
          "I dati sono cambiati durante il caricamento. Aggiorna il report.",
      },
    },
    success: {
      title: "Report pronto",
      description: "Consumo crediti caricato",
    },
  },
  widget: {
    extra: {
      nothingRecorded: "Nulla registrato",
      paidShareHint2:
        "Pacchetti acquistati e abbonamenti, sul consumo con finanziamento noto; {{missing}} senza origine",
      costedPct: "Costo noto %",
      paidShare: "Quota pagata",
      paidShareHint:
        "Consumo da pacchetti acquistati e abbonamenti; valore totale {{value}}",
      freeCostHint3:
        "Costo fornitore di {{credits}} crediti gratuiti; costo registrato sul {{coverage}} del consumo",
      fundGrants: "Assegnati",
      boughtPct: "Acquistati %",
      subPct: "Abb. %",
      grantsPct: "Assegnati %",
      unknownPct: "Origine mancante %",
      fundingChart: "Consumo per finanziamento",
      fundingNote:
        "Quale fondo ha pagato ogni addebito: quota gratuita, bonus account / newsletter, pacchetti acquistati, abbonamento, crediti referral o assegnazioni admin. Salvato all'addebito; origine mancante solo per addebiti più vecchi.",
      fundAllowance: "Quota gratuita",
      fundPurchased: "Acquistati",
      fundSubscription: "Abbonamento",
      fundBonus: "Bonus assegnati",
      fundEarned: "Guadagni referral",
      fundUnknown: "Origine mancante",
      fundFreeBonus: "Bonus account / newsletter",
      fundFreeUnknown: "Gratuito, livello non registrato",
      fundAdminGrant: "Assegnazione admin",
      change: "vs prec.",
      paidPct: "Pagato %",
      topModel: "soprattutto {{model}}",
      spendersHint: "da {{count}} utenti",
      accountTag: "account",
      freeCostHint2:
        "Costo fornitore dell’uso gratuito; costo registrato sul {{coverage}} del consumo",
      notLoaded: "Report non caricato. Aggiorna per riprovare.",
      freeCost: "Costo dell’uso gratuito",
      freeCostHint:
        "Costo fornitore dell’uso della quota gratuita, dove registrato",
      markup: "Utile lordo (costo noto)",
      markupPct: "Margine",
      markupPctHint:
        "Resta dopo il costo fornitore, a valore di listino (0,01 $/credito), non cassa",
      kindNote2:
        "I crediti dei pacchetti uniscono acquisti, abbonamenti e assegnazioni admin; il consumo non registra quali.",
      modelNotRecorded: "modello non registrato",
      costedSpend: "Consumo con costo registrato",
      costChart: "Consumo con costo registrato vs costo fornitore",
      marginHint2: "Su {{value}} di consumo con costo registrato",
      marginHint:
        "{{value}} del valore consumato ha dati di costo; margine = questo valore meno il costo del fornitore",
      guestPct: "Ospiti %",
      freePct: "Gratis %",
      noCost: "nessun dato di costo",
    },
    kpi: {
      creditsSpent: "Crediti spesi",
      spendUsd: "Valore speso",
      guestShare: "Quota ospiti",
      freeShare: "Quota gratuita",
      upstreamCostUsd: "Costo provider",
      marginUsd: "Margine lordo",
      marginPct: "Margine",
      activeSpenders: "Consumatori attivi",
    },
    hint: {
      spendUsd: "Valore di listino a $0.01 per credito, non incassato",
      guestShare: "Speso da visitatori senza account",
      freeShare: "Pagato con la quota mensile gratuita",
      upstreamCostUsd: "Registrato su {{coverage}} della spesa",
      marginUsd: "Valore meno costo provider, solo righe con costo",
      marginPct: "Del valore speso con dati di costo",
      activeSpenders: "Account e ospiti con almeno una spesa",
    },
    chart: {
      actor: "Spesa: account vs ospiti",
      kind: "Spesa: quota gratuita vs crediti da pacchetti",
      kindNote:
        "I crediti da pacchetti includono acquisti, abbonamenti e accrediti admin.",
      cost: "Valore speso vs costo provider",
      costNote:
        "Il costo provider esiste solo dove l'addebito lo ha registrato.",
    },
    series: {
      users: "Account",
      guests: "Ospiti",
      free: "Quota gratuita",
      pack: "Crediti da pacchetti",
      spendUsd: "Valore speso",
      upstreamCostUsd: "Costo provider",
    },
    breakdown: {
      model: "Modello",
      feature: "Funzione",
      provider: "Provider",
      spender: "Consumatore",
      byModel: "Per modello",
      byFeature: "Per funzione",
      byProvider: "Per provider upstream",
      topSpenders: "Maggiori consumatori",
      topSpendersHint: "Clicca una riga per aprire l'account o l'ospite.",
      drillHint: "Clicca una riga per filtrare il report.",
    },
    column: {
      credits: "Crediti",
      usd: "Valore",
      costUsd: "Costo",
      marginPct: "Margine",
      spenders: "Consumatori",
      guestShare: "Ospiti",
      freeShare: "Gratis",
      transactions: "Addebiti",
    },
    label: {
      noModel: "Strumenti e media",
      noFeature: "Non registrato",
      noProvider: "Non registrato",
      chat: "Chat",
      guest: "Ospite {{id}}",
      guestTag: "ospite",
      lastActivity: "ultima spesa {{date}}",
    },
    filter: {
      actor: "Consumatore",
      creditKind: "Crediti",
      model: "Modello",
      feature: "Funzione",
      provider: "Provider",
      internal: "Admin inclusi",
    },
    empty: "Nessuna spesa di crediti in questo periodo.",
    includeInternal: "Includi admin",
  },
  enums: {
    actor: {
      all: "Tutti",
      users: "Account",
      guests: "Ospiti",
    },
    creditKind: {
      all: "Tutti i crediti",
      free: "Gratuiti",
      pack: "Tutti i pacchetti",
      purchased: "Acquistati",
      subscription: "Abbonamento",
      grants: "Assegnati",
    },
  },
};
