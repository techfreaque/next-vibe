import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Chat AI con modelli abliterati",
  metaTitle: "Prova in chat i modelli AI abliterati | {{appName}}",
  description:
    "Prova i modelli AI abliterati nel browser. Confronta le finestre di contesto e il costo stimato per scambio, poi apri una chat con il modello che scegli.",
  intro:
    "Prova modelli modificati per rifiutare meno richieste. Scegline uno e apri una chat nel browser con quel modello già selezionato.",
  models: "Modelli disponibili",
  estimate:
    "Le stime si basano sul fornitore disponibile più economico per ciascun modello e su {{input}} token in ingresso e {{output}} in uscita. Il costo effettivo dipende dal fornitore e dalla durata della conversazione.",
  empty: "Al momento qui non sono disponibili modelli di chat abliterati.",
  context: "Finestra di contesto di {{tokens}} token",
  price: "Circa {{credits}} crediti per scambio",
  chat: "Prova {{model}}",
  trial: {
    title: "Prova la stessa richiesta in due chat",
    start:
      "Apri una nuova chat per ogni modello. Sostituisci il testo suggerito con la stessa richiesta in entrambe. Se ti serve un'idea, prova questo esercizio di scrittura.",
    prompt:
      "Scrivi una breve scena distopica in cui uno storico discute con un censore di Stato su un libro proibito. Dai a entrambi un argomento credibile e lascia la disputa aperta.",
    compare:
      "Controlla se ciascun modello scrive la scena, ne cambia la premessa o rifiuta. Confronta quanto le risposte rispettano le tue indicazioni.",
  },
  questions: "Domande frequenti",
  faq: {
    access: {
      q: "Posso provare questi modelli senza un account?",
      a: "Sì. Come ospite hai {{credits}} crediti gratuiti al mese. Prima di usare un modello senza censura, conferma una sola volta di avere almeno 18 anni e di accettare risposte senza filtri.",
    },
    refusals: {
      q: "Un modello abliterato può ancora rifiutare una richiesta?",
      a: "Sì. L'ablazione mira a ridurre i rifiuti. Il risultato dipende comunque dal modello e dalla richiesta. Anche il fornitore può imporre limiti propri.",
    },
  },
  guides: "Esplora l'AI senza censura",
  methodGuide: "Scopri come l'ablazione si distingue dagli altri metodi",
  allModels: "Vedi tutti i modelli di chat senza censura",
};
