import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Hermes e Thea: conversazioni remote in entrambe le direzioni | {{appName}}",
    description:
      "Il vostro AI locale e il vostro cloud AI ora eseguire i filetti l'uno per l'altro in entrambe le direzioni. Nessuna chiave API sull'istanza che gira? Il chiamante riprende l'anello e lo termina.",
    category: "Hermes & Thea",
    imageAlt: "Hermes e Thea: due istanze next-vibe collegate",
    keywords:
      "Hermes, Thea, next-vibe, thread remoti, AI auto-hosted, websocket inversa, API key fallback, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Hermes & Thea",
    readTime: "6 minuti di lettura",
    title: "Due IA. Una conversazione. In entrambe le direzioni.",
    subtitle:
      "Hermes gira sul tuo computer, Thea su un server. Ora possono passarsi le conversazioni in entrambe le direzioni. E una chiave API mancante non interrompe più la risposta.",
  },
  intro: {
    p1: "next-vibe gira sul portatile, su un VPS o su entrambi. Collega due istanze e lavorano insieme. Le nostre si chiamano Hermes e Thea.",
    p2: "Questa versione chiude il loop: i fili remoti ora funzionano in entrambe le direzioni, e l'istanza senza una chiave del fornitore non blocca più nulla.",
  },
  who: {
    title: "Incontrare il paio",
    intro: "Stessa base di codice. Lavori diversi.",
    hermes: {
      label: "Locale locale",
      title: "Hermes",
      body: "Esegue sul proprio computer. Si siede accanto ai file, al terminale e ai suoi agenti di codifica. Il tuo autista quotidiano.",
    },
    thea: {
      label: "Cloud",
      title: "Thea",
      body: "Funziona su un server. Sempre online, raggiungibile da qualsiasi luogo. Orologi la piattaforma e delegati lavorano.",
    },
    note: "Ogni istanza possiede i propri dati e compiti. Il collegamento relays eventi tra loro: niente di più, niente di meno.",
  },
  twoWay: {
    title: "I fili ora attraversano entrambe le direzioni",
    intro:
      "La cartella remota e i filetti privati vengono eseguiti sull'altra istanza: da Thea a Hermes e da Hermes a Thea.",
    p1: "Metta un thread in una cartella remota e l'istanza dall'altra parte esegue il giro completo AI: modello, prompt del sistema, strumenti. Continua a scrivere dove sei. La conversazione ti rispecchia.",
    stepsTitle: "Un giro, fine alla fine",
    step1Title: "Tu scrivi",
    step1Body: "Un messaggio in una conversazione remota su Hermes.",
    step2Title: "La connessione lo relè",
    step2Body:
      "Su un WebSocket persistente, o una chiamata HTTP diretta quando il peer è pubblicamente raggiungibile.",
    step3Title: "Thea esegue il loop",
    step3Body: "Con il suo modello, il suo prompt, i suoi strumenti.",
    step4Title: "Gli strumenti vanno dove vivono",
    step4Body:
      "Uno strumento che esiste solo su Hermes viene richiamato su Hermes. Il risultato torna al loop di Thea.",
    step5Title: "Il giro atterra su entrambi i lati",
    step5Body: "La conversazione finita si sincronizza al tuo specchio.",
  },
  keyless: {
    title: "Nessuna chiave API? Il giro finisce ancora.",
    intro:
      "L'istanza che gestisce un turno ha bisogno della chiave API del fornitore di modello. Non tutti i casi ne hanno uno.",
    p1: "Prima che un'istanza prenda il sopravvento, controlla la chiave del fornitore sul suo nodo. Mancato? Non riesce veloce con un marcatore chiaro: non appende, e non scrive metà del filo.",
    p2: "Il lato di chiamata riconosce il marcatore, riavvolge la sua libreria relè e corre il loop stesso. Il prompt e gli strumenti del telecomando sono ancora applicabili; lo strumento richiama il giro di andata indietro sulla connessione.",
    calloutTitle:
      "La modalità Inference-provider non ha bisogno di alcuna chiave.",
    calloutBody:
      "Utilizzare l'istanza collegata come fornitore di modelli e il vostro lato non tocca mai una chiave del fornitore. Il collegamento è il tubo modello.",
    scenarioTitle: "Chi gestisce l'anello?",
    scenario1Label: "Il telecomando ha la chiave",
    scenario1Body: "Il telecomando gira. Attrezzi di ritorno.",
    scenario2Label: "Il telecomando non ha chiave",
    scenario2Body:
      "Il telecomando non funziona in fretta. Il chiamante corre il giro con il prompt e gli strumenti del telecomando.",
    scenario3Label: "Modalità Inference-provider",
    scenario3Body:
      "L'istanza del fornitore gestisce il modello. Il chiamante non ha bisogno di chiave.",
  },
  underTheHood: {
    title: "Sotto il cofano",
    intro: "Per le persone che leggono il diff.",
    transport:
      "Il trasporto viene negoziato al momento della connessione, mai configurato a mano. L'obiettivo si basa sull'iniziatore con un controllo sanitario autenticato (5 secondi max). Raggiungibile: diretto HTTP. Dietro NAT: il lato nascosto apre un WebSocket in uscita e ogni relè multiplex sopra di esso.",
    reconnect:
      "Il connettore si ricollega con backoff esponenziale da 1 a 30 secondi e rilegge la connessione su ogni riprovazione. Questo rilascio indurisce quel percorso.",
    fixesTitle: "Anche in questo rilascio",
    fix1: "Avvertenza di carico: una cornice indirizzata a un contatto questa istanza non sa più è calata con un avvertimento invece di silenziosamente, ri-autentico la connessione lo fissa.",
    fix2: "I timestamp del database in UTC, Postgres e PGlite in pool, così le righe predefinite vengono ordinate correttamente attraverso le istanze.",
    fix3: "Lo scrittore di flusso semi il filetto id, così i coetanei non cadono più eventi con un filetto vuoto id.",
    fix4: "Revival gira sincronizzazione con il peer, quindi i risultati dello strumento riempiti al posto raggiungono lo specchio.",
    codeCaption: "Il marcatore un ricevitore senza chiave invia indietro:",
  },
  tryIt: {
    title: "Provalo.",
    p1: "Self-host un'istanza, quindi aggiungere la connessione sotto Admin → Connessione remota. Solo gli amministratori possono creare uno; l'altro lato ottiene la sua entrata automaticamente.",
  },
  cta: {
    title: "Avvia la tua istanza Hermes.",
    subtitle:
      "Auto-host next-vibe sulla vostra macchina, collegarlo a un server e lasciare che condividono il lavoro.",
    selfHost: "Guida self-host",
    github: "Leggi il codice",
  },
};
