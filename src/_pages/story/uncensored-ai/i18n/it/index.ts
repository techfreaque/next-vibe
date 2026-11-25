import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "AI senza censura: la chat senza filtri nel tuo browser",
  metaTitle: "AI senza censura: chat senza filtri, gratis | {{appName}}",
  description:
    "AI senza censura, senza filtri né registrazione. Modelli abliterati e davvero senza censura nel browser, crediti gratis per gli ospiti. Confronta i costi.",
  keywords:
    "AI senza censura, IA senza censura, intelligenza artificiale senza censura, ChatGPT senza filtri, chat AI senza censura gratis, AI senza filtri, AI senza limiti, AI abliterata",
  intro:
    "Niente registrazione, niente prediche. Scegli un modello di IA senza filtri per la tua domanda o parti dal più economico. Sei tu a decidere cosa leggere.",
  tryModel: "Prova {{model}}",
  chooseModel: "Confronta i modelli",
  choose:
    "Per una domanda breve, parti dai modelli più economici in cima alla lista. Per documenti o conversazioni lunghi, scegli una finestra di contesto più ampia così il modello può elaborare più testo per volta.",
  start:
    "Apri la chat del modello che hai scelto. Quando ti viene chiesto, conferma di avere almeno 18 anni e accetta le condizioni. Poi sostituisci la domanda di esempio con la tua.",
  models: "Modelli di IA senza censura",
  order:
    "I modelli sono in ordine di costo stimato crescente. La stima considera {{input}} token in ingresso e {{output}} in uscita alla tariffa disponibile più bassa. Le conversazioni lunghe possono costare di più.",
  empty:
    "Al momento su questa istanza non sono disponibili modelli di chat senza censura.",
  context: "Finestra di contesto: {{tokens}} token",
  price: "Crediti stimati per scambio: {{credits}}",
  chat: "Chatta con {{model}}",
  questions: "AI senza censura: le domande più frequenti",
  faq: {
    access: {
      q: "Posso usare un’AI senza censura gratis?",
      a: "Come ospite puoi ricevere fino a {{credits}} crediti gratuiti al mese. Il numero di messaggi dipende dal modello e dalla lunghezza della conversazione.",
    },
    outOfCredits: {
      q: "Cosa succede quando esaurisco i crediti da ospite?",
      a: "Puoi aspettare il mese successivo oppure creare un account gratuito e verificare il tuo indirizzo email. Dopo la verifica puoi ricevere fino a {{credits}} crediti gratuiti al mese. I crediti che hai già usato come ospite nello stesso mese contano per quel totale.",
    },
    chatgpt: {
      q: "Esiste ChatGPT senza filtri?",
      a: "No. I modelli GPT di OpenAI mantengono i loro filtri ovunque, anche qui. I prompt di jailbreak reggono solo fino al prossimo aggiornamento. La strada affidabile è un altro modello: scegline uno dalla categoria senza censura e fai la tua domanda direttamente.",
    },
    kinds: {
      q: "Abliterato o davvero senza censura: che differenza c’è?",
      a: "I modelli abliterati sono modelli mainstream a cui sono stati tolti i rifiuti. Stesso addestramento, stessa visione del mondo: rispondono e basta. {{model}} è il vero modello senza censura: addestrato su libri e documenti banditi dall’internet mainstream, con il risultato di opinioni politiche controcorrente. La scheda di ogni modello indica a quale tipo appartiene.",
    },
    filters: {
      q: "Esiste un’IA davvero senza limiti?",
      a: "Qui scegli un modello della categoria senza censura. I modelli più diffusi, come GPT, mantengono i propri filtri. Anche un modello senza censura può rifiutare una richiesta o sbagliare. Verifica tu i fatti importanti.",
    },
    privacy: {
      q: "Le mie chat restano private?",
      a: "Le chat in incognito restano nel tuo browser, non sui nostri server. Il fornitore di AI riceve ogni messaggio per poter rispondere. Nessun tracker di terze parti, nessun pixel pubblicitario. Con un account esporti i tuoi dati in JSON o elimini l’account dalle impostazioni.",
    },
    legal: {
      q: "Un’AI senza censura è legale?",
      a: "Usare un modello che rifiuta meno non è vietato. Quello che fai con le risposte o che pubblichi resta soggetto alle stesse leggi di qualsiasi altro testo. Prima del primo modello senza censura confermi una sola volta di avere almeno 18 anni.",
    },
    local: {
      q: "Mi serve una scheda grafica per usare questi modelli?",
      a: "Bastano un browser e una connessione a internet. Il fornitore elabora la tua domanda. Per eseguire un modello interamente sul tuo computer devi installarlo in locale.",
    },
  },
  guides: "Confronta modelli e piattaforme",
  chatgptGuide: "ChatGPT senza filtri: l’alternativa",
  abliteratedChat: "Prova in chat un modello modificato con l’abliterazione",
  compare: "Confronta le piattaforme di chat AI senza censura",
  benchmark: "Scopri come i modelli rispondono alle stesse domande",
  breadcrumb: "AI senza censura",
  guidesTitle: "Guide: IA senza censura e senza filtri",
  guidesIntro:
    "Quale modello per quale compito, cosa cambia l'ablazione in un modello e come chattare o usare un'API senza GPU né account.",
  comparisons: "Confronti diretti",
  comparisonsIntro:
    "Due modelli per pagina, fianco a fianco. Guarda dove differiscono prima di scegliere.",
  versus: "{{a}} vs {{b}}",
};
