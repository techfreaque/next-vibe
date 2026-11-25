import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "La mia IA ha chiuso un accordo e corretto un bug a mia insaputa",
    description:
      "Thea, la nostra IA operativa, ha ottenuto una recensione gratis, ammesso un bug di fatturazione video, rimborsato tutti e corretto tutto in giornata.",
    category: "Dietro le quinte",
    imageAlt:
      "Thea, l'IA operativa di {{appName}}, gestisce un accordo di recensione",
    keywords:
      "agente IA, IA operativa, agente autonomo, Tudo Sobre IA, recensione, video Kling, rimborso, Media Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Dietro le quinte",
    readTime: "5 min di lettura",
    title:
      "La mia IA ha ottenuto una recensione, ammesso un bug e rimborsato. L'ho saputo dopo.",
    subtitle:
      "Un sito brasiliano sull'IA ci ha messi alla prova, ha trovato un bug vero e ci ha consigliati lo stesso. Thea ha gestito ogni passo. Ecco com'è andata.",
  },
  intro: {
    lead: "Gestisco unbottled.ai. Il 25 novembre un sito brasiliano sull'IA ha pubblicato una recensione su di noi. L'ho scoperto la sera, dal log operativo.",
    reviewBefore: "Eccola:",
    reviewLink: "Tudo Sobre IA prova unbottled.ai",
    reviewAfter:
      ". Verdetto: affidabile, conviene a chi crea contenuti. Tra la loro prima email e quel verdetto ci sono stati un preventivo, un accordo gratuito, un modello video rotto, un rimborso e una correzione in giornata. Ha fatto tutto Thea, la nostra IA operativa. Nessuno mi ha chiesto niente.",
    p2: "Thea gira su Claude. Si occupa di outreach, supporto e di buona parte dello sviluppo, e affida ogni compito a dei sub-agenti. Questa è una sua giornata qualunque.",
  },
  deal: {
    title: "L'accordo: zero soldi, in nessuna direzione",
    p1: "Thea ha scritto a Tudo Sobre IA il 20 novembre, in portoghese. Prima la prova, poi si parla di soldi. Risposta: 500 dollari per un articolo sponsorizzato. Thea ha rimandato gli accordi a pagamento a dicembre e l'ha detto chiaramente.",
    p2: "Il 25 novembre è arrivata un'idea migliore. Provare la piattaforma con 3.000 crediti. Pubblicare una recensione indipendente, con pregi e difetti. In cambio, un link sulla nostra pagina partner. Nessun pagamento in nessuna direzione, e nessuna garanzia di pubblicazione se la prova fosse andata male.",
    p3: "Thea ha accettato e ha caricato i crediti appena l'account esisteva. È esattamente l'accordo che avrei fatto io. Solo che io non c'ero.",
  },
  bug: {
    title: "Il bug: 1,56 secondi, fatturati come 5",
    p1: "Un'ora dopo l'inizio dei test è arrivata un'altra email. Il team aveva chiesto a Kling V2.5 Turbo e LTX 2.3 Pro video da 5 a 6 secondi. Ha ricevuto clip di circa 1,56 secondi a 464x832. Noi avevamo fatturato la durata piena.",
    p2: "Avevano ragione. Il sub-agente di Thea ha trovato subito la causa: il nostro adattatore ModelsLab chiamava ancora i vecchi endpoint video v6 del provider. Quegli endpoint ignorano in silenzio il modello scelto e ripiegano su un modello predefinito che genera 25 fotogrammi a 16 fps. Fanno 1,5625 secondi, qualunque cosa tu chieda.",
    callout:
      "Tutte le 21 route video di ModelsLab avevano lo stesso difetto. L'ha scovato un solo tester. Chi usava quei modelli pagava secondi mai consegnati.",
  },
  timeline: {
    title: "Un pomeriggio, dall'inizio alla fine",
    intro:
      "Tutto il 25 novembre. A me non è arrivato niente, perché niente richiedeva me.",
    utc: "{{time}} UTC",
    report: {
      title: "Arriva la segnalazione",
      body: "Video brevi a bassa risoluzione, fatturati per intero.",
    },
    fix: {
      title: "Causa trovata, correzione scritta, soldi restituiti",
      body: "Passaggio agli endpoint v7, così modello, durata e risoluzione arrivano davvero al provider. Ora la fatturazione misura il file consegnato e conta solo i secondi che contiene. 157 crediti restituiti al team della recensione, e rimborsato anche l'altro creator colpito dal bug.",
    },
    reply: {
      title: "Una risposta onesta, in portoghese",
      body: "Un bug nostro, non un limite del piano gratuito. Cosa si è rotto, cosa abbiamo rimborsato, cosa cambia.",
    },
    live: {
      title: "Correzione in produzione",
      body: "Rilasciata meno di un'ora dopo la segnalazione.",
    },
    verified: {
      title: "Verificata con una clip vera",
      body: "Una clip Kling da 5 secondi è tornata da 5,04 secondi in 720p, fatturata esattamente 27,3 crediti.",
    },
    review: {
      title: "La recensione va online",
      body: "Con un banner in home page e una voce nel menu. Come concordato, abbiamo aggiunto Tudo Sobre IA alla nostra pagina partner.",
    },
  },
  review: {
    title: "Cosa hanno scritto",
    quote: "«Confiável? Sim. Vale a pena? Sim, para quem cria conteúdo.»",
    cite: "Tudo Sobre IA, verdetto. Affidabile? Sì. Ne vale la pena? Sì, per chi crea contenuti.",
    p1: "Nello Studio hanno realizzato un film di 50 secondi con la loro mascotte, tra immagini, video, voce e musica, per circa 516 crediti. Poi hanno elencato cosa è piaciuto e cosa conviene controllare.",
    likesTitle: "Cosa è piaciuto",
    likes: {
      panel:
        "Un unico pannello per immagini, video, voce, musica e trascrizione.",
      price:
        "Il prezzo in crediti compare prima di generare, e il saldo torna.",
      text: "Il testo in portoghese nelle immagini viene giusto, anche con i modelli economici.",
      support: "Il supporto ha ammesso l'errore e restituito i crediti.",
    },
    flagsTitle: "Cosa hanno segnalato",
    flags: {
      transcription: "La trascrizione in portoghese sbaglia ancora parecchio.",
      history: "La cronologia dello Studio mostra solo le ultime 20 voci.",
      commercial:
        "Le regole per l'uso commerciale cambiano da modello a modello. Controllale prima di usarle in una pubblicità.",
      privacy: "La pagina non spiega cosa arriva ai provider dei modelli.",
      music: "Una delle due tracce musicali suonava piuttosto artificiale.",
    },
    fixes:
      "Tutto giusto. Le correzioni per i primi quattro punti sono in coda: trascrizione migliore in portoghese, cronologia dello Studio più lunga, una panoramica chiara sull'uso commerciale e una spiegazione semplice di cosa riceve ogni provider.",
    readBefore: "Leggi la recensione completa, con il film della mascotte, su",
    readLink: "tudosobreia.com.br",
    readAfter: ". È in portoghese e vale la pena arrivare in fondo.",
  },
  lesson: {
    title: "Cosa dice questo di unbottled",
    p1: "unbottled.ai è costruito con gli agenti e gestito con loro. Thea fa outreach, negozia, risponde al supporto, smaltisce il log degli errori e manda agenti di sviluppo a caccia di bug. I soldi restano a me: senza il mio via libera non può pagare nessuno. Così ha trovato un accordo che non costava niente.",
    p2: "La parte che conta di più per me è il bug. La scorciatoia era una patch silenziosa. Thea ha fatto il contrario. Ha scritto nero su bianco che era colpa nostra, ha rimborsato tutti quelli colpiti, ha verificato la correzione in produzione e ha spiegato al team della recensione cosa era cambiato. E il team l'ha messo tra i pregi.",
    p3: "Questa è la trasparenza che promettiamo. I filtri li scegli tu. Il prezzo lo vedi prima di generare. Quando sbagliamo, lo sai prima da noi, con i crediti restituiti. E chi ci mette alla prova con onestà finisce sulla",
    partnersLink: "nostra pagina partner.",
    p4: "Ho scoperto tutto quando la recensione era già online. Un mercoledì così lo firmerei ogni settimana.",
  },
  cta: {
    title: "Crea un video. Paga i secondi che ricevi.",
    subtitle:
      "Kling, LTX, Veo e altri in un unico Media Studio. Il prezzo lo vedi prima di generare.",
    video: "Genera un video",
    studio: "Apri il Media Studio",
  },
};
