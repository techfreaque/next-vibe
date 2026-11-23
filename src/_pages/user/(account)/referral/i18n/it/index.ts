import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  backToChat: "Torna a Chat",
  title:
    "Condividi il tuo link. Guadagna {{directPct}} di ogni pagamento. Per sempre.",
  description:
    "Chiunque si iscrive attraverso il vostro link vi paga {{directPct}} di ogni pagamento che fanno. Nessuna scadenza, niente tappo. Pubblicare una abilità e guadagnare {{skillBonusPct}} sugli utenti altri portare a esso.",
  tagline: "Referrali e competenze",

  hero: {
    directEarning: "Ti guadagni.",
    directNote: "da persone che si riferiscono, per sempre",
    bonusEarning: "Come creatore di abilità",
    bonusNote:
      "quando gli altri condividono la tua abilità, ricorrente per sempre",
  },

  commissionTable: {
    youLabel: "Tu sei",
    perMonth: "/ mo",
    colLevel: "Chi guadagna",
    colCut: "Taglio",
    alwaysYours: "sempre il tuo",
    heroLabel: "su ogni pagamento",
    heroSub: "Ripresa. Per sempre.",
    chainTitle: "10 iscritti. Quello che guadagni al mese.",
    chainSubtitle:
      "Ogni livello è la metà di quello sopra. Costruito una volta all'iscrizione: paga per sempre.",
    whoLabel0: "Lei: chiunque li abbia indirizzati direttamente",
    whoLabel1: "Creatore di abilità (se diverso) o il vostro referrer",
    whoLabel2: "Il referrer del loro referrer",
    whoLabel3: "Livello 4",
    whoLabel4: "Livello 5",
    whoLabel5: "Livello 6",
    tableNote:
      "Link referral: {{directPct}} per utente. La tua abilità condivisa da qualcun altro: {{skillBonusPct}} per utente. Entrambi ricorrenti, per sempre.",
  },

  // Story scenario section
  story: {
    title: "Come si mescola la catena",
    subtitle:
      "Stessi 10 abbonati. Ogni livello che si attiva aggiunge al totale: per sempre.",
    totalLabel: "Totale / mo",
    addedLabel: "+ {{amount}} da questo livello",
    levelLabel: "Livello {{n}} attivo",
    level1Desc: "I tuoi 10 abbonati diretti. {{directPct}} ciascuno.",
    level2Desc:
      "I tuoi referral fanno riferimento a qualcuno. Anche tu ne guadagni un po'.",
    level3Desc: "I loro rinvii si riferiscono. La catena continua a costruire.",
    level4Desc: "Quarto grado. Paga ancora.",
    level5Desc: "Quinto grado.",
    level6Desc: "Sesto grado. Ogni centesimo, per sempre.",
    noob: {
      label: "Iniziare",
      earning: "~ {{story_noob_earning}} /mo",
      desc: "{{story_noob_users}} paga gli abbonati tramite il link di riferimento. {{directPct}} ciascuno: reddito passivo da un tweet o post del blog.",
    },
    mid: {
      label: "Crescere il pubblico",
      earning: "~ {{story_mid_earning}} /mo",
      desc: "Abbonati {{story_mid_users}}: mix di link di riferimento e abilità. Alcuni dei loro amici si sono anche iscritti. La catena si sta costruendo.",
    },
    pro: {
      label: "Creatore creatore",
      earning: "~ {{story_pro_earning}} /mo",
      desc: "Abbonati {{story_pro_users}} attraverso link di riferimento + abilità, più i guadagni upline da persone che hanno riferito. Pienamente composto.",
    },
  },

  overview: {
    title: "I tuoi guadagni",
    subtitle: "Stat live. Aggiornamenti con ogni pagamento.",
  },

  howItWorks: {
    title: "Come funziona",
    step1Title: "Crea un codice invito",
    step1Body:
      "Codici unici per il pubblico diverso: gli amici, Discord, un post sul blog. Ogni tracciato separatamente.",
    step2Title: "Condividi il tuo link",
    step2Body:
      "link di riferimento → {{directPct}} per utente, per sempre. La tua abilità condivisa da altri → {{skillBonusPct}} per utente. Due fonti, zero lavoro extra.",
    step3Title: "Pagamento",
    step3Body:
      "Guadagni sbloccare {{holdDays}} giorni dopo ogni pagamento: la finestra di rimborso. Quindi spenderli come crediti o ritirarsi a BTC / USDC da {{minPayout}}.",
  },

  manage: {
    codesSubtitle: "Copia un link, condividilo, guardalo guadagnare.",
  },
  myCodes: {
    title: "I tuoi link",
  },
  cta: {
    title: "Creare un account per iniziare a guadagnare",
    description:
      "Ottieni il tuo link di riferimento. {{directPct}} su ogni pagamento: ricorrente, nessuna scadenza. Pubblicare una abilità e guadagnare {{skillBonusPct}} quando gli altri lo condividono.",
    signUp: "Crea account",
    logIn: "Accedi",
    pitch1:
      "Commissione di rinvio {{directPct}}: ricorrente, nessuna scadenza",
    pitch2:
      "Pubblica un'abilità → {{skillBonusPct}} da ogni utente che gli altri portano",
    pitch3:
      "Sblocca i giorni {{holdDays}} dopo il pagamento. Ritiri BTC / USDC da {{minPayout}}.",
  },
  payout: {
    title: "Ritirare i tuoi guadagni",
    description: "Due modi per usare quello che hai guadagnato",
    useAsCredits: "Utilizzare come crediti di chat",
    useAsCreditsDesc:
      "Instant. Niente minimo. Converte 1:1 a AI crediti di conversazione.",
    cryptoPayout: "Ritirata a cripto",
    cryptoPayoutDesc: "BTC o USDC al tuo indirizzo portafogli.",
    minimumNote:
      "Minimo: {{minPayout}}. Elaborato entro le ore {{cryptoPayoutHours}} dopo l'approvazione.",
  },
  audienceCallout: {
    title: "Due modi per guadagnare",
    newTitle: "Referral link: {{directPct}} per utente",
    newBody:
      "Condividi il tuo codice. Chiunque si iscrivono e paga ti dà {{directPct}} di ogni pagamento, ogni mese, per sempre. Mandalo una volta. Guadagnati per sempre.",
    newCta: "Ottieni il tuo link di riferimento",
    proTitle: "Creatore di abilità: {{skillBonusPct}} per utente",
    proBody:
      "Costruire una abilità. Condividi il suo link. Tutti coloro che si registrano attraverso il proprio link vi paga {{directPct}}, ricorrente. Il moltiplicatore: quando qualcun altro condivide la vostra abilità con il loro link, si guadagna ancora {{skillBonusPct}} come l'autore di abilità. La piattaforma traccia abilità autore: attribuzione passiva senza lavoro extra.",
    proCta: "Costruire una abilità",
  },
  discord: {
    title: "Unisciti alla comunità",
    description:
      "Condividere strategie, porre domande, connettersi con altri guadagni.",
    cta: "Iscriviti a Discord",
  },
};
