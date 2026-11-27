import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Alternative a Janitor AI per il gioco di ruolo: memoria, prezzi",
  description:
    "Undici modi per continuare a scrivere quando Janitor AI non va, perde il filo o parla al posto tuo. Confronta chat gratis, schede personaggio e abbonamenti.",
  keywords:
    "alternative a Janitor AI, gioco di ruolo con IA gratis, schede personaggio, compagni virtuali",
  category: "Confronto",
  readTime: "5 minuti di lettura",
  back: "Torna al blog",
  subtitle:
    "Undici alternative, dalla chat gratuita con un personaggio al modello installato sul tuo computer. Prezzi verificati il {{date}}.",
  lead: "Ti piace il tuo personaggio su Janitor, ma le sue battute non ti convincono? Prova prima a cambiare modello. Se vuoi giocare senza connessione, tenere un archivio dell’ambientazione o ritrovare lo stesso compagno per mesi, conta anche la scelta dell’app.",
  janitor: {
    title: "Cosa offre Janitor AI",
    fit: "Scoprire i personaggi della community",
    intro:
      "Janitor AI è un sito di narrativa interattiva per adulti. Scegli un personaggio della community o ne crei uno tuo e scrivete la scena a turno. Le condizioni richiedono almeno 18 anni e vietano gli avatar pubblici sessualmente espliciti. La guida spiega come collegare un modello esterno, per esempio su OpenRouter, con la propria chiave API.",
    plans:
      "Il piano gratuito offre chat illimitate sui modelli standard con circa 9.000 token di contesto. Janitor+ promette un contesto cinque volte più ampio, priorità nelle risposte e una quota mensile per rigenerarle con modelli premium. Janitor ha annunciato un prezzo di 12,99 USD al mese. L’App Store statunitense riporta anche 99 USD l’anno. Un fornitore esterno può addebitare il proprio servizio a parte.",
  },
  why: {
    title: "Perché chi scrive cerca alternative",
    outage:
      "Durante un’interruzione, una persona ha chiesto su Reddit dove poter continuare a cercare spunti per il proprio libro. Il 19 novembre Janitor ha indicato jani.com come indirizzo da usare durante il recupero del dominio abituale. Se vuoi solo ritrovare le tue chat, prova prima quell’indirizzo.",
    update: "L’avviso di Janitor sul dominio",
    voice:
      "In un’altra discussione, alcuni utenti hanno raccontato di risposte ripetitive, dettagli dimenticati e bot che scrivevano anche le battute del giocatore. Sono esperienze individuali. Per una storia corale cerca ricordi modificabili o un archivio dell’ambientazione. Se il bot si prende il tuo turno, prova lo stesso incipit con un altro modello.",
  },
  table: {
    scroll: "Scorri la tabella verso sinistra per vedere i prezzi.",
    title: "Janitor AI e undici alternative a confronto",
    intro:
      "La tabella riporta una selezione di piani. I prezzi dei concorrenti sono in dollari statunitensi. Per Kindroid e Nomi fanno riferimento all’App Store statunitense. Più sotto trovi i limiti delle offerte gratuite.",
    fit: "Quando sceglierlo",
    price: "Prezzo o costo d’uso",
  },
  us: {
    fit: "Scegliere il modello per la scena",
    price: "Da {{subPrice}} al mese",
    title: "{{appName}} per chi vuole gestire la propria scena",
    models:
      "Siamo il team di {{appName}}. Il catalogo conta {{modelCount}} modelli di chat, di cui {{uncensored}} senza censura. Prima di usarne uno senza censura, anche chi entra come ospite deve confermare personalmente di avere almeno 18 anni e di accettare risposte non filtrate. Il consenso si può revocare nelle impostazioni.",
    example: "Tra i modelli disponibili senza censura c’è {{ownModel}}.",
    skills:
      "La modalità gioco di ruolo chiede al modello di restare nel personaggio e di lasciare a te le decisioni sul tuo. Thea e Hermes sono due compagni integrati per conversazioni continuative. Se preferisci sfogliare personaggi pronti da giocare, il catalogo di Janitor è più immediato.",
    limit:
      "Come ospite ricevi {{guestCredits}} crediti gratuiti al mese, con un account gratuito ne ricevi {{freeCredits}}, {{maxCredits}} con la newsletter. Una lunga scena con un modello premium può esaurire il saldo. Per scrivere senza contare le battute, la chat standard gratuita di Janitor è più adatta.",
    link: "Scopri la modalità gioco di ruolo",
  },
  list: "Dove ambientare la tua prossima storia?",
  heading: "{{name}}: {{fit}}",
  free: {
    janitor: "Chat standard illimitata",
    us: "{{guestCredits}} crediti al mese senza account",
    characterAi: "Stili di base illimitati",
    sillyTavern: "Interfaccia gratuita",
    chub: "Dipende dal modello collegato",
    crushOn: "Modelli gratuiti senza limiti",
    spicy: "Piano gratuito",
    venice: "10 richieste di testo al giorno",
    nanoGpt: "Un modello gratuito sul web",
    horde: "Computer dei volontari",
    kindroid: "Breve anteprima",
    nomi: "50 messaggi al giorno",
  },
  offers: {
    characterAi: {
      fit: "Dialoghi brevi con filtro dei contenuti",
      body: "ShortSqueak si presta ai botta e risposta, PipSqueak 3 dà più respiro alla scena. Entrambi offrono messaggi gratuiti illimitati. Lite riduce la pubblicità e permette di fissare più ricordi. Character.AI vieta i contenuti pornografici anche sui piani a pagamento.",
    },
    sillyTavern: {
      fit: "Schede personaggio da portare con sé",
      price: "Software gratuito, hardware o API a tuo carico",
      body: "Schede e appunti sull’ambientazione restano sul computer. Con un modello locale giochi offline, mentre una chiave API ti permette di collegare un modello ospitato altrove. L’installazione dell’interfaccia e la scelta del modello spettano a te.",
    },
    chub: {
      fit: "Mondi condivisi e archivi narrativi",
      body: "Un lorebook di Chub può aggiungere la storia di una città al contesto solo quando compare il suo nome. Così rimane spazio per la scena in corso. Devi scrivere le voci e scegliere le parole che le attivano. Chub indica messaggi illimitati con Mars. Con una chiave API commerciale paghi le tariffe del fornitore.",
    },
    crushOn: {
      fit: "Personaggi pronti da scegliere per genere",
      body: "Scegli un personaggio e inizi senza configurare un’API. I modelli gratuiti permettono chat illimitate, più 100 crediti mensili per provare i modelli Pro. Standard include 2.000 crediti al mese. Il numero di battute che puoi ottenere cambia con il modello.",
    },
    spicy: {
      fit: "Ricordi del personaggio modificabili",
      body: "Puoi iniziare gratuitamente. Con il Memory Manager a pagamento puoi fissare una promessa o correggere un dettaglio che il personaggio continua a sbagliare. La memoria semantica automatica parte da True Supporter. Il primo abbonamento da solo non recupera tutti i dettagli di un racconto lungo.",
    },
    venice: {
      fit: "Chat private con personaggi su misura",
      body: "Con Pro puoi creare e condividere personaggi e inviare richieste di testo standard illimitate. Il piano gratuito ne permette dieci al giorno. I modelli di punta consumano crediti anche su Pro. Controlla quale hai scelto prima di iniziare una scena lunga.",
    },
    nanoGpt: {
      fit: "Un modello da collegare a un’altra app",
      body: "Lo stesso saldo vale sul web e via API. Pro include determinati modelli aperti con una quota settimanale di token in ingresso. Il modello gratuito si usa solo sul web, quindi collegare la tua app di ruolo a NanoGPT comporta un costo.",
    },
    horde: {
      fit: "Scrivere sui computer dei volontari",
      price: "Gratis su AI Horde",
      body: "KoboldAI Lite offre nel browser un editor con diramazioni della trama, appunti sul mondo e un campo per i fatti da ricordare a ogni risposta. I volontari di AI Horde generano il testo. Non servono GPU o abbonamento, ma modelli disponibili e tempi di attesa dipendono da chi è online.",
    },
    kindroid: {
      fit: "Un compagno da chiamare in voce e in video",
      body: "Scegli un passato e una voce per il tuo compagno, poi chiamalo in video. È pensato per un rapporto che continua nel tempo. La normale prova premium di tre giorni richiede un metodo di pagamento e si rinnova se non disdici. La breve anteprima gratuita è un’offerta separata.",
    },
    nomi: {
      fit: "Compagni da ritrovare nel tempo",
      body: "Un compagno Nomi porta i suoi ricordi da una conversazione all’altra. Nelle chat di gruppo i tuoi personaggi possono interagire. Si comincia gratis e ci sono piani a pagamento per un uso più intenso. Il sistema di Nomi si presta poco a provare la stessa scheda con diversi modelli esterni.",
    },
  },
  faq: {
    title: "Domande frequenti",
    free: {
      q: "Dove posso scrivere senza pagare?",
      a: "Character.AI offre chat filtrate illimitate. CrushOn permette chat illimitate sui suoi modelli gratuiti. Con KoboldAI Lite e AI Horde ogni risposta è gratuita, purché tu possa aspettare che si liberi un computer.",
    },
    memory: {
      q: "Come può un personaggio ricordare i capitoli precedenti?",
      a: "Inserisci i fatti che devono restare fermi in un lorebook di Chub o nel campo memoria di KoboldAI Lite. Per una relazione continuativa, prova Nomi. Anche una finestra di contesto ampia può perdere un dettaglio quando esce dal suo raggio.",
    },
    move: {
      q: "Devo abbandonare il mio personaggio Janitor per cambiare modello?",
      a: "No. La guida al proxy di Janitor spiega come collegare un altro fornitore nella chat esistente. Per passare a un altro servizio, controlla i formati di scheda accettati e conserva una copia della descrizione del tuo personaggio e degli appunti di scena.",
    },
  },
  related: {
    character: "Confronta le alternative a Character.AI",
    hub: "Esplora i modelli di IA senza censura",
  },
  cta: {
    title: "Prova una scena in modalità gioco di ruolo",
    start: "Scegli un modello per il gioco di ruolo",
  },
};
