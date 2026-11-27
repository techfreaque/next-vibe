import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Collega una banca",
  description:
    "Autorizza la sola lettura. Al ritorno scegli le operazioni aziendali da conservare e controlla la prima importazione in anteprima.",
  company: "Azienda",
  ledgerAccount: "Conto bancario nel libro mastro",
  bankCountry: "Paese della banca",
  bankName: "Nome della banca",
  psu: "Tipo di accesso alla banca",
  personal: "Conto bancario personale",
  business: "Aziendale",
  start: "Avvia l’autorizzazione bancaria",
  ready: "Autorizzazione pronta",
  continueDescription:
    "Verifica la banca e il conto contabile selezionati prima di continuare.",
  starting: "Avvio dell’autorizzazione…",
  authorize: "Continua verso la banca",
  unavailable:
    "Non è stato possibile avviare l’autorizzazione. Controlla la banca e riprova.",
  forbidden: "Non hai accesso a questa azienda e a questo conto bancario.",
  invalidAccount: "Il consenso bancario non è disponibile o è scaduto.",
  expiryTitle: "Il consenso bancario scadrà a breve",
  bankStep: "1 di 4 · Scegli la banca",
  ledgerStep: "2 di 4 · Scegli il conto contabile",
  authorizeStep: "3 di 4 · Autorizza la lettura",
  next: "Scegli il conto contabile",
  back: "Torna alla banca",
  createAccount: "Crea un conto bancario nel piano dei conti",
  noLedger:
    "Questa azienda non ha un conto bancario attivo nel piano dei conti. Creane uno per continuare.",
  search: "Cerca la tua banca",
  noBanks:
    "Nessuna banca corrispondente. Prova un altro nome, paese o tipo di conto.",
  loading: "Caricamento delle banche…",
  unconfigured:
    "Chiedi a chi amministra il server di configurare l’ID applicazione e la chiave di firma di Enable Banking.",
  directoryUnavailable:
    "L’elenco delle banche non è disponibile. Prova a ricaricarlo.",
  retry: "Riprova",
};
