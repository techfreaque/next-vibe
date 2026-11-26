import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Hai creato qualcosa con l’IA. Guadagna condividendolo.",
    description:
      "Per gli sviluppatori: i tuoi README GitHub, post sul blog e tutorial hanno già potenziale di riferimento. Ecco la matematica, compreso il bonus di abilità che si guadagna quando gli altri condividono la vostra abilità.",
    category: "Programma di affiliazione",
    imageAlt:
      "Terminale di uno sviluppatore con statistiche di guadagno accanto al codice",
    keywords:
      "programma di referral dello sviluppatore, affiliazione AI, sviluppatore passivo del reddito, monetizzazione open source",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Per gli sviluppatori",
    readTime: "5 minuti di lettura",
    title: "Hai creato qualcosa con l’IA. Guadagna condividendolo.",
    subtitle:
      "Stai già spedindo con AI. Il tuo link di riferimento è un flusso di entrate che non hai ancora acceso.",
  },
  useCase: {
    title: "Dove gli sviluppatori naturalmente fanno riferimento alle persone",
    p1: "Stai già creando contenuti che portano le persone agli strumenti. Un post sul tuo flusso di lavoro. Una README che menziona lo AI che hai usato. Un tutorial YouTube. Una risposta Discord dove si consiglia una piattaforma. Tutti questi hanno il potenziale di riferimento che la maggior parte degli sviluppatori lasciano non catturati.",
    p2: "Ovunque citeresti naturalmente {{appName}}, aggiungi il tuo link di riferimento. Le persone che fanno clic e abbonano ti guadagnano il 10% di ogni pagamento che fanno: ogni mese, per sempre. Non cambi quello che dici. Basta aggiungere il link.",
    examples: [
      'GitHub README: "Ho costruito questo con {{appName}} \'s API. Provalo: [il tuo link]"',
      'Messaggio del blog piè di pagina: "Strumenti che uso:... {{appName}} per l\'accesso AI [ref link]"',
      'Discord /Slack: "Ho usato {{appName}}, ecco il mio referral se vuoi in"',
      'Descrizione YouTube: " Strumenti AI utilizzati in questo video: {{appName}} [referral link]"',
    ],
  },
  skillAngle: {
    title: "Pubblicare una abilità: guadagnare quando gli altri lo condividono",
    p1: "Ogni abilità che pubblichi ha un link condivisibile. Condividi da te e ottieni il 10% di sconto diretto. Quando un altro membro lo condivide con il proprio link, si guadagna ancora 5% di ogni pagamento da quegli utenti, per sempre.",
    p2: "Il 5% spetta a chi ha creato la skill. Se un utente la trova nella directory, condivide il link con un amico e l’amico si iscrive, ricevi automaticamente il 5% dei suoi pagamenti. La piattaforma attribuisce il compenso in base all’autore della skill. La skill continua a farti guadagnare anche quando non la promuovi.",
    p3: "Inserisci il tuo link di abilità in un GitHub README. Postarlo in uno sviluppatore Discord. Ogni persona che si iscrive attraverso di esso vi paga 10%. Ogni persona che qualcun altro porta alla tua abilità ti paga il 5%. Stessa abilità, due percorsi di reddito.",
  },
  math: {
    title: "La matematica (numeri reali)",
    subtitle: "Il tuo link (10%) vs. la tua abilità condivisa da altri (5%)",
    tableHeaderProfile: "Profilo utente",
    tableHeaderSpend: "Spesa mensile",
    tableHeaderDirect: "Solo diretto (10%)",
    tableHeaderSkill: "Altri condividono la tua abilità (5%)",
    rows: [
      {
        profile: "Abbonato di avviamento",
        spend: "{{planPrice}} / Mo",
        direct: "{{planEarn}} / Mo",
        skill: "{{planSkillEarn}} / Mo",
      },
      {
        profile: "Starter + 1 pacchetto di credito",
        spend: "{{plusPackSpend}} / Mo",
        direct: "{{plusPackEarn}} / Mo",
        skill: "{{plusPackSkillEarn}} / Mo",
      },
      {
        profile: "utente pesante: Starter + {{heavyPacks}} packs",
        spend: "{{heavySpend}} / Mo",
        direct: "{{heavyEarn}} / Mo",
        skill: "{{heavySkillEarn}} / Mo",
      },
      {
        profile: "Power user: Starter + pacchetti {{powerPacks}}",
        spend: "{{powerSpend}} / Mo",
        direct: "{{powerEarn}} / Mo",
        skill: "{{powerSkillEarn}} / Mo",
      },
    ],
    note: "Un utente di potenza attraverso il tuo link ti guadagna {{powerEarn}} /mo. Sono gli abbonati del piano {{powerVsPlan}} in uno. Gli sviluppatori già pagano per gli strumenti AI. Si convertono velocemente e raramente si diffondono.",
    growthNote:
      "Come {{appName}} aggiunge modelli e funzionalità, le tendenze ARPU aumentano. Referrals si fanno oggi guadagnare di più il prossimo anno senza alcun lavoro in più.",
  },
  chain: {
    title:
      "La catena: cosa succede quando chi hai invitato invita altre persone",
    p1: "Quando le persone che si riferiscono andare avanti per riferire gli altri, si guadagna una parte di quei pagamenti anche. Ecco l'esatto guasto:",
    level0: "→ referral diretto: 10% di ogni pagamento, per sempre",
    level1:
      "I loro rinvii (livello 2): ~5% di ogni pagamento (mezza del pool upline, che è il 10% totale)",
    level2: "Livello 3: ~2.5% di ogni pagamento",
    level3: "Livello 4: ~ 1,25% di ogni pagamento",
    level4: "Livello 5: ~0.625% di ogni pagamento",
    total:
      "Pagamento totale massimo su tutti i guadagni: ~20% di qualsiasi pagamento singolo",
    p2: "Nota onesto: i bonus catena ottenere piccolo veloce. Il 10% diretto + 5% di abilità è dove il reddito reale è. Se si costruisce in pubblico e i vostri referral sono essi stessi sviluppatori, la catena aggiunge, ma non ottimizzare per la profondità. Ottimizzare per i riferimenti diretti di qualità.",
  },
  crypto: {
    title: "Pagamento in cripto: nessun conto bancario necessario",
    p1: "Guadagni pagano in BTC o USDC. Elaborato entro 48 ore dall'approvazione. La vincita minima è {{minPayout}}: circa i mesi {{payoutPowerMonths}} da un utente di potenza, o {{payoutPlanMonths}} abbonati-mesi su Starter.",
    p2: "O convertire i guadagni istantaneamente a crediti della piattaforma. Se stai usando {{appName}}, il tuo reddito di riferimento compensa i tuoi costi di utilizzo.",
  },
  close: {
    title: "Accendere il flusso",
    p1: "Stai già costruendo, scrivendo e parlando di strumenti AI. L'aggiunta di un link di riferimento non costa nulla e richiede cinque minuti. Pubblica un'abilità troppo, e si guadagna anche quando altre persone lo condividono.",
    p2: "Le commissioni ricorrenti, la crescita dei ricavi per utente e i referral tra sviluppatori si sommano man mano che condividi pubblicamente ciò che costruisci.",
    createCode: "Crea il tuo codice invito",
    joinDiscord: "Iscriviti alla Discord",
  },
};
