import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Programma partner {{appName}}: {{directPct}} ricorrente, senza tetto",
    category: "Partner",
    description:
      "Creator, newsletter e directory: guadagna il {{directPct}} su ogni acquisto di chi porti su {{appName}}. Ricorrente, senza tetto, tracciato per link. Crediti o BTC/USDC.",
    imageAlt: "Programma partner {{appName}}",
    keywords:
      "{{appName}}, programma di affiliazione, programma partner, affiliato AI non censurato, commissione ricorrente, programma di creatore, sponsorizzazione newsletter",
  },
  hero: {
    eyebrow: "Programma partner",
    title:
      "Il tuo pubblico vuole un’IA che risponde. Guadagna quando gliela fai scoprire.",
    subtitle:
      "Ricevi il {{directPct}} di ogni acquisto, finché continuano a pagare. Senza tetto. Usa un link tracciato per ogni video, numero della newsletter o scheda, così sai quale porta nuovi clienti.",
    ctaPrimary: "Ottieni il tuo link partner",
    ctaSecondary: "Leggi le condizioni",
  },
  facts: {
    commission: "di ogni acquisto, ricorrente",
    capValue: "Senza tetto",
    cap: "su rinvii o guadagni",
    holdValue: "{{holdDays}} giorni",
    hold: "finestra di rimborso, allora è il tuo",
    minPayout: "prelievo minimo",
  },
  audience: {
    label: "Chi è per",
    title: "Costruito per le persone che già parlano di AI",
    intro:
      "Se il vostro pubblico colpisce rifiuti, filtri o muri di prezzo, avete già il passo. Vi diamo il link e i numeri.",
    creators: {
      title: "Creatori",
      body: "YouTube, TikTok, stream. Lasciare un link per video nella descrizione. Vedere quale video porta utenti paganti, non solo clic.",
    },
    newsletters: {
      title: "Newsletter e blog",
      body: "Un link per emissione o post. I lettori che si registrano soggiorno attribuito a voi, quindi una sola menzione continua a pagare.",
    },
    directories: {
      title: "Regia e siti di revisione",
      body: "Elencaci con il tuo link. Ogni utente che si registra dal tuo elenco è legato a te per sempre.",
    },
  },
  steps: {
    label: "Come funziona",
    title: "Vivere in cinque minuti",
    intro:
      "Nessuna applicazione, nessuna coda di approvazione, nessun pubblico minimo.",
    step1: {
      title: "Crea un account gratuito",
      body: "Iscriviti. La pagina di riferimento si apre subito dopo.",
    },
    step2: {
      title: "Fare un codice, quindi un link per il posizionamento",
      body: "Scegli un codice di rinvio una volta. Quindi creare un link tracciato per ogni video, problema o elenco. Ognuno conta le proprie visite, iscrizioni e guadagni.",
    },
    step3: {
      title: "Condividi",
      body: "Descrizione, commento pinned, newsletter footer, elenco directory. Chiunque si arruola, e' tuo.",
    },
    step4: {
      title: "Ricevete il pagamento su ogni acquisto",
      body: "{{directPct}} di ogni abbonamento e pacchetto di credito che acquistano. Dopo la finestra di rimborso {{holdDays}} -day si trasforma in crediti si può spendere o ritirare.",
    },
  },
  terms: {
    label: "I termini",
    title: "Tutto quello che decide cosa si guadagna",
    intro:
      "Non c'e' nessuno da sbloccare, non c'e' nessuna stampa che vada oltre questo tavolo.",
    rows: {
      commission: {
        term: "Commissione",
        value:
          "{{directPct}} di ogni acquisto da parte degli utenti che si riferiscono: abbonamenti e pacchetti di credito.",
      },
      duration: {
        term: "Durata",
        value:
          "Rimangono per tutto il tempo che continuano a pagare. Una volta che qualcuno si iscrive attraverso il tuo link, resta il tuo.",
      },
      cap: {
        term: "Cap",
        value: "Nessuno. Non sugli utenti, non sui guadagni.",
      },
      hold: {
        term: "Finestra di rimborso",
        value:
          "I nuovi guadagni rimangono in sospeso per i giorni {{holdDays}}. Un rimborso o un addebito all'interno di quella finestra li cancella. Dopo di esso, sono confermati.",
      },
      payout: {
        term: "Pagamenti",
        value:
          "Trascorrere guadagni confermati come crediti 1:1, o ritirarsi a BTC o USDC.",
      },
      minimum: {
        term: "Ritiro minimo",
        value:
          "{{minPayout}}. I pagamenti Crypto vengono elaborati entro le ore {{cryptoPayoutHours}} dopo l'approvazione.",
      },
      second: {
        term: "Secondo livello",
        value:
          "Quando qualcuno di cui hai parlato porta nei propri utenti, si guadagna anche {{level2Pct}} di ciò che quegli utenti pagano.",
      },
      tracking: {
        term: "Tracciamento",
        value:
          "Codice di riferimento più tag UTM su ogni link. Visite, iscrizioni, utenti paganti e guadagni per link, live sulla pagina di riferimento.",
      },
    },
  },
  product: {
    label: "Che cosa state mandando loro a",
    title:
      "Una piattaforma AI il vostro pubblico può effettivamente raccomandare",
    intro: "Facile da lanciare perché risolve ciò di cui la gente si lamenta.",
    choice: {
      title: "Modelli convenzionali, aperti e senza censura",
      body: "I modelli di big-name accanto a quelli aperti e non censurati, in una chat. Uncensored viene fornito in due tipi: modelli mainstream con i rifiuti tagliati, e UncensoredLM, addestrati su libri e documenti vietati da internet mainstream. Gli utenti passano ogni volta che vogliono.",
    },
    control: {
      title: "Impostano il livello del filtro",
      body: "Nessun rifiuto silenzioso ha deciso per loro. Ogni utente sceglie quanto filtraggio vogliono.",
    },
    free: {
      title: "Gratis per iniziare",
      body: "I nuovi utenti provano la chat senza una carta. Facile sì per il vostro pubblico, facile conversione per voi. Sviluppatori: API ha bisogno di qualsiasi piano, da {{subPrice}} al mese.",
    },
  },
  faq: {
    label: "FAQ",
    title: "Domande ai partner",
    items: {
      audience: {
        q: "Ho bisogno di un pubblico minimo?",
        a: "No. Nessuna applicazione, nessun numero di follower. Un lettore che abbona ti paga ogni mese che rimangono.",
      },
      counts: {
        q: "Che cosa conta come acquisto?",
        a: "Ogni pagamento di abbonamento e ogni pacchetto di credito che un utente di cui si fa acquisti. Anche i rinnovi contano, ogni volta.",
      },
      attribution: {
        q: "Quanto dura l'attribuzione?",
        a: "Permanentmente. Quando qualcuno si iscrive attraverso il tuo link, sono collegati al tuo account per il bene. Nessun cookie di scadenza dopo l'iscrizione.",
      },
      placements: {
        q: "Posso rintracciare ogni posizionamento separatamente?",
        a: "Si'. Creare un link tracciato per video, emissione o elenco sulla pagina di riferimento. Ciascuno mostra le proprie visite, iscrizioni, utenti paganti e guadagni.",
      },
      refunds: {
        q: "Cosa succede con un rimborso?",
        a: "I guadagni rimangono in sospeso per i giorni {{holdDays}}. Se l'acquisto è rimborsato o ripagato in quel momento, il guadagno viene annullato. Dopo di che è tuo.",
      },
      payout: {
        q: "Come faccio a pagarmi?",
        a: "Retribuzioni confermate terreni come crediti si può spendere sulla piattaforma. O richiedere un prelievo a BTC o USDC da {{minPayout}}, processato entro le ore {{cryptoPayoutHours}} dopo l'approvazione.",
      },
    },
  },
  cta: {
    title: "Il tuo link è a cinque minuti di distanza.",
    subtitle:
      "Conto gratuito. Nessun consenso. {{directPct}} di ogni acquisto, ricorrente, nessun tappo.",
    primary: "Ottieni il tuo link partner",
    secondary: "Come funzionano i referral",
  },
};
