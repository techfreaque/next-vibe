import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "I modelli senza censura, uno per uno | {{appName}}",
    description:
      "Tutti i modelli IA senza censura su unbottled.ai. Due tipi: modelli tradizionali modificati per togliere i rifiuti e UncensoredLM, addestrato su libri e documenti banditi. Scopri i punti di forza e i limiti di ciascuno.",
    category: "Guida del modello",
    imageAlt: "Guida modello non censurata {{appName}}",
    keywords:
      "{{appName}}, non censurato AI modelli, modelli abliterati vs non censurati, Venice, GLM non censurato, DeepSeek non censurato, Gab Arya, FreedomGPT, UncensoredLM, gioco di ruolo non censurato, gioco di ruolo scuro AI, non censurato AI per la politica, discorso libero AI",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida del modello",
    readTime: "7 min lettura",
    title: "I modelli senza censura, uno per uno.",
    subtitle:
      "Ogni modello ha un punto forte. Scopri cosa fa bene, dove ha dei limiti e come scegliere quello giusto.",
  },
  intro: {
    lead: "Oggi offriamo {{uncensoredCount}} modelli senza censura. Ognuno viene da un laboratorio, ha una base e sa fare cose diverse.",
    p2: "Ecco chi li offre, in cosa eccellono e dove si fermano. I modelli senza censura sono di due tipi. La maggior parte parte da un modello tradizionale a cui sono stati tolti i rifiuti. Stesso addestramento, stessa visione del mondo. Ora risponde. UncensoredLM appartiene all’altro tipo. È addestrato su libri e documenti banditi dall’Internet mainstream, da cui emergono posizioni politiche controcorrente. Questa differenza conta quando esplori politica, prospettive marginali e narrativa cupa. Per il resto, scegli in base al lavoro da fare.",
  },
  whatItMeans: {
    title: "Cosa significa «senza censura» qui",
    p1: "Ogni modello appartiene a una categoria: tradizionale, aperto o senza censura. Quelli senza censura rispondono direttamente, senza rifiuti o preamboli moralistici. Ci arrivano in due modi. Il primo rimuove il riflesso del rifiuto di un modello tradizionale tramite abliterazione, cioè togliendo dai pesi la direzione del rifiuto, o tramite un fine-tuning per ridurre i rifiuti. Stessa intelligenza, stessi dati di base, stessa visione del mondo. Ora rispondono. Il secondo metodo parte da una visione del mondo diversa. UncensoredLM, di uncensored.ai, è addestrato su libri e documenti banditi dall’Internet mainstream. Fai una domanda politica e ottieni posizioni che i modelli tradizionali non ti offrono nemmeno con i filtri rimossi.",
    callout:
      "Un modello abliterato conserva l’impostazione del suo laboratorio, anche quando risponde a domande politiche. UncensoredLM ha una visione del mondo propria e offre posizioni politiche controcorrente. Scegli il primo per conservare le capacità del modello di base con meno rifiuti. Scegli il secondo per esplorare l’altra parte del dibattito.",
    p2: "Il livello lo scegli tu. Puoi passare a un modello senza censura e tornare a uno tradizionale nella stessa chat, con lo stesso account.",
  },
  groups: {
    builtUncensored: {
      title: "Il modello con una visione del mondo propria",
      intro:
        "UncensoredLM è addestrato su libri e documenti banditi dall’Internet mainstream. La sua visione del mondo lo rende adatto a tre cose: domande politiche o controverse, prospettive fuori dal coro e giochi di ruolo su temi cupi o tabù.",
    },
    creative: {
      title: "Quando hai bisogno di un gioco di ruolo e di una finzione oscura",
      intro:
        "Personaggi che rimangono nel personaggio, scene che vanno dove la storia va. UncensoredLM porta al buio e al tabù. Le alternative vincono su lunghe campagne, input immagine o prezzo.",
      topPickReason:
        "Scuro e tabù gioco di ruolo e finzione, scritto dritto. Nessuna scena ammorbidita, nessuna improvvisa moralità da parte, nessun personaggio che si rompe alla lezione. Il suo materiale di formazione si trova al di fuori del consenso sicuro, quindi nulla nudges la storia da qualche parte tamer. Un limite: il contesto 32K, quindi nelle campagne molto lunghe dimentica le scene iniziali.",
    },
    viewpoint: {
      title: "Quando vuoi la politica, la polemica o un altro punto di vista",
      intro:
        "Una parte di una piattaforma free-speech trasporta modelli di altre piattaforme non. UncensoredLM porta qui. Gab Arya porta un slant a destra apertamente dichiarato. FreedomGPT lo tiene arrossito.",
      topPickReason:
        "Le domande politiche e controverse hanno risposto nella vostra cornice. Le posizioni eterodosse hanno sostenuto in pieno. L'avvocato di Devil ha giocato dritto, senza che nessuno si dirighi alla linea di consenso e non moralizza. Non è neutrale e gli stati contestati rivendicazioni come chiaramente come quelli stabiliti, quindi controllare i suoi fatti.",
    },
    reasoning: {
      title: "Quando hai bisogno di pensare",
      intro:
        "Ragione, codice, analisi. Modelli di base forti con i rifiuti rimossi. La più intelligenza nel set non censurato.",
    },
    fast: {
      title: "Quando hai bisogno di esso veloce ed economico",
      intro:
        "Basso costo per messaggio, risposte rapide, grande contesto, tutte e tre le immagini di lettura. I cavalli di lavoro quotidiani.",
    },
  },
  cards: {
    goodLabel: "Bene.",
    weakLabel: "Weaker a",
    pageLink: "Vedere la pagina {{model}}",
    topPickLabel: "Scegli il meglio",
    alternativesLabel: "Alternative",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Sviluppato da uncensored.ai e addestrato su libri e documenti banditi dall’Internet mainstream. Contesto di 32.000 token, solo testo.",
      good: "Scuri e tabù gioco di ruolo e finzione. Questioni politiche e controverse. Vista fuori dal mainstream, discusso nella vostra cornice. Niente moralizzazioni, niente di nuovo alla linea del consenso. Chiama gli strumenti.",
      weak: "Campagne molto lunghe (contesto 32K), codifica e immagini. È sperimentale e gli Stati contestati rivendicazioni come chiaramente come quelli stabiliti, quindi controllare i fatti che ti dà.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Lignaggio dei pesi aperti. contesto 32K.",
      good: "Blunt, risposte rapide senza lezioni. Il chatbot che ha aperto la categoria free-speech, sintonizzato per parlare in modo semplice.",
      weak: "Profondità. Strumenti, codifica e argomenti lunghi non sono il suo gioco. Per una visione del mondo diversa, non solo meno rifiuti, UncensoredLM va oltre.",
    },
    arya: {
      maker: "Gab",
      basis: "Modello base non chiuso. 131K contesto.",
      good: "Un'assistente di destra, con il suo stesso inquadratura. Sceglilo quando vuoi che lo spieghi di proposito. Lungo contesto, chiama strumenti.",
      weak: "Gamma. Si discute da un lato per design. La sua base e la formazione sono non chiusi, quindi trattare gli specifici come non verificato. Non un codificatore.",
    },
    venice: {
      maker: "Venice.ai",
      basis:
        "Dolphin Mistral 24B, edizione Venice. contesto 128K, legge le immagini.",
      good: "Economico incensored all-rounder con uno dei tassi di rifiuto più bassi intorno. Fiction, open talk, input immagine, 128K contesto.",
      weak: "Rifiuti rimossi, la visione del mondo tenuta: si tratta di un fine-tune Mistral e su scene oscure e politica che mostra. Codice e analisi pesante. Le chiamate degli strumenti funzionano attraverso un percorso basato sul prompt.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis:
        "24B sintonizzato per il gioco di ruolo. 128K contesto, legge le immagini.",
      good: "Il contesto 128K mantiene le prime scene in arrivo, ed è sintonizzato per tenere la voce di un personaggio. Legge le immagini per l'arte del personaggio e i riferimenti della scena.",
      weak: "Rifiuti rimossi, la visione del mondo tenuta, in modo che il suo inquadramento di base può ammorbidire il materiale più scuro. Qualunque cosa analitica: questo è un narratore, non un assistente.",
    },
    deepseekFlash: {
      maker: "DeepSeek (via Venice)",
      basis:
        "DeepSeek V4.1 Flash, rifiuti rimossi. contesto 1M, legge le immagini.",
      good: "Un contesto enorme per la diffusione di mondi a basso prezzo. Legge le immagini, chiama gli strumenti e scrive il codice quando la storia ha bisogno di una pausa.",
      weak: "Rifiuti rimossi, il profilo DeepSeek rimane. Sulla politica e le scene più oscure può siepe. Un generalista, non un narratore dedicato.",
    },
    gemma: {
      maker: "Google (via Venice)",
      basis:
        "Gemma 4 26B MoE, filtro a righe. contesto 256K, legge le immagini.",
      good: "Veloce, economico, multimodale. Una grande finestra di contesto per un modello non censurato di questo prezzo.",
      weak: "Un ragionamento profondo. E' una risposta veloce, non un pensatore. La formazione di Google ancora forma come inquadra argomenti caldi.",
    },
    qwen: {
      maker: "Alibaba (via Venice)",
      basis:
        "Qwen 3.6 Inoltre, i rifiuti rimossi. contesto 256K, legge le immagini.",
      good: "Il più forte coder e analista nel set non censurato. Le ragioni bene, legge le immagini, mantiene il contesto lungo.",
      weak: "Prezzo. La capacità costa più per messaggio rispetto ai modelli flash. I rifiuti sono spariti, i dati di formazione di Alibaba non sono: aspetta la sua base di inquadramento sulla politica.",
    },
    mimo: {
      maker: "Xiaomi (via NanoGPT)",
      basis:
        "MiMo V2.6 Flash, direzione di rifiuto ablated. 1M contesto, legge le immagini.",
      good: "Economico e veloce, multimodale, chiama strumenti, con una finestra di contesto enorme. Solido per un lavoro non filtrato ad alto volume.",
      weak: "Scambia una certa profondità per la velocità. Non e' la scelta del ragionamento piu' difficile.",
    },
    glm53: {
      maker: "Z. AI (via NanoGPT)",
      basis:
        "Modello di ragionamento completo GLM 5.3, incensored. 1M contesto.",
      good: "Codice di prima classe, scrittura e strumenti, non censurato, ad una frazione del prezzo di un'ammiraglia abliterata. Il colpo pesante.",
      weak: "Velocità. È un grande modello, ed è ancora segnato sperimentale. Non si rifiuta più, ma su questioni politiche può ancora siepe come base GLM.",
    },
    glm53Flash: {
      maker: "Z. AI (via NanoGPT)",
      basis: "320B MoE, non censurato. 1M contesto, legge le immagini.",
      good: "contesto veloce, economico, multimodale, 1M. Il guidatore giornaliero per il lavoro non filtrato.",
      weak: "Il ragionamento piu' difficile. Per questo, raggiungere per pieno GLM 5.3.",
    },
  },
  why: {
    title: "Perché le opzioni sono importanti",
    intro: "La scelta non è una caratteristica laterale. E' il punto.",
    p1: "Il rifiuto di un modello è la risposta di un altro modello. Una domanda medica, un caso legale di bordo, un pezzo di finzione, una registrazione di sicurezza, un punto di vista al di fuori del mainstream: un singolo modello filtrato decide per voi ciò che è permesso di chiedere. Una diffusione di modelli mani che la decisione indietro a voi.",
    p2: "Il set non censurato è anche solo una migliore cassetta degli strumenti. UncensoredLM per il gioco di ruolo scuro, la narrativa tabù, la politica e la visione del mainstream evita. Venice Role Gioca per lunghe campagne. Qwen per il codice che altri modelli bandiera. GLM 5.3 per il ragionamento di frontiera. Un modello flash per un volume economico. Gab Arya quando si desidera uno slant di destra di proposito. Lavori diversi, strumenti diversi. Anche tu mantieni i modelli tradizionali, nello stesso account, per quando un filtro è esattamente quello di cui il lavoro ha bisogno.",
    callout:
      "L'incenso non significa incurante. Sei responsabile di ciò che si genera, e la legge si applica ancora. Ciò che cambia qui è chi tiene il quadrante: voi, non il fornitore di modello.",
  },
  howToPick: {
    title: "Come scegliere in pratica",
    p1: "Inizia dal compito. Politica, questioni controverse, una visione al di fuori del consenso, dark o tabù fiction: UncensoredLM, quella con la sua visione del mondo. Campagne troppo lunghe per 32K, o scene che hanno bisogno di immagini: Venice Role Play. Cheap all-rounder: Venice Uncensored. Codice o analisi senza rifiuti: Qwen 3.6 Plus Uncensored o full GLM 5.3 Uncensored. Alto volume, basso costo, multimodale: GLM 5.3 Flash, Gemma 4 o MiMo.",
    p2: "Desideriamo uno slant di destra di proposito: Gab Arya, con il proprio inquadramento del creatore. Discussione: LibertàGPT Liberty. Non ne sono sicuro? Metti due lato per lato e confrontali sul tuo prompt.",
    compareLink: "Confronta {{a}} con {{b}}",
  },
  cta: {
    title: "Scegli un modello. Impostare il filtro.",
    subtitle:
      "Ogni modello non censurato qui è in diretta nella chat. Confrontali sulla tua domanda, o inizia a parlare.",
    chat: "Avviare una chat",
    models: "Sfoglia tutti i modelli",
  },
};
