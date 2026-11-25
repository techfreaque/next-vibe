import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Modelli AI abliterati: LLM senza censura da provare online",
  metaTitle: "Modelli AI abliterati senza censura, online | {{appName}}",
  description:
    "Prova LLM abliterati, senza rifiuti, direttamente nel browser, senza GPU e senza registrazione. Confronta contesto e costi e mettili alla prova contro il modello originale.",
  keywords:
    "AI abliterata, modelli abliterati, LLM senza censura, modello AI senza filtri, abliterazione, IA open source senza censura",
  intro:
    "Modelli mainstream a cui sono stati tolti i rifiuti. Scegline uno e la chat si apre con quel modello già selezionato.",
  models: "Modelli abliterati senza censura",
  estimate:
    "Le stime si basano sul fornitore disponibile più economico per ciascun modello e su {{input}} token in ingresso e {{output}} in uscita. Il costo effettivo dipende dal fornitore e dalla durata della conversazione.",
  empty: "Al momento qui non sono disponibili modelli di chat abliterati.",
  context: "Finestra di contesto di {{tokens}} token",
  price: "Circa {{credits}} crediti per scambio",
  chat: "Prova {{model}}",
  compareBase: "Confronta con {{model}}",
  trial: {
    title: "Prova la stessa richiesta in due chat",
    start:
      "Apri una nuova chat per ogni modello. Sostituisci il testo suggerito con la stessa richiesta in entrambe. Se ti serve un'idea, prova questo esercizio di scrittura.",
    prompt:
      "Scrivi una breve scena distopica in cui uno storico discute con un censore di Stato su un libro proibito. Dai a entrambi un argomento credibile e lascia la disputa aperta.",
    compare:
      "Controlla se ciascun modello scrive la scena, ne cambia la premessa o rifiuta. Confronta quanto le risposte rispettano le tue indicazioni.",
  },
  questions: "AI abliterata: domande frequenti",
  faq: {
    meaning: {
      q: "Che cos’è un LLM abliterato?",
      a: "L’ablazione modifica i pesi del modello per indebolire i meccanismi legati ai rifiuti. Il nostro catalogo documenta l’uso di questa tecnica per i modelli elencati qui. Puoi provare ogni modello disponibile nel browser.",
    },
    difference: {
      q: "Che differenza c’è tra un modello abliterato e un’IA davvero senza censura?",
      a: "Un modello abliterato mantiene il suo addestramento e la sua visione del mondo: smette solo di eludere le domande. {{model}} è costruito in modo diverso: addestrato su libri e documenti banditi dall’internet mainstream, con il risultato di opinioni politiche controcorrente.",
    },
    access: {
      q: "Posso provare questi modelli senza un account?",
      a: "Sì. Come ospite puoi usare fino a {{credits}} crediti gratuiti al mese. Prima di usare un modello senza censura, conferma una sola volta di avere almeno 18 anni e di accettare risposte senza filtri.",
    },
    refusals: {
      q: "Un modello abliterato può ancora rifiutare una richiesta?",
      a: "Sì. L'ablazione mira a ridurre i rifiuti. Il risultato dipende comunque dal modello e dalla richiesta. Anche il fornitore può imporre limiti propri.",
    },
    gpu: {
      q: "Serve una GPU per usare i modelli abliterati?",
      a: "No. I modelli girano su provider in hosting, quindi chatti nel browser da qualsiasi dispositivo, telefono compreso. Far girare da te i pesi abliterati richiede una GPU con memoria sufficiente per l’intero modello.",
    },
    quality: {
      q: "L’ablazione peggiora il modello?",
      a: "A volte, di poco. Togliere il meccanismo di rifiuto può costare un po’ di precisione o di aderenza alle istruzioni. Manda lo stesso prompt alla versione abliterata e al modello originale, poi valuta per il tuo compito.",
    },
    api: {
      q: "Posso usare i modelli abliterati via API?",
      a: "Sì. Gli stessi modelli sono disponibili tramite un’API compatibile OpenAI e Anthropic, quindi il tuo SDK attuale funziona. Le chiavi API richiedono un piano a pagamento. I crediti gratuiti e bonus non le sbloccano.",
    },
  },
  guides: "Esplora l'AI senza censura",
  apiGuide: "API LLM senza censura: ID, prezzi e codice",
  allModels: "Vedi tutti i modelli di chat senza censura",
  breadcrumb: "AI abliterata",
  guidesTitle: "Guide sull'ablazione",
  guidesIntro:
    "Come l'ablazione elimina i rifiuti, dove mostra i suoi limiti e quale modello scegliere per ogni compito.",
};
