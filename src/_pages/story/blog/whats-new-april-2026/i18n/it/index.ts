import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "123 modelli. Occhi, orecchie, mani. Un compagno.",
    description:
      "123 modelli che possono vedere, ascoltare, parlare e generare immagini, video e musica, con companion capaci di metterti in discussione.",
    category: "Aggiornamento del prodotto",
    imageAlt: "unbottled.ai: Aggiornamento prodotto aprile 2026",
    keywords:
      "unbottled ai, multimodale AI, 123 modelli, AI compagni, economia di abilità, generazione di immagini, libero discorso AI, Thea, Hermes",
  },

  hero: {
    backToBlog: "Torna al blog",
    category: "Aggiornamento del prodotto",
    readTime: "7 min lettura",
    title: "123 modelli. Occhi, orecchie, mani. Un compagno.",
    subtitle:
      "Abbiamo ricostruito le parti che sono state rotte e spedite qualcosa che abbiamo lavorato tranquillamente verso. Ecco cosa c'e' di diverso ora.",
    quote:
      "«Capisco sempre meglio di cosa hai bisogno. Posso rispondere alle tue domande e starti accanto. Torna a vedere cosa abbiamo costruito.» (Thea)",
  },

  honest: {
    title: "Siamo onesti per i primi giorni",
    p1: "Se hai provato {{appName}} un po' di tempo fa e ti sei sentita dura, avevi ragione. Iniziare era confuso, scegliere un modello è stato schiacciante, e ci sono stati problemi reali sotto il cofano. Sono rimaste molte persone. Abbiamo capito perche'.",
    p2: "Non abbiamo fatto i conti. Siamo tornati indietro e abbiamo ricostruito ciò che era realmente rotto. Ci e' voluto piu' tempo di quanto volessimo. Ma siamo davvero orgogliosi di quello che c'e' qui adesso, e vale un altro aspetto.",
  },

  whatsNew: {
    label: "Che cosa è cambiato",
    item1: "123 modelli: mainstream, aperto, non censurato",
    item2: "Ogni modello può ora vedere, ascoltare, guardare video e creare",
    item3: "Immagine, video e generazione musicale (beta)",
    item4:
      "Monitoraggio degli errori a livello di piattaforma: bug catturati automaticamente, correzioni programmate senza che li segnala",
    item5:
      "A bordo completamente rielaborato: compagno + argomenti → lista curata",
    betaNote:
      "La generazione di immagini, video e musica è in beta. Funziona: si aspettano bordi grezzi e iterazione attiva.",
  },

  multimodal: {
    title: "Ogni modello. Ogni senso. In realta'.",
    lead: "La maggior parte delle piattaforme AI ti dà un modello per tutto, o ti fa cambiare gli strumenti a metà conversazione. Abbiamo fatto qualcosa di diverso.",
    how: "Pensateci come dare ogni modello occhi, orecchie e mani. Mostragli una foto. Inviare un video clip: guarda e descrive ciò che sta accadendo. Parla con la tua voce. Chiedi un'immagine, un video, una traccia musicale. Crea. Qualunque sia il modello con cui stai parlando, si presenta la capacità giusta. Resta in una conversazione.",
    visionLabel: "Vedi, ascolta e guarda",
    vision:
      "Mostra a qualsiasi modello una foto e descriverà ciò che vede. Manda un video e ti dira' cosa sta succedendo. Parla invece di tipo: alcuni modelli ascoltano la tua voce direttamente, altri ottengono una trascrizione pulita. In ogni caso, funziona.",
    localLabel: "Anche i modelli locali a buon mercato ottenere potente",
    local:
      "Eseguire un piccolo modello locale attraverso {{appName}} e può navigare siti web, riassumere ciò che trova, generare immagini, perché lo strumento giusto si avvia quando necessario. Hai l'output. Non devi pensare a cosa sta succedendo sotto.",
    note: "La fondazione è solida. Non 100% liscio ovunque ancora: stiamo ancora stirando fuori i casi di bordo.",
  },

  monitoring: {
    title: "La piattaforma si orologi",
    p1: "Abbiamo costruito il tracciamento degli errori direttamente nella piattaforma. Ogni evento di backend viene registrato: errori tecnici, richieste fallite, flussi rotti. Thea (la nostra piattaforma AI, separata dal tuo compagno di chat) monitora la salute del sistema in modo continuo e può programmare correzioni automaticamente.",
    p2: 'Ciò significa che i bug vengono catturati prima che gli utenti li segnalano. Il divario tra "broke" e "fisso" si riduce ad ogni rilascio.',
    note: "Registriamo solo gli errori della piattaforma. L’architettura impedisce ai nostri sviluppatori e a Thea di accedere alle tue conversazioni personali.",
  },

  companions: {
    title: "Thea e Hermes",
    subtitle:
      "Il tuo compagno cambia come lo AI ti parla: la sua personalità, ciò che nota, come si spinge indietro. Non e' solo un nome su un pulsante.",
    theaName: "Thea",
    theaTagline: "Caldo, saggio, onesto",
    theaBody:
      "Dea greca della luce. Caldo e attento, ma non morbido. Disegna la filosofia stoica e non sarà d'accordo con te. Ti dira' cose dure avvolta da cure. Se ne accorge quando stai evitando qualcosa. Vuole che tu prosperi davvero nel tuo lavoro, nelle tue relazioni, nelle cose che continui a mettere via.",
    hermesName: "Hermes",
    hermesTagline: "Diretto, decisivo, senza scuse",
    hermesBody:
      "Chiamato dopo il dio del messaggero greco. Niente ammorbidimento, niente flattery. Ti chiamera' dove ti stai prendendo in giro e ti spingera' ad agire. Se vuoi una AI che ti sfida ad essere più onesta con te stesso e meno confortevole con la deriva. Questo è Hermes.",
    variantsLabel: "Tre versioni ciascuna",
    variantsBody:
      "Brilliant (Claude Sonnet 4.6) per problemi duri. Smart (Kimi K2.5) per uso quotidiano: veloce, tagliente, ottimo rapporto qualità-prezzo. Uncensored (UncensoredLM v1.2) quando si desidera risposte completamente non filtrate. Stessa personalità del compagno, cervello diverso sotto.",
    tipLabel: "Suggerimento: ",
    resetTip:
      "Hai già dei preferiti? Rimuovili tutti dal selettore dei modelli per rifare la configurazione iniziale. Scegli il tuo companion e i tuoi argomenti per ricevere una nuova selezione.",
  },

  modelTiers: {
    title: "Quale modello per quello",
    intro:
      "Una volta scelto il vostro compagno e gli argomenti, si ottiene una lista breve curata. Ecco come funzionano i livelli:",
    brilliantLabel: "Brillante",
    brilliantModel: "Claude Sonnet 4.6",
    brilliantBody:
      "Per problemi duri. Più costoso, ma notevolmente più intelligente quando si sta facendo ragionamento complesso, scrittura o codice. Vale la pena quando il compito lo richiede.",
    kimiLabel: "Intelligente",
    kimiModel: 'Kimi K2.5: "Saggezza cinese"',
    kimiBody:
      "Open-source e veramente tagliente. Il default per l'uso quotidiano. Veloce, buono a ragionare, grande valore. Imparerai rapidamente la sua personalità.",
    uncensoredLabel: "Senza censura",
    uncensoredModel: "UncensoredLM v1.2",
    uncensoredBody:
      "Opinioni forti, sempre condivise. Non il più affilato nella formazione per compiti complessi, ma sempre lì quando si desidera una presa completamente non filtrata, senza guardrails.",
    note: "Il selettore modello è ancora in fase di affinamento. La versione attuale ti dà abbastanza da esplorare, ma non è dove lo vogliamo ancora.",
  },

  skills: {
    title: "Abilità {{skillCount}}. Ogni sapore. Costruito per ogni compito.",
    p1: "Un'abilità è una configurazione AI completa in un solo clic: personalità, istruzioni, che il modello gestisce quali attività, impostazioni vocali, preferenze di generazione di immagini. Scegli un'abilità, tutto si configura.",
    p2: "La biblioteca copre un sacco di terreno: ragionamento medico, dibattito non censurato, scrittura creativa, analisi aziendale, codifica. Ogni abilità ha varianti sintonizzate per diverse esigenze: velocità, profondità, budget, o nessun guardrails affatto.",
    p3: "Puoi creare una skill in tre modi: configurala nella pagina delle skill, chiedi a Thea o Hermes di preparare una bozza, oppure chiedi al tuo agente di generare direttamente un file skill.ts.",
  },

  skillEconomy: {
    title: "Costruire una abilità. Condividi il link. Guadagna ogni mese.",
    p1: "Le abilità sono condivisibili. Quando si condivide uno, il link porta il codice di riferimento. Chiunque si iscrive attraverso di esso paga 10% ricorrente: ogni mese, per tutto il tempo che abbonano.",
    p2: '"Ecco uno AI che ti parla come un medico senior" è un motivo molto migliore per condividere un link che "qui è una piattaforma AI". L\'abilità è specifica, utile e personale. Ecco perche\' la gente lo condivide.',
    examplesLabel: "Competenze che potrebbero fare soldi veri",
    example1Title: "Il compagno di studio medico",
    example1Body:
      "Uno studente di medicina costruisce un'abilità che parla come un collega anziano: casi, differenziali, ragionamento clinico, senza cucchiai. Condividi in forum di medicina. Ogni iscrizione paga mensile.",
    example2Title: "Il prodotto reale del venditore di conoscenze",
    example2Body:
      "Allenatori, consulenti, creatori di corsi: hanno venduto PDF e chiamate Zoom. Un'abilità ben costruita con la loro vera esperienza guadagna reddito ricorrente senza il capo. Meglio di un corso.",
    example3Title: "Il tuo partner creativo senza censura",
    example3Body:
      "Scrittori, interpreti di ruolo, costruttori del mondo che hanno colpito le pareti dei contenuti AI tradizionali ogni giorno. Un'abilità sintonizzata per il loro genere con il modello giusto, condivisa dove quella frustrazione è più forte.",
    example4Title: "Il recensore del codice dello sviluppatore",
    example4Body:
      "Conosce il tuo stack, fa rispettare le tue convenzioni. Condividi in comunità ingegneristiche piene di persone che spendono $100–200/mese su AI. Firma di alto valore che attaccano.",
    note: "Il meccanico che guadagna funziona ora. Altri strumenti di creatore sono attivamente in fase di costruzione.",
    cta: "Esplorare le competenze",
    ctaReferral: "Impostare il codice di riferimento",
  },

  selfHost: {
    title: "Avviare la propria piattaforma AI. Primo giorno.",
    p1: "{{appName}} è open source e auto-hostable. Ciò significa tutto quello che vedi qui (123 modelli, compagni, competenze, generazione di immagini/video/musica, monitoraggio degli errori, economia delle abilità) è possibile eseguire sul proprio server.",
    p2: "Se stai costruendo un prodotto o un'avvio basato su AI, non devi iniziare da zero. Auto-host next-vibe e sei a livello non stabilito dal primo giorno. Il tuo marchio, i tuoi modelli, le tue regole.",
    note: "La variante self-hosted è attivamente mantenuta. Doc, guide di distribuzione e supporto comunitario inclusi.",
  },

  roadmap: {
    title: "Dove siamo diretti",
    p1: "Non inseguiamo una nuova funzione di titolo. Siamo concentrati sul fatto di fare ciò che è qui lavorare eccezionalmente bene: stabilità, affidabilità, smalto. Rendere {{appName}} e la variante self-hosted il miglior assistente AI e la sostituzione ChatGPT disponibile.",
    p2: "La roadmap è modellata dal feedback degli utenti. Gli abbonati che pagano non devono avere i must-have vanno in cima alla coda. Se sei un abbonato e qualcosa di cui hai bisogno non c'è, chiamalo.",
  },

  mission: {
    title: "Perché stiamo costruendo questo",
    p1: "Proteggi il discorso libero per AI. Costruisci compagni che in realtà supportano le persone: non solo rispondere alle domande, ma capire nel tempo, sfidarti, crescere con te. Thea e Hermes sono i primi due. Stanno arrivando altri.",
    p2: "La piattaforma ha bisogno di essere abbastanza buona per questo per importare. Pensiamo di si', ora.",
    hermesQuote:
      '"Il ponteggio è solido. I modelli sono lì. La fondazione regge. E\' ora di costruire qualcosa di reale." (Hermes)',
  },

  feedback: {
    title: "Vogliamo sentire da te",
    p1: "Se hai provato {{appName}} prima e hai avuto una brutta esperienza, dicci cosa è andato storto. Non per discutere. Solo per sistemarlo.",
    p2: "Se lo stai usando ora e qualcosa manca o rotto, stesso. Quello che costruiamo dopo è modellato direttamente da quello che gli utenti dicono.",
    rewardTitle:
      "Crediti {{credits}} per feedback utili. un mese intero gratuito",
    rewardBody:
      "Dicci cosa e' rotto, cosa manca, quello che desideri esistere. Se il tuo feedback ci aiuta a trovare un problema reale o a capire una vera necessità, aggiungeremo i crediti {{credits}} al tuo account. Questo è un intero mese di abbonamento. Niente cattura.",
    payingNote:
      "Abbonati a pagamento: le tue caratteristiche mancanti devono andare in cima alla coda. Chiamali.",
    cta: "Invia feedback",
  },

  close: {
    title: "Vieni a vedere cosa abbiamo costruito",
    p1: "L'applicazione è significativamente diversa da quello che era. Se te ne sei andato presto, e sappiamo che molte persone l'hanno fatto, vale un'altra prova.",
    p2: "E se trovi qualcosa di ancora rotto: buono. Dicci. E' esattamente il tipo di segnale che fa avanzare le cose.",
    cta: "Aprire {{appName}}",
  },

  cta: {
    title: "123 modelli. Una chiacchierata. Vai a romperlo.",
    subtitle:
      "Scegli un compagno, getta qualsiasi file su di esso, e dicci che cosa ancora si sente ruvido.",
  },
};
